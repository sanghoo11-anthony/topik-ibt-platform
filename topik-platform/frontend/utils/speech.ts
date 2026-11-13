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

// Prevent garbage collection of active utterances/audio in Chrome & Safari
let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeAudio: HTMLAudioElement | null = null;
let activeTimer: ReturnType<typeof setTimeout> | null = null;
let isCancelled = false;

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export function stopSpeech(): void {
  isCancelled = true;
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.src = "";
    } catch {
      // ignore
    }
    activeAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  activeUtterance = null;
}

function splitTextIntoChunks(text: string, maxLen: number = 140): string[] {
  const sentences = text
    .replace(/\n+/g, ". ")
    .split(/(?<=[.?!。？！])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const s of sentences) {
    if (s.length <= maxLen) {
      chunks.push(s);
    } else {
      for (let i = 0; i < s.length; i += maxLen) {
        chunks.push(s.slice(i, i + maxLen));
      }
    }
  }
  return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
}

function playCloudAudioFallback(
  text: string,
  langCode: string,
  rate: number,
  onEnd?: () => void
): void {
  const tl = GTTS_LANG_MAP[langCode] || "ko";
  const chunks = splitTextIntoChunks(text, 140);
  let currentIdx = 0;

  const playNextChunk = () => {
    if (isCancelled || currentIdx >= chunks.length) {
      onEnd?.();
      return;
    }
    const chunk = chunks[currentIdx++];
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
      tl
    )}&q=${encodeURIComponent(chunk)}`;

    const audio = document.createElement("audio");
    audio.setAttribute("referrerpolicy", "no-referrer");
    audio.src = url;
    activeAudio = audio;
    audio.playbackRate = Math.max(0.7, Math.min(1.5, rate));
    audio.onended = () => {
      playNextChunk();
    };
    audio.onerror = () => {
      onEnd?.();
    };
    audio.play().catch(() => {
      onEnd?.();
    });
  };

  playNextChunk();
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

  stopSpeech();
  isCancelled = false;

  const cleanedText = text
    .replace(/^\[.*?\]\s*/gm, "")
    .replace(/여자(\(강연자\))?:/g, "여자. ")
    .replace(/남자:/g, "남자. ")
    .replace(/[•▪▶]/g, " ")
    .trim();

  if (!cleanedText) {
    onEnd?.();
    return;
  }

  const targetBcp47 = BCP47_VOICE_MAP[langCode] || "ko-KR";

  // Delay slightly after cancel() to prevent Chromium/WebKit race condition
  activeTimer = setTimeout(() => {
    if (isCancelled) return;

    if (!("speechSynthesis" in window)) {
      playCloudAudioFallback(cleanedText, langCode, rate, onEnd);
      return;
    }

    try {
      window.speechSynthesis.resume();
    } catch {
      // ignore
    }

    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    activeUtterance = utterance;
    utterance.lang = targetBcp47;
    utterance.rate = Math.max(0.7, Math.min(1.5, rate));
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (voices.length > 0) {
      const exactMatch = voices.find(
        (v) => v.lang.replace("_", "-").toLowerCase() === targetBcp47.toLowerCase()
      );
      const prefixMatch = voices.find((v) =>
        v.lang.toLowerCase().startsWith(langCode.toLowerCase())
      );
      const chosenVoice = exactMatch || prefixMatch;
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    }

    let started = false;
    let finished = false;

    const fallbackWatchdog = setTimeout(() => {
      if (!started && !finished && !isCancelled) {
        finished = true;
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
        playCloudAudioFallback(cleanedText, langCode, rate, onEnd);
      }
    }, 650);

    utterance.onstart = () => {
      started = true;
      clearTimeout(fallbackWatchdog);
    };

    utterance.onend = () => {
      if (finished) return;
      finished = true;
      clearTimeout(fallbackWatchdog);
      activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      if (finished) return;
      finished = true;
      clearTimeout(fallbackWatchdog);
      activeUtterance = null;
      if (!isCancelled) {
        playCloudAudioFallback(cleanedText, langCode, rate, onEnd);
      } else {
        onEnd?.();
      }
    };

    window.speechSynthesis.speak(utterance);
  }, 80);
}
