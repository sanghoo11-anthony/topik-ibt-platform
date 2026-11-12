"use client";

import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Globe,
  LayoutGrid,
  Pause,
  Play,
  Send,
  Sparkles,
} from "lucide-react";
import { useExamStore } from "@/store/useExamStore";
import { SUPPORTED_LANGUAGES } from "@/types/exam";

interface ExamHeaderProps {
  onSubmitExam: () => void;
}

export default function ExamHeader({ onSubmitExam }: ExamHeaderProps) {
  const {
    examTitle,
    remainingSeconds,
    isTimerRunning,
    toggleTimer,
    selectedLanguage,
    setLanguage,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    lastSavedAt,
    isSaving,
    isSubmitting,
  } = useExamStore();

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isAnswered = (qid: string) => {
    const ans = answers[qid];
    if (!ans) return false;
    return (
      ans.submitted_option_number !== undefined ||
      Boolean(ans.submitted_text && ans.submitted_text.trim().length > 0)
    );
  };

  const answeredCount = questions.filter((q) => isAnswered(q.question_id)).length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        {/* Left: Exam Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-bold tracking-wide text-blue-700">
                TOPIK II IBT
              </span>
              <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                {examTitle}
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              지문 어절 클릭 시 다국어 사전 팝오버 · 10초 주기 자동 저장 지원
            </p>
          </div>
        </div>

        {/* Right Controls: Native Language Dropdown, Timer, Question Palette, Submit */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Auto-save indicator */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 md:flex">
            <CheckCircle2
              className={`h-3.5 w-3.5 ${
                isSaving ? "animate-spin text-amber-500" : "text-emerald-600"
              }`}
            />
            <span>
              {isSaving
                ? "답안 자동 저장 중..."
                : lastSavedAt
                  ? `자동 저장됨 (${lastSavedAt})`
                  : "10초 자동 저장 대기"}
            </span>
          </div>

          {/* 11-Language Dropdown */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium transition hover:border-blue-300">
            <Globe className="h-4 w-4 text-blue-600" />
            <label htmlFor="native-lang-select" className="sr-only">
              모국어 선택 (Native Language)
            </label>
            <select
              id="native-lang-select"
              value={selectedLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="cursor-pointer bg-transparent text-xs font-semibold text-slate-800 focus:outline-none sm:text-sm"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-sm font-bold ${
              remainingSeconds < 300
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-blue-200 bg-blue-50/80 text-blue-800"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{formattedTime}</span>
            <button
              type="button"
              onClick={toggleTimer}
              title={isTimerRunning ? "타이머 일시정지" : "타이머 재개"}
              className="ml-1 rounded p-0.5 text-blue-600 hover:bg-blue-100"
            >
              {isTimerRunning ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Question Navigation Palette Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPaletteOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:text-sm"
            >
              <LayoutGrid className="h-4 w-4 text-slate-600" />
              <span>
                문항 팔레트 ({answeredCount}/{questions.length})
              </span>
            </button>

            {isPaletteOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800">
                    전체 문항 빠른 이동
                  </span>
                  <span className="text-[11px] text-slate-500">
                    응답 완료 {answeredCount} / 총 {questions.length}문항
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {questions.map((q, idx) => {
                    const active = idx === currentQuestionIndex;
                    const done = isAnswered(q.question_id);
                    return (
                      <button
                        key={q.question_id}
                        type="button"
                        onClick={() => {
                          setCurrentQuestionIndex(idx);
                          setIsPaletteOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-semibold transition ${
                          active
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                            : done
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-sm font-bold">
                          {q.question_number}번
                        </span>
                        <span
                          className={`mt-0.5 text-[10px] ${
                            active
                              ? "text-blue-100"
                              : done
                                ? "text-emerald-600"
                                : "text-slate-400"
                          }`}
                        >
                          {q.section_name === "READING" ? "읽기" : "쓰기"} ·{" "}
                          {done ? "작성됨" : "미작성"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Final Submit & AI Grading Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmitExam}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60 sm:text-sm"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>AI 채점 중...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>최종 제출 및 채점</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
