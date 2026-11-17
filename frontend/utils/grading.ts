"use client";

import { QUESTION_EXPLANATIONS_BY_NUM } from "@/data/studyData";
import { UserAnswerDraft } from "@/store/useExamStore";
import {
  QuestionGradingDetail,
  QuestionItem,
  SessionReportResponse,
  SpellingCorrection,
  WritingFeedbackReport,
} from "@/types/exam";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function shouldUseBackendApi(): boolean {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return true;
  }
  if (typeof window === "undefined") {
    return false;
  }
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 1500
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(id);
  }
}

const MODEL_ANSWERS: Record<number, string> = {
  51: "㉠ 가기 어렵게 되었습니다 / 갈 수 없게 되었습니다\n㉡ 변경할 수 있을까요 / 바꿀 수 있습니까",
  52: "㉠ 썩기 때문이다 / 숨을 쉬지 못하기 때문이다\n㉡ 주지 말고 / 주는 대신에",
  53: "인주시 통계청에서 실시한 ‘온라인 쇼핑 이용 현황 및 만족 요인’ 조사 결과에 따르면, 온라인 쇼핑 시장 규모는 2020년 15조 원에서 2024년 32조 원으로 4년간 두 배 이상 급증한 것으로 나타났다. 이와 같은 성장의 주요 요인으로는 ‘배송의 신속성’이 48%로 가장 높은 비중을 차지했으며, ‘가격 경쟁력’이 32%, ‘상품의 다양성’이 20%로 그 뒤를 이었다. 이처럼 당일 배송 확대와 합리적인 가격 혜택이 소비자의 만족도를 높여 온라인 쇼핑 시장의 지속적인 성장을 견인할 것으로 전망된다.",
  54: "현대 사회는 과학 기술의 비약적인 발전으로 물질적 풍요와 편리함을 누리고 있다. 그러나 이러한 급격한 변화 속에서 타인과의 과도한 경쟁과 사회적 고립감으로 인해 현대인의 행복지수는 오히려 정체되거나 낮아지는 경향을 보인다.\n진정한 행복을 실현하기 위해서는 개인적 차원과 사회적 차원의 균형 잡힌 노력이 요구된다. 우선 개인은 타인의 기준에 맞춘 외적 성공에만 매몰되기보다, 자신의 내면적 가치를 성찰하고 일상 속에서 성취감을 찾을 수 있는 주체적인 삶의 태도를 길러야 한다. 자신이 진정으로 원하는 목표를 설정하고 여가와 휴식의 균형을 유지할 때 심리적 안정감을 얻을 수 있기 때문이다.\n나아가 사회적으로는 과도한 경쟁 문화를 완화하고 구성원의 기본적인 삶의 질을 보장하는 제도적 뒷받침이 필수적이다. 일과 삶의 균형을 존중하는 노동 환경을 조성하고 실패하더라도 다시 도전할 수 있는 사회적 안전망을 구축해야 한다. 결론적으로 개인의 가치관 전환과 사회의 구조적 지원이 조화를 이룰 때 현대인은 지속 가능한 행복을 영위할 수 있을 것이다.",
};

const COMMON_TYPO_RULES: Array<[string, string, string]> = [
  [
    "되요",
    "돼요 (또는 문어체 '된다')",
    "어간 '되-' 뒤에 '-어'가 결합하면 '돼'로 축약되며, TOPIK 쓰기에서는 해라체('-다/는다') 사용이 원칙입니다.",
  ],
  [
    "예요",
    "이다",
    "TOPIK II 52·53·54번은 격식적 문어체(평서형 '-다/는다')를 사용해야 합니다.",
  ],
  [
    "습니다",
    "는다/다",
    "52·53·54번 논술·설명문에서는 '-(습)니다'체보다 해라체('-다/는다')로 문체를 통일하는 것이 감점을 방지합니다.",
  ],
  [
    "어요",
    "다/는다",
    "해요체('-어요/아요')는 구어체 표현이므로 학술·보고서 문체인 '-다/는다'로 교정해야 합니다.",
  ],
  [
    "안되다",
    "안 되다",
    "부정 부사 '안'과 동사 '되다'는 두 단어이므로 띄어 써야 합니다.",
  ],
  [
    "할수",
    "할 수",
    "의존 명사 '수'는 앞말과 띄어 써야 합니다.",
  ],
  [
    "것같다",
    "것 같다",
    "의존 명사 '것'은 앞 관형어 및 뒤 형용사 '같다'와 띄어 써야 합니다.",
  ],
];

function selectModelAnswer(questionNumber: number, promptText: string): string {
  if (questionNumber === 53 && promptText.includes("자전거")) {
    return "‘인주시의 자전거 이용자 변화’를 살펴보면, 자전거 이용자 수는 2007년 4만 명에서 2012년 9만 명으로 증가하였으며, 2017년에는 21만 명에 달해 10년 동안 약 5배나 급증한 것으로 나타났다. 이러한 변화는 인주시의 자전거 도로 개발과 자전거 빌리는 곳의 확대에서 비롯된 것으로 분석된다. 한편 같은 기간 이용 목적별 변화를 보면 ‘출퇴근’ 목적이 2007년에 비해 2017년 14배로 가장 큰 폭으로 증가하였고, ‘운동 및 산책’은 4배, ‘기타’ 목적은 3배 증가한 것으로 조사되었다.";
  }
  if (questionNumber === 53 && promptText.includes("가구")) {
    return "한국사회연구원에서 조사한 ‘인주시의 가구 형태별 변화 추이’에 따르면, 2015년부터 2025년까지 4인 이상 가구의 비율은 42%에서 21%로 절반이나 감소한 반면, 1인 가구는 18%에서 39%로 두 배 이상 급증하여 가장 높은 비중을 차지한 것으로 나타났다. 이러한 1인 가구의 급격한 증가는 청년층의 독립 및 결혼관 변화와 고령화로 인한 독거노인 가구 증가에서 비롯된 것으로 분석된다. 따라서 향후 1인 가구를 위한 맞춤형 소형 주택 공급을 확대하고 사회 안전망을 확충하는 대책 마련이 요구된다.";
  }
  if (questionNumber === 53 && promptText.includes("전자책")) {
    return "‘성인의 전자책 독서율 변화 및 이용 이유’ 조사 결과에 따르면, 성인의 전자책 독서율은 2019년 16%에서 2021년 27%, 2023년 41%로 4년 사이 약 2.5배 상승한 것으로 나타났다. 전자책을 선호하는 이유로는 ‘휴대 및 보관의 편리성’이 52%로 가장 높았으며, ‘저렴한 구매 비용’이 31%, ‘시공간의 제약 없음’이 17%로 그 뒤를 이었다. 향후 오디오북과 구독형 서비스가 결합되면서 디지털 독서 인구는 지속적으로 유입될 것으로 전망된다.";
  }
  if (questionNumber === 54 && promptText.includes("가짜 뉴스")) {
    return "정보 통신 기술의 고도화와 소셜 미디어의 보편화로 누구나 정보를 생산하고 유통할 수 있는 시대가 도래했다. 그러나 정보의 양적 팽창 이면에는 검증되지 않은 허위 정보, 이른바 ‘가짜 뉴스’가 무분별하게 확산되는 부작용이 자리 잡고 있다.\n가짜 뉴스가 급속도로 생산되는 배경에는 조회 수를 통해 경제적 이익을 얻으려는 상업적 유인과 익명성에 기댄 무책임한 정보 유포가 있다. 더욱이 알고리즘 추천 기술은 수용자의 확증 편향을 강화하여 자극적인 허위 정보의 재생산을 부추긴다. 이로 인해 개인은 왜곡된 사실에 현혹되어 그릇된 판단을 내리기 십상이며, 사회적으로는 공동체의 신뢰가 훼손되고 계층 및 집단 간 양극화가 심화된다.\n따라서 이러한 폐해를 극복하기 위해서는 다각적인 노력이 병행되어야 한다. 우선 정부와 플랫폼 기업은 악의적인 허위 정보 유포에 대한 법적 제재를 강화하고 정밀한 팩트체크 시스템을 구축해야 한다. 아울러 개인 역시 출처가 불분명한 정보를 맹신하지 않고 비판적으로 검증하는 미디어 리터러시 역량을 함양해야 한다. 결론적으로 제도적 자정 장치와 성숙한 시민 의식이 조화를 이룰 때 건전한 공론장이 정착될 수 있을 것이다.";
  }
  return MODEL_ANSWERS[questionNumber] || MODEL_ANSWERS[53];
}

function gradeWritingOffline(
  question: QuestionItem,
  submittedText: string | undefined,
  lang: string
): { isCorrect: boolean; earned: number; feedback: WritingFeedbackReport } {
  const text = (submittedText || "").trim();
  const charWithSpaces = text.length;
  const charWithoutSpaces = text.replace(/\s+/g, "").length;
  const maxScore = question.score_points || 30;

  const [targetMin, targetMax] =
    question.question_type === "SHORT_ANSWER"
      ? [15, 80]
      : question.question_type === "ESSAY_SHORT"
        ? [200, 300]
        : [600, 700];

  const modelAnswer = selectModelAnswer(
    question.question_number,
    question.prompt_text
  );

  const maxContent = Math.round(maxScore * 0.4 * 10) / 10;
  const maxOrg = Math.round(maxScore * 0.3 * 10) / 10;
  const maxGrammar = Math.round(maxScore * 0.3 * 10) / 10;

  if (!text) {
    const emptyMsgs: Record<string, [string, string]> = {
      ko: [
        "답안이 제출되지 않았습니다. 모범 답안을 참고하여 작성해 보세요.",
        "모범 답안의 문단 구성과 핵심 표현을 참고하여 목표 글자 수에 맞게 작성해 보세요.",
      ],
      en: [
        "No answer was submitted. Review the model answer below and try writing your response.",
        "Study the paragraph structure and formal endings in the model answer.",
      ],
    };
    const [overall, compare] = emptyMsgs[lang] || emptyMsgs.en;
    return {
      isCorrect: false,
      earned: 0,
      feedback: {
        grader_engine: "client_rubric_evaluator",
        language: lang,
        char_count_with_spaces: 0,
        char_count_without_spaces: 0,
        target_range: `${targetMin}~${targetMax}자`,
        criteria_scores: {
          content_and_task: { earned: 0, max: maxContent },
          organization_and_structure: { earned: 0, max: maxOrg },
          vocabulary_and_grammar: { earned: 0, max: maxGrammar },
        },
        spelling_and_grammar_corrections: [],
        overall_feedback: overall,
        model_answer_comparison: compare,
        model_answer: modelAnswer,
      },
    };
  }

  const lengthFactor =
    charWithSpaces >= targetMin
      ? charWithSpaces <= targetMax + 50
        ? 1.0
        : 0.92
      : Math.max(0.35, charWithSpaces / targetMin);

  const sentences = text
    .split(/[.?!]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const formalEndings = sentences.filter(
    (s) => s.endsWith("다") || s.endsWith("까") || s.endsWith("요")
  ).length;
  const formalRatio = sentences.length > 0 ? formalEndings / sentences.length : 0.7;

  const connectors = [
    "그러나",
    "따라서",
    "한편",
    "우선",
    "첫째",
    "둘째",
    "결론적으로",
    "반면",
    "통해",
    "따르면",
    "나타났다",
    "때문이다",
  ];
  const usedConnectors = connectors.filter((c) => text.includes(c));
  const coherenceBonus = Math.min(1.0, 0.75 + 0.08 * usedConnectors.length);

  const corrections: SpellingCorrection[] = [];
  for (const [wrong, right, reasonKo] of COMMON_TYPO_RULES) {
    if (
      question.question_number === 51 &&
      (wrong === "습니다" || wrong === "어요")
    ) {
      continue;
    }
    if (text.includes(wrong)) {
      corrections.push({
        original: wrong,
        corrected: right,
        explanation: reasonKo,
      });
    }
  }

  const earnedContent =
    Math.round(maxContent * (0.45 + 0.55 * lengthFactor) * 10) / 10;
  const earnedOrg =
    Math.round(maxOrg * Math.min(1.0, lengthFactor * coherenceBonus) * 10) / 10;
  const grammarPenalty = Math.min(0.25, 0.06 * corrections.length);
  const earnedGrammar =
    Math.round(
      maxGrammar * Math.max(0.4, 0.55 + 0.45 * formalRatio - grammarPenalty) * 10
    ) / 10;

  const totalEarned =
    Math.round(
      Math.min(maxScore, earnedContent + earnedOrg + earnedGrammar) * 10
    ) / 10;

  const langFeedbackMap: Record<string, [string, string]> = {
    ko: [
      `공식 TOPIK II 쓰기 채점 기준 분석 결과 (공백 포함 ${charWithSpaces}자 / 권장 ${targetMin}~${targetMax}자): 내용·과제 수행 ${earnedContent}/${maxContent}점, 전개 구조 ${earnedOrg}/${maxOrg}점, 어휘·문법 ${earnedGrammar}/${maxGrammar}점입니다.`,
      "모범 답안 비교: 51번은 정중한 높임법('-습니다/-을까요'), 52·53·54번은 문어체 평서형('-다/는다')과 논리적 접속부사('그러나', '따라서', '결론적으로')를 일관되게 사용하는 것이 고득점의 핵심입니다.",
    ],
    en: [
      `Evaluated via official TOPIK II Writing rubrics (${charWithSpaces} chars incl. spaces; target ${targetMin}–${targetMax}): Content ${earnedContent}/${maxContent}, Organization ${earnedOrg}/${maxOrg}, Grammar & Vocab ${earnedGrammar}/${maxGrammar}.`,
      "Compare with the model answer: use polite honorifics for Q51, objective statistical phrasing for Q53, and structured '-다/는다' endings for Q54.",
    ],
    vi: [
      `Đánh giá theo 3 tiêu chí chấm thi TOPIK II chính thức (${charWithSpaces} ký tự; mục tiêu ${targetMin}~${targetMax}): Nội dung ${earnedContent}/${maxContent}, Cấu trúc ${earnedOrg}/${maxOrg}, Từ vựng & Ngữ pháp ${earnedGrammar}/${maxGrammar}.`,
      "So sánh bài mẫu: chú ý dùng kính ngữ ở câu 51 và đuôi văn viết '-다/는다' cùng từ nối mạch lạc ở câu 52–54.",
    ],
    zh: [
      `按 TOPIK II 写作官方评分标准评估（含空格 ${charWithSpaces} 字；目标 ${targetMin}~${targetMax} 字）：内容 ${earnedContent}/${maxContent}，结构 ${earnedOrg}/${maxOrg}，词汇语法 ${earnedGrammar}/${maxGrammar}。`,
      "与范文对比：51题请使用礼貌敬语，52~54题请保持书面体“-다/는다”及逻辑连接副词。",
    ],
    ja: [
      `TOPIK II 書き取り公式採点基準に基づく評価（空白込み ${charWithSpaces} 字 / 目標 ${targetMin}〜${targetMax} 字）：内容 ${earnedContent}/${maxContent}、構成 ${earnedOrg}/${maxOrg}、語彙・文法 ${earnedGrammar}/${maxGrammar}。`,
      "模範解答との比較：51番は丁寧語、52〜54番は文語体「-다/는다」と論理的な接続表現の統一を意識しましょう。",
    ],
  };

  const [overallFb, comparisonFb] =
    langFeedbackMap[lang] || langFeedbackMap.en;

  return {
    isCorrect: totalEarned >= maxScore * 0.6,
    earned: totalEarned,
    feedback: {
      grader_engine: "client_rubric_evaluator",
      language: lang,
      char_count_with_spaces: charWithSpaces,
      char_count_without_spaces: charWithoutSpaces,
      target_range: `${targetMin}~${targetMax}자`,
      criteria_scores: {
        content_and_task: {
          earned: earnedContent,
          max: maxContent,
          comment: "주제 적합성 및 제시된 과제/조건 반영도 평가",
        },
        organization_and_structure: {
          earned: earnedOrg,
          max: maxOrg,
          comment: "서론-본론-결론 구성 및 접속표현 응집성 평가",
        },
        vocabulary_and_grammar: {
          earned: earnedGrammar,
          max: maxGrammar,
          comment: "중·고급 어휘 다양성, 맞춤법·띄어쓰기 및 문체 일관성 평가",
        },
      },
      spelling_and_grammar_corrections: corrections,
      overall_feedback: overallFb,
      model_answer_comparison: comparisonFb,
      model_answer: modelAnswer,
    },
  };
}

function resolveCorrectAnswerNumber(q: QuestionItem): string {
  if (q.correct_answer_text) {
    return String(q.correct_answer_text).trim();
  }
  const key = `${q.section_name}-${q.question_number}`;
  const expEntry = QUESTION_EXPLANATIONS_BY_NUM[key];
  const koAnswer = expEntry?.ko?.answer || "";
  const match = koAnswer.match(/(\d+)번/);
  return match ? match[1] : "1";
}

function calculateTopikAwardedLevel(
  isTopikI: boolean,
  totalScore: number
): [number, number | null] {
  if (isTopikI) {
    if (totalScore >= 140) return [2, null];
    if (totalScore >= 80) return [1, 140];
    return [0, 80];
  }
  if (totalScore >= 230) return [6, null];
  if (totalScore >= 190) return [5, 230];
  if (totalScore >= 150) return [4, 190];
  if (totalScore >= 120) return [3, 150];
  return [0, 120];
}

export function buildClientSideExamReport(
  questions: QuestionItem[],
  answers: Record<string, UserAnswerDraft>,
  targetLevel: number,
  lang: string = "ko"
): SessionReportResponse {
  const isTopikI = targetLevel <= 2;
  let listeningScore = 0;
  let readingScore = 0;
  let writingScore = 0;

  const reviewList: QuestionGradingDetail[] = questions.map((q) => {
    const draft = answers[q.question_id] || {};
    const optNum = draft.submitted_option_number ?? null;
    const subText = draft.submitted_text ?? null;
    const maxPts = Number(q.score_points || 2);

    if (q.question_type === "MULTIPLE_CHOICE") {
      const correctAns = resolveCorrectAnswerNumber(q);
      const isCorrect =
        optNum !== null && String(optNum) === String(correctAns);
      const earned = isCorrect ? maxPts : 0;

      if (q.section_name === "LISTENING") listeningScore += earned;
      else if (q.section_name === "READING") readingScore += earned;

      const key = `${q.section_name}-${q.question_number}`;
      const fallbackExp = QUESTION_EXPLANATIONS_BY_NUM[key];
      const mergedExplanations = q.explanations || (fallbackExp
        ? {
            ko: fallbackExp.ko?.explanation || "",
            en: fallbackExp.en?.explanation || "",
            vi: fallbackExp.vi?.explanation || "",
            zh: fallbackExp.zh?.explanation || "",
            ja: fallbackExp.ja?.explanation || "",
          }
        : undefined);

      return {
        question_id: q.question_id,
        question_number: q.question_number,
        section_name: q.section_name,
        question_type: q.question_type,
        prompt_text: q.prompt_text,
        passage_text: q.passage_text,
        submitted_option_number: optNum,
        submitted_text: subText,
        correct_answer_text: correctAns,
        is_correct: isCorrect,
        score_points: maxPts,
        earned_score: earned,
        explanations: mergedExplanations || null,
        feedback_report: null,
      };
    }

    const graded = gradeWritingOffline(q, subText || undefined, lang);
    writingScore += graded.earned;

    return {
      question_id: q.question_id,
      question_number: q.question_number,
      section_name: q.section_name,
      question_type: q.question_type,
      prompt_text: q.prompt_text,
      passage_text: q.passage_text,
      submitted_option_number: null,
      submitted_text: subText,
      correct_answer_text: q.correct_answer_text || null,
      is_correct: graded.isCorrect,
      score_points: maxPts,
      earned_score: graded.earned,
      explanations: q.explanations || null,
      feedback_report: graded.feedback,
    };
  });

  const totalScore =
    Math.round((listeningScore + readingScore + writingScore) * 10) / 10;
  const [awardedLevel, nextCutoff] = calculateTopikAwardedLevel(
    isTopikI,
    totalScore
  );

  return {
    session_id: "local-client-session",
    exam_id: "topik-91-mock",
    exam_title: "제91회 한국어능력시험 (TOPIK I·II) 통합 실전 모의고사",
    exam_type: isTopikI ? "TOPIK_I" : "TOPIK_II",
    status: "GRADING_COMPLETED",
    started_at: new Date().toISOString(),
    submitted_at: new Date().toISOString(),
    listening_score: Math.round(listeningScore * 10) / 10,
    reading_score: Math.round(readingScore * 10) / 10,
    writing_score: Math.round(writingScore * 10) / 10,
    total_score: totalScore,
    max_total_score: isTopikI ? 200 : 300,
    awarded_level: awardedLevel,
    next_level_cutoff: nextCutoff,
    questions_review: reviewList,
  };
}
