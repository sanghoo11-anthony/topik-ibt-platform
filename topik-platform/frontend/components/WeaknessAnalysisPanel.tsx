"use client";

import React from "react";
import {
  Activity,
  AlertTriangle,
  Clock,
  RefreshCw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { FeedbackReportResponse } from "@/types/database";
import { QuestionItem } from "@/types/exam";
import { QUESTION_TYPE_LABELS } from "@/utils/grading";

interface WeaknessAnalysisPanelProps {
  isAnalyzing: boolean;
  analysisReport: FeedbackReportResponse | null;
  selectedLanguage: string;
  questionTimeSpent: Record<string, number>;
  questions: QuestionItem[];
  onRegenerate: () => void;
  onStartWeaknessDrill: (questionIds: string[]) => void;
}

function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-extrabold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function SimpleMarkdownView({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
      {lines.map((raw, idx) => {
        const line = raw.trim();
        if (!line) return <div key={idx} className="h-1" />;
        if (line.startsWith("### ") || line.startsWith("## ")) {
          return (
            <h4
              key={idx}
              className="pt-2 text-sm font-extrabold text-indigo-950 sm:text-base"
            >
              {line.replace(/^#{2,3}\s+/, "")}
            </h4>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              <p className="flex-1">{renderInlineBold(line.slice(2))}</p>
            </div>
          );
        }
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineBold(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function WeaknessAnalysisPanel({
  isAnalyzing,
  analysisReport,
  selectedLanguage,
  questionTimeSpent,
  questions,
  onRegenerate,
  onStartWeaknessDrill,
}: WeaknessAnalysisPanelProps) {
  const isKo = selectedLanguage === "ko";
  const totalTrackedSec = Object.values(questionTimeSpent).reduce(
    (sum, sec) => sum + sec,
    0
  );

  if (isAnalyzing) {
    return (
      <section className="space-y-4 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-indigo-950 sm:text-base">
              {isKo
                ? "AI 취약 유형 · 풀이 시간 패턴 정밀 분석 중..."
                : "Analyzing Weakness Patterns & Timing Telemetry..."}
            </h3>
            <p className="text-xs text-indigo-700">
              {isKo
                ? "문항별 소요 시간(time_spent_sec)과 오답 원인을 분석해 학습 처방을 생성하고 있습니다."
                : "Correlating per-question timing telemetry with TOPIK question types."}
            </p>
          </div>
        </div>

        {/* Skeleton Loading Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="h-24 animate-pulse rounded-2xl border border-indigo-100 bg-white/80 p-4"
            >
              <div className="h-3 w-24 rounded bg-indigo-100" />
              <div className="mt-3 h-5 w-16 rounded bg-slate-200" />
              <div className="mt-2 h-2 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
        <div className="space-y-2 rounded-2xl border border-indigo-100 bg-white/80 p-4">
          <div className="h-3.5 w-48 animate-pulse rounded bg-indigo-100" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
        </div>
      </section>
    );
  }

  if (!analysisReport) return null;

  const { weakness_summary, ai_feedback_text, recommended_question_ids } =
    analysisReport;
  const typeEntries = Object.entries(weakness_summary.by_question_type || {});
  const recommendedQuestions = recommended_question_ids
    .map((id) => questions.find((q) => q.question_id === id))
    .filter((q): q is QuestionItem => Boolean(q));

  return (
    <section className="space-y-5 rounded-3xl border border-indigo-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
              {isKo
                ? "AI 취약 유형 · 시간 관리 진단 리포트"
                : "AI Weakness & Time-Management Diagnostic"}
            </h3>
            <p className="text-xs text-slate-500">
              {isKo
                ? `총 기록 풀이 시간: ${totalTrackedSec}초 · 3대 오답 행동 패턴 기반 분석`
                : `Total tracked study time: ${totalTrackedSec}s · 3 error-pattern model`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{isKo ? "AI 분석 재생성" : "Regenerate AI Diagnosis"}</span>
        </button>
      </div>

      {/* 1. Question-Type Accuracy & Time Pattern Summary Cards */}
      {typeEntries.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-600">
            <Clock className="h-3.5 w-3.5 text-indigo-600" />
            <span>
              {isKo
                ? "유형별 정답률 및 평균 풀이 시간·오답 패턴"
                : "Accuracy & Timing Pattern by Question Type"}
            </span>
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {typeEntries.map(([qType, stat]) => {
              const label =
                QUESTION_TYPE_LABELS[qType]?.[isKo ? "ko" : "en"] || qType;
              return (
                <div
                  key={qType}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-extrabold text-slate-900">
                      {label}
                    </span>
                    <span
                      className={`shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-extrabold ${
                        stat.accuracy_rate >= 70
                          ? "bg-emerald-100 text-emerald-800"
                          : stat.accuracy_rate >= 40
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stat.accuracy_rate}% ({stat.correct_count}/
                      {stat.total_questions})
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      style={{ width: `${stat.accuracy_rate}%` }}
                      className={`h-full rounded-full ${
                        stat.accuracy_rate >= 70
                          ? "bg-emerald-500"
                          : stat.accuracy_rate >= 40
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-600">
                    <span>
                      ⏱ {isKo ? "평균" : "Avg"} <strong>{stat.avg_time_sec}s</strong>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {stat.error_patterns.rushed_guessing > 0 && (
                        <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                          ⚡ 찍기 {stat.error_patterns.rushed_guessing}
                        </span>
                      )}
                      {stat.error_patterns.concept_deficit > 0 && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                          🧠 개념부족 {stat.error_patterns.concept_deficit}
                        </span>
                      )}
                      {stat.error_patterns.attractive_distractor > 0 && (
                        <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                          🪤 함정 {stat.error_patterns.attractive_distractor}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Frequent Missed Tags */}
      {weakness_summary.top_missed_tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5">
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-900">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            {isKo ? "취약 문법·어휘 태그:" : "Top Missed Tags:"}
          </span>
          {weakness_summary.top_missed_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-amber-200 bg-white px-2 py-0.5 text-xs font-bold text-amber-950"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 2. Gemini AI Personalized Markdown Feedback */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 sm:p-5">
        <div className="mb-2.5 flex items-center gap-1.5 text-xs font-extrabold text-indigo-900">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>
            {isKo
              ? "Gemini AI 맞춤형 학습 처방 (Markdown)"
              : "Gemini AI Personalized Study Prescription"}
          </span>
        </div>
        <SimpleMarkdownView content={ai_feedback_text} />
      </div>

      {/* 3. Recommended Weakness Drill CTA */}
      {recommended_question_ids.length > 0 && (
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-4 text-white sm:flex-row sm:items-center sm:p-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Zap className="h-3.5 w-3.5" />
              <span>
                {isKo
                  ? `취약 유형 맞춤형 미풀이 · 오답 문항 ${recommended_question_ids.length}개 추출 완료`
                  : `${recommended_question_ids.length} Recommended Weakness Drill Items Ready`}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {recommendedQuestions.length > 0
                ? recommendedQuestions
                    .map(
                      (q) =>
                        `Q${q.question_number}(${q.section_name})`
                    )
                    .join(" · ")
                : isKo
                  ? "취약 유형을 집중 연습하여 목표 급수를 달성하세요."
                  : "Practice your lowest-accuracy question types."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onStartWeaknessDrill(recommended_question_ids)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-md transition hover:bg-emerald-400"
          >
            <Target className="h-4 w-4" />
            <span>
              {isKo
                ? `약점 집중 보완하기 (${recommended_question_ids.length}문항)`
                : `Start Weakness Drill (${recommended_question_ids.length})`}
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
