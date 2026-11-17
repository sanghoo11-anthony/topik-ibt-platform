"use client";

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

// Minimal valid 44-byte silent WAV Data URI used strictly to unlock iOS/Android media elements on user tap
const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

// Module-level singletons to prevent iOS Safari / WebKit GC and preserve unlocked audio permission
let activeUtterances: SpeechSynthesisUtterance[] = [];
let cachedVoices: SpeechSynthesisVoice[] = [];
let speechEpoch = 0;
let watchdogTimer: ReturnType<typeof setTimeout> | null = null;
let voicesListenerAttached = false;
let unlockListenersAttached = false;
let isAudioSessionUnlocked = false;
let sharedAudio: HTMLAudioElement | null = null;
let sharedAudioCtx: AudioContext | null = null;

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
    if (audio && !audio.src) {
      audio.muted = false;
      audio.volume = 0.01;
      audio.src = SILENT_WAV_DATA_URI;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            if (audio.src === SILENT_WAV_DATA_URI) {
              audio.pause();
            }
            audio.volume = 1.0;
            isAudioSessionUnlocked = true;
          })
          .catch(() => {
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
        window.removeEventListener("touchstart", handleFirstGesture);
        window.removeEventListener("pointerdown", handleFirstGesture);
        window.removeEventListener("click", handleFirstGesture);
        window.removeEventListener("keydown", handleFirstGesture);
      }
    };
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("pointerdown", handleFirstGesture, {
      passive: true,
    });
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

function findBestVoice(
  voices: SpeechSynthesisVoice[],
  langCode: string,
  targetBcp47: string
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined;
  const normalizedTarget = targetBcp47.replace(/_/g, "-").toLowerCase();
  const normalizedPrefix = langCode.toLowerCase();
  const mobile = isMobileBrowser();

  // On Android/iOS, assigning a remote network voice frequently fails silently;
  // prefer verified localService voices on mobile, or let utterance.lang select OS default.
  const pool = mobile ? voices.filter((v) => v.localService) : voices;
  const searchPool = pool.length > 0 ? pool : mobile ? [] : voices;

  return (
    searchPool.find(
      (v) => v.lang.replace(/_/g, "-").toLowerCase() === normalizedTarget
    ) ||
    searchPool.find((v) =>
      v.lang.replace(/_/g, "-").toLowerCase().startsWith(`${normalizedPrefix}-`)
    ) ||
    searchPool.find((v) =>
      v.lang.replace(/_/g, "-").toLowerCase().startsWith(normalizedPrefix)
    )
  );
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
  onEnd?: () => void
): void {
  const audio = getSharedAudio();
  if (!audio) {
    onEnd?.();
    return;
  }

  const chunks = splitTextIntoChunks(text, 140);
  let chunkIdx = 0;

  const playNextChunk = () => {
    if (expectedEpoch !== speechEpoch) return;
    if (chunkIdx >= chunks.length) {
      audio.onended = null;
      audio.onerror = null;
      onEnd?.();
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
        audio.setAttribute("referrerpolicy", "no-referrer");
        audio.volume = 1.0;
        audio.muted = false;
        audio.playbackRate = Math.max(0.7, Math.min(1.5, rate));
        audio.src = nextUrl;
        audio.load();
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
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
  activeUtterances = [];

  if (sharedAudio) {
    try {
      sharedAudio.onended = null;
      sharedAudio.onerror = null;
      sharedAudio.pause();
      sharedAudio.removeAttribute("src");
      sharedAudio.load();
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

  const cleanedText = text
    .replace(/^\[.*?\]\s*/gm, "")
    .replace(/[•▪▶]/g, " ")
    .replace(/여자(\(강연자\))?:/g, "여자. ")
    .replace(/남자:/g, "남자. ")
    .trim();

  if (!cleanedText) {
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

  // If browser SpeechSynthesis is unavailable (e.g. mobile WebViews), use unlocked <audio> immediately
  if (!isSpeechSupported()) {
    playCloudAudioFallback(cleanedText, langCode, rate, currentEpoch, onEnd);
    return;
  }

  const targetBcp47 = BCP47_VOICE_MAP[langCode] || "ko-KR";
  const voices = loadVoices();
  const matchedVoice = findBestVoice(voices, langCode, targetBcp47);
  const chunks = splitTextIntoChunks(cleanedText, 140);

  // If voices exist on desktop/mobile and ZERO voices match the language (e.g., Mongolian/Vietnamese),
  // directly play cloud TTS cleanly inside the user gesture without touching silent unlock audio.
  const hasAnyMatchingLang =
    voices.length === 0 ||
    voices.some((v) =>
      v.lang.replace(/_/g, "-").toLowerCase().startsWith(langCode.toLowerCase())
    );

  if (!hasAnyMatchingLang) {
    playCloudAudioFallback(cleanedText, langCode, rate, currentEpoch, onEnd);
    return;
  }

  // Unlock media fallback cleanly inside the synchronous user gesture before speech starts
  unlockMobileAudio();

  const synth = window.speechSynthesis;
  try {
    synth.cancel();
    synth.resume();
  } catch {
    // Ignore synth reset errors
  }

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
    playCloudAudioFallback(cleanedText, langCode, rate, currentEpoch, onEnd);
  };

  const speakChunkAt = (index: number) => {
    if (fallbackTriggered || currentEpoch !== speechEpoch) return;
    if (index >= chunks.length) {
      activeUtterances = [];
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = matchedVoice
      ? matchedVoice.lang.replace(/_/g, "-")
      : targetBcp47;
    utterance.rate = Math.min(1.6, Math.max(0.6, rate));
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    let started = false;
    if (index === 0) {
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
      if (index + 1 < chunks.length) {
        speakChunkAt(index + 1);
      } else {
        activeUtterances = [];
        onEnd?.();
      }
    };

    utterance.onerror = () => {
      if (fallbackTriggered || currentEpoch !== speechEpoch) return;
      if (!started) {
        triggerCloudFallback();
      } else {
        activeUtterances = [];
        onEnd?.();
      }
    };

    activeUtterances.push(utterance);

    try {
      // Keep invocation synchronous in the tap handler to preserve iOS Safari audio permission
      synth.speak(utterance);
    } catch {
      triggerCloudFallback();
    }
  };

  speakChunkAt(0);
}
