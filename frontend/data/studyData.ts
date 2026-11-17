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

export interface BuiltInMiniLectureItem {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  category: string;
  target_levels: string;
  summary: string;
  key_points: string[];
  lecture_script_ko: string;
  example_formula: string;
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
      "[TOPIK I · 1급 듣기] 다음 대화를 듣고 내용과 일치하는 것을 고르십시오. (음성 재생 버튼을 눌러 들으세요)",
    correct_answer_text: "2",
    explanations: {
      ko: "남자는 주말에 공원에서 자전거를 타거나 축구를 한다고 했으므로 '공원에서 운동을 합니다'가 정답입니다.",
      en: "The man says he rides a bicycle or plays soccer in the park on weekends, which means he exercises in the park.",
      vi: "Người đàn ông nói cuối tuần thường đạp xe hoặc đá bóng ở công viên, tức là tập thể dục ở công viên.",
      zh: "男士说周末通常在公园骑自行车或和朋友踢足球，因此正确答案是在公园运动。",
      ja: "男の人は週末に公園で自転車に乗ったりサッカーをしたりすると言ったので、「公園で運動をします」が正解です。",
    },
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
    correct_answer_text: "3",
    explanations: {
      ko: "'어디가 아파서 오셨어요?', '입을 크게 벌려 보세요', '주사 맞고 약 드시면'이라는 진찰 표현을 통해 이곳이 '병원'임을 알 수 있습니다.",
      en: "Expressions like 'Where does it hurt?', 'Open your mouth wide', and 'get an injection' indicate a hospital/clinic.",
      vi: "Các câu hỏi khám bệnh và tiêm thuốc cho thấy đây là bệnh viện (병원).",
      zh: "通过询问病情、张开嘴检查、打针吃药等表达，可以判断这里是医院（병원）。",
      ja: "診察の会話（「どこが痛いですか」「注射を打って薬を飲めば」）から、ここが「病院」であることが分かります。",
    },
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
    correct_answer_text: "1",
    explanations: {
      ko: "남자는 '제가 지금 도서관에 책을 반납해야 해요. 반납하고 바로 백화점 앞으로 갈게요'라고 했으므로 대화 직후 도서관에 가서 책을 반납합니다.",
      en: "The man says 'I have to return a book to the library right now', so he will return the book at the library first.",
      vi: "Người đàn ông nói bây giờ phải đi trả sách ở thư viện trước rồi mới đến bách hóa.",
      zh: "男士说现在得先去图书馆还书，因此对话结束后男士接下来会去图书馆还书。",
      ja: "男の人は「今図書館に本を返却しなければなりません」と言ったので、まず図書館へ行って本を返します。",
    },
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
    correct_answer_text: "2",
    explanations: {
      ko: "뒤 문장에서 '따뜻한 옷을 입고 밖에 나갔습니다'라고 했으므로 날씨가 '추웠습니다'가 가장 자연스럽습니다.",
      en: "Since the speaker wore warm clothes to go outside, the weather must have been cold ('추웠습니다').",
      vi: "Câu sau nói 'mặc áo ấm ra ngoài', nên thời tiết hôm qua rất lạnh ('추웠습니다').",
      zh: "后一句说“穿着暖和的衣服出门了”，因此天气非常冷（추웠습니다）。",
      ja: "後ろの文で「暖かい服を着て外に出ました」と言っているので、天気が「寒かったです（추웠습니다）」が正解です。",
    },
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
    correct_answer_text: "3",
    explanations: {
      ko: "안내문 첫 문장에 '도서관 시설 수리와 청소 때문에 이번 주 금요일 하루 동안 문을 닫습니다'라고 명시되어 있으므로 3번이 정답입니다.",
      en: "The notice states the library will close on Friday for facility repairs and cleaning.",
      vi: "Thông báo nêu rõ thứ Sáu thư viện đóng cửa để sửa chữa cơ sở vật chất và dọn dẹp.",
      zh: "通知第一句明确说明因为设施维修和打扫，本周五闭馆一天。",
      ja: "案内文に「施設の修理と掃除のため今週の金曜日一日休館します」と書かれているため、3番が正解です。",
    },
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
    correct_answer_text: "1",
    explanations: {
      ko: "'처음에는 자막 없이 보는 것이 어려웠다'와 '지금은 많이 알아듣는다'가 서로 대조되므로 대조 연결어미 '-았/었지만'(어려웠지만)이 알맞습니다.",
      en: "The first clause ('it was difficult at first') contrasts with the second ('now I understand a lot'), requiring '-았/었지만' ('어려웠지만').",
      vi: "Vế trước ('lúc đầu khó') tương phản với vế sau ('bây giờ nghe hiểu nhiều'), nên dùng '-았/었지만' (어려웠지만).",
      zh: "前句“起初很困难”与后句“现在能听懂很多”形成转折关系，因此应选表转折的“어려웠지만”。",
      ja: "「最初は難しかった」と「今はよく聞き取れる」が対比されているため、逆接の「어려웠지만」が正解です。",
    },
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
    correct_answer_text: "2",
    explanations: {
      ko: "남자는 현재 설문 조사 통계 그래프를 수정하고 있으며, 여자가 수정이 끝나는 대로 출력(인쇄)해 달라고 요청했으므로 2번이 정답입니다.",
      en: "The man is currently revising the statistical graph in the presentation and was asked to print it once finished.",
      vi: "Người đàn ông đang sửa biểu đồ thống kê trong tài liệu thuyết trình và sẽ in ra sau khi sửa xong.",
      zh: "男士正在修改演示资料中的统计图表，修改完后需要打印出来放到会议室。",
      ja: "男の人は発表資料の統計グラフを修正しており、終わったら印刷して会議室に置くよう頼まれたので2番が正解です。",
    },
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
    correct_answer_text: "4",
    explanations: {
      ko: "여자는 '무엇보다 고객들이 남긴 이용 후기를 꼼꼼히 분석해 볼 필요가 있어요'라며 후기 분석을 통한 맞춤형 서비스 개선을 강조하고 있습니다.",
      en: "The woman emphasizes carefully analyzing customer reviews to identify complaints and improve tailored services.",
      vi: "Người phụ nữ nhấn mạnh cần phân tích kỹ đánh giá của khách hàng để cải thiện dịch vụ.",
      zh: "女士强调最重要的是仔细分析顾客留下的评价，准确掌握不满事项以改善服务。",
      ja: "女の人は「何より顧客が残した利用レビューを綿密に分析する必要がある」と強調しているため、4番が正解です。",
    },
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
    correct_answer_text: "3",
    explanations: {
      ko: "강연자는 건물을 모두 허무는 재개발 대신 '역사적 맥락과 지역 공동체의 문화를 보존하면서 고유한 정체성을 살리는 것'이 도시 재생의 핵심이라고 역설하고 있습니다.",
      en: "The speaker argues that true urban regeneration preserves local culture, historical context, and community identity rather than demolishing everything.",
      vi: "Diễn giả nhấn mạnh tái thiết đô thị cần bảo tồn văn hóa bản địa, bối cảnh lịch sử và cộng đồng dân cư.",
      zh: "演讲者指出，真正的城市再生应在保留当地历史脉络和社区文化的同时改善基础设施，守护地域独特性。",
      ja: "講演者は、建物を壊す再開発ではなく「地域の歴史的文脈や共同体の文化を保存しつつ活性化させること」が都市再生の核心だと述べています。",
    },
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
    correct_answer_text: "3",
    explanations: {
      ko: "앞의 행위(자가용 이용)보다 뒤의 행위(대중교통 이용)를 선택하는 것이 더 낫다는 비교·선택의 의미를 나타내는 연결어미 '-느니'(이용하느니)가 정답입니다.",
      en: "'-느니' ('이용하느니') expresses that rather than doing the first action (driving a car), choosing the second action (taking the subway/bus) is much better.",
      vi: "Ngữ pháp '-느니' dùng khi so sánh hai lựa chọn: thà đi tàu điện ngầm còn nhanh hơn lái xe cá nhân.",
      zh: "语法“-느니”表示与其做前一项（开私家车），不如选择后一项（乘地铁或公交）更好。",
      ja: "「-느니（〜するくらいなら・〜するよりは）」は、前の行動より後ろの行動を選ぶ方がましだという比較・選択を表します。",
    },
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
    correct_answer_text: "1",
    explanations: {
      ko: "'-기 마련이다'는 '당연히 그렇게 될 수밖에 없다'는 자연스러운 이치나 필연성을 나타내며, '-는 법이다'와 의미가 가장 유사합니다.",
      en: "'-기 마련이다' means something is bound to happen naturally, which is synonymous with '-는 법이다'.",
      vi: "'-기 마련이다' diễn tả quy luật tất yếu (ắt hẳn sẽ như vậy), đồng nghĩa với '-는 법이다'.",
      zh: "“-기 마련이다”表示事情必然会那样发展，与“-는 법이다”（理所当然会……）意思最相近。",
      ja: "「-기 마련이다（〜するものだ）」は当然の理屈・必然性を表し、「-는 법이다」と置き換えることができます。",
    },
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
    correct_answer_text: "1",
    explanations: {
      ko: "(나)에서 일반적인 문제 현상을 제시한 후, (가)의 접속부사 '그러나'로 문제점을 지적하고, (다)에서 수면의 중요성을 설명한 뒤, (라)의 '따라서'로 결론을 짓는 흐름이 자연스럽습니다.",
      en: "The logical sequence starts with (나) stating the general phenomenon, followed by (가) with 'however', explaining the reason in (다), and concluding with (라) 'therefore'.",
      vi: "Trình tự hợp lý: (나) nêu hiện tượng -> (가) 'Tuy nhiên' chỉ ra tác hại -> (다) giải thích lý do -> (라) 'Do đó' kết luận.",
      zh: "先由(나)提出普遍现象，再由(가)“但是”指出问题，接着(다)说明充足睡眠的重要性，最后(라)“因此”得出结论。",
      ja: "(나)で一般的な現象を提示し、(가)「しかし」で問題点を指摘、(다)で理由を説明し、(라)「したがって」で結論づける流れが自然です。",
    },
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
    correct_answer_text: "2",
    explanations: {
      ko: "'발 벗고 나서다'는 어떤 일에 적극적으로 앞장서서 행동한다는 뜻의 필수 기출 관용구입니다. 상인들이 직접 공동 배달과 야시장을 추진했으므로 가장 적절합니다.",
      en: "'발 벗고 나서다' means to step forward actively and wholeheartedly to solve a problem.",
      vi: "'발 벗고 나서다' là quán용 ngữ mang nghĩa tích cực xắn tay áo đứng ra giải quyết công việc.",
      zh: "“발 벗고 나서다”意为积极主动地挺身而出采取行动，符合商人们亲自推进外卖与夜市的语境。",
      ja: "「발 벗고 나서다（一肌脱ぐ・積極的に乗り出す）」は、ある事に積極的に先頭に立って行動することを意味する頻出慣用句です。",
    },
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
    correct_answer_text: "4",
    explanations: {
      ko: "'양육 가구 급증(빠르게 늘어남)'과 '사상 최대치 경신(역대 가장 큰 기록을 새로 씀)'의 의미를 정확히 풀어낸 것은 4번입니다.",
      en: "'양육 가구 급증' means households raising pets surged, and '사상 최대치 경신' means breaking the all-time high record.",
      vi: "'급증' là tăng mạnh, '사상 최대치 경신' là lập kỷ lục cao nhất từ trước đến nay.",
      zh: "“급증”意为激增，“사상 최대치 경신”意为刷新历史最高纪录，因此4号选项最准确。",
      ja: "「급증（急増）」と「사상 최대치 경신（史上最大値の更新）」を最も適切に言い換えているのは4番です。",
    },
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
    correct_answer_text: "3",
    explanations: {
      ko: "마지막 문장의 '따라서 플랫폼 기업의 자정 노력과 제도적 규제 못지않게, 수용자 스스로 정보의 진위를 비판적으로 검증하는 미디어 리터러시 역량을 함양하는 일이 시급하다'에 필자의 주장이 집약되어 있습니다.",
      en: "The author concludes that alongside institutional regulations, cultivating media literacy to critically verify information is urgent.",
      vi: "Tác giả nhấn mạnh bên cạnh quy định thể chế, người tiếp nhận cần nâng cao năng lực truyền thông (media literacy) để kiểm chứng thông tin.",
      zh: "作者在末句总结道：除了平台自律和制度监管外，培养受众批判性甄别信息真伪的媒介素养同样迫在眉睫。",
      ja: "筆者は最後の文で、制度的規制だけでなく「受け手自身が情報の真偽を批判的に検証するメディアリテラシーを養うことが急務だ」と主張しています。",
    },
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
    correct_answer_text: "2",
    explanations: {
      ko: "필자는 작품을 '열린 텍스트'로 규정하며, 감상자가 자신의 경험과 시대적 맥락에 비추어 새로운 의미를 부여할 때 작품이 살아 숨 쉬는 예술로 재탄생한다고 보는 입장입니다.",
      en: "The author views artworks as 'open texts' whose value expands when audiences actively reinterpret them through their own context and experience.",
      vi: "Tác giả coi tác phẩm nghệ thuật là 'văn bản mở', việc người thưởng thức chủ động tái diễn giải sẽ làm sống dậy giá trị tác phẩm.",
      zh: "作者认为作品一旦发表便成为“开放文本”，鉴赏者结合自身时代背景与人生经验赋予其新意义，能使作品焕发新生。",
      ja: "筆者は作品を「開かれたテクスト」と捉え、鑑賞者が主体的に新しい意味を付与することで作品の価値が広がると述べています。",
    },
    options: [
      { option_number: 1, option_text: "작가의 창작 의도를 왜곡하는 주관적 해석을 경계하고 있다." },
      { option_number: 2, option_text: "감상자의 주체적인 재해석이 작품의 가치를 확장한다고 보고 있다." },
      { option_number: 3, option_text: "시대적 배경을 배제한 예술 비평의 한계를 비판하고 있다." },
      { option_number: 4, option_text: "고전 예술 작품의 원형을 훼손 없이 보존해야 한다고 주장하고 있다." },
    ],
  },

  // =========================================================================
  // [TOPIK II - 3급~6급] 쓰기 51번 · 52번 · 53번(그래프 4종) · 54번 (WRITING)
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
    correct_answer_text:
      "㉠ 가기 어렵게 되었습니다 / 갈 수 없게 되었습니다 | ㉡ 변경할 수 있을까요 / 바꿀 수 있습니까",
    explanations: {
      ko: "51번 실용문은 정중한 높임법('-습니다/-ㅂ니다' 또는 '-아/어요')을 사용해야 합니다. ㉠에는 회의로 인해 예약 시간에 방문하지 못한다는 표현, ㉡에는 시간을 바꿀 수 있는지 묻는 의문형 표현을 씁니다.",
      en: "Q51 requires polite honorifics ('-습니다' or '-아/어요'). In ㉠, explain you cannot make the appointment time; in ㉡, politely ask if you can reschedule.",
    },
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
    correct_answer_text:
      "㉠ 썩기 때문이다 / 숨을 쉬지 못하기 때문이다 | ㉡ 주지 말고 / 주는 대신에",
    explanations: {
      ko: "52번 설명문은 반드시 문어체 평서형('-다/는다')을 사용해야 합니다. 앞의 '왜냐하면'에 호응하도록 ㉠에는 '-기 때문이다'를, ㉡에는 뒤 문장과 대조되도록 '-지 말고'를 씁니다.",
      en: "Q52 explanatory writing requires formal written endings ('-다/는다'). Pair '왜냐하면' with '썩기 때문이다' in ㉠, and use '주지 말고' in ㉡.",
    },
    options: [],
  },
  {
    question_id: "00000000-0000-0000-0001-000000000053",
    section_name: "WRITING",
    question_number: 53,
    question_type: "ESSAY_SHORT",
    difficulty_level: 4,
    score_points: 30.0,
    passage_text:
      "[조사 주제: 인주시의 자전거 이용자 변화]\n\n1. 자전거 이용자 수 변화 (단위: 명)\n- 2007년: 4만 명  →  2012년: 9만 명  →  2017년: 21만 명 (10년간 약 5배 증가)\n\n2. 변화 이유\n- 자전거 도로 개발\n- 자전거 빌리는 곳 확대\n\n3. 이용 목적별 변화 (2007년 대비 2017년 증가 폭)\n- 운동 및 산책: 4배 증가\n- 출퇴근: 14배 증가 (가장 큰 폭으로 증가)\n- 기타: 3배 증가",
    prompt_text:
      "53. 다음을 참고하여 ‘인주시의 자전거 이용자 변화’에 대한 글을 200~300자로 쓰시오. 단, 글의 제목을 쓰지 마시오. (30점)",
    explanations: {
      ko: "자전거 이용자 수 변화(4만→9만→21만, 약 5배), 변화 이유(도로 개발·대여소 확대), 이용 목적별 증가 폭(출퇴근 14배, 운동 및 산책 4배, 기타 3배)을 문어체('-다/는다')로 200~300자로 작성하세요.",
      en: "Summarize the growth in bicycle users (40k to 210k, ~5x), causes (bike paths and rental stations), and purpose growth rates (commuting 14x, exercise 4x, other 3x) in 200-300 chars.",
    },
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
      "53. [그래프 유형 2] 다음을 참고하여 ‘온라인 쇼핑 이용 현황 및 만족 요인’에 대한 글을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오. (30점)",
    explanations: {
      ko: "도표의 수치 변화(15조 원→32조 원), 만족 요인 순위(배송 신속성 48%, 가격 경쟁력 32%, 상품 다양성 20%), 향후 전망을 객관적 문어체('-다/는다')로 200~300자 분량에 맞춰 서술해야 합니다.",
      en: "Describe the market growth trend (15T -> 32T KRW), satisfaction ranking (fast delivery 48%, price 32%, variety 20%), and future outlook in 200-300 characters using formal endings ('-다/는다').",
    },
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
      "53. [그래프 유형 3] 다음 자료를 참고하여 ‘인주시의 가구 형태 변화와 원인’에 대한 글을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오. (30점)",
    explanations: {
      ko: "4인 이상 가구 비율 감소(42%→21%)와 1인 가구 비율 급증(18%→39%)을 대조('-는 반면')하여 서술하고, 청년층 결혼관 변화 및 고령화 원인과 향후 과제까지 200~300자로 작성합니다.",
      en: "Contrast the decrease in 4+ person households (42%->21%) with the surge in 1-person households (18%->39%), explain the causes, and state future tasks in 200-300 characters.",
    },
    options: [],
  },
  {
    question_id: "00000000-0000-0000-0003-000000000053",
    section_name: "WRITING",
    question_number: 53,
    question_type: "ESSAY_SHORT",
    difficulty_level: 4,
    score_points: 30.0,
    passage_text:
      "[조사 기관: 한국출판문화연구소]\n주제: 성인의 전자책 독서율 변화 및 이용 이유\n\n1. 성인 전자책 독서율 변화 (단위: %)\n- 2019년: 16%  →  2021년: 27%  →  2023년: 41% (4년간 약 2.5배 급증)\n\n2. 전자책 선호 이유 (2023년 기준)\n- 휴대 및 보관의 편리성 (51%) > 저렴한 구매·구독 비용 (29%) > 오디오북 기능 지원 (20%)\n\n3. 향후 전망\n- 전자책 구독 서비스 확산으로 성인 전자책 이용률은 2026년 50% 돌파 전망",
    prompt_text:
      "53. [그래프 유형 4] 다음을 참고하여 ‘성인의 전자책 독서율 변화 및 이용 이유’에 대한 글을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오. (30점)",
    explanations: {
      ko: "전자책 독서율 상승 추이(16%→27%→41%), 선호 이유 순위(휴대·보관 편리성, 저렴한 비용, 오디오북 기능), 향후 전망을 문어체('-다/는다')로 200~300자로 작성하세요.",
      en: "Describe the e-book readership rise (16%->27%->41%), reasons ranked by percentage, and future outlook in 200-300 chars using '-다/는다'.",
    },
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
    explanations: {
      ko: "서론(문제 제기)-본론(원인 분석 및 개인·사회적 해결 방안)-결론(요약 및 제언)의 3단 구성을 갖추고 고급 어휘와 격식체('-다/는다')를 일관되게 사용해야 합니다.",
      en: "Structure your essay into Introduction, Body (causes, individual & societal solutions), and Conclusion (600-700 chars) using advanced Korean vocabulary and formal written endings ('-다/는다').",
    },
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
    explanations: {
      ko: "제91회 실제 기출 테마인 '가짜 뉴스' 논술 문항입니다. 1) 뉴미디어의 익명성·경제적 유인·확증 편향(배경), 2) 사회적 불신과 갈등 심화(부작용), 3) 법적·제도적 규제 및 개인의 미디어 리터러시 함양(해결책)을 600~700자로 서술하세요.",
      en: "Reconstructed 91st TOPIK Q54 on Fake News: address (1) causes of spread, (2) negative societal impacts, and (3) individual media literacy + institutional solutions in 600-700 chars.",
    },
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
    example_ko: "10년간 인주시의 자전거 이용자 수가 4만 명에서 21만 명으로 늘어 약 5배 증가한 셈이다.",
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

// =========================================================================
// 100% AD-FREE BUILT-IN COMPLETE MINI-LECTURES (무광고 자체 완강 미니 특강 6선)
// =========================================================================
export const BUILT_IN_MINI_LECTURES: BuiltInMiniLectureItem[] = [
  {
    id: "lec-writing-53",
    title: "[무광고 완강 1강] 쓰기 53번 그래프·도표 통계 분석 4단계 만점 공식",
    instructor: "TOPIK AI 전담 한국어 강사",
    duration: "3분 핵심 완강 (광고 없음)",
    category: "쓰기 53번 그래프 특강",
    target_levels: "TOPIK II (3~6급)",
    summary:
      "꺾은선 그래프, 막대그래프, 원그래프 및 변화 이유 상자를 빠짐없이 200~300자 원고지에 옮겨 적는 4문장 만점 공식을 완벽 정리합니다.",
    key_points: [
      "1문장(도입): '~에 대한 조사 결과를 살펴보면 ~변화가 나타났다'로 시작하며 제목은 절대 쓰지 않는다.",
      "2문장(전체 추이): 꺾은선 그래프의 시작 연도와 끝 연도 수치를 비교하여 '~에서 ~로 약 N배 급증하였다'로 요약한다.",
      "3문장(원인·목적 비교): 변화 이유('~와/과 ~ 때문이다') 및 항목별 증가 폭('출퇴근이 14배로 가장 크게 증가했으며, 운동 및 산책(4배), 기타(3배) 순으로 나타났다')을 서술한다.",
      "4문장(전망·마무리): 반드시 문어체 평서형('-다/는다/이다')으로 끝맺고 숫자·단위 뒤 띄어쓰기를 지킨다.",
    ],
    lecture_script_ko:
      "안녕하세요, 수험생 여러분! 광고 없이 바로 시작하는 토픽 쓰기 53번 그래프 분석 핵심 완강입니다. 쓰기 53번은 30점 배점으로, 제시된 그래프와 통계 수치를 보고 200자에서 300자로 분석하는 문제입니다. 만점을 받으려면 딱 네 문장 공식만 기억하세요. 첫째, 도입 문장입니다. 인주시의 자전거 이용자 변화를 살펴보면 전체 이용자 수가 크게 증가한 것으로 나타났다처럼 조사 주제를 제시합니다. 둘째, 전체 그래프 수치 비교입니다. 2007년 4만 명이었던 자전거 이용자 수는 2012년 9만 명을 거쳐 2017년 21만 명으로 10년간 약 5배 급증하였다고 정확히 적습니다. 셋째, 변화 이유와 막대그래프 비교입니다. 이러한 변화의 이유는 자전거 도로가 개발되고 자전거 빌리는 곳이 확대되었기 때문이다. 이용 목적별로 보면 출퇴근이 14배로 가장 큰 폭으로 증가했으며 운동 및 산책은 4배, 기타는 3배 늘어났다처럼 가장 큰 수치부터 비교합니다. 마지막으로 모든 문장은 반드시 합니다가 아닌 문어체 다, 는다로 끝내야 감점이 없습니다.",
    example_formula:
      "인주시의 ‘~’를 살펴보면 (~기간) 동안 큰 변화가 나타났다. (연도1) (수치1)이었던 (~은/는) (연도2) (수치2)을 거쳐 (연도3) (수치3)으로 약 (N)배 급증하였다. 이러한 변화의 이유는 (~기) 때문이다. 항목별로 살펴보면 (~이/가) (N)배로 가장 큰 폭으로 증가했으며, (~), (~) 순으로 나타났다.",
  },
  {
    id: "lec-writing-5152",
    title: "[무광고 완강 2강] 쓰기 51번 실용문 · 52번 설명문 빈칸 완성 20점 만점 비법",
    instructor: "TOPIK AI 전담 한국어 강사",
    duration: "2분 30초 핵심 완강 (광고 없음)",
    category: "쓰기 51·52번 특강",
    target_levels: "TOPIK II (3~5급)",
    summary:
      "51번(격식 있는 높임말 '-습니다/-아/어요')과 52번(논리적 문어체 '-다/는다')의 종결어미 차이와 앞뒤 문맥 호응 법칙을 완벽히 마스터합니다.",
    key_points: [
      "51번(실용문 10점): 안내문·이메일·부탁 글이므로 반드시 '-습니다/-ㅂ니다' 또는 '-아/어요' 높임말을 사용한다.",
      "51번 빈칸 요령: 빈칸 ㉠은 주로 이유·불가능('-기 어렵게 되었습니다'), 빈칸 ㉡은 정중한 요청·문의('-아/어 주실 수 있을까요?')가 정답이다.",
      "52번(설명문 10점): 객관적 설명 글이므로 반드시 '-다/는다/이다' 해라체(문어체)만 사용한다.",
      "52번 빈칸 요령: 앞 문장의 '왜냐하면'과 호응하는 '-기 때문이다', 대조를 나타내는 '-지 말고 / -는 대신'을 최우선으로 확인한다.",
    ],
    lecture_script_ko:
      "안녕하세요! 토픽 쓰기 51번과 52번 단답형 20점 만점 특강입니다. 가장 중요한 채점 기준은 종결어미 구분입니다. 51번은 이메일이나 안내문이므로 반드시 정중한 높임말인 습니다 또는 아요, 어요를 써야 합니다. 예를 들어 예약 시간을 바꾸는 글이라면, 급한 회의가 생겨서 제시간에 가기 어렵게 되었습니다, 그리고 시간을 변경할 수 있을까요처럼 정중하게 질문하면 만점입니다. 반면 52번은 설명문이므로 높임말을 쓰면 감점됩니다. 반드시 문어체인 다, 는다를 사용하세요. 특히 앞 문장에 왜냐하면이 있으면 빈칸 끝을 기 때문이다로 맞추고, 정해진 날짜마다 물을 주지 말고 흙이 말랐을 때 주는 것이 좋다처럼 앞뒤 대조 표현을 활용하면 완벽합니다.",
    example_formula:
      "[51번 공식] ㉠ ~(으)ㄹ 수 없게 되었습니다 / ~기 어렵게 되었습니다 | ㉡ ~아/어 주실 수 있을까요? / ~변경할 수 있을까요?\n[52번 공식] ㉠ (왜냐하면) ~기 때문이다 / ~(으)므로 | ㉡ ~지 말고 / ~는 대신에",
  },
  {
    id: "lec-writing-54",
    title: "[무광고 완강 3강] 쓰기 54번 장문 논술(600~700자) 서론·본론·결론 3단 설계법",
    instructor: "TOPIK AI 전담 한국어 강사",
    duration: "3분 30초 핵심 완강 (광고 없음)",
    category: "쓰기 54번 논술 특강",
    target_levels: "TOPIK II (5~6급)",
    summary:
      "제시된 3가지 과제 조건을 누락 없이 배치하고, 원고지 600~700자를 시간 내에 완성하는 문단별 분량 배분과 고급 접속표현을 강의합니다.",
    key_points: [
      "문단 구성(총 3~4문단): 서론(약 120자) + 본론 1(원인·문제점 약 220자) + 본론 2(개인·사회적 해결책 약 220자) + 결론(약 100자).",
      "원고지 규칙: 새 문단을 시작할 때 첫 번째 칸은 반드시 한 칸 비우고(들여쓰기) 두 번째 칸부터 쓴다.",
      "본론 전개 공식: '첫째, ~ 때문이다. 둘째, ~ 문제점이 발생한다.'처럼 표지어를 사용해 채점관이 조건 충족 여부를 한눈에 보게 한다.",
      "고급 어휘 치환: '좋다 → 긍정적인 영향을 미치다', '나쁘다 → 심각한 부작용을 초래하다', '노력하다 → 다각적인 노력을 기울이다'.",
    ],
    lecture_script_ko:
      "안녕하세요! 토픽 쓰기 54번 50점 만점 논술 완강입니다. 600자에서 700자를 막힘없이 쓰려면 문단별 글자 수를 미리 정해 두어야 합니다. 먼저 서론은 약 120자로, 현대 사회의 변화와 주제 배경을 제시합니다. 이때 문제지의 문장을 그대로 베껴 쓰면 감점되므로 자신의 표현으로 바꿔 써야 합니다. 본론 첫 번째 문단은 약 220자로 문제에서 요구한 원인이나 부정적 영향을 첫째, 둘째로 나누어 명확히 분석합니다. 본론 두 번째 문단은 약 220자로 이를 해결하기 위한 개인적 차원의 의식 개선과 사회적, 제도적 차원의 노력을 아울러 제시합니다. 마지막 결론은 약 100자로 따라서 진정한 발전을 이루기 위해서는 개인과 사회가 함께 다각적인 노력을 기울여야 할 것이다로 요약하며 마무리합니다. 새 문단이 시작될 때마다 원고지 맨 앞 칸을 한 칸 비우는 들여쓰기를 절대 잊지 마세요!",
    example_formula:
      "[서론] 최근 ~이/가 확산되면서 ~에 대한 관심이 높아지고 있다.\n[본론1] 이러한 현상이 나타나는 원인은 다음과 같다. 첫째, ~기 때문이다. 둘째, ~다는 점이다.\n[본론2] 따라서 이를 해결하기 위해서는 개인과 사회의 노력이 동시에 요구된다. 우선 개인은 ~야 한다. 나아가 사회적으로는 ~제도를 마련해야 한다.\n[결론] 요약하자면 ~을/를 위해 지속적인 관심과 노력을 기울여야 할 것이다.",
  },
  {
    id: "lec-listening-strategy",
    title: "[무광고 완강 4강] 듣기 평가 1번~50번 유형별 키워드 선취청 & 오답 소거 전략",
    instructor: "TOPIK AI 전담 한국어 강사",
    duration: "2분 30초 핵심 완강 (광고 없음)",
    category: "듣기 만점 전략",
    target_levels: "TOPIK I & II (1~6급)",
    summary:
      "음성이 나오기 전 5초 동안 선택지(1~4번)의 주어와 서술어 차이를 먼저 밑줄 긋고, 대화 직후 이어질 행동과 중심 생각을 잡아내는 비법입니다.",
    key_points: [
      "이어질 행동(9~12번): '제가 지금 ~할게요', '그럼 먼저 ~해 주세요' 바로 뒤에 나오는 동사가 100% 정답이다.",
      "중심 생각(17~20번): 역접 접속사('그러나', '하지만', '무엇보다') 뒤의 문장과 당위 표현('-아/어야 하다', '-ㄹ 필요가 있다')을 집중해서 듣는다.",
      "교양 강연·다큐(37~50번): 강연자가 비판하는 통념('흔히 ~라고 생각하기 쉽습니다')과 실제 주장('그러나 진정한 핵심은 ~입니다')을 구별한다.",
    ],
    lecture_script_ko:
      "안녕하세요! 토픽 듣기 평가 만점 전략 완강입니다. 듣기에서 고득점을 받는 가장 중요한 습관은 음성이 나오기 전에 선택지 1번부터 4번을 먼저 읽고 차이점에 표시하는 것입니다. 첫째, 남자가 이어서 할 행동을 고르는 문제에서는 대화 마지막 부분의 제가 먼저, 지금 바로, 끝나는 대로 뒤에 나오는 행동을 잡으세요. 둘째, 여자의 중심 생각을 묻는 문제에서는 맞아요, 하지만, 무엇보다, 필요가 있어요라는 표현 뒤에 핵심 주장이 나옵니다. 셋째, 고급 강연 문제에서는 흔히 무엇이라고 생각하기 쉽습니다라는 통념 뒤에 나오는 그러나 최근에는, 진정한 핵심은 뒷부분이 정답과 직결됩니다.",
    example_formula:
      "[이어질 행동 핵심 신호] '제가 지금 먼저 ~할게요' / '~끝나는 대로 바로 ~해 주세요'\n[중심 생각 핵심 신호] '무엇보다 ~(으)ㄹ 필요가 있어요' / '진정한 핵심은 ~이기 때문입니다'",
  },
  {
    id: "lec-reading-strategy",
    title: "[무광고 완강 5강] 읽기 평가 시간 단축 & 문장 배열(13~15번)·빈칸 추론 해법",
    instructor: "TOPIK AI 전담 한국어 강사",
    duration: "2분 30초 핵심 완강 (광고 없음)",
    category: "읽기 시간 단축",
    target_levels: "TOPIK I & II (1~6급)",
    summary:
      "70분 안에 읽기 50문항을 다 풀기 위한 파트별 시간 배분법과 문장 배열(13~15번), 신문 기사 제목(25~27번) 10초 컷 공식을 전수합니다.",
    key_points: [
      "문장 배열(13~15번): 첫 문장 후보에는 '그러나, 따라서, 이처럼, 그 결과' 같은 접속사나 지시어가 올 수 없다! 일반적 배경을 제시한 문장을 맨 앞에 둔다.",
      "지시어 꼬리 물기: '이러한 문제(가) → 문제의 구체적 사례(나)', '따라서(결론)'는 항상 맨 마지막에 배치한다.",
      "신문 헤드라인(25~27번): 핵심 한자어 4개('급증=빠르게 늘어남', '급감/위축=줄어듦', '경신=최고 기록 새로 씀', '시급=급히 필요함')만 알면 10초 안에 풀린다.",
    ],
    lecture_script_ko:
      "안녕하세요! 토픽 읽기 평가 시간 단축 완강입니다. 읽기에서 시간이 부족한 이유는 앞부분 문제에서 시간을 너무 많이 쓰기 때문입니다. 먼저 13번에서 15번 문장 배열 문제는 선택지 첫 글자만 보고 시작 문장을 고르세요. 그러나, 따라서, 이처럼이 들어간 문장은 절대 첫 문장이 될 수 없습니다. 일반적인 현상을 소개하는 문장으로 시작해서, 그러나로 문제를 제기하고, 따라서로 결론을 내리는 순서를 찾으면 20초 만에 풀립니다. 또한 25번에서 27번 신문 기사 제목 문제는 급증은 크게 늘어남, 위축은 줄어듦, 사상 최대치 경신은 역대 가장 큰 기록을 세움으로 짝짓기만 하면 바로 정답을 고를 수 있습니다.",
    example_formula:
      "[문장 배열 3초 법칙] (일반적 현상 도입) → (그러나/하지만 반전) → (구체적 이유·근거) → (따라서/그러므로 최종 결론)",
  },
  {
    id: "lec-grammar-master",
    title: "[무광고 완강 6강] TOPIK 읽기 1~4번 & 쓰기 필수 기출 문법 완벽 정리",
    instructor: "TOPIK AI 전담 한국어 강사",
    duration: "3분 핵심 완강 (광고 없음)",
    category: "필수 문법 완강",
    target_levels: "TOPIK I & II (1~6급)",
    summary:
      "시험마다 반복 출제되는 비교·선택('-느니'), 부정적 원인('-느라고'), 당위·이치('-기 마련이다 = -는 법이다') 등 핵심 문법을 총정리합니다.",
    key_points: [
      "'-느라고' vs '-(으)니까': '-느라고'는 앞뒤 주어가 같고 뒤에는 부정적 결과(못 잤다, 늦었다)만 온다.",
      "'-느니': '차라리 A하느니 B하는 편이 낫다' 형태로 두 행동을 비교해 B를 선택할 때 쓴다.",
      "유의 문법 1순위: '-기 마련이다' = '-는 법이다' (자연스러운 이치) vs '-기 나름이다' (하기에 따라 결과가 달라진다).",
      "고급 유의 문법: '-기 십상이다' (부정적 결과에 빠지기 쉽다), '-기 이를 데 없다' = '-기 짝이 없다' (더할 나위 없이 매우 심하다).",
    ],
    lecture_script_ko:
      "안녕하세요! 토픽 읽기 1번부터 4번 문법 문제를 단번에 해결하는 필수 문법 완강입니다. 첫째, 느라고는 발표 자료를 수정하느라고 잠을 못 잤다처럼 앞의 행동 때문에 뒤에 부정적인 결과가 생겼을 때 쓰며 앞뒤 주어가 반드시 같아야 합니다. 둘째, 느니는 길이 막혀서 자가용을 이용하느니 지하철을 타는 편이 낫다처럼 앞의 것보다 뒤의 것을 선택하는 것이 훨씬 낫다는 뜻입니다. 셋째, 유의 문법 문제에서 가장 많이 나오는 기 마련이다는 당연히 그렇게 될 수밖에 없다는 뜻으로 는 법이다와 똑같습니다. 이를 하기에 따라 달라진다는 뜻의 기 나름이다와 헷갈리지 않도록 주의하세요!",
    example_formula:
      "• -기 마련이다 = -는 법이다 (당연한 이치)\n• -기 나름이다 = -기에 달려 있다 (하기에 따라 다름)\n• -기 이를 데 없다 = -기 짝이 없다 (최상급 강조)",
  },
];

export const STUDY_RESOURCES_DATA: StudyResourceItem[] = [
  {
    id: "web-official-topik",
    title: "국립국제교육원 TOPIK 공식 홈페이지 (무광고 공식 기출문제 & IBT 체험)",
    provider: "대한민국 교육부 국립국제교육원 · topik.go.kr",
    category: "공식 기출 자료실 (무광고)",
    target_levels: "TOPIK I & II (1~6급)",
    description:
      "대한민국 교육부 국립국제교육원에서 공식 운영하는 광고 없는 사이트로, 역대 기출문제 PDF, 듣기 MP3 원본 및 공식 IBT 안내를 제공합니다.",
    url: "https://www.topik.go.kr",
    tags: ["공식 홈페이지", "무광고", "기출 PDF", "국립국제교육원"],
  },
  {
    id: "web-krdict-nikl",
    title: "국립국어원 한국어기초사전 (11개 언어 번역 공식 학습자 사전)",
    provider: "국립국어원 · krdict.korean.go.kr",
    category: "공식 어휘·사전 (무광고)",
    target_levels: "초급·중급·고급 (1~6급)",
    description:
      "한국어 학습자를 위해 5만여 개의 필수 어휘를 초급·중급·고급 등급별로 분류하고 11개 언어 번역과 원어민 발음을 광고 없이 제공하는 국립국어원 공식 사전입니다.",
    url: "https://krdict.korean.go.kr",
    tags: ["국립국어원", "무광고", "등급별 어휘", "11개국어 번역"],
  },
  {
    id: "web-sejong-hakdang",
    title: "누리-세종학당 (문화체육관광부 공식 무광고 한국어 완강 포털)",
    provider: "세종학당재단 · nuri.iksi.or.kr",
    category: "공식 무료 완강 (무광고)",
    target_levels: "TOPIK I & II (1~6급)",
    description:
      "유튜브 상업 광고 없이 초급부터 고급까지 한국어 어휘, 문법, 듣기, 읽기, 쓰기 정규 강의를 처음부터 끝까지 무료로 수강할 수 있는 공공 교육 플랫폼입니다.",
    url: "https://nuri.iksi.or.kr",
    tags: ["세종학당", "무광고 완강", "초·중·고급 정규과정", "공공 플랫폼"],
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
      answer: "권장 분량: 200~300자 (문어체 '-다/는다' 필수 · 제목 작성 금지)",
      explanation:
        "좌측의 그래프(자전거 이용자 수 꺾은선 그래프, 변화 이유 상자, 이용 목적 막대그래프 등)를 보고 1단계(주제 도입) → 2단계(전체 수치 변화 비교) → 3단계(변화 이유 및 항목별 배수·비중 비교) 순서로 200~300자를 작성하세요.",
    },
    en: {
      answer: "Target Length: 200–300 chars (Formal '-다/는다' style, no title)",
      explanation:
        "Analyze the left-hand chart using the 4-step formula: (1) Topic intro -> (2) Overall numerical change -> (3) Reasons for change & category comparison in 200–300 Korean characters.",
    },
    vi: {
      answer: "Độ dài chuẩn: 200~300 chữ (Đuôi câu văn viết '-다/는다')",
      explanation:
        "Phân tích biểu đồ bên trái theo 4 bước: (1) Giới thiệu chủ đề -> (2) So sánh số liệu tăng/giảm -> (3) Nguyên nhân thay đổi & so sánh mục đích sử dụng.",
    },
    zh: {
      answer: "建议字数：200~300字（必须使用书面体“-다/는다”，勿写标题）",
      explanation:
        "参考左侧图表按四步撰写：(1) 调查主题导入 -> (2) 折线图数据增减对比 -> (3) 变化原因与柱状图各项倍数对比。",
    },
    ja: {
      answer: "推奨字数：200〜300字（文語体「-다/는다」必須・題名禁止）",
      explanation:
        "左側のグラフを見て、①主題の導入 → ②全体の数値変化 → ③変化の理由と項目別の倍率比較の順で200〜300字にまとめます。",
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

export interface PassageVocabEntry {
  lemma: string;
  pronunciation: string;
  pos: string;
  grade: "초급" | "중급" | "고급";
  ko: string;
  trans: Record<string, [string, string]>;
}

export const PASSAGE_VOCAB_DICTIONARY: Record<string, PassageVocabEntry> = {
  그러나: {
    lemma: "그러나",
    pronunciation: "그러나",
    pos: "접속부사",
    grade: "초급",
    ko: "앞의 내용과 상반되는 내용을 이끌 때 쓰는 접속 부사.",
    trans: {
      en: ["however; but", "Conjunctive adverb introducing contrasting content."],
      vi: ["tuy nhiên, nhưng", "Phó từ liên kết dẫn dắt nội dung trái ngược."],
      zh: ["但是，然而", "用于引出与前面内容相反的转折副词。"],
      ja: ["しかし。だが", "前の内容と相反する内容を導く接続副詞。"],
    },
  },
  따라서: {
    lemma: "따라서",
    pronunciation: "따라서",
    pos: "접속부사",
    grade: "초급",
    ko: "앞의 내용이 뒤의 내용의 이유나 근거가 될 때 쓰는 접속 부사.",
    trans: {
      en: ["therefore; consequently", "Used when the preceding statement is the reason or basis for the following conclusion."],
      vi: ["do đó, vì vậy", "Dùng khi nội dung trước là lý do hoặc căn cứ của kết luận sau."],
      zh: ["因此，所以", "表示前面内容是后面结论的原因或依据。"],
      ja: ["したがって。それゆえ", "前の内容が後ろの結論の理由や根拠になる時に使う接続副詞。"],
    },
  },
  무조건: {
    lemma: "무조건",
    pronunciation: "무조건",
    pos: "부사",
    grade: "중급",
    ko: "아무런 조건이나 단서가 없이.",
    trans: {
      en: ["unconditionally; blindly", "Without any conditions or provisos."],
      vi: ["vô điều kiện", "Không có bất kỳ điều kiện nào."],
      zh: ["无条件地，盲目地", "没有任何条件或前提。"],
      ja: ["無条件に。むやみに", "何の条件や前提もなしに。"],
    },
  },
  현대인: {
    lemma: "현대인",
    pronunciation: "현대인",
    pos: "명사",
    grade: "중급",
    ko: "현대 사회를 살아가는 사람.",
    trans: {
      en: ["modern people", "People living in contemporary society."],
      vi: ["người hiện đại", "Những người sống trong xã hội hiện đại."],
      zh: ["现代人", "生活在现代社会的人。"],
      ja: ["現代人", "現代社会を生きている人々。"],
    },
  },
  일상: {
    lemma: "일상",
    pronunciation: "일쌍",
    pos: "명사",
    grade: "중급",
    ko: "날마다 반복되는 보통의 생활.",
    trans: {
      en: ["daily life; everyday routine", "Ordinary life repeated day after day."],
      vi: ["đời sống hằng ngày", "Cuộc sống bình thường lặp lại mỗi ngày."],
      zh: ["日常，日常生活", "每天重复的普通生活。"],
      ja: ["日常", "毎日繰り返される普通の生活。"],
    },
  },
  높아지다: {
    lemma: "높아지다",
    pronunciation: "노파지다",
    pos: "동사",
    grade: "초급",
    ko: "수준, 정도, 위치 등이 이전보다 더 높아지다.",
    trans: {
      en: ["rise; become higher; increase", "For a level, degree, or height to become higher."],
      vi: ["tăng cao, trở nên cao hơn", "Mức độ hoặc vị trí trở nên cao hơn trước."],
      zh: ["提高，升高", "水平、程度、位置等比以前更高。"],
      ja: ["高くなる。高まる", "水準や程度、位置などが以前より高くなる。"],
    },
  },
  필요하다: {
    lemma: "필요하다",
    pronunciation: "피료하다",
    pos: "형용사",
    grade: "초급",
    ko: "요구되는 바가 있다. 꼭 있어야 하다.",
    trans: {
      en: ["necessary; needed", "Required or essential."],
      vi: ["cần thiết", "Có nhu cầu hoặc nhất thiết phải có."],
      zh: ["需要，必要", "有所要求或不可缺少。"],
      ja: ["必要だ", "求められるところがある。必ずなければならない。"],
    },
  },
  지키다: {
    lemma: "지키다",
    pronunciation: "지키다",
    pos: "동사",
    grade: "초급",
    ko: "규칙·약속을 어기지 않고 따르거나, 재산·건강 등을 보호하여 유지하다.",
    trans: {
      en: ["protect; keep; maintain", "To protect health/safety or abide by rules/promises."],
      vi: ["giữ gìn, bảo vệ", "Bảo vệ và duy trì sức khỏe hoặc tuân thủ quy tắc."],
      zh: ["守护，遵守", "保护并维持健康，或遵守规则约定。"],
      ja: ["守る", "健康などを保護して維持する、または規則や約束を守る。"],
    },
  },
  자전거: {
    lemma: "자전거",
    pronunciation: "자전거",
    pos: "명사",
    grade: "초급",
    ko: "바퀴가 둘 달린 탈것으로 페달을 밟아 앞으로 가는 기구.",
    trans: {
      en: ["bicycle", "A two-wheeled vehicle driven by pedals."],
      vi: ["xe đạp", "Phương tiện hai bánh di chuyển bằng bàn đạp."],
      zh: ["自行车", "有两个轮子、通过踩踏板前进的交通工具。"],
      ja: ["自転車", "ペダルを踏んで走る二輪の乗り物。"],
    },
  },
  도로: {
    lemma: "도로",
    pronunciation: "도로",
    pos: "명사",
    grade: "초급",
    ko: "사람이나 차가 다니도록 만든 비교적 넓은 길.",
    trans: {
      en: ["road; path", "A path or street made for vehicles or people."],
      vi: ["đường phố, đường bộ", "Con đường rộng dành cho người hoặc xe cộ đi lại."],
      zh: ["道路", "供行人或车辆通行的较宽的路。"],
      ja: ["道路", "人や車が通るように作られた道。"],
    },
  },
  확대: {
    lemma: "확대",
    pronunciation: "확때",
    pos: "명사",
    grade: "중급",
    ko: "규모나 범위 등을 더 크게 넓힘.",
    trans: {
      en: ["expansion; enlargement", "Making the scale, scope, or size larger."],
      vi: ["sự mở rộng", "Làm cho quy mô hoặc phạm vi lớn hơn."],
      zh: ["扩大", "使规模或范围变得更大。"],
      ja: ["拡大", "規模や範囲などをより大きく広げること。"],
    },
  },
  출퇴근: {
    lemma: "출퇴근",
    pronunciation: "출퇴근",
    pos: "명사",
    grade: "중급",
    ko: "직장에 나가는 일과 근무를 마치고 집으로 돌아오는 일.",
    trans: {
      en: ["commuting (to and from work)", "Going to work and returning home."],
      vi: ["đi làm và tan làm", "Việc đi đến nơi làm việc và trở về nhà."],
      zh: ["上下班", "去上班和下班回家的往返。"],
      ja: ["通勤", "職場に出勤することと退勤すること。"],
    },
  },
  전자책: {
    lemma: "전자책",
    pronunciation: "전자책",
    pos: "명사",
    grade: "중급",
    ko: "종이 책의 내용을 디지털 데이터로 저장하여 컴퓨터나 스마트폰 등으로 읽을 수 있게 만든 책.",
    trans: {
      en: ["e-book", "A book published in digital form readable on screens."],
      vi: ["sách điện tử", "Sách ở dạng dữ liệu số đọc trên thiết bị điện tử."],
      zh: ["电子书", "以数字形式保存并在电子设备上阅读的书籍。"],
      ja: ["電子書籍", "デジタルデータとして画面で読めるようにした本。"],
    },
  },
  독서율: {
    lemma: "독서율",
    pronunciation: "독써율",
    pos: "명사",
    grade: "고급",
    ko: "전체 인구 중에서 일정 기간 동안 책을 읽은 사람의 비율.",
    trans: {
      en: ["reading rate; readership rate", "The proportion of people who read books within a period."],
      vi: ["tỷ lệ đọc sách", "Tỷ lệ người đọc sách trong tổng dân số."],
      zh: ["阅读率", "在一定时期内读书人数所占的比率。"],
      ja: ["読書率", "一定期間内に本を読んだ人の割合。"],
    },
  },
  공원: {
    lemma: "공원",
    pronunciation: "공원",
    pos: "명사",
    grade: "초급",
    ko: "여러 사람이 휴식이나 산책을 즐길 수 있도록 꾸며 놓은 정원이나 터.",
    trans: {
      en: ["park", "A public green area for rest and recreation."],
      vi: ["công viên", "Khuôn viên cây xanh dành cho mọi người nghỉ ngơi, dạo chơi."],
      zh: ["公园", "供大众休息或散步的公共园林场所。"],
      ja: ["公園", "人々が休息や散歩を楽しめるように整えられた場所。"],
    },
  },
  병원: {
    lemma: "병원",
    pronunciation: "병원",
    pos: "명사",
    grade: "초급",
    ko: "아픈 사람을 진찰하고 치료하는 의료 시설.",
    trans: {
      en: ["hospital; clinic", "A medical facility where sick people are examined and treated."],
      vi: ["bệnh viện", "Cơ sở y tế khám và điều trị cho người bệnh."],
      zh: ["医院", "诊治病人的医疗机构。"],
      ja: ["病院", "病気の人を診察・治療する医療施設。"],
    },
  },
  감기: {
    lemma: "감기",
    pronunciation: "감기",
    pos: "명사",
    grade: "초급",
    ko: "기침, 콧물, 열 등이 나는 가벼운 호흡기 질환.",
    trans: {
      en: ["common cold", "A mild respiratory illness with coughing, runny nose, or fever."],
      vi: ["cảm cúm, cảm lạnh", "Bệnh hô hấp nhẹ gây ho, sổ mũi, sốt."],
      zh: ["感冒", "伴有咳嗽、流鼻涕、发烧等症状的轻微呼吸道疾病。"],
      ja: ["風邪", "咳や鼻水、熱などが出る軽い呼吸器疾患。"],
    },
  },
  날씨: {
    lemma: "날씨",
    pronunciation: "날씨",
    pos: "명사",
    grade: "초급",
    ko: "그날그날의 기온, 비, 바람, 구름 등의 대기 상태.",
    trans: {
      en: ["weather", "Atmospheric conditions such as temperature, rain, and wind."],
      vi: ["thời tiết", "Trạng thái khí quyển như nhiệt độ, mưa, gió hằng ngày."],
      zh: ["天气", "每天的气温、雨、风、云等大气状况。"],
      ja: ["天気", "その日その日の気温や雨、風などの大気の状態。"],
    },
  },
  춥다: {
    lemma: "춥다",
    pronunciation: "춥따",
    pos: "형용사",
    grade: "초급",
    ko: "날씨나 기온이 낮아 서늘하거나 차갑다.",
    trans: {
      en: ["cold", "Having a low temperature (weather/air)."],
      vi: ["lạnh", "Thời tiết hoặc nhiệt độ thấp, rét."],
      zh: ["冷，寒冷", "天气或气温低而感到寒凉。"],
      ja: ["寒い", "気候や気温が低く冷たい。"],
    },
  },
  덥다: {
    lemma: "덥다",
    pronunciation: "덥따",
    pos: "형용사",
    grade: "초급",
    ko: "기온이 높아 열기가 느껴지다.",
    trans: {
      en: ["hot; warm", "Having a high temperature (weather/air)."],
      vi: ["nóng", "Nhiệt độ cao, cảm thấy oi bức."],
      zh: ["热，炎热", "气温高而感到热。"],
      ja: ["暑い", "気温が高く熱気を感じる。"],
    },
  },
  따뜻하다: {
    lemma: "따뜻하다",
    pronunciation: "따뜨타다",
    pos: "형용사",
    grade: "초급",
    ko: "기온이나 느낌이 춥지 않고 적당히 훈훈하다.",
    trans: {
      en: ["warm", "Pleasantly warm and cozy."],
      vi: ["ấm áp", "Không lạnh, có cảm giác ấm vừa phải."],
      zh: ["温暖，暖和", "不冷且温度适宜让人感到舒暖。"],
      ja: ["暖かい", "寒くなく適度にぬくもりがある。"],
    },
  },
  시설: {
    lemma: "시설",
    pronunciation: "시설",
    pos: "명사",
    grade: "초급",
    ko: "일정한 목적을 위해 설치한 건물, 설비, 장치 등.",
    trans: {
      en: ["facility; equipment", "Buildings, equipment, or installations built for a purpose."],
      vi: ["cơ sở vật chất, thiết bị", "Công trình, trang thiết bị lắp đặt cho mục đích nhất định."],
      zh: ["设施", "为特定目的建造的建筑物、设备或装置。"],
      ja: ["施設", "一定の目的のために設けられた建物や設備。"],
    },
  },
  수리: {
    lemma: "수리",
    pronunciation: "수리",
    pos: "명사",
    grade: "초급",
    ko: "고장 나거나 낡은 것을 고침.",
    trans: {
      en: ["repair; maintenance", "Fixing something broken or worn out."],
      vi: ["sửa chữa", "Việc sửa lại đồ đạc, thiết bị bị hỏng."],
      zh: ["修理，维修", "修理损坏或陈旧的物品。"],
      ja: ["修理", "壊れたり古くなったりしたものを直すこと。"],
    },
  },
  이용하다: {
    lemma: "이용하다",
    pronunciation: "이용하다",
    pos: "동사",
    grade: "초급",
    ko: "대상을 필요에 따라 이롭게 쓰다.",
    trans: {
      en: ["use; utilize", "To make use of a service, facility, or thing."],
      vi: ["sử dụng, tận dụng", "Dùng phương tiện, dịch vụ hoặc đồ vật theo nhu cầu."],
      zh: ["利用，使用", "根据需要有效使用某种设施或工具。"],
      ja: ["利用する", "対象を必要に応じて役立てて使う。"],
    },
  },
  자막: {
    lemma: "자막",
    pronunciation: "자막",
    pos: "명사",
    grade: "초급",
    ko: "영화나 방송 화면 아래에 대사나 설명을 글자로 나타내는 것.",
    trans: {
      en: ["subtitles; captions", "Text displayed on screen translating or transcribing dialogue."],
      vi: ["phụ đề", "Chữ hiển thị trên màn hình phim hoặc truyền hình."],
      zh: ["字幕", "显示在影视屏幕下方用于说明或翻译对白的文字。"],
      ja: ["字幕", "映画や放送画面にセリフや説明を文字で表示したもの。"],
    },
  },
  표현: {
    lemma: "표현",
    pronunciation: "표현",
    pos: "명사",
    grade: "초급",
    ko: "생각이나 느낌을 말, 글, 몸짓 등으로 겉으로 드러내어 나타냄.",
    trans: {
      en: ["expression", "Conveying thoughts or feelings through words, writing, or gestures."],
      vi: ["biểu hiện, cách diễn đạt", "Sự thể hiện suy nghĩ hoặc cảm xúc bằng lời nói, chữ viết."],
      zh: ["表达，表现", "将想法或感受通过语言、文字等表现出来。"],
      ja: ["表現", "考えや感情を言葉や文章、身振りなどで表すこと。"],
    },
  },
  어렵다: {
    lemma: "어렵다",
    pronunciation: "어렵따",
    pos: "형용사",
    grade: "초급",
    ko: "하기가 까다롭거나 힘들다.",
    trans: {
      en: ["difficult; hard", "Challenging or hard to do."],
      vi: ["khó khăn", "Khó thực hiện hoặc phức tạp."],
      zh: ["困难，难", "做起来费劲或复杂。"],
      ja: ["難しい", "行うのが大変である。"],
    },
  },
  수정하다: {
    lemma: "수정하다",
    pronunciation: "수정하다",
    pos: "동사",
    grade: "중급",
    ko: "잘못되거나 부족한 부분을 바로잡아 고치다.",
    trans: {
      en: ["revise; modify; edit", "To correct errors or update a draft/data."],
      vi: ["chỉnh sửa, sửa đổi", "Sửa lại những phần sai sót hoặc chưa đạt."],
      zh: ["修改，修正", "改正错误或不足之处。"],
      ja: ["修正する", "誤りや不十分な箇所を直して改める。"],
    },
  },
  출력하다: {
    lemma: "출력하다",
    pronunciation: "출려카다",
    pos: "동사",
    grade: "중급",
    ko: "컴퓨터에 저장된 문서나 그림을 프린터로 인쇄하여 내보내다.",
    trans: {
      en: ["print out; output", "To print a digital document or output data."],
      vi: ["in ấn, xuất dữ liệu", "In tài liệu từ máy tính ra giấy."],
      zh: ["打印输出", "将电脑中的文件或图表通过打印机输出。"],
      ja: ["出力する。プリントアウトする", "コンピューターの文書や画像を印刷して出す。"],
    },
  },
  비치하다: {
    lemma: "비치하다",
    pronunciation: "비치하다",
    pos: "동사",
    grade: "중급",
    ko: "필요할 때 쓸 수 있도록 일정한 곳에 미리 갖추어 두다.",
    trans: {
      en: ["place; furnish; stock", "To set out or equip items in a designated place for use."],
      vi: ["bố trí, đặt sẵn", "Chuẩn bị và đặt sẵn ở một nơi để tiện sử dụng."],
      zh: ["配备，放置", "预先把所需物品放置在固定位置以供使用。"],
      ja: ["備え付ける", "必要な時に使えるよう一定の場所に置いておく。"],
    },
  },
  재방문율: {
    lemma: "재방문율",
    pronunciation: "재방문뉼",
    pos: "명사",
    grade: "고급",
    ko: "한 번 방문한 고객이 다시 찾아오는 비율.",
    trans: {
      en: ["revisit rate; retention rate", "The percentage of visitors who return again."],
      vi: ["tỷ lệ quay lại", "Tỷ lệ khách hàng quay trở lại sau lần đầu đến thăm."],
      zh: ["回头率，复访率", "顾客首次光顾后再次访问的比率。"],
      ja: ["再訪問率。リピート率", "一度訪れた顧客が再び訪れる割合。"],
    },
  },
  정체되다: {
    lemma: "정체되다",
    pronunciation: "정체되다",
    pos: "동사",
    grade: "고급",
    ko: "발전이나 진행이 제자리에 머물러 나아가지 못하다.",
    trans: {
      en: ["stagnate", "To remain stuck without progress or growth."],
      vi: ["bị đình trệ", "Giậm chân tại chỗ, không tiến triển thêm."],
      zh: ["停滞", "停止不前，没有发展或进展。"],
      ja: ["停滞する", "発展や進行が同じ場所にとどまって進まない。"],
    },
  },
  분석하다: {
    lemma: "분석하다",
    pronunciation: "분서카다",
    pos: "동사",
    grade: "중급",
    ko: "복잡한 대상이나 자료를 여러 요소로 나누어 자세히 살피다.",
    trans: {
      en: ["analyze", "To examine data or phenomena in detail by breaking them down."],
      vi: ["phân tích", "Chia nhỏ đối tượng hoặc dữ liệu để xem xét kỹ lưỡng."],
      zh: ["分析", "将复杂对象或资料分解并仔细研究。"],
      ja: ["分析する", "対象や資料を要素に分けて詳しく調べる。"],
    },
  },
  개선하다: {
    lemma: "개선하다",
    pronunciation: "개선하다",
    pos: "동사",
    grade: "중급",
    ko: "잘못된 점이나 부족한 부분을 고쳐 더 좋게 만들다.",
    trans: {
      en: ["improve; ameliorate", "To fix shortcomings and make something better."],
      vi: ["cải thiện", "Sửa đổi khuyết điểm để trở nên tốt hơn."],
      zh: ["改善，改进", "修改缺点或不足使之变得更好。"],
      ja: ["改善する", "悪い点や不足した部分を直してより良くする。"],
    },
  },
  보존하다: {
    lemma: "보존하다",
    pronunciation: "보존하다",
    pos: "동사",
    grade: "고급",
    ko: "원래의 상태나 가치가 훼손되지 않도록 잘 보호하여 남기다.",
    trans: {
      en: ["preserve; conserve", "To protect and keep something intact without damage."],
      vi: ["bảo tồn", "Giữ gìn nguyên vẹn không để bị hư hại."],
      zh: ["保存，保护", "妥善保护使其原有状态或价值不被破坏。"],
      ja: ["保存する", "元の状態や価値が損なわれないよう大切に守り残す。"],
    },
  },
  정체성: {
    lemma: "정체성",
    pronunciation: "정체썽",
    pos: "명사",
    grade: "고급",
    ko: "변하지 않는 존재의 본질이나 고유한 특성.",
    trans: {
      en: ["identity", "The distinctive essence or unique character of something."],
      vi: ["bản sắc", "Bản chất không đổi hoặc đặc trưng riêng biệt."],
      zh: ["本质，独特性，认同感", "事物不变的本质或固有特征。"],
      ja: ["アイデンティティ。独自性", "変わらない存在の本質や固有の特性。"],
    },
  },
  혼잡하다: {
    lemma: "혼잡하다",
    pronunciation: "혼자파다",
    pos: "형용사",
    grade: "중급",
    ko: "사람이나 차량이 한꺼번에 많이 몰려 어수선하고 복잡하다.",
    trans: {
      en: ["congested; crowded", "Heavily packed with traffic or people."],
      vi: ["đông đúc, ùn tắc", "Nhiều người hoặc xe cộ dồn lại gây lộn xộn."],
      zh: ["拥挤，混乱", "人或车辆聚集而拥堵杂乱。"],
      ja: ["混雑している", "人や車が多く集まって混み合っている。"],
    },
  },
  자가용: {
    lemma: "자가용",
    pronunciation: "자가용",
    pos: "명사",
    grade: "중급",
    ko: "개인이 직접 소유하여 타고 다니는 자동차.",
    trans: {
      en: ["private car; personal vehicle", "A car owned and driven by an individual."],
      vi: ["xe hơi riêng", "Ô tô thuộc sở hữu cá nhân dùng để đi lại."],
      zh: ["私家车", "个人拥有并驾驶的汽车。"],
      ja: ["自家用車", "個人が所有して乗る自動車。"],
    },
  },
  제자리걸음: {
    lemma: "제자리걸음",
    pronunciation: "제자리거름",
    pos: "명사",
    grade: "고급",
    ko: "앞으로 나아가지 못하고 그 자리에 머물러 있는 상태.",
    trans: {
      en: ["marking time; stagnation", "Remaining in the same place without advancing."],
      vi: ["giậm chân tại chỗ", "Trạng thái không tiến triển mà đứng yên một chỗ."],
      zh: ["原地踏步", "没有向前发展而停留在原地。"],
      ja: ["足踏み", "前に進まず同じ場所にとどまっている状態。"],
    },
  },
  상권: {
    lemma: "상권",
    pronunciation: "상꿘",
    pos: "명사",
    grade: "고급",
    ko: "상업 활동이 이루어지는 지역적 범위.",
    trans: {
      en: ["commercial district; trade area", "A geographical area of business and retail activity."],
      vi: ["khu thương mại", "Phạm vi khu vực diễn ra các hoạt động buôn bán."],
      zh: ["商圈", "开展商业活动的地域范围。"],
      ja: ["商圏", "商業活動が行われる地域的範囲。"],
    },
  },
  반려동물: {
    lemma: "반려동물",
    pronunciation: "발려동물",
    pos: "명사",
    grade: "중급",
    ko: "사람이 정서적으로 의지하며 함께 살아가는 동물.",
    trans: {
      en: ["companion animal; pet", "An animal kept for companionship."],
      vi: ["thú cưng, vật nuôi", "Động vật sống cùng và gắn bó tình cảm với con người."],
      zh: ["伴侣动物，宠物", "与人类共同生活并带来情感陪伴的动物。"],
      ja: ["伴侶動物。ペット", "人が精神的に寄り添いながら共に暮らす動物。"],
    },
  },
  양육: {
    lemma: "양육",
    pronunciation: "양뉵",
    pos: "명사",
    grade: "고급",
    ko: "아이나 동물을 보살펴 기름.",
    trans: {
      en: ["raising; nurturing; rearing", "Caring for and raising children or animals."],
      vi: ["nuôi dưỡng", "Chăm sóc và nuôi nấng trẻ em hoặc động vật."],
      zh: ["养育，饲养", "照料并抚养孩子或动物。"],
      ja: ["養育", "子どもや動物を世話して育てること。"],
    },
  },
  허위: {
    lemma: "허위",
    pronunciation: "허위",
    pos: "명사",
    grade: "고급",
    ko: "사실이 아닌 거짓.",
    trans: {
      en: ["falsehood; fabrication", "Something untrue or fabricated."],
      vi: ["giả mạo, sai sự thật", "Điều không đúng sự thật, giả dối."],
      zh: ["虚假，虚伪", "并非事实的假话或伪造内容。"],
      ja: ["虚偽", "事実ではない嘘や偽り。"],
    },
  },
  확증편향: {
    lemma: "확증 편향",
    pronunciation: "확쯩 편향",
    pos: "명사",
    grade: "고급",
    ko: "자신의 신념이나 선입견과 일치하는 정보만 받아들이고 반대되는 정보는 무시하는 경향.",
    trans: {
      en: ["confirmation bias", "The tendency to favor information confirming one's existing beliefs."],
      vi: ["thiên kiến xác nhận", "Xu hướng chỉ tin vào thông tin phù hợp với định kiến sẵn có."],
      zh: ["确认偏误", "只接受符合自身既有观点的信息而忽视相反证据的心理倾向。"],
      ja: ["確証バイアス", "自分の信念に合う情報だけを受け入れ、反する情報を無視する傾向。"],
    },
  },
  비판적: {
    lemma: "비판적",
    pronunciation: "비판쩍",
    pos: "관형사/명사",
    grade: "고급",
    ko: "사물이나 정보의 옳고 그름을 따져 가려내는 태도를 지닌 것.",
    trans: {
      en: ["critical", "Evaluating the validity and truth of claims carefully."],
      vi: ["mang tính phản biện", "Thái độ xem xét, đánh giá đúng sai một cách khách quan."],
      zh: ["批判性的", "仔细甄别事物或信息是非曲直的态度。"],
      ja: ["批判的", "物事や情報の是非を見極めようとする態度。"],
    },
  },
  검증하다: {
    lemma: "검증하다",
    pronunciation: "검증하다",
    pos: "동사",
    grade: "고급",
    ko: "어떤 사실이나 진위를 정확히 검사하여 증명하다.",
    trans: {
      en: ["verify; fact-check", "To examine and confirm the truth or accuracy of something."],
      vi: ["kiểm chứng", "Kiểm tra chính xác tính đúng sai của một sự thật."],
      zh: ["验证，核查", "准确检查并证明某事实的真伪。"],
      ja: ["検証する", "ある事実や真偽を正確に調べて証明する。"],
    },
  },
  시급하다: {
    lemma: "시급하다",
    pronunciation: "시그파다",
    pos: "형용사",
    grade: "고급",
    ko: "시간이 촉박하여 당장 해결하거나 처리해야 할 정도로 급하다.",
    trans: {
      en: ["urgent; pressing", "Requiring immediate action or solution."],
      vi: ["cấp bách, khẩn cấp", "Rất gấp, cần giải quyết ngay lập tức."],
      zh: ["紧迫，迫在眉睫", "时间紧迫、急需立刻解决。"],
      ja: ["差し迫っている。急務だ", "すぐに対処しなければならないほど急を要する。"],
    },
  },
  재해석: {
    lemma: "재해석",
    pronunciation: "재해석",
    pos: "명사",
    grade: "고급",
    ko: "이미 있던 해석을 새로운 관점이나 맥락에서 다시 해석함.",
    trans: {
      en: ["reinterpretation", "Interpreting something anew from a fresh perspective."],
      vi: ["tái diễn giải", "Giải thích lại theo góc nhìn hoặc bối cảnh mới."],
      zh: ["重新诠释", "从新的视角或背景出发再次解读。"],
      ja: ["再解釈", "新しい視点や文脈から捉え直すこと。"],
    },
  },
  식물: {
    lemma: "식물",
    pronunciation: "싱물",
    pos: "명사",
    grade: "초급",
    ko: "잎·줄기·뿌리를 가지고 광합성을 하며 살아가는 생물.",
    trans: {
      en: ["plant", "A living organism such as trees, flowers, or grass."],
      vi: ["thực vật, cây cối", "Sinh vật có rễ, thân, lá như cây hoa."],
      zh: ["植物", "具有根茎叶并能进行光合作用的生物。"],
      ja: ["植物", "葉や茎、根を持ち光合成をして生きる生物。"],
    },
  },
  뿌리: {
    lemma: "뿌리",
    pronunciation: "뿌리",
    pos: "명사",
    grade: "중급",
    ko: "식물의 땅속에 묻혀 수분과 양분을 빨아들이는 부분.",
    trans: {
      en: ["root", "The underground part of a plant absorbing water and nutrients."],
      vi: ["rễ cây", "Bộ phận dưới đất của cây hút nước và chất dinh dưỡng."],
      zh: ["根，根部", "植物埋在地下吸收水分和养分的部分。"],
      ja: ["根", "植物の地中にあって水分や養分を吸い上げる部分。"],
    },
  },
  썩다: {
    lemma: "썩다",
    pronunciation: "썩따",
    pos: "동사",
    grade: "중급",
    ko: "유기물이 세균이나 습기 때문에 상하여 못 쓰게 되다.",
    trans: {
      en: ["rot; decay", "To decompose or spoil due to moisture or bacteria."],
      vi: ["bị thối, mục nát", "Bị hư hỏng, phân hủy do ẩm ướt hoặc vi khuẩn."],
      zh: ["腐烂", "因受潮或细菌作用而变质坏掉。"],
      ja: ["腐る", "水分や細菌などのせいで傷んで駄目になる。"],
    },
  },
  규모: {
    lemma: "규모",
    pronunciation: "규모",
    pos: "명사",
    grade: "중급",
    ko: "사물이나 현상의 크기나 범위.",
    trans: {
      en: ["scale; size", "The size, scope, or extent of something."],
      vi: ["quy mô", "Kích thước hoặc phạm vi của sự vật, hiện tượng."],
      zh: ["规模", "事物或现象的大小或范围。"],
      ja: ["規模", "物事や現象の大きさや範囲。"],
    },
  },
  가구: {
    lemma: "가구",
    pronunciation: "가구",
    pos: "명사",
    grade: "중급",
    ko: "생계를 같이하는 가족이나 사람의 집단(세대). 또는 집안에서 쓰는 기구.",
    trans: {
      en: ["household; furniture", "A family/residential unit, or household furniture."],
      vi: ["hộ gia đình", "Đơn vị gia đình cùng sinh sống."],
      zh: ["家庭（户），家具", "共同生活的家庭单位，或室内用具。"],
      ja: ["世帯。家具", "生計を共にする家族単位、または家で使う道具。"],
    },
  },
  감소하다: {
    lemma: "감소하다",
    pronunciation: "감소하다",
    pos: "동사",
    grade: "중급",
    ko: "양이나 수치가 줄어들다.",
    trans: {
      en: ["decrease; decline", "To become smaller in amount or number."],
      vi: ["giảm xuống", "Số lượng hoặc tỷ lệ trở nên ít đi."],
      zh: ["减少，下降", "数量或数值变小。"],
      ja: ["減少する", "量や数値が減る。"],
    },
  },
  고령화: {
    lemma: "고령화",
    pronunciation: "고령화",
    pos: "명사",
    grade: "고급",
    ko: "전체 인구 가운데 노인 인구가 차지하는 비율이 점점 높아지는 현상.",
    trans: {
      en: ["aging (of population)", "The increasing proportion of elderly people in a society."],
      vi: ["già hóa dân số", "Hiện tượng tỷ lệ người cao tuổi trong dân số ngày càng tăng."],
      zh: ["老龄化", "总人口中老年人口所占比例不断上升的现象。"],
      ja: ["高齢化", "総人口に占める高齢者人口の割合が高くなる現象。"],
    },
  },
  풍요: {
    lemma: "풍요",
    pronunciation: "풍요",
    pos: "명사",
    grade: "고급",
    ko: "물질이나 정신적인 면이 넉넉하고 풍족함.",
    trans: {
      en: ["abundance; affluence", "Having plenty of material or spiritual wealth."],
      vi: ["sự sung túc, phong phú", "Sự đầy đủ, dư dả về vật chất hoặc tinh thần."],
      zh: ["富足，丰饶", "物质或精神方面充裕丰富。"],
      ja: ["豊かさ。富裕", "物質的・精神的に満ち足りて豊かなこと。"],
    },
  },
  행복지수: {
    lemma: "행복지수",
    pronunciation: "행복지쑤",
    pos: "명사",
    grade: "중급",
    ko: "사람들이 느끼는 행복의 정도를 수치로 나타낸 지표.",
    trans: {
      en: ["happiness index", "An indicator measuring the level of perceived happiness."],
      vi: ["chỉ số hạnh phúc", "Chỉ số đo lường mức độ hạnh phúc của con người."],
      zh: ["幸福指数", "以数值表示人们感受到的幸福程度的指标。"],
      ja: ["幸福指数", "人々が感じる幸福の度合いを数値で表した指標。"],
    },
  },
  확충하다: {
    lemma: "확충하다",
    pronunciation: "확충하다",
    pos: "동사",
    grade: "고급",
    ko: "시설, 제도, 인력 등을 늘려 튼튼하게 채우다.",
    trans: {
      en: ["expand and strengthen", "To expand and reinforce facilities, systems, or resources."],
      vi: ["mở rộng và củng cố", "Tăng cường và bổ sung cơ sở hạ tầng hoặc hệ thống."],
      zh: ["扩充", "扩大并充实设施、制度或人力等。"],
      ja: ["拡充する", "施設や制度などを広げて充実させる。"],
    },
  },
};
