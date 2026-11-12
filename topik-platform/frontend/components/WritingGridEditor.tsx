"use client";

import React, { useMemo, useState } from "react";
import {
  AlignLeft,
  CheckCircle2,
  FileSpreadsheet,
  Grid,
  Sparkles,
  Wand2,
} from "lucide-react";

interface WritingGridEditorProps {
  questionNumber: number;
  questionType: "ESSAY_SHORT" | "ESSAY_LONG" | "SHORT_ANSWER";
  promptText?: string;
  value: string;
  onChange: (newText: string) => void;
}

const SAMPLE_DRAFT_51 =
  "㉠ 가기 어렵게 되었습니다.\n㉡ 변경할 수 있을까요?";

const SAMPLE_DRAFT_52 =
  "㉠ 썩기 때문이다.\n㉡ 주지 말고";

const SAMPLE_DRAFT_53_SHOPPING =
  "인주시 통계청에서 조사한 ‘온라인 쇼핑 이용 현황 및 소비자 만족 요인’에 따르면 온라인 쇼핑 시장 규모는 2020년 15조 원에서 2024년 32조 원으로 4년간 두 배 이상 급증한 것으로 나타났다. 소비자 만족 요인으로는 ‘배송의 신속성’이 48%로 가장 높았으며, ‘가격 경쟁력’이 32%, ‘상품의 다양성’이 20%로 그 뒤를 이었다. 이처럼 당일 배송 서비스 확대와 합리적 가격 혜택에 힘입어 온라인 쇼핑 시장은 앞으로도 지속적인 성장을 이룰 것으로 전망된다.";

const SAMPLE_DRAFT_53_HOUSEHOLD =
  "한국사회연구원에서 조사한 ‘인주시의 가구 형태별 변화 추이’에 따르면 2015년부터 2025년까지 4인 이상 가구의 비율은 42%에서 21%로 절반이나 감소한 반면, 1인 가구는 18%에서 39%로 두 배 이상 급증하여 가장 높은 비중을 차지한 것으로 나타났다. 이러한 1인 가구의 급격한 증가는 청년층의 독립 및 결혼관 변화와 고령화로 인한 독거노인 가구 증가에서 비롯된 것으로 분석된다. 따라서 향후 1인 가구를 위한 맞춤형 소형 주택 공급을 확대하고 사회 안전망을 확충하는 대책 마련이 요구된다.";

const SAMPLE_DRAFT_54_HAPPINESS =
  "현대 사회는 과학 기술의 발전과 경제 성장에 힘입어 과거 어느 때보다 물질적인 풍요를 누리고 있다. 그러나 타인과의 과도한 경쟁과 사회적 고립감으로 인해 현대인이 체감하는 행복지수는 오히려 낮아지는 추세이다.\n진정한 행복을 실현하기 위해서는 개인적 차원과 사회적 차원의 노력이 동시에 이루어져야 한다. 우선 개인은 타인의 시선이나 물질적 기준에 얽매이지 않고 자신의 내면적 가치를 존중하는 주체적인 태도를 가져야 한다. 일상 속에서 작은 성취감을 발견하고 일과 휴식의 균형을 유지할 때 정서적 안정을 얻을 수 있기 때문이다.\n더불어 사회와 제도는 과도한 경쟁 문화를 완화하고 구성원의 기본적인 삶의 질을 보장할 수 있는 환경을 조성해야 한다. 실패하더라도 다시 도전할 수 있는 사회적 안전망을 확충하고 여가 시간을 보장하는 제도적 뒷받침이 필수적이다. 결론적으로 개인의 가치관 변화와 사회의 제도적 지원이 조화를 이룰 때 현대인은 진정한 행복을 영위할 수 있을 것이다.";

const SAMPLE_DRAFT_54_FAKENEWS =
  "정보 통신 기술의 고도화와 소셜 미디어의 보편화로 누구나 정보를 생산하고 유통할 수 있는 시대가 도래했다. 그러나 정보의 양적 팽창 이면에는 검증되지 않은 허위 정보, 이른바 ‘가짜 뉴스’가 무분별하게 확산되는 부작용이 자리 잡고 있다.\n가짜 뉴스가 급속도로 생산되는 배경에는 조회 수를 통해 경제적 이익을 얻으려는 상업적 유인과 익명성에 기댄 무책임한 정보 유포가 있다. 더욱이 알고리즘 추천 기술은 수용자의 확증 편향을 강화하여 자극적인 허위 정보의 재생산을 부추긴다. 이로 인해 개인은 왜곡된 사실에 현혹되어 그릇된 판단을 내리기 십상이며, 사회적으로는 공동체의 신뢰가 훼손되고 집단 간 양극화가 심화된다.\n따라서 이러한 폐해를 극복하기 위해서는 다각적인 노력이 병행되어야 한다. 우선 정부와 플랫폼 기업은 악의적인 허위 정보 유포에 대한 법적 제재를 강화하고 정밀한 팩트체크 시스템을 구축해야 한다. 아울러 개인 역시 출처가 불분명한 정보를 맹신하지 않고 비판적으로 검증하는 미디어 리터러시 역량을 함양해야 한다. 결론적으로 제도적 자정 장치와 성숙한 시민 의식이 조화를 이룰 때 건전한 공론장이 정착될 수 있을 것이다.";

function buildWongojiCells(text: string, minRows: number): string[][] {
  const cols = 20;
  const rows: string[][] = [];

  if (!text) {
    for (let r = 0; r < minRows; r++) {
      rows.push(Array(cols).fill(""));
    }
    return rows;
  }

  const paragraphs = text.split("\n");
  paragraphs.forEach((para) => {
    const chars = Array.from(para);
    if (chars.length === 0) {
      rows.push(Array(cols).fill(""));
      return;
    }
    for (let i = 0; i < chars.length; i += cols) {
      const slice = chars.slice(i, i + cols);
      while (slice.length < cols) {
        slice.push("");
      }
      rows.push(slice);
    }
  });

  while (rows.length < minRows) {
    rows.push(Array(cols).fill(""));
  }
  return rows;
}

export default function WritingGridEditor({
  questionNumber,
  questionType,
  promptText = "",
  value,
  onChange,
}: WritingGridEditorProps) {
  const [viewMode, setViewMode] = useState<"split" | "wongoji" | "editor">(
    "split"
  );

  const targetMin =
    questionType === "SHORT_ANSWER"
      ? 15
      : questionType === "ESSAY_SHORT"
        ? 200
        : 600;
  const targetMax =
    questionType === "SHORT_ANSWER"
      ? 80
      : questionType === "ESSAY_SHORT"
        ? 300
        : 700;
  const minWongojiRows =
    questionType === "SHORT_ANSWER"
      ? 4
      : questionType === "ESSAY_SHORT"
        ? 16
        : 36;

  const charCountWithSpaces = value.length;
  const charCountWithoutSpaces = useMemo(
    () => value.replace(/\s+/g, "").length,
    [value]
  );

  const wongojiRows = useMemo(
    () => buildWongojiCells(value, minWongojiRows),
    [value, minWongojiRows]
  );

  const isInTargetRange =
    charCountWithSpaces >= targetMin && charCountWithSpaces <= targetMax;
  const isOverMax = charCountWithSpaces > targetMax;
  const progressPercent = Math.min(
    100,
    Math.round((charCountWithSpaces / targetMax) * 100)
  );

  const handleInsertIndent = () => {
    onChange(value ? `${value}\n ` : " ");
  };

  const handleFillSample = () => {
    if (questionNumber === 51) {
      onChange(SAMPLE_DRAFT_51);
    } else if (questionNumber === 52) {
      onChange(SAMPLE_DRAFT_52);
    } else if (questionNumber === 53) {
      onChange(
        promptText.includes("가구")
          ? SAMPLE_DRAFT_53_HOUSEHOLD
          : SAMPLE_DRAFT_53_SHOPPING
      );
    } else {
      onChange(
        promptText.includes("가짜 뉴스")
          ? SAMPLE_DRAFT_54_FAKENEWS
          : SAMPLE_DRAFT_54_HAPPINESS
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 shadow-sm ring-1 ring-slate-200/80">
            <span className="text-xs font-semibold text-slate-500">
              공백 포함
            </span>
            <span
              className={`font-mono text-base font-extrabold ${
                isInTargetRange
                  ? "text-emerald-600"
                  : isOverMax
                    ? "text-red-600"
                    : "text-blue-600"
              }`}
            >
              {charCountWithSpaces}자
            </span>
            <span className="text-xs text-slate-400">
              / 권장 {targetMin}~{targetMax}자
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 shadow-sm ring-1 ring-slate-200/80">
            <span className="text-xs font-semibold text-slate-500">
              공백 제외
            </span>
            <span className="font-mono text-base font-bold text-slate-800">
              {charCountWithoutSpaces}자
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              isInTargetRange
                ? "bg-emerald-100 text-emerald-800"
                : isOverMax
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-800"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isInTargetRange
              ? "적정 분량 달성"
              : isOverMax
                ? `권장 분량 초과 (+${charCountWithSpaces - targetMax}자)`
                : `권장 분량까지 ${targetMin - charCountWithSpaces}자 남음`}
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              viewMode === "split"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>에디터 + 원고지</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("wongoji")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              viewMode === "wongoji"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>원고지 격자 보기</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("editor")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              viewMode === "editor"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <AlignLeft className="h-3.5 w-3.5" />
            <span>일반 입력</span>
          </button>
        </div>
      </div>

      {/* Character Progress Bar */}
      <div className="space-y-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full transition-all duration-300 ${
              isInTargetRange
                ? "bg-emerald-500"
                : isOverMax
                  ? "bg-red-500"
                  : "bg-blue-500"
            }`}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>0자</span>
          <span className="font-semibold text-slate-600">
            최소 권장 {targetMin}자
          </span>
          <span className="font-semibold text-slate-600">
            최대 권장 {targetMax}자
          </span>
        </div>
      </div>

      {/* Quick Writing Helpers */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInsertIndent}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ↵ 문단 줄바꿈 + 첫 칸 들여쓰기
          </button>
          <button
            type="button"
            onClick={handleFillSample}
            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>{questionNumber}번 기출 모범 답안 예시 채우기 (학습·첨삭 테스트용)</span>
          </button>
        </div>
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-medium text-slate-400 hover:text-red-600"
          >
            전체 지우기
          </button>
        )}
      </div>

      {/* Textarea Input Area */}
      {viewMode !== "wongoji" ? (
        <div>
          <label htmlFor={`essay-textarea-${questionNumber}`} className="sr-only">
            {questionNumber}번 작문 답안 입력
          </label>
          <textarea
            id={`essay-textarea-${questionNumber}`}
            rows={viewMode === "split" ? 6 : 12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              questionType === "SHORT_ANSWER"
                ? `${questionNumber}번 빈칸 ㉠, ㉡에 들어갈 알맞은 문장을 작성하십시오.`
                : `${questionNumber}번 답안을 여기에 작성하십시오. (권장 분량: ${targetMin}~${targetMax}자, 문어체 평서형 '-다/는다' 사용)`
            }
            className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-[15px] leading-7 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-blue-800">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              원고지 실시간 연동 입력창 (입력 즉시 아래 20칸 원고지에 반영됩니다)
            </span>
          </div>
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="타이핑하면 아래 20칸 원고지 격자에 한 글자씩 실시간으로 채워집니다..."
            className="w-full rounded-xl border border-blue-200 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
          />
        </div>
      )}

      {/* 20-Column Korean Wongoji Grid */}
      {(viewMode === "wongoji" || viewMode === "split") && (
        <div className="rounded-2xl border-2 border-rose-200 bg-[#fffdf9] p-4 shadow-inner">
          <div className="mb-2.5 flex items-center justify-between border-b border-rose-200/70 pb-2 text-xs font-bold text-rose-800">
            <span>
              TOPIK II IBT 20칸 원고지 (20자 × {wongojiRows.length}줄 ={" "}
              {wongojiRows.length * 20}칸)
            </span>
            <span className="font-mono text-[11px] text-rose-600">
              붉은 기준선: 매 5칸 단위 · 우측 누적 글자 수 표시
            </span>
          </div>

          <div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
            {wongojiRows.map((rowCells, rowIdx) => {
              const cumulativeChars = (rowIdx + 1) * 20;
              const isMilestone = cumulativeChars % 100 === 0;
              const isTargetRow =
                cumulativeChars === targetMin || cumulativeChars === targetMax;

              return (
                <div key={rowIdx} className="flex items-center gap-1.5">
                  <div className="grid flex-1 grid-cols-20 border border-rose-300 bg-white">
                    {rowCells.map((ch, colIdx) => {
                      const isFifthCol = (colIdx + 1) % 5 === 0 && colIdx !== 19;
                      const isSpace = ch === " ";
                      return (
                        <div
                          key={colIdx}
                          className={`flex aspect-square items-center justify-center border-r border-rose-200 text-xs font-medium text-slate-900 sm:text-sm ${
                            isFifthCol ? "border-r-rose-400" : ""
                          } ${isSpace ? "bg-amber-50/40" : ""}`}
                        >
                          {isSpace ? (
                            <span className="text-[10px] text-slate-300">␣</span>
                          ) : (
                            ch
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={`w-11 text-right font-mono text-[10px] font-bold ${
                      isTargetRow
                        ? "rounded bg-emerald-100 px-1 py-0.5 text-emerald-800"
                        : isMilestone
                          ? "text-rose-700"
                          : "text-slate-400"
                    }`}
                  >
                    {cumulativeChars}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
