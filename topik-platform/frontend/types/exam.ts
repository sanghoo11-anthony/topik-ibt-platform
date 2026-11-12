export interface OptionItem {
  option_number: number;
  option_text: string;
}

export interface QuestionItem {
  question_id: string;
  section_name: "LISTENING" | "READING" | "WRITING";
  question_number: number;
  question_type: "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "ESSAY_SHORT" | "ESSAY_LONG";
  difficulty_level?: number;
  score_points: number;
  audio_url?: string | null;
  passage_text?: string | null;
  prompt_text: string;
  prompt_translations?: Record<string, string>;
  correct_answer_text?: string | null;
  explanations?: Record<string, string>;
  options: OptionItem[];
}

export interface SenseItem {
  sense_order: number;
  korean_definition: string;
  translated_word?: string | null;
  translated_definition?: string | null;
}

export interface VocabTooltipResponse {
  clicked_surface: string;
  lemma: string;
  target_code: string
  pronunciation?: string | null;
  part_of_speech?: string | null;
  word_grade?: string | null;
  senses: SenseItem[];
  is_mock?: boolean;
}

export interface RubricCriterionScore {
  earned: number;
  max: number;
  comment?: string;
}

export interface SpellingCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface WritingFeedbackReport {
  grader_engine?: string;
  language?: string;
  char_count_with_spaces: number;
  char_count_without_spaces: number;
  target_range: string;
  criteria_scores: {
    content_and_task: RubricCriterionScore;
    organization_and_structure: RubricCriterionScore;
    vocabulary_and_grammar: RubricCriterionScore;
  };
  spelling_and_grammar_corrections: SpellingCorrection[];
  overall_feedback: string;
  model_answer_comparison: string;
  model_answer: string;
}

export interface QuestionGradingDetail {
  question_id: string;
  question_number: number;
  section_name: string;
  question_type: string;
  prompt_text: string;
  passage_text?: string | null;
  submitted_option_number?: number | null;
  submitted_text?: string | null;
  correct_answer_text?: string | null;
  is_correct: boolean;
  score_points: number;
  earned_score: number;
  explanations?: Record<string, string> | null;
  feedback_report?: WritingFeedbackReport | null;
}

export interface SessionReportResponse {
  session_id: string;
  exam_id: string;
  exam_title: string;
  exam_type: string;
  status: string;
  started_at: string;
  submitted_at?: string | null;
  listening_score: number;
  reading_score: number;
  writing_score: number;
  total_score: number;
  max_total_score: number;
  awarded_level: number;
  next_level_cutoff?: number | null;
  questions_review: QuestionGradingDetail[];
}

export const SUPPORTED_LANGUAGES = [
  { code: "ko", label: "한국어 (Korean)", flag: "🇰🇷" },
  { code: "en", label: "English (영어)", flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt (베트남어)", flag: "🇻🇳" },
  { code: "zh", label: "中文 (중국어)", flag: "🇨🇳" },
  { code: "ja", label: "日本語 (일본어)", flag: "🇯🇵" },
  { code: "es", label: "Español (스페인어)", flag: "🇪🇸" },
  { code: "fr", label: "Français (프랑스어)", flag: "🇫🇷" },
  { code: "ru", label: "Русский (러시아어)", flag: "🇷🇺" },
  { code: "id", label: "Bahasa Indonesia (인도네시아어)", flag: "🇮🇩" },
  { code: "th", label: "ภาษาไทย (태국어)", flag: "🇹🇭" },
  { code: "mn", label: "Монгол (몽골어)", flag: "🇲🇳" },
  { code: "ar", label: "العربية (아랍어)", flag: "🇸🇦" },
] as const;

export interface UITranslation {
  brandBadge: string;
  brandSubtitle: string;
  navHome: string;
  navExam: string;
  navWriting: string;
  navVocab: string;
  navReport: string;
  levelSelectorTag: string;
  levelSelectorTitle: string;
  levelSelectorDesc: string;
  topik1Title: string;
  topik1Meta: string;
  topik2Title: string;
  topik2Meta: string;
  levelUnit: string;
  pointsOrAbove: string;
  selectedBadge: string;
  startSelectedLevelBtn: string;
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroDesc: string;
  heroStartExamBtn: string;
  heroStartWritingBtn: string;
  summaryTitle: string;
  summaryProgress: string;
  summarySavedWords: string;
  summaryDictSupport: string;
  summaryDictValue: string;
  summaryAiGrading: string;
  summaryAiValue: string;
  modulesTag: string;
  modulesTitle: string;
  modulesSubtitle: string;
  card1Title: string;
  card1Desc: string;
  card1Bullet1: string;
  card1Bullet2: string;
  card1Btn: string;
  card2Title: string;
  card2Desc: string;
  card2Bullet1: string;
  card2Bullet2: string;
  card2Btn53: string;
  card2Btn54: string;
  card3Title: string;
  card3Desc: string;
  card3Bullet1: string;
  card3Bullet2: string;
  card3Btn: string;
  card4Title: string;
  card4Desc: string;
  card4Bullet1: string;
  card4Bullet2: string;
  card4Btn: string;
  backHome: string;
  paletteBtn: string;
  submitBtn: string;
  submittingBtn: string;
  prevQuestion: string;
  nextQuestion: string;
  tooltipHintTitle: string;
  tooltipHintDesc: string;
}

export const UI_TRANSLATIONS: Record<string, UITranslation> = {
  ko: {
    brandBadge: "NIIED 공식 규격",
    brandSubtitle: "외국인 한국어능력시험 실전 모의고사 · AI 원고지 첨삭 · 다국어 사전",
    navHome: "홈 대시보드",
    navExam: "실전 IBT 모의시험",
    navWriting: "쓰기 원고지 (53·54번)",
    navVocab: "다국어 사전·단어장",
    navReport: "성적·AI 첨삭 리포트",
    levelSelectorTag: "STEP 1 · 응시 시험 및 목표 급수 선택",
    levelSelectorTitle: "응시할 TOPIK 시험과 목표 급수(1급~6급)를 선택하세요",
    levelSelectorDesc: "원하는 급수를 클릭하면 맞춤형 시험 구성과 합격 기준 점수가 설정됩니다.",
    topik1Title: "TOPIK I (초급 · 1~2급 · 만점 200점)",
    topik1Meta: "듣기 40분 + 읽기 60분 (총 100분)",
    topik2Title: "TOPIK II (중·고급 · 3~6급 · 만점 300점)",
    topik2Meta: "듣기 60분 + 쓰기 50분 + 읽기 70분 (총 180분)",
    levelUnit: "급",
    pointsOrAbove: "점 이상",
    selectedBadge: "선택됨",
    startSelectedLevelBtn: "선택한 급수로 모의시험 시작하기",
    heroBadge: "국립국제교육원(NIIED) TOPIK I · II IBT 실전 시뮬레이션",
    heroTitlePrefix: "외국인 수험생을 위한 ",
    heroTitleHighlight: "올인원 TOPIK IBT",
    heroTitleSuffix: " 스마트 학습 플랫폼",
    heroDesc:
      "실제 IBT 시험과 동일한 5:5 분할 화면에서 지문 어절 클릭 시 즉각 표시되는 다국어 사전 툴팁, 20칸 원고지 에디터, Gemini AI 작문 자동 채점을 경험해 보세요.",
    heroStartExamBtn: "제91회 실전 모의고사 시작하기",
    heroStartWritingBtn: "53·54번 원고지 & AI 첨삭",
    summaryTitle: "현재 선택된 목표 및 학습 현황",
    summaryProgress: "모의시험 진행률",
    summarySavedWords: "단어장 저장 어휘",
    summaryDictSupport: "사전 번역 지원",
    summaryDictValue: "국립국어원 12개 언어",
    summaryAiGrading: "쓰기 자동 채점",
    summaryAiValue: "Gemini AI 3대 기준",
    modulesTag: "STEP 2 · 핵심 학습 모듈 선택",
    modulesTitle: "원하는 학습 모드를 선택해 시작하세요",
    modulesSubtitle: "선택한 언어 설정에 맞춰 사전 뜻풀이와 AI 첨삭 리포트가 제공됩니다.",
    card1Title: "1. 실전 IBT 모의시험",
    card1Desc:
      "실제 TOPIK IBT와 동일한 좌우 5:5 분할 화면에서 읽기(13번) 및 쓰기(53·54번) 기출 문항을 풀고 모르는 어절을 클릭해 즉시 뜻을 확인합니다.",
    card1Bullet1: "어절 클릭 시 다국어 사전 팝오버",
    card1Bullet2: "문항 팔레트 및 10초 주기 자동 저장",
    card1Btn: "모의시험 입장하기",
    card2Title: "2. TOPIK II 쓰기 원고지 훈련",
    card2Desc:
      "53번(200~300자 도표 분석)과 54번(600~700자 논술문) 전용 20칸 원고지 에디터로 답안을 작성하고 Gemini AI 공식 기준 첨삭을 받습니다.",
    card2Bullet1: "공백 포함/제외 글자 수 실시간 카운터",
    card2Bullet2: "맞춤법 교정 및 만점 모범 답안 비교",
    card2Btn53: "53번 (30점)",
    card2Btn54: "54번 (50점)",
    card3Title: "3. 다국어 형태소 사전·단어장",
    card3Desc:
      "한국어 활용형 어절(예: '줄이는', '해롭다', '집중력도')을 입력하면 형태소 분석기가 사전 기본형을 추출해 뜻을 보여줍니다.",
    card3Bullet1: "용언·파생어 기본형('-다') 자동 복원",
    card3Bullet2: "발음·품사·TOPIK 급수 및 단어장 저장",
    card3Btn: "다국어 사전·단어장 열기",
    card4Title: "4. 성적표 & AI 첨삭 리포트",
    card4Desc:
      "제출한 모의시험의 영역별 득점, TOPIK 급수 달성 여부, 객관식 다국어 해설 및 쓰기 3대 평가 기준별 상세 첨삭 리포트를 확인합니다.",
    card4Bullet1: "내용·전개구조·어휘문법 세부 채점표",
    card4Bullet2: "수험생 언어별 맞춤 피드백 리포트",
    card4Btn: "성적·첨삭 리포트 보기",
    backHome: "홈으로",
    paletteBtn: "문항 팔레트",
    submitBtn: "최종 제출 및 AI 채점",
    submittingBtn: "채점 중...",
    prevQuestion: "이전 문항",
    nextQuestion: "다음 문항",
    tooltipHintTitle: "실시간 다국어 어휘 툴팁 안내",
    tooltipHintDesc: "지문 속 모든 한국어 어절을 클릭하면 형태소 기본형을 분석해 선택된 언어의 뜻풀이를 즉시 띄워줍니다.",
  },
  en: {
    brandBadge: "NIIED Official Spec",
    brandSubtitle: "TOPIK IBT Mock Exam · AI Wongoji Essay Grading · Multilingual Dictionary",
    navHome: "Home Dashboard",
    navExam: "IBT Mock Exam",
    navWriting: "Writing (Q53·54)",
    navVocab: "Vocab & Dictionary",
    navReport: "Score & AI Report",
    levelSelectorTag: "STEP 1 · Select Exam & Target Level",
    levelSelectorTitle: "Choose Your Target TOPIK Level (Level 1 – Level 6)",
    levelSelectorDesc: "Click any level card below to configure your target cutoff score and start tailored practice.",
    topik1Title: "TOPIK I (Beginner · Levels 1–2 · Max 200 pts)",
    topik1Meta: "Listening 40m + Reading 60m (Total 100 mins)",
    topik2Title: "TOPIK II (Intermediate–Advanced · Levels 3–6 · Max 300 pts)",
    topik2Meta: "Listening 60m + Writing 50m + Reading 70m (Total 180 mins)",
    levelUnit: "Level ",
    pointsOrAbove: "+ pts",
    selectedBadge: "Selected",
    startSelectedLevelBtn: "Start Mock Exam for Selected Level",
    heroBadge: "Official NIIED TOPIK I & II IBT Simulation Platform",
    heroTitlePrefix: "All-in-One ",
    heroTitleHighlight: "Global TOPIK IBT",
    heroTitleSuffix: " Smart Learning Platform",
    heroDesc:
      "Experience realistic 5:5 split-screen TOPIK IBT simulation with instant morphological dictionary tooltips on word click, a 20-column Wongoji manuscript editor, and Gemini AI essay grading.",
    heroStartExamBtn: "Start 91st TOPIK II Mock Exam",
    heroStartWritingBtn: "Q53·54 Wongoji & AI Grading",
    summaryTitle: "Current Target & Study Progress",
    summaryProgress: "Exam Progress",
    summarySavedWords: "Saved Vocabulary",
    summaryDictSupport: "Dictionary Languages",
    summaryDictValue: "NIKL 12 Languages",
    summaryAiGrading: "Essay Grading",
    summaryAiValue: "Gemini AI 3 Rubrics",
    modulesTag: "STEP 2 · Choose a Learning Module",
    modulesTitle: "Select a Study Mode to Begin",
    modulesSubtitle: "All dictionary tooltips and AI essay feedback automatically adapt to your selected language.",
    card1Title: "1. Real IBT Mock Exam",
    card1Desc:
      "Solve Reading (Q13) and Writing (Q53·54) questions in a realistic 5:5 split view. Click any Korean word in the passage for instant dictionary lookup.",
    card1Bullet1: "Instant word-click dictionary popover",
    card1Bullet2: "Question palette & 10s auto-save",
    card1Btn: "Enter Mock Exam",
    card2Title: "2. TOPIK II Writing Wongoji",
    card2Desc:
      "Practice Q53 (200–300 chars data analysis) and Q54 (600–700 chars argumentative essay) on a 20-column Wongoji grid with Gemini AI grading.",
    card2Bullet1: "Live char counter (with/without spaces)",
    card2Bullet2: "Grammar correction & model essay diff",
    card2Btn53: "Q53 (30 pts)",
    card2Btn54: "Q54 (50 pts)",
    card3Title: "3. AI Morphological Dictionary",
    card3Desc:
      "Enter conjugated Korean words (e.g. '줄이는', '해롭다', '집중력도')—Kiwipiepy extracts the dictionary base form and shows definitions.",
    card3Bullet1: "Automatic verb/noun lemma extraction",
    card3Bullet2: "Pronunciation, POS, TOPIK grade & wordbook",
    card3Btn: "Open Dictionary Lab",
    card4Title: "4. Score & AI Feedback Report",
    card4Desc:
      "Review section scores, TOPIK level cutoff attainment, multilingual explanations, and detailed 3-criteria writing rubric feedback.",
    card4Bullet1: "Content, structure & grammar rubric breakdown",
    card4Bullet2: "Feedback generated in your native language",
    card4Btn: "View Score Report",
    backHome: "Back to Home",
    paletteBtn: "Question Palette",
    submitBtn: "Submit & AI Grade",
    submittingBtn: "Grading...",
    prevQuestion: "Previous",
    nextQuestion: "Next",
    tooltipHintTitle: "Interactive Multilingual Vocabulary Tooltip",
    tooltipHintDesc: "Click any Korean word in the passage to extract its dictionary base form and view its definition in your selected language.",
  },
  vi: {
    brandBadge: "Chuẩn NIIED",
    brandSubtitle: "Thi thử TOPIK IBT · Chấm viết AI trên giấy Wongoji · Từ điển đa ngôn ngữ",
    navHome: "Trang chủ",
    navExam: "Thi thử IBT",
    navWriting: "Luyện viết (Câu 53·54)",
    navVocab: "Từ điển & Sổ từ",
    navReport: "Kết quả & Chấm AI",
    levelSelectorTag: "BƯỚC 1 · Chọn kỳ thi & Cấp độ mục tiêu",
    levelSelectorTitle: "Chọn kỳ thi TOPIK và Cấp độ mục tiêu (Cấp 1 ~ Cấp 6)",
    levelSelectorDesc: "Nhấp vào cấp độ bạn muốn đạt để thiết lập điểm chuẩn mục tiêu và bắt đầu luyện tập.",
    topik1Title: "TOPIK I (Sơ cấp · Cấp 1–2 · Tối đa 200 điểm)",
    topik1Meta: "Nghe 40 phút + Đọc 60 phút (Tổng 100 phút)",
    topik2Title: "TOPIK II (Trung–Cao cấp · Cấp 3–6 · Tối đa 300 điểm)",
    topik2Meta: "Nghe 60p + Viết 50p + Đọc 70p (Tổng 180 phút)",
    levelUnit: "Cấp ",
    pointsOrAbove: "+ điểm",
    selectedBadge: "Đã chọn",
    startSelectedLevelBtn: "Bắt đầu thi thử với cấp độ đã chọn",
    heroBadge: "Nền tảng mô phỏng TOPIK I & II IBT chính thức",
    heroTitlePrefix: "Nền tảng học ",
    heroTitleHighlight: "TOPIK IBT Toàn diện",
    heroTitleSuffix: " cho thí sinh quốc tế",
    heroDesc:
      "Trải nghiệm màn hình chia 5:5 giống thi thật, nhấp vào từ để xem nghĩa tiếng Việt tức thì, trình soạn thảo giấy kẻ ô Wongoji 20 cột và chấm bài viết bằng Gemini AI.",
    heroStartExamBtn: "Bắt đầu đề thi thử TOPIK II kỳ 91",
    heroStartWritingBtn: "Luyện viết Câu 53·54 & Chấm AI",
    summaryTitle: "Mục tiêu & Tiến độ học tập hiện tại",
    summaryProgress: "Tiến độ làm bài",
    summarySavedWords: "Từ vựng đã lưu",
    summaryDictSupport: "Từ điển hỗ trợ",
    summaryDictValue: "12 ngôn ngữ NIKL",
    summaryAiGrading: "Chấm bài viết tự động",
    summaryAiValue: "Gemini AI 3 tiêu chí",
    modulesTag: "BƯỚC 2 · Chọn chế độ luyện tập",
    modulesTitle: "Chọn tính năng bạn muốn bắt đầu",
    modulesSubtitle: "Từ điển và nhận xét bài viết AI sẽ hiển thị bằng Tiếng Việt.",
    card1Title: "1. Thi thử IBT thực chiến",
    card1Desc:
      "Giải đề Đọc (Câu 13) và Viết (Câu 53·54) trên giao diện chia 5:5. Nhấp vào bất kỳ từ tiếng Hàn nào trong bài đọc để tra nghĩa ngay.",
    card1Bullet1: "Popup từ điển đa ngôn ngữ khi nhấp từ",
    card1Bullet2: "Bảng chuyển câu hỏi & tự động lưu mỗi 10 giây",
    card1Btn: "Vào phòng thi IBT",
    card2Title: "2. Luyện viết Wongoji TOPIK II",
    card2Desc:
      "Viết bài Câu 53 (200–300 chữ) và Câu 54 (600–700 chữ) trên giấy kẻ ô 20 cột Wongoji và nhận chấm điểm chi tiết từ Gemini AI.",
    card2Bullet1: "Đếm số ký tự thời gian thực (có/không dấu cách)",
    card2Bullet2: "Sửa lỗi chính tả & so sánh với bài mẫu",
    card2Btn53: "Câu 53 (30đ)",
    card2Btn54: "Câu 54 (50đ)",
    card3Title: "3. Từ điển hình thái & Sổ từ vựng",
    card3Desc:
      "Nhập từ đã chia đuôi (VD: '줄이는', '해롭다', '집중력도') — AI sẽ tự động đưa về dạng nguyên thể và giải nghĩa tiếng Việt.",
    card3Bullet1: "Tự động khôi phục từ nguyên mẫu ('-다')",
    card3Bullet2: "Phát âm, từ loại, cấp độ TOPIK & lưu sổ từ",
    card3Btn: "Mở Từ điển & Sổ từ",
    card4Title: "4. Bảng điểm & Báo cáo chấm AI",
    card4Desc:
      "Xem điểm từng kỹ năng, đánh giá cấp độ đạt được, giải thích đáp án và nhận xét bài viết theo 3 tiêu chí TOPIK chính thức.",
    card4Bullet1: "Điểm Nội dung · Cấu trúc · Từ vựng & Ngữ pháp",
    card4Bullet2: "Nhận xét chi tiết bằng ngôn ngữ của bạn",
    card4Btn: "Xem Báo cáo kết quả",
    backHome: "Về Trang chủ",
    paletteBtn: "Bảng câu hỏi",
    submitBtn: "Nộp bài & Chấm AI",
    submittingBtn: "Đang chấm...",
    prevQuestion: "Câu trước",
    nextQuestion: "Câu tiếp",
    tooltipHintTitle: "Hướng dẫn tra từ điển nhanh",
    tooltipHintDesc: "Nhấp vào bất kỳ từ tiếng Hàn nào trong đoạn văn để xem dạng nguyên mẫu và nghĩa Tiếng Việt.",
  },
  zh: {
    brandBadge: "NIIED 官方规格",
    brandSubtitle: "TOPIK IBT 全真模考 · AI 原稿纸作文批改 · 多语种词典",
    navHome: "首页仪表盘",
    navExam: "IBT 全真模考",
    navWriting: "写作原稿纸 (53·54题)",
    navVocab: "多语种词典·单词本",
    navReport: "成绩单·AI 批改报告",
    levelSelectorTag: "STEP 1 · 选择考试类型与目标等级",
    levelSelectorTitle: "请选择您要备考的 TOPIK 等级（1级 ~ 6级）",
    levelSelectorDesc: "点击下方任意等级卡片即可设定目标分数线并开始针对性训练。",
    topik1Title: "TOPIK I（初级 · 1~2级 · 满分 200分）",
    topik1Meta: "听力 40分钟 + 阅读 60分钟（共 100分钟）",
    topik2Title: "TOPIK II（中高级 · 3~6级 · 满分 300分）",
    topik2Meta: "听力 60分 + 写作 50分 + 阅读 70分（共 180分钟）",
    levelUnit: "级",
    pointsOrAbove: "分以上",
    selectedBadge: "已选择",
    startSelectedLevelBtn: "以所选等级开始模拟考试",
    heroBadge: "韩国国立国际教育院 (NIIED) TOPIK I·II IBT 模拟平台",
    heroTitlePrefix: "专为外国考生打造的 ",
    heroTitleHighlight: "一站式 TOPIK IBT",
    heroTitleSuffix: " 智能备考平台",
    heroDesc:
      "还原真实 IBT 5:5 分屏考试界面，点击文章词节即可查看中文释义，内置 53·54 题 20 格原稿纸编辑器与 Gemini AI 官方标准自动批改。",
    heroStartExamBtn: "开始第91届 TOPIK II 全真模考",
    heroStartWritingBtn: "53·54题原稿纸 & AI 批改",
    summaryTitle: "当前目标与学习进度",
    summaryProgress: "模考答题进度",
    summarySavedWords: "生词本词汇",
    summaryDictSupport: "词典语种支持",
    summaryDictValue: "国立国语院 12种语言",
    summaryAiGrading: "写作智能评分",
    summaryAiValue: "Gemini AI 三大标准",
    modulesTag: "STEP 2 · 选择核心学习模块",
    modulesTitle: "请选择您要使用的学习功能",
    modulesSubtitle: "词典释义与 AI 作文批改报告将自动切换为您选择的语言。",
    card1Title: "1. 实战 IBT 模拟考试",
    card1Desc:
      "在 5:5 分屏界面中解答阅读（13题）与写作（53·54题）真题，点击任意韩语词节即可弹出中文词典释义。",
    card1Bullet1: "点击词节即时弹出多语种词典",
    card1Bullet2: "题号导航面板与每 10 秒自动保存",
    card1Btn: "进入模拟考试",
    card2Title: "2. TOPIK II 写作原稿纸训练",
    card2Desc:
      "使用 53题（200~300字图表分析）与 54题（600~700字议论文）专用 20格原稿纸编辑器作答，并获取 Gemini AI 批改。",
    card2Bullet1: "含空格/不含空格实时字数统计",
    card2Bullet2: "拼写语法纠错与满分范文对比",
    card2Btn53: "53题 (30分)",
    card2Btn54: "54题 (50分)",
    card3Title: "3. 形态素词典与生词本",
    card3Desc:
      "输入带助词或词尾的韩语活用词节（如 '줄이는', '해롭다', '집중력도'），自动还原词典原形并查询释义。",
    card3Bullet1: "用言与派生词原形('-다')自动还原",
    card3Bullet2: "发音、词性、TOPIK 等级与生词收藏",
    card3Btn: "打开词典与生词本",
    card4Title: "4. 成绩单与 AI 批改报告",
    card4Desc:
      "查看各科目得分、TOPIK 等级达标情况、客观题多语种解析及写作三大评分维度详细反馈。",
    card4Bullet1: "内容任务·篇章结构·词汇语法评分",
    card4Bullet2: "母语定制化写作诊断与范文对照",
    card4Btn: "查看成绩与批改报告",
    backHome: "返回首页",
    paletteBtn: "题目导航",
    submitBtn: "提交答卷并 AI 批改",
    submittingBtn: "批改中...",
    prevQuestion: "上一题",
    nextQuestion: "下一题",
    tooltipHintTitle: "实时多语种词汇提示说明",
    tooltipHintDesc: "点击左侧文章中的任意韩语词节，系统将自动提取词典原形并显示中文释义。",
  },
  ja: {
    brandBadge: "NIIED 公式規格",
    brandSubtitle: "TOPIK IBT 実戦模試 · AI 原稿用紙添削 · 多言語辞書",
    navHome: "ホーム",
    navExam: "実戦 IBT 模擬試験",
    navWriting: "作文原稿用紙 (53·54番)",
    navVocab: "多言語辞書・単語帳",
    navReport: "成績・AI 添削レポート",
    levelSelectorTag: "STEP 1 · 受験区分および目標級数の選択",
    levelSelectorTitle: "受験する TOPIK 試験と目標級（1級〜6級）を選択してください",
    levelSelectorDesc: "目標とする級をクリックすると合格基準点が設定され、すぐに学習を開始できます。",
    topik1Title: "TOPIK I（初級 · 1〜2級 · 200点満点）",
    topik1Meta: "聞き取り 40分 + 読解 60分（計 100分）",
    topik2Title: "TOPIK II（中・高級 · 3〜6級 · 300点満点）",
    topik2Meta: "聞き取り 60分 + 書き取り 50分 + 読解 70分（計 180分）",
    levelUnit: "級",
    pointsOrAbove: "点以上",
    selectedBadge: "選択中",
    startSelectedLevelBtn: "選択した級で模擬試験を開始する",
    heroBadge: "国立国際教育院 (NIIED) TOPIK I・II IBT 実戦シミュレーション",
    heroTitlePrefix: "外国人受験者のための ",
    heroTitleHighlight: "オールインワン TOPIK IBT",
    heroTitleSuffix: " 学習プラットフォーム",
    heroDesc:
      "本番さながらの5:5分割画面で、文節クリックによる即時日本語辞書ポップオーバー、20マス原稿用紙エディタ、Gemini AI 作文自動採点を体験できます。",
    heroStartExamBtn: "第91回 TOPIK II 実戦模試を開始",
    heroStartWritingBtn: "53・54番 原稿用紙 & AI 添削",
    summaryTitle: "現在の目標および学習状況",
    summaryProgress: "模試解答進捗",
    summarySavedWords: "保存済み単語",
    summaryDictSupport: "辞書翻訳対応",
    summaryDictValue: "国立国語院 12言語",
    summaryAiGrading: "作文自動採点",
    summaryAiValue: "Gemini AI 3大基準",
    modulesTag: "STEP 2 · コア学習モジュールの選択",
    modulesTitle: "希望する学習モードを選択して始めましょう",
    modulesSubtitle: "選択した言語設定に合わせて辞書解説とAI添削レポートが表示されます。",
    card1Title: "1. 実戦 IBT 模擬試験",
    card1Desc:
      "左右5:5分割画面で読解(13番)や作文(53・54番)を解き、わからない韓国語をクリックして即座に日本語の意味を確認します。",
    card1Bullet1: "語절クリックで多言語辞書ポップオーバー",
    card1Bullet2: "問題パレット＆10秒周期の自動保存",
    card1Btn: "模擬試験に入る",
    card2Title: "2. TOPIK II 作文原稿用紙トレーニング",
    card2Desc:
      "53番(200〜300字図表分析)と54番(600〜700字論説文)専用の20マス原稿用紙エディタで作成し、Gemini AI添削を受けます。",
    card2Bullet1: "空白込み/除外のリアルタイム文字数カウンター",
    card2Bullet2: "分かち書き・スペル矯正および模範解答比較",
    card2Btn53: "53番 (30点)",
    card2Btn54: "54番 (50点)",
    card3Title: "3. 形態素辞書・マイルーム単語帳",
    card3Desc:
      "活用形の語節（例：'줄이는', '해롭다', '집중력도'）を入力すると、形態素解析器が辞書基本形を抽出して意味を表示します。",
    card3Bullet1: "用言・派生語の基本形('-다')自動復元",
    card3Bullet2: "発音・品詞・TOPIK級数および単語帳保存",
    card3Btn: "辞書・単語帳を開く",
    card4Title: "4. 成績表 & AI 添削レポート",
    card4Desc:
      "領域別の得点、TOPIK級数の達成判定、多言語解説および作文3大評価基準別の詳細添削レポートを確認します。",
    card4Bullet1: "内容・展開構造・語彙文法の項目別採点",
    card4Bullet2: "受験者の母国語によるフィードバック",
    card4Btn: "成績・添削レポートを見る",
    backHome: "ホームへ戻る",
    paletteBtn: "問題パレット",
    submitBtn: "最終提出 & AI 採点",
    submittingBtn: "採点中...",
    prevQuestion: "前の問題",
    nextQuestion: "次の問題",
    tooltipHintTitle: "リアルタイム多言語語彙ツールチップ案内",
    tooltipHintDesc: "本文中の韓国語をクリックすると、基本形を自動抽出して日本語の意味を表示します。",
  },
  es: {
    brandBadge: "Estándar Oficial NIIED",
    brandSubtitle: "Examen Simulado TOPIK IBT · Corrección IA Wongoji · Diccionario Multilingüe",
    navHome: "Inicio",
    navExam: "Simulacro IBT",
    navWriting: "Escritura (P53·54)",
    navVocab: "Diccionario y Vocabulario",
    navReport: "Informe y Nota IA",
    levelSelectorTag: "PASO 1 · Selecciona Examen y Nivel Objetivo",
    levelSelectorTitle: "Elige tu Nivel Objetivo de TOPIK (Nivel 1 – Nivel 6)",
    levelSelectorDesc: "Haz clic en el nivel que deseas alcanzar para configurar tu puntaje mínimo y comenzar.",
    topik1Title: "TOPIK I (Principiante · Niveles 1–2 · Máx 200 pts)",
    topik1Meta: "Escucha 40m + Lectura 60m (Total 100 min)",
    topik2Title: "TOPIK II (Intermedio–Avanzado · Niveles 3–6 · Máx 300 pts)",
    topik2Meta: "Escucha 60m + Escritura 50m + Lectura 70m (Total 180 min)",
    levelUnit: "Nivel ",
    pointsOrAbove: "+ pts",
    selectedBadge: "Seleccionado",
    startSelectedLevelBtn: "Iniciar Simulacro del Nivel Seleccionado",
    heroBadge: "Plataforma Oficial de Simulación TOPIK I y II IBT",
    heroTitlePrefix: "Plataforma Inteligente ",
    heroTitleHighlight: "TOPIK IBT Todo-en-Uno",
    heroTitleSuffix: " para Estudiantes Globales",
    heroDesc: "Practica en pantalla dividida 5:5 con diccionario emergente al hacer clic en cualquier palabra coreana, cuadrícula Wongoji de 20 columnas y evaluación con Gemini IA.",
    heroStartExamBtn: "Iniciar 91º Simulacro TOPIK II",
    heroStartWritingBtn: "Práctica Wongoji P53·54 e IA",
    summaryTitle: "Objetivo Actual y Progreso",
    summaryProgress: "Progreso del Examen",
    summarySavedWords: "Palabras Guardadas",
    summaryDictSupport: "Idiomas del Diccionario",
    summaryDictValue: "12 Idiomas NIKL",
    summaryAiGrading: "Evaluación de Ensayo",
    summaryAiValue: "Gemini IA 3 Criterios",
    modulesTag: "PASO 2 · Elige un Módulo de Estudio",
    modulesTitle: "Selecciona un Modo de Aprendizaje",
    modulesSubtitle: "Las definiciones del diccionario y el informe de IA se mostrarán en Español.",
    card1Title: "1. Simulacro Real IBT",
    card1Desc: "Resuelve preguntas de Lectura (P13) y Escritura (P53·54) en vista dividida 5:5 con diccionario instantáneo.",
    card1Bullet1: "Diccionario emergente al hacer clic",
    card1Bullet2: "Paleta de preguntas y autoguardado (10s)",
    card1Btn: "Entrar al Simulacro",
    card2Title: "2. Escritura Wongoji TOPIK II",
    card2Desc: "Escribe tus ensayos P53 (200–300 caracteres) y P54 (600–700 caracteres) en cuadrícula de 20 columnas con revisión IA.",
    card2Bullet1: "Contador de caracteres en tiempo real",
    card2Bullet2: "Corrección ortográfica y ensayo modelo",
    card2Btn53: "P53 (30 pts)",
    card2Btn54: "P54 (50 pts)",
    card3Title: "3. Diccionario Morfológico IA",
    card3Desc: "Busca palabras conjugadas en coreano y obtén su lema base, pronunciación, nivel TOPIK y traducción.",
    card3Bullet1: "Extracción automática de forma base ('-다')",
    card3Bullet2: "Guarda vocabulario en tu cuaderno personal",
    card3Btn: "Abrir Diccionario",
    card4Title: "4. Informe de Calificación IA",
    card4Desc: "Consulta tu puntaje por sección, nivel TOPIK alcanzado y retroalimentación detallada de escritura.",
    card4Bullet1: "Desglose de contenido, estructura y gramática",
    card4Bullet2: "Informe generado en tu idioma",
    card4Btn: "Ver Informe",
    backHome: "Volver al Inicio",
    paletteBtn: "Paleta",
    submitBtn: "Enviar y Calificar con IA",
    submittingBtn: "Calificando...",
    prevQuestion: "Anterior",
    nextQuestion: "Siguiente",
    tooltipHintTitle: "Guía de Diccionario Instantáneo",
    tooltipHintDesc: "Haz clic en cualquier palabra coreana del texto para ver su forma base y significado en Español.",
  },
  fr: {
    brandBadge: "Norme Officielle NIIED",
    brandSubtitle: "Examen Blanc TOPIK IBT · Correction IA Wongoji · Dictionnaire Multilingue",
    navHome: "Accueil",
    navExam: "Examen Blanc IBT",
    navWriting: "Rédaction (Q53·54)",
    navVocab: "Dictionnaire & Carnet",
    navReport: "Résultats & Rapport IA",
    levelSelectorTag: "ÉTAPE 1 · Choisissez l'Examen et le Niveau Cible",
    levelSelectorTitle: "Sélectionnez votre Niveau TOPIK Cible (Niveau 1 à 6)",
    levelSelectorDesc: "Cliquez sur le niveau souhaité pour configurer le score seuil et commencer l'entraînement.",
    topik1Title: "TOPIK I (Débutant · Niveaux 1–2 · Max 200 pts)",
    topik1Meta: "Écoute 40m + Lecture 60m (Total 100 min)",
    topik2Title: "TOPIK II (Intermédiaire–Avancé · Niveaux 3–6 · Max 300 pts)",
    topik2Meta: "Écoute 60m + Rédaction 50m + Lecture 70m (Total 180 min)",
    levelUnit: "Niveau ",
    pointsOrAbove: "+ pts",
    selectedBadge: "Sélectionné",
    startSelectedLevelBtn: "Démarrer l'Examen pour ce Niveau",
    heroBadge: "Plateforme Officielle de Simulation TOPIK I & II IBT",
    heroTitlePrefix: "Plateforme d'Apprentissage ",
    heroTitleHighlight: "TOPIK IBT Tout-en-Un",
    heroTitleSuffix: " pour Candidats Internationaux",
    heroDesc: "Simulation IBT en écran partagé 5:5 avec info-bulles de dictionnaire instantanées, grille Wongoji à 20 colonnes et notation par Gemini IA.",
    heroStartExamBtn: "Démarrer le 91e TOPIK II Blanc",
    heroStartWritingBtn: "Rédaction Q53·54 & Correction IA",
    summaryTitle: "Objectif Actuel & Progression",
    summaryProgress: "Progression",
    summarySavedWords: "Mots Enregistrés",
    summaryDictSupport: "Langues Supportées",
    summaryDictValue: "12 Langues NIKL",
    summaryAiGrading: "Correction Rédaction",
    summaryAiValue: "Gemini IA 3 Critères",
    modulesTag: "ÉTAPE 2 · Choisissez un Module d'Étude",
    modulesTitle: "Sélectionnez un Mode d'Apprentissage",
    modulesSubtitle: "Les définitions et commentaires IA s'affichent automatiquement en Français.",
    card1Title: "1. Examen Blanc IBT Réel",
    card1Desc: "Résolvez les questions de Lecture (Q13) et Rédaction (Q53·54) en écran 5:5 avec dictionnaire au clic.",
    card1Bullet1: "Pop-over dictionnaire au clic sur un mot",
    card1Bullet2: "Palette de questions & sauvegarde auto (10s)",
    card1Btn: "Commencer l'Examen",
    card2Title: "2. Rédaction Wongoji TOPIK II",
    card2Desc: "Rédigez les Q53 (200–300 car.) et Q54 (600–700 car.) sur grille Wongoji 20 colonnes avec correction Gemini IA.",
    card2Bullet1: "Compteur de caractères (avec/sans espaces)",
    card2Bullet2: "Correction grammaticale & corrigé type",
    card2Btn53: "Q53 (30 pts)",
    card2Btn54: "Q54 (50 pts)",
    card3Title: "3. Dictionnaire Morphologique IA",
    card3Desc: "Entrez un mot coréen conjugué pour extraire sa forme de base et sa traduction en Français.",
    card3Bullet1: "Extraction automatique du lemme ('-다')",
    card3Bullet2: "Prononciation, nature, niveau TOPIK & carnet",
    card3Btn: "Ouvrir le Dictionnaire",
    card4Title: "4. Relevé de Notes & Rapport IA",
    card4Desc: "Consultez vos scores par section, le niveau TOPIK atteint et l'évaluation détaillée.",
    card4Bullet1: "Détail Contenu · Structure · Grammaire",
    card4Bullet2: "Commentaires rédigés dans votre langue",
    card4Btn: "Voir le Rapport",
    backHome: "Retour à l'Accueil",
    paletteBtn: "Palette",
    submitBtn: "Soumettre & Noter par IA",
    submittingBtn: "Notation...",
    prevQuestion: "Précédent",
    nextQuestion: "Suivant",
    tooltipHintTitle: "Info-bulle Vocabulaire Multilingue",
    tooltipHintDesc: "Cliquez sur n'importe quel mot coréen du texte pour afficher sa forme de base et sa définition en Français.",
  },
  ru: {
    brandBadge: "Стандарт NIIED",
    brandSubtitle: "Пробный экзамен TOPIK IBT · ИИ-проверка эссе · Многоязычный словарь",
    navHome: "Главная",
    navExam: "Пробный IBT",
    navWriting: "Письмо (№53·54)",
    navVocab: "Словарь и Слова",
    navReport: "Отчет и ИИ-оценка",
    levelSelectorTag: "ШАГ 1 · Выберите экзамен и целевой уровень",
    levelSelectorTitle: "Выберите целевой уровень TOPIK (1–6 уровень)",
    levelSelectorDesc: "Нажмите на карточку нужного уровня, чтобы установить целевой проходной балл и начать практику.",
    topik1Title: "TOPIK I (Начальный · Уровни 1–2 · Макс. 200 баллов)",
    topik1Meta: "Аудирование 40м + Чтение 60м (Всего 100 мин)",
    topik2Title: "TOPIK II (Средний–Высокий · Уровни 3–6 · Макс. 300 баллов)",
    topik2Meta: "Аудирование 60м + Письмо 50м + Чтение 70м (180 мин)",
    levelUnit: "Уровень ",
    pointsOrAbove: "+ баллов",
    selectedBadge: "Выбрано",
    startSelectedLevelBtn: "Начать экзамен для выбранного уровня",
    heroBadge: "Официальный симулятор экзамена TOPIK I и II IBT",
    heroTitlePrefix: "Универсальная платформа ",
    heroTitleHighlight: "Global TOPIK IBT",
    heroTitleSuffix: " для иностранных кандидатов",
    heroDesc: "Режим разделенного экрана 5:5, мгновенный русско-корейский словарь по клику на слово, сетка Вонгоджи на 20 клеток и проверка эссе с Gemini AI.",
    heroStartExamBtn: "Начать 91-й пробный экзамен TOPIK II",
    heroStartWritingBtn: "Эссе №53·54 и ИИ-проверка",
    summaryTitle: "Текущая цель и прогресс",
    summaryProgress: "Прогресс теста",
    summarySavedWords: "Сохранено слов",
    summaryDictSupport: "Языки словаря",
    summaryDictValue: "12 языков NIKL",
    summaryAiGrading: "Проверка письма",
    summaryAiValue: "Gemini AI (3 критерия)",
    modulesTag: "ШАГ 2 · Выберите учебный модуль",
    modulesTitle: "Выберите режим обучения",
    modulesSubtitle: "Перевод слов и отчеты ИИ автоматически отображаются на русском языке.",
    card1Title: "1. Реальный пробный тест IBT",
    card1Desc: "Решайте задания Чтения (№13) и Письма (№53·54) на экране 5:5 с мгновенным словарем по клику.",
    card1Bullet1: "Всплывающий словарь при нажатии на слово",
    card1Bullet2: "Панель вопросов и автосохранение (10 сек)",
    card1Btn: "Перейти к тесту",
    card2Title: "2. Тренажер письма Вонгоджи",
    card2Desc: "Пишите эссе №53 (200–300 знаков) и №54 (600–700 знаков) на сетке 20 колонок с проверкой Gemini AI.",
    card2Bullet1: "Счетчик символов (с пробелами / без)",
    card2Bullet2: "Исправление ошибок и эталонный ответ",
    card2Btn53: "№53 (30 б.)",
    card2Btn54: "№54 (50 б.)",
    card3Title: "3. Морфологический ИИ-словарь",
    card3Desc: "Введите слово в любой грамматической форме — анализатор Kiwipiepy определит начальную форму и перевод.",
    card3Bullet1: "Автоматическое выделение основы ('-다')",
    card3Bullet2: "Произношение, часть речи и личный словарь",
    card3Btn: "Открыть словарь",
    card4Title: "4. Результаты и ИИ-отчет",
    card4Desc: "Просматривайте баллы по разделам, достигнутый уровень TOPIK и подробный разбор эссе.",
    card4Bullet1: "Оценка содержания, структуры и грамматики",
    card4Bullet2: "Комментарии на вашем родном языке",
    card4Btn: "Открыть отчет",
    backHome: "На главную",
    paletteBtn: "Вопросы",
    submitBtn: "Сдать и проверить с ИИ",
    submittingBtn: "Проверка...",
    prevQuestion: "Назад",
    nextQuestion: "Далее",
    tooltipHintTitle: "Подсказка: мгновенный словарь",
    tooltipHintDesc: "Нажмите на любое корейское слово в тексте, чтобы увидеть его начальную форму и перевод на русский язык.",
  },
  id: {
    brandBadge: "Standar Resmi NIIED",
    brandSubtitle: "Simulasi TOPIK IBT · Penilaian Esai AI Wongoji · Kamus 12 Bahasa",
    navHome: "Beranda",
    navExam: "Simulasi IBT",
    navWriting: "Menulis (No.53·54)",
    navVocab: "Kamus & Kosakata",
    navReport: "Laporan Skor & AI",
    levelSelectorTag: "LANGKAH 1 · Pilih Ujian & Target Level",
    levelSelectorTitle: "Pilih Target Level TOPIK Anda (Level 1 – Level 6)",
    levelSelectorDesc: "Klik kartu level di bawah untuk mengatur batas skor kelulusan dan mulai berlatih.",
    topik1Title: "TOPIK I (Pemula · Level 1–2 · Maks 200 poin)",
    topik1Meta: "Mendengar 40m + Membaca 60m (Total 100 menit)",
    topik2Title: "TOPIK II (Menengah–Mahir · Level 3–6 · Maks 300 poin)",
    topik2Meta: "Mendengar 60m + Menulis 50m + Membaca 70m (180 menit)",
    levelUnit: "Level ",
    pointsOrAbove: "+ poin",
    selectedBadge: "Dipilih",
    startSelectedLevelBtn: "Mulai Simulasi untuk Level Terpilih",
    heroBadge: "Platform Simulasi Resmi TOPIK I & II IBT",
    heroTitlePrefix: "Platform Belajar Pintar ",
    heroTitleHighlight: "All-in-One TOPIK IBT",
    heroTitleSuffix: " untuk Peserta Global",
    heroDesc: "Simulasi layar terpisah 5:5 dengan kamus instan saat kata diklik, editor kertas Wongoji 20 kolom, dan penilaian esai otomatis Gemini AI.",
    heroStartExamBtn: "Mulai Simulasi TOPIK II ke-91",
    heroStartWritingBtn: "Latihan Wongoji No.53·54 & AI",
    summaryTitle: "Target & Progres Belajar Saat Ini",
    summaryProgress: "Progres Soal",
    summarySavedWords: "Kosakata Tersimpan",
    summaryDictSupport: "Bahasa Kamus",
    summaryDictValue: "12 Bahasa NIKL",
    summaryAiGrading: "Penilaian Menulis",
    summaryAiValue: "Gemini AI 3 Kriteria",
    modulesTag: "LANGKAH 2 · Pilih Modul Belajar",
    modulesTitle: "Pilih Mode Latihan untuk Memulai",
    modulesSubtitle: "Arti kamus dan umpan balik esai AI akan ditampilkan dalam Bahasa Indonesia.",
    card1Title: "1. Ujian Simulasi IBT Nyata",
    card1Desc: "Kerjakan soal Membaca (No.13) dan Menulis (No.53·54) pada layar 5:5. Klik kata bahasa Korea untuk melihat artinya.",
    card1Bullet1: "Pop-over kamus instan saat klik kata",
    card1Bullet2: "Palet soal & simpan otomatis tiap 10 detik",
    card1Btn: "Masuk Ujian Simulasi",
    card2Title: "2. Latihan Menulis Wongoji",
    card2Desc: "Tulis jawaban No.53 (200–300 karakter) & No.54 (600–700 karakter) di kotak Wongoji 20 kolom dengan koreksi AI.",
    card2Bullet1: "Penghitung karakter real-time (dengan/tanpa spasi)",
    card2Bullet2: "Koreksi ejaan & perbandingan jawaban model",
    card2Btn53: "No.53 (30p)",
    card2Btn54: "No.54 (50p)",
    card3Title: "3. Kamus Morfologi AI & Buku Kata",
    card3Desc: "Masukkan kata berimbuhan bahasa Korea — Kiwipiepy akan mengekstrak bentuk dasar dan artinya.",
    card3Bullet1: "Pemulihan bentuk dasar ('-다') otomatis",
    card3Bullet2: "Pelafalan, kelas kata, level TOPIK & simpan kata",
    card3Btn: "Buka Kamus & Kosakata",
    card4Title: "4. Laporan Skor & Evaluasi AI",
    card4Desc: "Lihat skor per bagian, pencapaian level TOPIK, pembahasan, dan rincian skor 3 kriteria menulis.",
    card4Bullet1: "Skor Isi · Struktur · Kosakata & Tata Bahasa",
    card4Bullet2: "Umpan balik dalam Bahasa Indonesia",
    card4Btn: "Lihat Laporan Skor",
    backHome: "Ke Beranda",
    paletteBtn: "Palet Soal",
    submitBtn: "Kirim & Nilai dengan AI",
    submittingBtn: "Menilai...",
    prevQuestion: "Sebelumnya",
    nextQuestion: "Berikutnya",
    tooltipHintTitle: "Panduan Tooltip Kosakata Instan",
    tooltipHintDesc: "Klik kata bahasa Korea mana pun pada wacana untuk melihat bentuk dasar dan artinya dalam Bahasa Indonesia.",
  },
  th: {
    brandBadge: "มาตรฐาน NIIED",
    brandSubtitle: "จำลองสอบ TOPIK IBT · ตรวจงานเขียน AI Wongoji · พจนานุกรม 12 ภาษา",
    navHome: "หน้าหลัก",
    navExam: "จำลองสอบ IBT",
    navWriting: "ฝึกเขียน (ข้อ 53·54)",
    navVocab: "พจนานุกรม & คำศัพท์",
    navReport: "ผลคะแนน & รายงาน AI",
    levelSelectorTag: "STEP 1 · เลือกประเภทการสอบและระดับเป้าหมาย",
    levelSelectorTitle: "เลือกระดับ TOPIK ที่คุณต้องการสอบ (ระดับ 1 – ระดับ 6)",
    levelSelectorDesc: "คลิกที่การ์ดระดับด้านล่างเพื่อตั้งค่าคะแนนเป้าหมายและเริ่มฝึกซ้อม",
    topik1Title: "TOPIK I (ระดับต้น · ระดับ 1–2 · เต็ม 200 คะแนน)",
    topik1Meta: "ฟัง 40 นาที + อ่าน 60 นาที (รวม 100 นาที)",
    topik2Title: "TOPIK II (ระดับกลาง–สูง · ระดับ 3–6 · เต็ม 300 คะแนน)",
    topik2Meta: "ฟัง 60น. + เขียน 50น. + อ่าน 70น. (รวม 180 นาที)",
    levelUnit: "ระดับ ",
    pointsOrAbove: "+ คะแนน",
    selectedBadge: "เลือกแล้ว",
    startSelectedLevelBtn: "เริ่มจำลองสอบสำหรับระดับที่เลือก",
    heroBadge: "แพลตฟอร์มจำลองสอบ TOPIK I & II IBT อย่างเป็นทางการ",
    heroTitlePrefix: "แพลตฟอร์มติวสอบ ",
    heroTitleHighlight: "Global TOPIK IBT",
    heroTitleSuffix: " ครบวงจรสำหรับผู้สอบต่างชาติ",
    heroDesc: "ฝึกทำข้อสอบหน้าจอแบ่ง 5:5 พร้อมป๊อปอัปพจนานุกรมภาษาไทยเมื่อคลิกคำศัพท์ กระดาษเขียนต้นฉบับ Wongoji 20 ช่อง และระบบตรวจงานเขียนด้วย Gemini AI",
    heroStartExamBtn: "เริ่มสอบจำลอง TOPIK II ครั้งที่ 91",
    heroStartWritingBtn: "ฝึกเขียนข้อ 53·54 & ตรวจด้วย AI",
    summaryTitle: "เป้าหมายและความคืบหน้าปัจจุบัน",
    summaryProgress: "ความคืบหน้าข้อสอบ",
    summarySavedWords: "คำศัพท์ที่บันทึก",
    summaryDictSupport: "ภาษาพจนานุกรม",
    summaryDictValue: "NIKL 12 ภาษา",
    summaryAiGrading: "ตรวจงานเขียนอัตโนมัติ",
    summaryAiValue: "Gemini AI 3 เกณฑ์",
    modulesTag: "STEP 2 · เลือกโหมดการเรียนรู้",
    modulesTitle: "เลือกฟีเจอร์ที่คุณต้องการเริ่มต้น",
    modulesSubtitle: "คำแปลคำศัพท์และรายงานตรวจงานเขียน AI จะแสดงเป็นภาษาไทยโดยอัตโนมัติ",
    card1Title: "1. จำลองสอบจริง IBT",
    card1Desc: "ฝึกทำข้อสอบการอ่าน (ข้อ 13) และการเขียน (ข้อ 53·54) ในมุมมอง 5:5 คลิกคำศัพท์เพื่อดูความหมายได้ทันที",
    card1Bullet1: "คลิกคำศัพท์เพื่อเปิดพจนานุกรมทันที",
    card1Bullet2: "พาเลตต์ข้ามข้อ & บันทึกอัตโนมัติทุก 10 วินาที",
    card1Btn: "เข้าสู่ห้องสอบ IBT",
    card2Title: "2. ฝึกเขียนกระดาษ Wongoji",
    card2Desc: "เขียนเรียงความข้อ 53 (200–300 ตัวอักษร) และข้อ 54 (600–700 ตัวอักษร) บนตาราง 20 ช่องพร้อมรับผลตรวจ AI",
    card2Bullet1: "นับจำนวนตัวอักษรแบบเรียลไทม์ (รวม/ไม่รวมเว้นวรรค)",
    card2Bullet2: "แก้คำผิดไวยากรณ์ & เปรียบเทียบคำตอบตัวอย่าง",
    card2Btn53: "ข้อ 53 (30 คะแนน)",
    card2Btn54: "ข้อ 54 (50 คะแนน)",
    card3Title: "3. พจนานุกรมวิเคราะห์หน่วยคำ AI",
    card3Desc: "ค้นหาคำศัพท์เกาหลีที่ผันรูปแล้ว ระบบจะแยกคำมูลฐาน (Lemma) พร้อมคำแปลภาษาไทยและบันทึกเข้าสมุดคำศัพท์",
    card3Bullet1: "แปลงกลับเป็นรูปพจนานุกรม ('-다') อัตโนมัติ",
    card3Bullet2: "คำอ่าน ชนิดของคำ ระดับ TOPIK และสมุดคำศัพท์",
    card3Btn: "เปิดพจนานุกรม",
    card4Title: "4. ใบรายงานผลคะแนน & AI",
    card4Desc: "ดูคะแนนแยกตามทักษะ ระดับ TOPIK ที่ทำได้ คำอธิบายเฉลย และผลตรวจงานเขียนละเอียด 3 เกณฑ์",
    card4Bullet1: "คะแนนเนื้อหา · โครงสร้าง · คำศัพท์และไวยากรณ์",
    card4Bullet2: "คำแนะนำรายบุคคลเป็นภาษาไทย",
    card4Btn: "ดูรายงานผลคะแนน",
    backHome: "กลับหน้าหลัก",
    paletteBtn: "รายการข้อสอบ",
    submitBtn: "ส่งคำตอบ & ตรวจด้วย AI",
    submittingBtn: "กำลังตรวจ...",
    prevQuestion: "ข้อก่อนหน้า",
    nextQuestion: "ข้อถัดไป",
    tooltipHintTitle: "คำแนะนำพจนานุกรมอัจฉริยะ",
    tooltipHintDesc: "คลิกคำภาษาเกาหลีคำใดก็ได้ในบทความเพื่อดูรูปคำพื้นฐานและความหมายภาษาไทย",
  },
  mn: {
    brandBadge: "NIIED Албан ёсны стандарт",
    brandSubtitle: "TOPIK IBT Сорил · AI Вонгожи эссэ засал · Олон хэлний толь",
    navHome: "Нүүр хуудас",
    navExam: "IBT Сорил шалгалт",
    navWriting: "Бичих (53·54-р асуулт)",
    navVocab: "Толь бичиг & Үгийн сан",
    navReport: "Дүн & AI Тайлан",
    levelSelectorTag: "АЛХАМ 1 · Шалгалт болон Зорилтот түвшингээ сонгоно уу",
    levelSelectorTitle: "Өгөх TOPIK шалгалт болон Зорилтот түвшингээ (1~6-р түвшин) сонгоно уу",
    levelSelectorDesc: "Хүссэн түвшний карт дээр дарж босго оноог тохируулан бэлтгэлээ эхлүүлнэ үү.",
    topik1Title: "TOPIK I (Анхан шат · 1–2 түвшин · Дээд оноо 200)",
    topik1Meta: "Сонсох 40м + Унших 60м (Нийт 100 минут)",
    topik2Title: "TOPIK II (Дунд–Гүнзгий · 3–6 түвшин · Дээд оноо 300)",
    topik2Meta: "Сонсох 60м + Бичих 50м + Унших 70м (180 минут)",
    levelUnit: "-р түвшин",
    pointsOrAbove: "+ оноо",
    selectedBadge: "Сонгосон",
    startSelectedLevelBtn: "Сонгосон түвшингээр шалгалт эхлэх",
    heroBadge: "NIIED TOPIK I & II IBT Албан ёсны симуляцийн платформ",
    heroTitlePrefix: "Гадаад шалгуулагчдад зориулсан ",
    heroTitleHighlight: "Цогц TOPIK IBT",
    heroTitleSuffix: " ухаалаг сургалтын платформ",
    heroDesc: "5:5 хуваасан дэлгэц дээр үгэн дээр дарж тайлбар харах, 20 нүдтэй Вонгожи эссэ засварлагч болон Gemini AI үнэлгээг туршаарай.",
    heroStartExamBtn: "91-р TOPIK II сорил шалгалт эхлэх",
    heroStartWritingBtn: "53·54-р дасгал & AI засал",
    summaryTitle: "Одоогийн зорилго ба явц",
    summaryProgress: "Шалгалтын явц",
    summarySavedWords: "Хадгалсан үгс",
    summaryDictSupport: "Толь бичгийн хэл",
    summaryDictValue: "NIKL 12 хэл",
    summaryAiGrading: "Бичгийн AI үнэлгээ",
    summaryAiValue: "Gemini AI 3 шалгуур",
    modulesTag: "АЛХАМ 2 · Суралцах горимоо сонгох",
    modulesTitle: "Эхлүүлэх сургалтын горимоо сонгоно уу",
    modulesSubtitle: "Үгийн тайлбар болон AI эссэ засал таны сонгосон хэлээр харагдана.",
    card1Title: "1. Бодит IBT Сорил шалгалт",
    card1Desc: "Унших (13) болон Бичих (53·54) даалгаврыг 5:5 дэлгэц дээр гүйцэтгэж, мэдэхгүй үгээ дарж шууд орчуулгыг харна.",
    card1Bullet1: "Үгэн дээр дарахад толь бичиг нээгдэнэ",
    card1Bullet2: "Асуултын самбар & 10 сек тутам автоматаар хадгална",
    card1Btn: "Сорил шалгалтад орох",
    card2Title: "2. TOPIK II Вонгожи бичгийн дасгал",
    card2Desc: "53 (200–300 үсэг) болон 54 (600–700 үсэг) эссэг 20 нүдтэй Вонгожи хуудсанд бичиж Gemini AI-аар засуулна.",
    card2Bullet1: "Үсгийн тоолуур (зайтай / зайгүй)",
    card2Bullet2: "Дүрмийн засал ба жишиг хариултын харьцуулалт",
    card2Btn53: "53-р (30 оноо)",
    card2Btn54: "54-р (50 оноо)",
    card3Title: "3. Морфологийн AI Толь бичиг",
    card3Desc: "Хувилсан солонгос үгийг оруулахад үндсэн хэлбэрийг ('-다') олж монгол утгыг харуулна.",
    card3Bullet1: "Үйл үг, нэр үгийн үндсэн хэлбэр сэргээгч",
    card3Bullet2: "Дуудлага, үгийн аймаг, TOPIK түвшин & үгийн дэвтэр",
    card3Btn: "Толь бичиг нээх",
    card4Title: "4. Дүнгийн хуудас & AI Тайлан",
    card4Desc: "Хэсэг тус бүрийн оноо, TOPIK түвшин, тайлбар болон бичгийн 3 шалгуурын нарийвчилсан тайланг харна.",
    card4Bullet1: "Агуулга · Бүтэц · Дүрэм үгийн сангийн оноо",
    card4Bullet2: "Таны хэл дээрх зөвлөмж тайлан",
    card4Btn: "Дүнгийн тайлан харах",
    backHome: "Нүүр хуудас руу",
    paletteBtn: "Асуултууд",
    submitBtn: "Илгээх & AI Дүгнэх",
    submittingBtn: "Дүгнэж байна...",
    prevQuestion: "Өмнөх",
    nextQuestion: "Дараах",
    tooltipHintTitle: "Ухаалаг толь бичгийн заавар",
    tooltipHintDesc: "Эх бичвэр дэх дурын солонгос үг дээр дарж үндсэн хэлбэр болон утгыг харна уу.",
  },
  ar: {
    brandBadge: "معيار NIIED الرسمي",
    brandSubtitle: "محاكاة اختبار TOPIK IBT · تصحيح المقال بالذكاء الاصطناعي · قاموس بـ 12 لغة",
    navHome: "الرئيسية",
    navExam: "الاختبار التجريبي IBT",
    navWriting: "الكتابة (س53·54)",
    navVocab: "القاموس والمفردات",
    navReport: "النتائج وتقرير AI",
    levelSelectorTag: "الخطوة 1 · اختر الاختبار والمستوى المستهدف",
    levelSelectorTitle: "اختر مستوى TOPIK المستهدف (المستوى 1 إلى المستوى 6)",
    levelSelectorDesc: "انقر فوق بطاقة المستوى المطلوب لضبط درجة النجاح المستهدفة وبدء التدريب.",
    topik1Title: "TOPIK I (مبتدئ · المستويان 1–2 · 200 نقطة كحد أقصى)",
    topik1Meta: "الاستماع 40 د + القراءة 60 د (الإجمالي 100 دقيقة)",
    topik2Title: "TOPIK II (متوسط–متقدم · المستويات 3–6 · 300 نقطة)",
    topik2Meta: "الاستماع 60 د + الكتابة 50 د + القراءة 70 د (180 دقيقة)",
    levelUnit: "المستوى ",
    pointsOrAbove: "+ نقطة",
    selectedBadge: "محدد",
    startSelectedLevelBtn: "ابدأ الاختبار التجريبي للمستوى المحدد",
    heroBadge: "منصة محاكاة اختبار TOPIK I & II IBT الرسمية",
    heroTitlePrefix: "منصة التعلم الذكية الشاملة ",
    heroTitleHighlight: "Global TOPIK IBT",
    heroTitleSuffix: " للمتقدمين الدوليين",
    heroDesc: "تدرب على شاشة مقسمة 5:5 مع قاموس فوري عند النقر على أي كلمة كورية، ومحرر شبكة Wongoji المكون من 20 عموداً، وتصحيح المقالات عبر Gemini AI.",
    heroStartExamBtn: "ابدأ الاختبار التجريبي الـ91 لـ TOPIK II",
    heroStartWritingBtn: "تدريب الكتابة س53·54 وتصحيح AI",
    summaryTitle: "الهدف الحالي وتقدم الدراسة",
    summaryProgress: "تقدم الأسئلة",
    summarySavedWords: "المفردات المحفوظة",
    summaryDictSupport: "لغات القاموس",
    summaryDictValue: "12 لغة من NIKL",
    summaryAiGrading: "تقييم الكتابة الآلي",
    summaryAiValue: "Gemini AI (3 معايير)",
    modulesTag: "الخطوة 2 · اختر وحدة التعلم",
    modulesTitle: "اختر وضع الدراسة للبدء",
    modulesSubtitle: "تظهر معاني القاموس وتقارير تصحيح المقالات تلقائياً باللغة المختارة.",
    card1Title: "1. اختبار محاكاة IBT الفعلي",
    card1Desc: "حل أسئلة القراءة (س13) والكتابة (س53·54) في عرض مقسم 5:5 مع ترجمة فورية عند النقر على الكلمات.",
    card1Bullet1: "نافذة قاموس منبثقة عند النقر على الكلمة",
    card1Bullet2: "لوحة تنقل الأسئلة وحفظ تلقائي كل 10 ثوانٍ",
    card1Btn: "دخول الاختبار التجريبي",
    card2Title: "2. تدريب كتابة Wongoji لـ TOPIK II",
    card2Desc: "اكتب إجابات السؤال 53 (200–300 حرف) والسؤال 54 (600–700 حرف) على شبكة Wongoji ذات 20 عموداً.",
    card2Bullet1: "عداد أحرف فوري (مع/بدون مسافات)",
    card2Bullet2: "تصحيح إملائي ومقارنة بالإجابة النموذجية",
    card2Btn53: "س53 (30 نقطة)",
    card2Btn54: "س54 (50 نقطة)",
    card3Title: "3. القاموس الصرفي الذكي ودفتر المفردات",
    card3Desc: "أدخل أي كلمة كورية مصرفّة ليستخرج المحلل الصرفي جذرها الأساسي ويعرض معناها.",
    card3Bullet1: "استرجاع تلقائي لصيغة المصدر ('-다')",
    card3Bullet2: "النطق، نوع الكلمة، مستوى TOPIK وحفظ الكلمات",
    card3Btn: "فتح القاموس ودفتر الكلمات",
    card4Title: "4. كشف الدرجات وتقرير تصحيح AI",
    card4Desc: "استعرض درجات الأقسام، والمستوى المحقق، والشروحات، وتفاصيل تقييم الكتابة وفق المعايير الثلاثة.",
    card4Bullet1: "درجات المحتوى · البنية · المفردات والقواعد",
    card4Bullet2: "ملاحظات مفصلة بلغتك المختارة",
    card4Btn: "عرض التقرير",
    backHome: "العودة للرئيسية",
    paletteBtn: "لوحة الأسئلة",
    submitBtn: "إرسال وتقييم بالذكاء الاصطناعي",
    submittingBtn: "جارٍ التقييم...",
    prevQuestion: "السابق",
    nextQuestion: "التالي",
    tooltipHintTitle: "دليل القاموس الفوري",
    tooltipHintDesc: "انقر على أي كلمة كورية في النص لعرض صيغتها الأساسية ومعناها.",
  },
};

export function getUITranslation(lang: string): UITranslation {
  if (UI_TRANSLATIONS[lang]) {
    return UI_TRANSLATIONS[lang];
  }
  return UI_TRANSLATIONS.ko;
}
