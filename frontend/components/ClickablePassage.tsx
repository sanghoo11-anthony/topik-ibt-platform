"use client";

import React, { useEffect, useRef, useState } from "react";
import { BookMarked, Loader2, Sparkles, Volume2, X } from "lucide-react";
import { useExamStore } from "@/store/useExamStore";
import { SUPPORTED_LANGUAGES, VocabTooltipResponse } from "@/types/exam";
import { speakMultilingualText } from "@/utils/speech";
import { analyzeAndLookupWord } from "@/utils/dictionary";
import {
  API_BASE_URL,
  fetchWithTimeout,
  shouldUseBackendApi,
} from "@/utils/grading";

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
      if (shouldUseBackendApi()) {
        const res = await fetchWithTimeout(
          `${API_BASE_URL}/api/v1/vocabularies/tooltip?surface=${encodeURIComponent(
            surface
          )}&lang=${encodeURIComponent(lang)}`,
          {},
          1500
        );
        if (res.ok) {
          const data: VocabTooltipResponse = await res.json();
          setTooltipData(data);
          return;
        }
      }
      setTooltipData(analyzeAndLookupWord(surface, lang));
    } catch {
      setTooltipData(analyzeAndLookupWord(surface, lang));
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when user changes native language while a tooltip is open
  useEffect(() => {
    if (activeToken) {
      fetchTooltip(activeToken, selectedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const maxLeft = Math.max(0, containerRect.width - 360);
      const left = Math.min(
        Math.max(0, btnRect.left - containerRect.left),
        maxLeft
      );
      setAnchorPos({ top, left });
    }

    setActiveToken(token);
    fetchTooltip(token, selectedLanguage);
  };

  const closeTooltip = () => {
    setActiveToken(null);
    setTooltipData(null);
  };

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const lines = text.split("\n");

  return (
    <div ref={containerRef} className="relative">
      {title && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>
              어절을 탭/클릭하면 {currentLangMeta.flag} {currentLangMeta.label} 사전 표시
            </span>
          </span>
        </div>
      )}

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-[15px] leading-8 text-slate-800 shadow-inner sm:p-5 sm:text-[16px]">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) {
            return <div key={lineIdx} className="h-2" />;
          }
          const tokens = line.split(/\s+/);
          return (
            <p
              key={lineIdx}
              className="flex flex-wrap items-baseline gap-x-1 gap-y-1 sm:gap-x-1.5"
            >
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
                    className={`rounded-md px-1.5 py-1 text-left text-[15px] transition sm:px-1 sm:py-0.5 sm:text-[16px] ${
                      isSelected
                        ? "bg-blue-600 font-semibold text-white shadow-sm"
                        : "hover:bg-blue-100/80 hover:text-blue-900 active:bg-blue-200"
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

      {/* Mobile backdrop for bottom-sheet dictionary tooltip */}
      {activeToken && (
        <div
          aria-hidden="true"
          onClick={closeTooltip}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px] sm:hidden"
        />
      )}

      {/* Responsive Dictionary Tooltip: Bottom Sheet on Mobile, Popover on Tablet/Desktop */}
      {activeToken && (
        <div
          style={
            {
              "--popover-top": `${anchorPos.top}px`,
              "--popover-left": `${anchorPos.left}px`,
            } as React.CSSProperties
          }
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 max-h-[75dvh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl ring-1 ring-black/5 sm:absolute sm:inset-auto sm:left-[var(--popover-left)] sm:top-[var(--popover-top)] sm:z-40 sm:max-h-none sm:w-[360px]"
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="text-xs font-semibold text-slate-500">
                국립국어원 한국어기초사전 ({currentLangMeta.flag}{" "}
                {currentLangMeta.code.toUpperCase()})
              </span>
            </div>
            <button
              type="button"
              aria-label="사전 창 닫기"
              onClick={closeTooltip}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
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
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
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
                    형태소 기본형 분석
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
