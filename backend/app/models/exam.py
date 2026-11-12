import uuid
from datetime import datetime
from typing import Any, List, Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    native_language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")
    target_topik_level: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    timezone: Mapped[Optional[str]] = mapped_column(String(50), default="UTC")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Exam(Base):
    __tablename__ = "exams"

    exam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    exam_type: Mapped[str] = mapped_column(String(20), nullable=False)
    round_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_time_limit_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    sections: Mapped[List["Section"]] = relationship(
        "Section", back_populates="exam", cascade="all, delete-orphan"
    )


class Section(Base):
    __tablename__ = "sections"

    section_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    exam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("exams.exam_id", ondelete="CASCADE"), nullable=False
    )
    section_name: Mapped[str] = mapped_column(String(20), nullable=False)
    section_order: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    time_limit_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    total_score: Mapped[int] = mapped_column(Integer, nullable=False, default=100)

    exam: Mapped["Exam"] = relationship("Exam", back_populates="sections")
    questions: Mapped[List["Question"]] = relationship(
        "Question", back_populates="section", cascade="all, delete-orphan"
    )


class Question(Base):
    __tablename__ = "questions"
    __table_args__ = (
        UniqueConstraint("section_id", "question_number", name="uq_section_question_number"),
    )

    question_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    section_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sections.section_id", ondelete="CASCADE"), nullable=False
    )
    question_number: Mapped[int] = mapped_column(Integer, nullable=False)
    question_type: Mapped[str] = mapped_column(String(30), nullable=False)
    difficulty_level: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    score_points: Mapped[float] = mapped_column(Numeric(4, 1), nullable=False, default=2.0)
    audio_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    passage_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    prompt_text: Mapped[str] = mapped_column(Text, nullable=False)
    correct_answer_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    explanations: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    section: Mapped["Section"] = relationship("Section", back_populates="questions")
    options: Mapped[List["QuestionOption"]] = relationship(
        "QuestionOption",
        back_populates="question",
        cascade="all, delete-orphan",
        order_by="QuestionOption.option_number",
    )
    rubrics: Mapped[List["WritingRubric"]] = relationship(
        "WritingRubric", back_populates="question", cascade="all, delete-orphan"
    )


class QuestionOption(Base):
    __tablename__ = "question_options"
    __table_args__ = (
        UniqueConstraint("question_id", "option_number", name="uq_question_option"),
    )

    option_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    question_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("questions.question_id", ondelete="CASCADE"), nullable=False
    )
    option_number: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    option_text: Mapped[str] = mapped_column(Text, nullable=False)

    question: Mapped["Question"] = relationship("Question", back_populates="options")


class ExamSession(Base):
    __tablename__ = "exam_sessions"

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    exam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("exams.exam_id"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="IN_PROGRESS")
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    submitted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    listening_score: Mapped[float] = mapped_column(Numeric(5, 1), default=0.0)
    reading_score: Mapped[float] = mapped_column(Numeric(5, 1), default=0.0)
    writing_score: Mapped[float] = mapped_column(Numeric(5, 1), default=0.0)
    total_score: Mapped[float] = mapped_column(Numeric(5, 1), default=0.0)
    awarded_level: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)

    answers: Mapped[List["UserAnswer"]] = relationship(
        "UserAnswer", back_populates="session", cascade="all, delete-orphan"
    )


class UserAnswer(Base):
    __tablename__ = "user_answers"
    __table_args__ = (
        UniqueConstraint("session_id", "question_id", name="uq_session_question"),
    )

    answer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("exam_sessions.session_id", ondelete="CASCADE"),
        nullable=False,
    )
    question_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("questions.question_id"), nullable=False
    )
    submitted_option_number: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    submitted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_correct: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    earned_score: Mapped[float] = mapped_column(Numeric(4, 1), default=0.0)
    feedback_report: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    session: Mapped["ExamSession"] = relationship("ExamSession", back_populates="answers")


class WritingRubric(Base):
    __tablename__ = "writing_rubrics"

    rubric_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    question_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("questions.question_id", ondelete="CASCADE"), nullable=False
    )
    criteria_name: Mapped[str] = mapped_column(String(50), nullable=False)
    max_score: Mapped[float] = mapped_column(Numeric(4, 1), nullable=False)
    description: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    question: Mapped["Question"] = relationship("Question", back_populates="rubrics")
