import { create } from "zustand";
import { QuestionItem, SessionReportResponse } from "@/types/exam";
import { COMPREHENSIVE_QUESTIONS } from "@/data/studyData";

export interface UserAnswerDraft {
  submitted_option_number?: number;
  submitted_text?: string;
}

export const DEFAULT_QUESTIONS: QuestionItem[] = COMPREHENSIVE_QUESTIONS;

const STORAGE_KEY = "global-topik-ibt-state-v1";

interface PersistedExamState {
  selectedLanguage?: string;
  targetLevel?: number;
  answers?: Record<string, UserAnswerDraft>;
  report?: SessionReportResponse | null;
}

export function loadPersistedExamState(): PersistedExamState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedExamState;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function savePersistedExamState(state: PersistedExamState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or iOS Private Browsing errors
  }
}

interface ExamState {
  sessionId: string | null;
  examTitle: string;
  remainingSeconds: number;
  isTimerRunning: boolean;
  selectedLanguage: string;
  targetLevel: number;
  questions: QuestionItem[];
  currentQuestionIndex: number;
  answers: Record<string, UserAnswerDraft>;
  lastSavedAt: string | null;
  isSaving: boolean;
  isSubmitting: boolean;
  report: SessionReportResponse | null;
  isReportModalOpen: boolean;

  hydrateFromStorage: () => void;
  initSessionData: (data: {
    sessionId: string;
    examTitle: string;
    remainingSeconds: number;
    questions: QuestionItem[];
  }) => void;
  tickTimer: () => void;
  toggleTimer: () => void;
  setLanguage: (lang: string) => void;
  setTargetLevel: (level: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setOptionAnswer: (questionId: string, optionNumber: number) => void;
  setTextAnswer: (questionId: string, text: string) => void;
  setSavingState: (isSaving: boolean, savedAt?: string) => void;
  setSubmittingState: (isSubmitting: boolean) => void;
  setReport: (report: SessionReportResponse | null) => void;
  setReportModalOpen: (open: boolean) => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  sessionId: "local-session-91",
  examTitle: "제91회 한국어능력시험 (TOPIK I·II) 통합 실전 모의고사",
  remainingSeconds: 7200,
  isTimerRunning: true,
  selectedLanguage: "ko", // 기본 언어: 한국어
  targetLevel: 4, // 기본 목표 급수: 4급
  questions: DEFAULT_QUESTIONS,
  currentQuestionIndex: 0,
  answers: {},
  lastSavedAt: null,
  isSaving: false,
  isSubmitting: false,
  report: null,
  isReportModalOpen: false,

  hydrateFromStorage: () => {
    const saved = loadPersistedExamState();
    if (!saved) return;
    set((state) => ({
      selectedLanguage: saved.selectedLanguage || state.selectedLanguage,
      targetLevel:
        typeof saved.targetLevel === "number"
          ? saved.targetLevel
          : state.targetLevel,
      remainingSeconds:
        typeof saved.targetLevel === "number"
          ? saved.targetLevel <= 2
            ? 100 * 60
            : 180 * 60
          : state.remainingSeconds,
      answers: saved.answers || state.answers,
      report: saved.report !== undefined ? saved.report : state.report,
    }));
  },

  initSessionData: ({ sessionId, examTitle, remainingSeconds, questions }) =>
    set({
      sessionId,
      examTitle,
      remainingSeconds,
      questions: questions.length > 0 ? questions : DEFAULT_QUESTIONS,
    }),

  tickTimer: () =>
    set((state) => ({
      remainingSeconds: state.isTimerRunning
        ? Math.max(0, state.remainingSeconds - 1)
        : state.remainingSeconds,
    })),

  toggleTimer: () =>
    set((state) => ({ isTimerRunning: !state.isTimerRunning })),

  setLanguage: (lang) => {
    set({ selectedLanguage: lang });
    const s = get();
    savePersistedExamState({
      selectedLanguage: lang,
      targetLevel: s.targetLevel,
      answers: s.answers,
      report: s.report,
    });
  },

  setTargetLevel: (level) => {
    set({
      targetLevel: level,
      remainingSeconds: level <= 2 ? 100 * 60 : 180 * 60,
    });
    const s = get();
    savePersistedExamState({
      selectedLanguage: s.selectedLanguage,
      targetLevel: level,
      answers: s.answers,
      report: s.report,
    });
  },

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  setOptionAnswer: (questionId, optionNumber) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          submitted_option_number: optionNumber,
        },
      },
    }));
    const s = get();
    savePersistedExamState({
      selectedLanguage: s.selectedLanguage,
      targetLevel: s.targetLevel,
      answers: s.answers,
      report: s.report,
    });
  },

  setTextAnswer: (questionId, text) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          submitted_text: text,
        },
      },
    }));
    const s = get();
    savePersistedExamState({
      selectedLanguage: s.selectedLanguage,
      targetLevel: s.targetLevel,
      answers: s.answers,
      report: s.report,
    });
  },

  setSavingState: (isSaving, savedAt) =>
    set((state) => ({
      isSaving,
      lastSavedAt: savedAt ?? state.lastSavedAt,
    })),

  setSubmittingState: (isSubmitting) => set({ isSubmitting }),

  setReport: (report) => {
    set({
      report,
      isReportModalOpen: Boolean(report),
    });
    const s = get();
    savePersistedExamState({
      selectedLanguage: s.selectedLanguage,
      targetLevel: s.targetLevel,
      answers: s.answers,
      report,
    });
  },

  setReportModalOpen: (open) => set({ isReportModalOpen: open }),
}));
