"""
Comprehensive TOPIK I & II Study Dataset (Levels 1-6)
Compiled from official NIIED TOPIK past exam patterns (60th, 64th, 83rd, 91st),
NIKL Korean Learners' Dictionary (한국어기초사전) vocabulary grades,
essential grammar patterns, idioms/proverbs, writing templates, and YouTube study resources.
"""

from typing import Any, Dict, List

# ==============================================================================
# 1. MASSIVE QUESTION BANK (TOPIK I 1~2급 & TOPIK II 3~6급: 듣기 / 읽기 / 쓰기)
# ==============================================================================
QUESTION_BANK: List[Dict[str, Any]] = [
    # --------------------------------------------------------------------------
    # [TOPIK I - 1급~2급] LISTENING (듣기)
    # --------------------------------------------------------------------------
    {
        "question_id": "00000000-0000-0000-0001-000000000001",
        "exam_type": "TOPIK_I",
        "section_name": "LISTENING",
        "question_number": 1,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 1,
        "target_levels": [1, 2],
        "score_points": 4.0,
        "audio_url": "TTS_SUPPORTED",
        "passage_text": (
            "[듣기 대본 - 제91회 TOPIK I 유형]\n"
            "여자: 민수 씨, 주말에 보통 뭐 해요?\n"
            "남자: 저는 주말에 공원에서 자전거를 타거나 친구하고 축구를 해요."
        ),
        "prompt_text": "[듣기 1급] 다음 대화를 듣고 이어질 말이나 내용과 일치하는 것을 고르십시오. (음성 재생 버튼을 눌러 들으세요)",
        "correct_answer_text": "2",
        "options": [
            {"option_number": 1, "option_text": "남자는 주말에 집에서 영화를 봅니다."},
            {"option_number": 2, "option_text": "남자는 주말에 공원에서 운동을 합니다."},
            {"option_number": 3, "option_text": "여자는 주말에 자전거를 배웁니다."},
            {"option_number": 4, "option_text": "두 사람은 지금 공원에서 축구를 합니다."},
        ],
        "explanations": {
            "ko": "남자는 주말에 공원에서 자전거를 타거나 축구를 한다고 했으므로 '공원에서 운동을 합니다'가 정답입니다.",
            "en": "The man says he rides a bicycle or plays soccer in the park on weekends, which means he exercises in the park.",
            "vi": "Người đàn ông nói cuối tuần thường đạp xe hoặc đá bóng ở công viên, tức là tập thể dục ở công viên.",
            "zh": "男士说周末通常在公园骑自行车或和朋友踢足球，因此正确答案是在公园运动。",
            "ja": "男の人は週末に公園で自転車に乗ったりサッカーをしたりすると言ったので、「公園で運動をします」が正解です。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0001-000000000002",
        "exam_type": "TOPIK_I",
        "section_name": "LISTENING",
        "question_number": 5,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 1,
        "target_levels": [1, 2],
        "score_points": 4.0,
        "audio_url": "TTS_SUPPORTED",
        "passage_text": (
            "[듣기 대본 - 장소 추론 유형]\n"
            "남자: 어서 오세요. 어디가 아파서 오셨어요?\n"
            "여자: 어제부터 목이 많이 아프고 열이 조금 나요.\n"
            "남자: 네, 입을 크게 벌려 보세요. 감기니까 주사 맞고 약 드시면 금방 나을 거예요."
        ),
        "prompt_text": "[듣기 1급] 여기는 어디입니까? 알맞은 것을 고르십시오.",
        "correct_answer_text": "3",
        "options": [
            {"option_number": 1, "option_text": "약국"},
            {"option_number": 2, "option_text": "우체국"},
            {"option_number": 3, "option_text": "병원"},
            {"option_number": 4, "option_text": "도서관"},
        ],
        "explanations": {
            "ko": "'어디가 아파서 오셨어요?', '입을 크게 벌려 보세요', '주사 맞고 약 드시면'이라는 진찰 표현을 통해 이곳이 '병원'임을 알 수 있습니다.",
            "en": "Expressions like 'Where does it hurt?', 'Open your mouth wide', and 'get an injection' indicate a hospital/clinic.",
            "vi": "Các câu hỏi khám bệnh và tiêm thuốc cho thấy đây là bệnh viện (병원).",
            "zh": "通过询问病情、张开嘴检查、打针吃药等表达，可以判断这里是医院（병원）。",
            "ja": "診察の会話（「どこが痛いですか」「注射を打って薬を飲めば」）から、ここが「病院」であることが分かります。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0001-000000000003",
        "exam_type": "TOPIK_I",
        "section_name": "LISTENING",
        "question_number": 10,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 2,
        "target_levels": [1, 2],
        "score_points": 4.0,
        "audio_url": "TTS_SUPPORTED",
        "passage_text": (
            "[듣기 대본 - 대화 후 이어질 행동 유형]\n"
            "여자: 수진 씨 생일 선물을 아직 못 샀는데 같이 백화점에 갈래요?\n"
            "남자: 좋아요. 그런데 제가 지금 도서관에 책을 반납해야 해요. 반납하고 바로 백화점 앞으로 갈게요.\n"
            "여자: 그래요. 그럼 저는 먼저 커피숍에서 기다리고 있을게요."
        ),
        "prompt_text": "[듣기 2급] 대화가 끝난 뒤에 남자가 이어서 할 행동으로 알맞은 것을 고르십시오.",
        "correct_answer_text": "1",
        "options": [
            {"option_number": 1, "option_text": "도서관에 가서 책을 돌려준다."},
            {"option_number": 2, "option_text": "커피숍에 가서 여자를 만난다."},
            {"option_number": 3, "option_text": "백화점에서 혼자 선물을 고른다."},
            {"option_number": 4, "option_text": "수진 씨에게 생일 축하 전화를 한다."},
        ],
        "explanations": {
            "ko": "남자는 '제가 지금 도서관에 책을 반납해야 해요. 반납하고 바로 백화점 앞으로 갈게요'라고 했으므로 대화 직후 도서관에 가서 책을 반납합니다.",
            "en": "The man says 'I have to return a book to the library right now', so he will return the book at the library first.",
            "vi": "Người đàn ông nói bây giờ phải đi trả sách ở thư viện trước rồi mới đến bách hóa.",
            "zh": "男士说现在得先去图书馆还书，因此对话结束后男士接下来会去图书馆还书。",
            "ja": "男の人は「今図書館に本を返却しなければなりません」と言ったので、まず図書館へ行って本を返します。",
        },
    },

    # --------------------------------------------------------------------------
    # [TOPIK I - 1급~2급] READING (읽기)
    # --------------------------------------------------------------------------
    {
        "question_id": "00000000-0000-0000-0001-000000000004",
        "exam_type": "TOPIK_I",
        "section_name": "READING",
        "question_number": 3,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 1,
        "target_levels": [1, 2],
        "score_points": 3.0,
        "audio_url": None,
        "passage_text": (
            "어제는 날씨가 아주 ( ㉠ ). 그래서 따뜻한 옷을 입고 밖에 나갔습니다."
        ),
        "prompt_text": "[읽기 1급] 빈칸 ( ㉠ )에 들어갈 가장 알맞은 것을 고르십시오.",
        "correct_answer_text": "2",
        "options": [
            {"option_number": 1, "option_text": "더웠습니다"},
            {"option_number": 2, "option_text": "추웠습니다"},
            {"option_number": 3, "option_text": "비쌌습니다"},
            {"option_number": 4, "option_text": "가까웠습니다"},
        ],
        "explanations": {
            "ko": "뒤 문장에서 '따뜻한 옷을 입고 밖에 나갔습니다'라고 했으므로 날씨가 '추웠습니다'가 가장 자연스럽습니다.",
            "en": "Since the speaker wore warm clothes to go outside, the weather must have been cold ('추웠습니다').",
            "vi": "Câu sau nói 'mặc áo ấm ra ngoài', nên thời tiết hôm qua rất lạnh ('추웠습니다').",
            "zh": "后一句说“穿着暖和的衣服出门了”，因此天气非常冷（추웠습니다）。",
            "ja": "後ろの文で「暖かい服を着て外に出ました」と言っているので、天気が「寒かったです（추웠습니다）」が正解です。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0001-000000000005",
        "exam_type": "TOPIK_I",
        "section_name": "READING",
        "question_number": 12,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 2,
        "target_levels": [1, 2],
        "score_points": 3.0,
        "audio_url": None,
        "passage_text": (
            "[인주시립도서관 휴관 안내]\n"
            "도서관 시설 수리와 청소 때문에 이번 주 금요일(11월 15일) 하루 동안 문을 닫습니다.\n"
            "빌린 책을 반납하실 분은 도서관 입구 옆의 무인 반납함을 이용해 주시기 바랍니다.\n"
            "토요일부터는 평소처럼 오전 9시에서 오후 8시까지 이용하실 수 있습니다."
        ),
        "prompt_text": "[읽기 2급] 다음 안내문의 내용과 같은 것을 고르십시오.",
        "correct_answer_text": "3",
        "options": [
            {"option_number": 1, "option_text": "이번 주 주말에는 도서관 문을 닫습니다."},
            {"option_number": 2, "option_text": "금요일에는 빌린 책을 반납할 수 없습니다."},
            {"option_number": 3, "option_text": "금요일에는 시설 수리 때문에 도서관을 쉬게 됩니다."},
            {"option_number": 4, "option_text": "토요일에는 오후 6시까지 도서관을 이용할 수 있습니다."},
        ],
        "explanations": {
            "ko": "안내문 첫 문장에 '도서관 시설 수리와 청소 때문에 이번 주 금요일 하루 동안 문을 닫습니다'라고 명시되어 있으므로 3번이 정답입니다.",
            "en": "The notice states the library will close on Friday for facility repairs and cleaning.",
            "vi": "Thông báo nêu rõ thứ Sáu thư viện đóng cửa để sửa chữa cơ sở vật chất và dọn dẹp.",
            "zh": "通知第一句明确说明因为设施维修和打扫，本周五闭馆一天。",
            "ja": "案内文に「施設の修理と掃除のため今週の金曜日一日休館します」と書かれているため、3番が正解です。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0001-000000000006",
        "exam_type": "TOPIK_I",
        "section_name": "READING",
        "question_number": 20,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 2,
        "target_levels": [1, 2],
        "score_points": 4.0,
        "audio_url": None,
        "passage_text": (
            "저는 한국 드라마를 보면서 한국어에 관심을 가지게 되었습니다. "
            "처음에는 자막 없이 드라마를 보는 것이 ( ㉠ ) 지금은 자주 나오는 표현을 많이 알아듣습니다. "
            "내년에는 한국에 직접 여행을 가서 한국 사람들과 이야기해 보고 싶습니다."
        ),
        "prompt_text": "[읽기 2급] 빈칸 ( ㉠ )에 들어갈 가장 알맞은 표현을 고르십시오.",
        "correct_answer_text": "1",
        "options": [
            {"option_number": 1, "option_text": "어려웠지만"},
            {"option_number": 2, "option_text": "어려우니까"},
            {"option_number": 3, "option_text": "어려워서"},
            {"option_number": 4, "option_text": "어려우려고"},
        ],
        "explanations": {
            "ko": "'처음에는 자막 없이 보는 것이 어려웠다'와 '지금은 많이 알아듣는다'가 서로 대조되므로 대조 연결어미 '-았/었지만'(어려웠지만)이 알맞습니다.",
            "en": "The first clause ('it was difficult at first') contrasts with the second ('now I understand a lot'), requiring '-았/었지만' ('어려웠지만').",
            "vi": "Vế trước ('lúc đầu khó') tương phản với vế sau ('bây giờ nghe hiểu nhiều'), nên dùng '-았/었지만' (어려웠지만).",
            "zh": "前句“起初很困难”与后句“现在能听懂很多”形成转折关系，因此应选表转折的“어려웠지만”。",
            "ja": "「最初は難しかった」と「今はよく聞き取れる」が対比されているため、逆接の「어려웠지만」が正解です。",
        },
    },

    # --------------------------------------------------------------------------
    # [TOPIK II - 3급~6급] LISTENING (듣기)
    # --------------------------------------------------------------------------
    {
        "question_id": "00000000-0000-0000-0002-000000000001",
        "exam_type": "TOPIK_II",
        "section_name": "LISTENING",
        "question_number": 9,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 3,
        "target_levels": [3, 4],
        "score_points": 2.0,
        "audio_url": "TTS_SUPPORTED",
        "passage_text": (
            "[듣기 대본 - 제83회·91회 중급 업무 대화 유형]\n"
            "여자: 김 대리님, 다음 주에 있을 신제품 설명회 발표 자료는 다 준비되었나요?\n"
            "남자: 네, 자료 작성은 끝났는데 설문 조사 통계 그래프가 조금 복잡해 보여서 수정하고 있습니다.\n"
            "여자: 그래요? 그럼 그래프 수정이 끝나는 대로 출력해서 회의실에 먼저 비치해 주세요. 저는 안내 배너가 도착했는지 확인해 볼게요."
        ),
        "prompt_text": "[듣기 3~4급] 남자가 이어서 할 행동으로 알맞은 것을 고르십시오.",
        "correct_answer_text": "2",
        "options": [
            {"option_number": 1, "option_text": "신제품 설문 조사를 새로 실시한다."},
            {"option_number": 2, "option_text": "발표 자료의 그래프를 고쳐서 인쇄한다."},
            {"option_number": 3, "option_text": "안내 배너가 도착했는지 업체에 전화한다."},
            {"option_number": 4, "option_text": "회의실 예약을 다른 날짜로 변경한다."},
        ],
        "explanations": {
            "ko": "남자는 현재 설문 조사 통계 그래프를 수정하고 있으며, 여자가 수정이 끝나는 대로 출력(인쇄)해 달라고 요청했으므로 2번이 정답입니다.",
            "en": "The man is currently revising the statistical graph in the presentation and was asked to print it once finished.",
            "vi": "Người đàn ông đang sửa biểu đồ thống kê trong tài liệu thuyết trình và sẽ in ra sau khi sửa xong.",
            "zh": "男士正在修改演示资料中的统计图表，修改完后需要打印出来放到会议室。",
            "ja": "男の人は発表資料の統計グラフを修正しており、終わったら印刷して会議室に置くよう頼まれたので2番が正解です。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0002-000000000002",
        "exam_type": "TOPIK_II",
        "section_name": "LISTENING",
        "question_number": 21,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 4,
        "target_levels": [3, 4, 5],
        "score_points": 2.0,
        "audio_url": "TTS_SUPPORTED",
        "passage_text": (
            "[듣기 대본 - 제64회 기출 변형 (서비스 만족도 인터뷰)]\n"
            "남자: 최근 저희 호텔을 찾는 고객 수는 늘었는데 재방문율은 오히려 정체되어 있어서 걱정입니다.\n"
            "여자: 맞아요. 시설을 새로 단장하는 것도 중요하지만, 무엇보다 고객들이 남긴 이용 후기를 꼼꼼히 분석해 볼 필요가 있어요. 불만 사항이 무엇인지 정확히 파악해야 맞춤형 서비스를 개선할 수 있거든요.\n"
            "남자: 일리가 있네요. 이번 주 마케팅 회의에서 최근 6개월간의 고객 후기 데이터부터 정리해 봅시다."
        ),
        "prompt_text": "[듣기 4급] 여자의 중심 생각으로 가장 알맞은 것을 고르십시오.",
        "correct_answer_text": "4",
        "options": [
            {"option_number": 1, "option_text": "호텔 시설을 최신식으로 빠르게 개조해야 한다."},
            {"option_number": 2, "option_text": "신규 고객을 유치하기 위한 할인 행사를 늘려야 한다."},
            {"option_number": 3, "option_text": "고객들이 이용 후기를 많이 작성하도록 유도해야 한다."},
            {"option_number": 4, "option_text": "서비스 개선을 위해 고객의 이용 후기를 적극적으로 분석해야 한다."},
        ],
        "explanations": {
            "ko": "여자는 '무엇보다 고객들이 남긴 이용 후기를 꼼꼼히 분석해 볼 필요가 있어요'라며 후기 분석을 통한 맞춤형 서비스 개선을 강조하고 있습니다.",
            "en": "The woman emphasizes carefully analyzing customer reviews to identify complaints and improve tailored services.",
            "vi": "Người phụ nữ nhấn mạnh cần phân tích kỹ đánh giá của khách hàng để cải thiện dịch vụ.",
            "zh": "女士强调最重要的是仔细分析顾客留下的评价，准确掌握不满事项以改善服务。",
            "ja": "女の人は「何より顧客が残した利用レビューを綿密に分析する必要がある」と強調しているため、4番が正解です。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0002-000000000003",
        "exam_type": "TOPIK_II",
        "section_name": "LISTENING",
        "question_number": 37,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 5,
        "target_levels": [5, 6],
        "score_points": 2.0,
        "audio_url": "TTS_SUPPORTED",
        "passage_text": (
            "[듣기 대본 - 고급 교양 강연 유형]\n"
            "여자(강연자): 흔히 도시 재생 사업이라고 하면 낡은 건물을 허물고 고층 빌딩을 새로 짓는 재개발을 떠올리기 쉽습니다. "
            "그러나 최근 주목받는 도시 재생은 기존 골목길의 역사적 맥락과 지역 공동체의 문화를 보존하면서 낙후된 기반 시설만 현대화하는 방식으로 진화하고 있습니다. "
            "원주민들이 삶의 터전을 잃고 내몰리는 부작용을 막고, 그 지역만의 고유한 정체성을 살려 지속 가능한 활력을 불어넣는 것이 진정한 도시 재생의 핵심이기 때문입니다."
        ),
        "prompt_text": "[듣기 5~6급] 강연의 중심 내용으로 가장 알맞은 것을 고르십시오.",
        "correct_answer_text": "3",
        "options": [
            {"option_number": 1, "option_text": "도시의 경쟁력을 높이기 위해 고층 빌딩 건립을 확대해야 한다."},
            {"option_number": 2, "option_text": "역사적 가치가 있는 건물은 일체의 보수 없이 원형 그대로 두어야 한다."},
            {"option_number": 3, "option_text": "도시 재생은 지역의 고유한 문화와 공동체를 보존하는 방향으로 이루어져야 한다."},
            {"option_number": 4, "option_text": "원주민의 이주를 지원하는 재정적 보상 제도를 우선적으로 마련해야 한다."},
        ],
        "explanations": {
            "ko": "강연자는 건물을 모두 허무는 재개발 대신 '역사적 맥락과 지역 공동체의 문화를 보존하면서 고유한 정체성을 살리는 것'이 도시 재생의 핵심이라고 역설하고 있습니다.",
            "en": "The speaker argues that true urban regeneration preserves local culture, historical context, and community identity rather than demolishing everything.",
            "vi": "Diễn giả nhấn mạnh tái thiết đô thị cần bảo tồn văn hóa bản địa, bối cảnh lịch sử và cộng đồng dân cư.",
            "zh": "演讲者指出，真正的城市再生应在保留当地历史脉络和社区文化的同时改善基础设施，守护地域独特性。",
            "ja": "講演者は、建物を壊す再開発ではなく「地域の歴史的文脈や共同体の文化を保存しつつ活性化させること」が都市再生の核心だと述べています。",
        },
    },

    # --------------------------------------------------------------------------
    # [TOPIK II - 3급~6급] READING (읽기)
    # --------------------------------------------------------------------------
    {
        "question_id": "00000000-0000-0000-0002-000000000004",
        "exam_type": "TOPIK_II",
        "section_name": "READING",
        "question_number": 2,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 3,
        "target_levels": [3, 4],
        "score_points": 2.0,
        "audio_url": None,
        "passage_text": (
            "출퇴근 시간에는 도로가 매우 혼잡해서 자가용을 ( ㉠ ) 지하철이나 버스를 타는 편이 훨씬 빠르다."
        ),
        "prompt_text": "[읽기 1~2번 문법 유형] 빈칸 ( ㉠ )에 들어갈 가장 알맞은 문법을 고르십시오.",
        "correct_answer_text": "3",
        "options": [
            {"option_number": 1, "option_text": "이용하느라고"},
            {"option_number": 2, "option_text": "이용하더라도"},
            {"option_number": 3, "option_text": "이용하느니"},
            {"option_number": 4, "option_text": "이용하던데"},
        ],
        "explanations": {
            "ko": "앞의 행위(자가용 이용)보다 뒤의 행위(대중교통 이용)를 선택하는 것이 더 낫다는 비교·선택의 의미를 나타내는 연결어미 '-느니'(이용하느니)가 정답입니다.",
            "en": "'-느니' ('이용하느니') expresses that rather than doing the first action (driving a car), choosing the second action (taking the subway/bus) is much better.",
            "vi": "Ngữ pháp '-느니' dùng khi so sánh hai lựa chọn: thà đi tàu điện ngầm còn nhanh hơn lái xe cá nhân.",
            "zh": "语法“-느니”表示与其做前一项（开私家车），不如选择后一项（乘地铁或公交）更好。",
            "ja": "「-느니（〜するくらいなら・〜するよりは）」は、前の行動より後ろの行動を選ぶ方がましだという比較・選択を表します。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0002-000000000005",
        "exam_type": "TOPIK_II",
        "section_name": "READING",
        "question_number": 4,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 4,
        "target_levels": [3, 4, 5],
        "score_points": 2.0,
        "audio_url": None,
        "passage_text": (
            "아무리 뛰어난 재능을 타고났다고 할지라도 끊임없이 노력하지 않으면 실력이 제자리걸음을 하기 마련이다."
        ),
        "prompt_text": "[읽기 3~4번 유의어/문법 유형] 밑줄 친 '기 마련이다'와 바꿔 쓸 수 있는 표현을 고르십시오.",
        "correct_answer_text": "1",
        "options": [
            {"option_number": 1, "option_text": "는 법이다"},
            {"option_number": 2, "option_text": "기 나름이다"},
            {"option_number": 3, "option_text": "ㄹ 뿐이다"},
            {"option_number": 4, "option_text": "는 척하다"},
        ],
        "explanations": {
            "ko": "'-기 마련이다'는 '당연히 그렇게 될 수밖에 없다'는 자연스러운 이치나 필연성을 나타내며, '-는 법이다'와 의미가 가장 유사합니다. ('-기 나름이다'는 하기에 따라 달라진다는 뜻이므로 구별해야 합니다.)",
            "en": "'-기 마련이다' means something is bound to happen naturally, which is synonymous with '-는 법이다'.",
            "vi": "'-기 마련이다' diễn tả quy luật tất yếu (ắt hẳn sẽ như vậy), đồng nghĩa với '-는 법이다'.",
            "zh": "“-기 마련이다”表示事情必然会那样发展，与“-는 법이다”（理所当然会……）意思最相近。",
            "ja": "「-기 마련이다（〜するものだ）」は当然の理屈・必然性を表し、「-는 법이다」と置き換えることができます。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0000-000000000013",
        "exam_type": "TOPIK_II",
        "section_name": "READING",
        "question_number": 13,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 3,
        "target_levels": [3, 4],
        "score_points": 2.0,
        "audio_url": None,
        "passage_text": (
            "(가) 그러나 무조건 잠을 줄이는 것은 건강에 해롭다.\n"
            "(나) 현대인들은 바쁜 일상 속에서 수면 시간을 줄이곤 한다.\n"
            "(다) 충분한 수면을 취해야 면역력이 유지되고 집중력도 높아진다.\n"
            "(라) 따라서 건강을 지키려면 하루 7시간 이상의 숙면이 필요하다."
        ),
        "prompt_text": "[읽기 13~15번 문장 배열 유형] 다음 문장을 논리적 순서에 맞게 배열한 것을 고르십시오.",
        "correct_answer_text": "1",
        "options": [
            {"option_number": 1, "option_text": "(나) - (가) - (다) - (라)"},
            {"option_number": 2, "option_text": "(나) - (라) - (가) - (다)"},
            {"option_number": 3, "option_text": "(다) - (가) - (나) - (라)"},
            {"option_number": 4, "option_text": "(다) - (라) - (가) - (나)"},
        ],
        "explanations": {
            "ko": "(나)에서 일반적인 문제 현상을 제시한 후, (가)의 접속부사 '그러나'로 문제점을 지적하고, (다)에서 수면의 중요성을 설명한 뒤, (라)의 '따라서'로 결론을 짓는 흐름이 자연스럽습니다.",
            "en": "The logical sequence starts with (나) stating the general phenomenon, followed by (가) with 'however', explaining the reason in (다), and concluding with (라) 'therefore'.",
            "vi": "Trình tự hợp lý: (나) nêu hiện tượng -> (가) 'Tuy nhiên' chỉ ra tác hại -> (다) giải thích lý do -> (라) 'Do đó' kết luận.",
            "zh": "先由(나)提出普遍现象，再由(가)“但是”指出问题，接着(다)说明充足睡眠的重要性，最后(라)“因此”得出结论。",
            "ja": "(나)で一般的な現象を提示し、(가)「しかし」で問題点を指摘、(다)で理由を説明し、(라)「したがって」で結論づける流れが自然です。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0002-000000000006",
        "exam_type": "TOPIK_II",
        "section_name": "READING",
        "question_number": 19,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 4,
        "target_levels": [3, 4, 5],
        "score_points": 2.0,
        "audio_url": None,
        "passage_text": (
            "전통 시장 상인들이 침체된 상권을 살리기 위해 직접 ( ㉠ ). "
            "상인들은 공동 배달 서비스를 도입하고 청년 창업가들과 협력하여 특색 있는 야시장을 열었다. "
            "그 결과 시장을 찾는 젊은 방문객이 눈에 띄게 늘어났다."
        ),
        "prompt_text": "[읽기 관용어 추론 유형] 빈칸 ( ㉠ )에 들어갈 가장 알맞은 관용 표현을 고르십시오.",
        "correct_answer_text": "2",
        "options": [
            {"option_number": 1, "option_text": "귀를 기울였다"},
            {"option_number": 2, "option_text": "발 벗고 나섰다"},
            {"option_number": 3, "option_text": "입을 모았다"},
            {"option_number": 4, "option_text": "눈코 뜰 새 없었다"},
        ],
        "explanations": {
            "ko": "'발 벗고 나서다'는 어떤 일에 적극적으로 앞장서서 행동한다는 뜻의 필수 기출 관용구입니다. 상인들이 직접 공동 배달과 야시장을 추진했으므로 가장 적절합니다.",
            "en": "'발 벗고 나서다' means to step forward actively and wholeheartedly to solve a problem.",
            "vi": "'발 벗고 나서다' là quán용 ngữ mang nghĩa tích cực xắn tay áo đứng ra giải quyết công việc.",
            "zh": "“발 벗고 나서다”意为积极主动地挺身而出采取行动，符合商人们亲自推进外卖与夜市的语境。",
            "ja": "「발 벗고 나서다（一肌脱ぐ・積極的に乗り出す）」は、ある事に積極的に先頭に立って行動することを意味する頻出慣用句です。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0002-000000000007",
        "exam_type": "TOPIK_II",
        "section_name": "READING",
        "question_number": 25,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 4,
        "target_levels": [4, 5, 6],
        "score_points": 2.0,
        "audio_url": None,
        "passage_text": (
            "[신문 기사 제목: '반려동물 양육 가구 급증… 관련 산업 규모도 사상 최대치 경신']"
        ),
        "prompt_text": "[읽기 25~27번 신문 헤드라인 유형] 다음 신문 기사 제목을 가장 잘 설명한 것을 고르십시오.",
        "correct_answer_text": "4",
        "options": [
            {"option_number": 1, "option_text": "반려동물을 키우는 가구가 줄어들면서 관련 산업이 위축되고 있다."},
            {"option_number": 2, "option_text": "반려동물 관련 산업의 성장세가 멈추어 대책 마련이 시급하다."},
            {"option_number": 3, "option_text": "반려동물 양육 비용이 크게 올라 가계 부담이 최고치에 달했다."},
            {"option_number": 4, "option_text": "반려동물을 기르는 집이 빠르게 늘어나며 관련 시장 규모가 역대 가장 커졌다."},
        ],
        "explanations": {
            "ko": "'양육 가구 급증(빠르게 늘어남)'과 '사상 최대치 경신(역대 가장 큰 기록을 새로 씀)'의 의미를 정확히 풀어낸 것은 4번입니다.",
            "en": "'양육 가구 급증' means households raising pets surged, and '사상 최대치 경신' means breaking the all-time high record.",
            "vi": "'급증' là tăng mạnh, '사상 최대치 경신' là lập kỷ lục cao nhất từ trước đến nay.",
            "zh": "“급증”意为激增，“사상 최대치 경신”意为刷新历史最高纪录，因此4号选项最准确。",
            "ja": "「 급증（急増）」と「사상 최대치 경신（史上最大値の更新）」を最も適切に言い換えているのは4番です。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0002-000000000008",
        "exam_type": "TOPIK_II",
        "section_name": "READING",
        "question_number": 35,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 5,
        "target_levels": [5, 6],
        "score_points": 2.0,
        "audio_url": None,
        "passage_text": (
            "정보 통신 기술의 발달과 소셜 미디어의 대중화로 누구나 손쉽게 정보를 생산하고 공유할 수 있는 환경이 조성되었다. "
            "그러나 조회 수와 경제적 이익만을 노린 자극적인 허위 정보, 이른바 '가짜 뉴스'가 무분별하게 양산되면서 사회적 신뢰가 심각하게 훼손되고 있다. "
            "더욱이 알고리즘 추천 시스템은 이용자가 선호하는 성향의 정보만 반복적으로 노출하는 '확증 편향'을 강화하여 사회적 갈등과 양극화를 부추기기도 한다. "
            "따라서 플랫폼 기업의 자정 노력과 제도적 규제 못지않게, 수용자 스스로 정보의 진위를 비판적으로 검증하는 미디어 리터러시 역량을 함양하는 일이 시급하다."
        ),
        "prompt_text": "[읽기 고급 논설문 독해] 다음 글의 중심 생각으로 가장 알맞은 것을 고르십시오.",
        "correct_answer_text": "3",
        "options": [
            {"option_number": 1, "option_text": "소셜 미디어의 알고리즘 추천 기술을 전면 금지해야 한다."},
            {"option_number": 2, "option_text": "개인의 자유로운 정보 생산을 장려하기 위해 규제를 완화해야 한다."},
            {"option_number": 3, "option_text": "허위 정보의 폐해를 막기 위해 제도적 노력과 함께 수용자의 비판적 정보 판별력을 길러야 한다."},
            {"option_number": 4, "option_text": "전통 언론 매체가 뉴미디어 플랫폼을 대체할 수 있도록 지원해야 한다."},
        ],
        "explanations": {
            "ko": "마지막 문장의 '따라서 플랫폼 기업의 자정 노력과 제도적 규제 못지않게, 수용자 스스로 정보의 진위를 비판적으로 검증하는 미디어 리터러시 역량을 함양하는 일이 시급하다'에 필자의 주장이 집약되어 있습니다.",
            "en": "The author concludes that alongside institutional regulations, cultivating media literacy to critically verify information is urgent.",
            "vi": "Tác giả nhấn mạnh bên cạnh quy định thể chế, người tiếp nhận cần nâng cao năng lực truyền thông (media literacy) để kiểm chứng thông tin.",
            "zh": "作者在末句总结道：除了平台自律和制度监管外，培养受众批判性甄别信息真伪的媒介素养同样迫在眉睫。",
            "ja": "筆者は最後の文で、制度的規制だけでなく「受け手自身が情報の真偽を批判的に検証するメディアリテラシーを養うことが急務だ」と主張しています。",
        },
    },
    {
        "question_id": "00000000-0000-0000-0002-000000000009",
        "exam_type": "TOPIK_II",
        "section_name": "READING",
        "question_number": 42,
        "question_type": "MULTIPLE_CHOICE",
        "difficulty_level": 6,
        "target_levels": [5, 6],
        "score_points": 2.0,
        "audio_url": None,
        "passage_text": (
            "예술 작품을 감상할 때 독자나 관객이 작가의 본래 의도를 있는 그대로 찾아내야만 올바른 감상이라고 여기는 시각이 존재한다. "
            "물론 창작 당시의 시대적 배경과 작가의 전기적 사실을 이해하는 것은 작품 해석의 훌륭한 길잡이가 된다. "
            "그러나 작품이 일단 세상에 발표된 순간부터 그것은 작가의 손을 떠나 독자적인 생명력을 지닌 열린 텍스트가 된다. "
            "감상자가 자신이 처한 시대적 맥락과 고유한 삶의 경험에 비추어 작품에 새로운 의미를 부여할 때, 고전은 비로소 박제된 유물이 아니라 오늘날에도 살아 숨 쉬는 예술로 재탄생하는 것이다."
        ),
        "prompt_text": "[읽기 6급 심화 비평문] 필자의 태도로 가장 알맞은 것을 고르십시오.",
        "correct_answer_text": "2",
        "options": [
            {"option_number": 1, "option_text": "작가의 창작 의도를 왜곡하는 주관적 해석을 경계하고 있다."},
            {"option_number": 2, "option_text": "감상자의 주체적인 재해석이 작품의 가치를 확장한다고 보고 있다."},
            {"option_number": 3, "option_text": "시대적 배경을 배제한 예술 비평의 한계를 비판하고 있다."},
            {"option_number": 4, "option_text": "고전 예술 작품의 원형을 훼손 없이 보존해야 한다고 주장하고 있다."},
        ],
        "explanations": {
            "ko": "필자는 작품을 '열린 텍스트'로 규정하며, 감상자가 자신의 경험과 시대적 맥락에 비추어 새로운 의미를 부여할 때 작품이 살아 숨 쉬는 예술로 재탄생한다고 보는 입장입니다.",
            "en": "The author views artworks as 'open texts' whose value expands when audiences actively reinterpret them through their own context and experience.",
            "vi": "Tác giả coi tác phẩm nghệ thuật là 'văn bản mở', việc người thưởng thức chủ động tái diễn giải sẽ làm sống dậy giá trị tác phẩm.",
            "zh": "作者认为作品一旦发表便成为“开放文本”，鉴赏者结合自身时代背景与人生经验赋予其新意义，能使作品焕发新生。",
            "ja": "筆者は作品を「開かれたテクスト」と捉え、鑑賞者が主体的に新しい意味を付与することで作品の価値が広がると述べています。",
        },
    },

    # --------------------------------------------------------------------------
    # [TOPIK II - 3급~6급] WRITING 51번 (실용문 빈칸 완성 - 10점)
    # --------------------------------------------------------------------------
    {
        "question_id": "00000000-0000-0000-0000-000000000051",
        "exam_type": "TOPIK_II",
        "section_name": "WRITING",
        "question_number": 51,
        "question_type": "SHORT_ANSWER",
        "difficulty_level": 3,
        "target_levels": [3, 4, 5, 6],
        "score_points": 10.0,
        "audio_url": None,
        "passage_text": (
            "[제목: 진료 예약 시간 변경 문의드립니다]\n\n"
            "안녕하세요, 인주치과 담당자님.\n"
            "저는 내일(금요일) 오후 2시에 김민수 원장님께 진료를 받기로 예약한 이수민입니다.\n"
            "다름이 아니라 내일 오후에 급한 회사 회의가 생겨서 예약한 시간에 병원에 ( ㉠ ).\n"
            "혹시 내일 오후 5시나 이번 주 토요일 오전으로 진료 시간을 ( ㉡ )?\n"
            "번거롭게 해 드려 죄송합니다. 확인 후 연락 부탁드립니다."
        ),
        "prompt_text": (
            "[쓰기 51번 실용문 완성 - 10점] 다음을 읽고 ㉠과 ㉡에 들어갈 말을 각각 한 문장으로 쓰십시오.\n"
            "(작성 형식 예시: ㉠ 가기 어렵게 되었습니다 / ㉡ 변경할 수 있을까요)"
        ),
        "correct_answer_text": "㉠ 가기 어렵게 되었습니다 / 갈 수 없게 되었습니다 | ㉡ 변경할 수 있을까요 / 바꿀 수 있습니까",
        "options": [],
        "explanations": {
            "ko": "51번은 이메일·안내문 등 실용문의 맥락과 높임법('-습니다/-ㅂ니다' 또는 '-아/어요')에 맞게 작성해야 합니다. ㉠에는 급한 회의로 병원에 못 간다는 표현('가기 어렵게 되었습니다/갈 수 없게 되었습니다'), ㉡에는 시간을 바꿀 수 있는지 묻는 정중한 질문('변경할 수 있을까요/바꿀 수 있습니까')이 들어가야 합니다.",
            "en": "Q51 tests practical writing with polite honorifics. (㉠) Explain inability to visit at the scheduled time ('가기 어렵게 되었습니다'). (㉡) Politely ask to reschedule ('변경할 수 있을까요').",
        },
    },

    # --------------------------------------------------------------------------
    # [TOPIK II - 3급~6급] WRITING 52번 (설명문 빈칸 완성 - 10점)
    # --------------------------------------------------------------------------
    {
        "question_id": "00000000-0000-0000-0000-000000000052",
        "exam_type": "TOPIK_II",
        "section_name": "WRITING",
        "question_number": 52,
        "question_type": "SHORT_ANSWER",
        "difficulty_level": 4,
        "target_levels": [3, 4, 5, 6],
        "score_points": 10.0,
        "audio_url": None,
        "passage_text": (
            "집에서 화분에 식물을 기를 때 물을 자주 줄수록 식물이 잘 자랄 것이라고 생각하는 사람이 많다. "
            "그러나 물을 너무 많이 주면 식물은 오히려 잘 자라지 못한다. "
            "왜냐하면 흙 속에 물이 지나치게 많으면 공기가 통하지 않아 식물의 뿌리가 ( ㉠ ). "
            "따라서 식물의 뿌리가 상하지 않게 하려면 정해진 날짜마다 무조건 물을 ( ㉡ ) 흙을 직접 만져 보아 말랐을 때 주는 것이 좋다."
        ),
        "prompt_text": (
            "[쓰기 52번 설명문 완성 - 10점] 다음을 읽고 ㉠과 ㉡에 들어갈 말을 문어체('-다/는다')와 문맥에 맞게 각각 쓰십시오.\n"
            "(작성 형식 예시: ㉠ 썩기 때문이다 / ㉡ 주지 말고)"
        ),
        "correct_answer_text": "㉠ 썩기 때문이다 / 숨을 쉬지 못하기 때문이다 | ㉡ 주지 말고 / 주는 대신에",
        "options": [],
        "explanations": {
            "ko": "52번은 설명문이므로 반드시 문어체(해라체: '-다/는다')를 사용해야 합니다. 앞의 '왜냐하면'과 호응하도록 ㉠에는 '썩기 때문이다 / 숨을 쉬지 못하기 때문이다'를 쓰고, ㉡에는 뒤의 대안('말랐을 때 주는 것')과 연결되도록 '주지 말고 / 주는 것보다'를 씁니다.",
            "en": "Q52 requires formal declarative style ('-다/는다'). Pair '왜냐하면' with '-기 때문이다' in (㉠) ('썩기 때문이다'), and contrast unconditional watering in (㉡) ('주지 말고').",
        },
    },

    # --------------------------------------------------------------------------
    # [TOPIK II - 3급~6급] WRITING 53번 (도표·그래프 분석 작문 200~300자 - 30점)
    # --------------------------------------------------------------------------
    {
        "question_id": "00000000-0000-0000-0000-000000000053",
        "exam_type": "TOPIK_II",
        "section_name": "WRITING",
        "question_number": 53,
        "question_type": "ESSAY_SHORT",
        "difficulty_level": 4,
        "target_levels": [3, 4, 5, 6],
        "score_points": 30.0,
        "audio_url": None,
        "passage_text": (
            "[조사 기관: 인주시 통계청]\n"
            "주제: 온라인 쇼핑 이용 현황 및 소비자 만족 요인\n\n"
            "1. 온라인 쇼핑 시장 규모 변화\n"
            "- 2020년: 15조 원  →  2022년: 23조 원  →  2024년: 32조 원 (4년간 2배 이상 급증)\n\n"
            "2. 소비자 만족 요인 비중 (2024년 기준)\n"
            "- 배송의 신속성 (48%) > 가격 경쟁력 (32%) > 상품의 다양성 (20%)\n\n"
            "3. 향후 전망\n"
            "- 당일 배송 서비스 확대와 합리적 가격 혜택으로 온라인 쇼핑 시장의 지속적 성장 예상"
        ),
        "prompt_text": (
            "[쓰기 53번 자료 설명형 - 30점] 다음을 참고하여 ‘온라인 쇼핑 이용 현황 및 만족 요인’에 대한 글을 200~300자로 쓰십시오. "
            "단, 글의 제목을 쓰지 마십시오."
        ),
        "correct_answer_text": None,
        "options": [],
        "explanations": {
            "ko": "도표의 수치 변화(15조 원→32조 원), 만족 요인 순위(배송 신속성 48%, 가격 경쟁력 32%, 상품 다양성 20%), 향후 전망을 객관적 문어체('-다/는다')로 200~300자 분량에 맞춰 서술해야 합니다.",
            "en": "Describe the market growth trend (15T -> 32T KRW), satisfaction ranking (fast delivery 48%, price 32%, variety 20%), and future outlook in 200-300 characters using formal endings ('-다/는다').",
        },
    },
    {
        "question_id": "00000000-0000-0000-0002-000000000053",
        "exam_type": "TOPIK_II",
        "section_name": "WRITING",
        "question_number": 53,
        "question_type": "ESSAY_SHORT",
        "difficulty_level": 4,
        "target_levels": [3, 4, 5, 6],
        "score_points": 30.0,
        "audio_url": None,
        "passage_text": (
            "[조사 기관: 한국사회연구원 (제83회 기출 변형)]\n"
            "주제: 인주시의 가구 형태별 변화 추이 (2015년~2025년)\n\n"
            "1. 전체 가구 형태 비율 변화\n"
            "- 4인 이상 가구: 2015년 42%  →  2025년 21% (절반으로 감소)\n"
            "- 1인 가구: 2015년 18%  →  2025년 39% (2배 이상 급증하여 가장 높은 비중 차지)\n\n"
            "2. 1인 가구 증가 원인\n"
            "- 청년층의 독립 및 결혼관 변화\n"
            "- 고령화로 인한 독거노인 가구 증가\n\n"
            "3. 향후 과제\n"
            "- 1인 가구 맞춤형 소형 주택 공급 및 사회 안전망 확충 필요"
        ),
        "prompt_text": (
            "[쓰기 53번 기출 변형 (가구 수 변화) - 30점] 다음 자료를 참고하여 ‘인주시의 가구 형태 변화와 원인’에 대한 글을 200~300자로 쓰십시오. "
            "단, 글의 제목을 쓰지 마십시오."
        ),
        "correct_answer_text": None,
        "options": [],
        "explanations": {
            "ko": "4인 이상 가구 비율 감소(42%→21%)와 1인 가구 비율 급증(18%→39%)을 대조('-는 반면')하여 서술하고, 청년층 결혼관 변화 및 고령화 원인과 향후 과제까지 200~300자로 작성합니다.",
            "en": "Contrast the decrease in 4+ person households (42%->21%) with the surge in 1-person households (18%->39%), explain the causes, and state future tasks in 200-300 characters.",
        },
    },

    # --------------------------------------------------------------------------
    # [TOPIK II - 5급~6급] WRITING 54번 (사회적 주제 논술문 600~700자 - 50점)
    # --------------------------------------------------------------------------
    {
        "question_id": "00000000-0000-0000-0000-000000000054",
        "exam_type": "TOPIK_II",
        "section_name": "WRITING",
        "question_number": 54,
        "question_type": "ESSAY_LONG",
        "difficulty_level": 6,
        "target_levels": [4, 5, 6],
        "score_points": 50.0,
        "audio_url": None,
        "passage_text": (
            "현대 사회는 과학 기술의 발전과 경제 성장으로 물질적인 풍요를 이루었지만, "
            "과도한 경쟁과 사회적 고립감으로 인해 현대인이 느끼는 행복지수는 오히려 낮아지고 있습니다. "
            "진정한 행복을 실현하기 위한 개인적·사회적 노력에 대해 자신의 생각을 서술하십시오.\n\n"
            "[과제 수행 조건]\n"
            "1. 물질적 풍요 속에서도 현대인의 행복지수가 낮아지는 원인은 무엇인가?\n"
            "2. 행복한 삶을 위해 개인은 어떠한 태도와 가치관을 가져야 하는가?\n"
            "3. 사회와 제도는 구성원의 행복을 위해 어떤 환경을 조성해야 하는가?"
        ),
        "prompt_text": (
            "[쓰기 54번 논술형 (행복의 조건) - 50점] 다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오. "
            "단, 문제를 그대로 옮겨 쓰지 마십시오."
        ),
        "correct_answer_text": None,
        "options": [],
        "explanations": {
            "ko": "서론(문제 제기)-본론(원인 분석 및 개인·사회적 해결 방안)-결론(요약 및 제언)의 3단 구성을 갖추고 고급 어휘와 격식체('-다/는다')를 일관되게 사용해야 합니다.",
            "en": "Structure your essay into Introduction, Body (causes, individual & societal solutions), and Conclusion (600-700 chars) using advanced Korean vocabulary and formal written endings ('-다/는다').",
        },
    },
    {
        "question_id": "00000000-0000-0000-0002-000000000054",
        "exam_type": "TOPIK_II",
        "section_name": "WRITING",
        "question_number": 54,
        "question_type": "ESSAY_LONG",
        "difficulty_level": 6,
        "target_levels": [5, 6],
        "score_points": 50.0,
        "audio_url": None,
        "passage_text": (
            "[제91회 기출 복원 주제: 가짜 뉴스(허위 정보)의 영향과 대응 방안]\n"
            "최근 인터넷과 소셜 미디어를 통해 사실이 아닌 '가짜 뉴스(허위 정보)'가 빠르게 퍼지면서 다양한 사회적 문제가 발생하고 있습니다. "
            "가짜 뉴스의 확산 원인과 문제점을 살펴보고, 이를 해결하기 위한 방안에 대해 자신의 생각을 서술하십시오.\n\n"
            "[과제 수행 조건]\n"
            "1. 현대 사회에서 가짜 뉴스가 쉽게 생산되고 확산되는 배경은 무엇인가?\n"
            "2. 가짜 뉴스로 인해 개인과 사회가 겪는 부정적인 영향은 무엇인가?\n"
            "3. 가짜 뉴스 문제를 해결하기 위해 개인과 사회(정부·언론)는 어떤 노력을 기울여야 하는가?"
        ),
        "prompt_text": (
            "[쓰기 54번 제91회 기출 복원 (가짜 뉴스) - 50점] 다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오. "
            "단, 문제를 그대로 옮겨 쓰지 마십시오."
        ),
        "correct_answer_text": None,
        "options": [],
        "explanations": {
            "ko": "제91회 실제 기출 테마인 '가짜 뉴스' 논술 문항입니다. 1) 뉴미디어의 익명성·경제적 유인·확증 편향(배경), 2) 사회적 불신과 갈등 심화(부작용), 3) 법적·제도적 규제 및 개인의 미디어 리터러시 함양(해결책)을 600~700자로 서술하세요.",
            "en": "Reconstructed 91st TOPIK Q54 on Fake News: address (1) causes of spread, (2) negative societal impacts, and (3) individual media literacy + institutional solutions in 600-700 chars.",
        },
    },
]


# ==============================================================================
# 2. CURATED VOCABULARY DICTIONARY (초급 1~2급 / 중급 3~4급 / 고급 5~6급)
# ==============================================================================
CURATED_VOCAB_LIST: List[Dict[str, Any]] = [
    # --- 초급 (1~2급) ---
    {
        "lemma": "약속",
        "target_code": "10001",
        "pronunciation": "약쏙",
        "part_of_speech": "명사",
        "word_grade": "초급",
        "topik_level": 1,
        "category": "일상생활",
        "korean_definition": "다른 사람과 앞으로의 일을 어떻게 할 것인지 미리 정하여 두는 것.",
        "example_ko": "주말에 친구와 영화 보기로 약속을 했다.",
        "translations": {
            "en": ("promise; appointment", "An arrangement to meet someone or do something."),
            "vi": ("cuộc hẹn, lời hứa", "Sự hẹn trước hoặc hứa hẹn với người khác."),
            "zh": ("约定，约会", "预先与他人商定好今后的事情。"),
            "ja": ("約束", "他の人と今後のことをあらかじめ決めておくこと。"),
        },
    },
    {
        "lemma": "도서관",
        "target_code": "10002",
        "pronunciation": "도서관",
        "part_of_speech": "명사",
        "word_grade": "초급",
        "topik_level": 1,
        "category": "공공장소",
        "korean_definition": "책이나 자료를 모아 두고 사람들이 읽거나 빌릴 수 있게 한 시설.",
        "example_ko": "시험 기간이라 도서관에서 책을 빌려 공부했다.",
        "translations": {
            "en": ("library", "A facility where books and materials are kept for reading or borrowing."),
            "vi": ("thư viện", "Nơi lưu trữ sách và tài liệu để đọc hoặc mượn."),
            "zh": ("图书馆", "收集图书资料供人们阅读或借阅的设施。"),
            "ja": ("図書館", "本や資料を集めて人々が読んだり借りたりできるようにした施設。"),
        },
    },
    {
        "lemma": "반납하다",
        "target_code": "10003",
        "pronunciation": "반나파다",
        "part_of_speech": "동사",
        "word_grade": "초급",
        "topik_level": 2,
        "category": "공공장소",
        "korean_definition": "빌려 쓰던 물건 등을 도로 돌려주다.",
        "example_ko": "도서관에서 빌린 책을 기한 내에 반납해야 한다.",
        "translations": {
            "en": ("return; give back", "To return a borrowed item to its lender."),
            "vi": ("hoàn trả, trả lại", "Trả lại đồ vật đã mượn."),
            "zh": ("归还", "把借用的物品归还给原处。"),
            "ja": ("返却する", "借りていた物などを返す。"),
        },
    },
    {
        "lemma": "복잡하다",
        "target_code": "10004",
        "pronunciation": "복짜파다",
        "part_of_speech": "형용사",
        "word_grade": "초급",
        "topik_level": 2,
        "category": "상태·성질",
        "korean_definition": "사람이나 탈것 등이 많아서 붐비고 어수선하다. 또는 일이 뒤얽혀 풀기 어렵다.",
        "example_ko": "출퇴근 시간에는 지하철에 사람이 많아서 아주 복잡하다.",
        "translations": {
            "en": ("crowded; complicated", "Busy and congested with people/vehicles, or intricate and hard to solve."),
            "vi": ("Đông đúc, phức tạp", "Đông người/xe cộ hoặc rắc rối khó giải quyết."),
            "zh": ("拥挤，复杂", "人或车辆众多而杂乱，或事情错综复杂。"),
            "ja": ("混雑している。複雑だ", "人や乗り物が多くて混み合っている、または物事が入り組んでいる。"),
        },
    },
    {
        "lemma": "준비하다",
        "target_code": "10005",
        "pronunciation": "준비하다",
        "part_of_speech": "동사",
        "word_grade": "초급",
        "topik_level": 1,
        "category": "행동",
        "korean_definition": "미리 필요한 것을 갖추어 마련하다.",
        "example_ko": "발표를 위해 자료를 철저히 준비했다.",
        "translations": {
            "en": ("prepare; get ready", "To arrange or equip necessary things in advance."),
            "vi": ("chuẩn bị", "Sắp xếp sẵn những thứ cần thiết trước."),
            "zh": ("准备", "预先备好所需的东西。"),
            "ja": ("準備する", "前もって必要なものを整えて用意する。"),
        },
    },
    {
        "lemma": "건강",
        "target_code": "15920",
        "pronunciation": "건강",
        "part_of_speech": "명사",
        "word_grade": "초급",
        "topik_level": 1,
        "category": "보건·의료",
        "korean_definition": "정신적으로나 육체적으로 아무 탈이 없고 튼튼함.",
        "example_ko": "규칙적인 운동은 건강을 지키는 가장 좋은 방법이다.",
        "translations": {
            "en": ("health; wellness", "Being mentally and physically sound and strong."),
            "vi": ("sức khỏe", "Sự khỏe mạnh vềทั้ง tinh thần và thể chất."),
            "zh": ("健康", "精神或肉体上没有任何毛病且强壮。"),
            "ja": ("健康", "精神的にも肉体的にも異常がなく丈夫なこと。"),
        },
    },
    {
        "lemma": "줄이다",
        "target_code": "67812",
        "pronunciation": "주리다",
        "part_of_speech": "동사",
        "word_grade": "초급",
        "topik_level": 2,
        "category": "수량·변화",
        "korean_definition": "물건의 길이나 넓이, 수량, 시간 등을 본래보다 작거나 적게 하다.",
        "example_ko": "일회용품 사용을 줄여서 환경을 보호해야 한다.",
        "translations": {
            "en": ("reduce; decrease; cut down", "To make length, quantity, or time smaller or less."),
            "vi": ("giảm bớt, cắt giảm", "Làm cho số lượng hoặc thời gian ít hơn ban đầu."),
            "zh": ("减少，缩减", "使数量、时间等比原来变小或变少。"),
            "ja": ("減らす。縮める", "数量や時間などを本来より少なくする。"),
        },
    },
    {
        "lemma": "충분하다",
        "target_code": "71088",
        "pronunciation": "충분하다",
        "part_of_speech": "형용사",
        "word_grade": "초급",
        "topik_level": 2,
        "category": "상태·성질",
        "korean_definition": "부족함이 없이 넉넉하다.",
        "example_ko": "충분한 수면을 취해야 피로가 풀린다.",
        "translations": {
            "en": ("enough; sufficient; ample", "Plenty and without any lack."),
            "vi": ("đầy đủ", "Dồi dào, không thiếu thốn."),
            "zh": ("充分，充足", "没有不足，很充裕。"),
            "ja": ("十分だ", "不足がなく豊かだ。"),
        },
    },

    # --- 중급 (3~4급) ---
    {
        "lemma": "수면",
        "target_code": "55103",
        "pronunciation": "수면",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "topik_level": 3,
        "category": "보건·생활",
        "korean_definition": "잠을 자는 일. 또는 그 상태.",
        "example_ko": "현대인들은 바쁜 일상 속에서 수면 시간을 줄이곤 한다.",
        "translations": {
            "en": ("sleep", "The act or state of sleeping."),
            "vi": ("giấc ngủ", "Việc ngủ hoặc trạng thái ngủ."),
            "zh": ("睡眠", "睡觉，或指那种状态。"),
            "ja": ("睡眠", "眠ること。また、その状態。"),
        },
    },
    {
        "lemma": "유지되다",
        "target_code": "60501",
        "pronunciation": "유지되다",
        "part_of_speech": "동사",
        "word_grade": "중급",
        "topik_level": 3,
        "category": "변화·상태",
        "korean_definition": "어떤 상태나 상황이 그대로 보존되거나 계속되다.",
        "example_ko": "꾸준히 관리해야 면역력이 유지된다.",
        "translations": {
            "en": ("be maintained; be preserved", "For a state or situation to be preserved or continued."),
            "vi": ("được duy trì", "Trạng thái nào đó được bảo tồn hoặc tiếp tục."),
            "zh": ("维持，保持", "某种状态或情况原样保存或持续下去。"),
            "ja": ("維持される", "ある状態や状況がそのまま保たれる。"),
        },
    },
    {
        "lemma": "집중력",
        "target_code": "69011",
        "pronunciation": "집쭝녁",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "topik_level": 3,
        "category": "심리·능력",
        "korean_definition": "마음이나 주의를 한곳에 모으는 힘.",
        "example_ko": "충분히 쉬면 업무 집중력이 높아진다.",
        "translations": {
            "en": ("concentration; focus", "The ability to gather one's attention in one place."),
            "vi": ("khả năng tập trung", "Sức mạnh tập trung sự chú ý vào một nơi."),
            "zh": ("注意力，集中力", "把注意力集中在一处的力量。"),
            "ja": ("集中力", "心や注意を一箇所に集める力。"),
        },
    },
    {
        "lemma": "해롭다",
        "target_code": "79210",
        "pronunciation": "해롭따",
        "part_of_speech": "형용사",
        "word_grade": "중급",
        "topik_level": 3,
        "category": "보건·생활",
        "korean_definition": "해가 되거나 나쁜 영향을 끼치는 데가 있다.",
        "example_ko": "무조건 잠을 줄이는 것은 건강에 해롭다.",
        "translations": {
            "en": ("harmful; detrimental", "Causing harm or having a bad effect."),
            "vi": ("có hại", "Gây hại hoặc có ảnh hưởng xấu."),
            "zh": ("有害", "造成危害或产生不良影响。"),
            "ja": ("有害だ。害になる", "害になったり悪い影響を及ぼしたりする。"),
        },
    },
    {
        "lemma": "경쟁력",
        "target_code": "20101",
        "pronunciation": "경쟁녁",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "topik_level": 4,
        "category": "경제·경영",
        "korean_definition": "경쟁에서 이길 수 있는 힘이나 능력.",
        "example_ko": "가격 경쟁력과 배송의 신속성이 소비자 만족도를 높였다.",
        "translations": {
            "en": ("competitiveness", "The power or ability to win in competition."),
            "vi": ("năng lực cạnh tranh", "Sức mạnh hoặc khả năng chiến thắng trong cạnh tranh."),
            "zh": ("竞争力", "在竞争中获胜的力量或能力。"),
            "ja": ("競争力", "競争に勝てる力や能力。"),
        },
    },
    {
        "lemma": "신속성",
        "target_code": "20102",
        "pronunciation": "신속썽",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "topik_level": 4,
        "category": "경제·사회",
        "korean_definition": "일 처리나 움직임이 매우 빠르고 민첩한 성질.",
        "example_ko": "온라인 쇼핑 이용자들은 배송의 신속성을 가장 중요하게 꼽았다.",
        "translations": {
            "en": ("promptness; rapidity; speed", "The quality of being very fast and agile in handling tasks."),
            "vi": ("tính nhanh chóng", "Tính chất xử lý công việc rất nhanh và nhạy bén."),
            "zh": ("迅速性，快捷性", "办事或行动非常迅速敏捷的性质。"),
            "ja": ("迅速性", "仕事の処理や動きが非常に速く機敏な性質。"),
        },
    },
    {
        "lemma": "급증하다",
        "target_code": "20103",
        "pronunciation": "급쯩하다",
        "part_of_speech": "동사",
        "word_grade": "중급",
        "topik_level": 4,
        "category": "통계·쓰기53번",
        "korean_definition": "수나 양이 갑자기 크게 늘어나다.",
        "example_ko": "최근 4년간 1인 가구의 비율이 2배 이상 급증하였다.",
        "translations": {
            "en": ("surge; increase sharply", "For a number or amount to increase suddenly and significantly."),
            "vi": ("tăng vọt, tăng mạnh", "Số lượng tăng lên đột ngột và nhanh chóng."),
            "zh": ("激增，猛增", "数量突然大幅增加。"),
            "ja": ("急増する", "数や량이急激に大きく増える。"),
        },
    },
    {
        "lemma": "감면하다",
        "target_code": "20104",
        "pronunciation": "감면하다",
        "part_of_speech": "동사",
        "word_grade": "중급",
        "topik_level": 4,
        "category": "경제·제도",
        "korean_definition": "세금이나 수업료, 죄 등을 깎아 주거나 면제하다.",
        "example_ko": "정부는 중소기업의 세금을 감면하는 대책을 발표했다.",
        "translations": {
            "en": ("reduce or exempt (taxes/fees)", "To discount or exempt taxes, tuition, or penalties."),
            "vi": ("giảm miễn", "Giảm bớt hoặc miễn thuế, học phí."),
            "zh": ("减免", "削减或免除税款、学费等。"),
            "ja": ("減免する", "税金や授業料などを減らしたり免除したりする。"),
        },
    },
    {
        "lemma": "창출하다",
        "target_code": "20105",
        "pronunciation": "창출하다",
        "part_of_speech": "동사",
        "word_grade": "중급",
        "topik_level": 4,
        "category": "경제·사회",
        "korean_definition": "전에 없던 것을 처음으로 만들어 내다.",
        "example_ko": "친환경 산업 육성을 통해 새로운 일자리를 창출해야 한다.",
        "translations": {
            "en": ("create; generate", "To create or bring about something new (e.g., jobs, value)."),
            "vi": ("tạo ra, kiến tạo", "Tạo ra cái mới chưa từng có trước đây (như việc làm, giá trị)."),
            "zh": ("创造，创立", "首次创造出以前没有的事物（如就业岗位、价值）。"),
            "ja": ("創出する", "以前になかったものを新しく作り出す。"),
        },
    },
    {
        "lemma": "대책",
        "target_code": "20106",
        "pronunciation": "대책",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "topik_level": 3,
        "category": "사회·정책",
        "korean_definition": "어려운 상황이나 문제를 이겨 내거나 해결하기 위한 계획이나 방법.",
        "example_ko": "저출산 문제를 해결하기 위한 실효성 있는 대책 마련이 시급하다.",
        "translations": {
            "en": ("countermeasure; measure; policy", "A plan or method to overcome or solve a problem."),
            "vi": ("đối sách, biện pháp", "Kế hoạch hoặc phương pháp để giải quyết vấn đề."),
            "zh": ("对策，措施", "为克服困难或解决问题而制定的计划或方法。"),
            "ja": ("対策", "困難な状況や問題を解決するための計画や方法。"),
        },
    },

    # --- 고급 (5~6급) ---
    {
        "lemma": "면역력",
        "target_code": "45912",
        "pronunciation": "며녕녁",
        "part_of_speech": "명사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "의학·건강",
        "korean_definition": "외부에서 들어온 병원균에 저항하는 힘.",
        "example_ko": "충분한 수면을 취해야 면역력이 유지된다.",
        "translations": {
            "en": ("immunity; immune strength", "The power to resist pathogens entering from outside."),
            "vi": ("sức đề kháng, khả năng miễn dịch", "Sức mạnh chống lại vi khuẩn gây bệnh."),
            "zh": ("免疫力", "抵抗从外部侵入的病原菌的能力。"),
            "ja": ("免疫力", "外部から入った病原菌に抵抗する力。"),
        },
    },
    {
        "lemma": "숙면",
        "target_code": "56022",
        "pronunciation": "숭면",
        "part_of_speech": "명사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "의학·건강",
        "korean_definition": "깊이 든 잠.",
        "example_ko": "건강을 지키려면 하루 7시간 이상의 숙면이 필요하다.",
        "translations": {
            "en": ("deep sleep; sound sleep", "A deep, restful sleep."),
            "vi": ("giấc ngủ sâu", "Giấc ngủ say và sâu."),
            "zh": ("熟睡，酣睡", "深沉的睡眠。"),
            "ja": ("熟睡", "深く眠ること。"),
        },
    },
    {
        "lemma": "양극화",
        "target_code": "30101",
        "pronunciation": "양그콰",
        "part_of_speech": "명사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "사회·논술54번",
        "korean_definition": "서로 다른 두 극단으로 나뉘어 중간 부분이 줄어들고 차이가 심해지는 현상.",
        "example_ko": "알고리즘 추천 시스템은 확증 편향을 강화하여 사회적 양극화를 부추긴다.",
        "translations": {
            "en": ("polarization", "The phenomenon of dividing into two extremes with widening gaps."),
            "vi": ("sự phân cực", "Hiện tượng chia thành hai thái cực đối lập ngày càng sâu sắc."),
            "zh": ("两极分化", "向截然不同的两个极端分化、差距日益扩大的现象。"),
            "ja": ("二極化", "異なる二つの極端に分かれ、差が激しくなる現象。"),
        },
    },
    {
        "lemma": "고립감",
        "target_code": "30102",
        "pronunciation": "고립깜",
        "part_of_speech": "명사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "심리·논술54번",
        "korean_definition": "외따로 떨어져 혼자만 남겨진 듯한 느낌.",
        "example_ko": "과도한 경쟁과 사회적 고립감으로 인해 현대인의 행복지수가 낮아지고 있다.",
        "translations": {
            "en": ("sense of isolation; alienation", "The feeling of being left alone and cut off from others."),
            "vi": ("cảm giác cô lập", "Cảm giác bị tách biệt và bỏ lại một mình."),
            "zh": ("孤立感", "感到孤立无援、独自被冷落的心理状态。"),
            "ja": ("孤立感", "他から離れて一人だけ取り残されたような感覚。"),
        },
    },
    {
        "lemma": "함양하다",
        "target_code": "30103",
        "pronunciation": "하먕하다",
        "part_of_speech": "동사",
        "word_grade": "고급",
        "topik_level": 6,
        "category": "학술·논술54번",
        "korean_definition": "능력이나 품성, 태도 등을 차츰 길러서 갖추다.",
        "example_ko": "수용자 스스로 정보의 진위를 판별하는 미디어 리터러시 역량을 함양해야 한다.",
        "translations": {
            "en": ("cultivate; foster", "To gradually develop and nurture abilities, character, or attitudes."),
            "vi": ("bồi dưỡng, trau dồi", "Nuôi dưỡng và phát triển năng lực hoặc phẩm chất."),
            "zh": ("涵养，培养", "逐步培养并具备某种能力、品德或态度。"),
            "ja": ("涵養する。養う", "能力や品性、態度などを徐々に養って身につける。"),
        },
    },
    {
        "lemma": "훼손되다",
        "target_code": "30104",
        "pronunciation": "훼손되다",
        "part_of_speech": "동사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "사회·환경",
        "korean_definition": "체면이나 명예가 손상되거나, 물건·자연 등이 헐어 망가지다.",
        "example_ko": "허위 정보가 무분별하게 유통되면서 사회적 신뢰가 심각하게 훼손되고 있다.",
        "translations": {
            "en": ("be damaged; be undermined; be tarnished", "For trust, honor, or nature/objects to be impaired or ruined."),
            "vi": ("bị hủy hoại, bị tổn hại", "Uy tín, danh dự hoặc môi trường bị làm hỏng."),
            "zh": ("受损，毁损", "名誉、信任受到损害，或物体、自然环境遭到破坏。"),
            "ja": ("毀損される。損なわれる", "名誉や信頼が傷ついたり、物や自然が壊れたりする。"),
        },
    },
    {
        "lemma": "당면하다",
        "target_code": "30105",
        "pronunciation": "당면하다",
        "part_of_speech": "동사",
        "word_grade": "고급",
        "topik_level": 6,
        "category": "사회·논술54번",
        "korean_definition": "일이나 문제 등을 바로 눈앞에 맞닥뜨리다.",
        "example_ko": "기후 위기는 인류가 당면한 가장 시급한 과제이다.",
        "translations": {
            "en": ("confront; face directly", "To face an issue or task right in front of one."),
            "vi": ("đối mặt, đương đầu", "Đối diện trực tiếp với vấn đề hay nhiệm vụ trước mắt."),
            "zh": ("面临，面对", "直接面对眼前的事务或问题。"),
            "ja": ("当面する。直面する", "事や問題などに目の前でぶつかる。"),
        },
    },
    {
        "lemma": "일맥상통하다",
        "target_code": "30106",
        "pronunciation": "일맥쌍통하다",
        "part_of_speech": "형용사",
        "word_grade": "고급",
        "topik_level": 6,
        "category": "사자성어·독해",
        "korean_definition": "생각이나 성질, 처지 등이 서로 통하는 데가 있어 유사하다.",
        "example_ko": "두 학자의 주장은 표현 방식만 다를 뿐 본질적으로 일맥상통한다.",
        "translations": {
            "en": ("have a common thread; be in the same vein", "Sharing an underlying connection in thought or nature."),
            "vi": ("nhất mạch tương thông (tương đồng)", "Có điểm chung, thông suốt với nhau về bản chất."),
            "zh": ("一脉相通", "思想、性质或处境等彼此相通、相似。"),
            "ja": ("一脈相通じる", "考えや性質などに互いに通じるものがあって似ている。"),
        },
    },
]


# ==============================================================================
# 3. CORE GRAMMAR PATTERNS BY LEVEL (1급~6급 필수 기출 문법 사전)
# ==============================================================================
GRAMMAR_PATTERNS: List[Dict[str, Any]] = [
    {
        "id": "gram-101",
        "pattern": "-아서/어서",
        "level": 1,
        "exam_type": "TOPIK_I",
        "category": "이유·순차 연결어미",
        "meaning_ko": "앞 문장이 뒤 문장의 이유나 원인이 됨을 나타내거나, 시간적 선후 관계를 나타낸다.",
        "meaning_en": "Indicates cause/reason ('because/so') or sequential action ('and then'). Cannot be followed by imperative (-으세요) or propositive (-읍시다).",
        "example_ko": "어제는 날씨가 너무 추워서 따뜻한 코트를 입었어요.",
        "exam_tip": "[기출 핵심] 뒤 문장에 명령문(-으세요)이나 청유문(-읍시다)이 오면 '-아서/어서'를 쓸 수 없고 '-(으)니까'를 써야 합니다.",
    },
    {
        "id": "gram-102",
        "pattern": "-(으)려고 하다",
        "level": 1,
        "exam_type": "TOPIK_I",
        "category": "의도·계획",
        "meaning_ko": "화자가 앞으로 어떤 행동을 할 의도나 계획이 있음을 나타낸다.",
        "meaning_en": "Expresses intention or plan to do something ('plan to / intend to').",
        "example_ko": "방학 동안 한국어능력시험을 준비하려고 합니다.",
        "exam_tip": "[기출 핵심] 주어의 의지를 나타내므로 3인칭 과거 시제나 무정 명사 주어와는 결합에 제약이 있습니다.",
    },
    {
        "id": "gram-201",
        "pattern": "-(으)면서",
        "level": 2,
        "exam_type": "TOPIK_I",
        "category": "동시 동작",
        "meaning_ko": "두 가지 이상의 동작이나 상태를 동시에 함을 나타낸다.",
        "meaning_en": "Indicates performing two actions simultaneously ('while doing').",
        "example_ko": "저는 한국 드라마를 보면서 한국어 발음을 연습해요.",
        "exam_tip": "[기출 핵심] 앞절과 뒷절의 주어가 반드시 같아야 합니다.",
    },
    {
        "id": "gram-301",
        "pattern": "-느라고",
        "level": 3,
        "exam_type": "TOPIK_II",
        "category": "이유·원인 (부정적 결과)",
        "meaning_ko": "앞의 행위를 하느라 시간이나 노력을 들여 뒤의 부정적인 결과가 생겼음을 나타낸다.",
        "meaning_en": "Indicates that doing the preceding intentional action caused a negative result in the main clause ('because I was busy doing...').",
        "example_ko": "발표 자료를 수정하느라고 어젯밤에 잠을 거의 못 잤다.",
        "exam_tip": "[TOPIK II 1~2번 단골 출제] 동사에만 결합하며, 앞뒤 주어가 동일해야 하고, 뒷절에는 주로 부정적 결과(못 했다, 늦었다)가 옵니다.",
    },
    {
        "id": "gram-302",
        "pattern": "-느니 (차라리 ~느니)",
        "level": 3,
        "exam_type": "TOPIK_II",
        "category": "비교·선택",
        "meaning_ko": "앞의 행위를 하는 것보다 차라리 뒤의 행위를 선택하는 편이 낫다는 뜻을 나타낸다.",
        "meaning_en": "Expresses that rather than doing Action A, choosing Action B is much better ('rather than...').",
        "example_ko": "출퇴근 시간에 자가용을 이용하느니 지하철을 타는 편이 훨씬 빠르다.",
        "exam_tip": "[TOPIK II 1~2번 빈출] 주로 부사 '차라리'와 호응하며 뒤에는 '-는 편이 낫다/좋다'가 자주 옵니다.",
    },
    {
        "id": "gram-401",
        "pattern": "-기 마련이다 / -는 법이다",
        "level": 4,
        "exam_type": "TOPIK_II",
        "category": "당위·자연적 이치",
        "meaning_ko": "어떤 일이 당연히 그렇게 될 수밖에 없는 자연스러운 이치임을 나타낸다.",
        "meaning_en": "Indicates a natural law or inevitability ('is bound to / it is only natural that').",
        "example_ko": "꾸준히 노력하지 않으면 실력이 제자리걸음을 하기 마련이다.",
        "exam_tip": "[TOPIK II 3~4번 유의어 단골] '-기 마련이다'와 '-는 법이다'는 유의어이며, 하기에 따라 달라진다는 뜻의 '-기 나름이다'와 구별하는 문제가 자주 출제됩니다.",
    },
    {
        "id": "gram-402",
        "pattern": "-(으)ㄹ 뿐만 아니라 / -(으)ㄹ 뿐더러",
        "level": 4,
        "exam_type": "TOPIK_II",
        "category": "첨가·확장 (쓰기 53·54번 필수)",
        "meaning_ko": "앞의 사실에 더해 뒤의 사실까지 추가됨을 나타낸다.",
        "meaning_en": "Not only A, but also B ('not only... but also...'). Essential for Q54 essay writing.",
        "example_ko": "충분한 수면은 면역력을 높여 줄 뿐만 아니라 집중력 향상에도 큰 도움을 준다.",
        "exam_tip": "[쓰기 54번 고득점 표현] 본론에서 원인과 효과를 두 가지 이상 나열할 때 사용하면 문장 구조 점수가 높아집니다.",
    },
    {
        "id": "gram-501",
        "pattern": "-기 십상이다",
        "level": 5,
        "exam_type": "TOPIK_II",
        "category": "부정적 추측·경향",
        "meaning_ko": "어떤 부정적인 상황이나 결과에 빠지기 매우 쉽다는 뜻을 나타낸다.",
        "meaning_en": "Very likely or prone to fall into a negative outcome ('it is easy to end up...').",
        "example_ko": "정보의 진위를 검증하지 않고 수용하면 가짜 뉴스에 현혹되기 십상이다.",
        "exam_tip": "[고급 읽기·쓰기 빈출] 반드시 부정적인 결과(실패하다, 속다, 낭패를 보다 등)와 함께 쓰입니다.",
    },
    {
        "id": "gram-502",
        "pattern": "-는 셈이다",
        "level": 5,
        "exam_type": "TOPIK_II",
        "category": "판단·결산 (쓰기 53번 필수)",
        "meaning_ko": "여건이나 결과를 따져 보면 결국 그러한 것과 같다는 판단을 나타낸다.",
        "meaning_en": "All things considered, it amounts to / is practically the same as.",
        "example_ko": "4년간 온라인 쇼핑 매출이 15조 원에서 32조 원으로 늘어 두 배 이상 증가한 셈이다.",
        "exam_tip": "[쓰기 53번 통계 요약 팁] 수치 변화를 해석하여 요약할 때 '~배 증가한 셈이다'로 활용하면 매우 자연스럽습니다.",
    },
    {
        "id": "gram-601",
        "pattern": "-기 이를 데 없다 / -기 짝이 없다",
        "level": 6,
        "exam_type": "TOPIK_II",
        "category": "최상급 강조 (고급 문어체)",
        "meaning_ko": "정도나 상태가 말로 다 표현할 수 없을 만큼 매우 심함을 나타낸다.",
        "meaning_en": "Beyond description; extremely ('cannot be more... / utterly').",
        "example_ko": "생태계를 고려하지 않은 무분별한 개발은 근시안적이기 이를 데 없다.",
        "exam_tip": "[6급 읽기 3~4번 유의어 & 54번 논술] 형용사에 결합하여 필자의 강한 비판이나 강조 태도를 드러냅니다.",
    },
]


# ==============================================================================
# 4. ESSENTIAL IDIOMS & PROVERBS (필수 기출 관용어·속담·사자성어)
# ==============================================================================
IDIOMS_AND_PROVERBS: List[Dict[str, Any]] = [
    {
        "expression": "발 벗고 나서다",
        "type": "관용어",
        "level": "중·고급 (4~6급)",
        "meaning_ko": "어떤 일에 적극적으로 앞장서서 행동하다.",
        "meaning_en": "To step forward actively and wholeheartedly to solve an issue.",
        "example": "침체된 지역 상권을 살리기 위해 상인들이 직접 발 벗고 나섰다.",
    },
    {
        "expression": "눈코 뜰 새 없다",
        "type": "관용어",
        "level": "중급 (3~4급)",
        "meaning_ko": "정신을 차릴 수 없을 정도로 매우 바쁘다.",
        "meaning_en": "To be extremely busy without a moment to breathe.",
        "example": "신제품 출시를 앞두고 전 직원이 눈코 뜰 새 없이 바쁜 나날을 보내고 있다.",
    },
    {
        "expression": "입을 모으다",
        "type": "관용어",
        "level": "중·고급 (4~6급)",
        "meaning_ko": "여러 사람이 같은 의견으로 한목소리를 내다.",
        "meaning_en": "To speak in unison; for experts/people to agree unanimously.",
        "example": "전문가들은 가짜 뉴스 문제를 해결하려면 미디어 리터러시 교육이 필수적이라고 입을 모은다.",
    },
    {
        "expression": "발등에 불이 떨어지다",
        "type": "관용어",
        "level": "중·고급 (4~5급)",
        "meaning_ko": "일이 매우 급하게 닥쳐서 당장 처리해야 하는 상황에 처하다.",
        "meaning_en": "To have an urgent matter pressing right upon one.",
        "example": "마감 기한이 내일로 다가오자 발등에 불이 떨어진 것처럼 서둘러 보고서를 작성했다.",
    },
    {
        "expression": "귀를 기울이다",
        "type": "관용어",
        "level": "중급 (3~4급)",
        "meaning_ko": "남의 말이나 의견을 주의 깊게 열심히 듣다.",
        "meaning_en": "To listen attentively to others' voices or opinions.",
        "example": "기업이 지속 가능하게 성장하려면 소비자의 작은 불만에도 귀를 기울여야 한다.",
    },
    {
        "expression": "제자리걸음을 하다",
        "type": "관용어",
        "level": "고급 (5~6급)",
        "meaning_ko": "발전이나 진전이 없이 한 상태에 머물러 있다.",
        "meaning_en": "To make no progress; to stagnate in the same place.",
        "example": "끊임없이 혁신하지 않는 기업은 치열한 시장에서 제자리걸음을 할 수밖에 없다.",
    },
    {
        "expression": "일석이조 (一石二鳥)",
        "type": "사자성어",
        "level": "중·고급 (4~6급)",
        "meaning_ko": "돌 하나로 새 두 마리를 잡는다는 뜻으로, 한 가지 일을 해서 두 가지 이익을 동시에 얻음.",
        "meaning_en": "Killing two birds with one stone.",
        "example": "자전거로 출퇴근하면 건강도 챙기고 교통비도 절약할 수 있어 일석이조이다.",
    },
    {
        "expression": "우후죽순 (雨後竹筍)",
        "type": "사자성어",
        "level": "고급 (5~6급)",
        "meaning_ko": "비 온 뒤에 대나무 순이 돋아나듯 어떤 현상이나 사물이 한꺼번에 많이 생겨남.",
        "meaning_en": "Springing up like mushrooms (bamboo shoots) after the rain.",
        "example": "온라인 쇼핑 시장이 급성장하면서 관련 배송 업체들이 우후죽순으로 생겨났다.",
    },
]


# ==============================================================================
# 5. WRITING 53 & 54 TEMPLATES & MODEL ANSWERS (쓰기 만점 템플릿 및 모범답안)
# ==============================================================================
WRITING_TEMPLATES: Dict[str, Any] = {
    "q53_templates": {
        "title": "쓰기 53번 (도표·통계 분석 200~300자) 4단 만점 공식",
        "steps": [
            {
                "step": "1단계: 조사 기관 및 주제 도입 (약 40~50자)",
                "expressions": [
                    "[조사 기관]에서 ‘[주제]’에 대해 조사한 결과에 따르면,",
                    "최근 [조사 기관]이 [대상]을 대상으로 ‘[주제]’를 조사한 결과,",
                ],
            },
            {
                "step": "2단계: 전체 수치 증감 추이 서술 (약 70~90자)",
                "expressions": [
                    "[항목]은 [연도]년 [수치]에서 [연도]년 [수치]로 꾸준히 증가한(감소한) 것으로 나타났다.",
                    "반면 [비교 항목]은 같은 기간 [수치]에서 [수치]로 절반 가까이 급감하였다(급증하였다).",
                ],
            },
            {
                "step": "3단계: 순위 비교 및 원인 분석 (약 60~80자)",
                "expressions": [
                    "[요인]을 살펴보면 [1위 항목]이 [수치]%로 가장 높은 비중을 차지했으며, [2위 항목]([수치]%), [3위 항목]([수치]%)이 그 뒤를 이었다.",
                    "이러한 변화는 [원인 1]과 [원인 2]에서 비롯된 것으로 분석된다.",
                ],
            },
            {
                "step": "4단계: 향후 전망 및 과제 요약 (약 40~50자)",
                "expressions": [
                    "이에 따라 앞으로도 [향후 전망]이 지속될 것으로 전망된다.",
                    "따라서 향후 이를 뒷받침하기 위한 [과제/대책] 마련이 요구된다.",
                ],
            },
        ],
    },
    "q54_templates": {
        "title": "쓰기 54번 (사회적 주제 논술 600~700자) 서론·본론·결론 만점 공식",
        "steps": [
            {
                "step": "서론: 화두 제시 및 문제 제기 (약 120~150자)",
                "expressions": [
                    "현대 사회는 [긍정적 발전]을 이루었으나, 그 이면에는 [문제 현상]이라는 그림자가 존재한다.",
                    "최근 [주제]를 둘러싼 사회적 논의가 활발해지고 있다. [현상]은 단순한 개인의 문제를 넘어 사회 전체가 당면한 핵심 과제이다.",
                ],
            },
            {
                "step": "본론 1: 원인 및 문제점 심층 분석 (약 200~230자)",
                "expressions": [
                    "이러한 현상이 발생하는 근본적인 원인은 무엇보다 [원인 1]에 있다.",
                    "더욱이 [원인 2]가 심화되면서 [부정적 영향]을 초래할 뿐만 아니라 사회적 신뢰마저 훼손하고 있다.",
                ],
            },
            {
                "step": "본론 2: 개인적·사회적 해결 방안 제시 (약 200~230자)",
                "expressions": [
                    "이를 해결하기 위해서는 개인적 차원의 의식 개선과 사회적 차원의 제도적 뒷받침이 병행되어야 한다.",
                    "우선 개인은 [개인 노력]하는 태도를 함양해야 한다. 아울러 정부와 사회는 [제도적 대책]을 마련하여 실효성 있는 환경을 조성해야 할 것이다.",
                ],
            },
            {
                "step": "결론: 종합 요약 및 미래 제언 (약 80~100자)",
                "expressions": [
                    "결론적으로 [주제]의 진정한 실현은 개인의 성찰과 사회 시스템의 혁신이 조화를 이룰 때 비로소 가능해질 것이다.",
                ],
            },
        ],
    },
}


# ==============================================================================
# 6. CURATED YOUTUBE LECTURES & OFFICIAL STUDY RESOURCES (유튜브 및 공식 자료)
# ==============================================================================
YOUTUBE_AND_WEB_RESOURCES: List[Dict[str, Any]] = [
    {
        "id": "yt-hanijemi-5354",
        "title": "HANIJEMI (배정선 선생님) - TOPIK II 쓰기 53번·54번 기출 해설 및 만점 템플릿 특강",
        "provider": "YouTube · HANIJEMI Korean",
        "category": "쓰기 51~54번 특강",
        "target_levels": "TOPIK II (3~6급)",
        "description": "TOPIK II 쓰기 53번 도표 분석 공식과 54번 논술문 서론·본론·결론 작성법을 실제 기출문제(60회~91회) 첨삭 사례와 함께 설명하는 대표 유튜브 채널입니다.",
        "url": "https://www.youtube.com/results?search_query=HANIJEMI+TOPIK+쓰기+53번+54번",
        "tags": ["쓰기 53번", "쓰기 54번", "원고지 작성법", "기출 첨삭"],
    },
    {
        "id": "yt-wabom-topik",
        "title": "WABOM TOPIK (와봄 토픽) - TOPIK 읽기·쓰기 채점 기준 및 고득점 문법 라이브 강의",
        "provider": "YouTube · WABOM TOPIK",
        "category": "읽기·쓰기 종합",
        "target_levels": "TOPIK II (3~6급)",
        "description": "수험생들이 자주 감점당하는 문어체 종결어미 오류, 접속부사 활용법, 읽기 장문 독해 시간 단축 전략을 다루는 전문 강의 채널입니다.",
        "url": "https://www.youtube.com/results?search_query=WABOM+TOPIK+쓰기+읽기+특강",
        "tags": ["채점 기준", "고급 문법", "읽기 시간 배분", "실전 모의고사"],
    },
    {
        "id": "yt-listening-archive",
        "title": "TOPIK 역대 기출문제 듣기 평가 전체 음원 & 스크립트 (제60회·64회·83회·91회)",
        "provider": "YouTube · TOPIK Listening Archive",
        "category": "듣기 실전 음원",
        "target_levels": "TOPIK I & II (1~6급)",
        "description": "실제 시험장과 동일한 안내 방송, 남녀 성우 대화 음원 및 한국어 대본(스크립트)을 보며 섀도잉(Shadowing) 연습을 할 수 있는 기출 듣기 모음입니다.",
        "url": "https://www.youtube.com/results?search_query=TOPIK+기출문제+듣기+음원+스크립트+91회+83회",
        "tags": ["듣기 음원", "스크립트", "섀도잉", "기출 복원"],
    },
    {
        "id": "yt-ttmik-topik1",
        "title": "Talk To Me In Korean (TTMIK) & KoreanClass101 - TOPIK I 초급 필수 어휘·문법 마스터",
        "provider": "YouTube · TTMIK / KoreanClass101",
        "category": "초급 어휘·문법",
        "target_levels": "TOPIK I (1~2급)",
        "description": "1급(800단어)~2급(1,500단어) 필수 초급 어휘와 기초 연결어미·종결어미를 다국어 해설과 함께 쉽게 배울 수 있는 글로벌 채널입니다.",
        "url": "https://www.youtube.com/results?search_query=TOPIK+1+vocabulary+grammar+full+course",
        "tags": ["TOPIK I", "1급·2급", "초급 어휘 1500", "기초 문법"],
    },
    {
        "id": "web-official-topik",
        "title": "국립국제교육원 TOPIK 공식 홈페이지 (기출문제 PDF & 듣기 MP3 무료 다운로드)",
        "provider": "NIIED · topik.go.kr",
        "category": "공식 기출 자료실",
        "target_levels": "TOPIK I & II (1~6급)",
        "description": "대한민국 교육부 국립국제교육원에서 공식 배포하는 역대 TOPIK 시험지, 정답표, 듣기 평가 MP3 원본 및 IBT 체험관을 제공합니다.",
        "url": "https://www.topik.go.kr",
        "tags": ["공식 홈페이지", "기출 PDF", "IBT 안내", "국립국제교육원"],
    },
    {
        "id": "web-krdict-nikl",
        "title": "국립국어원 한국어기초사전 (11개 언어 번역 학습자 사전)",
        "provider": "NIKL · krdict.korean.go.kr",
        "category": "공식 어휘·사전",
        "target_levels": "초급·중급·고급 (1~6급)",
        "description": "한국어 학습자를 위해 5만여 개의 필수 어휘를 초급·중급·고급 등급별로 분류하고 11개 언어 번역과 용례를 제공하는 국립국어원 공식 사전입니다.",
        "url": "https://krdict.korean.go.kr",
        "tags": ["국립국어원", "등급별 어휘", "11개국어 번역", "발음·용례"],
    },
]


# ==============================================================================
# 7. EXTENDED VOCABULARY BANK FOR CLICKABLE PASSAGES & VOCABULARY LAB
# ==============================================================================
EXTRA_VOCAB_LIST: List[Dict[str, Any]] = [
    {
        "lemma": "자전거",
        "target_code": "10101",
        "pronunciation": "자전거",
        "part_of_speech": "명사",
        "word_grade": "초급",
        "topik_level": 1,
        "category": "교통·취미",
        "korean_definition": "두 개의 바퀴와 페달이 있어 발로 밟아 움직이는 탈것.",
        "example_ko": "주말마다 한강 공원에서 자전거를 탄다.",
        "translations": {
            "en": ("bicycle; bike", "A two-wheeled vehicle propelled by pedals."),
            "vi": ("xe đạp", "Phương tiện hai bánh đạp bằng chân."),
            "zh": ("自行车", "有两个轮子和踏板、靠脚踩行进的交通工具。"),
            "ja": ("自転車", "二つの車輪とペダルがあり足でこいで進む乗り物。"),
        },
    },
    {
        "lemma": "선물",
        "target_code": "10102",
        "pronunciation": "선물",
        "part_of_speech": "명사",
        "word_grade": "초급",
        "topik_level": 1,
        "category": "일상생활",
        "korean_definition": "남에게 정성이나 축하의 뜻으로 물건을 건네어 줌. 또는 그 물건.",
        "example_ko": "친구의 생일을 축하하려고 백화점에서 선물을 샀다.",
        "translations": {
            "en": ("gift; present", "An item given to someone to show affection or congratulations."),
            "vi": ("món quà", "Vật tặng người khác để chúc mừng hoặc bày tỏ tấm lòng."),
            "zh": ("礼物，礼品", "为表达心意或祝贺而送给他人的物品。"),
            "ja": ("プレゼント。贈り物", "お祝いや感謝の気持ちとして人に贈る品物。"),
        },
    },
    {
        "lemma": "시설",
        "target_code": "20201",
        "pronunciation": "시설",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "topik_level": 3,
        "category": "공공·사회",
        "korean_definition": "일정한 목적을 위하여 만들어 놓은 건물이나 설비.",
        "example_ko": "도서관 시설 수리와 청소 때문에 금요일에 휴관합니다.",
        "translations": {
            "en": ("facility; equipment; institution", "Buildings or equipment installed for a specific purpose."),
            "vi": ("cơ sở vật chất, trang thiết bị", "Công trình hoặc thiết bị được lắp đặt cho mục đích nhất định."),
            "zh": ("设施，设备", "为特定目的而建造的建筑物或设备。"),
            "ja": ("施設。設備", "一定の目的のために設けられた建物や設備。"),
        },
    },
    {
        "lemma": "자막",
        "target_code": "20202",
        "pronunciation": "자막",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "topik_level": 3,
        "category": "문화·미디어",
        "korean_definition": "영화나 방송 화면에 대사나 설명을 글자로 나타내는 것.",
        "example_ko": "한국어 실력이 늘어서 이제 자막 없이 한국 드라마를 본다.",
        "translations": {
            "en": ("subtitles; captions", "Text displayed on a screen showing dialogue or explanations."),
            "vi": ("phụ đề", "Chữ hiển thị lời thoại trên màn hình phim hoặc truyền hình."),
            "zh": ("字幕", "在影视画面上用文字显示的台词或说明。"),
            "ja": ("字幕", "映画や放送の画面にセリフや説明を文字で表示するもの。"),
        },
    },
    {
        "lemma": "통계",
        "target_code": "20203",
        "pronunciation": "통계",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "topik_level": 3,
        "category": "통계·쓰기53번",
        "korean_definition": "사회나 자연 현상을 한눈에 알아보기 쉽게 숫자로 나타낸 것.",
        "example_ko": "설문 조사 통계 그래프를 알기 쉽게 수정하고 있습니다.",
        "translations": {
            "en": ("statistics", "Numerical data representing social or natural phenomena."),
            "vi": ("thống kê", "Số liệu biểu thị các hiện tượng xã hội hoặc tự nhiên."),
            "zh": ("统计", "将社会或自然现象用数字汇总表示以便一目了然。"),
            "ja": ("統計", "社会や自然現象を分かりやすく数字で表したもの。"),
        },
    },
    {
        "lemma": "비치하다",
        "target_code": "20204",
        "pronunciation": "비치하다",
        "part_of_speech": "동사",
        "word_grade": "중급",
        "topik_level": 4,
        "category": "업무·행정",
        "korean_definition": "필요한 물건이나 서류 등을 일정한 곳에 미리 갖추어 두다.",
        "example_ko": "발표 자료를 출력해서 회의실에 미리 비치해 주세요.",
        "translations": {
            "en": ("equip; place; keep on hand", "To prepare and place necessary documents or items in a designated spot."),
            "vi": ("trang bị,擺/đặt sẵn", "Chuẩn bị và đặt sẵn tài liệu hoặc vật dụng ở nơi quy định."),
            "zh": ("备置，配备", "在特定场所预先备好所需的物品或文件。"),
            "ja": ("備え付ける。配置する", "必要な物品や書類などを一定の場所に前もって揃えておく。"),
        },
    },
    {
        "lemma": "정체되다",
        "target_code": "30201",
        "pronunciation": "정체되다",
        "part_of_speech": "동사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "경제·사회",
        "korean_definition": "일이나 현상이 앞으로 나아가지 못하고 제자리에 머무르다.",
        "example_ko": "고객 수는 늘었는데 재방문율은 오히려 정체되어 있다.",
        "translations": {
            "en": ("stagnate; be stalled", "To fail to progress and remain stuck in place."),
            "vi": ("bị đình trệ, chững lại", "Không tiến triển thêm mà dậm chân tại chỗ."),
            "zh": ("停滞，停顿", "事物或现象无法向前推进而停留在原地。"),
            "ja": ("停滞する", "物事や現象が前に進まずその場に留まる。"),
        },
    },
    {
        "lemma": "정체성",
        "target_code": "30202",
        "pronunciation": "정체썽",
        "part_of_speech": "명사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "철학·사회",
        "korean_definition": "변하지 아니하는 존재의 본질을 깨닫는 성질. 또는 그 주체.",
        "example_ko": "그 지역만의 고유한 정체성을 살려 도시를 재생해야 한다.",
        "translations": {
            "en": ("identity", "The distinguishing character or essence of an individual or community."),
            "vi": ("bản sắc", "Bản chất riêng biệt không thay đổi của một chủ thể hay cộng đồng."),
            "zh": ("认同感，独特性，本质", "认识自身不变本质的属性或独特特征。"),
            "ja": ("アイデンティティ。正体性", "変わらない存在の本質や固有の特性。"),
        },
    },
    {
        "lemma": "혼잡하다",
        "target_code": "20205",
        "pronunciation": "혼자파다",
        "part_of_speech": "형용사",
        "word_grade": "중급",
        "topik_level": 4,
        "category": "교통·상태",
        "korean_definition": "사람이나 차 등이 뒤섞여 어수선하고 복잡하다.",
        "example_ko": "출퇴근 시간에는 도로가 매우 혼잡해서 지하철이 빠르다.",
        "translations": {
            "en": ("congested; crowded", "Crowded and chaotic with people or traffic."),
            "vi": ("tắc nghẽn, hỗn tạp", "Đông đúc và lộn xộn bởi người hoặc xe cộ."),
            "zh": ("拥堵，混杂", "人或车辆混杂在一起显得忙乱拥挤。"),
            "ja": ("混雑する", "人や車などが入り混じって混み合っている。"),
        },
    },
    {
        "lemma": "침체되다",
        "target_code": "30203",
        "pronunciation": "침체되다",
        "part_of_speech": "동사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "경제·사회",
        "korean_definition": "어떤 현상이나 경기 등이 활발하지 못하고 가라앉다.",
        "example_ko": "전통 시장 상인들이 침체된 상권을 살리기 위해 발 벗고 나섰다.",
        "translations": {
            "en": ("be sluggish; be depressed; slump", "For an economy or activity to become inactive and decline."),
            "vi": ("bị suy thoái, trầm lắng", "Kinh tế hoặc hoạt động trở nên ảm đạm, suy giảm."),
            "zh": ("低迷，萧条，停滞", "某种现象或经济不景气、陷入低谷。"),
            "ja": ("沈滞する。低迷する", "景気や活動などが振るわず落ち込む。"),
        },
    },
    {
        "lemma": "경신하다",
        "target_code": "30204",
        "pronunciation": "경신하다",
        "part_of_speech": "동사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "신문기사·통계",
        "korean_definition": "이미 있던 어떤 기록을 깨뜨리고 새로운 기록을 세우다.",
        "example_ko": "반려동물 관련 산업 규모가 사상 최대치를 경신했다.",
        "translations": {
            "en": ("break a record; renew", "To surpass an existing record and set a new one."),
            "vi": ("phá kỷ lục, lập kỷ lục mới", "Phá vỡ kỷ lục cũ và thiết lập kỷ lục mới."),
            "zh": ("刷新（纪录）", "打破原有纪录并创下新纪录。"),
            "ja": ("更新する", "既存の記録を破って新しい記録を打ち立てる。"),
        },
    },
    {
        "lemma": "양산되다",
        "target_code": "30205",
        "pronunciation": "양산되다",
        "part_of_speech": "동사",
        "word_grade": "고급",
        "topik_level": 6,
        "category": "사회·논술54번",
        "korean_definition": "어떤 사물이나 현상이 대량으로 많이 만들어지다.",
        "example_ko": "자극적인 가짜 뉴스가 무분별하게 양산되면서 사회적 신뢰가 훼손되고 있다.",
        "translations": {
            "en": ("be mass-produced; proliferate", "To be produced or generated in large quantities."),
            "vi": ("được sản xuất hàng loạt, tràn lan", "Được tạo ra với số lượng lớn."),
            "zh": ("大量产生，量产", "某种事物或现象被大量制造出来。"),
            "ja": ("量産される", "ある物事や現象が大量に作り出される。"),
        },
    },
    {
        "lemma": "확증",
        "target_code": "30206",
        "pronunciation": "확쯩",
        "part_of_speech": "명사",
        "word_grade": "고급",
        "topik_level": 6,
        "category": "심리·학술",
        "korean_definition": "확실한 증거. 또는 확실하게 증명함. (확증 편향: 자신의 신념과 일치하는 정보만 수용하는 경향)",
        "example_ko": "알고리즘은 이용자의 확증 편향을 강화할 우려가 있다.",
        "translations": {
            "en": ("confirmation; conclusive evidence", "Definite proof (e.g., confirmation bias: 확증 편향)."),
            "vi": ("xác chứng (thiên kiến xác nhận)", "Bằng chứng xác thực."),
            "zh": ("确证（确认偏误）", "确凿的证据或证实。"),
            "ja": ("確証（確証バイアス）", "確実な証拠、または確実に証明すること。"),
        },
    },
    {
        "lemma": "시급하다",
        "target_code": "20206",
        "pronunciation": "시그파다",
        "part_of_speech": "형용사",
        "word_grade": "중급",
        "topik_level": 4,
        "category": "사회·논술54번",
        "korean_definition": "시간을 다툴 만큼 매우 급하다.",
        "example_ko": "미디어 리터러시 역량을 함양하는 일이 무엇보다 시급하다.",
        "translations": {
            "en": ("urgent; pressing", "So urgent that there is no time to lose."),
            "vi": ("cấp bách, khẩn cấp", "Rất gấp gáp, cần giải quyết ngay."),
            "zh": ("迫切，当务之急", "争分夺秒般非常紧急。"),
            "ja": ("急務だ。差し迫っている", "一刻を争うほど非常に急を要する。"),
        },
    },
    {
        "lemma": "고령화",
        "target_code": "20207",
        "pronunciation": "고령화",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "topik_level": 4,
        "category": "인구·쓰기53번",
        "korean_definition": "전체 인구에서 노인 인구가 차지하는 비율이 높아지는 현상.",
        "example_ko": "고령화로 인한 독거노인 증가가 1인 가구 급증의 주요 원인이다.",
        "translations": {
            "en": ("aging population", "The phenomenon where the proportion of elderly people increases."),
            "vi": ("sự già hóa dân số", "Hiện tượng tỷ lệ người cao tuổi trong tổng dân số tăng lên."),
            "zh": ("老龄化", "老年人口在总人口中所占比例升高的现象。"),
            "ja": ("高齢化", "総人口に占める高齢者の割合が高くなる現象。"),
        },
    },
    {
        "lemma": "풍요",
        "target_code": "30207",
        "pronunciation": "풍요",
        "part_of_speech": "명사",
        "word_grade": "고급",
        "topik_level": 5,
        "category": "경제·논술54번",
        "korean_definition": "부족함이 없이 넉넉하고 많음.",
        "example_ko": "현대 사회는 경제 성장으로 물질적인 풍요를 이루었다.",
        "translations": {
            "en": ("abundance; affluence; prosperity", "Having plenty without any shortage."),
            "vi": ("sự phong phú, sung túc", "Sự dồi dào, đầy đủ về vật chất."),
            "zh": ("丰饶，富足", "富足充裕，毫不缺乏。"),
            "ja": ("豊饒。豊かさ", "不足がなく豊かで満ち足りていること。"),
        },
    },
    {
        "lemma": "그러나",
        "target_code": "31201",
        "pronunciation": "그러나",
        "part_of_speech": "부사",
        "word_grade": "초급",
        "topik_level": 1,
        "category": "접속부사",
        "korean_definition": "앞의 내용과 상반되는 내용을 이끌 때 쓰는 접속 부사.",
        "example_ko": "무조건 잠을 줄이는 것은 건강에 해롭다.",
        "translations": {
            "en": ("however; but", "Conjunctive adverb introducing contrasting content."),
            "vi": ("tuy nhiên, nhưng", "Phó từ liên kết dẫn dắt nội dung trái ngược."),
            "zh": ("但是，然而", "引出与前文相反内容的连接副词。"),
            "ja": ("しかし。だが", "前の内容と相反する内容を導く接続副詞。"),
        },
    },
    {
        "lemma": "따라서",
        "target_code": "39120",
        "pronunciation": "따라서",
        "part_of_speech": "부사",
        "word_grade": "중급",
        "topik_level": 3,
        "category": "접속부사",
        "korean_definition": "앞의 내용이 뒤의 내용의 원인이나 근거가 됨을 나타내는 접속 부사.",
        "example_ko": "따라서 건강을 지키려면 하루 7시간 이상의 숙면이 필요하다.",
        "translations": {
            "en": ("therefore; consequently", "Conjunctive adverb indicating cause and conclusion."),
            "vi": ("do đó, vì vậy", "Phó từ liên kết chỉ kết quả hoặc kết luận."),
            "zh": ("因此，所以", "表示前文是后文原因或根据的连接副词。"),
            "ja": ("したがって。よって", "前の内容が後の内容の根拠になることを表す接続副詞。"),
        },
    },
]

CURATED_VOCAB_LIST.extend(EXTRA_VOCAB_LIST)

VOCAB_LOOKUP_BY_LEMMA: Dict[str, Dict[str, Any]] = {
    item["lemma"]: item for item in CURATED_VOCAB_LIST
}
