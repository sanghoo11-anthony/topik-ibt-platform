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

export const SAMPLE_DRAFT_51 =
  "㉠ 가기 어렵게 되었습니다.\n㉡ 변경할 수 있을까요?";

export const SAMPLE_DRAFT_52 =
  "㉠ 썩기 때문이다.\n㉡ 주지 말고";

export const SAMPLE_DRAFT_53_BICYCLE =
  "‘인주시의 자전거 이용자 변화’를 살펴보면, 자전거 이용자 수는 2007년 4만 명에서 2012년 9만 명으로 증가하였으며, 2017년에는 21만 명에 달해 10년 동안 약 5배나 급증한 것으로 나타났다. 이러한 변화는 인주시의 자전거 도로 개발과 자전거 빌리는 곳의 확대에서 비롯된 것으로 분석된다. 한편 같은 기간 이용 목적별 변화를 보면 ‘출퇴근’ 목적이 2007년에 비해 2017년 14배로 가장 큰 폭으로 증가하였고, ‘운동 및 산책’은 4배, ‘기타’ 목적은 3배 증가한 것으로 조사되었다.";

export const SAMPLE_DRAFT_53_SHOPPING =
  "인주시 통계청에서 조사한 ‘온라인 쇼핑 이용 현황 및 소비자 만족 요인’에 따르면 온라인 쇼핑 시장 규모는 2020년 15조 원에서 2022년 23조 원, 2024년 32조 원으로 4년간 두 배 이상 급증한 것으로 나타났다. 소비자 만족 요인으로는 ‘배송의 신속성’이 48%로 가장 높았으며, ‘가격 경쟁력’이 32%, ‘상품의 다양성’이 20%로 그 뒤를 이었다. 이처럼 당일 배송 서비스 확대와 합리적 가격 혜택에 힘입어 온라인 쇼핑 시장은 앞으로도 지속적인 성장을 이룰 것으로 전망된다.";

export const SAMPLE_DRAFT_53_HOUSEHOLD =
  "한국사회연구원에서 조사한 ‘인주시의 가구 형태별 변화 추이’에 따르면 2015년부터 2025년까지 4인 이상 가구의 비율은 42%에서 21%로 절반이나 감소한 반면, 1인 가구는 18%에서 39%로 두 배 이상 급증하여 가장 높은 비중을 차지한 것으로 나타났다. 이러한 1인 가구의 급격한 증가는 청년층의 독립 및 결혼관 변화와 고령화로 인한 독거노인 가구 증가에서 비롯된 것으로 분석된다. 따라서 향후 1인 가구를 위한 맞춤형 소형 주택 공급을 확대하고 사회 안전망을 확충하는 대책 마련이 요구된다.";

export const SAMPLE_DRAFT_53_EBOOK =
  "‘성인의 전자책 독서율 변화 및 이용 이유’ 조사 결과에 따르면, 성인의 전자책 독서율은 2019년 16%에서 2021년 27%, 2023년 41%로 4년 사이 약 2.5배 상승한 것으로 나타났다. 전자책을 선호하는 이유로는 ‘휴대 및 보관의 편리성’이 52%로 가장 높았으며, ‘저렴한 구매 비용’이 31%, ‘시공간의 제약 없음’이 17%로 그 뒤를 이었다. 향후 오디오북과 구독형 서비스가 결합되면서 디지털 독서 인구는 지속적으로 유입될 것으로 전망된다.";

export const SAMPLE_DRAFT_54_HAPPINESS =
  "현대 사회는 과학 기술의 발전과 경제 성장에 힘입어 과거 어느 때보다 물질적인 풍요를 누리고 있다. 그러나 타인과의 과도한 경쟁과 사회적 고립감으로 인해 현대인이 체감하는 행복지수는 오히려 낮아지는 추세이다.\n진정한 행복을 실현하기 위해서는 개인적 차원과 사회적 차원의 노력이 동시에 이루어져야 한다. 우선 개인은 타인의 시선이나 물질적 기준에 얽매이지 않고 자신의 내면적 가치를 존중하는 주체적인 태도를 가져야 한다. 일상 속에서 작은 성취감을 발견하고 일과 휴식의 균형을 유지할 때 정서적 안정을 얻을 수 있기 때문이다.\n더불어 사회와 제도는 과도한 경쟁 문화를 완화하고 구성원의 기본적인 삶의 질을 보장할 수 있는 환경을 조성해야 한다. 실패하더라도 다시 도전할 수 있는 사회적 안전망을 확충하고 여가 시간을 보장하는 제도적 뒷받침이 필수적이다. 결론적으로 개인의 가치관 변화와 사회의 제도적 지원이 조화를 이룰 때 현대인은 진정한 행복을 영위할 수 있을 것이다.";

export const SAMPLE_DRAFT_54_FAKENEWS =
  "정보 통신 기술의 고도화와 소셜 미디어의 보편화로 누구나 정보를 생산하고 유통할 수 있는 시대가 도래했다. 그러나 정보의 양적 팽창 이면에는 검증되지 않은 허위 정보, 이른바 ‘가짜 뉴스’가 무분별하게 확산되는 부작용이 자리 잡고 있다.\n가짜 뉴스가 급속도로 생산되는 배경에는 조회 수를 통해 경제적 이익을 얻으려는 상업적 유인과 익명성에 기댄 무책임한 정보 유포가 있다. 더욱이 알고리즘 추천 기술은 수용자의 확증 편향을 강화하여 자극적인 허위 정보의 재생산을 부추긴다. 이로 인해 개인은 왜곡된 사실에 현혹되어 그릇된 판단을 내리기 십상이며, 사회적으로는 공동체의 신뢰가 훼손되고 집단 간 양극화가 심화된다.\n따라서 이러한 폐해를 극복하기 위해서는 다각적인 노력이 병행되어야 한다. 우선 정부와 플랫폼 기업은 악의적인 허위 정보 유포에 대한 법적 제재를 강화하고 정밀한 팩트체크 시스템을 구축해야 한다. 아울러 개인 역시 출처가 불분명한 정보를 맹신하지 않고 비판적으로 검증하는 미디어 리터러시 역량을 함양해야 한다. 결론적으로 제도적 자정 장치와 성숙한 시민 의식이 조화를 이룰 때 건전한 공론장이 정착될 수 있을 것이다.";

/**
 * Authentic TOPIK II Question 53 Visual Graph & Chart Renderer
 */
export function TopikQ53VisualChart({
  promptText = "",
  passageText = "",
}: {
  promptText?: string;
  passageText?: string;
}) {
  const combined = `${promptText} ${passageText}`;

  // 1. 인주시의 자전거 이용자 변화 (User's uploaded reference image)
  if (combined.includes("자전거")) {
    return (
      <div className="rounded-2xl border-2 border-slate-700 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-extrabold text-white">
            📊 TOPIK II 쓰기 53번 실전 그래프 자료
          </span>
          <span className="text-xs font-bold text-slate-600">
            주제: 인주시의 자전거 이용자 변화
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* 좌측: 자전거 이용자 수 꺾은선 그래프 */}
          <div className="flex flex-col justify-between rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3 md:col-span-6">
            <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white shadow-sm">
              자전거 이용자 수
            </div>
            <div className="mt-2 text-[11px] font-bold text-slate-700">
              (단위: 명)
            </div>

            <svg
              viewBox="0 0 280 185"
              className="mt-1 w-full overflow-visible"
              role="img"
              aria-label="자전거 이용자 수 그래프: 2007년 4만, 2012년 9만, 2017년 21만 (약 5배 증가)"
            >
              <defs>
                <marker
                  id="arrow-gray"
                  markerWidth="8"
                  markerHeight="8"
                  refX="5"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
                </marker>
              </defs>

              {/* Axes */}
              <line
                x1="32"
                y1="15"
                x2="32"
                y2="155"
                stroke="#334155"
                strokeWidth="2"
              />
              <line
                x1="32"
                y1="155"
                x2="265"
                y2="155"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Curved 5x growth arrow */}
              <path
                d="M 65 112 Q 115 20 222 32"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="7"
                markerEnd="url(#arrow-gray)"
              />
              <rect
                x="105"
                y="42"
                width="46"
                height="20"
                rx="3"
                fill="#475569"
              />
              <text
                x="128"
                y="56"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#ffffff"
              >
                약 5배
              </text>

              {/* Dashed drop lines */}
              <line
                x1="65"
                y1="132"
                x2="65"
                y2="155"
                stroke="#64748b"
                strokeDasharray="3,3"
              />
              <line
                x1="150"
                y1="102"
                x2="150"
                y2="155"
                stroke="#64748b"
                strokeDasharray="3,3"
              />
              <line
                x1="235"
                y1="40"
                x2="235"
                y2="155"
                stroke="#64748b"
                strokeDasharray="3,3"
              />

              {/* Line path */}
              <polyline
                fill="none"
                stroke="#1e293b"
                strokeWidth="2.5"
                points="65,132 150,102 235,40"
              />

              {/* Diamond points */}
              <polygon
                points="65,126 71,132 65,138 59,132"
                fill="#94a3b8"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              <polygon
                points="150,96 156,102 150,108 144,102"
                fill="#94a3b8"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              <polygon
                points="235,34 241,40 235,46 229,40"
                fill="#94a3b8"
                stroke="#1e293b"
                strokeWidth="1.5"
              />

              {/* Value labels */}
              <text
                x="65"
                y="120"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#1e293b"
              >
                4만
              </text>
              <text
                x="150"
                y="90"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#1e293b"
              >
                9만
              </text>
              <text
                x="235"
                y="26"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#1e293b"
              >
                21만
              </text>

              {/* Year labels */}
              <text
                x="65"
                y="173"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#1e293b"
              >
                2007년
              </text>
              <text
                x="150"
                y="173"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#1e293b"
              >
                2012년
              </text>
              <text
                x="235"
                y="173"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#1e293b"
              >
                2017년
              </text>
            </svg>
          </div>

          {/* 우측 상단 + 하단 */}
          <div className="flex flex-col gap-3 md:col-span-6">
            {/* 우측 상단: 변화 이유 */}
            <div className="rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3">
              <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white shadow-sm">
                변화 이유
              </div>
              <div className="mt-3 flex items-center justify-between px-2">
                <ul className="space-y-1.5 text-xs font-extrabold text-slate-800 sm:text-sm">
                  <li>• 자전거 도로 개발</li>
                  <li>• 자전거 빌리는 곳 확대</li>
                </ul>
                <span className="text-3xl" role="img" aria-label="bicycle">
                  🚴
                </span>
              </div>
            </div>

            {/* 우측 하단: 이용 목적 막대그래프 */}
            <div className="flex-1 rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3">
              <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white shadow-sm">
                이용 목적
              </div>

              {/* 범례 */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 bg-slate-700" />
                  운동 및 산책
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 border border-slate-600 bg-blue-200" />
                  출퇴근
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 bg-slate-400" />
                  기타
                </span>
              </div>

              <svg
                viewBox="0 0 280 120"
                className="mt-1 w-full overflow-visible"
                role="img"
                aria-label="이용 목적 변화: 운동 및 산책 4배, 출퇴근 14배, 기타 3배 증가"
              >
                <line
                  x1="15"
                  y1="100"
                  x2="268"
                  y2="100"
                  stroke="#334155"
                  strokeWidth="1.8"
                />

                {/* 1. 운동 및 산책 (4배) */}
                <rect x="28" y="80" width="22" height="20" fill="#334155" />
                <rect x="54" y="25" width="24" height="75" fill="#334155" />
                <rect
                  x="20"
                  y="42"
                  width="30"
                  height="16"
                  rx="2"
                  fill="#475569"
                />
                <text
                  x="35"
                  y="53"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#fff"
                >
                  4배
                </text>
                <text x="38" y="114" textAnchor="middle" fontSize="9.5" fill="#334155">
                  2007
                </text>
                <text x="66" y="114" textAnchor="middle" fontSize="9.5" fill="#334155">
                  2017
                </text>

                {/* 2. 출퇴근 (14배) */}
                <rect
                  x="116"
                  y="95"
                  width="22"
                  height="5"
                  fill="#bfdbfe"
                  stroke="#334155"
                />
                <rect
                  x="142"
                  y="42"
                  width="24"
                  height="58"
                  fill="#93c5fd"
                  stroke="#1e3a8a"
                />
                <rect
                  x="104"
                  y="58"
                  width="34"
                  height="16"
                  rx="2"
                  fill="#1e40af"
                />
                <text
                  x="121"
                  y="69"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#fff"
                >
                  14배
                </text>
                <text
                  x="126"
                  y="114"
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#334155"
                >
                  2007
                </text>
                <text
                  x="154"
                  y="114"
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#334155"
                >
                  2017
                </text>

                {/* 3. 기타 (3배) */}
                <rect x="204" y="92" width="22" height="8" fill="#94a3b8" />
                <rect x="230" y="70" width="24" height="30" fill="#94a3b8" />
                <rect
                  x="196"
                  y="60"
                  width="30"
                  height="16"
                  rx="2"
                  fill="#475569"
                />
                <text
                  x="211"
                  y="71"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#fff"
                >
                  3배
                </text>
                <text
                  x="214"
                  y="114"
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#334155"
                >
                  2007
                </text>
                <text
                  x="242"
                  y="114"
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#334155"
                >
                  2017
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. 가구 형태별 변화 추이 (1인 가구 vs 4인 이상 가구)
  if (combined.includes("가구")) {
    return (
      <div className="rounded-2xl border-2 border-slate-700 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="rounded-md bg-indigo-700 px-2.5 py-1 text-xs font-extrabold text-white">
            📊 TOPIK II 쓰기 53번 실전 그래프 자료
          </span>
          <span className="text-xs font-bold text-slate-600">
            주제: 인주시의 가구 형태별 변화 추이 (한국사회연구원)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3 md:col-span-6">
            <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white">
              가구 형태별 비율 변화 (단위: %)
            </div>
            <svg viewBox="0 0 280 175" className="mt-3 w-full">
              <line x1="30" y1="20" x2="30" y2="145" stroke="#334155" strokeWidth="2" />
              <line x1="30" y1="145" x2="260" y2="145" stroke="#334155" strokeWidth="2" />
              {/* 2015 vs 2025 bars for 1인 가구 */}
              <rect x="52" y="105" width="32" height="40" fill="#94a3b8" rx="3" />
              <text x="68" y="99" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">18%</text>
              <rect x="92" y="52" width="32" height="93" fill="#2563eb" rx="3" />
              <text x="108" y="45" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1d4ed8">39% (↑2.1배)</text>
              <text x="88" y="164" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">1인 가구 (2015→2025)</text>

              {/* 2015 vs 2025 bars for 4인 이상 가구 */}
              <rect x="165" y="45" width="32" height="100" fill="#475569" rx="3" />
              <text x="181" y="38" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">42%</text>
              <rect x="205" y="95" width="32" height="50" fill="#f97316" rx="3" />
              <text x="221" y="88" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c2410c">21% (↓절반)</text>
              <text x="201" y="164" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">4인 이상 (2015→2025)</text>
            </svg>
          </div>

          <div className="flex flex-col gap-3 md:col-span-6">
            <div className="rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3">
              <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white">
                1인 가구 급증 원인
              </div>
              <ul className="mt-3 space-y-1.5 px-2 text-xs font-extrabold text-slate-800">
                <li>• 청년층의 독립 및 결혼관 변화</li>
                <li>• 고령화로 인한 노인 단독 가구 증가</li>
              </ul>
            </div>
            <div className="flex-1 rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3">
              <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white">
                향후 필요 대책
              </div>
              <ul className="mt-3 space-y-1.5 px-2 text-xs font-extrabold text-indigo-900">
                <li>• 1인 가구 맞춤형 소형 주택 공급 확대</li>
                <li>• 고립 방지를 위한 사회적 안전망 확충</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. 성인의 전자책 독서율 변화 및 이용 이유
  if (combined.includes("전자책")) {
    return (
      <div className="rounded-2xl border-2 border-slate-700 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-extrabold text-white">
            📊 TOPIK II 쓰기 53번 실전 그래프 자료
          </span>
          <span className="text-xs font-bold text-slate-600">
            주제: 성인의 전자책 독서율 변화 및 선호 이유
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3 md:col-span-6">
            <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white">
              성인 전자책 독서율 추이 (단위: %)
            </div>
            <svg viewBox="0 0 280 175" className="mt-2 w-full">
              <line x1="32" y1="20" x2="32" y2="145" stroke="#334155" strokeWidth="2" />
              <line x1="32" y1="145" x2="260" y2="145" stroke="#334155" strokeWidth="2" />
              <polyline
                fill="none"
                stroke="#059669"
                strokeWidth="3"
                points="65,120 150,88 235,42"
              />
              <circle cx="65" cy="120" r="5" fill="#059669" />
              <circle cx="150" cy="88" r="5" fill="#059669" />
              <circle cx="235" cy="42" r="5" fill="#059669" />
              <text x="65" y="110" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065f46">16%</text>
              <text x="150" y="76" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065f46">27%</text>
              <text x="235" y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065f46">41% (약 2.5배↑)</text>
              <text x="65" y="164" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">2019년</text>
              <text x="150" y="164" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">2021년</text>
              <text x="235" y="164" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">2023년</text>
            </svg>
          </div>

          <div className="flex flex-col gap-3 md:col-span-6">
            <div className="rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3">
              <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white">
                전자책 선호 이유 (단위: %)
              </div>
              <div className="mt-3 space-y-2 text-xs font-bold text-slate-800">
                <div>
                  <div className="flex justify-between">
                    <span>1위: 휴대 및 보관 편리성</span>
                    <span className="text-emerald-700">52%</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full rounded-full bg-slate-200">
                    <div className="h-2.5 w-[52%] rounded-full bg-emerald-600" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>2위: 저렴한 구매 비용</span>
                    <span className="text-blue-700">31%</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full rounded-full bg-slate-200">
                    <div className="h-2.5 w-[31%] rounded-full bg-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>3위: 시공간 제약 없음</span>
                    <span className="text-slate-600">17%</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full rounded-full bg-slate-200">
                    <div className="h-2.5 w-[17%] rounded-full bg-slate-500" />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3">
              <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white">
                향후 전망
              </div>
              <p className="mt-2 text-xs font-extrabold text-slate-800">
                • 오디오북·구독형 서비스 결합으로 디지털 독서 인구 지속 유입 전망
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. 기본: 온라인 쇼핑 시장 규모 및 소비자 만족 요인
  return (
    <div className="rounded-2xl border-2 border-slate-700 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
        <span className="rounded-md bg-blue-700 px-2.5 py-1 text-xs font-extrabold text-white">
          📊 TOPIK II 쓰기 53번 실전 그래프 자료
        </span>
        <span className="text-xs font-bold text-slate-600">
          조사 기관: 인주시 통계청
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        {/* 좌측: 온라인 쇼핑 시장 규모 */}
        <div className="rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3 md:col-span-6">
          <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white">
            온라인 쇼핑 시장 규모 변화
          </div>
          <div className="mt-1.5 text-[11px] font-bold text-slate-700">
            (단위: 조 원)
          </div>
          <svg viewBox="0 0 280 165" className="mt-1 w-full">
            <line x1="30" y1="15" x2="30" y2="140" stroke="#334155" strokeWidth="2" />
            <line x1="30" y1="140" x2="260" y2="140" stroke="#334155" strokeWidth="2" />
            <rect x="52" y="88" width="36" height="52" fill="#93c5fd" stroke="#1d4ed8" />
            <rect x="128" y="60" width="36" height="80" fill="#60a5fa" stroke="#1d4ed8" />
            <rect x="204" y="28" width="36" height="112" fill="#2563eb" stroke="#1e3a8a" />
            <polyline
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
              points="70,88 146,60 222,28"
            />
            <text x="70" y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">15조</text>
            <text x="146" y="52" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">23조</text>
            <text x="222" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1d4ed8">32조 (2배↑)</text>
            <text x="70" y="156" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">2020년</text>
            <text x="146" y="156" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">2022년</text>
            <text x="222" y="156" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">2024년</text>
          </svg>
        </div>

        {/* 우측: 만족 요인 비중 + 향후 전망 */}
        <div className="flex flex-col gap-3 md:col-span-6">
          <div className="rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3">
            <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white">
              소비자 만족 요인 비중 (2024년)
            </div>
            <div className="mt-3 space-y-2 text-xs font-bold text-slate-800">
              <div>
                <div className="flex justify-between">
                  <span>• 배송의 신속성</span>
                  <span className="text-blue-700">48% (1위)</span>
                </div>
                <div className="mt-1 h-2.5 w-full rounded-full bg-slate-200">
                  <div className="h-2.5 w-[48%] rounded-full bg-blue-600" />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>• 가격 경쟁력</span>
                  <span className="text-indigo-700">32% (2위)</span>
                </div>
                <div className="mt-1 h-2.5 w-full rounded-full bg-slate-200">
                  <div className="h-2.5 w-[32%] rounded-full bg-indigo-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>• 상품의 다양성</span>
                  <span className="text-slate-600">20% (3위)</span>
                </div>
                <div className="mt-1 h-2.5 w-full rounded-full bg-slate-200">
                  <div className="h-2.5 w-[20%] rounded-full bg-slate-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-slate-600 bg-slate-50/40 p-3">
            <div className="mx-auto w-4/5 rounded-b-xl bg-slate-700 py-1.5 text-center text-xs font-extrabold text-white">
              향후 전망
            </div>
            <ul className="mt-2 space-y-1 text-xs font-extrabold text-slate-800">
              <li>• 당일 배송 서비스 확대 및 합리적 가격 혜택</li>
              <li>• 온라인 쇼핑 시장의 지속적 성장 예상</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        ? 15
        : 35;

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
      if (promptText.includes("자전거")) {
        onChange(SAMPLE_DRAFT_53_BICYCLE);
      } else if (promptText.includes("가구")) {
        onChange(SAMPLE_DRAFT_53_HOUSEHOLD);
      } else if (promptText.includes("전자책")) {
        onChange(SAMPLE_DRAFT_53_EBOOK);
      } else {
        onChange(SAMPLE_DRAFT_53_SHOPPING);
      }
    } else {
      onChange(
        promptText.includes("가짜 뉴스")
          ? SAMPLE_DRAFT_54_FAKENEWS
          : SAMPLE_DRAFT_54_HAPPINESS
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Compact Sticky Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs shadow-sm ring-1 ring-slate-200">
            <span className="font-semibold text-slate-500">공백포함</span>
            <span
              className={`font-mono text-sm font-extrabold ${
                isInTargetRange
                  ? "text-emerald-600"
                  : isOverMax
                    ? "text-red-600"
                    : "text-blue-600"
              }`}
            >
              {charCountWithSpaces}자
            </span>
            <span className="text-[11px] text-slate-400">
              ({targetMin}~{targetMax}자)
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs shadow-sm ring-1 ring-slate-200">
            <span className="text-slate-500">공백제외</span>
            <span className="font-mono font-bold text-slate-800">
              {charCountWithoutSpaces}자
            </span>
          </div>

          <button
            type="button"
            onClick={handleInsertIndent}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
          >
            ↵ 줄바꿈+들여쓰기
          </button>

          <button
            type="button"
            onClick={handleFillSample}
            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100"
          >
            <Wand2 className="h-3 w-3" />
            <span>모범답안 예시 채우기</span>
          </button>

          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[11px] font-semibold text-slate-400 hover:text-red-600"
            >
              지우기
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition ${
              viewMode === "split"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileSpreadsheet className="h-3 w-3" />
            <span>동시 보기</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("wongoji")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition ${
              viewMode === "wongoji"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Grid className="h-3 w-3" />
            <span>원고지만</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("editor")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition ${
              viewMode === "editor"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <AlignLeft className="h-3 w-3" />
            <span>입력창만</span>
          </button>
        </div>
      </div>

      {/* Slim Progress Bar */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
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
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold ${
            isInTargetRange
              ? "text-emerald-700"
              : isOverMax
                ? "text-red-600"
                : "text-amber-700"
          }`}
        >
          <CheckCircle2 className="h-3 w-3" />
          {isInTargetRange
            ? "적정 분량 달성"
            : isOverMax
              ? `+${charCountWithSpaces - targetMax}자 초과`
              : `최소 분량까지 ${targetMin - charCountWithSpaces}자 남음`}
        </span>
      </div>

      {/* Textarea Input Area (Compact so Wongoji is immediately visible below) */}
      {viewMode !== "wongoji" ? (
        <div>
          <label
            htmlFor={`essay-textarea-${questionNumber}`}
            className="sr-only"
          >
            {questionNumber}번 작문 답안 입력
          </label>
          <textarea
            id={`essay-textarea-${questionNumber}`}
            rows={viewMode === "split" ? 4 : 10}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              questionType === "SHORT_ANSWER"
                ? `${questionNumber}번 빈칸 ㉠, ㉡에 들어갈 알맞은 문장을 작성하십시오.`
                : `좌측 그래프·문제를 보며 여기에 답안을 입력하면 아래 20칸 원고지에 실시간으로 채워집니다. (권장: ${targetMin}~${targetMax}자)`
            }
            className="w-full rounded-xl border-2 border-blue-200 bg-white p-3 text-sm leading-6 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-2.5">
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-blue-800">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              원고지 실시간 연동 입력창
            </span>
          </div>
          <textarea
            rows={2}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="타이핑하면 아래 20칸 원고지 격자에 한 글자씩 실시간으로 채워집니다..."
            className="w-full rounded-lg border border-blue-200 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
          />
        </div>
      )}

      {/* 20-Column Korean Wongoji Grid */}
      {(viewMode === "wongoji" || viewMode === "split") && (
        <div className="rounded-xl border-2 border-rose-200 bg-[#fffdf9] p-3 shadow-inner">
          <div className="mb-2 flex items-center justify-between border-b border-rose-200/70 pb-1.5 text-[11px] font-bold text-rose-800">
            <span>
              ✍️ TOPIK II 20칸 원고지 답안지 (20자 × {wongojiRows.length}줄 ={" "}
              {wongojiRows.length * 20}칸)
            </span>
            <span className="font-mono text-[10px] text-rose-600">
              우측 숫자: 누적 글자 수
            </span>
          </div>

          <div className="max-h-[290px] space-y-1 overflow-y-auto pr-1">
            {wongojiRows.map((rowCells, rowIdx) => {
              const cumulativeChars = (rowIdx + 1) * 20;
              const isMilestone = cumulativeChars % 100 === 0;
              const isTargetRow =
                cumulativeChars === targetMin || cumulativeChars === targetMax;

              return (
                <div key={rowIdx} className="flex items-center gap-1">
                  <div className="grid flex-1 grid-cols-20 border border-rose-300 bg-white">
                    {rowCells.map((ch, colIdx) => {
                      const isFifthCol =
                        (colIdx + 1) % 5 === 0 && colIdx !== 19;
                      const isSpace = ch === " ";
                      return (
                        <div
                          key={colIdx}
                          className={`flex aspect-square items-center justify-center border-r border-rose-200 text-[11px] font-semibold text-slate-900 sm:text-xs ${
                            isFifthCol ? "border-r-rose-400" : ""
                          } ${isSpace ? "bg-amber-50/40" : ""}`}
                        >
                          {isSpace ? (
                            <span className="text-[9px] text-slate-300">␣</span>
                          ) : (
                            ch
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={`w-9 text-right font-mono text-[10px] font-bold ${
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
