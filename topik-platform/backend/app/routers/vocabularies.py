import json
import re
from typing import Dict, Optional

import httpx
import xmltodict
from fastapi import APIRouter, Query
from kiwipiepy import Kiwi

from app.core.config import settings
from app.core.database import redis_client
from app.schemas.vocab import VocabTooltipResponse

router = APIRouter(prefix="/api/v1/vocabularies", tags=["vocabularies"])

kiwi = Kiwi()

LANG_CODE_MAP = {
    "en": "1",
    "ja": "2",
    "fr": "3",
    "es": "4",
    "ar": "5",
    "mn": "6",
    "vi": "7",
    "th": "8",
    "id": "9",
    "ru": "10",
    "zh": "11",
}

POS_KOREAN_MAP = {
    "NNG": "명사",
    "NNP": "고유명사",
    "NNB": "의존명사",
    "VV": "동사",
    "VA": "형용사",
    "VX": "보조용언",
    "MAG": "부사",
    "MAJ": "접속부사",
}

MOCK_VOCAB_DB: Dict[str, dict] = {
    "그러나": {
        "target_code": "31201",
        "pronunciation": "그러나",
        "part_of_speech": "부사",
        "word_grade": "초급",
        "korean_definition": "앞의 내용과 상반되는 내용을 이끌 때 쓰는 접속 부사.",
        "translations": {
            "en": ("however; but", "A conjunctive adverb used to introduce content that contrasts with what precedes it."),
            "ja": ("しかし。だが", "前の内容と相反する内容を導く接続副詞。"),
            "zh": ("但是，然而", "连接副词，用于引出与前面内容相反的内容。"),
            "vi": ("tuy nhiên, nhưng", "Phó từ liên kết dùng khi dẫn dắt nội dung trái ngược với nội dung phía trước."),
        },
    },
    "무조건": {
        "target_code": "48102",
        "pronunciation": "무조건",
        "part_of_speech": "부사",
        "word_grade": "중급",
        "korean_definition": "아무런 조건이나 단서가 없이.",
        "translations": {
            "en": ("unconditionally; blindly", "Without any conditions or provisos."),
            "ja": ("無条件に。むやみに", "何の条件や前提もなしに。"),
            "zh": ("无条件地，盲目地", "没有任何条件或前提。"),
            "vi": ("vô điều kiện", "Không có bất kỳ điều kiện hay ràng buộc nào."),
        },
    },
    "잠": {
        "target_code": "65110",
        "pronunciation": "잠",
        "part_of_speech": "명사",
        "word_grade": "초급",
        "korean_definition": "눈을 감고 몸과 정신의 활동을 쉬는 상태.",
        "translations": {
            "en": ("sleep; slumber", "A state of resting bodily and mental activity with eyes closed."),
            "ja": ("眠り。睡眠", "目を閉じて体と心の活動を休める状態。"),
            "zh": ("觉，睡眠", "闭上眼睛使身体和精神活动休息的状态。"),
            "vi": ("giấc ngủ", "Trạng thái nhắm mắt và nghỉ ngơi các hoạt động của cơ thể và tinh thần."),
        },
    },
    "줄이다": {
        "target_code": "67812",
        "pronunciation": "주리다",
        "part_of_speech": "동사",
        "word_grade": "초급",
        "korean_definition": "물건의 길이나 넓이, 부피, 수량, 시간 등을 본래보다 작거나 적게 하다.",
        "translations": {
            "en": ("reduce; decrease; cut down", "To make the length, area, volume, quantity, or time smaller or less than before."),
            "ja": ("減らす。縮める", "長さや広さ、数量、時間などを本来より小さく、または少なくする。"),
            "zh": ("减少，缩短", "使物体的长度、面积、体积、数量或时间等比原来变小或变少。"),
            "vi": ("giảm bớt, rút ngắn", "Làm cho chiều dài, diện tích, số lượng hay thời gian nhỏ hơn hoặc ít hơn ban đầu."),
        },
    },
    "건강": {
        "target_code": "15920",
        "pronunciation": "건강",
        "part_of_speech": "명사",
        "word_grade": "초급",
        "korean_definition": "정신적으로나 육체적으로 아무 탈이 없고 튼튼함.",
        "translations": {
            "en": ("health; wellness", "Being mentally and physically sound and strong without any trouble."),
            "ja": ("健康", "精神的にも肉体的にも異常がなく丈夫なこと。"),
            "zh": ("健康", "精神上或肉体上没有任何毛病且强壮。"),
            "vi": ("sức khỏe", "Sự khỏe mạnh, không có vấn đề gì về mặt tinh thần hay thể chất."),
        },
    },
    "해롭다": {
        "target_code": "79210",
        "pronunciation": "해롭따",
        "part_of_speech": "형용사",
        "word_grade": "중급",
        "korean_definition": "해가 되거나 나쁜 영향을 끼치는 데가 있다.",
        "translations": {
            "en": ("harmful; detrimental", "Causing harm or having a bad effect."),
            "ja": ("有害だ。害になる", "害になったり悪い影響を及ぼしたりするところがある。"),
            "zh": ("有害", "造成危害或产生不良影响。"),
            "vi": ("có hại", "Gây hại hoặc có ảnh hưởng xấu."),
        },
    },
    "현대인": {
        "target_code": "81045",
        "pronunciation": "현대인",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "korean_definition": "현대를 살아가는 사람.",
        "translations": {
            "en": ("modern people; contemporaries", "People living in the modern era."),
            "ja": ("現代人", "現代を生きる人。"),
            "zh": ("现代人", "生活在现代的人。"),
            "vi": ("người hiện đại", "Con người sống trong thời kỳ hiện đại."),
        },
    },
    "바쁘다": {
        "target_code": "49001",
        "pronunciation": "바쁘다",
        "part_of_speech": "형용사",
        "word_grade": "초급",
        "korean_definition": "하는 일이 많아서 다른 겨를이 없다.",
        "translations": {
            "en": ("busy", "Having so much work to do that there is no spare time."),
            "ja": ("忙しい", "することが多くて他の余裕がない。"),
            "zh": ("忙，忙碌", "事情很多，没有别的空闲。"),
            "vi": ("bận, bận rộn", "Có nhiều việc phải làm nên không có thời gian rảnh."),
        },
    },
    "일상": {
        "target_code": "61204",
        "pronunciation": "일쌍",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "korean_definition": "날마다 반복되는 평상시의 생활.",
        "translations": {
            "en": ("daily life; everyday routine", "Ordinary life repeated every day."),
            "ja": ("日常", "毎日繰り返される普段の生活。"),
            "zh": ("日常", "每天重复的平时生活。"),
            "vi": ("cuộc sống thường nhật", "Cuộc sống bình thường lặp đi lặp lại hằng ngày."),
        },
    },
    "수면": {
        "target_code": "55103",
        "pronunciation": "수면",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "korean_definition": "잠을 자는 일. 또는 그 상태.",
        "translations": {
            "en": ("sleep", "The act or state of sleeping."),
            "ja": ("睡眠", "眠ること。また、その状態。"),
            "zh": ("睡眠", "睡觉，或指那种状态。"),
            "vi": ("giấc ngủ, sự ngủ", "Việc ngủ hoặc trạng thái đó."),
        },
    },
    "시간": {
        "target_code": "55890",
        "pronunciation": "시간",
        "part_of_speech": "명사",
        "word_grade": "초급",
        "korean_definition": "어떤 시각에서 어떤 시각까지의 사이.",
        "translations": {
            "en": ("time; hour", "The interval from one point in time to another."),
            "ja": ("時間", "ある時刻からある時刻までの間。"),
            "zh": ("时间", "从某一时刻到另一时刻的间隔。"),
            "vi": ("thời gian, tiếng đồng hồ", "Khoảng cách từ thời điểm nào đó đến thời điểm nào đó."),
        },
    },
    "충분하다": {
        "target_code": "71088",
        "pronunciation": "충분하다",
        "part_of_speech": "형용사",
        "word_grade": "초급",
        "korean_definition": "부족함이 없이 넉넉하다.",
        "translations": {
            "en": ("enough; sufficient; ample", "Plenty and without any lack."),
            "ja": ("十分だ", "不足がなく豊かだ。"),
            "zh": ("充分，充足", "没有不足，很充裕。"),
            "vi": ("đầy đủ", "Dồi dào, không thiếu thốn."),
        },
    },
    "취하다": {
        "target_code": "72015",
        "pronunciation": "취하다",
        "part_of_speech": "동사",
        "word_grade": "중급",
        "korean_definition": "일정한 조건이나 상태 등을 가지거나 누리다.",
        "translations": {
            "en": ("take; get; adopt", "To have or enjoy a certain condition or state (e.g., rest or sleep)."),
            "ja": ("とる", "一定の条件や状態などを持ったり享受したりする。"),
            "zh": ("采取，取得", "拥有或享受一定的条件或状态（如休息、睡眠）。"),
            "vi": ("lấy, dành lấy", "Có hoặc hưởng điều kiện hay trạng thái nhất định."),
        },
    },
    "면역력": {
        "target_code": "45912",
        "pronunciation": "며녕녁",
        "part_of_speech": "명사",
        "word_grade": "고급",
        "korean_definition": "외부에서 들어온 병원균에 저항하는 힘.",
        "translations": {
            "en": ("immunity; immune system strength", "The power to resist pathogens entering from outside."),
            "ja": ("免疫力", "外部から入った病原菌に抵抗する力。"),
            "zh": ("免疫力", "抵抗从外部侵入的病原菌的能力。"),
            "vi": ("sức đề kháng, khả năng miễn dịch", "Sức mạnh chống lại vi khuẩn gây bệnh xâm nhập từ bên ngoài."),
        },
    },
    "유지되다": {
        "target_code": "60501",
        "pronunciation": "유지되다",
        "part_of_speech": "동사",
        "word_grade": "중급",
        "korean_definition": "어떤 상태나 상황이 그대로 보존되거나 계속되다.",
        "translations": {
            "en": ("be maintained; be preserved", "For a certain state or situation to be preserved or continued as it is."),
            "ja": ("維持される", "ある状態や状況がそのまま保たれたり続いたりする。"),
            "zh": ("维持，保持", "某种状态或情况原样保存或持续下去。"),
            "vi": ("được duy trì", "Trạng thái hay tình huống nào đó được bảo tồn hoặc tiếp tục như cũ."),
        },
    },
    "집중력": {
        "target_code": "69011",
        "pronunciation": "집쭝녁",
        "part_of_speech": "명사",
        "word_grade": "중급",
        "korean_definition": "마음이나 주의를 한곳에 모으는 힘.",
        "translations": {
            "en": ("concentration; focus", "The ability to gather one's mind or attention in one place."),
            "ja": ("集中力", "心や注意を一箇所に集める力。"),
            "zh": ("注意力，集中力", "把心思或注意力集中在一处的力量。"),
            "vi": ("khả năng tập trung", "Sức mạnh tập trung tâm trí hoặc sự chú ý vào một nơi."),
        },
    },
    "높다": {
        "target_code": "34011",
        "pronunciation": "놉따",
        "part_of_speech": "형용사",
        "word_grade": "초급",
        "korean_definition": "수준이나 정도가 보통보다 위에 있다.",
        "translations": {
            "en": ("high; elevated", "Being above average in level or degree."),
            "ja": ("高い", "水準や程度が普通より上にある。"),
            "zh": ("高", "水平或程度在一般之上。"),
            "vi": ("cao", "Trình độ hay mức độ ở trên mức bình thường."),
        },
    },
    "따라서": {
        "target_code": "39120",
        "pronunciation": "따라서",
        "part_of_speech": "부사",
        "word_grade": "중급",
        "korean_definition": "앞의 내용이 뒤의 내용의 원인이나 근거가 됨을 나타내는 접속 부사.",
        "translations": {
            "en": ("therefore; consequently; thus", "Conjunctive adverb indicating the preceding statement is the reason for the following one."),
            "ja": ("したがって。よって", "前の内容が後の内容の原因や根拠になることを表す接続副詞。"),
            "zh": ("因此，所以", "表示前面的内容是后面内容的原因或根据的连接副词。"),
            "vi": ("do đó, vì vậy", "Phó từ liên kết biểu thị nội dung phía trước là nguyên nhân hay căn cứ cho nội dung phía sau."),
        },
    },
    "지키다": {
        "target_code": "68302",
        "pronunciation": "지키다",
        "part_of_speech": "동사",
        "word_grade": "초급",
        "korean_definition": "초래될 수 있는 위험이나 손실로부터 보호하고 유지하다.",
        "translations": {
            "en": ("protect; keep; maintain", "To protect and maintain from potential danger or loss."),
            "ja": ("守る。保つ", "危険や損失から保護し維持する。"),
            "zh": ("守护，保持", "保护并维持，免受可能招致的危险或损失。"),
            "vi": ("giữ gìn, bảo vệ", "Bảo vệ và duy trì khỏi nguy hiểm hay tổn thất có thể xảy ra."),
        },
    },
    "숙면": {
        "target_code": "56022",
        "pronunciation": "숭면",
        "part_of_speech": "명사",
        "word_grade": "고급",
        "korean_definition": "깊이 든 잠.",
        "translations": {
            "en": ("deep sleep; sound sleep", "A deep, restful sleep."),
            "ja": ("熟睡", "深く眠ること。"),
            "zh": ("熟睡，酣睡", "深沉的睡眠。"),
            "vi": ("giấc ngủ sâu", "Giấc ngủ say và sâu."),
        },
    },
    "필요하다": {
        "target_code": "77001",
        "pronunciation": "피료하다",
        "part_of_speech": "형용사",
        "word_grade": "초급",
        "korean_definition": "반드시 요구되거나 있어야 하다.",
        "translations": {
            "en": ("necessary; needed; essential", "Being definitely required or needed."),
            "ja": ("必要だ", "必ず求められたり無くてはならなかったりする。"),
            "zh": ("需要，必要", "必须要求或必须具备。"),
            "vi": ("cần thiết", "Nhất định được yêu cầu hoặc phải có."),
        },
    },
}


def clean_surface_token(surface: str) -> str:
    cleaned = re.sub(r"^\([가-하]\)\s*", "", surface.strip())
    cleaned = re.sub(r"^[^\w가-힣]+|[^\w가-힣]+$", "", cleaned)
    return cleaned or surface.strip()


def extract_dictionary_lemma(surface_token: str) -> tuple[str, str]:
    """
    Returns (lemma, part_of_speech_ko) using Kiwipiepy morphological analysis.
    Handles NNG+XSV/XSA (e.g., 유지되다, 해롭다, 필요하다), NNG+XSN (e.g., 집중력),
    and VV/VA/VX stems (including -I/-R conjugation tags in Kiwipiepy).
    """
    cleaned = clean_surface_token(surface_token)
    tokens = kiwi.tokenize(cleaned)
    if not tokens:
        return cleaned, "명사"
    first = tokens[0]
    base_tag = first.tag.split("-")[0]

    if first.tag.startswith("NN") and len(tokens) >= 2:
        second = tokens[1]
        if second.tag.startswith(("XSV", "XSA")):
            pos = "동사" if second.tag.startswith("XSV") else "형용사"
            return f"{first.form}{second.form}다", pos
        if second.tag == "XSN" and second.form != "들":
            return f"{first.form}{second.form}", "명사"

    if base_tag in ("VV", "VA", "VX"):
        pos = "동사" if base_tag == "VV" else "형용사"
        return f"{first.form}다", pos

    if first.tag.startswith("NN") or base_tag in ("MAG", "MAJ"):
        pos = POS_KOREAN_MAP.get(base_tag, "명사")
        return first.form, pos

    return cleaned, POS_KOREAN_MAP.get(base_tag, "어휘")


def build_mock_tooltip(lemma: str, pos_ko: str, lang_code: str) -> dict:
    """
    Fallback mock dictionary entry when KRDICT_API_KEY is not configured in development.
    """
    entry = MOCK_VOCAB_DB.get(lemma)
    if entry:
        trans_tuple = entry["translations"].get(
            lang_code,
            entry["translations"].get("en", (lemma, entry["korean_definition"])),
        )
        return {
            "lemma": lemma,
            "target_code": entry["target_code"],
            "pronunciation": entry["pronunciation"],
            "part_of_speech": entry["part_of_speech"],
            "word_grade": entry["word_grade"],
            "senses": [
                {
                    "sense_order": 1,
                    "korean_definition": entry["korean_definition"],
                    "translated_word": trans_tuple[0],
                    "translated_definition": trans_tuple[1],
                }
            ],
            "is_mock": True,
        }

    return {
        "lemma": lemma,
        "target_code": "99999",
        "pronunciation": lemma,
        "part_of_speech": pos_ko,
        "word_grade": "중급",
        "senses": [
            {
                "sense_order": 1,
                "korean_definition": f"'{lemma}'에 대한 한국어기초사전 개발용(Mock) 뜻풀이입니다.",
                "translated_word": f"{lemma} ({lang_code.upper()})",
                "translated_definition": (
                    f"[Dev Mock Mode] Sample translation definition for '{lemma}' ({pos_ko}) "
                    f"in language '{lang_code}'. Configure KRDICT_API_KEY for live NIKL dictionary data."
                ),
            }
        ],
        "is_mock": True,
    }


async def fetch_from_krdict(lemma: str, lang_code: str) -> Optional[dict]:
    trans_lang_num = LANG_CODE_MAP.get(lang_code, "1")
    params = {
        "key": settings.KRDICT_API_KEY,
        "q": lemma,
        "part": "word",
        "sort": "popular",
        "num": 10,
        "translated": "y",
        "trans_lang": trans_lang_num,
    }
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(settings.KRDICT_SEARCH_URL, params=params)
        if response.status_code != 200:
            return None

    parsed_xml = xmltodict.parse(response.text, force_list=("item", "sense", "translation"))
    items = parsed_xml.get("channel", {}).get("item", [])
    if not items:
        return None

    matched_item = next((item for item in items if item.get("word") == lemma), items[0])
    senses_list = []
    for sense in matched_item.get("sense", [])[:3]:
        translations = sense.get("translation", [])
        trans_info = translations[0] if translations else {}
        senses_list.append(
            {
                "sense_order": int(sense.get("sense_order", 1)),
                "korean_definition": sense.get("definition", ""),
                "translated_word": trans_info.get("trans_word"),
                "translated_definition": trans_info.get("trans_dfn"),
            }
        )

    return {
        "lemma": matched_item.get("word", lemma),
        "target_code": str(matched_item.get("target_code", "")),
        "pronunciation": matched_item.get("pronunciation"),
        "part_of_speech": matched_item.get("pos"),
        "word_grade": matched_item.get("word_grade"),
        "senses": senses_list,
        "is_mock": False,
    }


@router.get("/tooltip", response_model=VocabTooltipResponse)
async def get_vocabulary_tooltip(
    surface: str = Query(..., description="Clicked Korean word/token from the exam passage"),
    lang: str = Query("en", description="Target translation language code (en, ja, zh, vi, etc.)"),
):
    lemma, pos_ko = extract_dictionary_lemma(surface)
    cache_key = f"krdict:tooltip:{lemma}:{lang}"

    try:
        cached_data = await redis_client.get(cache_key)
        if cached_data:
            return VocabTooltipResponse(clicked_surface=surface, **json.loads(cached_data))
    except Exception:
        pass

    dict_result: Optional[dict] = None
    if not settings.is_krdict_mock_mode:
        try:
            dict_result = await fetch_from_krdict(lemma, lang)
            if not dict_result and lemma.endswith("하다"):
                dict_result = await fetch_from_krdict(lemma[:-2], lang)
        except Exception:
            dict_result = None

    # Fallback to Mock data when KRDICT_API_KEY is unset or live query fails in dev
    if not dict_result:
        dict_result = build_mock_tooltip(lemma, pos_ko, lang)

    try:
        await redis_client.setex(cache_key, 604800, json.dumps(dict_result, ensure_ascii=False))
    except Exception:
        pass

    return VocabTooltipResponse(clicked_surface=surface, **dict_result)
