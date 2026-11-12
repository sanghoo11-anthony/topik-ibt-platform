import { create } from "zustand";
import { QuestionItem, SessionReportResponse } from "@/types/exam";
import { COMPREHENSIVE_QUESTIONS } from "@/data/studyData";

export interface UserAnswerDraft {
  submitted_option_number?: number;
  submitted_text?: string;
}

export const DEFAULT_QUESTIONS: QuestionItem[] = COMPREHENSIVE_QUESTIONS;

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
}

export const useExamStore = create<ExamState>((set) => ({
  sessionId: null,
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

  setLanguage: (lang) => set({ selectedLanguage: lang }),

  setTargetLevel: (level) =>
    set({
      targetLevel: level,
      remainingSeconds: level <= 2 ? 100 * 60 : 180 * 60,
    }),

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  setOptionAnswer: (questionId, optionNumber) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          submitted_option_number: optionNumber,
        },
      },
    })),

  setTextAnswer: (questionId, text) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          submitted_text: text,
        },
      },
    })),

  setSavingState: (isSaving, savedAt) =>
    set((state) => ({
      isSaving,
      lastSavedAt: savedAt ?? state.lastSavedAt,
    })),

  setSubmittingState: (isSubmitting) => set({ isSubmitting }),

  setReport: (report) => set({ report }),
}));
