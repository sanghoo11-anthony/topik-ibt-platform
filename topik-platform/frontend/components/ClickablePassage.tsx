"use client";

import React, { useEffect, useRef, useState } from "react";
import { BookMarked, Loader2, Sparkles, Volume2, X } from "lucide-react";
import { useExamStore } from "@/store/useExamStore";
import { SUPPORTED_LANGUAGES, VocabTooltipResponse } from "@/types/exam";
import { speakMultilingualText } from "@/utils/speech";
import { CURATED_VOCAB_ITEMS } from "@/data/studyData";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const CLIENT_FALLBACK_DICT: Record<
  string,
  {
    lemma: string;
    pronunciation: string;
    pos: string;
    grade: string;
    ko: string;
    trans: Record<string, [string, string]>;
  }
> = {
  그러나: {
    lemma: "그러나",
    pronunciation: "그러나",
    pos: "부사",
    grade: "초급",
    ko: "앞의 내용과 상반되는 내용을 이끌 때 쓰는 접속 부사.",
    trans: {
      en: ["however; but", "Conjunctive adverb introducing contrasting content."],
      vi: ["tuy nhiên, nhưng", "Phó từ liên kết dẫn dắt nội dung trái ngược."],
      zh: ["但是，然而", "用于引出与前面内容相反的转折副词。"],
      ja: ["しかし。だが", "前の内容と相反する内容を導く接続副詞。"],
    },
  },
  무조건: {
    lemma: "무조건",
    pronunciation: "무조건",
    pos: "부사",
    grade: "중급",
    ko: "아무런 조건이나 단서가 없이.",
    trans: {
      en: ["unconditionally; blindly", "Without any conditions or provisos."],
      vi: ["vô điều kiện", "Không có bất kỳ điều kiện nào."],
      zh: ["无条件地，盲目地", "没有任何条件或前提。"],
      ja: ["無条件に。むやみに", "何の条件や前提もなしに。"],
    },
  },
  해롭다: {
    lemma: "해롭다",
    pronunciation: "해롭따",
    pos: "형용사",
    grade: "중급",
    ko: "해가 되거나 나쁜 영향을 끼치는 데가 있다.",
    trans: {
      en: ["harmful; detrimental", "Causing harm or having a negative effect."],
      vi: ["có hại", "Gây hại hoặc có ảnh hưởng xấu."],
      zh: ["有害", "造成危害或产生不良影响。"],
      ja: ["有害だ。害になる", "害になったり悪い影響を及ぼしたりする。"],
    },
  },
  면역력: {
    lemma: "면역력",
    pronunciation: "며녕녁",
    pos: "명사",
    grade: "고급",
    ko: "외부에서 들어온 병원균에 저항하는 힘.",
    trans: {
      en: ["immunity", "The power to resist external pathogens."],
      vi: ["sức đề kháng, miễn dịch", "Khả năng chống lại mầm bệnh từ bên ngoài."],
      zh: ["免疫力", "抵抗从外部侵入的病原菌的能力。"],
      ja: ["免疫力", "外部から入った病原菌に抵抗する力。"],
    },
  },
  숙면: {
    lemma: "숙면",
    pronunciation: "숭면",
    pos: "명사",
    grade: "고급",
    ko: "깊이 든 잠.",
    trans: {
      en: ["deep sleep; sound sleep", "A deep, restful sleep."],
      vi: ["giấc ngủ sâu", "Giấc ngủ say và sâu."],
      zh: ["熟睡，酣睡", "深沉的睡眠。"],
      ja: ["熟睡", "深く眠ること。"],
    },
  },
};

interface ClickablePassageProps {
  text: string;
  title?: string;
}

export default function ClickablePassage({ text, title }: ClickablePassageProps) {
  const { selectedLanguage } = useExamStore();
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<VocabTooltipResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [anchorPos, setAnchorPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchTooltip = async (surface: string, lang: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/vocabularies/tooltip?surface=${encodeURIComponent(
          surface
        )}&lang=${encodeURIComponent(lang)}`
      );
      if (!res.ok) throw new Error("Backend tooltip fetch failed");
      const data: VocabTooltipResponse = await res.json();
      setTooltipData(data);
    } catch {
      const cleaned = surface.replace(/^[^\w가-힣]+|[^\w가-힣]+$/g, "");
      const stripped = cleaned.replace(
        /(에서부터|으로부터|이라도|에게서|한테서|에서는|으로는|에서도|까지도|조차도|마저도|에서|에게|한테|으로|부터|까지|조차|마저|처럼|만큼|보다|하고|이나|이라|든지|은|는|이|가|을|를|의|에|로|와|과|도|만)$/,
        ""
      );
      const curatedMatch = CURATED_VOCAB_ITEMS.find(
        (item) =>
          item.lemma === cleaned ||
          item.lemma === stripped ||
          (stripped.length >= 2 && item.lemma.startsWith(stripped))
      );
      const matched = CLIENT_FALLBACK_DICT[cleaned] || CLIENT_FALLBACK_DICT[stripped];
      if (curatedMatch) {
        const pair =
          curatedMatch.translations[lang] || curatedMatch.translations.en;
        setTooltipData({
          clicked_surface: surface,
          lemma: curatedMatch.lemma,
          target_code: "10000",
          pronunciation: curatedMatch.pronunciation,
          part_of_speech: curatedMatch.part_of_speech,
          word_grade: curatedMatch.word_grade,
          is_mock: true,
          senses: [
            {
              sense_order: 1,
              korean_definition: `${curatedMatch.korean_definition} (예: ${curatedMatch.example_ko})`,
              translated_word: pair?.[0] || curatedMatch.lemma,
              translated_definition: pair?.[1] || curatedMatch.korean_definition,
            },
          ],
        });
      } else if (matched) {
        const pair = matched.trans[lang] || matched.trans.en;
        setTooltipData({
          clicked_surface: surface,
          lemma: matched.lemma,
          target_code: "10001",
          pronunciation: matched.pronunciation,
          part_of_speech: matched.pos,
          word_grade: matched.grade,
          is_mock: true,
          senses: [
            {
              sense_order: 1,
              korean_definition: matched.ko,
              translated_word: pair[0],
              translated_definition: pair[1],
            },
          ],
        });
      } else {
        setTooltipData({
          clicked_surface: surface,
          lemma: cleaned || surface,
          target_code: "99999",
          pronunciation: cleaned || surface,
          part_of_speech: "어휘",
          word_grade: "중급",
          is_mock: true,
          senses: [
            {
              sense_order: 1,
              korean_definition: `'${cleaned || surface}'의 한국어기초사전 뜻풀이입니다.`,
              translated_word: `${cleaned || surface} (${lang.toUpperCase()})`,
              translated_definition: `Multilingual dictionary definition for '${
                cleaned || surface
              }' in ${lang.toUpperCase()}.`,
            },
          ],
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when user changes native language while a tooltip is open
  useEffect(() => {
    if (activeToken) {
      fetchTooltip(activeToken, selectedLanguage);
    }
  }, [selectedLanguage]);

  const handleWordClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    token: string
  ) => {
    const cleaned = token.replace(/^\([가-하]\)$/, "").trim();
    if (!cleaned) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    const btnRect = e.currentTarget.getBoundingClientRect();

    if (containerRect) {
      const top = btnRect.bottom - containerRect.top + 8;
      const maxLeft = Math.max(0, containerRect.width - 340);
      const left = Math.min(
        Math.max(0, btnRect.left - containerRect.left),
        maxLeft
      );
      setAnchorPos({ top, left });
    }

    setActiveToken(token);
    fetchTooltip(token, selectedLanguage);
  };

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const lines = text.split("\n");

  return (
    <div ref={containerRef} className="relative">
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
            <Sparkles className="h-3 w-3" />
            어절을 클릭하면 {currentLangMeta.flag} {currentLangMeta.label} 사전이 표시됩니다
          </span>
        </div>
      )}

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-[16px] leading-8 text-slate-800 shadow-inner">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) {
            return <div key={lineIdx} className="h-2" />;
          }
          const tokens = line.split(/\s+/);
          return (
            <p key={lineIdx} className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              {tokens.map((token, tokenIdx) => {
                const isMarker = /^\([가-하]\)$|^\[.*\]$|^-\s*$|^\d+\.$/.test(
                  token
                );
                const isSelected = activeToken === token;
                if (isMarker) {
                  return (
                    <span
                      key={`${lineIdx}-${tokenIdx}`}
                      className="font-bold text-blue-700"
                    >
                      {token}
                    </span>
                  );
                }
                return (
                  <button
                    key={`${lineIdx}-${tokenIdx}`}
                    type="button"
                    onClick={(e) => handleWordClick(e, token)}
                    className={`rounded-md px-1 py-0.5 text-left transition ${
                      isSelected
                        ? "bg-blue-600 font-semibold text-white shadow-sm"
                        : "hover:bg-blue-100/80 hover:text-blue-900"
                    }`}
                  >
                    {token}
                  </button>
                );
              })}
            </p>
          );
        })}
      </div>

      {/* Floating Multilingual Dictionary Tooltip Popover */}
      {activeToken && (
        <div
          style={{ top: anchorPos.top, left: anchorPos.left }}
          className="absolute z-40 w-[330px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl ring-1 ring-black/5 sm:w-[360px]"
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-500">
                국립국어원 한국어기초사전 ({currentLangMeta.flag}{" "}
                {currentLangMeta.code.toUpperCase()})
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveToken(null);
                setTooltipData(null);
              }}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span>형태소 분석 및 다국어 뜻풀이 조회 중...</span>
            </div>
          ) : tooltipData ? (
            <div className="mt-3 space-y-3">
              {/* Word Header: Lemma, Pronunciation, POS, TOPIK Grade */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-slate-900">
                    {tooltipData.lemma}
                  </span>
                  {tooltipData.pronunciation && (
                    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-slate-500">
                      <Volume2 className="h-3 w-3 text-slate-400" />[
                      {tooltipData.pronunciation}]
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {tooltipData.part_of_speech && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {tooltipData.part_of_speech}
                    </span>
                  )}
                  {tooltipData.word_grade && (
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                      TOPIK {tooltipData.word_grade}
                    </span>
                  )}
                </div>
              </div>

              {/* Senses List */}
              <div className="space-y-2.5">
                {tooltipData.senses.map((sense) => (
                  <div
                    key={sense.sense_order}
                    className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed"
                  >
                    {sense.translated_word && (
                      <div className="mb-1 text-sm font-bold text-blue-700">
                        {sense.sense_order}. {sense.translated_word}
                      </div>
                    )}
                    {sense.translated_definition && (
                      <p className="mb-1.5 text-slate-700">
                        {sense.translated_definition}
                      </p>
                    )}
                    <p className="border-t border-slate-200/70 pt-1.5 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600">한국어 뜻:</span>{" "}
                      {sense.korean_definition}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          speakMultilingualText(
                            `${tooltipData.lemma}. ${sense.korean_definition}`,
                            "ko"
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>🇰🇷 한국어 듣기</span>
                      </button>

                      {selectedLanguage !== "ko" && (
                        <button
                          type="button"
                          onClick={() =>
                            speakMultilingualText(
                              `${sense.translated_word || ""}. ${
                                sense.translated_definition || sense.korean_definition
                              }`,
                              selectedLanguage
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                        >
                          <Volume2 className="h-3 w-3" />
                          <span>
                            {currentLangMeta.flag} {currentLangMeta.label} 해설 듣기
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>클릭 어절: &ldquo;{tooltipData.clicked_surface}&rdquo;</span>
                {tooltipData.is_mock && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                    Dev Mock Fallback
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
