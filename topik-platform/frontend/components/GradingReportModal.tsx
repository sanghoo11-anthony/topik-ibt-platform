"use client";

import React from "react";
import {
  Award,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  Volume2,
  X,
  XCircle,
} from "lucide-react";
import { useExamStore } from "@/store/useExamStore";
import { SessionReportResponse, SUPPORTED_LANGUAGES } from "@/types/exam";
import { speakMultilingualText } from "@/utils/speech";

interface ReportContentProps {
  report: SessionReportResponse;
  selectedLanguage: string;
}

export function ReportContent({
  report,
  selectedLanguage,
}: ReportContentProps) {
  const langMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Score Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3.5 sm:p-4">
          <span className="text-xs font-semibold text-indigo-700">
            총점 (Total Score)
          </span>
          <div className="mt-1 text-xl font-extrabold text-indigo-950 sm:text-2xl">
            {report.total_score}점{" "}
            <span className="text-xs font-normal text-indigo-600">
              / {report.max_total_score}점
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 sm:p-4">
          <span className="text-xs font-semibold text-blue-700">
            듣기·읽기 (Listening/Reading)
          </span>
          <div className="mt-1 text-xl font-bold text-blue-900 sm:text-2xl">
            {Math.round((report.listening_score + report.reading_score) * 10) /
              10}
            점
          </div>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-3.5 sm:p-4">
          <span className="text-xs font-semibold text-purple-700">
            쓰기 영역 (Writing AI)
          </span>
          <div className="mt-1 text-xl font-bold text-purple-900 sm:text-2xl">
            {report.writing_score}점
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 sm:p-4">
          <span className="text-xs font-semibold text-amber-800">
            달성 등급 (Awarded Level)
          </span>
          <div className="mt-1 text-xl font-extrabold text-amber-900 sm:text-2xl">
            {report.awarded_level > 0
              ? `${report.awarded_level}급`
              : "등급 외 (모의 문항)"}
          </div>
        </div>
      </div>

      {/* Per-Question Detailed Review */}
      <div className="space-y-4 sm:space-y-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 sm:text-base">
          <FileCheck2 className="h-5 w-5 text-blue-600" />
          <span>문항별 정오표 및 Gemini AI 쓰기 첨삭 결과</span>
        </h3>

        {report.questions_review.map((q) => {
          const fb = q.feedback_report;
          const isWriting =
            q.question_type === "ESSAY_SHORT" ||
            q.question_type === "ESSAY_LONG" ||
            q.question_type === "SHORT_ANSWER";

          return (
            <div
              key={q.question_id}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                    {q.question_number}번 ({q.section_name})
                  </span>
                  <span className="text-xs font-semibold text-slate-800 sm:text-sm">
                    {q.prompt_text}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {q.is_correct ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {isWriting ? "우수 답안" : "정답"} ({q.earned_score} /{" "}
                      {q.score_points}점)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      <XCircle className="h-3.5 w-3.5" />
                      득점 {q.earned_score} / {q.score_points}점
                    </span>
                  )}
                </div>
              </div>

              {/* Multiple Choice Explanation */}
              {!isWriting && (
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex flex-wrap gap-4 text-xs font-semibold">
                    <span className="text-slate-600">
                      선택한 답안:{" "}
                      <strong className="text-slate-900">
                        {q.submitted_option_number != null
                          ? `${q.submitted_option_number}번`
                          : "미선택"}
                      </strong>
                    </span>
                    <span className="text-emerald-700">
                      정답: <strong>{q.correct_answer_text}번</strong>
                    </span>
                  </div>

                  {q.explanations && (
                    <div className="rounded-xl bg-white p-3.5 text-xs leading-relaxed text-slate-700 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          [해설 ({selectedLanguage.toUpperCase()})]{" "}
                          {q.explanations[selectedLanguage] ||
                            q.explanations.en ||
                            q.explanations.ko}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            speakMultilingualText(
                              q.explanations?.[selectedLanguage] ||
                                q.explanations?.en ||
                                q.explanations?.ko ||
                                "",
                              selectedLanguage
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>
                            {langMeta.flag} {langMeta.label} 해설 듣기
                          </span>
                        </button>
                      </div>
                      {q.explanations.ko && selectedLanguage !== "ko" && (
                        <p className="mt-1 text-slate-500">
                          [한국어 해설] {q.explanations.ko}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Writing Essay Rubric & AI Feedback Report */}
              {isWriting && fb && (
                <div className="mt-4 space-y-4">
                  {/* 3 Official TOPIK Writing Criteria Scores */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>1. 내용 및 과제 수행</span>
                        <span className="text-blue-600">
                          {fb.criteria_scores.content_and_task.earned} /{" "}
                          {fb.criteria_scores.content_and_task.max}점
                        </span>
                      </div>
                      {fb.criteria_scores.content_and_task.comment && (
                        <p className="mt-1 text-[11px] text-slate-500">
                          {fb.criteria_scores.content_and_task.comment}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>2. 글의 전개 구조</span>
                        <span className="text-blue-600">
                          {
                            fb.criteria_scores.organization_and_structure
                              .earned
                          }{" "}
                          / {fb.criteria_scores.organization_and_structure.max}
                          점
                        </span>
                      </div>
                      {fb.criteria_scores.organization_and_structure
                        .comment && (
                        <p className="mt-1 text-[11px] text-slate-500">
                          {
                            fb.criteria_scores.organization_and_structure
                              .comment
                          }
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>3. 한국어 어휘 및 문법</span>
                        <span className="text-blue-600">
                          {fb.criteria_scores.vocabulary_and_grammar.earned} /{" "}
                          {fb.criteria_scores.vocabulary_and_grammar.max}점
                        </span>
                      </div>
                      {fb.criteria_scores.vocabulary_and_grammar.comment && (
                        <p className="mt-1 text-[11px] text-slate-500">
                          {fb.criteria_scores.vocabulary_and_grammar.comment}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Overall Native Language Feedback */}
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs leading-relaxed text-indigo-950">
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 font-bold text-indigo-800">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 shrink-0" />
                        <span>
                          AI 종합 평가 ({langMeta.flag} {langMeta.label} · 공백 포함{" "}
                          {fb.char_count_with_spaces}자 / 공백 제외{" "}
                          {fb.char_count_without_spaces}자)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          speakMultilingualText(
                            `${fb.overall_feedback} ${fb.model_answer_comparison || ""}`,
                            selectedLanguage
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-700"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{langMeta.flag} AI 첨삭 해설 듣기</span>
                      </button>
                    </div>
                    <p>{fb.overall_feedback}</p>
                    {fb.model_answer_comparison && (
                      <p className="mt-1.5 font-medium text-indigo-900">
                        💡 {fb.model_answer_comparison}
                      </p>
                    )}
                  </div>

                  {/* Spelling & Style Corrections */}
                  {fb.spelling_and_grammar_corrections &&
                    fb.spelling_and_grammar_corrections.length > 0 && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                        <div className="mb-2 text-xs font-bold text-amber-900">
                          맞춤법 · 띄어쓰기 · 문어체 교정 내역
                        </div>
                        <div className="space-y-2">
                          {fb.spelling_and_grammar_corrections.map(
                            (item, idx) => (
                              <div
                                key={idx}
                                className="rounded-lg bg-white p-2.5 text-xs shadow-sm"
                              >
                                <div className="flex flex-wrap items-center gap-2 font-semibold">
                                  <span className="text-red-600 line-through">
                                    {item.original}
                                  </span>
                                  <span className="text-slate-400">→</span>
                                  <span className="text-emerald-700">
                                    {item.corrected}
                                  </span>
                                </div>
                                <p className="mt-1 text-[11px] text-slate-600">
                                  {item.explanation}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Submitted Answer vs Model Answer Comparison */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                      <div className="mb-1.5 text-xs font-bold text-slate-600">
                        수험생 작성 답안
                      </div>
                      <p className="whitespace-pre-wrap text-xs leading-6 text-slate-800">
                        {q.submitted_text || "(미작성)"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5">
                      <div className="mb-1.5 text-xs font-bold text-emerald-800">
                        TOPIK II 만점 모범 답안
                      </div>
                      <p className="whitespace-pre-wrap text-xs leading-6 text-slate-800">
                        {fb.model_answer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GradingReportModal() {
  const {
    report,
    isReportModalOpen,
    setReportModalOpen,
    selectedLanguage,
  } = useExamStore();

  if (!report || !isReportModalOpen) return null;

  const langMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div
      onClick={() => setReportModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 backdrop-blur-sm sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-900 px-4 py-3 text-white sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Award className="h-5 w-5 shrink-0 text-amber-400 sm:h-6 sm:w-6" />
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold sm:text-lg">
                TOPIK IBT 성적표 및 AI 첨삭 리포트
              </h2>
              <p className="truncate text-[11px] text-slate-300 sm:text-xs">
                {report.exam_title} · {langMeta.flag} {langMeta.label}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="리포트 팝업 닫기"
            onClick={() => setReportModalOpen(false)}
            className="shrink-0 rounded-xl bg-white/10 p-2 text-slate-200 hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <ReportContent report={report} selectedLanguage={selectedLanguage} />
        </div>
      </div>
    </div>
  );
}
