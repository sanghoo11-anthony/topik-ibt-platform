from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class OptionItemSchema(BaseModel):
    option_number: int
    option_text: str


class QuestionItemSchema(BaseModel):
    question_id: str
    section_name: str
    question_number: int
    question_type: str
    difficulty_level: Optional[int] = 3
    score_points: float
    audio_url: Optional[str] = None
    passage_text: Optional[str] = None
    prompt_text: str
    options: List[OptionItemSchema] = Field(default_factory=list)


class SessionStartRequest(BaseModel):
    user_id: Optional[str] = None
    exam_id: Optional[str] = None
    exam_type: str = "TOPIK_II"


class SessionStartResponse(BaseModel):
    session_id: str
    user_id: str
    exam_id: str
    exam_title: str
    exam_type: str
    status: str
    remaining_seconds: int
    started_at: datetime
    questions: List[QuestionItemSchema]


class SingleAnswerPayload(BaseModel):
    question_id: str
    submitted_option_number: Optional[int] = None
    submitted_text: Optional[str] = None


class AnswerAutoSaveRequest(BaseModel):
    session_id: str
    question_id: Optional[str] = None
    submitted_option_number: Optional[int] = None
    submitted_text: Optional[str] = None
    answers: Optional[List[SingleAnswerPayload]] = None
    remaining_seconds: Optional[int] = None


class AnswerAutoSaveResponse(BaseModel):
    session_id: str
    saved_count: int
    updated_at: datetime
    status: str = "AUTO_SAVED"


class SessionSubmitRequest(BaseModel):
    session_id: str
    lang: str = "en"
    answers: Optional[List[SingleAnswerPayload]] = None


class QuestionGradingDetail(BaseModel):
    question_id: str
    question_number: int
    section_name: str
    question_type: str
    prompt_text: str
    passage_text: Optional[str] = None
    submitted_option_number: Optional[int] = None
    submitted_text: Optional[str] = None
    correct_answer_text: Optional[str] = None
    is_correct: bool
    score_points: float
    earned_score: float
    explanations: Optional[Dict[str, Any]] = None
    feedback_report: Optional[Dict[str, Any]] = None


class SessionReportResponse(BaseModel):
    session_id: str
    exam_id: str
    exam_title: str
    exam_type: str
    status: str
    started_at: datetime
    submitted_at: Optional[datetime] = None
    listening_score: float
    reading_score: float
    writing_score: float
    total_score: float
    max_total_score: float
    awarded_level: int
    next_level_cutoff: Optional[int] = None
    questions_review: List[QuestionGradingDetail]
