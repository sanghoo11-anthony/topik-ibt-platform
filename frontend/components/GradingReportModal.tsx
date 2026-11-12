"use client";

import React from "react";
import {
  Award,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { useExamStore } from "@/store/useExamStore";
import { SUPPORTED_LANGUAGES } from "@/types/exam";

export default function GradingReportModal() {
  const { report, setReport, selectedLanguage } = useExamStore();

  if (!report) return null;

  const langMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold">
                TOPIK IBT 성적표 및 AI 첨삭 리포트
              </h2>
              <p className="text-xs text-slate-300">
                {report.exam_title} · 해설 언어: {langMeta.flag} {langMeta.label}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReport(null)}
            className="rounded-xl bg-white/10 p-2 text-slate-200 hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Score Summary Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
              <span className="text-xs font-semibold text-indigo-700">
                총점 (Total Score)
              </span>
              <div className="mt-1 text-2xl font-extrabold text-indigo-950">
                {report.total_score}점{" "}
                <span className="text-xs font-normal text-indigo-600">
                  / {report.max_total_score}점
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
              <span className="text-xs font-semibold text-blue-700">
                읽기 영역 (Reading)
              </span>
              <div className="mt-1 text-2xl font-bold text-blue-900">
                {report.reading_score}점
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4">
              <span className="text-xs font-semibold text-purple-700">
                쓰기 영역 (Writing AI)
              </span>
              <div className="mt-1 text-2xl font-bold text-purple-900">
                {report.writing_score}점
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <span className="text-xs font-semibold text-amber-800">
                달성 등급 (Awarded Level)
              </span>
              <div className="mt-1 text-2xl font-extrabold text-amber-900">
                {report.awarded_level > 0
                  ? `${report.awarded_level}급`
                  : "등급 외 (모의 문항)"}
              </div>
            </div>
          </div>

          {/* Per-Question Detailed Review */}
          <div className="space-y-5">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <FileCheck2 className="h-5 w-5 text-blue-600" />
              <span>문항별 정오표 및 Gemini AI 쓰기 첨삭 결과</span>
            </h3>

            {report.questions_review.map((q) => {
              const fb = q.feedback_report;
              const isWriting =
                q.question_type === "ESSAY_SHORT" ||
                q.question_type === "ESSAY_LONG";

              return (
                <div
                  key={q.question_id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                        {q.question_number}번 ({q.section_name})
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
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
                      <div className="flex gap-4 text-xs font-semibold">
                        <span className="text-slate-600">
                          선택한 답안:{" "}
                          <strong className="text-slate-900">
                            {q.submitted_option_number ?? "미선택"}번
                          </strong>
                        </span>
                        <span className="text-emerald-700">
                          정답: <strong>{q.correct_answer_text}번</strong>
                        </span>
                      </div>

                      {q.explanations && (
                        <div className="rounded-xl bg-white p-3.5 text-xs leading-relaxed text-slate-700 shadow-sm">
                          <p className="font-semibold text-slate-900">
                            [해설 ({selectedLanguage.toUpperCase()})]{" "}
                            {q.explanations[selectedLanguage] ||
                              q.explanations.en ||
                              q.explanations.ko}
                          </p>
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
                              /{" "}
                              {fb.criteria_scores.organization_and_structure.max}
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
                              {fb.criteria_scores.vocabulary_and_grammar.earned}{" "}
                              / {fb.criteria_scores.vocabulary_and_grammar.max}점
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
                        <div className="mb-1 flex items-center gap-1.5 font-bold text-indigo-800">
                          <Sparkles className="h-4 w-4" />
                          <span>
                            AI 종합 평가 ({langMeta.flag} {langMeta.label} · 공백 포함{" "}
                            {fb.char_count_with_spaces}자 / 공백 제외{" "}
                            {fb.char_count_without_spaces}자)
                          </span>
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
                                      <span className="line-through text-red-600">
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
      </div>
    </div>
  );
}
