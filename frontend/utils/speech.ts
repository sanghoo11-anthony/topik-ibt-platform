"use client";

import { NEURAL_AUDIO_KEYS } from "@/utils/neuralAudioManifest";

export const BCP47_VOICE_MAP: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  vi: "vi-VN",
  zh: "zh-CN",
  ja: "ja-JP",
  es: "es-ES",
  fr: "fr-FR",
  ru: "ru-RU",
  id: "id-ID",
  th: "th-TH",
  mn: "mn-MN",
  ar: "ar-SA",
};

const GTTS_LANG_MAP: Record<string, string> = {
  ko: "ko",
  en: "en",
  vi: "vi",
  zh: "zh-CN",
  ja: "ja",
  es: "es",
  fr: "fr",
  ru: "ru",
  id: "id",
  th: "th",
  mn: "mn",
  ar: "ar",
};

export type SpeakerRole = "female" | "male" | "narrator";

export interface DialogueTurn {
  speaker: SpeakerRole;
  label?: string;
  text: string;
}

export interface SpeechPlaybackStatus {
  isPlaying: boolean;
  speaker: SpeakerRole | null;
  label: string | null;
  turnIndex: number | null;
  totalTurns: number;
  text: string | null;
}

const IDLE_STATUS: SpeechPlaybackStatus = {
  isPlaying: false,
  speaker: null,
  label: null,
  turnIndex: null,
  totalTurns: 0,
  text: null,
};

// Minimal valid 44-byte silent WAV Data URI used strictly to unlock iOS/Android media elements on user tap
const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

// Module-level singletons to prevent iOS Safari / WebKit GC and preserve unlocked audio permission
let activeUtterances: SpeechSynthesisUtterance[] = [];
let cachedVoices: SpeechSynthesisVoice[] = [];
let speechEpoch = 0;
let watchdogTimer: ReturnType<typeof setTimeout> | null = null;
let turnPauseTimer: ReturnType<typeof setTimeout> | null = null;
let voicesListenerAttached = false;
let unlockListenersAttached = false;
let isAudioSessionUnlocked = false;
let sharedAudio: HTMLAudioElement | null = null;
const preloadPool: HTMLAudioElement[] = [];
let preloadCursor = 0;
let sharedAudioCtx: AudioContext | null = null;

let currentSpeechStatus: SpeechPlaybackStatus = { ...IDLE_STATUS };
const statusListeners = new Set<(status: SpeechPlaybackStatus) => void>();

function emitSpeechStatus(nextStatus: SpeechPlaybackStatus): void {
  currentSpeechStatus = nextStatus;
  statusListeners.forEach((listener) => {
    try {
      listener(nextStatus);
    } catch {
      // Ignore subscriber callback errors
    }
  });
}

export function subscribeSpeechStatus(
  listener: (status: SpeechPlaybackStatus) => void
): () => void {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

export function getSpeechStatus(): SpeechPlaybackStatus {
  return currentSpeechStatus;
}

function getAudioBasePath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname.startsWith("/topik-ibt-platform")
    ? "/topik-ibt-platform"
    : "";
}

function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod|android|mobile/i.test(navigator.userAgent);
}

function getSharedAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }
  if (!sharedAudio) {
    const audio = document.createElement("audio");
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");
    audio.preload = "auto";
    sharedAudio = audio;
  }
  return sharedAudio;
}

function applyPreservesPitch(audio: HTMLAudioElement): void {
  const pitchAware = audio as HTMLAudioElement & {
    preservesPitch?: boolean;
    webkitPreservesPitch?: boolean;
    mozPreservesPitch?: boolean;
  };
  try {
    pitchAware.preservesPitch = true;
    pitchAware.webkitPreservesPitch = true;
    pitchAware.mozPreservesPitch = true;
  } catch {
    // Ignore unsupported pitch-preservation properties
  }
}

function preloadNeuralAudio(url: string): void {
  if (typeof window === "undefined" || typeof Audio === "undefined") return;
  try {
    if (preloadPool.some((el) => el.getAttribute("src") === url)) {
      return;
    }
    let targetEl: HTMLAudioElement;
    if (preloadPool.length < 4) {
      targetEl = new Audio();
      preloadPool.push(targetEl);
    } else {
      targetEl = preloadPool[preloadCursor % preloadPool.length];
      preloadCursor = (preloadCursor + 1) % preloadPool.length;
    }
    targetEl.preload = "auto";
    targetEl.src = url;
  } catch {
    // Ignore preload errors
  }
}

function preloadNeuralTurns(turns: DialogueTurn[]): void {
  const basePath = getAudioBasePath();
  for (const turn of turns) {
    const key = computeNeuralAudioKey(turn.speaker, turn.text);
    if (NEURAL_AUDIO_KEYS.has(key)) {
      preloadNeuralAudio(`${basePath}/audio/ko/${key}.mp3`);
    }
  }
}

/**
 * Pre-warms all neural MP3 assets for a Korean script/dialogue ahead of user tap
 * so multi-turn conversations play gap-free on mobile cellular networks as well as laptops.
 */
export function preloadDialogueAudio(
  rawText: string,
  langCode: string = "ko"
): void {
  if (typeof window === "undefined" || langCode !== "ko" || !rawText) return;
  const turns = parseDialogueScript(rawText, langCode);
  preloadNeuralTurns(turns);
}

/**
 * Unlocks Web Audio & singleton HTMLAudioElement on the user's first tap/click so
 * both synchronous and watchdog-delayed playback are allowed on iOS Safari & Android Chrome.
 */
export function unlockMobileAudio(): void {
  if (typeof window === "undefined" || isAudioSessionUnlocked) return;

  try {
    const AudioCtxCtor =
      window.AudioContext ||
      (
        window as unknown as {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (AudioCtxCtor) {
      if (!sharedAudioCtx) {
        sharedAudioCtx = new AudioCtxCtor();
      }
      if (sharedAudioCtx.state === "suspended") {
        void sharedAudioCtx.resume().catch(() => undefined);
      }
      const buffer = sharedAudioCtx.createBuffer(1, 1, 22050);
      const source = sharedAudioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(sharedAudioCtx.destination);
      source.start(0);
    }
  } catch {
    // Ignore AudioContext restriction errors
  }

  try {
    const audio = getSharedAudio();
    const currentSrcAttr = audio?.getAttribute("src");
    if (
      audio &&
      (!currentSrcAttr || currentSrcAttr === SILENT_WAV_DATA_URI)
    ) {
      audio.muted = false;
      audio.volume = 0.01;
      audio.src = SILENT_WAV_DATA_URI;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            if (audio.getAttribute("src") === SILENT_WAV_DATA_URI) {
              audio.pause();
            }
            audio.volume = 1.0;
            isAudioSessionUnlocked = true;
          })
          .catch(() => {
            if (audio.getAttribute("src") === SILENT_WAV_DATA_URI) {
              audio.removeAttribute("src");
            }
            audio.volume = 1.0;
          });
      }
    }
  } catch {
    // Ignore audio element unlock errors
  }
}

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const synth = window.speechSynthesis;
  const list = synth.getVoices();
  if (list.length > 0) {
    cachedVoices = list;
  }
  if (!voicesListenerAttached && "addEventListener" in synth) {
    voicesListenerAttached = true;
    synth.addEventListener("voiceschanged", () => {
      const updated = synth.getVoices();
      if (updated.length > 0) {
        cachedVoices = updated;
      }
    });
  } else if (!voicesListenerAttached && "onvoiceschanged" in synth) {
    voicesListenerAttached = true;
    (synth as SpeechSynthesis).onvoiceschanged = () => {
      const updated = synth.getVoices();
      if (updated.length > 0) {
        cachedVoices = updated;
      }
    };
  }
  return cachedVoices.length > 0 ? cachedVoices : list;
}

if (typeof window !== "undefined") {
  if ("speechSynthesis" in window) {
    loadVoices();
  }
  if (!unlockListenersAttached) {
    unlockListenersAttached = true;
    const handleFirstGesture = () => {
      unlockMobileAudio();
      loadVoices();
      if (isAudioSessionUnlocked) {
        window.removeEventListener("touchend", handleFirstGesture);
        window.removeEventListener("click", handleFirstGesture);
        window.removeEventListener("keydown", handleFirstGesture);
      }
    };
    window.addEventListener("touchend", handleFirstGesture, { passive: true });
    window.addEventListener("click", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });
  }
}

export function isSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

/**
 * Strips metadata headers, UI emojis, and normalizes Korean exam notation
 * (e.g., blank symbols, ranges, grammar pattern slashes) so speech flows naturally.
 */
export function cleanTextForNaturalSpeech(
  rawText: string,
  langCode: string = "ko"
): string {
  let cleaned = (rawText || "")
    .replace(/\[듣기 대본[^\]]*\]\s*/g, "")
    .replace(/\[TOPIK[^\]]*\]\s*/g, "")
    .replace(
      /\[(?:듣기|읽기|쓰기|해설|한국어 해설|그래프 유형\s*\d+)[^\]]*\]\s*/g,
      ""
    )
    .replace(/\s*\(음성 재생 버튼을 눌러 들으세요\)\.?/g, "")
    .replace(/[•▪▶✓💡🎙️🔊▶️⏹️📊🎓✍️📌]/g, " ");

  if (langCode === "ko") {
    cleaned = cleaned
      .replace(/\s*\([\u4e00-\u9fff]+\)/g, "")
      .replace(/\[([^\]]+)\]/g, "$1. ")
      .replace(/빈칸\s*\(\s*㉠\s*\)/g, "빈칸 기역")
      .replace(/빈칸\s*\(\s*㉡\s*\)/g, "빈칸 니은")
      .replace(/\(\s*㉠\s*\)/g, "빈칸 기역")
      .replace(/\(\s*㉡\s*\)/g, "빈칸 니은")
      .replace(/㉠/g, "기역")
      .replace(/㉡/g, "니은")
      .replace(
        /(\d+(?:년|월|일|시|분|초|명|원|%|급|번|자)?)\s*~\s*(\d+)/g,
        "$1에서 $2"
      )
      .replace(/~([가-힣])/g, "$1")
      .replace(/\s*→\s*/g, ", ")
      .replace(/\s*>\s*/g, ", ")
      .replace(/…/g, ", ")
      .replace(/·/g, ", ")
      .replace(/-습니다\/-ㅂ니다/g, "습니다")
      .replace(/-았\/었지만/g, "았었지만")
      .replace(/-아\/어야/g, "아야, 어야")
      .replace(/-아\/어요/g, "아요, 어요")
      .replace(/-아\/어/g, "아, 어")
      .replace(/-아서\/어서/g, "아서, 어서")
      .replace(/-\(으\)ㄹ/g, "을")
      .replace(/-\(으\)면/g, "으면")
      .replace(/-\(으\)니까/g, "으니까")
      .replace(/-\(으\)므로/g, "으므로")
      .replace(/-\(으\)([가-힣]+)/g, "으$1")
      .replace(/-다\/는다\/이다/g, "다, 는다, 이다")
      .replace(/-다\/는다/g, "다, 는다")
      .replace(/\s*\/\s*/g, ", ")
      .replace(/(^|[\s'"(])-([가-힣])/g, "$1$2");
  }

  return cleaned
    .replace(/([?!])\s*\./g, "$1")
    .replace(/(?:\s*\.\s*){2,}/g, ". ")
    .replace(/,\s*\./g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

function classifySpeakerLabel(rawLabel: string): {
  speaker: SpeakerRole;
  label: string;
} {
  const normalizedLabel = rawLabel.replace(/\s+/g, "");
  if (normalizedLabel.startsWith("여자") || normalizedLabel.startsWith("여성")) {
    return { speaker: "female", label: normalizedLabel };
  }
  if (normalizedLabel.startsWith("남자") || normalizedLabel.startsWith("남성")) {
    return { speaker: "male", label: normalizedLabel };
  }
  return { speaker: "narrator", label: normalizedLabel || "강연자" };
}

/**
 * Splits a dialogue or lecture script into distinct female, male, and narrator turns
 * without speaking the "여자" / "남자" label tokens aloud.
 */
export function parseDialogueScript(
  rawText: string,
  langCode: string = "ko"
): DialogueTurn[] {
  const strippedRaw = (rawText || "")
    .replace(/\[듣기 대본[^\]]*\]\s*/g, "")
    .replace(/\[TOPIK[^\]]*\]\s*/g, "")
    .replace(
      /\[(?:듣기|읽기|쓰기|해설|한국어 해설|그래프 유형\s*\d+)[^\]]*\]\s*/g,
      ""
    )
    .replace(/\s*\(음성 재생 버튼을 눌러 들으세요\)\.?/g, "")
    .trim();

  if (!strippedRaw) return [];

  const speakerMarkerRegex =
    /(^[ \t]*|[\n\r]+|\s+|[.?!]\s*)(여자\s*\(강연자\)|남자\s*\(강연자\)|여자|여성|남자|남성|강연자)\s*:\s*/g;

  const matches: Array<{
    introEnd: number;
    bodyStart: number;
    rawLabel: string;
  }> = [];

  let match: RegExpExecArray | null;
  while ((match = speakerMarkerRegex.exec(strippedRaw)) !== null) {
    matches.push({
      introEnd: match.index + match[1].length,
      bodyStart: match.index + match[0].length,
      rawLabel: match[2],
    });
  }

  if (matches.length === 0) {
    const cleaned = cleanTextForNaturalSpeech(strippedRaw, langCode);
    return cleaned ? [{ speaker: "narrator", text: cleaned }] : [];
  }

  const turns: DialogueTurn[] = [];
  const introText = cleanTextForNaturalSpeech(
    strippedRaw.slice(0, matches[0].introEnd),
    langCode
  );
  if (introText) {
    turns.push({
      speaker: "narrator",
      label: "문제 안내",
      text: introText,
    });
  }

  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i];
    const nextIntroEnd =
      i + 1 < matches.length ? matches[i + 1].introEnd : strippedRaw.length;
    const bodyText = cleanTextForNaturalSpeech(
      strippedRaw.slice(current.bodyStart, nextIntroEnd),
      langCode
    );
    if (!bodyText) continue;

    const { speaker, label } = classifySpeakerLabel(current.rawLabel);
    turns.push({
      speaker,
      label,
      text: bodyText,
    });
  }

  return turns;
}

/**
 * Computes a deterministic 16-char lowercase hex hash (FNV-1a + DJB2 over UTF-8)
 * matching scripts/generate_neural_audio.py for static neural MP3 lookup.
 */
export function computeNeuralAudioKey(
  speaker: SpeakerRole,
  cleanedText: string
): string {
  const norm = `${speaker}:${cleanedText.replace(/\s+/g, " ").trim()}`;
  const bytes = new TextEncoder().encode(norm);
  let h1 = 0x811c9dc5;
  let h2 = 5381;
  for (let i = 0; i < bytes.length; i += 1) {
    const b = bytes[i];
    h1 ^= b;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 = (Math.imul(h2, 33) ^ b) >>> 0;
  }
  return `${h1.toString(16).padStart(8, "0")}${h2.toString(16).padStart(8, "0")}`;
}

/**
 * Lookbehind-free sentence chunking compatible with all iOS 13–18 and Android WebViews.
 */
function splitTextIntoChunks(text: string, maxLength: number = 140): string[] {
  const normalized = text.replace(/\n+/g, ". ").trim();
  if (!normalized) return [];

  const tokens = normalized.split(/([.?!。？！]+)/);
  const sentences: string[] = [];
  for (let i = 0; i < tokens.length; i += 2) {
    const body = (tokens[i] || "").trim();
    const punct = tokens[i + 1] || "";
    const combined = `${body}${punct}`.trim();
    if (combined) {
      sentences.push(combined);
    }
  }

  if (sentences.length === 0) {
    sentences.push(normalized);
  }

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (sentence.length <= maxLength) {
      if (current && current.length + 1 + sentence.length > maxLength) {
        chunks.push(current);
        current = sentence;
      } else {
        current = current ? `${current} ${sentence}` : sentence;
      }
    } else {
      if (current) {
        chunks.push(current);
        current = "";
      }
      const subParts = sentence.split(/([,;，、])/);
      let sub = "";
      for (let i = 0; i < subParts.length; i += 2) {
        const seg = `${subParts[i] || ""}${subParts[i + 1] || ""}`.trim();
        if (!seg) continue;
        if (seg.length > maxLength) {
          if (sub) {
            chunks.push(sub);
            sub = "";
          }
          for (let k = 0; k < seg.length; k += maxLength) {
            chunks.push(seg.slice(k, k + maxLength));
          }
        } else if (sub && sub.length + 1 + seg.length > maxLength) {
          chunks.push(sub);
          sub = seg;
        } else {
          sub = sub ? `${sub} ${seg}` : seg;
        }
      }
      if (sub) chunks.push(sub);
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length > 0 ? chunks : [normalized.slice(0, maxLength)];
}

const NATURAL_VOICE_REGEX = /natural|neural|online|premium|enhanced|siri|google/i;
const MALE_VOICE_REGEX =
  /injoon|hyunsu|bongjin|gookmin|eddy|reed|daniel|thomas|majed|alex|aaron|male|남성/i;
const FEMALE_VOICE_REGEX =
  /sunhi|jimin|seohyeon|soonbok|yujin|yuna|heami|google 한국의|samantha|kyoko|tingting|linh|sora|female|여성/i;

function findBestVoiceForRole(
  voices: SpeechSynthesisVoice[],
  langCode: string,
  targetBcp47: string,
  role: SpeakerRole
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined;
  const normalizedTarget = targetBcp47.replace(/_/g, "-").toLowerCase();
  const normalizedPrefix = langCode.toLowerCase();
  const mobile = isMobileBrowser();

  const langMatched = voices.filter((v) => {
    const vLang = v.lang.replace(/_/g, "-").toLowerCase();
    return (
      vLang === normalizedTarget ||
      vLang.startsWith(`${normalizedPrefix}-`) ||
      vLang.startsWith(normalizedPrefix)
    );
  });

  if (langMatched.length === 0) return undefined;

  const localMatched = mobile
    ? langMatched.filter((v) => v.localService)
    : langMatched;
  const searchPool = localMatched.length > 0 ? localMatched : mobile ? [] : langMatched;
  if (searchPool.length === 0) return undefined;

  let bestVoice: SpeechSynthesisVoice | undefined;
  let bestScore = -Infinity;

  for (const voice of searchPool) {
    const vLang = voice.lang.replace(/_/g, "-").toLowerCase();
    const label = `${voice.name} ${voice.voiceURI}`;
    let score = 0;

    if (vLang === normalizedTarget) score += 40;
    else if (vLang.startsWith(`${normalizedPrefix}-`)) score += 20;
    else score += 10;

    if (NATURAL_VOICE_REGEX.test(label)) {
      score += 100;
    }

    const isMale = MALE_VOICE_REGEX.test(label);
    const isFemale = FEMALE_VOICE_REGEX.test(label);

    if (role === "male") {
      if (isMale) score += 60;
      else if (isFemale) score -= 40;
    } else if (role === "female") {
      if (isFemale) score += 60;
      else if (isMale) score -= 40;
    } else if (/hyunsu|sunhi|siri|google/i.test(label)) {
      score += 20;
    }

    if (voice.default) score += 5;

    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  }

  return bestVoice;
}

function buildCloudTtsUrls(chunk: string, langCode: string): string[] {
  const tl = GTTS_LANG_MAP[langCode] || "ko";
  const encoded = encodeURIComponent(chunk);
  return [
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${encodeURIComponent(
      tl
    )}&q=${encoded}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
      tl
    )}&q=${encoded}`,
  ];
}

function playCloudAudioFallback(
  text: string,
  langCode: string,
  rate: number,
  expectedEpoch: number,
  onDone: () => void
): void {
  const audio = getSharedAudio();
  if (!audio) {
    onDone();
    return;
  }

  const chunks = splitTextIntoChunks(text, 140);
  let chunkIdx = 0;

  const playNextChunk = () => {
    if (expectedEpoch !== speechEpoch) return;
    if (chunkIdx >= chunks.length) {
      audio.onended = null;
      audio.onerror = null;
      onDone();
      return;
    }

    const urls = buildCloudTtsUrls(chunks[chunkIdx], langCode);
    chunkIdx += 1;
    let urlAttempt = 0;

    const tryCurrentUrl = () => {
      if (expectedEpoch !== speechEpoch) return;
      if (urlAttempt >= urls.length) {
        playNextChunk();
        return;
      }

      const nextUrl = urls[urlAttempt++];
      audio.onended = () => {
        if (expectedEpoch !== speechEpoch) return;
        playNextChunk();
      };
      audio.onerror = () => {
        if (expectedEpoch !== speechEpoch) return;
        tryCurrentUrl();
      };

      try {
        const clamped = Math.max(0.7, Math.min(1.5, rate));
        audio.setAttribute("referrerpolicy", "no-referrer");
        audio.volume = 1.0;
        audio.muted = false;
        audio.src = nextUrl;
        audio.defaultPlaybackRate = clamped;
        audio.playbackRate = clamped;
        applyPreservesPitch(audio);
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(() => {
              audio.playbackRate = clamped;
              applyPreservesPitch(audio);
              isAudioSessionUnlocked = true;
            })
            .catch(() => {
              if (expectedEpoch !== speechEpoch) return;
              tryCurrentUrl();
            });
        }
      } catch {
        tryCurrentUrl();
      }
    };

    tryCurrentUrl();
  };

  playNextChunk();
}

export function stopSpeech(): void {
  speechEpoch += 1;
  if (watchdogTimer) {
    clearTimeout(watchdogTimer);
    watchdogTimer = null;
  }
  if (turnPauseTimer) {
    clearTimeout(turnPauseTimer);
    turnPauseTimer = null;
  }
  activeUtterances = [];

  if (sharedAudio) {
    try {
      sharedAudio.onended = null;
      sharedAudio.onerror = null;
      sharedAudio.pause();
      sharedAudio.currentTime = 0;
    } catch {
      // Ignore audio stop errors
    }
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore browser-specific cancel errors
    }
  }

  emitSpeechStatus({ ...IDLE_STATUS });
}

export function speakMultilingualText(
  text: string,
  langCode: string = "ko",
  rate: number = 1.0,
  onEnd?: () => void
): void {
  if (typeof window === "undefined") {
    onEnd?.();
    return;
  }

  const turns = parseDialogueScript(text, langCode);
  if (turns.length === 0) {
    emitSpeechStatus({ ...IDLE_STATUS });
    onEnd?.();
    return;
  }

  // Advance epoch first so any cancel() side-effect callbacks from a prior utterance are ignored
  speechEpoch += 1;
  const currentEpoch = speechEpoch;

  if (watchdogTimer) {
    clearTimeout(watchdogTimer);
    watchdogTimer = null;
  }
  if (turnPauseTimer) {
    clearTimeout(turnPauseTimer);
    turnPauseTimer = null;
  }
  activeUtterances = [];

  if (sharedAudio) {
    try {
      sharedAudio.onended = null;
      sharedAudio.onerror = null;
      sharedAudio.pause();
    } catch {
      // Ignore
    }
  }

  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch {
      // Ignore synth reset errors
    }
  }

  const clampedRate = Math.max(0.7, Math.min(1.5, rate));
  const targetBcp47 = BCP47_VOICE_MAP[langCode] || "ko-KR";

  if (langCode === "ko" && turns.length > 1) {
    preloadNeuralTurns(turns.slice(1));
  }

  const firstTurnNeuralKey =
    langCode === "ko"
      ? computeNeuralAudioKey(turns[0].speaker, turns[0].text)
      : null;
  const firstTurnUsesNeural =
    firstTurnNeuralKey !== null && NEURAL_AUDIO_KEYS.has(firstTurnNeuralKey);

  // Only unlock silent audio when turn 0 uses browser SpeechSynthesis (so watchdog cloud fallback works on mobile).
  // When turn 0 plays a pre-generated neural MP3, calling audio.play() directly inside the gesture unlocks it cleanly.
  if (!firstTurnUsesNeural && isSpeechSupported()) {
    const initialVoices = loadVoices();
    const hasInitialMatchingLang =
      initialVoices.length === 0 ||
      initialVoices.some((v) =>
        v.lang.replace(/_/g, "-").toLowerCase().startsWith(langCode.toLowerCase())
      );
    if (hasInitialMatchingLang) {
      unlockMobileAudio();
    }
  }

  const finishAll = () => {
    if (currentEpoch !== speechEpoch) return;
    activeUtterances = [];
    emitSpeechStatus({ ...IDLE_STATUS });
    onEnd?.();
  };

  const scheduleNextTurn = (nextIdx: number, prevSpeaker: SpeakerRole) => {
    if (currentEpoch !== speechEpoch) return;
    if (nextIdx >= turns.length) {
      finishAll();
      return;
    }

    const nextTurn = turns[nextIdx];
    let pauseMs = 320;
    if (prevSpeaker === "narrator" && nextTurn.speaker !== "narrator") {
      pauseMs = 620;
    } else if (prevSpeaker !== nextTurn.speaker) {
      pauseMs = 480;
    }

    const delay = Math.round(pauseMs / clampedRate);
    turnPauseTimer = setTimeout(() => {
      turnPauseTimer = null;
      if (currentEpoch !== speechEpoch) return;
      playTurnAt(nextIdx);
    }, delay);
  };

  const playTurnViaSynthesisOrCloud = (turnIdx: number) => {
    if (currentEpoch !== speechEpoch) return;
    const turn = turns[turnIdx];
    const finishTurn = () => scheduleNextTurn(turnIdx + 1, turn.speaker);

    if (!isSpeechSupported()) {
      playCloudAudioFallback(turn.text, langCode, clampedRate, currentEpoch, finishTurn);
      return;
    }

    const voices = loadVoices();
    const hasAnyMatchingLang =
      voices.length === 0 ||
      voices.some((v) =>
        v.lang.replace(/_/g, "-").toLowerCase().startsWith(langCode.toLowerCase())
      );

    if (!hasAnyMatchingLang) {
      playCloudAudioFallback(turn.text, langCode, clampedRate, currentEpoch, finishTurn);
      return;
    }

    const synth = window.speechSynthesis;
    const matchedVoice = findBestVoiceForRole(
      voices,
      langCode,
      targetBcp47,
      turn.speaker
    );
    const maleVoice = findBestVoiceForRole(voices, langCode, targetBcp47, "male");
    const femaleVoice = findBestVoiceForRole(
      voices,
      langCode,
      targetBcp47,
      "female"
    );
    const distinctGenderVoices = Boolean(
      maleVoice && femaleVoice && maleVoice.voiceURI !== femaleVoice.voiceURI
    );

    let pitch = 1.0;
    let rateMultiplier = 1.0;
    if (turn.speaker === "male" && !distinctGenderVoices) {
      pitch = 0.84;
      rateMultiplier = 0.94;
    } else if (turn.speaker === "female" && !distinctGenderVoices) {
      pitch = 1.06;
      rateMultiplier = 1.0;
    } else if (turn.speaker === "narrator") {
      pitch = 1.0;
      rateMultiplier = 0.97;
    }

    const chunks = splitTextIntoChunks(turn.text, 140);
    let fallbackTriggered = false;

    const triggerCloudFallback = () => {
      if (fallbackTriggered || currentEpoch !== speechEpoch) return;
      fallbackTriggered = true;
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
      activeUtterances = [];
      try {
        synth.cancel();
      } catch {
        // Ignore
      }
      playCloudAudioFallback(turn.text, langCode, clampedRate, currentEpoch, finishTurn);
    };

    const speakChunkAt = (chunkIdx: number) => {
      if (fallbackTriggered || currentEpoch !== speechEpoch) return;
      if (chunkIdx >= chunks.length) {
        activeUtterances = [];
        finishTurn();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIdx]);
      utterance.lang = matchedVoice
        ? matchedVoice.lang.replace(/_/g, "-")
        : targetBcp47;
      utterance.rate = Math.min(1.6, Math.max(0.6, clampedRate * rateMultiplier));
      utterance.pitch = pitch;
      utterance.volume = 1.0;
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      let started = false;
      if (turnIdx === 0 && chunkIdx === 0) {
        watchdogTimer = setTimeout(() => {
          if (!started && currentEpoch === speechEpoch) {
            triggerCloudFallback();
          }
        }, 800);
      }

      utterance.onstart = () => {
        started = true;
        if (watchdogTimer) {
          clearTimeout(watchdogTimer);
          watchdogTimer = null;
        }
      };

      utterance.onend = () => {
        if (fallbackTriggered || currentEpoch !== speechEpoch) return;
        if (watchdogTimer) {
          clearTimeout(watchdogTimer);
          watchdogTimer = null;
        }
        if (chunkIdx + 1 < chunks.length) {
          const chunkPause = Math.round(260 / clampedRate);
          turnPauseTimer = setTimeout(() => {
            turnPauseTimer = null;
            speakChunkAt(chunkIdx + 1);
          }, chunkPause);
        } else {
          activeUtterances = [];
          finishTurn();
        }
      };

      utterance.onerror = () => {
        if (fallbackTriggered || currentEpoch !== speechEpoch) return;
        if (!started) {
          triggerCloudFallback();
        } else {
          activeUtterances = [];
          finishTurn();
        }
      };

      activeUtterances.push(utterance);

      try {
        synth.speak(utterance);
      } catch {
        triggerCloudFallback();
      }
    };

    speakChunkAt(0);
  };

  const playTurnAt = (turnIdx: number) => {
    if (currentEpoch !== speechEpoch) return;
    if (turnIdx >= turns.length) {
      finishAll();
      return;
    }

    const turn = turns[turnIdx];
    emitSpeechStatus({
      isPlaying: true,
      speaker: turn.speaker,
      label: turn.label || null,
      turnIndex: turnIdx,
      totalTurns: turns.length,
      text: turn.text,
    });

    const neuralKey =
      langCode === "ko"
        ? computeNeuralAudioKey(turn.speaker, turn.text)
        : null;
    const hasNeuralAudio =
      neuralKey !== null && NEURAL_AUDIO_KEYS.has(neuralKey);

    if (langCode === "ko" && turnIdx + 1 < turns.length) {
      const nextTurn = turns[turnIdx + 1];
      const nextKey = computeNeuralAudioKey(nextTurn.speaker, nextTurn.text);
      if (NEURAL_AUDIO_KEYS.has(nextKey)) {
        preloadNeuralAudio(`${getAudioBasePath()}/audio/ko/${nextKey}.mp3`);
      }
    }

    if (hasNeuralAudio && neuralKey) {
      const audio = getSharedAudio();
      if (!audio) {
        playTurnViaSynthesisOrCloud(turnIdx);
        return;
      }

      const audioUrl = `${getAudioBasePath()}/audio/ko/${neuralKey}.mp3`;
      let handledFailure = false;
      const fallbackForTurn = () => {
        if (handledFailure || currentEpoch !== speechEpoch) return;
        handledFailure = true;
        audio.onended = null;
        audio.onerror = null;
        playTurnViaSynthesisOrCloud(turnIdx);
      };

      audio.onended = () => {
        if (currentEpoch !== speechEpoch) return;
        audio.onended = null;
        audio.onerror = null;
        scheduleNextTurn(turnIdx + 1, turn.speaker);
      };

      audio.onerror = () => {
        fallbackForTurn();
      };

      try {
        audio.setAttribute("referrerpolicy", "no-referrer");
        audio.volume = 1.0;
        audio.muted = false;
        audio.src = audioUrl;
        audio.defaultPlaybackRate = clampedRate;
        audio.playbackRate = clampedRate;
        applyPreservesPitch(audio);
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(() => {
              audio.playbackRate = clampedRate;
              applyPreservesPitch(audio);
              isAudioSessionUnlocked = true;
            })
            .catch(() => {
              fallbackForTurn();
            });
        }
      } catch {
        fallbackForTurn();
      }
      return;
    }

    playTurnViaSynthesisOrCloud(turnIdx);
  };

  playTurnAt(0);
}
