import os
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from supabase import create_client, Client
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/v1/attempts", tags=["Attempt Analysis"])

# 1. 외부 클라이언트 초기화 (Supabase & Google Gemini)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

supabase: Optional[Client] = (
    create_client(SUPABASE_URL, SUPABASE_KEY)
    if SUPABASE_URL and SUPABASE_KEY
    else None
)
ai_client: Optional[genai.Client] = (
    genai.Client(api_key=GEMINI_API_KEY)
    if GEMINI_API_KEY
    else None
)


def _ensure_clients() -> Tuple[Client, genai.Client]:
    """Supabase와 Gemini 클라이언트를 검증·반환하며, 누락 시 예외를 발생시킵니다."""
    global SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY, supabase, ai_client

    if supabase is not None and ai_client is not None:
        return supabase, ai_client

    load_dotenv()
    SUPABASE_URL = SUPABASE_URL or os.getenv("SUPABASE_URL")
    SUPABASE_KEY = SUPABASE_KEY or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    GEMINI_API_KEY = GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")

    if not all([SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY]):
        raise RuntimeError(
            "필수 환경 변수(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY)가 누락되었습니다."
        )

    if supabase is None:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    if ai_client is None:
        ai_client = genai.Client(api_key=GEMINI_API_KEY)

    return supabase, ai_client


# 2. Pydantic 요청/응답 스키마 정의
class AnalyzeAttemptRequest(BaseModel):
    user_id: str = Field(..., description="응시한 회원의 UUID")
    force_regenerate: bool = Field(
        default=False,
        description="기존 리포트가 있어도 재생성할지 여부",
    )


class FeedbackReportResponse(BaseModel):
    report_id: str
    attempt_id: str
    weakness_summary: Dict[str, Any]
    ai_feedback_text: str
    recommended_question_ids: List[str]


# 3. 핵심 통계 및 시간 관리 패턴 분석 함수
def compute_weakness_statistics(
    answers_with_questions: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    문항별 풀이 로그와 문항 메타데이터를 결합해:
    1) 유형별(question_type) 정답률 및 평균 풀이 시간
    2) 오답의 3가지 행동 패턴(시간부족 찍기형 / 개념·어휘 부족형 / 함정보기 선택형)
    3) 가장 시급한 취약 유형 Top 3 및 취약 문법·어휘 태그 Top 5를 추출합니다.
    """
    type_stats: Dict[str, Dict[str, Any]] = defaultdict(
        lambda: {
            "total": 0,
            "correct": 0,
            "total_time_sec": 0,
            "wrong_cases": [],
            "error_patterns": {
                "rushed_guessing": 0,
                "concept_deficit": 0,
                "attractive_distractor": 0,
            },
        }
    )
    missed_tags_counter: Dict[str, int] = defaultdict(int)

    # 1차 순회: 유형별 기본 집계 및 평균 시간 계산용 데이터 수집
    for row in answers_with_questions:
        q = row.get("questions")
        if not q:
            continue

        q_type = q.get("question_type", "general")
        is_correct = row.get("is_correct", False)
        time_spent = row.get("time_spent_sec") or 0

        type_stats[q_type]["total"] += 1
        type_stats[q_type]["total_time_sec"] += time_spent
        if is_correct:
            type_stats[q_type]["correct"] += 1

    # 2차 순회: 유형별 평균 시간 대비 오답 원인 패턴 분류
    for row in answers_with_questions:
        q = row.get("questions")
        if not q or row.get("is_correct", False):
            continue

        q_type = q.get("question_type", "general")
        stat = type_stats[q_type]
        avg_time = (
            (stat["total_time_sec"] / stat["total"]) if stat["total"] > 0 else 45.0
        )
        time_spent = row.get("time_spent_sec") or 0

        # 오답 행동 패턴 분류 로직
        if avg_time > 0 and time_spent < (avg_time * 0.3):
            pattern = "rushed_guessing"  # 평균 시간의 30% 미만: 시간 부족 찍기형
        elif time_spent > (avg_time * 1.3):
            pattern = "concept_deficit"  # 평균 시간의 130% 초과: 개념·어휘 부족형
        else:
            pattern = "attractive_distractor"  # 적정 시간 풀이 후 함정 보기 선택형

        stat["error_patterns"][pattern] += 1

        # 취약 문법·어휘 태그 집계
        for tag in q.get("grammar_vocab_tags") or []:
            missed_tags_counter[tag] += 1

        # AI 프롬프트에 전달할 핵심 오답 사례 요약 (토큰 절약을 위해 지문 앞 220자만 발췌)
        content_json = q.get("content") or {}
        prompt_snippet = str(
            content_json.get("question_text") or content_json.get("passage", "")
        )[:220]

        stat["wrong_cases"].append(
            {
                "question_id": q.get("id"),
                "section": q.get("section"),
                "snippet": prompt_snippet,
                "selected_option": row.get("selected_option"),
                "correct_answer": q.get("correct_answer"),
                "time_spent_sec": time_spent,
                "error_pattern": pattern,
                "tags": q.get("grammar_vocab_tags") or [],
            }
        )

    # 유형별 정답률 계산 및 취약 순위 정렬 (정답률 낮은 순 -> 오답 수 많은 순)
    summary_by_type = {}
    ranked_weaknesses = []

    for q_type, stat in type_stats.items():
        total = stat["total"]
        correct = stat["correct"]
        wrong_count = total - correct
        accuracy_rate = round((correct / total) * 100, 1) if total > 0 else 0.0
        avg_time_sec = round(stat["total_time_sec"] / total, 1) if total > 0 else 0.0

        summary_by_type[q_type] = {
            "total_questions": total,
            "correct_count": correct,
            "accuracy_rate": accuracy_rate,
            "avg_time_sec": avg_time_sec,
            "error_patterns": stat["error_patterns"],
        }

        if wrong_count > 0:
            ranked_weaknesses.append(
                {
                    "question_type": q_type,
                    "accuracy_rate": accuracy_rate,
                    "wrong_count": wrong_count,
                    "avg_time_sec": avg_time_sec,
                    "error_patterns": stat["error_patterns"],
                    "sample_wrong_cases": stat["wrong_cases"][:3],
                }
            )

    ranked_weaknesses.sort(key=lambda x: (x["accuracy_rate"], -x["wrong_count"]))
    top_3_weak_types = ranked_weaknesses[:3]
    top_missed_tags = sorted(missed_tags_counter.items(), key=lambda x: -x[1])[:5]

    return {
        "by_question_type": summary_by_type,
        "top_weaknesses": top_3_weak_types,
        "top_missed_tags": [tag for tag, _ in top_missed_tags],
    }


# 4. 취약 유형 기반 미풀이 추천 문항 추출 함수
def get_recommended_questions(
    user_id: str,
    weak_types: List[str],
    topik_level: Optional[str] = None,
    limit: int = 6,
) -> List[str]:
    """
    도출된 취약 유형(question_type)에 해당하면서,
    회원이 지금까지 한 번도 풀지 않은 문항 ID 최대 `limit`개를 우선 추천합니다.
    """
    if not weak_types:
        return []

    sb_client, _ = _ensure_clients()

    # 회원이 이미 푼 문항 ID 목록 조회
    past_attempts = (
        sb_client.table("test_attempts").select("id").eq("user_id", user_id).execute()
    )
    attempt_ids = [a["id"] for a in (past_attempts.data or [])]

    solved_q_ids = set()
    if attempt_ids:
        solved_rows = (
            sb_client.table("attempt_answers")
            .select("question_id")
            .in_("attempt_id", attempt_ids)
            .execute()
        )
        solved_q_ids = {r["question_id"] for r in (solved_rows.data or [])}

    # 취약 유형 문항 후보 조회
    query = sb_client.table("questions").select("id").in_("question_type", weak_types)
    if topik_level:
        query = query.eq("topik_level", topik_level)

    candidates = query.limit(40).execute().data or []
    unsolved_ids = [c["id"] for c in candidates if c["id"] not in solved_q_ids]

    return unsolved_ids[:limit]


# 5. Gemini API 맞춤형 학습 피드백 생성 함수
def generate_personalized_feedback(
    weakness_summary: Dict[str, Any],
    native_lang: str,
    target_level: int,
) -> str:
    """
    정제된 취약 유형 통계와 오답 사례를 바탕으로
    학습자의 모국어(native_lang)로 구체적인 오답 원인과 학습 처방을 Markdown으로 생성합니다.
    """
    _, gemini_client = _ensure_clients()
    top_weaknesses = weakness_summary.get("top_weaknesses", [])

    if not top_weaknesses:
        prompt = f"""
        You are an expert TOPIK (Test of Proficiency in Korean) tutor.
        The student scored 100% on this practice session!
        - Target TOPIK Level: {target_level}
        - Feedback Language Code: {native_lang}

        Write a concise, encouraging congratulatory message in Markdown in '{native_lang}',
        and suggest 2 actionable next steps to master TOPIK {min(target_level + 1, 6)} vocabulary and time management.
        """
    else:
        prompt = f"""
        You are an expert TOPIK (Test of Proficiency in Korean) diagnostic tutor.
        Analyze the student's test performance summary below and provide personalized, actionable feedback.

        [Student Profile]
        - Target TOPIK Level: Level {target_level}
        - Output Language (CRITICAL: write the entire response in this language): {native_lang}

        [Diagnostic Data (JSON)]
        {weakness_summary}

        [Error Pattern Definitions]
        - rushed_guessing: Answered in less than 30% of average time (time management issue / rushed at the end).
        - concept_deficit: Spent over 130% of average time and still missed (lack of grammar/vocabulary knowledge).
        - attractive_distractor: Normal pacing, but tricked by a confusing distractor option.

        [Required Output Structure in Markdown]
        1. **Overall Diagnosis**: 2-3 sentences summarizing accuracy and pacing habits.
        2. **Top Weaknesses & Trap Analysis**: For each weak `question_type`, explain *why* they missed the sample questions (comparing their `selected_option` vs `correct_answer`) and address their specific time-management pattern.
        3. **3-Step Action Plan**: Concrete study prescriptions focusing on `top_missed_tags` and time allocation.
        """

    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.4,
        ),
    )
    return response.text or ""


# 6. 메인 API 엔드포인트: 분석 실행 및 feedback_reports 저장
@router.post("/{attempt_id}/analyze", response_model=FeedbackReportResponse)
async def analyze_and_save_feedback(
    attempt_id: str,
    payload: AnalyzeAttemptRequest,
):
    """특정 응시 기록의 오답 통계·시간 패턴을 분석해 추천 문항과 Gemini 맞춤 피드백을 생성·저장합니다."""
    sb_client, _ = _ensure_clients()

    # (1) 기존 리포트 존재 여부 확인 (중복 AI API 호출 방지)
    if not payload.force_regenerate:
        existing = (
            sb_client.table("feedback_reports")
            .select("*")
            .eq("attempt_id", attempt_id)
            .eq("user_id", payload.user_id)
            .execute()
        )
        if existing.data:
            report = existing.data[0]
            return FeedbackReportResponse(
                report_id=report["id"],
                attempt_id=report["attempt_id"],
                weakness_summary=report["weakness_summary"],
                ai_feedback_text=report["ai_feedback_text"],
                recommended_question_ids=report.get("recommended_question_ids") or [],
            )

    # (2) 응시 세션 유효성 및 소유자 검증
    attempt_res = (
        sb_client.table("test_attempts")
        .select("*")
        .eq("id", attempt_id)
        .eq("user_id", payload.user_id)
        .execute()
    )
    if not attempt_res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 응시 기록을 찾을 수 없거나 접근 권한이 없습니다.",
        )

    # (3) 회원 프로필(모국어, 목표 급수) 조회
    profile_res = (
        sb_client.table("profiles")
        .select("native_lang, native_language, target_level")
        .eq("id", payload.user_id)
        .execute()
    )
    profile = (
        profile_res.data[0]
        if profile_res.data
        else {"native_lang": "en", "target_level": 3}
    )

    # (4) attempt_answers + questions 조인 조회
    answers_res = (
        sb_client.table("attempt_answers")
        .select(
            "id, selected_option, is_correct, time_spent_sec, "
            "questions(id, topik_level, section, question_type, grammar_vocab_tags, content, correct_answer)"
        )
        .eq("attempt_id", attempt_id)
        .execute()
    )
    answers_data = answers_res.data or []
    if not answers_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="분석할 문항 풀이 데이터(attempt_answers)가 없습니다.",
        )

    # (5) 통계 분석 및 시간 관리 패턴 산출
    weakness_summary = compute_weakness_statistics(answers_data)

    # (6) 취약 유형 기반 미풀이 추천 문항 ID 추출
    weak_types = [w["question_type"] for w in weakness_summary["top_weaknesses"]]
    first_q = answers_data[0].get("questions") or {}
    topik_level = first_q.get("topik_level")

    recommended_ids = get_recommended_questions(
        user_id=payload.user_id,
        weak_types=weak_types,
        topik_level=topik_level,
        limit=6,
    )

    # (7) Gemini API 호출하여 맞춤형 피드백 텍스트 생성
    native_lang = profile.get("native_lang") or profile.get("native_language") or "en"
    ai_feedback_text = generate_personalized_feedback(
        weakness_summary=weakness_summary,
        native_lang=native_lang,
        target_level=profile.get("target_level", 3),
    )

    # (8) feedback_reports 테이블에 저장 (재생성 요청인 경우 기존 레코드 삭제 후 삽입)
    if payload.force_regenerate:
        sb_client.table("feedback_reports").delete().eq(
            "attempt_id", attempt_id
        ).execute()

    insert_payload = {
        "attempt_id": attempt_id,
        "user_id": payload.user_id,
        "weakness_summary": weakness_summary,
        "ai_feedback_text": ai_feedback_text,
        "recommended_question_ids": recommended_ids,
    }

    saved_res = sb_client.table("feedback_reports").insert(insert_payload).execute()
    if not saved_res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="피드백 리포트 DB 저장에 실패했습니다.",
        )

    saved_report = saved_res.data[0]
    return FeedbackReportResponse(
        report_id=saved_report["id"],
        attempt_id=saved_report["attempt_id"],
        weakness_summary=saved_report["weakness_summary"],
        ai_feedback_text=saved_report["ai_feedback_text"],
        recommended_question_ids=saved_report.get("recommended_question_ids") or [],
    )
