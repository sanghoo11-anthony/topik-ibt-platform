import { QuestionItem } from "@/types/exam";

export interface CuratedVocabItem {
  lemma: string;
  target_code: string;
  pronunciation: string;
  part_of_speech: string;
  word_grade: "초급" | "중급" | "고급";
  topik_level: number;
  category: string;
  korean_definition: string;
  example_ko: string;
  translations: Record<string, [string, string]>;
}

export interface GrammarPatternItem {
  id: string;
  pattern: string;
  level: number;
  exam_type: "TOPIK_I" | "TOPIK_II";
  category: string;
  meaning_ko: string;
  meaning_en: string;
  example_ko: string;
  exam_tip: string;
  translations?: Record<string, string>;
}

export interface IdiomProverbItem {
  expression: string;
  type: "관용어" | "사자성어" | "속담";
  level: string;
  meaning_ko: string;
  meaning_en: string;
  example: string;
  translations?: Record<string, string>;
}

export interface StudyResourceItem {
  id: string;
  title: string;
  provider: string;
  category: string;
  target_levels: string;
  description: string;
  url: string;
  tags: string[];
}

export const COMPREHENSIVE_QUESTIONS: QuestionItem[] = [
  // =========================================================================
  // [TOPIK I - 1급~2급] 듣기 (LISTENING)
  // =========================================================================
  {
    question_id: "00000000-0000-0000-0001-000000000001",
    section_name: "LISTENING",
    question_number: 1,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 1,
    score_points: 4.0,
    audio_url: "TTS_SUPPORTED",
    passage_text:
      "[듣기 대본 - 제91회 TOPIK I 유형]\n여자: 민수 씨, 주말에 보통 뭐 해요?\n남자: 저는 주말에 공원에서 자전거를 타거나 친구하고 축구를 해요.",
    prompt_text:
      "[TOPIK I · 1급 듣기] 다음 대화를 듣고 내용과 일치하는 것을 고르십시오. (상단 음성 재생 버튼을 눌러 들으세요)",
    options: [
      { option_number: 1, option_text: "남자는 주말에 집에서 영화를 봅니다." },
      { option_number: 2, option_text: "남자는 주말에 공원에서 운동을 합니다." },
      { option_number: 3, option_text: "여자는 주말에 자전거를 배웁니다." },
      { option_number: 4, option_text: "두 사람은 지금 공원에서 축구를 합니다." },
    ],
  },
  {
    question_id: "00000000-0000-0000-0001-000000000002",
    section_name: "LISTENING",
    question_number: 5,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 1,
    score_points: 4.0,
    audio_url: "TTS_SUPPORTED",
    passage_text:
      "[듣기 대본 - 장소 추론 유형]\n남자: 어서 오세요. 어디가 아파서 오셨어요?\n여자: 어제부터 목이 많이 아프고 열이 조금 나요.\n남자: 네, 입을 크게 벌려 보세요. 감기니까 주사 맞고 약 드시면 금방 나을 거예요.",
    prompt_text: "[TOPIK I · 1급 듣기] 여기는 어디입니까? 알맞은 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "약국" },
      { option_number: 2, option_text: "우체국" },
      { option_number: 3, option_text: "병원" },
      { option_number: 4, option_text: "도서관" },
    ],
  },
  {
    question_id: "00000000-0000-0000-0001-000000000003",
    section_name: "LISTENING",
    question_number: 10,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 2,
    score_points: 4.0,
    audio_url: "TTS_SUPPORTED",
    passage_text:
      "[듣기 대본 - 대화 후 이어질 행동 유형]\n여자: 수진 씨 생일 선물을 아직 못 샀는데 같이 백화점에 갈래요?\n남자: 좋아요. 그런데 제가 지금 도서관에 책을 반납해야 해요. 반납하고 바로 백화점 앞으로 갈게요.\n여자: 그래요. 그럼 저는 먼저 커피숍에서 기다리고 있을게요.",
    prompt_text:
      "[TOPIK I · 2급 듣기] 대화가 끝난 뒤에 남자가 이어서 할 행동으로 알맞은 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "도서관에 가서 책을 돌려준다." },
      { option_number: 2, option_text: "커피숍에 가서 여자를 만난다." },
      { option_number: 3, option_text: "백화점에서 혼자 선물을 고른다." },
      { option_number: 4, option_text: "수진 씨에게 생일 축하 전화를 한다." },
    ],
  },

  // =========================================================================
  // [TOPIK I - 1급~2급] 읽기 (READING)
  // =========================================================================
  {
    question_id: "00000000-0000-0000-0001-000000000004",
    section_name: "READING",
    question_number: 3,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 1,
    score_points: 3.0,
    passage_text:
      "어제는 날씨가 아주 ( ㉠ ). 그래서 따뜻한 옷을 입고 밖에 나갔습니다.",
    prompt_text:
      "[TOPIK I · 1급 읽기] 빈칸 ( ㉠ )에 들어갈 가장 알맞은 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "더웠습니다" },
      { option_number: 2, option_text: "추웠습니다" },
      { option_number: 3, option_text: "비쌌습니다" },
      { option_number: 4, option_text: "가까웠습니다" },
    ],
  },
  {
    question_id: "00000000-0000-0000-0001-000000000005",
    section_name: "READING",
    question_number: 12,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 2,
    score_points: 3.0,
    passage_text:
      "[인주시립도서관 휴관 안내]\n도서관 시설 수리와 청소 때문에 이번 주 금요일(11월 15일) 하루 동안 문을 닫습니다.\n빌린 책을 반납하실 분은 도서관 입구 옆의 무인 반납함을 이용해 주시기 바랍니다.\n토요일부터는 평소처럼 오전 9시에서 오후 8시까지 이용하실 수 있습니다.",
    prompt_text: "[TOPIK I · 2급 읽기] 다음 안내문의 내용과 같은 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "이번 주 주말에는 도서관 문을 닫습니다." },
      { option_number: 2, option_text: "금요일에는 빌린 책을 반납할 수 없습니다." },
      { option_number: 3, option_text: "금요일에는 시설 수리 때문에 도서관을 쉬게 됩니다." },
      { option_number: 4, option_text: "토요일에는 오후 6시까지 도서관을 이용할 수 있습니다." },
    ],
  },
  {
    question_id: "00000000-0000-0000-0001-000000000006",
    section_name: "READING",
    question_number: 20,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 2,
    score_points: 4.0,
    passage_text:
      "저는 한국 드라마를 보면서 한국어에 관심을 가지게 되었습니다. 처음에는 자막 없이 드라마를 보는 것이 ( ㉠ ) 지금은 자주 나오는 표현을 많이 알아듣습니다. 내년에는 한국에 직접 여행을 가서 한국 사람들과 이야기해 보고 싶습니다.",
    prompt_text:
      "[TOPIK I · 2급 읽기] 빈칸 ( ㉠ )에 들어갈 가장 알맞은 표현을 고르십시오.",
    options: [
      { option_number: 1, option_text: "어려웠지만" },
      { option_number: 2, option_text: "어려우니까" },
      { option_number: 3, option_text: "어려워서" },
      { option_number: 4, option_text: "어려우려고" },
    ],
  },

  // =========================================================================
  // [TOPIK II - 3급~6급] 듣기 (LISTENING)
  // =========================================================================
  {
    question_id: "00000000-0000-0000-0002-000000000001",
    section_name: "LISTENING",
    question_number: 9,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 3,
    score_points: 2.0,
    audio_url: "TTS_SUPPORTED",
    passage_text:
      "[듣기 대본 - 제83회·91회 중급 업무 대화 유형]\n여자: 김 대리님, 다음 주에 있을 신제품 설명회 발표 자료는 다 준비되었나요?\n남자: 네, 자료 작성은 끝났는데 설문 조사 통계 그래프가 조금 복잡해 보여서 수정하고 있습니다.\n여자: 그래요? 그럼 그래프 수정이 끝나는 대로 출력해서 회의실에 먼저 비치해 주세요. 저는 안내 배너가 도착했는지 확인해 볼게요.",
    prompt_text:
      "[TOPIK II · 3~4급 듣기] 남자가 이어서 할 행동으로 알맞은 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "신제품 설문 조사를 새로 실시한다." },
      { option_number: 2, option_text: "발표 자료의 그래프를 고쳐서 인쇄한다." },
      { option_number: 3, option_text: "안내 배너가 도착했는지 업체에 전화한다." },
      { option_number: 4, option_text: "회의실 예약을 다른 날짜로 변경한다." },
    ],
  },
  {
    question_id: "00000000-0000-0000-0002-000000000002",
    section_name: "LISTENING",
    question_number: 21,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 4,
    score_points: 2.0,
    audio_url: "TTS_SUPPORTED",
    passage_text:
      "[듣기 대본 - 제64회 기출 변형 (서비스 만족도 인터뷰)]\n남자: 최근 저희 호텔을 찾는 고객 수는 늘었는데 재방문율은 오히려 정체되어 있어서 걱정입니다.\n여자: 맞아요. 시설을 새로 단장하는 것도 중요하지만, 무엇보다 고객들이 남긴 이용 후기를 꼼꼼히 분석해 볼 필요가 있어요. 불만 사항이 무엇인지 정확히 파악해야 맞춤형 서비스를 개선할 수 있거든요.\n남자: 일리가 있네요. 이번 주 마케팅 회의에서 최근 6개월간의 고객 후기 데이터부터 정리해 봅시다.",
    prompt_text:
      "[TOPIK II · 4급 듣기] 여자의 중심 생각으로 가장 알맞은 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "호텔 시설을 최신식으로 빠르게 개조해야 한다." },
      { option_number: 2, option_text: "신규 고객을 유치하기 위한 할인 행사를 늘려야 한다." },
      { option_number: 3, option_text: "고객들이 이용 후기를 많이 작성하도록 유도해야 한다." },
      { option_number: 4, option_text: "서비스 개선을 위해 고객의 이용 후기를 적극적으로 분석해야 한다." },
    ],
  },
  {
    question_id: "00000000-0000-0000-0002-000000000003",
    section_name: "LISTENING",
    question_number: 37,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 5,
    score_points: 2.0,
    audio_url: "TTS_SUPPORTED",
    passage_text:
      "[듣기 대본 - 고급 교양 강연 유형]\n여자(강연자): 흔히 도시 재생 사업이라고 하면 낡은 건물을 허물고 고층 빌딩을 새로 짓는 재개발을 떠올리기 쉽습니다. 그러나 최근 주목받는 도시 재생은 기존 골목길의 역사적 맥락과 지역 공동체의 문화를 보존하면서 낙후된 기반 시설만 현대화하는 방식으로 진화하고 있습니다. 원주민들이 삶의 터전을 잃고 내몰리는 부작용을 막고, 그 지역만의 고유한 정체성을 살려 지속 가능한 활력을 불어넣는 것이 진정한 도시 재생의 핵심이기 때문입니다.",
    prompt_text:
      "[TOPIK II · 5~6급 듣기] 강연의 중심 내용으로 가장 알맞은 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "도시의 경쟁력을 높이기 위해 고층 빌딩 건립을 확대해야 한다." },
      { option_number: 2, option_text: "역사적 가치가 있는 건물은 일체의 보수 없이 원형 그대로 두어야 한다." },
      { option_number: 3, option_text: "도시 재생은 지역의 고유한 문화와 공동체를 보존하는 방향으로 이루어져야 한다." },
      { option_number: 4, option_text: "원주민의 이주를 지원하는 재정적 보상 제도를 우선적으로 마련해야 한다." },
    ],
  },

  // =========================================================================
  // [TOPIK II - 3급~6급] 읽기 (READING)
  // =========================================================================
  {
    question_id: "00000000-0000-0000-0002-000000000004",
    section_name: "READING",
    question_number: 2,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 3,
    score_points: 2.0,
    passage_text:
      "출퇴근 시간에는 도로가 매우 혼잡해서 자가용을 ( ㉠ ) 지하철이나 버스를 타는 편이 훨씬 빠르다.",
    prompt_text:
      "[TOPIK II · 3급 읽기 (문법)] 빈칸 ( ㉠ )에 들어갈 가장 알맞은 문법을 고르십시오.",
    options: [
      { option_number: 1, option_text: "이용하느라고" },
      { option_number: 2, option_text: "이용하더라도" },
      { option_number: 3, option_text: "이용하느니" },
      { option_number: 4, option_text: "이용하던데" },
    ],
  },
  {
    question_id: "00000000-0000-0000-0002-000000000005",
    section_name: "READING",
    question_number: 4,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 4,
    score_points: 2.0,
    passage_text:
      "아무리 뛰어난 재능을 타고났다고 할지라도 끊임없이 노력하지 않으면 실력이 제자리걸음을 하기 마련이다.",
    prompt_text:
      "[TOPIK II · 4급 읽기 (유의 문법)] 밑줄 친 '기 마련이다'와 바꿔 쓸 수 있는 표현을 고르십시오.",
    options: [
      { option_number: 1, option_text: "는 법이다" },
      { option_number: 2, option_text: "기 나름이다" },
      { option_number: 3, option_text: "ㄹ 뿐이다" },
      { option_number: 4, option_text: "는 척하다" },
    ],
  },
  {
    question_id: "00000000-0000-0000-0000-000000000013",
    section_name: "READING",
    question_number: 13,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 3,
    score_points: 2.0,
    passage_text:
      "(가) 그러나 무조건 잠을 줄이는 것은 건강에 해롭다.\n(나) 현대인들은 바쁜 일상 속에서 수면 시간을 줄이곤 한다.\n(다) 충분한 수면을 취해야 면역력이 유지되고 집중력도 높아진다.\n(라) 따라서 건강을 지키려면 하루 7시간 이상의 숙면이 필요하다.",
    prompt_text:
      "[TOPIK II · 3~4급 읽기 (문장 배열)] 다음 문장을 논리적 순서에 맞게 배열한 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "(나) - (가) - (다) - (라)" },
      { option_number: 2, option_text: "(나) - (라) - (가) - (다)" },
      { option_number: 3, option_text: "(다) - (가) - (나) - (라)" },
      { option_number: 4, option_text: "(다) - (라) - (가) - (나)" },
    ],
  },
  {
    question_id: "00000000-0000-0000-0002-000000000006",
    section_name: "READING",
    question_number: 19,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 4,
    score_points: 2.0,
    passage_text:
      "전통 시장 상인들이 침체된 상권을 살리기 위해 직접 ( ㉠ ). 상인들은 공동 배달 서비스를 도입하고 청년 창업가들과 협력하여 특색 있는 야시장을 열었다. 그 결과 시장을 찾는 젊은 방문객이 눈에 띄게 늘어났다.",
    prompt_text:
      "[TOPIK II · 4급 읽기 (관용어)] 빈칸 ( ㉠ )에 들어갈 가장 알맞은 관용 표현을 고르십시오.",
    options: [
      { option_number: 1, option_text: "귀를 기울였다" },
      { option_number: 2, option_text: "발 벗고 나섰다" },
      { option_number: 3, option_text: "입을 모았다" },
      { option_number: 4, option_text: "눈코 뜰 새 없었다" },
    ],
  },
  {
    question_id: "00000000-0000-0000-0002-000000000007",
    section_name: "READING",
    question_number: 25,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 4,
    score_points: 2.0,
    passage_text:
      "[신문 기사 제목: '반려동물 양육 가구 급증… 관련 산업 규모도 사상 최대치 경신']",
    prompt_text:
      "[TOPIK II · 4~5급 읽기 (신문 헤드라인)] 다음 신문 기사 제목을 가장 잘 설명한 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "반려동물을 키우는 가구가 줄어들면서 관련 산업이 위축되고 있다." },
      { option_number: 2, option_text: "반려동물 관련 산업의 성장세가 멈추어 대책 마련이 시급하다." },
      { option_number: 3, option_text: "반려동물 양육 비용이 크게 올라 가계 부담이 최고치에 달했다." },
      { option_number: 4, option_text: "반려동물을 기르는 집이 빠르게 늘어나며 관련 시장 규모가 역대 가장 커졌다." },
    ],
  },
  {
    question_id: "00000000-0000-0000-0002-000000000008",
    section_name: "READING",
    question_number: 35,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 5,
    score_points: 2.0,
    passage_text:
      "정보 통신 기술의 발달과 소셜 미디어의 대중화로 누구나 손쉽게 정보를 생산하고 공유할 수 있는 환경이 조성되었다. 그러나 조회 수와 경제적 이익만을 노린 자극적인 허위 정보, 이른바 '가짜 뉴스'가 무분별하게 양산되면서 사회적 신뢰가 심각하게 훼손되고 있다. 더욱이 알고리즘 추천 시스템은 이용자가 선호하는 성향의 정보만 반복적으로 노출하는 '확증 편향'을 강화하여 사회적 갈등과 양극화를 부추기기도 한다. 따라서 플랫폼 기업의 자정 노력과 제도적 규제 못지않게, 수용자 스스로 정보의 진위를 비판적으로 검증하는 미디어 리터러시 역량을 함양하는 일이 시급하다.",
    prompt_text:
      "[TOPIK II · 5급 읽기 (논설문 중심 생각)] 다음 글의 중심 생각으로 가장 알맞은 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "소셜 미디어의 알고리즘 추천 기술을 전면 금지해야 한다." },
      { option_number: 2, option_text: "개인의 자유로운 정보 생산을 장려하기 위해 규제를 완화해야 한다." },
      { option_number: 3, option_text: "허위 정보의 폐해를 막기 위해 제도적 노력과 함께 수용자의 비판적 정보 판별력을 길러야 한다." },
      { option_number: 4, option_text: "전통 언론 매체가 뉴미디어 플랫폼을 대체할 수 있도록 지원해야 한다." },
    ],
  },
  {
    question_id: "00000000-0000-0000-0002-000000000009",
    section_name: "READING",
    question_number: 42,
    question_type: "MULTIPLE_CHOICE",
    difficulty_level: 6,
    score_points: 2.0,
    passage_text:
      "예술 작품을 감상할 때 독자나 관객이 작가의 본래 의도를 있는 그대로 찾아내야만 올바른 감상이라고 여기는 시각이 존재한다. 물론 창작 당시의 시대적 배경과 작가의 전기적 사실을 이해하는 것은 작품 해석의 훌륭한 길잡이가 된다. 그러나 작품이 일단 세상에 발표된 순간부터 그것은 작가의 손을 떠나 독자적인 생명력을 지닌 열린 텍스트가 된다. 감상자가 자신이 처한 시대적 맥락과 고유한 삶의 경험에 비추어 작품에 새로운 의미를 부여할 때, 고전은 비로소 박제된 유물이 아니라 오늘날에도 살아 숨 쉬는 예술로 재탄생하는 것이다.",
    prompt_text:
      "[TOPIK II · 6급 읽기 (심화 비평문)] 필자의 태도로 가장 알맞은 것을 고르십시오.",
    options: [
      { option_number: 1, option_text: "작가의 창작 의도를 왜곡하는 주관적 해석을 경계하고 있다." },
      { option_number: 2, option_text: "감상자의 주체적인 재해석이 작품의 가치를 확장한다고 보고 있다." },
      { option_number: 3, option_text: "시대적 배경을 배제한 예술 비평의 한계를 비판하고 있다." },
      { option_number: 4, option_text: "고전 예술 작품의 원형을 훼손 없이 보존해야 한다고 주장하고 있다." },
    ],
  },

  // =========================================================================
  // [TOPIK II - 3급~6급] 쓰기 51번 · 52번 · 53번 · 54번 (WRITING)
  // =========================================================================
  {
    question_id: "00000000-0000-0000-0000-000000000051",
    section_name: "WRITING",
    question_number: 51,
    question_type: "SHORT_ANSWER",
    difficulty_level: 3,
    score_points: 10.0,
    passage_text:
      "[제목: 진료 예약 시간 변경 문의드립니다]\n\n안녕하세요, 인주치과 담당자님.\n저는 내일(금요일) 오후 2시에 김민수 원장님께 진료를 받기로 예약한 이수민입니다.\n다름이 아니라 내일 오후에 급한 회사 회의가 생겨서 예약한 시간에 병원에 ( ㉠ ).\n혹시 내일 오후 5시나 이번 주 토요일 오전으로 진료 시간을 ( ㉡ )?\n번거롭게 해 드려 죄송합니다. 확인 후 연락 부탁드립니다.",
    prompt_text:
      "[TOPIK II · 쓰기 51번 실용문 빈칸 완성 (10점)] 다음을 읽고 ㉠과 ㉡에 들어갈 말을 각각 한 문장으로 쓰십시오.",
    options: [],
  },
  {
    question_id: "00000000-0000-0000-0000-000000000052",
    section_name: "WRITING",
    question_number: 52,
    question_type: "SHORT_ANSWER",
    difficulty_level: 4,
    score_points: 10.0,
    passage_text:
      "집에서 화분에 식물을 기를 때 물을 자주 줄수록 식물이 잘 자랄 것이라고 생각하는 사람이 많다. 그러나 물을 너무 많이 주면 식물은 오히려 잘 자라지 못한다. 왜냐하면 흙 속에 물이 지나치게 많으면 공기가 통하지 않아 식물의 뿌리가 ( ㉠ ). 따라서 식물의 뿌리가 상하지 않게 하려면 정해진 날짜마다 무조건 물을 ( ㉡ ) 흙을 직접 만져 보아 말랐을 때 주는 것이 좋다.",
    prompt_text:
      "[TOPIK II · 쓰기 52번 설명문 빈칸 완성 (10점)] 다음을 읽고 ㉠과 ㉡에 들어갈 말을 문어체('-다/는다')와 문맥에 맞게 각각 쓰십시오.",
    options: [],
  },
  {
    question_id: "00000000-0000-0000-0000-000000000053",
    section_name: "WRITING",
    question_number: 53,
    question_type: "ESSAY_SHORT",
    difficulty_level: 4,
    score_points: 30.0,
    passage_text:
      "[조사 기관: 인주시 통계청]\n주제: 온라인 쇼핑 이용 현황 및 소비자 만족 요인\n\n1. 온라인 쇼핑 시장 규모 변화\n- 2020년: 15조 원  →  2022년: 23조 원  →  2024년: 32조 원 (4년간 2배 이상 급증)\n\n2. 소비자 만족 요인 비중 (2024년 기준)\n- 배송의 신속성 (48%) > 가격 경쟁력 (32%) > 상품의 다양성 (20%)\n\n3. 향후 전망\n- 당일 배송 서비스 확대와 합리적 가격 혜택으로 온라인 쇼핑 시장의 지속적 성장 예상",
    prompt_text:
      "[TOPIK II · 쓰기 53번 도표 분석 1 (30점)] 다음을 참고하여 ‘온라인 쇼핑 이용 현황 및 만족 요인’에 대한 글을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.",
    options: [],
  },
  {
    question_id: "00000000-0000-0000-0002-000000000053",
    section_name: "WRITING",
    question_number: 53,
    question_type: "ESSAY_SHORT",
    difficulty_level: 4,
    score_points: 30.0,
    passage_text:
      "[조사 기관: 한국사회연구원 (제83회 기출 복원)]\n주제: 인주시의 가구 형태별 변화 추이 (2015년~2025년)\n\n1. 전체 가구 형태 비율 변화\n- 4인 이상 가구: 2015년 42%  →  2025년 21% (절반으로 감소)\n- 1인 가구: 2015년 18%  →  2025년 39% (2배 이상 급증하여 가장 높은 비중 차지)\n\n2. 1인 가구 증가 원인\n- 청년층의 독립 및 결혼관 변화\n- 고령화로 인한 독거노인 가구 증가\n\n3. 향후 과제\n- 1인 가구 맞춤형 소형 주택 공급 및 사회 안전망 확충 필요",
    prompt_text:
      "[TOPIK II · 쓰기 53번 기출 복원 2 (30점)] 다음 자료를 참고하여 ‘인주시의 가구 형태 변화와 원인’에 대한 글을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.",
    options: [],
  },
  {
    question_id: "00000000-0000-0000-0000-000000000054",
    section_name: "WRITING",
    question_number: 54,
    question_type: "ESSAY_LONG",
    difficulty_level: 6,
    score_points: 50.0,
    passage_text:
      "현대 사회는 과학 기술의 발전과 경제 성장으로 물질적인 풍요를 이루었지만, 과도한 경쟁과 사회적 고립감으로 인해 현대인이 느끼는 행복지수는 오히려 낮아지고 있습니다. 진정한 행복을 실현하기 위한 개인적·사회적 노력에 대해 자신의 생각을 서술하십시오.\n\n[과제 수행 조건]\n1. 물질적 풍요 속에서도 현대인의 행복지수가 낮아지는 원인은 무엇인가?\n2. 행복한 삶을 위해 개인은 어떠한 태도와 가치관을 가져야 하는가?\n3. 사회와 제도는 구성원의 행복을 위해 어떤 환경을 조성해야 하는가?",
    prompt_text:
      "[TOPIK II · 쓰기 54번 논술 1 (50점)] 다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오. 단, 문제를 그대로 옮겨 쓰지 마십시오.",
    options: [],
  },
  {
    question_id: "00000000-0000-0000-0002-000000000054",
    section_name: "WRITING",
    question_number: 54,
    question_type: "ESSAY_LONG",
    difficulty_level: 6,
    score_points: 50.0,
    passage_text:
      "[제91회 기출 복원 주제: 가짜 뉴스(허위 정보)의 영향과 대응 방안]\n최근 인터넷과 소셜 미디어를 통해 사실이 아닌 '가짜 뉴스(허위 정보)'가 빠르게 퍼지면서 다양한 사회적 문제가 발생하고 있습니다. 가짜 뉴스의 확산 원인과 문제점을 살펴보고, 이를 해결하기 위한 방안에 대해 자신의 생각을 서술하십시오.\n\n[과제 수행 조건]\n1. 현대 사회에서 가짜 뉴스가 쉽게 생산되고 확산되는 배경은 무엇인가?\n2. 가짜 뉴스로 인해 개인과 사회가 겪는 부정적인 영향은 무엇인가?\n3. 가짜 뉴스 문제를 해결하기 위해 개인과 사회(정부·언론)는 어떤 노력을 기울여야 하는가?",
    prompt_text:
      "[TOPIK II · 쓰기 54번 제91회 기출 복원 2 (50점)] 다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오. 단, 문제를 그대로 옮겨 쓰지 마십시오.",
    options: [],
  },
];

export const CURATED_VOCAB_ITEMS: CuratedVocabItem[] = [
  // 초급 (1~2급)
  {
    lemma: "약속",
    target_code: "10001",
    pronunciation: "약쏙",
    part_of_speech: "명사",
    word_grade: "초급",
    topik_level: 1,
    category: "일상생활",
    korean_definition: "다른 사람과 앞으로의 일을 어떻게 할 것인지 미리 정하여 두는 것.",
    example_ko: "주말에 친구와 영화 보기로 약속을 했다.",
    translations: {
      en: ["promise; appointment", "An arrangement to meet someone or do something."],
      vi: ["cuộc hẹn, lời hứa", "Sự hẹn trước hoặc hứa hẹn với người khác."],
      zh: ["约定，约会", "预先与他人商定好今后的事情。"],
      ja: ["約束", "他の人と今後のことをあらかじめ決めておくこと。"],
    },
  },
  {
    lemma: "도서관",
    target_code: "10002",
    pronunciation: "도서관",
    part_of_speech: "명사",
    word_grade: "초급",
    topik_level: 1,
    category: "공공장소",
    korean_definition: "책이나 자료를 모아 두고 사람들이 읽거나 빌릴 수 있게 한 시설.",
    example_ko: "시험 기간이라 도서관에서 책을 빌려 공부했다.",
    translations: {
      en: ["library", "A facility where books and materials are kept for reading or borrowing."],
      vi: ["thư viện", "Nơi lưu trữ sách và tài liệu để đọc hoặc mượn."],
      zh: ["图书馆", "收集图书资料供人们阅读或借阅的设施。"],
      ja: ["図書館", "本や資料を集めて人々が読んだり借りたりできるようにした施設。"],
    },
  },
  {
    lemma: "반납하다",
    target_code: "10003",
    pronunciation: "반나파다",
    part_of_speech: "동사",
    word_grade: "초급",
    topik_level: 2,
    category: "공공장소",
    korean_definition: "빌려 쓰던 물건 등을 도로 돌려주다.",
    example_ko: "도서관에서 빌린 책을 기한 내에 반납해야 한다.",
    translations: {
      en: ["return; give back", "To return a borrowed item to its lender."],
      vi: ["hoàn trả, trả lại", "Trả lại đồ vật đã mượn."],
      zh: ["归还", "把借用的物品归还给原处。"],
      ja: ["返却する", "借りていた物などを返す。"],
    },
  },
  {
    lemma: "복잡하다",
    target_code: "10004",
    pronunciation: "복짜파다",
    part_of_speech: "형용사",
    word_grade: "초급",
    topik_level: 2,
    category: "상태·성질",
    korean_definition: "사람이나 탈것 등이 많아서 붐비고 어수선하다. 또는 일이 뒤얽혀 풀기 어렵다.",
    example_ko: "출퇴근 시간에는 지하철에 사람이 많아서 아주 복잡하다.",
    translations: {
      en: ["crowded; complicated", "Busy and congested, or intricate and hard to solve."],
      vi: ["đông đúc, phức tạp", "Đông người/xe cộ hoặc rắc rối khó giải quyết."],
      zh: ["拥挤，复杂", "人或车辆众多而杂乱，或事情错综复杂。"],
      ja: ["混雑している。複雑だ", "人や乗り物が多くて混み合っている、または物事が入り組んでいる。"],
    },
  },
  {
    lemma: "줄이다",
    target_code: "67812",
    pronunciation: "주리다",
    part_of_speech: "동사",
    word_grade: "초급",
    topik_level: 2,
    category: "수량·변화",
    korean_definition: "물건의 길이나 넓이, 수량, 시간 등을 본래보다 작거나 적게 하다.",
    example_ko: "일회용품 사용을 줄여서 환경을 보호해야 한다.",
    translations: {
      en: ["reduce; decrease; cut down", "To make length, quantity, or time smaller or less."],
      vi: ["giảm bớt, cắt giảm", "Làm cho số lượng hoặc thời gian ít hơn ban đầu."],
      zh: ["减少，缩减", "使数量、时间等比原来变小或变少。"],
      ja: ["減らす。縮める", "数量や時間などを本来より少なくする。"],
    },
  },
  {
    lemma: "충분하다",
    target_code: "71088",
    pronunciation: "충분하다",
    part_of_speech: "형용사",
    word_grade: "초급",
    topik_level: 2,
    category: "상태·성질",
    korean_definition: "부족함이 없이 넉넉하다.",
    example_ko: "충분한 수면을 취해야 피로가 풀린다.",
    translations: {
      en: ["enough; sufficient; ample", "Plenty and without any lack."],
      vi: ["đầy đủ", "Dồi dào, không thiếu thốn."],
      zh: ["充分，充足", "没有不足，很充裕。"],
      ja: ["十分だ", "不足がなく豊かだ。"],
    },
  },

  // 중급 (3~4급)
  {
    lemma: "수면",
    target_code: "55103",
    pronunciation: "수면",
    part_of_speech: "명사",
    word_grade: "중급",
    topik_level: 3,
    category: "보건·생활",
    korean_definition: "잠을 자는 일. 또는 그 상태.",
    example_ko: "현대인들은 바쁜 일상 속에서 수면 시간을 줄이곤 한다.",
    translations: {
      en: ["sleep", "The act or state of sleeping."],
      vi: ["giấc ngủ", "Việc ngủ hoặc trạng thái ngủ."],
      zh: ["睡眠", "睡觉，或指那种状态。"],
      ja: ["睡眠", "眠ること。また、その状態。"],
    },
  },
  {
    lemma: "유지되다",
    target_code: "60501",
    pronunciation: "유지되다",
    part_of_speech: "동사",
    word_grade: "중급",
    topik_level: 3,
    category: "변화·상태",
    korean_definition: "어떤 상태나 상황이 그대로 보존되거나 계속되다.",
    example_ko: "꾸준히 관리해야 면역력이 유지된다.",
    translations: {
      en: ["be maintained; be preserved", "For a state or situation to be preserved or continued."],
      vi: ["được duy trì", "Trạng thái nào đó được bảo tồn hoặc tiếp tục."],
      zh: ["维持，保持", "某种状态或情况原样保存或持续下去。"],
      ja: ["維持される", "ある状態や状況がそのまま保たれる。"],
    },
  },
  {
    lemma: "집중력",
    target_code: "69011",
    pronunciation: "집쭝녁",
    part_of_speech: "명사",
    word_grade: "중급",
    topik_level: 3,
    category: "심리·능력",
    korean_definition: "마음이나 주의를 한곳에 모으는 힘.",
    example_ko: "충분히 쉬면 업무 집중력이 높아진다.",
    translations: {
      en: ["concentration; focus", "The ability to gather one's attention in one place."],
      vi: ["khả năng tập trung", "Sức mạnh tập trung sự chú ý vào một nơi."],
      zh: ["注意力，集中力", "把注意力集中在一处的力量。"],
      ja: ["集中力", "心や注意を一箇所に集める力。"],
    },
  },
  {
    lemma: "경쟁력",
    target_code: "20101",
    pronunciation: "경쟁녁",
    part_of_speech: "명사",
    word_grade: "중급",
    topik_level: 4,
    category: "경제·경영",
    korean_definition: "경쟁에서 이길 수 있는 힘이나 능력.",
    example_ko: "가격 경쟁력과 배송의 신속성이 소비자 만족도를 높였다.",
    translations: {
      en: ["competitiveness", "The power or ability to win in competition."],
      vi: ["năng lực cạnh tranh", "Sức mạnh hoặc khả năng chiến thắng trong cạnh tranh."],
      zh: ["竞争力", "在竞争中获胜的力量或能力。"],
      ja: ["競争力", "競争に勝てる力や能力。"],
    },
  },
  {
    lemma: "신속성",
    target_code: "20102",
    pronunciation: "신속썽",
    part_of_speech: "명사",
    word_grade: "중급",
    topik_level: 4,
    category: "경제·쓰기53번",
    korean_definition: "일 처리나 움직임이 매우 빠르고 민첩한 성질.",
    example_ko: "온라인 쇼핑 이용자들은 배송의 신속성을 가장 중요하게 꼽았다.",
    translations: {
      en: ["promptness; rapidity; speed", "The quality of being very fast and agile."],
      vi: ["tính nhanh chóng", "Tính chất xử lý công việc rất nhanh và nhạy bén."],
      zh: ["迅速性，快捷性", "办事或行动非常迅速敏捷的性质。"],
      ja: ["迅速性", "仕事の処理や動きが非常に速く機敏な性質。"],
    },
  },
  {
    lemma: "급증하다",
    target_code: "20103",
    pronunciation: "급쯩하다",
    part_of_speech: "동사",
    word_grade: "중급",
    topik_level: 4,
    category: "통계·쓰기53번",
    korean_definition: "수나 양이 갑자기 크게 늘어나다.",
    example_ko: "최근 4년간 1인 가구의 비율이 2배 이상 급증하였다.",
    translations: {
      en: ["surge; increase sharply", "For a number or amount to increase suddenly and significantly."],
      vi: ["tăng vọt, tăng mạnh", "Số lượng tăng lên đột ngột và nhanh chóng."],
      zh: ["激增，猛增", "数量突然大幅增加。"],
      ja: ["急増する", "数や量が急激に大きく増える。"],
    },
  },
  {
    lemma: "창출하다",
    target_code: "20105",
    pronunciation: "창출하다",
    part_of_speech: "동사",
    word_grade: "중급",
    topik_level: 4,
    category: "경제·사회",
    korean_definition: "전에 없던 것을 처음으로 만들어 내다.",
    example_ko: "친환경 산업 육성을 통해 새로운 일자리를 창출해야 한다.",
    translations: {
      en: ["create; generate", "To create or bring about something new (e.g., jobs, value)."],
      vi: ["tạo ra, kiến tạo", "Tạo ra cái mới chưa từng có (như việc làm, giá trị)."],
      zh: ["创造，创立", "首次创造出以前没有的事物（如就业岗位、价值）。"],
      ja: ["創出する", "以前になかったものを新しく作り出す。"],
    },
  },
  {
    lemma: "대책",
    target_code: "20106",
    pronunciation: "대책",
    part_of_speech: "명사",
    word_grade: "중급",
    topik_level: 3,
    category: "사회·정책",
    korean_definition: "어려운 상황이나 문제를 이겨 내거나 해결하기 위한 계획이나 방법.",
    example_ko: "저출산 문제를 해결하기 위한 실효성 있는 대책 마련이 시급하다.",
    translations: {
      en: ["countermeasure; policy", "A plan or method to overcome or solve a problem."],
      vi: ["đối sách, biện pháp", "Kế hoạch hoặc phương pháp để giải quyết vấn đề."],
      zh: ["对策，措施", "为克服困难或解决问题而制定的计划或方法。"],
      ja: ["対策", "困難な状況や問題を解決するための計画や方法。"],
    },
  },

  // 고급 (5~6급)
  {
    lemma: "면역력",
    target_code: "45912",
    pronunciation: "며녕녁",
    part_of_speech: "명사",
    word_grade: "고급",
    topik_level: 5,
    category: "의학·건강",
    korean_definition: "외부에서 들어온 병원균에 저항하는 힘.",
    example_ko: "충분한 수면을 취해야 면역력이 유지된다.",
    translations: {
      en: ["immunity; immune strength", "The power to resist pathogens entering from outside."],
      vi: ["sức đề kháng, miễn dịch", "Sức mạnh chống lại vi khuẩn gây bệnh."],
      zh: ["免疫力", "抵抗从外部侵入的病原菌的能力。"],
      ja: ["免疫力", "外部から入った病原菌に抵抗する力。"],
    },
  },
  {
    lemma: "숙면",
    target_code: "56022",
    pronunciation: "숭면",
    part_of_speech: "명사",
    word_grade: "고급",
    topik_level: 5,
    category: "의학·건강",
    korean_definition: "깊이 든 잠.",
    example_ko: "건강을 지키려면 하루 7시간 이상의 숙면이 필요하다.",
    translations: {
      en: ["deep sleep; sound sleep", "A deep, restful sleep."],
      vi: ["giấc ngủ sâu", "Giấc ngủ say và sâu."],
      zh: ["熟睡，酣睡", "深沉的睡眠。"],
      ja: ["熟睡", "深く眠ること。"],
    },
  },
  {
    lemma: "양극화",
    target_code: "30101",
    pronunciation: "양그콰",
    part_of_speech: "명사",
    word_grade: "고급",
    topik_level: 5,
    category: "사회·논술54번",
    korean_definition: "서로 다른 두 극단으로 나뉘어 중간 부분이 줄어들고 차이가 심해지는 현상.",
    example_ko: "알고리즘 추천 시스템은 확증 편향을 강화하여 사회적 양극화를 부추긴다.",
    translations: {
      en: ["polarization", "The phenomenon of dividing into two extremes with widening gaps."],
      vi: ["sự phân cực", "Hiện tượng chia thành hai thái cực đối lập ngày càng sâu sắc."],
      zh: ["两极分化", "向截然不同的两个极端分化、差距日益扩大的现象。"],
      ja: ["二極化", "異なる二つの極端に分かれ、差が激しくなる現象。"],
    },
  },
  {
    lemma: "고립감",
    target_code: "30102",
    pronunciation: "고립깜",
    part_of_speech: "명사",
    word_grade: "고급",
    topik_level: 5,
    category: "심리·논술54번",
    korean_definition: "외따로 떨어져 혼자만 남겨진 듯한 느낌.",
    example_ko: "과도한 경쟁과 사회적 고립감으로 인해 현대인의 행복지수가 낮아지고 있다.",
    translations: {
      en: ["sense of isolation; alienation", "The feeling of being left alone and cut off from others."],
      vi: ["cảm giác cô lập", "Cảm giác bị tách biệt và bỏ lại một mình."],
      zh: ["孤立感", "感到孤立无援、独自被冷落的心理状态。"],
      ja: ["孤立感", "他から離れて一人だけ取り残されたような感覚。"],
    },
  },
  {
    lemma: "함양하다",
    target_code: "30103",
    pronunciation: "하먕하다",
    part_of_speech: "동사",
    word_grade: "고급",
    topik_level: 6,
    category: "학술·논술54번",
    korean_definition: "능력이나 품성, 태도 등을 차츰 길러서 갖추다.",
    example_ko: "수용자 스스로 정보의 진위를 판별하는 미디어 리터러시 역량을 함양해야 한다.",
    translations: {
      en: ["cultivate; foster", "To gradually develop and nurture abilities, character, or attitudes."],
      vi: ["bồi dưỡng, trau dồi", "Nuôi dưỡng và phát triển năng lực hoặc phẩm chất."],
      zh: ["涵养，培养", "逐步培养并具备某种能力、品德或态度。"],
      ja: ["涵養する。養う", "能力や品性、態度などを徐々に養って身につける。"],
    },
  },
  {
    lemma: "훼손되다",
    target_code: "30104",
    pronunciation: "훼손되다",
    part_of_speech: "동사",
    word_grade: "고급",
    topik_level: 5,
    category: "사회·환경",
    korean_definition: "체면이나 명예가 손상되거나, 물건·자연 등이 헐어 망가지다.",
    example_ko: "허위 정보가 무분별하게 유통되면서 사회적 신뢰가 심각하게 훼손되고 있다.",
    translations: {
      en: ["be damaged; be undermined", "For trust, honor, or nature/objects to be impaired or ruined."],
      vi: ["bị hủy hoại, bị tổn hại", "Uy tín, danh dự hoặc môi trường bị làm hỏng."],
      zh: ["受损，毁损", "名誉、信任受到损害，或物体、自然环境遭到破坏。"],
      ja: ["毀損される。損なわれる", "名誉や信頼が傷ついたり、物や自然が壊れたりする。"],
    },
  },
  {
    lemma: "경신하다",
    target_code: "30204",
    pronunciation: "경신하다",
    part_of_speech: "동사",
    word_grade: "고급",
    topik_level: 5,
    category: "신문기사·통계",
    korean_definition: "이미 있던 어떤 기록을 깨뜨리고 새로운 기록을 세우다.",
    example_ko: "반려동물 관련 산업 규모가 사상 최대치를 경신했다.",
    translations: {
      en: ["break a record; renew", "To surpass an existing record and set a new one."],
      vi: ["phá kỷ lục, lập kỷ lục mới", "Phá vỡ kỷ lục cũ và thiết lập kỷ lục mới."],
      zh: ["刷新（纪录）", "打破原有纪录并创下新纪录。"],
      ja: ["更新する", "既存の記録を破って新しい記録を打ち立てる。"],
    },
  },
  {
    lemma: "일맥상통하다",
    target_code: "30106",
    pronunciation: "일맥쌍통하다",
    part_of_speech: "형용사",
    word_grade: "고급",
    topik_level: 6,
    category: "사자성어·독해",
    korean_definition: "생각이나 성질, 처지 등이 서로 통하는 데가 있어 유사하다.",
    example_ko: "두 학자의 주장은 표현 방식만 다를 뿐 본질적으로 일맥상통한다.",
    translations: {
      en: ["have a common thread; be in the same vein", "Sharing an underlying connection in thought or nature."],
      vi: ["nhất mạch tương thông", "Có điểm chung, thông suốt với nhau về bản chất."],
      zh: ["一脉相通", "思想、性质或处境等彼此相通、相似。"],
      ja: ["一脈相通じる", "考えや性質などに互いに通じるものがあって似ている。"],
    },
  },
];

export const GRAMMAR_PATTERNS_DATA: GrammarPatternItem[] = [
  {
    id: "gram-101",
    pattern: "-아서/어서",
    level: 1,
    exam_type: "TOPIK_I",
    category: "이유·순차 연결어미",
    meaning_ko: "앞 문장이 뒤 문장의 이유나 원인이 됨을 나타내거나 시간적 선후 관계를 나타낸다.",
    meaning_en: "Indicates cause/reason ('because/so') or sequential action ('and then').",
    example_ko: "어제는 날씨가 너무 추워서 따뜻한 코트를 입었어요.",
    exam_tip: "뒤 문장에 명령문(-으세요)이나 청유문(-읍시다)이 오면 '-아서/어서' 대신 '-(으)니까'를 써야 합니다.",
  },
  {
    id: "gram-201",
    pattern: "-(으)면서",
    level: 2,
    exam_type: "TOPIK_I",
    category: "동시 동작",
    meaning_ko: "두 가지 이상의 동작이나 상태를 동시에 함을 나타낸다.",
    meaning_en: "Indicates performing two actions simultaneously ('while doing').",
    example_ko: "저는 한국 드라마를 보면서 한국어 발음을 연습해요.",
    exam_tip: "앞절과 뒷절의 주어가 반드시 동일해야 합니다.",
  },
  {
    id: "gram-301",
    pattern: "-느라고",
    level: 3,
    exam_type: "TOPIK_II",
    category: "이유·원인 (부정적 결과)",
    meaning_ko: "앞의 행위를 하느라 시간이나 노력을 들여 뒤의 부정적인 결과가 생겼음을 나타낸다.",
    meaning_en: "Indicates that doing the preceding intentional action caused a negative result ('because I was busy doing...').",
    example_ko: "발표 자료를 수정하느라고 어젯밤에 잠을 거의 못 잤다.",
    exam_tip: "[TOPIK II 읽기 1~2번 단골] 동사에만 결합하며, 앞뒤 주어가 같고 뒷절에 주로 부정적 결과가 옵니다.",
  },
  {
    id: "gram-302",
    pattern: "-느니 (차라리 ~느니)",
    level: 3,
    exam_type: "TOPIK_II",
    category: "비교·선택",
    meaning_ko: "앞의 행위를 하는 것보다 차라리 뒤의 행위를 선택하는 편이 낫다는 뜻을 나타낸다.",
    meaning_en: "Expresses that rather than doing Action A, choosing Action B is much better.",
    example_ko: "출퇴근 시간에 자가용을 이용하느니 지하철을 타는 편이 훨씬 빠르다.",
    exam_tip: "[TOPIK II 1~2번 빈출] 주로 부사 '차라리'와 호응하며 뒤에는 '-는 편이 낫다/좋다'가 자주 옵니다.",
  },
  {
    id: "gram-401",
    pattern: "-기 마련이다 / -는 법이다",
    level: 4,
    exam_type: "TOPIK_II",
    category: "당위·자연적 이치",
    meaning_ko: "어떤 일이 당연히 그렇게 될 수밖에 없는 자연스러운 이치임을 나타낸다.",
    meaning_en: "Indicates a natural law or inevitability ('is bound to / it is only natural that').",
    example_ko: "꾸준히 노력하지 않으면 실력이 제자리걸음을 하기 마련이다.",
    exam_tip: "[TOPIK II 3~4번 유의어 단골] '-기 마련이다'와 '-는 법이다'는 유의어이며, '-기 나름이다(하기에 따라 다르다)'와 구별해야 합니다.",
  },
  {
    id: "gram-402",
    pattern: "-(으)ㄹ 뿐만 아니라 / -(으)ㄹ 뿐더러",
    level: 4,
    exam_type: "TOPIK_II",
    category: "첨가·확장 (쓰기 53·54번 필수)",
    meaning_ko: "앞의 사실에 더해 뒤의 사실까지 추가됨을 나타낸다.",
    meaning_en: "Not only A, but also B ('not only... but also...').",
    example_ko: "충분한 수면은 면역력을 높여 줄 뿐만 아니라 집중력 향상에도 큰 도움을 준다.",
    exam_tip: "[쓰기 54번 고득점 표현] 본론에서 원인과 효과를 두 가지 이상 연결할 때 필수적으로 활용하세요.",
  },
  {
    id: "gram-501",
    pattern: "-기 십상이다",
    level: 5,
    exam_type: "TOPIK_II",
    category: "부정적 추측·경향",
    meaning_ko: "어떤 부정적인 상황이나 결과에 빠지기 매우 쉽다는 뜻을 나타낸다.",
    meaning_en: "Very likely or prone to fall into a negative outcome ('it is easy to end up...').",
    example_ko: "정보의 진위를 검증하지 않고 수용하면 가짜 뉴스에 현혹되기 십상이다.",
    exam_tip: "[고급 읽기·쓰기 빈출] 반드시 부정적인 결과(실패하다, 속다, 낭패를 보다 등)와 함께 쓰입니다.",
  },
  {
    id: "gram-502",
    pattern: "-는 셈이다",
    level: 5,
    exam_type: "TOPIK_II",
    category: "판단·결산 (쓰기 53번 필수)",
    meaning_ko: "여건이나 결과를 따져 보면 결국 그러한 것과 같다는 판단을 나타낸다.",
    meaning_en: "All things considered, it amounts to / is practically the same as.",
    example_ko: "4년간 온라인 쇼핑 매출이 15조 원에서 32조 원으로 늘어 두 배 이상 증가한 셈이다.",
    exam_tip: "[쓰기 53번 통계 요약 팁] 수치 변화를 해석하여 요약할 때 '~배 증가한 셈이다'로 활용하면 자연스럽습니다.",
  },
  {
    id: "gram-601",
    pattern: "-기 이를 데 없다 / -기 짝이 없다",
    level: 6,
    exam_type: "TOPIK_II",
    category: "최상급 강조 (고급 문어체)",
    meaning_ko: "정도나 상태가 말로 다 표현할 수 없을 만큼 매우 심함을 나타낸다.",
    meaning_en: "Beyond description; extremely ('cannot be more... / utterly').",
    example_ko: "생태계를 고려하지 않은 무분별한 개발은 근시안적이기 이를 데 없다.",
    exam_tip: "[6급 읽기 3~4번 유의어 & 54번 논술] 형용사에 결합하여 필자의 강한 비판이나 강조 태도를 드러냅니다.",
  },
];

export const IDIOMS_DATA: IdiomProverbItem[] = [
  {
    expression: "발 벗고 나서다",
    type: "관용어",
    level: "중·고급 (4~6급)",
    meaning_ko: "어떤 일에 적극적으로 앞장서서 행동하다.",
    meaning_en: "To step forward actively and wholeheartedly to solve an issue.",
    example: "침체된 지역 상권을 살리기 위해 상인들이 직접 발 벗고 나섰다.",
  },
  {
    expression: "눈코 뜰 새 없다",
    type: "관용어",
    level: "중급 (3~4급)",
    meaning_ko: "정신을 차릴 수 없을 정도로 매우 바쁘다.",
    meaning_en: "To be extremely busy without a moment to breathe.",
    example: "신제품 출시를 앞두고 전 직원이 눈코 뜰 새 없이 바쁜 나날을 보내고 있다.",
  },
  {
    expression: "입을 모으다",
    type: "관용어",
    level: "중·고급 (4~6급)",
    meaning_ko: "여러 사람이 같은 의견으로 한목소리를 내다.",
    meaning_en: "To speak in unison; for experts/people to agree unanimously.",
    example: "전문가들은 가짜 뉴스 문제를 해결하려면 미디어 리터러시 교육이 필수적이라고 입을 모은다.",
  },
  {
    expression: "발등에 불이 떨어지다",
    type: "관용어",
    level: "중·고급 (4~5급)",
    meaning_ko: "일이 매우 급하게 닥쳐서 당장 처리해야 하는 상황에 처하다.",
    meaning_en: "To have an urgent matter pressing right upon one.",
    example: "마감 기한이 내일로 다가오자 발등에 불이 떨어진 것처럼 서둘러 보고서를 작성했다.",
  },
  {
    expression: "귀를 기울이다",
    type: "관용어",
    level: "중급 (3~4급)",
    meaning_ko: "남의 말이나 의견을 주의 깊게 열심히 듣다.",
    meaning_en: "To listen attentively to others' voices or opinions.",
    example: "기업이 지속 가능하게 성장하려면 소비자의 작은 불만에도 귀를 기울여야 한다.",
  },
  {
    expression: "제자리걸음을 하다",
    type: "관용어",
    level: "고급 (5~6급)",
    meaning_ko: "발전이나 진전이 없이 한 상태에 머물러 있다.",
    meaning_en: "To make no progress; to stagnate in the same place.",
    example: "끊임없이 혁신하지 않는 기업은 치열한 시장에서 제자리걸음을 할 수밖에 없다.",
  },
  {
    expression: "일석이조 (一石二鳥)",
    type: "사자성어",
    level: "중·고급 (4~6급)",
    meaning_ko: "돌 하나로 새 두 마리를 잡는다는 뜻으로, 한 가지 일을 해서 두 가지 이익을 동시에 얻음.",
    meaning_en: "Killing two birds with one stone.",
    example: "자전거로 출퇴근하면 건강도 챙기고 교통비도 절약할 수 있어 일석이조이다.",
  },
  {
    expression: "우후죽순 (雨後竹筍)",
    type: "사자성어",
    level: "고급 (5~6급)",
    meaning_ko: "비 온 뒤에 대나무 순이 돋아나듯 어떤 현상이나 사물이 한꺼번에 많이 생겨남.",
    meaning_en: "Springing up like mushrooms (bamboo shoots) after the rain.",
    example: "온라인 쇼핑 시장이 급성장하면서 관련 배송 업체들이 우후죽순으로 생겨났다.",
  },
];

export const STUDY_RESOURCES_DATA: StudyResourceItem[] = [
  {
    id: "yt-hanijemi-5354",
    title: "HANIJEMI (배정선 선생님) - TOPIK II 쓰기 53번·54번 기출 해설 및 만점 템플릿 특강",
    provider: "YouTube · HANIJEMI Korean",
    category: "쓰기 51~54번 특강",
    target_levels: "TOPIK II (3~6급)",
    description:
      "TOPIK II 쓰기 53번 도표 분석 공식과 54번 논술문 서론·본론·결론 작성법을 실제 기출문제(60회~91회) 첨삭 사례와 함께 설명하는 대표 유튜브 채널입니다.",
    url: "https://www.youtube.com/results?search_query=HANIJEMI+TOPIK+쓰기+53번+54번",
    tags: ["쓰기 53번", "쓰기 54번", "원고지 작성법", "기출 첨삭"],
  },
  {
    id: "yt-wabom-topik",
    title: "WABOM TOPIK (와봄 토픽) - TOPIK 읽기·쓰기 채점 기준 및 고득점 문법 라이브 강의",
    provider: "YouTube · WABOM TOPIK",
    category: "읽기·쓰기 종합",
    target_levels: "TOPIK II (3~6급)",
    description:
      "수험생들이 자주 감점당하는 문어체 종결어미 오류, 접속부사 활용법, 읽기 장문 독해 시간 단축 전략을 다루는 전문 강의 채널입니다.",
    url: "https://www.youtube.com/results?search_query=WABOM+TOPIK+쓰기+읽기+특강",
    tags: ["채점 기준", "고급 문법", "읽기 시간 배분", "실전 모의고사"],
  },
  {
    id: "yt-listening-archive",
    title: "TOPIK 역대 기출문제 듣기 평가 전체 음원 & 스크립트 (제60회·64회·83회·91회)",
    provider: "YouTube · TOPIK Listening Archive",
    category: "듣기 실전 음원",
    target_levels: "TOPIK I & II (1~6급)",
    description:
      "실제 시험장과 동일한 안내 방송, 남녀 성우 대화 음원 및 한국어 대본(스크립트)을 보며 섀도잉(Shadowing) 연습을 할 수 있는 기출 듣기 모음입니다.",
    url: "https://www.youtube.com/results?search_query=TOPIK+기출문제+듣기+음원+스크립트+91회+83회",
    tags: ["듣기 음원", "스크립트", "섀도잉", "기출 복원"],
  },
  {
    id: "yt-ttmik-topik1",
    title: "Talk To Me In Korean (TTMIK) & KoreanClass101 - TOPIK I 초급 필수 어휘·문법 마스터",
    provider: "YouTube · TTMIK / KoreanClass101",
    category: "초급 어휘·문법",
    target_levels: "TOPIK I (1~2급)",
    description:
      "1급(800단어)~2급(1,500단어) 필수 초급 어휘와 기초 연결어미·종결어미를 다국어 해설과 함께 쉽게 배울 수 있는 글로벌 채널입니다.",
    url: "https://www.youtube.com/results?search_query=TOPIK+1+vocabulary+grammar+full+course",
    tags: ["TOPIK I", "1급·2급", "초급 어휘 1500", "기초 문법"],
  },
  {
    id: "web-official-topik",
    title: "국립국제교육원 TOPIK 공식 홈페이지 (기출문제 PDF & 듣기 MP3 무료 다운로드)",
    provider: "NIIED · topik.go.kr",
    category: "공식 기출 자료실",
    target_levels: "TOPIK I & II (1~6급)",
    description:
      "대한민국 교육부 국립국제교육원에서 공식 배포하는 역대 TOPIK 시험지, 정답표, 듣기 평가 MP3 원본 및 IBT 체험관을 제공합니다.",
    url: "https://www.topik.go.kr",
    tags: ["공식 홈페이지", "기출 PDF", "IBT 안내", "국립국제교육원"],
  },
  {
    id: "web-krdict-nikl",
    title: "국립국어원 한국어기초사전 (11개 언어 번역 학습자 사전)",
    provider: "NIKL · krdict.korean.go.kr",
    category: "공식 어휘·사전",
    target_levels: "초급·중급·고급 (1~6급)",
    description:
      "한국어 학습자를 위해 5만여 개의 필수 어휘를 초급·중급·고급 등급별로 분류하고 11개 언어 번역과 용례를 제공하는 국립국어원 공식 사전입니다.",
    url: "https://krdict.korean.go.kr",
    tags: ["국립국어원", "등급별 어휘", "11개국어 번역", "발음·용례"],
  },
];


// ==============================================================================
// MULTILINGUAL EXPLANATION & CONTENT HELPERS (12 Languages)
// ==============================================================================
export const QUESTION_EXPLANATIONS_BY_NUM: Record<
  string,
  Record<string, { answer: string; explanation: string }>
> = {
  "LISTENING-1": {
    ko: {
      answer: "정답: 2번",
      explanation:
        "남자는 주말에 공원에서 자전거를 타거나 축구를 한다고 했으므로 '남자는 주말에 공원에서 운동을 합니다'가 정답입니다.",
    },
    en: {
      answer: "Correct Answer: #2",
      explanation:
        "The man says he rides a bike or plays soccer in the park on weekends, which means he exercises in the park.",
    },
    vi: {
      answer: "Đáp án đúng: Số 2",
      explanation:
        "Người đàn ông nói cuối tuần thường đạp xe hoặc đá bóng ở công viên, nghĩa là tập thể dục ở công viên.",
    },
    zh: {
      answer: "正确答案：2号",
      explanation:
        "男士说周末在公园骑自行车或和朋友踢足球，因此正确答案是男士周末在公园运动。",
    },
    ja: {
      answer: "正解：2番",
      explanation:
        "男の人は週末に公園で自転車に乗ったりサッカーをしたりすると言ったので、「公園で運動をします」が正解です。",
    },
  },
  "LISTENING-5": {
    ko: {
      answer: "정답: 3번 (병원)",
      explanation:
        "'어디가 아파서 오셨어요?', '주사 맞고 약 드시면 금방 나을 거예요'라는 의사의 진찰 표현을 통해 이곳이 '병원'임을 알 수 있습니다.",
    },
    en: {
      answer: "Correct Answer: #3 (Hospital/Clinic)",
      explanation:
        "Doctor's consultation expressions like 'Where does it hurt?' and 'Get an injection and take medicine' indicate a hospital.",
    },
    vi: {
      answer: "Đáp án đúng: Số 3 (Bệnh viện)",
      explanation:
        "Các câu hỏi khám bệnh và tiêm thuốc cho thấy địa điểm này là bệnh viện (병원).",
    },
    zh: {
      answer: "正确答案：3号（医院）",
      explanation:
        "通过询问哪里不舒服、打针吃药很快就会好等看诊对话，可以判断这里是医院（병원）。",
    },
    ja: {
      answer: "正解：3番（病院）",
      explanation:
        "「どこが痛くて来られましたか」「注射を打って薬を飲めばすぐ治ります」という診察の会話から「病院」だと分かります。",
    },
  },
  "LISTENING-10": {
    ko: {
      answer: "정답: 1번",
      explanation:
        "남자가 '제가 지금 도서관에 책을 반납해야 해요'라고 말했으므로 대화가 끝난 직후 도서관에 가서 책을 돌려줍니다.",
    },
    en: {
      answer: "Correct Answer: #1",
      explanation:
        "The man says 'I have to return a book to the library right now', so he will go to the library to return the book first.",
    },
    vi: {
      answer: "Đáp án đúng: Số 1",
      explanation:
        "Người đàn ông nói phải đi trả sách ở thư viện ngay bây giờ, nên hành động tiếp theo là đến thư viện trả sách.",
    },
    zh: {
      answer: "正确答案：1号",
      explanation:
        "男士说现在得先去图书馆还书，因此对话结束后男士接下来会去图书馆把书归还。",
    },
    ja: {
      answer: "正解：1番",
      explanation:
        "男の人は「今図書館に本を返却しなければなりません」と言ったので、まず図書館へ行って本を返します。",
    },
  },
  "READING-3": {
    ko: {
      answer: "정답: 2번 (추웠습니다)",
      explanation:
        "뒤 문장에서 '따뜻한 옷을 입고 밖에 나갔습니다'라고 했으므로 날씨가 '추웠습니다'가 가장 알맞습니다.",
    },
    en: {
      answer: "Correct Answer: #2 (추웠습니다 - It was cold)",
      explanation:
        "Since the speaker wore warm clothes to go outside, the weather yesterday must have been cold ('추웠습니다').",
    },
    vi: {
      answer: "Đáp án đúng: Số 2 (추웠습니다 - Trời lạnh)",
      explanation:
        "Vì câu sau nói 'mặc áo ấm ra ngoài' nên thời tiết hôm qua rất lạnh ('추웠습니다').",
    },
    zh: {
      answer: "正确答案：2号（추웠습니다 - 很冷）",
      explanation:
        "后一句说“穿着暖和的衣服出门了”，因此天气非常冷（추웠습니다）。",
    },
    ja: {
      answer: "正解：2番（추웠습니다 - 寒かったです）",
      explanation:
        "後ろの文で「暖かい服を着て外に出ました」と言っているので、「寒かったです（추웠습니다）」が正解です。",
    },
  },
  "READING-12": {
    ko: {
      answer: "정답: 3번",
      explanation:
        "안내문 첫 문장에 '도서관 시설 수리와 청소 때문에 이번 주 금요일 하루 동안 문을 닫습니다'라고 명시되어 있습니다.",
    },
    en: {
      answer: "Correct Answer: #3",
      explanation:
        "The first sentence of the notice clearly states that the library is closed this Friday due to facility repairs and cleaning.",
    },
    vi: {
      answer: "Đáp án đúng: Số 3",
      explanation:
        "Câu đầu của thông báo nêu rõ thứ Sáu tuần này thư viện đóng cửa để sửa chữa cơ sở vật chất và dọn dẹp.",
    },
    zh: {
      answer: "正确答案：3号",
      explanation:
        "通知第一句明确说明因设施维修与打扫，本周五闭馆休息一天。",
    },
    ja: {
      answer: "正解：3番",
      explanation:
        "案内文の最初の文に「施設の修理と掃除のため今週の金曜日一日休館します」と明記されています。",
    },
  },
  "READING-20": {
    ko: {
      answer: "정답: 1번 (어려웠지만)",
      explanation:
        "'처음에는 자막 없이 보는 것이 어려웠다'와 '지금은 많이 알아듣는다'가 서로 대조되므로 '-았/었지만'(어려웠지만)이 정답입니다.",
    },
    en: {
      answer: "Correct Answer: #1 (어려웠지만 - It was difficult, but...)",
      explanation:
        "The first clause ('it was hard at first') contrasts with the second ('now I understand a lot'), requiring '-았/었지만'.",
    },
    vi: {
      answer: "Đáp án đúng: Số 1 (어려웠지만 - Tuy khó nhưng...)",
      explanation:
        "Vế trước ('lúc đầu khó') tương phản với vế sau ('bây giờ nghe hiểu nhiều') nên dùng đuôi nối tương phản '-았/었지만'.",
    },
    zh: {
      answer: "正确答案：1号（어려웠지만 - 虽然很难但是……）",
      explanation:
        "前句“起初很困难”与后句“现在能听懂很多”形成转折对比，因此选表转折的“어려웠지만”。",
    },
    ja: {
      answer: "正解：1番（어려웠지만 - 難しかったですが）",
      explanation:
        "「最初は難しかった」と「今はよく聞き取れる」が対比されているため、逆接の「어려웠지만」が正解です。",
    },
  },
  "LISTENING-9": {
    ko: {
      answer: "정답: 2번",
      explanation:
        "남자는 현재 설문 조사 그래프를 수정하고 있으며, 여자가 수정이 끝나는 대로 출력(인쇄)해 달라고 요청했으므로 2번이 정답입니다.",
    },
    en: {
      answer: "Correct Answer: #2",
      explanation:
        "The man is revising the survey graph and was asked to print it out as soon as he finishes revising it.",
    },
    vi: {
      answer: "Đáp án đúng: Số 2",
      explanation:
        "Người đàn ông đang sửa biểu đồ thống kê và được yêu cầu in tài liệu ra ngay sau khi sửa xong.",
    },
    zh: {
      answer: "正确答案：2号",
      explanation:
        "男士正在修改调查图表，女士请他修改完后立即打印出来放到会议室。",
    },
    ja: {
      answer: "正解：2番",
      explanation:
        "男の人は統計グラフを修正中で、終わり次第印刷して会議室に置くよう頼まれたので2番が正解です。",
    },
  },
  "LISTENING-21": {
    ko: {
      answer: "정답: 4번",
      explanation:
        "여자는 '무엇보다 고객들이 남긴 이용 후기를 꼼꼼히 분석해 볼 필요가 있어요'라며 후기 분석을 통한 맞춤형 서비스 개선을 강조합니다.",
    },
    en: {
      answer: "Correct Answer: #4",
      explanation:
        "The woman emphasizes analyzing customer reviews carefully to identify complaints and improve tailored services.",
    },
    vi: {
      answer: "Đáp án đúng: Số 4",
      explanation:
        "Người phụ nữ nhấn mạnh cần phân tích kỹ đánh giá của khách hàng để cải thiện dịch vụ.",
    },
    zh: {
      answer: "正确答案：4号",
      explanation:
        "女士强调最重要的是仔细分析顾客留下的使用评价，以改善定制化服务。",
    },
    ja: {
      answer: "正解：4番",
      explanation:
        "女の人は「何より顧客が残した利用レビューを綿密に分析する必要がある」と強調しているため4番が正解です。",
    },
  },
  "LISTENING-37": {
    ko: {
      answer: "정답: 3번",
      explanation:
        "강연자는 건물을 모두 허무는 재개발 대신 지역의 역사적 맥락과 공동체 문화를 보존하며 활력을 불어넣는 도시 재생이 핵심이라고 말합니다.",
    },
    en: {
      answer: "Correct Answer: #3",
      explanation:
        "The speaker argues that true urban regeneration preserves local historical context, community culture, and identity.",
    },
    vi: {
      answer: "Đáp án đúng: Số 3",
      explanation:
        "Diễn giả nhấn mạnh tái thiết đô thị cần bảo tồn văn hóa bản địa và cộng đồng dân cư.",
    },
    zh: {
      answer: "正确答案：3号",
      explanation:
        "演讲者指出真正的城市再生应保留当地历史脉络与社区文化，守护地域独特性。",
    },
    ja: {
      answer: "正解：3番",
      explanation:
        "講演者は、地域の歴史的文脈や共同体の文化を保存しつつ活性化させることが都市再生の核心だと述べています。",
    },
  },
  "READING-2": {
    ko: {
      answer: "정답: 3번 (이용하느니)",
      explanation:
        "앞의 행위(자가용 이용)보다 뒤의 행위(대중교통 이용)를 선택하는 편이 훨씬 낫다는 비교·선택 연결어미 '-느니'가 정답입니다.",
    },
    en: {
      answer: "Correct Answer: #3 (이용하느니 - Rather than using...)",
      explanation:
        "'-느니' expresses that rather than doing the first action (driving a car), choosing the second action (taking transit) is much better.",
    },
    vi: {
      answer: "Đáp án đúng: Số 3 (이용하느니 - Thà... còn hơn)",
      explanation:
        "Ngữ pháp '-느니' biểu thị sự lựa chọn: thà đi tàu điện ngầm/xe buýt còn nhanh hơn lái xe cá nhân.",
    },
    zh: {
      answer: "正确答案：3号（이용하느니 - 与其……不如……）",
      explanation:
        "语法“-느니”表示与其做前一项（开私家车），不如选择后一项（乘地铁或公交）更好。",
    },
    ja: {
      answer: "正解：3番（이용하느니 - 〜するくらいなら）",
      explanation:
        "「-느니」は前の行動より後ろの行動を選ぶ方がずっと良いという比較・選択を表します。",
    },
  },
  "READING-4": {
    ko: {
      answer: "정답: 1번 (는 법이다)",
      explanation:
        "'-기 마련이다'는 당연히 그렇게 될 수밖에 없는 자연스러운 이치를 나타내며 '-는 법이다'와 바꿔 쓸 수 있습니다.",
    },
    en: {
      answer: "Correct Answer: #1 (-는 법이다 - It is bound to / natural to)",
      explanation:
        "'-기 마련이다' expresses natural inevitability and is synonymous with '-는 법이다'.",
    },
    vi: {
      answer: "Đáp án đúng: Số 1 (-는 법이다 - Tất yếu sẽ)",
      explanation:
        "'-기 마련이다' diễn tả quy luật tất yếu, đồng nghĩa với '-는 법이다'.",
    },
    zh: {
      answer: "正确答案：1号（-는 법이다 - 必然会……）",
      explanation:
        "“-기 마련이다”表示事情必然会那样发展，与“-는 법이다”互为近义语法。",
    },
    ja: {
      answer: "正解：1番（-는 법이다 - 〜するものだ）",
      explanation:
        "「-기 마련이다」は当然の理屈・必然性を表し、「-는 법이다」と置き換えられます。",
    },
  },
  "READING-13": {
    ko: {
      answer: "정답: 1번 (나)-(가)-(다)-(라)",
      explanation:
        "(나)에서 일반적 현상을 제시한 뒤 (가) '그러나'로 문제점을 지적하고, (다)에서 수면의 효과를 설명한 후 (라) '따라서'로 결론을 맺습니다.",
    },
    en: {
      answer: "Correct Answer: #1 (나)-(가)-(다)-(라)",
      explanation:
        "Start with the general trend (나), contrast with 'However' (가), explain why sleep is vital (다), and conclude with 'Therefore' (라).",
    },
    vi: {
      answer: "Đáp án đúng: Số 1 (나)-(가)-(다)-(라)",
      explanation:
        "Mở đầu bằng hiện tượng (나), phản biện bằng 'Tuy nhiên' (가), giải thích lý do (다) và kết luận bằng 'Do đó' (라).",
    },
    zh: {
      answer: "正确答案：1号 (나)-(가)-(다)-(라)",
      explanation:
        "先由(나)提出普遍现象，再由(가)“但是”指出问题，接着(다)说明原因，最后(라)“因此”得出结论。",
    },
    ja: {
      answer: "正解：1番 (나)-(가)-(다)-(라)",
      explanation:
        "(나)で一般的現象を示し、(가)「しかし」で問題提起、(다)で理由を説明し、(라)「したがって」で結論づけます。",
    },
  },
  "READING-19": {
    ko: {
      answer: "정답: 2번 (발 벗고 나섰다)",
      explanation:
        "'발 벗고 나서다'는 어떤 일을 해결하기 위해 적극적으로 앞장서서 행동한다는 뜻의 핵심 기출 관용어입니다.",
    },
    en: {
      answer: "Correct Answer: #2 (발 벗고 나섰다 - Stepped forward actively)",
      explanation:
        "'발 벗고 나서다' is an essential idiom meaning to step forward actively and wholeheartedly to solve a problem.",
    },
    vi: {
      answer: "Đáp án đúng: Số 2 (발 벗고 나섰다 - Tích cực xắn tay đứng ra)",
      explanation:
        "'발 벗고 나서다' mang nghĩa tích cực đi đầu giải quyết công việc.",
    },
    zh: {
      answer: "正确答案：2号（발 벗고 나섰다 - 积极挺身而出）",
      explanation:
        "“발 벗고 나서다”意为积极主动地站在最前面采取行动。",
    },
    ja: {
      answer: "正解：2番（발 벗고 나섰다 - 一肌脱いだ・積極的に乗り出した）",
      explanation:
        "「발 벗고 나서다」は積極的に先頭に立って行動することを意味する頻出慣用句です。",
    },
  },
  "READING-25": {
    ko: {
      answer: "정답: 4번",
      explanation:
        "'양육 가구 급증(빠르게 늘어남)'과 '사상 최대치 경신(역대 가장 큰 기록을 새로 씀)'의 의미를 정확히 풀어낸 4번이 정답입니다.",
    },
    en: {
      answer: "Correct Answer: #4",
      explanation:
        "'급증' means surging rapidly, and '사상 최대치 경신' means setting a new all-time high record.",
    },
    vi: {
      answer: "Đáp án đúng: Số 4",
      explanation:
        "'급증' là tăng mạnh, '사상 최대치 경신' là lập kỷ lục cao nhất từ trước đến nay.",
    },
    zh: {
      answer: "正确答案：4号",
      explanation:
        "“급증”意为激增，“사상 최대치 경신”意为刷新历史最高纪录，因此4号最准确。",
    },
    ja: {
      answer: "正解：4番",
      explanation:
        "「急増」と「史上最大値の更新」を最も正確に言い換えている4番が正解です。",
    },
  },
  "READING-35": {
    ko: {
      answer: "정답: 3번",
      explanation:
        "필자는 마지막 문장에서 제도적 규제와 함께 '수용자 스스로 정보의 진위를 비판적으로 검증하는 미디어 리터러시 역량을 함양하는 일이 시급하다'고 강조합니다.",
    },
    en: {
      answer: "Correct Answer: #3",
      explanation:
        "The author concludes that alongside institutional regulation, cultivating media literacy to critically verify information is urgent.",
    },
    vi: {
      answer: "Đáp án đúng: Số 3",
      explanation:
        "Tác giả nhấn mạnh bên cạnh quy định thể chế, người tiếp nhận cần nâng cao năng lực kiểm chứng thông tin (media literacy).",
    },
    zh: {
      answer: "正确答案：3号",
      explanation:
        "作者在末句强调：除制度监管外，培养受众批判性甄别信息真伪的媒介素养迫在眉睫。",
    },
    ja: {
      answer: "正解：3番",
      explanation:
        "筆者は制度的規制とともに「受け手自身が情報の真偽を批判的に検証するメディアリテラシーを養うことが急務だ」と主張しています。",
    },
  },
  "READING-42": {
    ko: {
      answer: "정답: 2번",
      explanation:
        "필자는 예술 작품을 '열린 텍스트'로 보며 감상자가 자신의 삶과 시대적 맥락에 비추어 주체적으로 재해석할 때 작품의 가치가 확장된다고 봅니다.",
    },
    en: {
      answer: "Correct Answer: #2",
      explanation:
        "The author views artworks as 'open texts' whose value expands when audiences actively reinterpret them.",
    },
    vi: {
      answer: "Đáp án đúng: Số 2",
      explanation:
        "Tác giả coi tác phẩm là 'văn bản mở', sự tái diễn giải chủ động của người thưởng thức giúp mở rộng giá trị tác phẩm.",
    },
    zh: {
      answer: "正确答案：2号",
      explanation:
        "作者将艺术作品视为“开放文本”，认为鉴赏者主体性的重新诠释能拓展作品的价值。",
    },
    ja: {
      answer: "正解：2番",
      explanation:
        "筆者は作品を「開かれたテクスト」と捉え、鑑賞者の主体的な再解釈が作品の価値を広げると見ています。",
    },
  },
  "WRITING-51": {
    ko: {
      answer: "모범 답안: ㉠ 가기 어렵게 되었습니다 / ㉡ 변경할 수 있을까요",
      explanation:
        "51번 실용문은 정중한 높임법('-습니다/-ㅂ니다' 또는 '-아/어요')을 사용해야 합니다. ㉠에는 회의로 인해 예약 시간에 방문하지 못한다는 표현, ㉡에는 시간을 바꿀 수 있는지 묻는 의문형 표현을 씁니다.",
    },
    en: {
      answer: "Model Answer: ㉠ 가기 어렵게 되었습니다 / ㉡ 변경할 수 있을까요",
      explanation:
        "Q51 requires polite honorifics ('-습니다' or '-아/어요'). In ㉠, explain you cannot make the appointment time; in ㉡, politely ask if you can reschedule.",
    },
    vi: {
      answer: "Đáp án mẫu: ㉠ 가기 어렵게 되었습니다 / ㉡ 변경할 수 있을까요",
      explanation:
        "Câu 51 cần dùng kính ngữ lịch sự ('-습니다' hoặc '-아/어요'). Ở ㉠ nêu lý do không thể đến đúng giờ hẹn; ở ㉡ hỏi lịch sự xem có thể đổi giờ khám không.",
    },
    zh: {
      answer: "参考答案：㉠ 가기 어렵게 되었습니다 / ㉡ 변경할 수 있을까요",
      explanation:
        "51题实用文需使用礼貌敬语（-습니다或-아/어요）。㉠处填写因紧急会议无法按时前往，㉡处礼貌询问能否更改预约时间。",
    },
    ja: {
      answer: "模範解答：㉠ 가기 어렵게 되었습니다 / ㉡ 변경할 수 있을까요",
      explanation:
        "51番の実用文では丁寧な敬語（-습니다/-아/어요）を使います。㉠には予約時間に行けなくなったこと、㉡には時間を変更できるか尋ねる表現を書きます。",
    },
  },
  "WRITING-52": {
    ko: {
      answer: "모범 답안: ㉠ 썩기 때문이다 / ㉡ 주지 말고",
      explanation:
        "52번 설명문은 반드시 문어체 평서형('-다/는다')을 사용해야 합니다. 앞의 '왜냐하면'에 호응하도록 ㉠에는 '-기 때문이다'를, ㉡에는 뒤 문장과 대조되도록 '-지 말고'를 씁니다.",
    },
    en: {
      answer: "Model Answer: ㉠ 썩기 때문이다 / ㉡ 주지 말고",
      explanation:
        "Q52 explanatory writing requires formal written endings ('-다/는다'). Pair '왜냐하면' with '썩기 때문이다' in ㉠, and use '주지 말고' in ㉡.",
    },
    vi: {
      answer: "Đáp án mẫu: ㉠ 썩기 때문이다 / ㉡ 주지 말고",
      explanation:
        "Câu 52 văn giải thích bắt buộc dùng đuôi văn viết ('-다/는다'). ㉠ đi với '왜냐하면' nên dùng '썩기 때문이다', ㉡ dùng '주지 말고'.",
    },
    zh: {
      answer: "参考答案：㉠ 썩기 때문이다 / ㉡ 주지 말고",
      explanation:
        "52题说明文必须使用书面基本阶（-다/는다）。㉠与前面的“왜냐하면”呼应填“썩기 때문이다”，㉡填“주지 말고”。",
    },
    ja: {
      answer: "模範解答：㉠ 썩기 때문이다 / ㉡ 주지 말고",
      explanation:
        "52番の説明文は必ず文語体（-다/는다）で書きます。「왜냐하면」に呼応する「썩기 때문이다」を㉠に、「주지 말고」を㉡に入れます。",
    },
  },
  "WRITING-53": {
    ko: {
      answer: "권장 분량: 200~300자 (문어체 '-다/는다' 필수)",
      explanation:
        "1단계(조사 기관 및 주제 도입) → 2단계(연도별 수치 증감 비교: '~에서 ~로 급증한/감소한 것으로 나타났다') → 3단계(요인 비중 순위 및 원인 분석) → 4단계(향후 전망 및 과제) 순서로 200~300자를 작성하세요.",
    },
    en: {
      answer: "Target Length: 200–300 chars (Formal '-다/는다' style)",
      explanation:
        "Follow the 4-step formula: (1) Survey topic intro -> (2) Numerical trend comparison -> (3) Ranking/Cause analysis -> (4) Future outlook/task in 200–300 Korean characters.",
    },
    vi: {
      answer: "Độ dài chuẩn: 200~300 chữ (Đuôi câu văn viết '-다/는다')",
      explanation:
        "Viết theo cấu trúc 4 bước: (1) Giới thiệu cơ quan & chủ đề khảo sát -> (2) So sánh số liệu tăng/giảm -> (3) Phân tích tỷ lệ/nguyên nhân -> (4) Triển vọng tương lai.",
    },
    zh: {
      answer: "建议字数：200~300字（必须使用书面体“-다/는다”）",
      explanation:
        "按四步公式撰写：(1) 调查机构与主题导入 -> (2) 数据增减趋势对比 -> (3) 因素占比排序与原因分析 -> (4) 今后展望与课题。",
    },
    ja: {
      answer: "推奨字数：200〜300字（文語体「-다/는다」必須）",
      explanation:
        "①調査機関・主題の導入 → ②数値の増減比較 → ③要因の順位・原因分析 → ④今後の展望の4段階で200〜300字にまとめます。",
    },
  },
  "WRITING-54": {
    ko: {
      answer: "권장 분량: 600~700자 (서론·본론·결론 3단 논술)",
      explanation:
        "서론(약 120자: 사회적 배경 및 문제 제기) → 본론 1(약 220자: 제시된 첫 번째·두 번째 질문인 원인 및 영향 분석) → 본론 2(약 220자: 개인적·사회적 해결 방안 제시) → 결론(약 100자: 종합 요약 및 제언)으로 구성하고 문단 첫 칸은 들여쓰기하세요.",
    },
    en: {
      answer: "Target Length: 600–700 chars (Intro - Body - Conclusion Essay)",
      explanation:
        "Structure into Introduction (~120 chars), Body 1 (causes & negative impacts, ~220 chars), Body 2 (individual & institutional solutions, ~220 chars), and Conclusion (~100 chars). Indent the first cell of each paragraph.",
    },
    vi: {
      answer: "Độ dài chuẩn: 600~700 chữ (Bài nghị luận Mở - Thân - Kết)",
      explanation:
        "Chia thành Mở bài (~120 chữ), Thân bài 1 (nguyên nhân & tác động, ~220 chữ), Thân bài 2 (giải pháp cá nhân & xã hội, ~220 chữ), Kết bài (~100 chữ). Nhớ lùi đầu dòng 1 ô khi sang đoạn mới.",
    },
    zh: {
      answer: "建议字数：600~700字（绪论·本论·结论三段式议论文）",
      explanation:
        "按绪论（约120字：背景与问题提出）、本论1（约220字：原因与负面影响）、本论2（约220字：个人与社会解决对策）、结论（约100字：总结展望）分段撰写，每段首格空一格。",
    },
    ja: {
      answer: "推奨字数：600〜700字（序論・本論・結論の三段構成）",
      explanation:
        "序論（約120字：問題提起）→ 本論1（約220字：原因と影響の分析）→ 本論2（約220字：個人的・社会的解決策）→ 結論（約100字：要約と提言）で構成し、段落の最初は1マス空けます。",
    },
  },
};

export function getLocalizedQuestionExplanation(
  sectionName: string,
  questionNumber: number,
  lang: string
): { answer: string; explanation: string } {
  const key = `${sectionName}-${questionNumber}`;
  const entry =
    QUESTION_EXPLANATIONS_BY_NUM[key] || QUESTION_EXPLANATIONS_BY_NUM["READING-13"];
  return entry[lang] || entry.en || entry.ko;
}
