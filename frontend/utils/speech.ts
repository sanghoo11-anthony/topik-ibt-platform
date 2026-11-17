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

// Keep module-level references to active utterances so iOS Safari / WebKit
// does not garbage-collect utterances mid-speech.
let activeUtterances: SpeechSynthesisUtterance[] = [];
let cachedVoices: SpeechSynthesisVoice[] = [];
let speechEpoch = 0;
let pendingTimer: ReturnType<typeof setTimeout> | null = null;
let voicesListenerAttached = false;

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
    synth.onvoiceschanged = () => {
      const updated = synth.getVoices();
      if (updated.length > 0) {
        cachedVoices = updated;
      }
    };
  }
  return cachedVoices.length > 0 ? cachedVoices : list;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
}

export function isSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

function splitTextIntoChunks(text: string, maxLength: number = 160): string[] {
  const sentences = text
    .split(/(?<=[.?!。\n])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return [text];
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
      // Break overly long sentences by commas/spaces
      const parts = sentence.split(/(?<=[,;，、])\s+/);
      let sub = "";
      for (const part of parts) {
        if (sub && sub.length + 1 + part.length > maxLength) {
          chunks.push(sub);
          sub = part;
        } else if (part.length > maxLength) {
          if (sub) {
            chunks.push(sub);
            sub = "";
          }
          for (let i = 0; i < part.length; i += maxLength) {
            chunks.push(part.slice(i, i + maxLength));
          }
        } else {
          sub = sub ? `${sub} ${part}` : part;
        }
      }
      if (sub) chunks.push(sub);
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function findBestVoice(
  voices: SpeechSynthesisVoice[],
  langCode: string,
  targetBcp47: string
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined;
  const normalizedTarget = targetBcp47.replace(/_/g, "-").toLowerCase();
  const normalizedPrefix = langCode.toLowerCase();

  return (
    voices.find(
      (v) => v.lang.replace(/_/g, "-").toLowerCase() === normalizedTarget
    ) ||
    voices.find((v) =>
      v.lang.replace(/_/g, "-").toLowerCase().startsWith(`${normalizedPrefix}-`)
    ) ||
    voices.find((v) =>
      v.lang.replace(/_/g, "-").toLowerCase().startsWith(normalizedPrefix)
    )
  );
}

export function stopSpeech(): void {
  speechEpoch += 1;
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  activeUtterances = [];
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
  if (!isSpeechSupported()) {
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

  const synth = window.speechSynthesis;
  const wasBusy = synth.speaking || synth.pending;

  speechEpoch += 1;
  const currentEpoch = speechEpoch;
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  activeUtterances = [];

  if (wasBusy) {
    try {
      synth.cancel();
    } catch {
      // Ignore
    }
  }
  if (synth.paused) {
    try {
      synth.resume();
    } catch {
      // Ignore
    }
  }

  const startSpeaking = () => {
    if (currentEpoch !== speechEpoch) return;

    const targetBcp47 = BCP47_VOICE_MAP[langCode] || "ko-KR";
    const voices = loadVoices();
    const matchedVoice = findBestVoice(voices, langCode, targetBcp47);
    const chunks = splitTextIntoChunks(cleanedText, 160);

    const speakChunkAt = (index: number) => {
      if (currentEpoch !== speechEpoch) return;
      if (index >= chunks.length) {
        activeUtterances = [];
        onEnd?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = matchedVoice
        ? matchedVoice.lang.replace(/_/g, "-")
        : targetBcp47;
      utterance.rate = Math.min(2.0, Math.max(0.5, rate));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        if (currentEpoch !== speechEpoch) return;
        if (index + 1 < chunks.length) {
          speakChunkAt(index + 1);
        } else {
          activeUtterances = [];
          onEnd?.();
        }
      };

      utterance.onerror = () => {
        if (currentEpoch !== speechEpoch) return;
        activeUtterances = [];
        onEnd?.();
      };

      activeUtterances.push(utterance);

      try {
        synth.speak(utterance);
      } catch {
        activeUtterances = [];
        onEnd?.();
      }
    };

    speakChunkAt(0);
  };

  // Only delay slightly when cancelling an active utterance so Android/iOS
  // engines don't drop the new utterance; otherwise invoke synchronously
  // to preserve iOS Safari user-gesture audio unlock.
  if (wasBusy) {
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      startSpeaking();
    }, 50);
  } else {
    startSpeaking();
  }
}
