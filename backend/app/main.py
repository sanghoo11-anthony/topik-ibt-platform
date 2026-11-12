import os
import re
import json
import httpx
import xmltodict
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kiwipiepy import Kiwi
import redis.asyncio as redis
from dotenv import load_dotenv

from app.routers import exams
from app.data.study_bank import (
    CURATED_VOCAB_LIST,
    GRAMMAR_PATTERNS,
    IDIOMS_AND_PROVERBS,
    QUESTION_BANK,
    VOCAB_LOOKUP_BY_LEMMA,
    WRITING_TEMPLATES,
    YOUTUBE_AND_WEB_RESOURCES,
)

load_dotenv()

app = FastAPI(title="TOPIK Platform Backend", version="2.0.0")

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


def extract_dictionary_lemma_and_pos(surface_token: str) -> tuple[str, str]:
    cleaned = re.sub(r"^\([가-하]\)\s*", "", surface_token.strip())
    cleaned = re.sub(r"^[^\w가-힣]+|[^\w가-힣]+$", "", cleaned) or surface_token.strip()
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
        return first.form, POS_KOREAN_MAP.get(base_tag, "명사")
    return cleaned, POS_KOREAN_MAP.get(base_tag, "어휘")


def build_curated_tooltip(lemma: str, pos_ko: str, lang: str) -> Dict[str, Any]:
    entry = VOCAB_LOOKUP_BY_LEMMA.get(lemma)
    if entry:
        translations = entry.get("translations", {})
        trans_tuple = translations.get(
            lang,
            translations.get("en", (lemma, entry["korean_definition"])),
        )
        return {
            "lemma": lemma,
            "target_code": entry.get("target_code", "10000"),
            "pronunciation": entry.get("pronunciation", lemma),
            "part_of_speech": entry.get("part_of_speech", pos_ko),
            "word_grade": entry.get("word_grade", "중급"),
            "senses": [
                {
                    "sense_order": 1,
                    "korean_definition": entry["korean_definition"],
                    "translated_word": trans_tuple[0] if lang != "ko" else lemma,
                    "translated_definition": (
                        f"예문: {entry.get('example_ko', '')}"
                        if lang == "ko"
                        else trans_tuple[1]
                    ),
                }
            ],
        }

    return {
        "lemma": lemma,
        "target_code": "00000",
        "pronunciation": lemma,
        "part_of_speech": pos_ko,
        "word_grade": "중급",
        "senses": [
            {
                "sense_order": 1,
                "korean_definition": f"'{lemma}' ({pos_ko}) — 문맥 속 핵심 한국어 어휘입니다.",
                "translated_word": f"{lemma} ({lang.upper()})",
                "translated_definition": f"Korean vocabulary '{lemma}' ({pos_ko}) analyzed via Kiwipiepy morphological tokenizer.",
            }
        ],
    }


@app.get("/api/v1/vocabularies/tooltip", response_model=VocabTooltipResponse)
async def get_vocabulary_tooltip(surface: str = Query(...), lang: str = Query("ko")):
    lemma, pos_ko = extract_dictionary_lemma_and_pos(surface.strip())
    cache_key = f"krdict:v2:{lemma}:{lang}"

    # 1. Redis 캐시 확인
    try:
        cached = await redis_client.get(cache_key)
        if cached:
            return VocabTooltipResponse(clicked_surface=surface, **json.loads(cached))
    except Exception:
        pass

    # 2. Open API 호출 또는 내장 대규모 TOPIK 어휘 DB 활용
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

    if not dict_data:
        dict_data = build_curated_tooltip(lemma, pos_ko, lang)

    try:
        await redis_client.setex(cache_key, 604800, json.dumps(dict_data, ensure_ascii=False))
    except Exception:
        pass

    return VocabTooltipResponse(clicked_surface=surface, **dict_data)


@app.get("/api/v1/vocabularies/list")
def list_curated_vocabularies(
    level: Optional[int] = Query(None, description="Filter by TOPIK level 1..6"),
    grade: Optional[str] = Query(None, description="Filter by 초급 / 중급 / 고급"),
    q: Optional[str] = Query(None, description="Search query"),
):
    items = CURATED_VOCAB_LIST
    if level is not None:
        items = [w for w in items if w.get("topik_level") == level]
    if grade:
        items = [w for w in items if w.get("word_grade") == grade]
    if q:
        q_clean = q.strip().lower()
        items = [
            w for w in items
            if q_clean in w["lemma"].lower()
            or q_clean in w["korean_definition"].lower()
            or q_clean in w.get("category", "").lower()
        ]
    return {"total": len(items), "items": items}


@app.get("/api/v1/study-data")
def get_comprehensive_study_data(
    level: Optional[int] = Query(None, description="Target TOPIK level (1..6)"),
):
    questions = QUESTION_BANK
    if level is not None:
        filtered_qs = [
            q for q in QUESTION_BANK
            if level in q.get("target_levels", []) or q.get("difficulty_level") == level
        ]
        if filtered_qs:
            questions = filtered_qs

    return {
        "questions_count": len(questions),
        "questions": questions,
        "vocabularies_count": len(CURATED_VOCAB_LIST),
        "vocabularies": CURATED_VOCAB_LIST,
        "grammar_patterns": GRAMMAR_PATTERNS,
        "idioms_and_proverbs": IDIOMS_AND_PROVERBS,
        "writing_templates": WRITING_TEMPLATES,
        "youtube_and_web_resources": YOUTUBE_AND_WEB_RESOURCES,
    }


# 모의시험 문제 조회 API
@app.get("/api/v1/exams/sample")
def get_sample_exam():
    return {
        "exam_title": "제91회 TOPIK I·II 통합 실전 모의고사",
        "time_limit_seconds": 7200,
        "total_questions": len(QUESTION_BANK),
        "questions": QUESTION_BANK,
    }
