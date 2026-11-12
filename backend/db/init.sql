-- Global TOPIK IBT Platform - PostgreSQL 16 Initial Schema
-- Automatically executed on container startup via /docker-entrypoint-initdb.d/init.sql

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    native_language VARCHAR(10) NOT NULL DEFAULT 'en',
    target_topik_level SMALLINT CHECK (target_topik_level BETWEEN 1 AND 6),
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams (
    exam_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    exam_type VARCHAR(20) NOT NULL CHECK (exam_type IN ('TOPIK_I', 'TOPIK_II', 'SPEAKING')),
    round_number INT,
    total_time_limit_minutes INT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sections (
    section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
    section_name VARCHAR(20) NOT NULL CHECK (section_name IN ('LISTENING', 'READING', 'WRITING')),
    section_order SMALLINT NOT NULL,
    time_limit_minutes INT NOT NULL,
    total_score INT NOT NULL DEFAULT 100
);

CREATE TABLE questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    question_type VARCHAR(30) NOT NULL CHECK (
        question_type IN ('MULTIPLE_CHOICE', 'SHORT_ANSWER', 'ESSAY_SHORT', 'ESSAY_LONG')
    ),
    difficulty_level SMALLINT CHECK (difficulty_level BETWEEN 1 AND 6),
    score_points NUMERIC(4, 1) NOT NULL DEFAULT 2.0,
    audio_url VARCHAR(500),
    passage_text TEXT,
    prompt_text TEXT NOT NULL,
    correct_answer_text TEXT,
    explanations JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_section_question_number UNIQUE (section_id, question_number)
);

CREATE TABLE question_options (
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    option_number SMALLINT NOT NULL CHECK (option_number BETWEEN 1 AND 4),
    option_text TEXT NOT NULL,
    CONSTRAINT uq_question_option UNIQUE (question_id, option_number)
);

CREATE TABLE exam_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES exams(exam_id),
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (
        status IN ('IN_PROGRESS', 'SUBMITTED', 'GRADING_COMPLETED', 'EXPIRED')
    ),
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ,
    listening_score NUMERIC(5, 1) DEFAULT 0,
    reading_score NUMERIC(5, 1) DEFAULT 0,
    writing_score NUMERIC(5, 1) DEFAULT 0,
    total_score NUMERIC(5, 1) DEFAULT 0,
    awarded_level SMALLINT CHECK (awarded_level BETWEEN 0 AND 6)
);

CREATE TABLE user_answers (
    answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES exam_sessions(session_id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(question_id),
    submitted_option_number SMALLINT,
    submitted_text TEXT,
    is_correct BOOLEAN,
    earned_score NUMERIC(4, 1) DEFAULT 0,
    feedback_report JSONB,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_session_question UNIQUE (session_id, question_id)
);

CREATE TABLE writing_rubrics (
    rubric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    criteria_name VARCHAR(50) NOT NULL,
    max_score NUMERIC(4, 1) NOT NULL,
    description JSONB
);
