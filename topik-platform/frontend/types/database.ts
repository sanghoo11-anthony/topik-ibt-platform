export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TopikLevelCode = "TOPIK_I" | "TOPIK_II";
export type ExamSectionCode = "listening" | "reading" | "writing";
export type AttemptMode = "mock_exam" | "weakness_drill";
export type AttemptStatus = "in_progress" | "completed";
export type SubscriptionTier = "free" | "pro" | "enterprise";

export interface ProfileRow {
  id: string;
  email: string | null;
  nickname: string | null;
  native_lang: string;
  native_language?: string;
  target_level: number;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at?: string;
}

export interface QuestionRow {
  id: string;
  topik_level: TopikLevelCode;
  section: ExamSectionCode;
  question_type: string;
  grammar_vocab_tags: string[];
  difficulty: number;
  content: Record<string, unknown>;
  correct_answer: string;
  base_explanation: string | null;
  created_at: string;
}

export interface TestAttemptRow {
  id: string;
  user_id: string;
  mode: AttemptMode;
  status: AttemptStatus;
  listening_score: number;
  reading_score: number;
  writing_score: number;
  total_score: number;
  started_at: string;
  completed_at: string | null;
}

export interface AttemptAnswerRow {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option: string | null;
  is_correct: boolean;
  time_spent_sec: number;
  created_at: string;
}

export interface ErrorPatternCounts {
  rushed_guessing: number;
  concept_deficit: number;
  attractive_distractor: number;
}

export type ErrorPatternKey = keyof ErrorPatternCounts;

export interface SampleWrongCase {
  question_id: string;
  section?: string;
  snippet: string;
  selected_option?: string | number | null;
  correct_answer?: string | null;
  time_spent_sec: number;
  error_pattern: ErrorPatternKey;
  tags: string[];
}

export interface WeaknessTypeSummary {
  total_questions: number;
  correct_count: number;
  accuracy_rate: number;
  avg_time_sec: number;
  error_patterns: ErrorPatternCounts;
}

export interface RankedWeaknessItem {
  question_type: string;
  accuracy_rate: number;
  wrong_count: number;
  avg_time_sec: number;
  error_patterns: ErrorPatternCounts;
  sample_wrong_cases: SampleWrongCase[];
}

export interface WeaknessSummary {
  by_question_type: Record<string, WeaknessTypeSummary>;
  top_weaknesses: RankedWeaknessItem[];
  top_missed_tags: string[];
}

export interface FeedbackReportRow {
  id: string;
  attempt_id: string;
  user_id: string;
  weakness_summary: WeaknessSummary;
  ai_feedback_text: string;
  recommended_question_ids: string[];
  created_at: string;
}

export interface AnalyzeAttemptRequest {
  user_id: string;
  force_regenerate?: boolean;
}

export interface FeedbackReportResponse {
  report_id: string;
  attempt_id: string;
  weakness_summary: WeaknessSummary;
  ai_feedback_text: string;
  recommended_question_ids: string[];
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
      };
      questions: {
        Row: QuestionRow;
        Insert: Partial<QuestionRow> & {
          topik_level: TopikLevelCode;
          section: ExamSectionCode;
          question_type: string;
        };
        Update: Partial<QuestionRow>;
      };
      test_attempts: {
        Row: TestAttemptRow;
        Insert: Partial<TestAttemptRow> & { user_id: string };
        Update: Partial<TestAttemptRow>;
      };
      attempt_answers: {
        Row: AttemptAnswerRow;
        Insert: Partial<AttemptAnswerRow> & {
          attempt_id: string;
          question_id: string;
        };
        Update: Partial<AttemptAnswerRow>;
      };
      feedback_reports: {
        Row: FeedbackReportRow;
        Insert: Partial<FeedbackReportRow> & {
          attempt_id: string;
          user_id: string;
        };
        Update: Partial<FeedbackReportRow>;
      };
    };
  };
}
