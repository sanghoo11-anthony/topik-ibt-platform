"use client";

import { CURATED_VOCAB_ITEMS, PASSAGE_VOCAB_DICTIONARY } from "@/data/studyData";
import { SUPPORTED_LANGUAGES, VocabTooltipResponse } from "@/types/exam";

const IRREGULAR_STEM_MAP: Record<string, { lemma: string; pos: string }> = {
  추웠: { lemma: "춥다", pos: "형용사" },
  추워: { lemma: "춥다", pos: "형용사" },
  추우: { lemma: "춥다", pos: "형용사" },
  더웠: { lemma: "덥다", pos: "형용사" },
  더워: { lemma: "덥다", pos: "형용사" },
  비쌌: { lemma: "비싸다", pos: "형용사" },
  비싸: { lemma: "비싸다", pos: "형용사" },
  가까웠: { lemma: "가깝다", pos: "형용사" },
  가까워: { lemma: "가깝다", pos: "형용사" },
  어려웠: { lemma: "어렵다", pos: "형용사" },
  어려워: { lemma: "어렵다", pos: "형용사" },
  어려우: { lemma: "어렵다", pos: "형용사" },
  나을: { lemma: "낫다", pos: "동사" },
  나아: { lemma: "낫다", pos: "동사" },
  드시면: { lemma: "드시다", pos: "동사" },
  드세요: { lemma: "드시다", pos: "동사" },
  줄이는: { lemma: "줄이다", pos: "동사" },
  줄이곤: { lemma: "줄이다", pos: "동사" },
  높아진다: { lemma: "높아지다", pos: "동사" },
  높아지는: { lemma: "높아지다", pos: "동사" },
  기르는: { lemma: "기르다", pos: "동사" },
  기를: { lemma: "기르다", pos: "동사" },
  길러야: { lemma: "기르다", pos: "동사" },
  퍼지면서: { lemma: "퍼지다", pos: "동사" },
  퍼지: { lemma: "퍼지다", pos: "동사" },
  타고났: { lemma: "타고나다", pos: "동사" },
  타고나: { lemma: "타고나다", pos: "동사" },
  늘어난: { lemma: "늘어나다", pos: "동사" },
  늘어나: { lemma: "늘어나다", pos: "동사" },
  늘어났: { lemma: "늘어나다", pos: "동사" },
  이루었: { lemma: "이루다", pos: "동사" },
  이룬: { lemma: "이루다", pos: "동사" },
  가져야: { lemma: "가지다", pos: "동사" },
  가지게: { lemma: "가지다", pos: "동사" },
  열었다: { lemma: "열다", pos: "동사" },
  열고: { lemma: "열다", pos: "동사" },
  허물고: { lemma: "허물다", pos: "동사" },
  짓는: { lemma: "짓다", pos: "동사" },
  살려: { lemma: "살리다", pos: "동사" },
  살리기: { lemma: "살리다", pos: "동사" },
  지킬: { lemma: "지키다", pos: "동사" },
  지키려면: { lemma: "지키다", pos: "동사" },
  지키는: { lemma: "지키다", pos: "동사" },
  만져: { lemma: "만지다", pos: "동사" },
  말랐: { lemma: "마르다", pos: "동사" },
  되어: { lemma: "되다", pos: "동사" },
  되었: { lemma: "되다", pos: "동사" },
  돼: { lemma: "되다", pos: "동사" },
  해: { lemma: "하다", pos: "동사" },
  했: { lemma: "하다", pos: "동사" },
  할: { lemma: "하다", pos: "동사" },
  하는: { lemma: "하다", pos: "동사" },
  하고: { lemma: "하다", pos: "동사" },
  하여: { lemma: "하다", pos: "동사" },
};

const NOUN_PARTICLES_REGEX =
  /(에서부터|으로부터|이라도|에게서|한테서|에서는|으로는|에서도|까지도|조차도|마저도|이나마|에서의|으로의|에게|한테|에서|으로|부터|까지|조차|마저|처럼|만큼|보다|하고|이나|이라|든지|이랑|랑|은|는|이|가|을|를|의|에|로|와|과|도|만|들)$/;

const VERB_ENDINGS_REGEX =
  /(았습니다|었습니다|였습니다|았지만|었지만|였지만|았어요|었어요|였어요|습니다|ㅂ니다|느라고|더라도|으려면|려면|으면서|면서|으니까|니까|아서|어서|여서|거든요|잖아요|네요|군요|어요|아요|예요|세요|으세요|시오|십시오|는다|ㄴ다|다면|으면|면|지만|으나|나|고|며|기|게|지|는|은|ㄴ|ㄹ)$/;

function stripPunctuation(token: string): string {
  return token
    .replace(/^\([가-하]\)\s*/, "")
    .replace(/^[^\w가-힣]+|[^\w가-힣]+$/g, "")
    .trim();
}

export function extractKoreanLemma(surface: string): {
  cleaned: string;
  lemma: string;
  pos: string;
} {
  const cleaned = stripPunctuation(surface);
  if (!cleaned) {
    return { cleaned: surface.trim(), lemma: surface.trim(), pos: "어휘" };
  }

  // Direct dictionary hits first
  if (
    PASSAGE_VOCAB_DICTIONARY[cleaned] ||
    CURATED_VOCAB_ITEMS.some((i) => i.lemma === cleaned)
  ) {
    const foundCurated = CURATED_VOCAB_ITEMS.find((i) => i.lemma === cleaned);
    const foundPassage = PASSAGE_VOCAB_DICTIONARY[cleaned];
    return {
      cleaned,
      lemma: cleaned,
      pos: foundCurated?.part_of_speech || foundPassage?.pos || "어휘",
    };
  }

  // Exact irregular forms
  if (IRREGULAR_STEM_MAP[cleaned]) {
    return {
      cleaned,
      lemma: IRREGULAR_STEM_MAP[cleaned].lemma,
      pos: IRREGULAR_STEM_MAP[cleaned].pos,
    };
  }

  // Check irregular prefix + endings (e.g., 추웠습니다, 어려웠지만)
  for (const [stemKey, mapped] of Object.entries(IRREGULAR_STEM_MAP)) {
    if (cleaned.startsWith(stemKey) && cleaned.length > stemKey.length) {
      return { cleaned, lemma: mapped.lemma, pos: mapped.pos };
    }
  }

  // Handle "-하다" / "-되다" / "-시키다" compound verbs & adjectives
  const haConjugationMatch = cleaned.match(
    /^([가-힣]+?)(합니다|합니까|하세요|하셨|했다|했던|했습|해서|해야|해도|해|하며|하면|하고|하기|하지|하는|한|할|하느라고|하느니|하더라도)$/
  );
  if (haConjugationMatch && haConjugationMatch[1].length >= 1) {
    return {
      cleaned,
      lemma: `${haConjugationMatch[1]}하다`,
      pos: "동사/형용사",
    };
  }

  const doeConjugationMatch = cleaned.match(
    /^([가-힣]+?)(됩니다|됩니까|되었다|되었습|됐습니다|됐다|돼서|돼야|되면|되며|되고|되기|되지|되는|된|될)$/
  );
  if (doeConjugationMatch && doeConjugationMatch[1].length >= 1) {
    return {
      cleaned,
      lemma: `${doeConjugationMatch[1]}되다`,
      pos: "동사",
    };
  }

  // Strip noun particles (repeated up to twice for stacked particles like '들에서', '만으로')
  let nounCandidate = cleaned;
  for (let i = 0; i < 2; i++) {
    const next = nounCandidate.replace(NOUN_PARTICLES_REGEX, "");
    if (next.length >= 1 && next !== nounCandidate) {
      nounCandidate = next;
    } else {
      break;
    }
  }

  if (
    nounCandidate !== cleaned &&
    (PASSAGE_VOCAB_DICTIONARY[nounCandidate] ||
      CURATED_VOCAB_ITEMS.some((i) => i.lemma === nounCandidate))
  ) {
    const foundCurated = CURATED_VOCAB_ITEMS.find(
      (i) => i.lemma === nounCandidate
    );
    const foundPassage = PASSAGE_VOCAB_DICTIONARY[nounCandidate];
    return {
      cleaned,
      lemma: nounCandidate,
      pos: foundCurated?.part_of_speech || foundPassage?.pos || "명사",
    };
  }

  // Try stripping verb endings and appending "-다"
  const verbStem = cleaned.replace(VERB_ENDINGS_REGEX, "");
  if (verbStem && verbStem !== cleaned && verbStem.length >= 1) {
    const verbCandidate = `${verbStem}다`;
    if (
      PASSAGE_VOCAB_DICTIONARY[verbCandidate] ||
      CURATED_VOCAB_ITEMS.some((i) => i.lemma === verbCandidate)
    ) {
      return { cleaned, lemma: verbCandidate, pos: "동사/형용사" };
    }
    if (verbStem.length >= 2) {
      return { cleaned, lemma: verbCandidate, pos: "용언" };
    }
  }

  if (nounCandidate !== cleaned && nounCandidate.length >= 1) {
    return { cleaned, lemma: nounCandidate, pos: "명사" };
  }

  return { cleaned, lemma: cleaned, pos: "어휘" };
}

export function analyzeAndLookupWord(
  surface: string,
  lang: string = "ko"
): VocabTooltipResponse {
  const { cleaned, lemma, pos } = extractKoreanLemma(surface);

  const curatedMatch = CURATED_VOCAB_ITEMS.find(
    (item) =>
      item.lemma === lemma ||
      item.lemma === cleaned ||
      (lemma.length >= 2 && item.lemma === `${lemma}하다`) ||
      (cleaned.length >= 2 && item.lemma.startsWith(lemma))
  );

  if (curatedMatch) {
    const pair =
      curatedMatch.translations[lang] || curatedMatch.translations.en;
    return {
      clicked_surface: surface,
      lemma: curatedMatch.lemma,
      target_code: curatedMatch.target_code,
      pronunciation: curatedMatch.pronunciation,
      part_of_speech: curatedMatch.part_of_speech,
      word_grade: curatedMatch.word_grade,
      is_mock: false,
      senses: [
        {
          sense_order: 1,
          korean_definition: `${curatedMatch.korean_definition} (예: ${curatedMatch.example_ko})`,
          translated_word: lang === "ko" ? curatedMatch.lemma : pair?.[0] || curatedMatch.lemma,
          translated_definition:
            lang === "ko"
              ? `예문: ${curatedMatch.example_ko}`
              : pair?.[1] || curatedMatch.korean_definition,
        },
      ],
    };
  }

  const passageMatch =
    PASSAGE_VOCAB_DICTIONARY[lemma] || PASSAGE_VOCAB_DICTIONARY[cleaned];

  if (passageMatch) {
    const pair = passageMatch.trans[lang] || passageMatch.trans.en;
    return {
      clicked_surface: surface,
      lemma: passageMatch.lemma,
      target_code: "20001",
      pronunciation: passageMatch.pronunciation,
      part_of_speech: passageMatch.pos,
      word_grade: passageMatch.grade,
      is_mock: false,
      senses: [
        {
          sense_order: 1,
          korean_definition: passageMatch.ko,
          translated_word:
            lang === "ko" ? passageMatch.lemma : pair?.[0] || passageMatch.lemma,
          translated_definition:
            lang === "ko"
              ? passageMatch.ko
              : pair?.[1] || passageMatch.ko,
        },
      ],
    };
  }

  const langMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return {
    clicked_surface: surface,
    lemma: lemma || cleaned,
    target_code: "99999",
    pronunciation: lemma || cleaned,
    part_of_speech: pos,
    word_grade: "중급",
    is_mock: true,
    senses: [
      {
        sense_order: 1,
        korean_definition: `'${lemma}' (${pos}) — 원형 '${lemma}'의 한국어 문맥 어휘입니다.`,
        translated_word:
          lang === "ko"
            ? lemma
            : `${lemma} (${langMeta.code.toUpperCase()})`,
        translated_definition:
          lang === "ko"
            ? `'${cleaned}'에서 추출된 기본형 '${lemma}' (${pos})입니다.`
            : `Base form '${lemma}' (${pos}) extracted from '${cleaned}'.`,
      },
    ],
  };
}
