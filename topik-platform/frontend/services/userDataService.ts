// Modular User Data Service (Adapter Pattern)
// 현재 구현: Supabase PostgREST API
// DB 용량을 아끼기 위해 정적 지문/음성은 제외하고, 사용자별 프로필·단어장·시험 성적만 경량 저장합니다.

import {
  AuthSession,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
} from "@/services/authService";

export interface UserProfile {
  id: string;
  email: string | null;
  nickname: string | null;
  native_lang?: string;
  native_language: string;
  target_level: number;
  subscription_tier?: string;
}

export interface SaveAttemptAnswerInput {
  question_id: string;
  selected_option: string | null;
  is_correct: boolean;
  time_spent_sec: number;
}

export interface SaveAttemptPayload {
  mode: "mock_exam" | "weakness_drill";
  status: "in_progress" | "completed";
  listening_score: number;
  reading_score: number;
  writing_score: number;
  total_score: number;
  started_at: string;
  completed_at: string;
  answers: SaveAttemptAnswerInput[];
}

export interface SavedVocabDTO {
  lemma: string;
  pronunciation?: string | null;
  part_of_speech?: string | null;
  word_grade?: string | null;
  korean_definition: string;
  translated_word?: string | null;
}

export interface ExamRecordDTO {
  id?: string;
  target_level: number;
  total_score: number;
  listening_score: number;
  reading_score: number;
  writing_score: number;
  answers_json?: Record<string, unknown>;
  created_at?: string;
}

export interface IUserDataService {
  getProfile(session: AuthSession): Promise<UserProfile | null>;
  upsertProfile(
    session: AuthSession,
    updates: Partial<Pick<UserProfile, "native_language" | "target_level" | "nickname">>
  ): Promise<void>;
  getSavedVocabularies(session: AuthSession): Promise<SavedVocabDTO[]>;
  saveVocabulary(session: AuthSession, item: SavedVocabDTO): Promise<void>;
  deleteVocabulary(session: AuthSession, lemma: string): Promise<void>;
  getExamRecords(session: AuthSession): Promise<ExamRecordDTO[]>;
  saveExamRecord(session: AuthSession, record: ExamRecordDTO): Promise<void>;
  createAttemptAndSaveAnswers(
    session: AuthSession,
    payload: SaveAttemptPayload
  ): Promise<string | null>;
}

function authHeaders(session: AuthSession): Record<string, string> {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json",
  };
}

class SupabaseUserDataAdapter implements IUserDataService {
  async getProfile(session: AuthSession): Promise<UserProfile | null> {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(
          session.user.id
        )}&select=*`,
        { headers: authHeaders(session) }
      );
      if (!res.ok) return null;
      const rows = (await res.json()) as UserProfile[];
      const row = rows[0];
      if (!row) return null;
      return {
        ...row,
        native_language: row.native_language || row.native_lang || "en",
      };
    } catch {
      return null;
    }
  }

  async upsertProfile(
    session: AuthSession,
    updates: Partial<Pick<UserProfile, "native_language" | "target_level" | "nickname">>
  ): Promise<void> {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: "POST",
        headers: {
          ...authHeaders(session),
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          ...updates,
          ...(updates.native_language
            ? { native_lang: updates.native_language }
            : {}),
          updated_at: new Date().toISOString(),
        }),
      });
    } catch {
      // Ignore transient network errors
    }
  }

  async getSavedVocabularies(session: AuthSession): Promise<SavedVocabDTO[]> {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/saved_vocabularies?user_id=eq.${encodeURIComponent(
          session.user.id
        )}&order=created_at.desc&select=lemma,pronunciation,part_of_speech,word_grade,korean_definition,translated_word`,
        { headers: authHeaders(session) }
      );
      if (!res.ok) return [];
      return (await res.json()) as SavedVocabDTO[];
    } catch {
      return [];
    }
  }

  async saveVocabulary(
    session: AuthSession,
    item: SavedVocabDTO
  ): Promise<void> {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/saved_vocabularies`, {
        method: "POST",
        headers: {
          ...authHeaders(session),
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          user_id: session.user.id,
          lemma: item.lemma,
          pronunciation: item.pronunciation ?? null,
          part_of_speech: item.part_of_speech ?? null,
          word_grade: item.word_grade ?? null,
          korean_definition: item.korean_definition,
          translated_word: item.translated_word ?? null,
        }),
      });
    } catch {
      // Ignore transient network errors
    }
  }

  async deleteVocabulary(session: AuthSession, lemma: string): Promise<void> {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/saved_vocabularies?user_id=eq.${encodeURIComponent(
          session.user.id
        )}&lemma=eq.${encodeURIComponent(lemma)}`,
        {
          method: "DELETE",
          headers: authHeaders(session),
        }
      );
    } catch {
      // Ignore transient network errors
    }
  }

  async getExamRecords(session: AuthSession): Promise<ExamRecordDTO[]> {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/exam_records?user_id=eq.${encodeURIComponent(
          session.user.id
        )}&order=created_at.desc&limit=20`,
        { headers: authHeaders(session) }
      );
      if (!res.ok) return [];
      return (await res.json()) as ExamRecordDTO[];
    } catch {
      return [];
    }
  }

  async saveExamRecord(
    session: AuthSession,
    record: ExamRecordDTO
  ): Promise<void> {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/exam_records`, {
        method: "POST",
        headers: authHeaders(session),
        body: JSON.stringify({
          user_id: session.user.id,
          target_level: record.target_level,
          total_score: record.total_score,
          listening_score: record.listening_score,
          reading_score: record.reading_score,
          writing_score: record.writing_score,
          answers_json: record.answers_json ?? null,
        }),
      });
    } catch {
      // Ignore transient network errors
    }
  }

  async createAttemptAndSaveAnswers(
    session: AuthSession,
    payload: SaveAttemptPayload
  ): Promise<string | null> {
    try {
      const attemptRes = await fetch(`${SUPABASE_URL}/rest/v1/test_attempts`, {
        method: "POST",
        headers: {
          ...authHeaders(session),
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: session.user.id,
          mode: payload.mode,
          status: payload.status,
          listening_score: payload.listening_score,
          reading_score: payload.reading_score,
          writing_score: payload.writing_score,
          total_score: payload.total_score,
          started_at: payload.started_at,
          completed_at: payload.completed_at,
        }),
      });
      if (!attemptRes.ok) return null;
      const attemptRows = (await attemptRes.json()) as Array<{ id?: string }>;
      const attemptId = attemptRows[0]?.id;
      if (!attemptId) return null;

      if (payload.answers.length > 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/attempt_answers`, {
          method: "POST",
          headers: {
            ...authHeaders(session),
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(
            payload.answers.map((item) => ({
              attempt_id: attemptId,
              question_id: item.question_id,
              selected_option: item.selected_option,
              is_correct: item.is_correct,
              time_spent_sec: Math.max(0, Math.round(item.time_spent_sec)),
            }))
          ),
        });
      }

      return attemptId;
    } catch {
      return null;
    }
  }
}

export const userDataService: IUserDataService = new SupabaseUserDataAdapter();
