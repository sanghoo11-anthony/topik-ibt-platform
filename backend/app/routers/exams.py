import json
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db, redis_client
from app.data.study_bank import QUESTION_BANK
from app.models.exam import (
    Exam,
    ExamSession,
    Question,
    Section,
    User,
    UserAnswer,
)
from app.schemas.exam import (
    AnswerAutoSaveRequest,
    AnswerAutoSaveResponse,
    OptionItemSchema,
    QuestionGradingDetail,
    QuestionItemSchema,
    SessionReportResponse,
    SessionStartRequest,
    SessionStartResponse,
    SessionSubmitRequest,
    SingleAnswerPayload,
)
from app.services.writing_grader import grade_topik_writing_with_gemini

router = APIRouter(tags=["exam_sessions"])

# In-memory fallback store so frontend testing works even if PostgreSQL/Docker is offline
FALLBACK_SESSIONS: Dict[str, Dict[str, Any]] = {}
FALLBACK_EXAM_ID = "00000000-0000-0000-0000-000000000091"
FALLBACK_USER_ID = "00000000-0000-0000-0000-000000000001"

FALLBACK_SAMPLE_QUESTIONS: List[Dict[str, Any]] = QUESTION_BANK


def calculate_topik_level(exam_type: str, total_score: float) -> tuple[int, Optional[int]]:
    """
    Calculates (awarded_level, next_level_cutoff) based on PROJECT_SPEC.md Section 2.1.
    - TOPIK I (Max 200): Level 1 (>=80), Level 2 (>=140)
    - TOPIK II (Max 300): Level 3 (>=120), Level 4 (>=150), Level 5 (>=190), Level 6 (>=230)
    """
    if exam_type == "TOPIK_I":
        if total_score >= 140:
            return 2, None
        if total_score >= 80:
            return 1, 140
        return 0, 80

    if total_score >= 230:
        return 6, None
    if total_score >= 190:
        return 5, 230
    if total_score >= 150:
        return 4, 190
    if total_score >= 120:
        return 3, 150
    return 0, 120


async def _start_session_impl(
    payload: SessionStartRequest,
    db: AsyncSession,
) -> SessionStartResponse:
    now = datetime.now(timezone.utc)

    try:
        user_obj: Optional[User] = None
        if payload.user_id:
            try:
                u_uuid = uuid.UUID(payload.user_id)
                res = await db.execute(select(User).where(User.user_id == u_uuid))
                user_obj = res.scalar_one_or_none()
            except ValueError:
                user_obj = None

        if not user_obj:
            res = await db.execute(select(User).limit(1))
            user_obj = res.scalar_one_or_none()
            if not user_obj:
                user_obj = User(
                    email="learner@example.com",
                    password_hash="$2b$12$demo_hashed_password_placeholder",
                    full_name="Global Learner",
                    native_language="en",
                    target_topik_level=4,
                    timezone="UTC",
                )
                db.add(user_obj)
                await db.flush()

        exam_stmt = select(Exam).options(
            selectinload(Exam.sections)
            .selectinload(Section.questions)
            .selectinload(Question.options)
        )
        if payload.exam_id:
            try:
                e_uuid = uuid.UUID(payload.exam_id)
                exam_stmt = exam_stmt.where(Exam.exam_id == e_uuid)
            except ValueError:
                pass
        else:
            exam_stmt = exam_stmt.where(Exam.exam_type == payload.exam_type).order_by(
                Exam.created_at.desc()
            )

        exam_res = await db.execute(exam_stmt)
        exam_obj = exam_res.scalars().first()
        if not exam_obj:
            raise RuntimeError("No seeded exam found in PostgreSQL; switching to fallback mode.")

        new_session = ExamSession(
            user_id=user_obj.user_id,
            exam_id=exam_obj.exam_id,
            status="IN_PROGRESS",
        )
        db.add(new_session)
        await db.commit()
        await db.refresh(new_session)

        questions_out: List[QuestionItemSchema] = []
        sorted_sections = sorted(exam_obj.sections, key=lambda s: s.section_order)
        for sec in sorted_sections:
            sorted_qs = sorted(sec.questions, key=lambda q: q.question_number)
            for q in sorted_qs:
                questions_out.append(
                    QuestionItemSchema(
                        question_id=str(q.question_id),
                        section_name=sec.section_name,
                        question_number=q.question_number,
                        question_type=q.question_type,
                        difficulty_level=q.difficulty_level,
                        score_points=float(q.score_points),
                        audio_url=q.audio_url,
                        passage_text=q.passage_text,
                        prompt_text=q.prompt_text,
                        options=[
                            OptionItemSchema(
                                option_number=opt.option_number,
                                option_text=opt.option_text,
                            )
                            for opt in q.options
                        ],
                    )
                )

        remaining_seconds = int(exam_obj.total_time_limit_minutes) * 60
        session_id_str = str(new_session.session_id)

        try:
            await redis_client.setex(
                f"session:{session_id_str}:timer",
                remaining_seconds,
                str(remaining_seconds),
            )
        except Exception:
            pass

        return SessionStartResponse(
            session_id=session_id_str,
            user_id=str(user_obj.user_id),
            exam_id=str(exam_obj.exam_id),
            exam_title=exam_obj.title,
            exam_type=exam_obj.exam_type,
            status=new_session.status,
            remaining_seconds=remaining_seconds,
            started_at=new_session.started_at or now,
            questions=questions_out,
        )
    except Exception:
        session_id_str = str(uuid.uuid4())
        remaining_seconds = 120 * 60
        FALLBACK_SESSIONS[session_id_str] = {
            "session_id": session_id_str,
            "user_id": payload.user_id or FALLBACK_USER_ID,
            "exam_id": payload.exam_id or FALLBACK_EXAM_ID,
            "exam_title": "제91회 한국어능력시험 (TOPIK II)",
            "exam_type": payload.exam_type or "TOPIK_II",
            "status": "IN_PROGRESS",
            "remaining_seconds": remaining_seconds,
            "started_at": now,
            "submitted_at": None,
            "answers": {},
            "report": None,
        }
        try:
            await redis_client.setex(
                f"session:{session_id_str}:timer",
                remaining_seconds,
                str(remaining_seconds),
            )
        except Exception:
            pass

        return SessionStartResponse(
            session_id=session_id_str,
            user_id=payload.user_id or FALLBACK_USER_ID,
            exam_id=payload.exam_id or FALLBACK_EXAM_ID,
            exam_title="제91회 한국어능력시험 (TOPIK II)",
            exam_type=payload.exam_type or "TOPIK_II",
            status="IN_PROGRESS",
            remaining_seconds=remaining_seconds,
            started_at=now,
            questions=[
                QuestionItemSchema(
                    question_id=q["question_id"],
                    section_name=q["section_name"],
                    question_number=q["question_number"],
                    question_type=q["question_type"],
                    difficulty_level=q["difficulty_level"],
                    score_points=q["score_points"],
                    audio_url=q["audio_url"],
                    passage_text=q["passage_text"],
                    prompt_text=q["prompt_text"],
                    options=[OptionItemSchema(**opt) for opt in q["options"]],
                )
                for q in FALLBACK_SAMPLE_QUESTIONS
            ],
        )


async def _autosave_answers_impl(
    payload: AnswerAutoSaveRequest,
    db: AsyncSession,
) -> AnswerAutoSaveResponse:
    now = datetime.now(timezone.utc)
    items: List[SingleAnswerPayload] = list(payload.answers or [])
    if payload.question_id:
        items.append(
            SingleAnswerPayload(
                question_id=payload.question_id,
                submitted_option_number=payload.submitted_option_number,
                submitted_text=payload.submitted_text,
            )
        )

    try:
        if items:
            mapping = {
                item.question_id: json.dumps(
                    {
                        "submitted_option_number": item.submitted_option_number,
                        "submitted_text": item.submitted_text,
                        "updated_at": now.isoformat(),
                    },
                    ensure_ascii=False,
                )
                for item in items
            }
            await redis_client.hset(f"session:{payload.session_id}:answers", mapping=mapping)
            await redis_client.expire(f"session:{payload.session_id}:answers", 86400)
        if payload.remaining_seconds is not None:
            await redis_client.setex(
                f"session:{payload.session_id}:timer",
                max(1, payload.remaining_seconds),
                str(payload.remaining_seconds),
            )
    except Exception:
        pass

    if payload.session_id in FALLBACK_SESSIONS:
        mem_sess = FALLBACK_SESSIONS[payload.session_id]
        for item in items:
            mem_sess["answers"][item.question_id] = {
                "submitted_option_number": item.submitted_option_number,
                "submitted_text": item.submitted_text,
                "updated_at": now.isoformat(),
            }
        if payload.remaining_seconds is not None:
            mem_sess["remaining_seconds"] = payload.remaining_seconds
        return AnswerAutoSaveResponse(
            session_id=payload.session_id,
            saved_count=len(items),
            updated_at=now,
        )

    try:
        s_uuid = uuid.UUID(payload.session_id)
        for item in items:
            q_uuid = uuid.UUID(item.question_id)
            stmt = select(UserAnswer).where(
                UserAnswer.session_id == s_uuid,
                UserAnswer.question_id == q_uuid,
            )
            existing = (await db.execute(stmt)).scalar_one_or_none()
            if existing:
                existing.submitted_option_number = item.submitted_option_number
                existing.submitted_text = item.submitted_text
                existing.updated_at = now
            else:
                db.add(
                    UserAnswer(
                        session_id=s_uuid,
                        question_id=q_uuid,
                        submitted_option_number=item.submitted_option_number,
                        submitted_text=item.submitted_text,
                    )
                )
        await db.commit()
    except Exception:
        pass

    return AnswerAutoSaveResponse(
        session_id=payload.session_id,
        saved_count=len(items),
        updated_at=now,
    )


async def _submit_session_impl(
    payload: SessionSubmitRequest,
    db: AsyncSession,
) -> SessionReportResponse:
    if payload.answers:
        await _autosave_answers_impl(
            AnswerAutoSaveRequest(session_id=payload.session_id, answers=payload.answers),
            db,
        )

    now = datetime.now(timezone.utc)
    lang = payload.lang or "en"

    # Fallback session grading
    if payload.session_id in FALLBACK_SESSIONS:
        mem_sess = FALLBACK_SESSIONS[payload.session_id]
        mem_sess["status"] = "GRADING_COMPLETED"
        mem_sess["submitted_at"] = now

        listening_score = 0.0
        reading_score = 0.0
        writing_score = 0.0
        review_list: List[QuestionGradingDetail] = []

        for q in FALLBACK_SAMPLE_QUESTIONS:
            qid = q["question_id"]
            ans = mem_sess["answers"].get(qid, {})
            opt_num = ans.get("submitted_option_number")
            sub_text = ans.get("submitted_text")
            max_pts = float(q["score_points"])

            if q["question_type"] == "MULTIPLE_CHOICE":
                is_correct = (
                    opt_num is not None and str(opt_num) == str(q["correct_answer_text"])
                )
                earned = max_pts if is_correct else 0.0
                feedback = None
            else:
                is_correct, earned, feedback = await grade_topik_writing_with_gemini(
                    question_number=q["question_number"],
                    question_type=q["question_type"],
                    prompt_text=q["prompt_text"],
                    passage_text=q["passage_text"],
                    submitted_text=sub_text,
                    max_score=max_pts,
                    lang=lang,
                )

            if q["section_name"] == "LISTENING":
                listening_score += earned
            elif q["section_name"] == "READING":
                reading_score += earned
            elif q["section_name"] == "WRITING":
                writing_score += earned

            review_list.append(
                QuestionGradingDetail(
                    question_id=qid,
                    question_number=q["question_number"],
                    section_name=q["section_name"],
                    question_type=q["question_type"],
                    prompt_text=q["prompt_text"],
                    passage_text=q["passage_text"],
                    submitted_option_number=opt_num,
                    submitted_text=sub_text,
                    correct_answer_text=q["correct_answer_text"],
                    is_correct=is_correct,
                    score_points=max_pts,
                    earned_score=earned,
                    explanations=q["explanations"],
                    feedback_report=feedback,
                )
            )

        total_score = listening_score + reading_score + writing_score
        awarded_level, next_cutoff = calculate_topik_level(mem_sess["exam_type"], total_score)
        max_total = 200.0 if mem_sess["exam_type"] == "TOPIK_I" else 300.0

        report = SessionReportResponse(
            session_id=payload.session_id,
            exam_id=mem_sess["exam_id"],
            exam_title=mem_sess["exam_title"],
            exam_type=mem_sess["exam_type"],
            status="GRADING_COMPLETED",
            started_at=mem_sess["started_at"],
            submitted_at=now,
            listening_score=listening_score,
            reading_score=reading_score,
            writing_score=writing_score,
            total_score=total_score,
            max_total_score=max_total,
            awarded_level=awarded_level,
            next_level_cutoff=next_cutoff,
            questions_review=review_list,
        )
        mem_sess["report"] = report
        return report

    # PostgreSQL session grading
    try:
        s_uuid = uuid.UUID(payload.session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session_id UUID")

    sess_stmt = (
        select(ExamSession)
        .options(selectinload(ExamSession.answers))
        .where(ExamSession.session_id == s_uuid)
    )
    sess_obj = (await db.execute(sess_stmt)).scalar_one_or_none()
    if not sess_obj:
        raise HTTPException(status_code=404, detail="Exam session not found")

    exam_stmt = (
        select(Exam)
        .options(selectinload(Exam.sections).selectinload(Section.questions))
        .where(Exam.exam_id == sess_obj.exam_id)
    )
    exam_obj = (await db.execute(exam_stmt)).scalar_one_or_none()
    if not exam_obj:
        raise HTTPException(status_code=404, detail="Exam not found")

    ans_by_qid: Dict[uuid.UUID, UserAnswer] = {a.question_id: a for a in sess_obj.answers}

    listening_score = 0.0
    reading_score = 0.0
    writing_score = 0.0
    review_list: List[QuestionGradingDetail] = []

    for sec in sorted(exam_obj.sections, key=lambda s: s.section_order):
        for q in sorted(sec.questions, key=lambda item: item.question_number):
            ua = ans_by_qid.get(q.question_id)
            opt_num = ua.submitted_option_number if ua else None
            sub_text = ua.submitted_text if ua else None
            max_pts = float(q.score_points)

            if q.question_type == "MULTIPLE_CHOICE":
                is_correct = (
                    opt_num is not None
                    and q.correct_answer_text is not None
                    and str(opt_num) == str(q.correct_answer_text).strip()
                )
                earned = max_pts if is_correct else 0.0
                feedback = None
            else:
                is_correct, earned, feedback = await grade_topik_writing_with_gemini(
                    question_number=q.question_number,
                    question_type=q.question_type,
                    prompt_text=q.prompt_text,
                    passage_text=q.passage_text,
                    submitted_text=sub_text,
                    max_score=max_pts,
                    lang=lang,
                )

            if ua:
                ua.is_correct = is_correct
                ua.earned_score = earned
                ua.feedback_report = feedback
                ua.updated_at = now
            else:
                new_ua = UserAnswer(
                    session_id=sess_obj.session_id,
                    question_id=q.question_id,
                    submitted_option_number=None,
                    submitted_text=None,
                    is_correct=False,
                    earned_score=0.0,
                    feedback_report=feedback,
                )
                db.add(new_ua)

            if sec.section_name == "LISTENING":
                listening_score += earned
            elif sec.section_name == "READING":
                reading_score += earned
            elif sec.section_name == "WRITING":
                writing_score += earned

            review_list.append(
                QuestionGradingDetail(
                    question_id=str(q.question_id),
                    question_number=q.question_number,
                    section_name=sec.section_name,
                    question_type=q.question_type,
                    prompt_text=q.prompt_text,
                    passage_text=q.passage_text,
                    submitted_option_number=opt_num,
                    submitted_text=sub_text,
                    correct_answer_text=q.correct_answer_text,
                    is_correct=is_correct,
                    score_points=max_pts,
                    earned_score=earned,
                    explanations=q.explanations,
                    feedback_report=feedback,
                )
            )

    total_score = listening_score + reading_score + writing_score
    awarded_level, next_cutoff = calculate_topik_level(exam_obj.exam_type, total_score)
    max_total = 200.0 if exam_obj.exam_type == "TOPIK_I" else 300.0

    sess_obj.status = "GRADING_COMPLETED"
    sess_obj.submitted_at = now
    sess_obj.listening_score = listening_score
    sess_obj.reading_score = reading_score
    sess_obj.writing_score = writing_score
    sess_obj.total_score = total_score
    sess_obj.awarded_level = awarded_level

    await db.commit()

    return SessionReportResponse(
        session_id=str(sess_obj.session_id),
        exam_id=str(exam_obj.exam_id),
        exam_title=exam_obj.title,
        exam_type=exam_obj.exam_type,
        status=sess_obj.status,
        started_at=sess_obj.started_at,
        submitted_at=sess_obj.submitted_at,
        listening_score=float(sess_obj.listening_score),
        reading_score=float(sess_obj.reading_score),
        writing_score=float(sess_obj.writing_score),
        total_score=float(sess_obj.total_score),
        max_total_score=max_total,
        awarded_level=awarded_level,
        next_level_cutoff=next_cutoff,
        questions_review=review_list,
    )


async def _get_report_impl(
    session_id: str,
    db: AsyncSession,
) -> SessionReportResponse:
    if session_id in FALLBACK_SESSIONS:
        mem_sess = FALLBACK_SESSIONS[session_id]
        if mem_sess.get("report"):
            return mem_sess["report"]
        return await _submit_session_impl(SessionSubmitRequest(session_id=session_id), db)

    try:
        s_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session_id UUID")

    sess_stmt = (
        select(ExamSession)
        .options(selectinload(ExamSession.answers))
        .where(ExamSession.session_id == s_uuid)
    )
    sess_obj = (await db.execute(sess_stmt)).scalar_one_or_none()
    if not sess_obj:
        raise HTTPException(status_code=404, detail="Exam session not found")

    if sess_obj.status == "IN_PROGRESS":
        return await _submit_session_impl(SessionSubmitRequest(session_id=session_id), db)

    exam_stmt = (
        select(Exam)
        .options(selectinload(Exam.sections).selectinload(Section.questions))
        .where(Exam.exam_id == sess_obj.exam_id)
    )
    exam_obj = (await db.execute(exam_stmt)).scalar_one_or_none()
    if not exam_obj:
        raise HTTPException(status_code=404, detail="Exam not found")

    ans_by_qid: Dict[uuid.UUID, UserAnswer] = {a.question_id: a for a in sess_obj.answers}
    review_list: List[QuestionGradingDetail] = []

    for sec in sorted(exam_obj.sections, key=lambda s: s.section_order):
        for q in sorted(sec.questions, key=lambda item: item.question_number):
            ua = ans_by_qid.get(q.question_id)
            review_list.append(
                QuestionGradingDetail(
                    question_id=str(q.question_id),
                    question_number=q.question_number,
                    section_name=sec.section_name,
                    question_type=q.question_type,
                    prompt_text=q.prompt_text,
                    passage_text=q.passage_text,
                    submitted_option_number=ua.submitted_option_number if ua else None,
                    submitted_text=ua.submitted_text if ua else None,
                    correct_answer_text=q.correct_answer_text,
                    is_correct=bool(ua.is_correct) if ua and ua.is_correct is not None else False,
                    score_points=float(q.score_points),
                    earned_score=float(ua.earned_score) if ua else 0.0,
                    explanations=q.explanations,
                    feedback_report=ua.feedback_report if ua else None,
                )
            )

    total_score = float(sess_obj.total_score or 0.0)
    awarded_level, next_cutoff = calculate_topik_level(exam_obj.exam_type, total_score)
    max_total = 200.0 if exam_obj.exam_type == "TOPIK_I" else 300.0

    return SessionReportResponse(
        session_id=str(sess_obj.session_id),
        exam_id=str(exam_obj.exam_id),
        exam_title=exam_obj.title,
        exam_type=exam_obj.exam_type,
        status=sess_obj.status,
        started_at=sess_obj.started_at,
        submitted_at=sess_obj.submitted_at,
        listening_score=float(sess_obj.listening_score or 0.0),
        reading_score=float(sess_obj.reading_score or 0.0),
        writing_score=float(sess_obj.writing_score or 0.0),
        total_score=total_score,
        max_total_score=max_total,
        awarded_level=sess_obj.awarded_level if sess_obj.awarded_level is not None else awarded_level,
        next_level_cutoff=next_cutoff,
        questions_review=review_list,
    )


@router.post("/sessions", response_model=SessionStartResponse)
@router.post("/api/v1/sessions", response_model=SessionStartResponse)
async def start_exam_session(
    payload: Optional[SessionStartRequest] = None,
    db: AsyncSession = Depends(get_db),
):
    return await _start_session_impl(payload or SessionStartRequest(), db)


@router.put("/answers", response_model=AnswerAutoSaveResponse)
@router.put("/api/v1/answers", response_model=AnswerAutoSaveResponse)
async def autosave_exam_answers(
    payload: AnswerAutoSaveRequest,
    db: AsyncSession = Depends(get_db),
):
    return await _autosave_answers_impl(payload, db)


@router.post("/submit", response_model=SessionReportResponse)
@router.post("/api/v1/submit", response_model=SessionReportResponse)
async def submit_exam_session(
    payload: SessionSubmitRequest,
    db: AsyncSession = Depends(get_db),
):
    return await _submit_session_impl(payload, db)


@router.get("/report", response_model=SessionReportResponse)
@router.get("/api/v1/report", response_model=SessionReportResponse)
async def get_exam_report(
    session_id: str = Query(..., description="Exam session UUID"),
    db: AsyncSession = Depends(get_db),
):
    return await _get_report_impl(session_id, db)


@router.get("/report/{session_id}", response_model=SessionReportResponse)
@router.get("/api/v1/sessions/{session_id}/report", response_model=SessionReportResponse)
async def get_exam_report_by_path(
    session_id: str,
    db: AsyncSession = Depends(get_db),
):
    return await _get_report_impl(session_id, db)
