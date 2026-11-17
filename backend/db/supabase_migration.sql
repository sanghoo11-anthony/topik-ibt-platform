-- ============================================================================
-- Global TOPIK IBT Platform - Unified Supabase (PostgreSQL) Schema Migration
-- Compatible with Supabase Auth, PostgREST user sync, and FastAPI AI Analysis
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. public.profiles (User Preferences & Subscription Tier)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    nickname TEXT,
    native_lang TEXT NOT NULL DEFAULT 'en',
    native_language TEXT NOT NULL DEFAULT 'en',
    target_level SMALLINT NOT NULL DEFAULT 3 CHECK (target_level BETWEEN 1 AND 6),
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backward-compatible column upgrades if an earlier profiles table already exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS native_lang TEXT NOT NULL DEFAULT 'en';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS native_language TEXT NOT NULL DEFAULT 'en';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_level SMALLINT NOT NULL DEFAULT 3;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Keep native_lang and native_language synchronized
CREATE OR REPLACE FUNCTION public.sync_profile_native_lang()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.native_language IS NOT NULL AND (OLD IS NULL OR NEW.native_language IS DISTINCT FROM OLD.native_language) THEN
        NEW.native_lang := NEW.native_language;
    ELSIF NEW.native_lang IS NOT NULL THEN
        NEW.native_language := NEW.native_lang;
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_profile_native_lang ON public.profiles;
CREATE TRIGGER trg_sync_profile_native_lang
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_profile_native_lang();

-- Automatically create a profile row when a new Supabase Auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nickname, native_lang, native_language, target_level, subscription_tier)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(COALESCE(NEW.email, 'learner'), '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'native_lang', 'en'),
        COALESCE(NEW.raw_user_meta_data->>'native_lang', 'en'),
        3,
        'free'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_auth_user();

-- ----------------------------------------------------------------------------
-- 2. public.questions (TOPIK I/II Item Bank & Weakness Tag Metadata)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topik_level TEXT NOT NULL CHECK (topik_level IN ('TOPIK_I', 'TOPIK_II')),
    section TEXT NOT NULL CHECK (section IN ('listening', 'reading', 'writing')),
    question_type TEXT NOT NULL,
    grammar_vocab_tags TEXT[] NOT NULL DEFAULT '{}',
    difficulty SMALLINT NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    correct_answer TEXT NOT NULL DEFAULT '',
    base_explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_level_type
    ON public.questions (topik_level, section, question_type);

-- ----------------------------------------------------------------------------
-- 3. public.test_attempts (Exam Sessions: Mock Exam & Weakness Drill)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mode TEXT NOT NULL DEFAULT 'mock_exam' CHECK (mode IN ('mock_exam', 'weakness_drill')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    listening_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
    reading_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
    writing_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
    total_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_test_attempts_user_started
    ON public.test_attempts (user_id, started_at DESC);

-- ----------------------------------------------------------------------------
-- 4. public.attempt_answers (Per-Question Answer & Timing Telemetry Log)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    time_spent_sec INT NOT NULL DEFAULT 0 CHECK (time_spent_sec >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt
    ON public.attempt_answers (attempt_id);
CREATE INDEX IF NOT EXISTS idx_attempt_answers_question
    ON public.attempt_answers (question_id);

-- ----------------------------------------------------------------------------
-- 5. public.feedback_reports (Cached Statistical + Gemini AI Feedback Report)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL UNIQUE REFERENCES public.test_attempts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    weakness_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    ai_feedback_text TEXT NOT NULL DEFAULT '',
    recommended_question_ids UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_reports_user_created
    ON public.feedback_reports (user_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 6. Existing App Tables Preserved (saved_vocabularies & exam_records)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_vocabularies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lemma TEXT NOT NULL,
    pronunciation TEXT,
    part_of_speech TEXT,
    word_grade TEXT,
    korean_definition TEXT NOT NULL,
    translated_word TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_saved_lemma UNIQUE (user_id, lemma)
);

CREATE TABLE IF NOT EXISTS public.exam_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_level SMALLINT NOT NULL DEFAULT 4,
    total_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
    listening_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
    reading_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
    writing_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
    answers_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. Row-Level Security (RLS) Policies
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_upsert_own" ON public.profiles;
CREATE POLICY "profiles_upsert_own" ON public.profiles
    FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "questions_read_all" ON public.questions;
CREATE POLICY "questions_read_all" ON public.questions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "test_attempts_own" ON public.test_attempts;
CREATE POLICY "test_attempts_own" ON public.test_attempts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "attempt_answers_own" ON public.attempt_answers;
CREATE POLICY "attempt_answers_own" ON public.attempt_answers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts ta
            WHERE ta.id = attempt_answers.attempt_id AND ta.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_attempts ta
            WHERE ta.id = attempt_answers.attempt_id AND ta.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "feedback_reports_own" ON public.feedback_reports;
CREATE POLICY "feedback_reports_own" ON public.feedback_reports
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_vocabularies_own" ON public.saved_vocabularies;
CREATE POLICY "saved_vocabularies_own" ON public.saved_vocabularies
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "exam_records_own" ON public.exam_records;
CREATE POLICY "exam_records_own" ON public.exam_records
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 8. Seed Built-in 24 TOPIK Questions (Matches Frontend Question UUIDs)
-- ----------------------------------------------------------------------------
INSERT INTO public.questions (id, topik_level, section, question_type, grammar_vocab_tags, difficulty, content, correct_answer, base_explanation)
VALUES
    ('00000000-0000-0000-0001-000000000001', 'TOPIK_I', 'listening', 'dialogue_response', ARRAY['인사·약속', '-겠-'], 1, '{"question_number":1,"question_text":"[TOPIK I · 1~2급] 다음을 듣고 가장 알맞은 대답을 고르십시오.","passage":"남자: 내일 시간이 있어요? 같이 도서관에 갈래요?"}'::jsonb, '2', '수락이나 동의를 나타내는 2번이 알맞습니다.'),
    ('00000000-0000-0000-0001-000000000002', 'TOPIK_I', 'listening', 'place_inference', ARRAY['장소 어휘', '이용 규칙'], 1, '{"question_number":5,"question_text":"[TOPIK I · 1~2급] 여기는 어디입니까? 알맞은 것을 고르십시오.","passage":"여자: 이 책을 빌리고 싶어요. 다음 주 금요일까지 반납하면 되지요?"}'::jsonb, '3', '책을 빌리고 반납하는 장소는 도서관(3번)입니다.'),
    ('00000000-0000-0000-0001-000000000003', 'TOPIK_I', 'listening', 'speaker_intent', ARRAY['안내·일정', '변경'], 2, '{"question_number":10,"question_text":"[TOPIK I · 2급] 남자가 왜 회사에 전화를 했는지 고르십시오.","passage":"남자: 여보세요, 김민수입니다. 3시에 회의가 있는데 지하철이 고장 나서 20분쯤 늦을 것 같습니다."}'::jsonb, '1', '지하철 고장으로 회의 지각을 알리려는 목적입니다.'),
    ('00000000-0000-0000-0001-000000000004', 'TOPIK_I', 'reading', 'vocab_context', ARRAY['계절·날씨', '감정 표현'], 1, '{"question_number":3,"question_text":"[TOPIK I · 1~2급] 무엇에 대한 이야기인지 고르십시오.","passage":"요즘 날씨가 많이 춥습니다. 밖에 나갈 때는 따뜻한 옷을 입으세요."}'::jsonb, '2', '추운 날씨와 옷차림 안내입니다.'),
    ('00000000-0000-0000-0001-000000000005', 'TOPIK_I', 'reading', 'grammar_blank', ARRAY['-(으)ㄹ 줄 알다', '대조·연결'], 2, '{"question_number":12,"question_text":"[TOPIK I · 2급] (   )에 들어갈 가장 알맞은 것을 고르십시오.","passage":"한국에 온 지 1년이 지났지만 아직 한국어로 요리 이름을 설명하는 것은 (     )."}'::jsonb, '3', '앞의 기간 대비 아직 어려움을 나타내는 어휘가 적절합니다.'),
    ('00000000-0000-0000-0001-000000000006', 'TOPIK_I', 'reading', 'reading_comprehension', ARRAY['안내문·규칙', '세부 내용'], 2, '{"question_number":20,"question_text":"[TOPIK I · 2급] 글의 내용과 같은 것을 고르십시오.","passage":"인주박물관은 매주 월요일에 문을 닫습니다. 주말에는 오후 6시까지 구경할 수 있습니다."}'::jsonb, '1', '월요일 휴관 안내 내용과 일치합니다.'),
    ('00000000-0000-0000-0002-000000000001', 'TOPIK_II', 'listening', 'dialogue_action', ARRAY['일상·요청', '추론'], 3, '{"question_number":9,"question_text":"[TOPIK II · 3~4급] 여자가 이어서 할 행동으로 가장 알맞은 것을 고르십시오.","passage":"남자: 행사 포스터 인쇄가 아직 안 왔어요? 여자: 방금 전화해서 확인해 보겠습니다."}'::jsonb, '2', '인쇄 업체에 확인 전화를 하는 행동이 이어집니다.'),
    ('00000000-0000-0000-0002-000000000002', 'TOPIK_II', 'listening', 'speaker_attitude', ARRAY['사회 이슈', '-기 마련이다'], 4, '{"question_number":21,"question_text":"[TOPIK II · 4~5급] 남자의 중심 생각으로 가장 알맞은 것을 고르십시오.","passage":"남자: 일회용품을 줄이는 데는 개인의 노력뿐 아니라 기업의 포장재 개선이 함께 이루어져야 합니다."}'::jsonb, '4', '개인 실천과 기업 제도 개선의 병행을 강조합니다.'),
    ('00000000-0000-0000-0002-000000000003', 'TOPIK_II', 'listening', 'lecture_inference', ARRAY['학술·과학', '고급 어휘'], 5, '{"question_number":37,"question_text":"[TOPIK II · 5~6급] 강연의 중심 내용으로 가장 알맞은 것을 고르십시오.","passage":"여자(강연자): 도시의 열섬 현상을 완화하려면 콘크리트 면적을 줄이고 바람길을 고려한 녹지 배치가 필수적입니다."}'::jsonb, '3', '도시 열섬 완화 방안으로 바람길 기반 녹지 조성을 제시합니다.'),
    ('00000000-0000-0000-0002-000000000004', 'TOPIK_II', 'reading', 'grammar_blank', ARRAY['-(으)ㄴ/는 바람에', '접속·원인'], 3, '{"question_number":2,"question_text":"[TOPIK II · 3급] (   )에 들어갈 가장 알맞은 것을 고르십시오.","passage":"갑자기 비가 내리는 (     ) 준비했던 야외 행사가 취소되었다."}'::jsonb, '3', '예상치 못한 부정적 원인 표현 -(으)ㄴ/는 바람에를 묻는 문항입니다.'),
    ('00000000-0000-0000-0002-000000000005', 'TOPIK_II', 'reading', 'idiom_synonym', ARRAY['유의어·관용어', '부사'], 4, '{"question_number":4,"question_text":"[TOPIK II · 4급] 밑줄 친 부분과 의미가 가장 비슷한 것을 고르십시오.","passage":"오랜 노력 끝에 마침내 목표를 이루었다."}'::jsonb, '1', '마침내의 유의어는 드디어입니다.'),
    ('00000000-0000-0000-0000-000000000013', 'TOPIK_II', 'reading', 'sentence_ordering', ARRAY['접속부사', '문장 배열'], 3, '{"question_number":13,"question_text":"[TOPIK II · 3~4급] 다음을 순서대로 맞게 배열한 것을 고르십시오.","passage":"(가) 그러나 무조건 잠을 줄이는 것은 건강에 해롭다. (나) 현대인들은 바쁜 일상 속에서 수면 시간을 줄이곤 한다. (다) 충분한 수면을 취해야 면역력이 유지되고 집중력도 높아진다. (라) 따라서 건강을 지키려면 하루 7시간 이상의 숙면이 필요하다."}'::jsonb, '1', '도입(나) -> 역접(가) -> 근거(다) -> 결론(라) 순서입니다.'),
    ('00000000-0000-0000-0002-000000000006', 'TOPIK_II', 'reading', 'connective_blank', ARRAY['접속어', '인과·전환'], 4, '{"question_number":19,"question_text":"[TOPIK II · 4급] (   )에 들어갈 말로 가장 알맞은 것을 고르십시오.","passage":"온라인 거래는 편리하다. (     ) 개인정보 유출 위험이 존재한다."}'::jsonb, '2', '장점과 위험성을 대비하는 역접 접속어 반면에/그러나가 적절합니다.'),
    ('00000000-0000-0000-0002-000000000007', 'TOPIK_II', 'reading', 'headline_inference', ARRAY['신문 기사', '함축 의미'], 4, '{"question_number":25,"question_text":"[TOPIK II · 4~5급] 다음 신문 기사의 제목을 가장 잘 설명한 것을 고르십시오.","passage":"청년 창업 열풍, 3년 내 폐업률 절반... 내실 있는 지원 절실"}'::jsonb, '4', '창업 확대 이면의 생존율 저하 및 실질 지원 필요성을 요약한 내용입니다.'),
    ('00000000-0000-0000-0002-000000000008', 'TOPIK_II', 'reading', 'topic_inference', ARRAY['심리·사회', '-기 십상이다'], 5, '{"question_number":35,"question_text":"[TOPIK II · 5급] 이 글의 중심 내용으로 가장 알맞은 것을 고르십시오.","passage":"정보가 넘쳐나는 시대일수록 자료의 출처를 비판적으로 검토하는 미디어 리터러시 역량이 중요하다."}'::jsonb, '3', '비판적 정보 판별 역량의 중요성을 강조합니다.'),
    ('00000000-0000-0000-0002-000000000009', 'TOPIK_II', 'reading', 'advanced_inference', ARRAY['철학·인문', '-기 이를 데 없다'], 5, '{"question_number":42,"question_text":"[TOPIK II · 6급] 필자의 태도로 가장 알맞은 것을 고르십시오.","passage":"기술 효율성만을 앞세운 도시 설계는 공동체의 기억을 지우며 인간 소외를 심화시키기 마련이다."}'::jsonb, '2', '기술 중심 개발이 초래하는 공동체 훼손에 대한 비판적 태도입니다.'),
    ('00000000-0000-0000-0000-000000000051', 'TOPIK_II', 'writing', 'practical_blank_writing', ARRAY['격식체', '실용문 쓰기'], 3, '{"question_number":51,"question_text":"51. [실용문 빈칸] 다음 안내문을 읽고 ㉠, ㉡에 들어갈 말을 쓰십시오.","passage":"동아리 일정 변경 안내... ㉠ / ㉡"}'::jsonb, '㉠ 참석하기 어렵게 되었습니다 ㉡ 변경할 수 있을까요', '실용 안내문 맥락에 맞는 정중한 격식체(-(스)ㅂ니다/-(으)ㄹ까요?)를 사용해야 합니다.'),
    ('00000000-0000-0000-0000-000000000052', 'TOPIK_II', 'writing', 'explanatory_blank_writing', ARRAY['해라체', '-기 때문이다'], 4, '{"question_number":52,"question_text":"52. [설명문 빈칸] 다음 설명문을 읽고 ㉠, ㉡에 들어갈 말을 쓰십시오.","passage":"화분에 물을 너무 자주 주면 뿌리가 ㉠ ... ㉡"}'::jsonb, '㉠ 썩기 때문이다 ㉡ 주지 말고', '설명문 기본 문체인 해라체(-다/-기 때문이다)로 일관되게 작성해야 합니다.'),
    ('00000000-0000-0000-0001-000000000053', 'TOPIK_II', 'writing', 'chart_analysis_essay', ARRAY['통계 표현', '-는 셈이다', '비율·배수'], 4, '{"question_number":53,"question_text":"53. [그래프 유형 1] 인주시의 자전거 이용자 변화에 대한 글을 200~300자로 쓰십시오.","passage":"자전거 이용자 수 2007년 4만 -> 2017년 21만(약 5배), 출퇴근 목적 14배 증가"}'::jsonb, '모범 답안 참조', '추이 비교·원인·세부 수치 순위를 해라체 200~300자로 서술하세요.'),
    ('00000000-0000-0000-0000-000000000053', 'TOPIK_II', 'writing', 'chart_analysis_essay', ARRAY['통계 표현', '비율·순위', '전망'], 4, '{"question_number":53,"question_text":"53. [그래프 유형 2] 온라인 쇼핑 이용 현황 및 만족 요인에 대한 글을 200~300자로 쓰십시오.","passage":"2020년 15조 -> 2024년 32조 원, 배송 신속성 48% > 가격 경쟁력 32% > 다양성 20%"}'::jsonb, '모범 답안 참조', '규모 증가, 만족 요인 순위, 향후 전망을 논리적으로 연결하세요.'),
    ('00000000-0000-0000-0002-000000000053', 'TOPIK_II', 'writing', 'chart_analysis_essay', ARRAY['통계 표현', '대조', '원인·대책'], 4, '{"question_number":53,"question_text":"53. [그래프 유형 3] 인주시의 가구 형태별 변화 추이에 대한 글을 200~300자로 쓰십시오.","passage":"4인 가구 42%->21%, 1인 가구 18%->39%, 원인 및 대책"}'::jsonb, '모범 답안 참조', '증가·감소 대조, 원인, 대책을 한 문단으로 요약하세요.'),
    ('00000000-0000-0000-0003-000000000053', 'TOPIK_II', 'writing', 'chart_analysis_essay', ARRAY['통계 표현', '독서율', '전망'], 4, '{"question_number":53,"question_text":"53. [그래프 유형 4] 성인의 전자책 독서율 변화 및 이용 이유에 대한 글을 200~300자로 쓰십시오.","passage":"2019년 16% -> 2021년 27% -> 2023년 41%, 휴대 편리 52% > 저렴한 비용 31% > 시공간 제약 없음 17%"}'::jsonb, '모범 답안 참조', '수치 상승 추이 및 선호 이유 순위를 해라체로 작성하세요.'),
    ('00000000-0000-0000-0000-000000000054', 'TOPIK_II', 'writing', 'argumentative_essay', ARRAY['논술 구조', '-(으)ㄹ 뿐만 아니라', '대안 제시'], 5, '{"question_number":54,"question_text":"54. [논술 유형 1] 진정한 행복의 조건에 대한 자신의 견해를 600~700자로 쓰십시오.","passage":"물질적 풍요 속 현대인의 행복지수 저하와 개인적·사회적 노력"}'::jsonb, '모범 답안 참조', '서론-본론(개인/사회 차원)-결론 3~4단 논증 구조로 작성하세요.'),
    ('00000000-0000-0000-0002-000000000054', 'TOPIK_II', 'writing', 'argumentative_essay', ARRAY['논술 구조', '비판적 사고', '사회 제도'], 5, '{"question_number":54,"question_text":"54. [논술 유형 2] 가짜 뉴스 확산의 문제점과 해결 방안에 대한 글을 600~700자로 쓰십시오.","passage":"알고리즘·조회수 경쟁과 가짜 뉴스 폐해, 제도적·개인적 대응 방안"}'::jsonb, '모범 답안 참조', '원인-폐해-정부/플랫폼/개인 대책을 600~700자 해라체로 서술하세요.')
ON CONFLICT (id) DO NOTHING;
