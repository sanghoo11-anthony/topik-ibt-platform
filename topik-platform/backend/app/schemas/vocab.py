from typing import List, Optional
from pydantic import BaseModel


class SenseItem(BaseModel):
    sense_order: int
    korean_definition: str
    translated_word: Optional[str] = None
    translated_definition: Optional[str] = None


class VocabTooltipResponse(BaseModel):
    clicked_surface: str
    lemma: str
    target_code: str
    pronunciation: Optional[str] = None
    part_of_speech: Optional[str] = None
    word_grade: Optional[str] = None
    senses: List[SenseItem]
    is_mock: bool = False
