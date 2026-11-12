"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  BookmarkPlus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Globe,
  GraduationCap,
  Headphones,
  Home,
  LayoutGrid,
  Library,
  Pause,
  PenTool,
  Play,
  Search,
  Send,
  Sparkles,
  Square,
  Trash2,
  Video,
  Volume2,
} from "lucide-react";
import ClickablePassage from "@/components/ClickablePassage";
import WritingGridEditor from "@/components/WritingGridEditor";
import GradingReportModal from "@/components/GradingReportModal";
import { useExamStore } from "@/store/useExamStore";
import {
  SUPPORTED_LANGUAGES,
  SessionReportResponse,
  VocabTooltipResponse,
  getUITranslation,
} from "@/types/exam";
import {
  CURATED_VOCAB_ITEMS,
  GRAMMAR_PATTERNS_DATA,
  IDIOMS_DATA,
  STUDY_RESOURCES_DATA,
  getLocalizedQuestionExplanation,
} from "@/data/studyData";
import { speakMultilingualText, stopSpeech } from "@/utils/speech";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type ActiveMenu = "home" | "exam" | "writing" | "vocab" | "study" | "report";
type ExamSectionFilter = "ALL" | "LEVEL" | "LISTENING" | "READING" | "WRITING";

interface SavedWordItem {
  lemma: string;
  pronunciation?: string | null;
  part_of_speech?: string | null;
  word_grade?: string | null;
  korean_definition: string;
  translated_word?: string | null;
  translated_definition?: string | null;
  lang: string;
}

const TOPIK_I_LEVELS = [
  { level: 1, cutoff: 80 },
  { level: 2, cutoff: 140 },
];

const TOPIK_II_LEVELS = [
  { level: 3, cutoff: 120 },
  { level: 4, cutoff: 150 },
  { level: 5, cutoff: 190 },
  { level: 6, cutoff: 230 },
];

export default function TopikPlatformApp() {
  const {
    sessionId,
    remainingSeconds,
    isTimerRunning,
    toggleTimer,
    selectedLanguage,
    setLanguage,
    targetLevel,
    setTargetLevel,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setOptionAnswer,
    setTextAnswer,
    initSessionData,
    tickTimer,
    lastSavedAt,
    isSaving,
    setSavingState,
    isSubmitting,
    setSubmittingState,
    report,
    setReport,
  } = useExamStore();

  const [activeMenu, setActiveMenu] = useState<ActiveMenu>("home");
  const [sectionFilter, setSectionFilter] = useState<ExamSectionFilter>("ALL");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Listening TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showListeningScript, setShowListeningScript] = useState(true);

  // Vocabulary & Grammar Lab state
  const [searchQuery, setSearchQuery] = useState("면역력이");
  const [vocabGradeFilter, setVocabGradeFilter] = useState<
    "ALL" | "초급" | "중급" | "고급"
  >("ALL");
  const [vocabResult, setVocabResult] = useState<VocabTooltipResponse | null>(
    null
  );
  const [vocabLoading, setVocabLoading] = useState(false);
  const [savedWords, setSavedWords] = useState<SavedWordItem[]>([
    {
      lemma: "면역력",
      pronunciation: "며녕녁",
      part_of_speech: "명사",
      word_grade: "고급",
      korean_definition: "외부에서 들어온 병원균에 저항하는 힘.",
      translated_word: "immunity; immune system strength",
      translated_definition:
        "The power to resist pathogens entering from outside.",
      lang: "en",
    },
    {
      lemma: "숙면",
      pronunciation: "숭면",
      part_of_speech: "명사",
      word_grade: "고급",
      korean_definition: "깊이 든 잠.",
      translated_word: "deep sleep; sound sleep",
      translated_definition: "A deep, restful sleep.",
      lang: "en",
    },
    {
      lemma: "양극화",
      pronunciation: "양그콰",
      part_of_speech: "명사",
      word_grade: "고급",
      korean_definition:
        "서로 다른 두 극단으로 나뉘어 중간 부분이 줄어들고 차이가 심해지는 현상.",
      translated_word: "polarization",
      translated_definition:
        "The phenomenon of dividing into two extremes with widening gaps.",
      lang: "en",
    },
    {
      lemma: "급증하다",
      pronunciation: "급쯩하다",
      part_of_speech: "동사",
      word_grade: "중급",
      korean_definition: "수나 양이 갑자기 크게 늘어나다.",
      translated_word: "surge; increase sharply",
      translated_definition:
        "For a number or amount to increase suddenly and significantly.",
      lang: "en",
    },
  ]);

  const t = getUITranslation(selectedLanguage);

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const formatLevelLabel = (lvl: number) => {
    if (selectedLanguage === "ko") return `${lvl}급`;
    if (selectedLanguage === "ja" || selectedLanguage === "zh")
      return `${lvl}級`;
    return `${t.levelUnit} ${lvl}`;
  };

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.question_id] || {}
    : {};

  // Stop speech synthesis when changing questions or leaving exam
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentQuestionIndex, activeMenu]);

  const handlePlayListeningAudio = (scriptText: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const cleanedScript = scriptText
      .replace(/^\[.*?\]\n?/gm, "")
      .replace(/여자(\(강연자\))?:/g, "")
      .replace(/남자:/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedScript);
    utterance.lang = "ko-KR";
    utterance.rate = speechRate;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopListeningAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // 1. Initialize exam session on mount
  useEffect(() => {
    let mounted = true;
    async function startSession() {
      try {
        const res = await fetch(`${API_BASE_URL}/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exam_type: "TOPIK_II" }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data.session_id) {
          initSessionData({
            sessionId: data.session_id,
            examTitle: data.exam_title,
            remainingSeconds: data.remaining_seconds,
            questions: data.questions,
          });
        }
      } catch {
        // Fallback store already has all 22 COMPREHENSIVE_QUESTIONS
      }
    }
    startSession();
    return () => {
      mounted = false;
    };
  }, [initSessionData]);

  // 2. Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickTimer]);

  // 3. Auto-save answers every 10 seconds
  const triggerAutoSave = useCallback(async () => {
    if (!sessionId) return;
    const answerEntries = Object.entries(answers);
    if (answerEntries.length === 0) return;

    setSavingState(true);
    try {
      const payload = {
        session_id: sessionId,
        remaining_seconds: remainingSeconds,
        answers: answerEntries.map(([qid, draft]) => ({
          question_id: qid,
          submitted_option_number: draft.submitted_option_number ?? null,
          submitted_text: draft.submitted_text ?? null,
        })),
      };
      const res = await fetch(`${API_BASE_URL}/answers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const nowStr = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setSavingState(false, nowStr);
      } else {
        setSavingState(false);
      }
    } catch {
      setSavingState(false);
    }
  }, [sessionId, answers, remainingSeconds, setSavingState]);

  useEffect(() => {
    const interval = setInterval(() => {
      triggerAutoSave();
    }, 10000);
    return () => clearInterval(interval);
  }, [triggerAutoSave]);

  // 4. Submit exam & open AI Grading Report
  const handleSubmitExam = async () => {
    setSubmittingState(true);
    const reportLang = selectedLanguage;
    try {
      const answerEntries = Object.entries(answers).map(([qid, draft]) => ({
        question_id: qid,
        submitted_option_number: draft.submitted_option_number ?? null,
        submitted_text: draft.submitted_text ?? null,
      }));

      const res = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || "fallback-local-session",
          lang: reportLang,
          answers: answerEntries,
        }),
      });

      if (res.ok) {
        const reportData: SessionReportResponse = await res.json();
        setReport(reportData);
        setActiveMenu("report");
      }
    } catch {
      // Offline fallback report
    } finally {
      setSubmittingState(false);
    }
  };

  // 5. Vocabulary Lab Search
  const handleVocabSearch = useCallback(
    async (queryWord: string) => {
      const q = queryWord.trim();
      if (!q) return;
      setVocabLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/vocabularies/tooltip?surface=${encodeURIComponent(
            q
          )}&lang=${encodeURIComponent(selectedLanguage)}`
        );
        if (res.ok) {
          const data: VocabTooltipResponse = await res.json();
          setVocabResult(data);
        }
      } catch {
        setVocabResult({
          clicked_surface: q,
          lemma: q,
          target_code: "00000",
          pronunciation: q,
          part_of_speech: "어휘",
          word_grade: "중급",
          senses: [
            {
              sense_order: 1,
              korean_definition: `'${q}'에 대한 한국어기초사전 뜻풀이입니다.`,
              translated_word: `${q} (${selectedLanguage.toUpperCase()})`,
              translated_definition: `Multilingual definition for '${q}' in ${selectedLanguage.toUpperCase()}.`,
            },
          ],
        });
      } finally {
        setVocabLoading(false);
      }
    },
    [selectedLanguage]
  );

  useEffect(() => {
    if (activeMenu === "vocab") {
      handleVocabSearch(searchQuery);
    }
  }, [activeMenu, selectedLanguage, handleVocabSearch]);

  const handleSaveWord = (item: VocabTooltipResponse) => {
    const firstSense = item.senses[0];
    if (!firstSense) return;
    if (savedWords.some((w) => w.lemma === item.lemma)) return;
    setSavedWords((prev) => [
      {
        lemma: item.lemma,
        pronunciation: item.pronunciation,
        part_of_speech: item.part_of_speech,
        word_grade: item.word_grade,
        korean_definition: firstSense.korean_definition,
        translated_word: firstSense.translated_word,
        translated_definition: firstSense.translated_definition,
        lang: selectedLanguage,
      },
      ...prev,
    ]);
  };

  const filteredCuratedVocab = useMemo(() => {
    return CURATED_VOCAB_ITEMS.filter((item) => {
      if (vocabGradeFilter !== "ALL" && item.word_grade !== vocabGradeFilter) {
        return false;
      }
      return true;
    });
  }, [vocabGradeFilter]);

  // Filtered indices in the exam bar
  const filteredQuestionIndices = useMemo(() => {
    return questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => {
        if (sectionFilter === "ALL") return true;
        if (sectionFilter === "LISTENING") return q.section_name === "LISTENING";
        if (sectionFilter === "READING") return q.section_name === "READING";
        if (sectionFilter === "WRITING") return q.section_name === "WRITING";
        if (sectionFilter === "LEVEL") {
          const d = q.difficulty_level || 3;
          if (targetLevel <= 2) return d <= 2;
          if (targetLevel <= 4) return d >= 3 && d <= 4;
          return d >= 4;
        }
        return true;
      });
  }, [questions, sectionFilter, targetLevel]);

  const isAnswered = (qid: string) => {
    const ans = answers[qid];
    if (!ans) return false;
    return (
      ans.submitted_option_number !== undefined ||
      Boolean(ans.submitted_text && ans.submitted_text.trim().length > 0)
    );
  };

  const answeredCount = questions.filter((q) => isAnswered(q.question_id)).length;
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const startMockExamAtQuestion = (
    qIndex: number,
    menu: ActiveMenu = "exam",
    filter: ExamSectionFilter = "ALL"
  ) => {
    setSectionFilter(filter);
    setCurrentQuestionIndex(qIndex);
    setActiveMenu(menu);
  };

  const startExamForTargetLevel = (lvl: number) => {
    const firstMatchingIdx = questions.findIndex((q) => {
      const d = q.difficulty_level || 3;
      if (lvl <= 2) return d <= 2;
      if (lvl <= 4) return d >= 3 && d <= 4;
      return d >= 5;
    });
    setSectionFilter("LEVEL");
    setCurrentQuestionIndex(firstMatchingIdx >= 0 ? firstMatchingIdx : 0);
    setActiveMenu("exam");
  };

  const firstWritingIndex = useMemo(() => {
    const idx = questions.findIndex((q) => q.section_name === "WRITING");
    return idx >= 0 ? idx : 0;
  }, [questions]);

  const selectedLevelCutoff =
    [...TOPIK_I_LEVELS, ...TOPIK_II_LEVELS].find((l) => l.level === targetLevel)
      ?.cutoff ?? 150;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* ================= GLOBAL TOP NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-3.5">
          {/* Left: Brand Logo */}
          <button
            type="button"
            onClick={() => setActiveMenu("home")}
            className="flex items-center gap-3 text-left transition hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  Global TOPIK IBT
                </span>
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                  {t.brandBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500">{t.brandSubtitle}</p>
            </div>
          </button>

          {/* Center: Main Feature Navigation Tabs */}
          <nav className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1">
            <button
              type="button"
              onClick={() => setActiveMenu("home")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm ${
                activeMenu === "home"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>{t.navHome}</span>
            </button>

            <button
              type="button"
              onClick={() => startMockExamAtQuestion(0, "exam", "ALL")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm ${
                activeMenu === "exam"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>
                {t.navExam} ({questions.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                startMockExamAtQuestion(firstWritingIndex, "writing", "WRITING")
              }
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm ${
                activeMenu === "writing"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <PenTool className="h-4 w-4" />
              <span>{t.navWriting}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("vocab")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm ${
                activeMenu === "vocab"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookMarked className="h-4 w-4" />
              <span>{t.navVocab}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("study")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm ${
                activeMenu === "study"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Video className="h-4 w-4" />
              <span>
                {selectedLanguage === "ko" ? "학습 자료·유튜브" : "Study Hub & YouTube"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("report")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm ${
                activeMenu === "report"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChartIcon />
              <span>{t.navReport}</span>
            </button>
          </nav>

          {/* Right: Language Selector (Default: Korean) & Exam Timer */}
          <div className="flex flex-wrap items-center gap-3">
            {(activeMenu === "exam" || activeMenu === "writing") && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-mono text-sm font-extrabold text-slate-900">
                  {formattedTime}
                </span>
                <button
                  type="button"
                  onClick={toggleTimer}
                  className="rounded-lg p-1 text-slate-500 hover:bg-slate-200"
                >
                  {isTimerRunning ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 rounded-xl border-2 border-blue-200 bg-blue-50/60 px-3 py-1.5 text-xs font-semibold text-slate-700">
              <Globe className="h-4 w-4 text-blue-600" />
              <select
                aria-label="Select Language"
                value={selectedLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className="cursor-pointer bg-transparent font-bold text-slate-900 focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* ================= VIEW 1: HOME LANDING & FEATURE HUB ================= */}
      {activeMenu === "home" && (
        <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-8 px-6 py-8">
          {/* 1. TOP SECTION: Interactive TOPIK Exam & Target Level (1급~6급) Selector */}
          <section className="rounded-3xl border-2 border-blue-200 bg-white p-6 shadow-md sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-800">
                  <Award className="h-3.5 w-3.5" />
                  {t.levelSelectorTag}
                </span>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {t.levelSelectorTitle}
                </h2>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  {t.levelSelectorDesc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => startExamForTargetLevel(targetLevel)}
                className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-extrabold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 sm:text-sm"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>
                  [{targetLevel <= 2 ? "TOPIK I" : "TOPIK II"} ·{" "}
                  {formatLevelLabel(targetLevel)}] {t.startSelectedLevelBtn}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* TOPIK I (Levels 1-2) Selectable Group */}
              <div
                className={`rounded-2xl border-2 p-5 transition lg:col-span-5 ${
                  targetLevel <= 2
                    ? "border-blue-500 bg-blue-50/40"
                    : "border-slate-200 bg-slate-50/70"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-extrabold text-slate-900">
                    {t.topik1Title}
                  </span>
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-blue-600 shadow-sm">
                    {t.topik1Meta}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {TOPIK_I_LEVELS.map(({ level, cutoff }) => {
                    const isSelected = targetLevel === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setTargetLevel(level)}
                        className={`flex flex-col items-start justify-between rounded-2xl border-2 p-4 text-left transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-md"
                            : "border-slate-200 bg-white text-slate-800 hover:border-blue-400"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="text-lg font-extrabold">
                            {formatLevelLabel(level)}
                          </span>
                          {isSelected && (
                            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                              ✓ {t.selectedBadge}
                            </span>
                          )}
                        </div>
                        <div
                          className={`mt-2 font-mono text-sm font-bold ${
                            isSelected ? "text-blue-100" : "text-blue-600"
                          }`}
                        >
                          {cutoff}
                          {t.pointsOrAbove}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TOPIK II (Levels 3-6) Selectable Group */}
              <div
                className={`rounded-2xl border-2 p-5 transition lg:col-span-7 ${
                  targetLevel >= 3
                    ? "border-indigo-500 bg-indigo-50/40"
                    : "border-slate-200 bg-slate-50/70"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-extrabold text-indigo-950">
                    {t.topik2Title}
                  </span>
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-indigo-700 shadow-sm">
                    {t.topik2Meta}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TOPIK_II_LEVELS.map(({ level, cutoff }) => {
                    const isSelected = targetLevel === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setTargetLevel(level)}
                        className={`flex flex-col items-start justify-between rounded-2xl border-2 p-4 text-left transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                            : "border-slate-200 bg-white text-slate-800 hover:border-indigo-400"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="text-lg font-extrabold">
                            {formatLevelLabel(level)}
                          </span>
                          {isSelected && (
                            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              ✓
                            </span>
                          )}
                        </div>
                        <div
                          className={`mt-2 font-mono text-sm font-bold ${
                            isSelected ? "text-indigo-100" : "text-indigo-600"
                          }`}
                        >
                          {cutoff}
                          {t.pointsOrAbove}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Hero Section */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 text-white shadow-xl sm:p-10">
            <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-blue-200 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>{t.heroBadge}</span>
                </div>

                <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  {t.heroTitlePrefix}
                  <span className="bg-gradient-to-r from-blue-400 to-emerald-300 bg-clip-text text-transparent">
                    {t.heroTitleHighlight}
                  </span>
                  {t.heroTitleSuffix}
                </h1>

                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  {t.heroDesc}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => startMockExamAtQuestion(0, "exam", "ALL")}
                    className="flex items-center gap-2 rounded-2xl bg-blue-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>{t.heroStartExamBtn} (19문항)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      startMockExamAtQuestion(
                        firstWritingIndex,
                        "writing",
                        "WRITING"
                      )
                    }
                    className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <PenTool className="h-4 w-4" />
                    <span>{t.heroStartWritingBtn} (51~54번)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMenu("study")}
                    className="flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500/20 px-5 py-3 text-sm font-bold text-emerald-200 backdrop-blur transition hover:bg-emerald-500/30"
                  >
                    <Video className="h-4 w-4" />
                    <span>
                      {selectedLanguage === "ko"
                        ? "유튜브 강의 · 문법 · 쓰기 공식"
                        : "YouTube Lectures & Grammar"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Hero Right Summary Card */}
              <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md lg:col-span-5">
                <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-blue-300">
                      {t.summaryTitle}
                    </span>
                    <h2 className="text-lg font-bold text-white">
                      {targetLevel <= 2 ? "TOPIK I" : "TOPIK II"} ·{" "}
                      {formatLevelLabel(targetLevel)} ({selectedLevelCutoff}
                      {t.pointsOrAbove})
                    </h2>
                  </div>
                  <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
                    {currentLangMeta.flag} {currentLangMeta.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-white/5 p-3.5">
                    <span className="text-slate-300">{t.summaryProgress}</span>
                    <div className="mt-1 text-xl font-extrabold text-white">
                      {answeredCount} / {questions.length}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3.5">
                    <span className="text-slate-300">{t.summarySavedWords}</span>
                    <div className="mt-1 text-xl font-extrabold text-emerald-300">
                      {savedWords.length} / {CURATED_VOCAB_ITEMS.length}+
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3.5">
                    <span className="text-slate-300">
                      {t.summaryDictSupport}
                    </span>
                    <div className="mt-1 text-base font-bold text-white">
                      {t.summaryDictValue}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3.5">
                    <span className="text-slate-300">{t.summaryAiGrading}</span>
                    <div className="mt-1 text-base font-bold text-amber-300">
                      51·52·53·54번 완비
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Main Feature Selection Cards */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  {t.modulesTag}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {t.modulesTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                {currentLangMeta.flag} {t.modulesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Feature Card 1: IBT Mock Exam (Listening + Reading) */}
              <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                      듣기 TTS + 읽기 지문
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {t.card1Title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {t.card1Desc}
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-500">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                      1~6급 기출 유형별 듣기(음성 재생)·읽기 완비
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                      {t.card1Bullet2}
                    </li>
                  </ul>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      startMockExamAtQuestion(0, "exam", "LISTENING")
                    }
                    className="flex items-center justify-center gap-1 rounded-xl bg-blue-50 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                  >
                    <Headphones className="h-3.5 w-3.5" />
                    <span>듣기 평가</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      startMockExamAtQuestion(3, "exam", "READING")
                    }
                    className="flex items-center justify-center gap-1 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>읽기 평가</span>
                  </button>
                </div>
              </div>

              {/* Feature Card 2: Writing Wongoji + Gemini AI (51~54번) */}
              <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
                      <PenTool className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700">
                      51 · 52 · 53 · 54번
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {t.card2Title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {t.card2Desc}
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-500">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                      51·52번 빈칸 완성 + 53·54번 기출 복원 6문항
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                      {t.card2Bullet2}
                    </li>
                  </ul>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      startMockExamAtQuestion(
                        firstWritingIndex,
                        "writing",
                        "WRITING"
                      )
                    }
                    className="flex items-center justify-center gap-1 rounded-xl bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
                  >
                    <span>51~53번 연습</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      startMockExamAtQuestion(
                        questions.length - 1,
                        "writing",
                        "WRITING"
                      )
                    }
                    className="flex items-center justify-center gap-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                  >
                    <span>54번 논술</span>
                  </button>
                </div>
              </div>

              {/* Feature Card 3: AI Morphological Dictionary & Grammar Lab */}
              <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
                      <BookMarked className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                      어휘 · 문법 · 관용어
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {t.card3Title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {t.card3Desc}
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-500">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      초급·중급·고급 필수 어휘 및 사자성어·관용어
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {t.card3Bullet2}
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMenu("vocab")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white transition group-hover:bg-emerald-600"
                >
                  <span>{t.card3Btn}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Feature Card 4: YouTube Lectures & Official Archive */}
              <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white">
                      <Video className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800">
                      YouTube · 기출 아카이브
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {selectedLanguage === "ko"
                        ? "유튜브 특강 & 쓰기 만점 공식"
                        : "YouTube Lectures & Study Hub"}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {selectedLanguage === "ko"
                        ? "HANIJEMI, WABOM TOPIK 등 대표 유튜브 해설 특강, 쓰기 53·54번 만점 문장 공식, 1~6급 필수 문법을 총정리했습니다."
                        : "Curated TOPIK YouTube lectures, Q53/Q54 writing templates, core grammar patterns, and official NIIED resources."}
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-500">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                      유튜브 영역별 추천 강의 & 공식 기출 자료실
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                      쓰기 53·54번 4단 만점 템플릿 & 필수 문법
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMenu("study")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white transition group-hover:bg-amber-600"
                >
                  <span>
                    {selectedLanguage === "ko"
                      ? "학습 자료실 열기"
                      : "Open Study Hub"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ================= VIEW 2 & 3: IBT MOCK EXAM & WRITING WORKSPACE ================= */}
      {(activeMenu === "exam" || activeMenu === "writing") && (
        <div className="flex flex-1 flex-col">
          {/* Sub-toolbar with Section Filter & Question Buttons */}
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-2.5 px-6 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMenu("home")}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{t.backHome}</span>
                  </button>

                  <div className="h-4 w-px bg-slate-200" />

                  {/* Section Filter Pills */}
                  {(
                    [
                      { id: "ALL", label: `전체 (${questions.length})` },
                      {
                        id: "LEVEL",
                        label: `${formatLevelLabel(targetLevel)} 맞춤`,
                      },
                      { id: "LISTENING", label: "듣기 (Listening)" },
                      { id: "READING", label: "읽기 (Reading)" },
                      { id: "WRITING", label: "쓰기 51~54번 (Writing)" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setSectionFilter(f.id);
                        const firstMatch = questions.findIndex((q) => {
                          if (f.id === "ALL") return true;
                          if (f.id === "LISTENING")
                            return q.section_name === "LISTENING";
                          if (f.id === "READING")
                            return q.section_name === "READING";
                          if (f.id === "WRITING")
                            return q.section_name === "WRITING";
                          const d = q.difficulty_level || 3;
                          if (targetLevel <= 2) return d <= 2;
                          if (targetLevel <= 4) return d >= 3 && d <= 4;
                          return d >= 4;
                        });
                        if (firstMatch >= 0) {
                          setCurrentQuestionIndex(firstMatch);
                        }
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        sectionFilter === f.id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="hidden items-center gap-1 text-xs text-slate-500 md:inline-flex">
                    <CheckCircle2
                      className={`h-3.5 w-3.5 ${
                        isSaving
                          ? "animate-spin text-amber-500"
                          : "text-emerald-600"
                      }`}
                    />
                    {isSaving
                      ? "Auto-saving..."
                      : lastSavedAt
                        ? `Saved (${lastSavedAt})`
                        : "10s Auto-save ON"}
                  </span>

                  {/* Question Palette Popover */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPaletteOpen((p) => !p)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutGrid className="h-3.5 w-3.5 text-blue-600" />
                      <span>
                        {t.paletteBtn} ({answeredCount}/{questions.length})
                      </span>
                    </button>

                    {isPaletteOpen && (
                      <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                        <div className="mb-2.5 flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>{t.paletteBtn}</span>
                          <button
                            type="button"
                            onClick={() => setIsPaletteOpen(false)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1">
                          {questions.map((q, idx) => (
                            <button
                              key={q.question_id}
                              type="button"
                              onClick={() => {
                                setCurrentQuestionIndex(idx);
                                setIsPaletteOpen(false);
                              }}
                              className={`rounded-xl border p-2 text-center text-xs font-bold ${
                                idx === currentQuestionIndex
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : isAnswered(q.question_id)
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div>
                                {q.difficulty_level && q.difficulty_level <= 2
                                  ? "I"
                                  : "II"}{" "}
                                · Q{q.question_number}
                              </div>
                              <div className="text-[10px] font-normal opacity-80">
                                {q.section_name} ({q.difficulty_level}급)
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitExam}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? t.submittingBtn : t.submitBtn}</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Question Selector Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {filteredQuestionIndices.map(({ q, idx }) => {
                  const active = idx === currentQuestionIndex;
                  const done = isAnswered(q.question_id);
                  return (
                    <button
                      key={q.question_id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        active
                          ? "bg-blue-600 text-white shadow-sm"
                          : done
                            ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {q.section_name === "LISTENING" ? (
                        <Headphones className="h-3.5 w-3.5" />
                      ) : q.section_name === "READING" ? (
                        <FileText className="h-3.5 w-3.5" />
                      ) : (
                        <PenTool className="h-3.5 w-3.5" />
                      )}
                      <span>
                        [{q.difficulty_level}급] Q{q.question_number}
                      </span>
                      {done && (
                        <CheckCircle2
                          className={`h-3.5 w-3.5 ${
                            active ? "text-blue-100" : "text-emerald-600"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5:5 Split View Workspace */}
          <main className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-12">
            {/* LEFT PANE (50%): Listening Audio Player + Passage with Clickable Vocabulary Tokens */}
            <section className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-extrabold text-white">
                      Q{currentQuestion.question_number}
                    </span>
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {currentQuestion.section_name}
                    </span>
                    {currentQuestion.difficulty_level && (
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                        난이도 {currentQuestion.difficulty_level}급
                      </span>
                    )}
                    <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                      {currentQuestion.score_points}점
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    Target: {formatLevelLabel(targetLevel)}
                  </span>
                </div>

                {/* Listening TTS Audio Controller */}
                {currentQuestion.section_name === "LISTENING" &&
                  currentQuestion.passage_text && (
                    <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <Volume2 className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-xs font-extrabold text-blue-950">
                              TOPIK 한국어 듣기 음성 플레이어 (TTS)
                            </div>
                            <div className="text-[11px] text-blue-700">
                              실전처럼 먼저 음성을 듣고 문제를 푼 뒤 대본으로 복습하세요
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {!isSpeaking ? (
                            <button
                              type="button"
                              onClick={() =>
                                handlePlayListeningAudio(
                                  currentQuestion.passage_text || ""
                                )
                              }
                              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-blue-700"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                              <span>듣기 음원 재생</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleStopListeningAudio}
                              className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-red-700"
                            >
                              <Square className="h-3.5 w-3.5 fill-current" />
                              <span>재생 정지</span>
                            </button>
                          )}

                          {/* Speed Selector */}
                          <div className="flex items-center rounded-xl border border-blue-200 bg-white p-0.5">
                            {[0.8, 1.0, 1.2].map((rate) => (
                              <button
                                key={rate}
                                type="button"
                                onClick={() => setSpeechRate(rate)}
                                className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
                                  speechRate === rate
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowListeningScript((s) => !s)}
                            className="flex items-center gap-1 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
                          >
                            {showListeningScript ? (
                              <>
                                <EyeOff className="h-3.5 w-3.5" />
                                <span>대본 숨기기</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-3.5 w-3.5" />
                                <span>대본 보기</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                {currentQuestion.passage_text &&
                  (currentQuestion.section_name !== "LISTENING" ||
                    showListeningScript) && (
                    <ClickablePassage
                      title={t.tooltipHintTitle}
                      text={currentQuestion.passage_text}
                    />
                  )}
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs leading-relaxed text-blue-900">
                <div className="flex items-center gap-1.5 font-bold text-blue-800">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span>{t.tooltipHintTitle}</span>
                </div>
                <p className="mt-1 text-blue-700">{t.tooltipHintDesc}</p>
              </div>
            </section>

            {/* RIGHT PANE (50%): Question Prompt & Multiple Choice Options OR Wongoji Editor */}
            <section className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Question {currentQuestion.question_number}
                  </span>
                  <h2 className="mt-1 text-base font-bold leading-relaxed text-slate-900 sm:text-lg">
                    {currentQuestion.prompt_text}
                  </h2>
                </div>

                {currentQuestion.question_type === "MULTIPLE_CHOICE" ? (
                  <div className="space-y-3">
                    {currentQuestion.options.map((opt) => {
                      const isSelected =
                        currentAnswer.submitted_option_number ===
                        opt.option_number;
                      return (
                        <button
                          key={opt.option_number}
                          type="button"
                          onClick={() =>
                            setOptionAnswer(
                              currentQuestion.question_id,
                              opt.option_number
                            )
                          }
                          className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/70 shadow-sm"
                              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {opt.option_number}
                          </span>
                          <span
                            className={`text-base font-semibold ${
                              isSelected ? "text-blue-950" : "text-slate-800"
                            }`}
                          >
                            {opt.option_text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <WritingGridEditor
                    questionNumber={currentQuestion.question_number}
                    questionType={currentQuestion.question_type}
                    promptText={currentQuestion.prompt_text}
                    value={currentAnswer.submitted_text || ""}
                    onChange={(newText) =>
                      setTextAnswer(currentQuestion.question_id, newText)
                    }
                  />
                )}

                {/* 다국어 해설 보기 및 음성(TTS) 듣기 패널 */}
                <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200/70 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-indigo-600 px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                        {currentLangMeta.flag} {currentLangMeta.label} 해설 & 음성 지원
                      </span>
                      <span className="text-xs font-bold text-indigo-950">
                        선택 언어로 문제 풀이 전략 보고 듣기
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          speakMultilingualText(
                            `${currentQuestion.prompt_text}. ${currentQuestion.passage_text || ""}`,
                            "ko",
                            0.92
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                      >
                        <Volume2 className="h-3.5 w-3.5 text-blue-600" />
                        <span>🇰🇷 한국어 문제/지문 듣기</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          speakMultilingualText(
                            getLocalizedQuestionExplanation(
                              currentQuestion.section_name,
                              currentQuestion.question_number,
                              selectedLanguage
                            ),
                            selectedLanguage,
                            0.95
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>
                          {currentLangMeta.flag} {currentLangMeta.label} 해설 듣기
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => stopSpeech()}
                        className="rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
                      >
                        정지
                      </button>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-indigo-950 sm:text-sm">
                    {getLocalizedQuestionExplanation(
                      currentQuestion.section_name,
                      currentQuestion.question_number,
                      selectedLanguage
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1)
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 sm:text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t.prevQuestion}</span>
                </button>

                <span className="text-xs font-semibold text-slate-400">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.min(questions.length - 1, currentQuestionIndex + 1)
                      )
                    }
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 sm:text-sm"
                  >
                    <span>{t.nextQuestion}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitExam}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 sm:text-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{t.submitBtn}</span>
                  </button>
                )}
              </div>
            </section>
          </main>
        </div>
      )}

      {/* ================= VIEW 4: MULTILINGUAL VOCABULARY & GRAMMAR LAB ================= */}
      {activeMenu === "vocab" && (
        <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-8 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Kiwipiepy Morphological Analyzer + NIKL KRDICT Open API
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {t.card3Title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveMenu("home")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.backHome}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Morphological Search & Instant Lookup */}
            <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.card3Bullet1}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{t.card3Desc}</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVocabSearch(searchQuery);
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="면역력이, 양극화, 함양하다, 경신하다, 급증하다..."
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 sm:text-sm"
                >
                  Search
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "약속",
                  "반납하다",
                  "복잡하다",
                  "수면",
                  "집중력",
                  "경쟁력",
                  "신속성",
                  "급증하다",
                  "창출하다",
                  "대책",
                  "면역력",
                  "숙면",
                  "양극화",
                  "고립감",
                  "함양하다",
                  "훼손되다",
                  "경신하다",
                  "일맥상통하다",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setSearchQuery(chip);
                      handleVocabSearch(chip);
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {vocabLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Loading...
                </div>
              ) : vocabResult ? (
                <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/70 pb-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {vocabResult.lemma}
                        </span>
                        {vocabResult.pronunciation && (
                          <span className="text-xs font-semibold text-slate-500">
                            [{vocabResult.pronunciation}]
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        &ldquo;{vocabResult.clicked_surface}&rdquo; →{" "}
                        <strong>{vocabResult.lemma}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {vocabResult.part_of_speech && (
                        <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
                          {vocabResult.part_of_speech}
                        </span>
                      )}
                      {vocabResult.word_grade && (
                        <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                          {vocabResult.word_grade}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSaveWord(vocabResult)}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <BookmarkPlus className="h-3.5 w-3.5" />
                        <span>단어장 저장</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {vocabResult.senses.map((s) => (
                      <div
                        key={s.sense_order}
                        className="rounded-xl bg-white p-4 shadow-sm"
                      >
                        {s.translated_word && (
                          <div className="text-sm font-extrabold text-emerald-700">
                            {currentLangMeta.flag} {s.translated_word}
                          </div>
                        )}
                        {s.translated_definition && (
                          <p className="mt-1 text-xs leading-relaxed text-slate-700">
                            {s.translated_definition}
                          </p>
                        )}
                        <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
                          <strong className="text-slate-700">한국어 풀이:</strong>{" "}
                          {s.korean_definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            {/* Right: Saved Vocabulary Notebook */}
            <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {t.summarySavedWords} ({savedWords.length})
                </h3>
              </div>

              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {savedWords.map((item) => (
                  <div
                    key={item.lemma}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-slate-900">
                          {item.lemma}
                        </span>
                        {item.pronunciation && (
                          <span className="text-xs text-slate-500">
                            [{item.pronunciation}]
                          </span>
                        )}
                        {item.part_of_speech && (
                          <span className="rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            {item.part_of_speech}
                          </span>
                        )}
                        {item.word_grade && (
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                            {item.word_grade}
                          </span>
                        )}
                      </div>
                      {item.translated_word && (
                        <div className="text-xs font-bold text-blue-700">
                          {item.translated_word}
                        </div>
                      )}
                      <p className="text-xs text-slate-600">
                        {item.korean_definition}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSavedWords((prev) =>
                          prev.filter((w) => w.lemma !== item.lemma)
                        )
                      }
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Curated Level-by-Level TOPIK Vocabulary Dictionary Browser */}
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                  TOPIK Essential Vocabulary Database
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  급수별 필수 기출 어휘 사전 (초급 1~2급 · 중급 3~4급 · 고급 5~6급)
                </h3>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
                {(["ALL", "초급", "중급", "고급"] as const).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setVocabGradeFilter(grade)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      vocabGradeFilter === grade
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {grade === "ALL" ? "전체 어휘" : `${grade} 필수 어휘`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCuratedVocab.map((w) => {
                const trans =
                  w.translations[selectedLanguage] || w.translations.en;
                return (
                  <div
                    key={w.lemma}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-emerald-400 hover:bg-white hover:shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-extrabold text-slate-900">
                            {w.lemma}
                          </span>
                          <span className="text-xs text-slate-500">
                            [{w.pronunciation}]
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="rounded bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-sm">
                            {w.part_of_speech}
                          </span>
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                            {w.word_grade} · {w.topik_level}급
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-slate-800">
                        {w.korean_definition}
                      </p>

                      {selectedLanguage !== "ko" && trans && (
                        <p className="text-xs font-bold text-blue-700">
                          {currentLangMeta.flag} {trans[0]} — {trans[1]}
                        </p>
                      )}

                      <p className="rounded-xl bg-white p-2.5 text-xs text-slate-600">
                        <strong className="text-slate-800">기출 예문:</strong>{" "}
                        {w.example_ko}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            speakMultilingualText(
                              `${w.lemma}. ${w.korean_definition}. ${w.example_ko}`,
                              "ko",
                              0.92
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                        >
                          <Volume2 className="h-3 w-3 text-emerald-600" />
                          <span>🇰🇷 한국어</span>
                        </button>
                        {trans && (
                          <button
                            type="button"
                            onClick={() =>
                              speakMultilingualText(
                                `${trans[0]}. ${trans[1]}`,
                                selectedLanguage,
                                0.95
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                          >
                            <Volume2 className="h-3 w-3" />
                            <span>{currentLangMeta.flag} 해설 듣기</span>
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery(w.lemma);
                          handleVocabSearch(w.lemma);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:underline"
                      >
                        사전 상세 보기 & 단어장 추가 →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* ================= VIEW 5: YOUTUBE LECTURES, GRAMMAR, IDIOMS & WRITING TEMPLATES ================= */}
      {activeMenu === "study" && (
        <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-8 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                Curated TOPIK Knowledge Base & YouTube Study Archive
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                TOPIK 종합 학습 자료실 (유튜브 추천 강의 · 필수 문법 · 관용어 · 쓰기 공식)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveMenu("home")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.backHome}</span>
            </button>
          </div>

          {/* 1. YouTube & Official TOPIK Resources */}
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1 text-xs font-extrabold text-red-700">
                <Video className="h-3.5 w-3.5" />
                YouTube & Official Archives
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                추천 유튜브 TOPIK 특강 채널 & 공식 기출문제 자료실
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {STUDY_RESOURCES_DATA.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-white hover:shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-800">
                        {res.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {res.target_levels}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600">
                      {res.title}
                    </h4>

                    <p className="text-xs leading-relaxed text-slate-600">
                      {res.description}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {res.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/70 pt-2.5 text-xs font-bold text-blue-600">
                      <span>{res.provider}</span>
                      <span className="inline-flex items-center gap-1">
                        바로가기 <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* 2. Essential Grammar Patterns (1급~6급) */}
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700">
                <Library className="h-3.5 w-3.5" />
                Core Grammar Patterns (Levels 1–6)
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                급수별 필수 기출 문법 총정리 (읽기 1~4번 & 쓰기 51~54번 핵심)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {GRAMMAR_PATTERNS_DATA.map((g) => (
                <div
                  key={g.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-extrabold text-indigo-950">
                        {g.pattern}
                      </span>
                      <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800">
                        {g.level}급 · {g.category}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800">
                      {g.meaning_ko}
                    </p>
                    <p className="text-xs font-bold text-indigo-700">
                      {currentLangMeta.flag}{" "}
                      {g.translations?.[selectedLanguage] || g.meaning_en}
                    </p>

                    <div className="rounded-xl bg-white p-3 text-xs text-slate-700 shadow-sm">
                      <strong className="text-indigo-700">기출 예문:</strong>{" "}
                      {g.example_ko}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="rounded-xl bg-amber-50 p-2.5 text-[11px] font-medium text-amber-900">
                      💡 {g.exam_tip}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          speakMultilingualText(
                            `${g.pattern}. ${g.meaning_ko}. ${g.example_ko}`,
                            "ko",
                            0.92
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                      >
                        <Volume2 className="h-3 w-3 text-indigo-600" />
                        <span>🇰🇷 한국어 듣기</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          speakMultilingualText(
                            g.translations?.[selectedLanguage] || g.meaning_en,
                            selectedLanguage,
                            0.95
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>{currentLangMeta.flag} 해설 듣기</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Idioms & Four-Character Idioms (관용어·사자성어) */}
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Idioms & Four-Character Proverbs
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                TOPIK II 최빈출 관용어 & 사자성어 사전
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {IDIOMS_DATA.map((item) => (
                <div
                  key={item.expression}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-900">
                      {item.expression}
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-800">
                    {item.meaning_ko}
                  </p>
                  <p className="mt-1 text-[11px] font-bold text-emerald-700">
                    {currentLangMeta.flag}{" "}
                    {item.translations?.[selectedLanguage] || item.meaning_en}
                  </p>
                  <p className="mt-2.5 rounded-xl bg-white p-2.5 text-xs text-slate-600">
                    <strong>예문:</strong> {item.example}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        speakMultilingualText(
                          `${item.expression}. ${item.meaning_ko}. ${item.example}`,
                          "ko",
                          0.92
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                    >
                      <Volume2 className="h-3 w-3 text-emerald-600" />
                      <span>🇰🇷 한국어</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        speakMultilingualText(
                          item.translations?.[selectedLanguage] ||
                            item.meaning_en,
                          selectedLanguage,
                          0.95
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                    >
                      <Volume2 className="h-3 w-3" />
                      <span>{currentLangMeta.flag} 해설 듣기</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ================= VIEW 6: SCORE & AI GRADING REPORT PAGE ================= */}
      {activeMenu === "report" && (
        <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-6 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Comprehensive Score & Gemini AI Writing Feedback
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {t.card4Title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSubmitExam}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t.submitBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu("home")}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t.backHome}</span>
              </button>
            </div>
          </div>

          {!report ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <FileCheck2 className="mx-auto h-12 w-12 text-indigo-500" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {t.card4Desc}
              </h3>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => startMockExamAtQuestion(0, "exam", "ALL")}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  {t.card1Btn}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                >
                  {t.submitBtn}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <span className="text-xs font-semibold text-indigo-700">
                    Total Score
                  </span>
                  <div className="mt-1 text-2xl font-extrabold text-indigo-950">
                    {report.total_score} / {report.max_total_score}
                  </div>
                </div>
                <div className="rounded-2xl bg-sky-50 p-4">
                  <span className="text-xs font-semibold text-sky-700">
                    Listening
                  </span>
                  <div className="mt-1 text-2xl font-bold text-sky-900">
                    {report.listening_score}
                  </div>
                </div>
                <div className="rounded-2xl bg-blue-50 p-4">
                  <span className="text-xs font-semibold text-blue-700">
                    Reading
                  </span>
                  <div className="mt-1 text-2xl font-bold text-blue-900">
                    {report.reading_score}
                  </div>
                </div>
                <div className="rounded-2xl bg-purple-50 p-4">
                  <span className="text-xs font-semibold text-purple-700">
                    Writing AI
                  </span>
                  <div className="mt-1 text-2xl font-bold text-purple-900">
                    {report.writing_score}
                  </div>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4">
                  <span className="text-xs font-semibold text-amber-800">
                    Target Level
                  </span>
                  <div className="mt-1 text-2xl font-extrabold text-amber-900">
                    {formatLevelLabel(targetLevel)} ({selectedLevelCutoff}+)
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Detailed AI Grading Report Modal */}
      <GradingReportModal />
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}
