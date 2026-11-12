import os
import json
import httpx
import xmltodict
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from kiwipiepy import Kiwi
import redis.asyncio as redis

app = FastAPI(title="TOPIK Multilingual Vocabulary Tooltip API", version="1.0.0")

kiwi = Kiwi()
redis_client = redis.from_url(
    os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    decode_responses=True
)

KRDICT_API_KEY = os.getenv("KRDICT_API_KEY", "YOUR_KRDICT_OPEN_API_KEY")
KRDICT_SEARCH_URL = "https://krdict.korean.go.kr/api/search"

LANG_CODE_MAP = {
    "en": "1", "ja": "2", "fr": "3", "es": "4", "ar": "5",
    "mn": "6", "vi": "7", "th": "8", "id": "9", "ru": "10", "zh": "11"
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
    tokens = kiwi.tokenize(surface_token)
    if not tokens:
        return surface_token
    first = tokens[0]
    if first.tag.startswith("NN") and len(tokens) >= 2 and tokens[1].tag in ("XSV", "XSA"):
        return f"{first.form}{tokens[1].form}다"
    if first.tag in ("VV", "VA", "VX"):
        return f"{first.form}다"
    if first.tag.startswith("NN") or first.tag == "MAG":
        return first.form
    return surface_token

async def fetch_from_krdict(lemma: str, lang_code: str) -> Optional[dict]:
    trans_lang_num = LANG_CODE_MAP.get(lang_code, "1")
    params = {
        "key": KRDICT_API_KEY,
        "q": lemma,
        "part": "word",
        "sort": "popular",
        "num": 10,
        "translated": "y",
        "trans_lang": trans_lang_num
    }
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(KRDICT_SEARCH_URL, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Failed to connect to KRDICT Open API")

    parsed_xml = xmltodict.parse(response.text, force_list=("item", "sense", "translation"))
    items = parsed_xml.get("channel", {}).get("item", [])
    if not items:
        return None

    matched_item = next((item for item in items if item.get("word") == lemma), items[0])
    senses_list = []
    for sense in matched_item.get("sense", [])[:3]:
        translations = sense.get("translation", [])
        trans_info = translations[0] if translations else {}
        senses_list.append({
            "sense_order": int(sense.get("sense_order", 1)),
            "korean_definition": sense.get("definition", ""),
            "translated_word": trans_info.get("trans_word"),
            "translated_definition": trans_info.get("trans_dfn")
        })

    return {
        "lemma": matched_item.get("word", lemma),
        "target_code": str(matched_item.get("target_code", "")),
        "pronunciation": matched_item.get("pronunciation"),
        "part_of_speech": matched_item.get("pos"),
        "word_grade": matched_item.get("word_grade"),
        "senses": senses_list
    }

@app.get("/api/v1/vocabularies/tooltip", response_model=VocabTooltipResponse)
async def get_vocabulary_tooltip(
    surface: str = Query(...),
    lang: str = Query("en")
):
    lemma = extract_dictionary_lemma(surface.strip())
    cache_key = f"krdict:tooltip:{lemma}:{lang}"
    try:
        cached_data = await redis_client.get(cache_key)
        if cached_data:
            return VocabTooltipResponse(clicked_surface=surface, **json.loads(cached_data))
    except Exception:
        pass

    dict_result = await fetch_from_krdict(lemma, lang)
    if not dict_result and lemma.endswith("하다"):
        dict_result = await fetch_from_krdict(lemma[:-2], lang)

    if not dict_result:
        raise HTTPException(status_code=404, detail=f"No dictionary entry for '{surface}' ({lemma})")

    try:
        await redis_client.setex(cache_key, 604800, json.dumps(dict_result, ensure_ascii=False))
    except Exception:
        pass

    return VocabTooltipResponse(clicked_surface=surface, **dict_result)