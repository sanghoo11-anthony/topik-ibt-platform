import os
import re
import json
import httpx
import xmltodict
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kiwipiepy import Kiwi
import redis.asyncio as redis
from dotenv import load_dotenv

from app.routers import exams

load_dotenv()

app = FastAPI(title="TOPIK Platform Backend", version="1.0.0")

# 프론트엔드 연동을 위한 CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 시험 세션 시작/자동저장/제출/리포트 라우터 등록
app.include_router(exams.router)

kiwi = Kiwi()
redis_client = redis.from_url(
    os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    decode_responses=True
)

KRDICT_API_KEY = os.getenv("KRDICT_API_KEY", "")
KRDICT_SEARCH_URL = "https://krdict.korean.go.kr/api/search"

LANG_CODE_MAP = {
    "en": "1", "ja": "2", "fr": "3", "es": "4", "ar": "5",
    "mn": "6", "vi": "7", "th": "8", "id": "9", "ru": "10", "zh": "11"
}

# 로컬 테스트용 모의 사전 (API Key 미등록 시 자동 활용)
MOCK_DICTIONARY = {
    "그러나": {
        "lemma": "그러나", "target_code": "31201", "pronunciation": "그러나",
        "part_of_speech": "부사", "word_grade": "초급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "앞의 내용과 상반되는 내용을 이끌 때 쓰는 접속 부사.",
            "translated_word": "however; but",
            "translated_definition": "A conjunctive adverb used to introduce contrasting content."
        }]
    },
    "무조건": {
        "lemma": "무조건", "target_code": "48102", "pronunciation": "무조건",
        "part_of_speech": "부사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "아무런 조건이나 단서가 없이.",
            "translated_word": "unconditionally; blindly",
            "translated_definition": "Without any conditions or provisos."
        }]
    },
    "잠": {
        "lemma": "잠", "target_code": "65110", "pronunciation": "잠",
        "part_of_speech": "명사", "word_grade": "초급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "눈을 감고 몸과 정신의 활동을 쉬는 상태.",
            "translated_word": "sleep; slumber",
            "translated_definition": "A state of resting bodily and mental activity with eyes closed."
        }]
    },
    "줄이다": {
        "lemma": "줄이다", "target_code": "67812", "pronunciation": "주리다",
        "part_of_speech": "동사", "word_grade": "초급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "물건의 길이나 넓이, 수량, 시간 등을 본래보다 작거나 적게 하다.",
            "translated_word": "reduce; decrease; cut down",
            "translated_definition": "To make length, quantity, or time smaller or less than before."
        }]
    },
    "건강": {
        "lemma": "건강", "target_code": "15920", "pronunciation": "건강",
        "part_of_speech": "명사", "word_grade": "초급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "정신적으로나 육체적으로 아무 탈이 없고 튼튼함.",
            "translated_word": "health; wellness",
            "translated_definition": "Being mentally and physically sound and strong."
        }]
    },
    "해롭다": {
        "lemma": "해롭다", "target_code": "79210", "pronunciation": "해롭따",
        "part_of_speech": "형용사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "해가 되거나 나쁜 영향을 끼치는 데가 있다.",
            "translated_word": "harmful; detrimental",
            "translated_definition": "Causing harm or having a bad effect."
        }]
    },
    "현대인": {
        "lemma": "현대인", "target_code": "81045", "pronunciation": "현대인",
        "part_of_speech": "명사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "현대를 살아가는 사람.",
            "translated_word": "modern people; contemporaries",
            "translated_definition": "People living in the modern era."
        }]
    },
    "일상": {
        "lemma": "일상", "target_code": "61204", "pronunciation": "일쌍",
        "part_of_speech": "명사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "날마다 반복되는 평상시의 생활.",
            "translated_word": "daily life; everyday routine",
            "translated_definition": "Ordinary life repeated every day."
        }]
    },
    "수면": {
        "lemma": "수면", "target_code": "55103", "pronunciation": "수면",
        "part_of_speech": "명사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "잠을 자는 일. 또는 그 상태.",
            "translated_word": "sleep",
            "translated_definition": "The act or state of sleeping."
        }]
    },
    "충분하다": {
        "lemma": "충분하다", "target_code": "71088", "pronunciation": "충분하다",
        "part_of_speech": "형용사", "word_grade": "초급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "부족함이 없이 넉넉하다.",
            "translated_word": "enough; sufficient; ample",
            "translated_definition": "Plenty and without any lack."
        }]
    },
    "면역력": {
        "lemma": "면역력", "target_code": "32750", "pronunciation": "며녕녁",
        "part_of_speech": "명사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "외부에서 들어온 병원균에 저항하는 힘.",
            "translated_word": "immunity",
            "translated_definition": "The power to resist germs that have entered from the outside."
        }]
    },
    "유지되다": {
        "lemma": "유지되다", "target_code": "60501", "pronunciation": "유지되다",
        "part_of_speech": "동사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "어떤 상태나 상황이 그대로 보존되거나 계속되다.",
            "translated_word": "be maintained; be preserved",
            "translated_definition": "For a state or situation to be preserved or continued."
        }]
    },
    "집중력": {
        "lemma": "집중력", "target_code": "69011", "pronunciation": "집쭝녁",
        "part_of_speech": "명사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "마음이나 주의를 한곳에 모으는 힘.",
            "translated_word": "concentration; focus",
            "translated_definition": "The ability to gather one's mind or attention in one place."
        }]
    },
    "따라서": {
        "lemma": "따라서", "target_code": "39120", "pronunciation": "따라서",
        "part_of_speech": "부사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "앞의 내용이 뒤의 내용의 원인이나 근거가 됨을 나타내는 접속 부사.",
            "translated_word": "therefore; consequently",
            "translated_definition": "Conjunctive adverb indicating the preceding statement is the reason."
        }]
    },
    "지키다": {
        "lemma": "지키다", "target_code": "68302", "pronunciation": "지키다",
        "part_of_speech": "동사", "word_grade": "초급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "초래될 수 있는 위험이나 손실로부터 보호하고 유지하다.",
            "translated_word": "protect; keep; maintain",
            "translated_definition": "To protect and maintain from potential danger or loss."
        }]
    },
    "숙면": {
        "lemma": "숙면", "target_code": "41203", "pronunciation": "숭면",
        "part_of_speech": "명사", "word_grade": "중급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "잠을 아주 깊이 자는 일.",
            "translated_word": "deep sleep; sound sleep",
            "translated_definition": "The state of sleeping very deeply."
        }]
    },
    "필요하다": {
        "lemma": "필요하다", "target_code": "77001", "pronunciation": "피료하다",
        "part_of_speech": "형용사", "word_grade": "초급",
        "senses": [{
            "sense_order": 1,
            "korean_definition": "반드시 요구되거나 있어야 하다.",
            "translated_word": "necessary; needed; essential",
            "translated_definition": "Being definitely required or needed."
        }]
    }
}

class SenseItem(BaseModel):
    sense_order: int
    korean_definition: str
    translated_word: Optional[str] = None
    translated_definition: Optional[str] = None

class VocabTooltipResponse(BaseModel):
    clicked_surface: str
    lemma: str
    target_code: str
    pronunciation: Optional[str]
    part_of_speech: Optional[str]
    word_grade: Optional[str]
    senses: List[SenseItem]

def extract_dictionary_lemma(surface_token: str) -> str:
    cleaned = re.sub(r"^\([가-하]\)\s*", "", surface_token.strip())
    cleaned = re.sub(r"^[^\w가-힣]+|[^\w가-힣]+$", "", cleaned) or surface_token.strip()
    tokens = kiwi.tokenize(cleaned)
    if not tokens:
        return cleaned
    first = tokens[0]
    base_tag = first.tag.split("-")[0]
    if first.tag.startswith("NN") and len(tokens) >= 2:
        second = tokens[1]
        if second.tag.startswith(("XSV", "XSA")):
            return f"{first.form}{second.form}다"
        if second.tag == "XSN" and second.form != "들":
            return f"{first.form}{second.form}"
    if base_tag in ("VV", "VA", "VX"):
        return f"{first.form}다"
    if first.tag.startswith("NN") or base_tag in ("MAG", "MAJ"):
        return first.form
    return cleaned

@app.get("/api/v1/vocabularies/tooltip", response_model=VocabTooltipResponse)
async def get_vocabulary_tooltip(surface: str = Query(...), lang: str = Query("en")):
    lemma = extract_dictionary_lemma(surface.strip())
    cache_key = f"krdict:{lemma}:{lang}"

    # 1. Redis 캐시 확인
    try:
        cached = await redis_client.get(cache_key)
        if cached:
            return VocabTooltipResponse(clicked_surface=surface, **json.loads(cached))
    except Exception:
        pass

    # 2. Open API 호출 또는 Mock 데이터 활용
    dict_data = None
    if KRDICT_API_KEY and KRDICT_API_KEY not in ("YOUR_API_KEY_HERE", "YOUR_KRDICT_OPEN_API_KEY"):
        try:
            params = {
                "key": KRDICT_API_KEY, "q": lemma, "part": "word",
                "sort": "popular", "num": 5, "translated": "y",
                "trans_lang": LANG_CODE_MAP.get(lang, "1")
            }
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(KRDICT_SEARCH_URL, params=params)
                if res.status_code == 200:
                    parsed = xmltodict.parse(res.text, force_list=("item", "sense", "translation"))
                    items = parsed.get("channel", {}).get("item", [])
                    if items:
                        item = next((i for i in items if i.get("word") == lemma), items[0])
                        senses = []
                        for s in item.get("sense", [])[:2]:
                            tr = s.get("translation", [{}])[0]
                            senses.append({
                                "sense_order": int(s.get("sense_order", 1)),
                                "korean_definition": s.get("definition", ""),
                                "translated_word": tr.get("trans_word"),
                                "translated_definition": tr.get("trans_dfn")
                            })
                        dict_data = {
                            "lemma": item.get("word", lemma),
                            "target_code": str(item.get("target_code", "")),
                            "pronunciation": item.get("pronunciation"),
                            "part_of_speech": item.get("pos"),
                            "word_grade": item.get("word_grade"),
                            "senses": senses
                        }
        except Exception:
            dict_data = None

    # Fallback 데이터 매핑
    if not dict_data:
        dict_data = MOCK_DICTIONARY.get(lemma, {
            "lemma": lemma, "target_code": "00000", "pronunciation": lemma,
            "part_of_speech": "단어", "word_grade": "초/중급",
            "senses": [{
                "sense_order": 1,
                "korean_definition": f"'{lemma}'에 대한 한국어기초사전 뜻풀이입니다.",
                "translated_word": f"{lemma} ({lang.upper()})",
                "translated_definition": f"Multilingual dictionary definition of '{lemma}' in {lang.upper()}."
            }]
        })

    # 캐시 저장 (7일)
    try:
        await redis_client.setex(cache_key, 604800, json.dumps(dict_data, ensure_ascii=False))
    except Exception:
        pass

    return VocabTooltipResponse(clicked_surface=surface, **dict_data)

# 모의시험 문제 조회 API
@app.get("/api/v1/exams/sample")
def get_sample_exam():
    return {
        "exam_title": "제91회 TOPIK II 실전 모의고사 (읽기)",
        "time_limit_seconds": 4200,
        "question": {
            "number": 13,
            "points": 2,
            "prompt": "다음 문장을 논리적 순서에 맞게 배열한 것을 고르십시오.",
            "passage": "(가) 그러나 무조건 잠을 줄이는 것은 건강에 해롭다.\n(나) 현대인들은 바쁜 일상 속에서 수면 시간을 줄이곤 한다.\n(다) 충분한 수면을 취해야 면역력이 유지되고 집중력도 높아진다.\n(라) 따라서 건강을 지키려면 하루 7시간 이상의 숙면이 필요하다.",
            "options": [
                "(나) - (가) - (다) - (라)",
                "(나) - (라) - (가) - (다)",
                "(다) - (가) - (나) - (라)",
                "(다) - (라) - (가) - (나)"
            ],
            "correct_index": 0
        }
    }
