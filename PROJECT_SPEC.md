# Project: Global TOPIK (Test of Proficiency in Korean) IBT Platform

## 1. Project Overview & Core Objectives
- **Target Audience**: Global learners preparing for TOPIK I (Levels 1-2), TOPIK II (Levels 3-6), and TOPIK Speaking.
- **Core UX Philosophy**: Frictionless, intuitive IBT (Internet-Based Test) simulation with instant multilingual vocabulary tooltips (powered by morphological analysis + KRDICT Open API), real-time answer auto-save, and AI-powered essay grading for TOPIK II Writing (Q51-Q54).

## 2. TOPIK Domain Rules & Exam Structure
### 2.1 Grading Cutoffs
- **TOPIK I (Max 200 pts)**: Level 1 (>= 80 pts), Level 2 (>= 140 pts)
- **TOPIK II (Max 300 pts)**: Level 3 (>= 120 pts), Level 4 (>= 150 pts), Level 5 (>= 190 pts), Level 6 (>= 230 pts)

### 2.2 Section Specifications
- **TOPIK I**:
  - Period 1: Listening (30 MCQs, 40 mins, 100 pts) + Reading (40 MCQs, 60 mins, 100 pts) = Total 100 mins.
- **TOPIK II**:
  - Period 1: Listening (50 MCQs, 60 mins, 100 pts) + Writing (4 Questions, 50 mins, 100 pts).
    - Q51 (10 pts): Short answer in practical text (email/notice).
    - Q52 (10 pts): Short answer in explanatory text.
    - Q53 (30 pts): 200-300 char data/graph analysis essay.
    - Q54 (50 pts): 600-700 char argumentative essay on social/abstract topics.
  - Period 2: Reading (50 MCQs, 70 mins, 100 pts).

### 2.3 Official Public Data Sources
- **Item Bank**: NIIED Official TOPIK Past Papers
- **Multilingual Dictionary**: National Institute of Korean Language (NIKL) Korean Learners' Basic Dictionary Open API (`https://krdict.korean.go.kr/api/search`) supporting 11 languages (`en:1, ja:2, fr:3, es:4, ar:5, mn:6, vi:7, th:8, id:9, ru:10, zh:11`).
- **Grammar & Corpus**: King Sejong Institute & NIKL Learner Corpus.

---

## 3. Tech Stack Architecture
- **Frontend**: Next.js (App Router, TypeScript), Tailwind CSS, Lucide Icons, Zustand (Timer & Session State)
- **Backend**: Python FastAPI, Pydantic v2, HTTPX (Async HTTP), xmltodict, Kiwipiepy (Korean Morphological Analyzer)
- **Database & Cache**: PostgreSQL 16 (JSONB for multilingual support) + Redis (Session Timer, Auto-save Cache, Dictionary Tooltip Cache)

---

## 4. Relational Database Schema (PostgreSQL DDL)

```sql
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
```

---

## 5. Multilingual Vocabulary Tooltip API (FastAPI + Kiwipiepy + KRDICT)

- Morphologically analyzes clicked Korean surface tokens via `Kiwipiepy` to extract dictionary lemmas (`-다` for verbs/adjectives, root forms for nouns/adverbs).
- Queries NIKL Korean Learners' Basic Dictionary Open API (`KRDICT`) and caches responses in Redis (`7 days` TTL).

---

## 6. Sample Question Data (JSON)

```json
{
  "question_id": "TOPIK-II-91-R-13",
  "test_type": "TOPIK_II",
  "section": "READING",
  "difficulty_level": 3,
  "question_type": "MULTIPLE_CHOICE",
  "passage": "(가) 그러나 무조건 잠을 줄이는 것은 건강에 해롭다.\n(나) 현대인들은 바쁜 일상 속에서 수면 시간을 줄이곤 한다.\n(다) 충분한 수면을 취해야 면역력이 유지되고 집중력도 높아진다.\n(라) 따라서 건강을 지키려면 하루 7시간 이상의 숙면이 필요하다.",
  "question_text": "다음 문장을 논리적 순서에 맞게 배열한 것을 고르십시오.",
  "options": [
    { "index": 1, "text": "(나) - (가) - (다) - (라)" },
    { "index": 2, "text": "(나) - (라) - (가) - (다)" },
    { "index": 3, "text": "(다) - (가) - (나) - (라)" },
    { "index": 4, "text": "(다) - (라) - (가) - (나)" }
  ],
  "correct_answer": 1,
  "score": 2,
  "explanation_multilingual": {
    "ko": "(나)에서 일반적인 문제 현상을 제시한 후, (가)의 접속부사 '그러나'로 문제점을 지적하고, (다)에서 수면의 중요성을 설명한 뒤, (라)의 '따라서'로 결론을 짓는 흐름이 자연스럽습니다.",
    "en": "The logical sequence starts with (나) stating the general phenomenon, followed by (가) with 'however', explaining the reason in (다), and concluding with (라) 'therefore'."
  }
}
```
