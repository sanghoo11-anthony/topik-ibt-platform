import { create } from "zustand";
import { QuestionItem, SessionReportResponse } from "@/types/exam";
import { AttemptMode, FeedbackReportResponse } from "@/types/database";
import { COMPREHENSIVE_QUESTIONS } from "@/data/studyData";

export interface UserAnswerDraft {
  submitted_option_number?: number;
  submitted_text?: string;
  time_spent_sec?: number;
}

export const DEFAULT_QUESTIONS: QuestionItem[] = COMPREHENSIVE_QUESTIONS;

const STORAGE_KEY = "global-topik-ibt-state-v1";

interface PersistedExamState {
  selectedLanguage?: string;
  targetLevel?: number;
  answers?: Record<string, UserAnswerDraft>;
  questionTimeSpent?: Record<string, number>;
  report?: SessionReportResponse | null;
  analysisReport?: FeedbackReportResponse | null;
  currentAttemptId?: string | null;
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

function persistSnapshot(s: ExamState): void {
  savePersistedExamState({
    selectedLanguage: s.selectedLanguage,
    targetLevel: s.targetLevel,
    answers: s.answers,
    questionTimeSpent: s.questionTimeSpent,
    report: s.report,
    analysisReport: s.analysisReport,
    currentAttemptId: s.currentAttemptId,
  });
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
  questionTimeSpent: Record<string, number>;
  examMode: AttemptMode;
  activeQuestionIds: string[] | null;
  startedAtIso: string;
  currentAttemptId: string | null;
  lastSavedAt: string | null;
  isSaving: boolean;
  isSubmitting: boolean;
  isAnalyzing: boolean;
  report: SessionReportResponse | null;
  analysisReport: FeedbackReportResponse | null;
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
  recordQuestionTime: (questionId: string, deltaSec?: number) => void;
  setOptionAnswer: (questionId: string, optionNumber: number) => void;
  setTextAnswer: (questionId: string, text: string) => void;
  setSavingState: (isSaving: boolean, savedAt?: string) => void;
  setSubmittingState: (isSubmitting: boolean) => void;
  setCurrentAttemptId: (attemptId: string | null) => void;
  setAnalysisState: (
    isAnalyzing: boolean,
    analysisReport?: FeedbackReportResponse | null
  ) => void;
  setReport: (report: SessionReportResponse | null) => void;
  setReportModalOpen: (open: boolean) => void;
  startWeaknessDrill: (questionIds: string[]) => number;
  clearWeaknessDrill: () => void;
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
  questionTimeSpent: {},
  examMode: "mock_exam",
  activeQuestionIds: null,
  startedAtIso: new Date().toISOString(),
  currentAttemptId: null,
  lastSavedAt: null,
  isSaving: false,
  isSubmitting: false,
  isAnalyzing: false,
  report: null,
  analysisReport: null,
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
      questionTimeSpent: saved.questionTimeSpent || state.questionTimeSpent,
      report: saved.report !== undefined ? saved.report : state.report,
      analysisReport:
        saved.analysisReport !== undefined
          ? saved.analysisReport
          : state.analysisReport,
      currentAttemptId:
        saved.currentAttemptId !== undefined
          ? saved.currentAttemptId
          : state.currentAttemptId,
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
    persistSnapshot(get());
  },

  setTargetLevel: (level) => {
    set({
      targetLevel: level,
      remainingSeconds: level <= 2 ? 100 * 60 : 180 * 60,
    });
    persistSnapshot(get());
  },

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  recordQuestionTime: (questionId, deltaSec = 1) => {
    let nextSec = 0;
    set((state) => {
      nextSec = (state.questionTimeSpent[questionId] || 0) + deltaSec;
      const existingDraft = state.answers[questionId];
      return {
        questionTimeSpent: {
          ...state.questionTimeSpent,
          [questionId]: nextSec,
        },
        answers: existingDraft
          ? {
              ...state.answers,
              [questionId]: {
                ...existingDraft,
                time_spent_sec: nextSec,
              },
            }
          : state.answers,
      };
    });
    if (nextSec > 0 && nextSec % 5 === 0) {
      persistSnapshot(get());
    }
  },

  setOptionAnswer: (questionId, optionNumber) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          submitted_option_number: optionNumber,
          time_spent_sec: state.questionTimeSpent[questionId] || 0,
        },
      },
    }));
    persistSnapshot(get());
  },

  setTextAnswer: (questionId, text) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          submitted_text: text,
          time_spent_sec: state.questionTimeSpent[questionId] || 0,
        },
      },
    }));
    persistSnapshot(get());
  },

  setSavingState: (isSaving, savedAt) =>
    set((state) => ({
      isSaving,
      lastSavedAt: savedAt ?? state.lastSavedAt,
    })),

  setSubmittingState: (isSubmitting) => set({ isSubmitting }),

  setCurrentAttemptId: (attemptId) => {
    set({ currentAttemptId: attemptId });
    persistSnapshot(get());
  },

  setAnalysisState: (isAnalyzing, analysisReport) => {
    set((state) => ({
      isAnalyzing,
      analysisReport:
        analysisReport !== undefined ? analysisReport : state.analysisReport,
    }));
    if (analysisReport !== undefined) {
      persistSnapshot(get());
    }
  },

  setReport: (report) => {
    set({
      report,
      isReportModalOpen: Boolean(report),
    });
    persistSnapshot(get());
  },

  setReportModalOpen: (open) => set({ isReportModalOpen: open }),

  startWeaknessDrill: (questionIds) => {
    const questions = get().questions;
    const validIds = questionIds.filter((id) =>
      questions.some((q) => q.question_id === id)
    );
    const firstIdx =
      validIds.length > 0
        ? questions.findIndex((q) => q.question_id === validIds[0])
        : 0;
    set({
      examMode: "weakness_drill",
      activeQuestionIds: validIds.length > 0 ? validIds : null,
      currentQuestionIndex: firstIdx >= 0 ? firstIdx : 0,
      startedAtIso: new Date().toISOString(),
    });
    return firstIdx >= 0 ? firstIdx : 0;
  },

  clearWeaknessDrill: () =>
    set({
      examMode: "mock_exam",
      activeQuestionIds: null,
    }),
}));
