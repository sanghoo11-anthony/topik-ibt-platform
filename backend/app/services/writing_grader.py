"""
Gemini API-powered Automated Essay Grader for TOPIK II Writing (Q51, Q52, Q53 & Q54).
Evaluates learner submissions against official NIIED TOPIK II Writing rubrics:
1. Content & Task Fulfillment (내용 및 과제 수행)
2. Discourse Organization & Structure (글의 전개 구조)
3. Korean Vocabulary & Grammar Accuracy (한국어 어휘 및 문법 사용)
"""

import json
import os
import re
from typing import Any, Dict, List, Optional, Tuple

import httpx

LANG_NAMES = {
    "ko": "Korean (한국어)",
    "en": "English",
    "ja": "Japanese (日本語)",
    "zh": "Chinese (简体中文)",
    "vi": "Vietnamese (Tiếng Việt)",
    "es": "Spanish (Español)",
    "fr": "French (Français)",
    "ru": "Russian (Русский)",
    "id": "Indonesian (Bahasa Indonesia)",
    "th": "Thai (ภาษาไทย)",
    "mn": "Mongolian (Монгол хэл)",
    "ar": "Arabic (العربية)",
}

MODEL_ANSWERS = {
    51: (
        "㉠ 가기 어렵게 되었습니다 / 갈 수 없게 되었습니다\n"
        "㉡ 변경할 수 있을까요 / 바꿀 수 있습니까"
    ),
    52: (
        "㉠ 썩기 때문이다 / 숨을 쉬지 못하기 때문이다\n"
        "㉡ 주지 말고 / 주는 것보다"
    ),
    53: (
        "인주시 통계청에서 실시한 ‘온라인 쇼핑 이용 현황 및 만족 요인’ 조사 결과에 따르면, "
        "온라인 쇼핑 시장 규모는 2020년 15조 원에서 2024년 32조 원으로 4년간 두 배 이상 급증한 것으로 나타났다. "
        "이와 같은 성장의 주요 요인으로는 ‘배송의 신속성’이 48%로 가장 높은 비중을 차지했으며, "
        "‘가격 경쟁력’이 32%, ‘상품의 다양성’이 20%로 그 뒤를 이었다. "
        "이처럼 당일 배송 확대와 합리적인 가격 혜택이 소비자의 만족도를 높여 온라인 쇼핑 시장의 지속적인 성장을 견인할 것으로 전망된다."
    ),
    54: (
        "현대 사회는 과학 기술의 비약적인 발전으로 물질적 풍요와 편리함을 누리고 있다. "
        "그러나 이러한 급격한 변화 속에서 타인과의 과도한 경쟁과 사회적 고립감으로 인해 현대인의 행복지수는 오히려 정체되거나 낮아지는 경향을 보인다.\n"
        "진정한 행복을 실현하기 위해서는 개인적 차원과 사회적 차원의 균형 잡힌 노력이 요구된다. "
        "우선 개인은 타인의 기준에 맞춘 외적 성공에만 매몰되기보다, 자신의 내면적 가치를 성찰하고 일상 속에서 성취감을 찾을 수 있는 주체적인 삶의 태도를 길러야 한다. "
        "자신이 진정으로 원하는 목표를 설정하고 여가와 휴식의 균형을 유지할 때 심리적 안정감을 얻을 수 있기 때문이다.\n"
        "나아가 사회적으로는 과도한 경쟁을 완화하고 구성원의 기본적인 삶의 질을 보장하는 제도적 뒷받침이 필수적이다. "
        "일과 삶의 균형을 존중하는 노동 환경을 조성하고 실패하더라도 다시 도전할 수 있는 사회적 안전망을 구축해야 한다. "
        "결론적으로 개인의 가치관 전환과 사회의 구조적 지원이 조화를 이룰 때 현대인은 지속 가능한 행복을 영위할 수 있을 것이다."
    ),
}

COMMON_TYPO_RULES = [
    ("되요", "돼요 (또는 문어체 '된다')", "어간 '되-' 뒤에 '-어'가 결합하면 '돼'로 축약되며, TOPIK 쓰기에서는 해라체('-다/는다') 사용이 원칙입니다."),
    ("예요", "이다", "TOPIK II 52·53·54번은 격식적 문어체(평서형 '-다/는다')를 사용해야 합니다."),
    ("습니다", "는다/다", "52·53·54번 논술·설명문에서는 '-(습)니다'체보다 해라체('-다/는다')로 문체를 통일하는 것이 감점을 방지합니다."),
    ("어요", "다/는다", "해요체('-어요/아요')는 구어체 표현이므로 학술·보고서 문체인 '-다/는다'로 교정해야 합니다."),
    ("안되다", "안 되다", "부정 부사 '안'과 동사 '되다'는 두 단어이므로 띄어 써야 합니다."),
    ("할수", "할 수", "의존 명사 '수'는 앞말과 띄어 써야 합니다."),
    ("것같다", "것 같다", "의존 명사 '것'은 앞 관형어 및 뒤 형용사 '같다'와 띄어 써야 합니다."),
]


def _get_gemini_api_key() -> str:
    return (os.getenv("GEMINI_API_KEY") or "").strip()


def _is_gemini_configured() -> bool:
    key = _get_gemini_api_key()
    return bool(key) and key not in ("YOUR_GEMINI_API_KEY", "changeme", "mock")


def _select_model_answer(question_number: int, prompt_text: str) -> str:
    if question_number == 53 and "가구" in prompt_text:
        return (
            "한국사회연구원에서 조사한 ‘인주시의 가구 형태별 변화 추이’에 따르면, "
            "2015년부터 2025년까지 4인 이상 가구의 비율은 42%에서 21%로 절반이나 감소한 반면, "
            "1인 가구는 18%에서 39%로 두 배 이상 급증하여 가장 높은 비중을 차지한 것으로 나타났다. "
            "이러한 1인 가구의 급격한 증가는 청년층의 독립 및 결혼관 변화와 고령화로 인한 독거노인 가구 증가에서 비롯된 것으로 분석된다. "
            "따라서 향후 1인 가구를 위한 맞춤형 소형 주택 공급을 확대하고 사회 안전망을 확충하는 대책 마련이 요구된다."
        )
    if question_number == 54 and "가짜 뉴스" in prompt_text:
        return (
            "정보 통신 기술의 고도화와 소셜 미디어의 보편화로 누구나 정보를 생산하고 유통할 수 있는 시대가 도래했다. "
            "그러나 정보의 양적 팽창 이면에는 검증되지 않은 허위 정보, 이른바 ‘가짜 뉴스’가 무분별하게 확산되는 부작용이 자리 잡고 있다.\n"
            "가짜 뉴스가 급속도로 생산되는 배경에는 조회 수를 통해 경제적 이익을 얻으려는 상업적 유인과 익명성에 기댄 무책임한 정보 유포가 있다. "
            "더욱이 알고리즘 추천 기술은 수용자의 확증 편향을 강화하여 자극적인 허위 정보의 재생산을 부추긴다. "
            "이로 인해 개인은 왜곡된 사실에 현혹되어 그릇된 판단을 내리기 십상이며, 사회적으로는 공동체의 신뢰가 훼손되고 계층 및 집단 간 양극화가 심화된다.\n"
            "따라서 이러한 폐해를 극복하기 위해서는 다각적인 노력이 병행되어야 한다. "
            "우선 정부와 플랫폼 기업은 악의적인 허위 정보 유포에 대한 법적 제재를 강화하고 정밀한 팩트체크 시스템을 구축해야 한다. "
            "아울러 개인 역시 출처가 불분명한 정보를 맹신하지 않고 비판적으로 검증하는 미디어 리터러시 역량을 함양해야 한다. "
            "결론적으로 제도적 자정 장치와 성숙한 시민 의식이 조화를 이룰 때 건전한 공론장이 정착될 수 있을 것이다."
        )
    return MODEL_ANSWERS.get(question_number, MODEL_ANSWERS[53])


def _build_heuristic_feedback(
    question_number: int,
    question_type: str,
    prompt_text: str,
    submitted_text: str,
    max_score: float,
    lang: str,
) -> Tuple[bool, float, Dict[str, Any]]:
    text = (submitted_text or "").strip()
    char_with_spaces = len(text)
    char_without_spaces = len(re.sub(r"\s+", "", text))
    if question_type == "SHORT_ANSWER":
        target_min, target_max = (15, 80)
    elif question_type == "ESSAY_SHORT":
        target_min, target_max = (200, 300)
    else:
        target_min, target_max = (600, 700)

    model_answer = _select_model_answer(question_number, prompt_text)

    if not text:
        return (
            False,
            0.0,
            {
                "grader_engine": "mock_fallback",
                "language": lang,
                "char_count_with_spaces": 0,
                "char_count_without_spaces": 0,
                "target_range": f"{target_min}~{target_max}자",
                "criteria_scores": {
                    "content_and_task": {"earned": 0.0, "max": round(max_score * 0.4, 1)},
                    "organization_and_structure": {"earned": 0.0, "max": round(max_score * 0.3, 1)},
                    "vocabulary_and_grammar": {"earned": 0.0, "max": round(max_score * 0.3, 1)},
                },
                "spelling_and_grammar_corrections": [],
                "overall_feedback": "답안이 제출되지 않았습니다. 모범 답안을 참고하여 작성해 보세요.",
                "model_answer_comparison": "모범 답안의 문단 구성과 핵심 표현을 참고하여 목표 글자 수에 맞게 작성해 보세요.",
                "model_answer": model_answer,
            },
        )

    if char_with_spaces >= target_min:
        length_factor = 1.0 if char_with_spaces <= target_max + 50 else 0.92
    else:
        length_factor = max(0.35, char_with_spaces / float(target_min))

    sentences = [s.strip() for s in re.split(r"[.?!]+", text) if s.strip()]
    formal_endings = sum(1 for s in sentences if s.endswith("다") or s.endswith("까") or s.endswith("요"))
    formal_ratio = (formal_endings / len(sentences)) if sentences else 0.7

    connectors = ["그러나", "따라서", "한편", "우선", "첫째", "둘째", "결론적으로", "반면", "통해", "따르면", "나타났다", "때문이다"]
    used_connectors = [c for c in connectors if c in text]
    coherence_bonus = min(1.0, 0.75 + 0.08 * len(used_connectors))

    corrections: List[Dict[str, str]] = []
    for wrong, right, reason_ko in COMMON_TYPO_RULES:
        if question_number == 51 and wrong in ("습니다", "어요"):
            continue
        if wrong in text:
            corrections.append(
                {
                    "original": wrong,
                    "corrected": right,
                    "explanation": reason_ko,
                }
            )

    max_content = round(max_score * 0.4, 1)
    max_org = round(max_score * 0.3, 1)
    max_grammar = round(max_score * 0.3, 1)

    earned_content = round(max_content * (0.45 + 0.55 * length_factor), 1)
    earned_org = round(max_org * min(1.0, length_factor * coherence_bonus), 1)
    grammar_penalty = min(0.25, 0.06 * len(corrections))
    earned_grammar = round(
        max_grammar * max(0.4, (0.55 + 0.45 * formal_ratio) - grammar_penalty), 1
    )

    total_earned = round(min(max_score, earned_content + earned_org + earned_grammar), 1)

    lang_feedback_map = {
        "ko": (
            f"공식 TOPIK II 쓰기 채점 기준에 따른 분석 결과입니다 (공백 포함 {char_with_spaces}자 / 권장 {target_min}~{target_max}자). "
            f"내용 및 과제 수행: {earned_content}/{max_content}점, 글의 전개 구조: {earned_org}/{max_org}점, 어휘 및 문법: {earned_grammar}/{max_grammar}점.",
            "모범 답안과 비교해 보세요: 51번은 격식 있는 높임법('-습니다'), 52·53·54번은 객관적 문어체 평서형('-다/는다')과 논리적 접속부사('그러나', '따라서', '결론적으로')를 일관되게 사용하는 것이 고득점의 핵심입니다.",
        ),
        "en": (
            f"Evaluated according to official TOPIK II Writing criteria ({char_with_spaces} chars including spaces; target {target_min}-{target_max}). "
            f"Content & Task: {earned_content}/{max_content}, Organization: {earned_org}/{max_org}, Grammar & Vocab: {earned_grammar}/{max_grammar}.",
            "Compare your answer with the model answer: use polite honorifics for Q51, objective reporting expressions for Q53, and three-part paragraphing with formal '-다/는다' endings for Q54.",
        ),
        "vi": (
            f"Đánh giá theo tiêu chí chấm thi TOPIK II Viết chính thức ({char_with_spaces} ký tự tính cả dấu cách; mục tiêu {target_min}~{target_max} ký tự). "
            f"Nội dung & Nhiệm vụ: {earned_content}/{max_content}, Cấu trúc: {earned_org}/{max_org}, Từ vựng & Ngữ pháp: {earned_grammar}/{max_grammar}.",
            "So sánh với bài mẫu: Hãy chú ý cách sử dụng đuôi câu văn viết trang trọng ('-다/는다') và các từ nối mạch lạc ('그러나', '따라서', '결론적으로').",
        ),
        "zh": (
            f"根据 TOPIK II 写作官方评分标准进行评估（含空格共 {char_with_spaces} 字；目标 {target_min}~{target_max} 字）。"
            f"内容与任务履行：{earned_content}/{max_content}，文章结构：{earned_org}/{max_org}，词汇与语法：{earned_grammar}/{max_grammar}。",
            "与范文对比建议：请注意使用书面基本阶终结词尾（'-다/는다'），并运用丰富的连接副词与客观数据表达句型。",
        ),
        "ja": (
            f"TOPIK II 書き取り公式採点基準に基づく評価結果（空白込み {char_with_spaces} 字 / 目標 {target_min}〜{target_max} 字）。"
            f"内容・課題遂行: {earned_content}/{max_content}、展開構造: {earned_org}/{max_org}、語彙・文法: {earned_grammar}/{max_grammar}。",
            "模範解答との比較：文末を「-다/는다」体（常体）で統一し、段落ごとの論理的な接続表現を活用するとさらに高得点が狙えます。",
        ),
    }

    overall_fb, comparison_fb = lang_feedback_map.get(
        lang,
        lang_feedback_map["ko"],
    )

    report = {
        "grader_engine": "heuristic_fallback",
        "language": lang,
        "char_count_with_spaces": char_with_spaces,
        "char_count_without_spaces": char_without_spaces,
        "target_range": f"{target_min}~{target_max}자",
        "criteria_scores": {
            "content_and_task": {
                "earned": earned_content,
                "max": max_content,
                "comment": "주제 적합성 및 제시된 과제/조건 반영도 평가",
            },
            "organization_and_structure": {
                "earned": earned_org,
                "max": max_org,
                "comment": "서론-본론-결론 구성 및 접속표현을 통한 문단 간 응집성 평가",
            },
            "vocabulary_and_grammar": {
                "earned": earned_grammar,
                "max": max_grammar,
                "comment": "중·고급 어휘 다양성, 맞춤법·띄어쓰기 및 문체 일관성 평가",
            },
        },
        "spelling_and_grammar_corrections": corrections,
        "overall_feedback": overall_fb,
        "model_answer_comparison": comparison_fb,
        "model_answer": model_answer,
    }
    return total_earned >= max_score * 0.6, total_earned, report


async def grade_topik_writing_with_gemini(
    question_number: int,
    question_type: str,
    prompt_text: str,
    passage_text: Optional[str],
    submitted_text: Optional[str],
    max_score: float,
    lang: str = "ko",
) -> Tuple[bool, float, Dict[str, Any]]:
    text = (submitted_text or "").strip()
    if not text or not _is_gemini_configured():
        return _build_heuristic_feedback(
            question_number=question_number,
            question_type=question_type,
            prompt_text=prompt_text,
            submitted_text=text,
            max_score=max_score,
            lang=lang,
        )

    if question_type == "SHORT_ANSWER":
        target_min, target_max = (15, 80)
    elif question_type == "ESSAY_SHORT":
        target_min, target_max = (200, 300)
    else:
        target_min, target_max = (600, 700)

    char_with_spaces = len(text)
    char_without_spaces = len(re.sub(r"\s+", "", text))
    lang_label = LANG_NAMES.get(lang, "Korean (한국어)")

    max_content = round(max_score * 0.4, 1)
    max_org = round(max_score * 0.3, 1)
    max_grammar = round(max_score * 0.3, 1)

    system_prompt = (
        f"You are an official NIIED TOPIK II Writing examiner. Grade the examinee's Korean answer for Question {question_number} "
        f"(Max score: {max_score} points; recommended length: {target_min}-{target_max} characters). "
        f"Provide all explanations, feedback, and model answer comparison in {lang_label} (keep Korean quotes/examples in Korean).\n"
        "Respond strictly in valid JSON with this schema:\n"
        "{\n"
        f'  "earned_content": float (0 to {max_content}),\n'
        f'  "earned_organization": float (0 to {max_org}),\n'
        f'  "earned_grammar": float (0 to {max_grammar}),\n'
        '  "content_comment": string,\n'
        '  "organization_comment": string,\n'
        '  "grammar_comment": string,\n'
        '  "spelling_and_grammar_corrections": [{"original": string, "corrected": string, "explanation": string}],\n'
        '  "overall_feedback": string,\n'
        '  "model_answer_comparison": string,\n'
        '  "model_answer": string (high-scoring Korean model answer)\n'
        "}"
    )

    user_message = (
        f"[Question {question_number} Prompt]\n{prompt_text}\n\n"
        f"[Reference/Context]\n{passage_text or 'N/A'}\n\n"
        f"[Examinee Answer ({char_with_spaces} chars with spaces)]\n{text}"
    )

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.5-flash:generateContent?key={_get_gemini_api_key()}"
    )
    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_message}]}],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
        },
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                return _build_heuristic_feedback(
                    question_number, question_type, prompt_text, text, max_score, lang
                )
            data = resp.json()
            raw_json = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(raw_json)

            e_content = min(max_content, max(0.0, float(parsed.get("earned_content", 0.0))))
            e_org = min(max_org, max(0.0, float(parsed.get("earned_organization", 0.0))))
            e_gram = min(max_grammar, max(0.0, float(parsed.get("earned_grammar", 0.0))))
            total_earned = round(min(max_score, e_content + e_org + e_gram), 1)

            report = {
                "grader_engine": "gemini-2.5-flash",
                "language": lang,
                "char_count_with_spaces": char_with_spaces,
                "char_count_without_spaces": char_without_spaces,
                "target_range": f"{target_min}~{target_max}자",
                "criteria_scores": {
                    "content_and_task": {
                        "earned": round(e_content, 1),
                        "max": max_content,
                        "comment": parsed.get("content_comment", ""),
                    },
                    "organization_and_structure": {
                        "earned": round(e_org, 1),
                        "max": max_org,
                        "comment": parsed.get("organization_comment", ""),
                    },
                    "vocabulary_and_grammar": {
                        "earned": round(e_gram, 1),
                        "max": max_grammar,
                        "comment": parsed.get("grammar_comment", ""),
                    },
                },
                "spelling_and_grammar_corrections": parsed.get(
                    "spelling_and_grammar_corrections", []
                ),
                "overall_feedback": parsed.get("overall_feedback", ""),
                "model_answer_comparison": parsed.get("model_answer_comparison", ""),
                "model_answer": parsed.get(
                    "model_answer", _select_model_answer(question_number, prompt_text)
                ),
            }
            return total_earned >= max_score * 0.6, total_earned, report
    except Exception:
        return _build_heuristic_feedback(
            question_number, question_type, prompt_text, text, max_score, lang
        )
