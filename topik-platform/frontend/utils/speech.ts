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

export function stopSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakMultilingualText(
  text: string,
  langCode: string = "ko",
  rate: number = 1.0,
  onEnd?: () => void
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const cleanedText = text
    .replace(/^\[.*?\]\s*/gm, "")
    .replace(/여자(\(강연자\))?:/g, "")
    .replace(/남자:/g, "")
    .trim();

  if (!cleanedText) {
    onEnd?.();
    return;
  }

  const targetBcp47 = BCP47_VOICE_MAP[langCode] || "ko-KR";
  const utterance = new SpeechSynthesisUtterance(cleanedText);
  utterance.lang = targetBcp47;
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const exactMatch = voices.find(
      (v) => v.lang.toLowerCase() === targetBcp47.toLowerCase()
    );
    const prefixMatch = voices.find((v) =>
      v.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );
    if (exactMatch) {
      utterance.voice = exactMatch;
    } else if (prefixMatch) {
      utterance.voice = prefixMatch;
    }
  }

  utterance.onend = () => {
    onEnd?.();
  };
  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}
