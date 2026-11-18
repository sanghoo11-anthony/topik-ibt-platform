#!/usr/bin/env python3
"""
Generate studio-grade Korean neural TTS MP3 assets for all TOPIK IBT dialogues,
prompts, passages, mini-lectures, explanations, grammar, idioms, and vocabulary.

Uses the exact parser and hash function from frontend/utils/speech.ts via Node
so that every generated <key>.mp3 matches the runtime lookup keys identically.
"""

import asyncio
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Tuple

import edge_tts

ROOT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT_DIR / "frontend"
MIRROR_FRONTEND_DIR = ROOT_DIR / "topik-platform" / "frontend"
AUDIO_OUT_DIR = FRONTEND_DIR / "public" / "audio" / "ko"
MIRROR_AUDIO_OUT_DIR = MIRROR_FRONTEND_DIR / "public" / "audio" / "ko"
MANIFEST_PATH = FRONTEND_DIR / "utils" / "neuralAudioManifest.ts"
MIRROR_MANIFEST_PATH = MIRROR_FRONTEND_DIR / "utils" / "neuralAudioManifest.ts"

VOICE_CONFIG: Dict[str, Dict[str, str]] = {
    "female": {
        "voice": "ko-KR-SunHiNeural",
        "fallback": "ko-KR-SunHiNeural",
        "rate": "-3%",
        "pitch": "+0Hz",
    },
    "male": {
        "voice": "ko-KR-InJoonNeural",
        "fallback": "ko-KR-HyunsuMultilingualNeural",
        "rate": "-2%",
        "pitch": "-2Hz",
    },
    "narrator": {
        "voice": "ko-KR-HyunsuMultilingualNeural",
        "fallback": "ko-KR-SunHiNeural",
        "rate": "-2%",
        "pitch": "+0Hz",
    },
}

NODE_EXTRACTOR_JS = r"""
const fs = require("node:fs");
const path = require("node:path");
const ts = require(path.join(process.cwd(), "topik-platform/frontend/node_modules/typescript"));

function loadTs(relPath, replacements = []) {
  let src = fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
  for (const [pat, rep] of replacements) {
    src = src.replace(pat, rep);
  }
  const out = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const mod = { exports: {} };
  new Function("exports", "require", "module", out)(mod.exports, require, mod);
  return mod.exports;
}

const speech = loadTs("frontend/utils/speech.ts", [
  [/import .* from "@\/utils\/neuralAudioManifest";/, "const NEURAL_AUDIO_KEYS = new Set();"],
]);
const study = loadTs("frontend/data/studyData.ts", [
  [/import .* from "@\/types\/exam";/, ""],
]);

const extraRawTexts = JSON.parse(fs.readFileSync(0, "utf8") || "[]");
const entries = new Map();

function addRaw(rawText) {
  if (!rawText || typeof rawText !== "string") return;
  const turns = speech.parseDialogueScript(rawText, "ko");
  for (const t of turns) {
    if (!t.text) continue;
    const key = speech.computeNeuralAudioKey(t.speaker, t.text);
    if (!entries.has(key)) {
      entries.set(key, { key, speaker: t.speaker, text: t.text });
    }
  }
}

for (const q of study.COMPREHENSIVE_QUESTIONS) {
  addRaw(q.prompt_text);
  if (q.passage_text) addRaw(q.passage_text);
  addRaw(`${q.prompt_text}. ${q.passage_text || ""}`);
  if (q.explanations && q.explanations.ko) {
    addRaw(q.explanations.ko);
  }
}

for (const entry of Object.values(study.QUESTION_EXPLANATIONS_BY_NUM)) {
  if (entry.ko) {
    addRaw(`${entry.ko.answer}. ${entry.ko.explanation}`);
    addRaw(entry.ko.explanation);
  }
}

for (const lec of study.BUILT_IN_MINI_LECTURES) {
  addRaw(lec.lecture_script_ko);
}

for (const g of study.GRAMMAR_PATTERNS_DATA) {
  addRaw(`${g.pattern}. ${g.meaning_ko}. ${g.example_ko}`);
}

for (const item of study.IDIOMS_DATA) {
  addRaw(`${item.expression}. ${item.meaning_ko}. ${item.example}`);
}

for (const w of study.CURATED_VOCAB_ITEMS) {
  addRaw(`${w.lemma}. ${w.korean_definition}. ${w.example_ko}`);
  addRaw(`${w.lemma}. ${w.korean_definition} (예: ${w.example_ko})`);
  addRaw(`${w.lemma}. ${w.korean_definition}`);
  addRaw(w.lemma);
}

for (const v of Object.values(study.PASSAGE_VOCAB_DICTIONARY)) {
  addRaw(`${v.lemma}. ${v.ko}`);
  addRaw(v.lemma);
}

for (const raw of extraRawTexts) {
  addRaw(raw);
}

process.stdout.write(JSON.stringify([...entries.values()]));
"""


def collect_backend_extra_texts() -> List[str]:
    """Also collect Korean texts from backend/app/data/study_bank.py if present."""
    extra: List[str] = []
    backend_dir = ROOT_DIR / "backend"
    if not (backend_dir / "app" / "data" / "study_bank.py").exists():
        return extra

    sys.path.insert(0, str(backend_dir))
    try:
        from app.data.study_bank import (
            CURATED_VOCAB_LIST,
            EXTRA_VOCAB_LIST,
            GRAMMAR_PATTERNS,
            IDIOMS_AND_PROVERBS,
            QUESTION_BANK,
        )

        for q in QUESTION_BANK:
            if q.get("prompt_text"):
                extra.append(q["prompt_text"])
            if q.get("passage_text"):
                extra.append(q["passage_text"])
            extra.append(f"{q.get('prompt_text', '')}. {q.get('passage_text') or ''}")
            exp_ko = (q.get("explanations") or {}).get("ko")
            if exp_ko:
                extra.append(exp_ko)

        for v in list(CURATED_VOCAB_LIST) + list(EXTRA_VOCAB_LIST):
            lemma = v.get("lemma", "")
            ko_def = v.get("korean_definition", "")
            ex_ko = v.get("example_ko", "")
            if lemma:
                extra.append(lemma)
            if lemma and ko_def:
                extra.append(f"{lemma}. {ko_def}")
            if lemma and ko_def and ex_ko:
                extra.append(f"{lemma}. {ko_def}. {ex_ko}")
                extra.append(f"{lemma}. {ko_def} (예: {ex_ko})")

        for g in GRAMMAR_PATTERNS:
            extra.append(
                f"{g.get('pattern', '')}. {g.get('meaning_ko', '')}. {g.get('example_ko', '')}"
            )

        for item in IDIOMS_AND_PROVERBS:
            extra.append(
                f"{item.get('expression', '')}. {item.get('meaning_ko', '')}. {item.get('example', '')}"
            )
    except Exception as exc:
        print(f"Warning: skipping backend study_bank extraction: {exc}", file=sys.stderr)
    return extra


def extract_speech_entries() -> List[Dict[str, str]]:
    extra_texts = collect_backend_extra_texts()
    proc = subprocess.run(
        ["node", "-e", NODE_EXTRACTOR_JS],
        cwd=str(ROOT_DIR),
        input=json.dumps(extra_texts, ensure_ascii=False),
        text=True,
        capture_output=True,
        check=True,
    )
    return json.loads(proc.stdout)


async def synthesize_one(
    sem: asyncio.Semaphore,
    entry: Dict[str, str],
    out_dir: Path,
) -> Tuple[str, bool, str]:
    key = entry["key"]
    speaker = entry["speaker"]
    text = entry["text"]
    dest_path = out_dir / f"{key}.mp3"

    if dest_path.exists() and dest_path.stat().st_size > 512:
        return key, True, "cached"

    cfg = VOICE_CONFIG.get(speaker, VOICE_CONFIG["narrator"])
    voices_to_try = [cfg["voice"]]
    if cfg["fallback"] != cfg["voice"]:
        voices_to_try.append(cfg["fallback"])

    tmp_path = out_dir / f".{key}.mp3.tmp"
    last_err = ""

    async with sem:
        for attempt in range(3):
            voice = voices_to_try[min(attempt, len(voices_to_try) - 1)]
            try:
                communicate = edge_tts.Communicate(
                    text=text,
                    voice=voice,
                    rate=cfg["rate"],
                    pitch=cfg["pitch"],
                )
                await communicate.save(str(tmp_path))
                if tmp_path.exists() and tmp_path.stat().st_size > 512:
                    os.replace(tmp_path, dest_path)
                    return key, True, voice
                last_err = "empty audio file produced"
            except Exception as exc:
                last_err = str(exc)
                if tmp_path.exists():
                    try:
                        tmp_path.unlink()
                    except OSError:
                        pass
            await asyncio.sleep(0.6 * (attempt + 1))

    return key, False, last_err


async def generate_all_audio(entries: List[Dict[str, str]]) -> List[str]:
    AUDIO_OUT_DIR.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(6)
    tasks = [synthesize_one(sem, entry, AUDIO_OUT_DIR) for entry in entries]

    success_keys: List[str] = []
    failures: List[Tuple[str, str, str]] = []
    synthesized_count = 0
    cached_count = 0

    for idx, coro in enumerate(asyncio.as_completed(tasks), 1):
        key, ok, info = await coro
        if ok:
            success_keys.append(key)
            if info == "cached":
                cached_count += 1
            else:
                synthesized_count += 1
        else:
            failures.append((key, info, ""))
        if idx % 50 == 0 or idx == len(entries):
            print(
                f"Progress: {idx}/{len(entries)} "
                f"(new={synthesized_count}, cached={cached_count}, failed={len(failures)})"
            )

    if failures:
        print(f"ERROR: {len(failures)} items failed synthesis:", file=sys.stderr)
        for key, err, _ in failures[:10]:
            print(f"  {key}: {err}", file=sys.stderr)
        raise RuntimeError(f"{len(failures)} TTS items failed")

    return sorted(set(success_keys))


def write_manifest(keys: List[str]) -> None:
    lines = [
        "// Auto-generated by scripts/generate_neural_audio.py",
        "// Contains deterministic content-hash keys for pre-synthesized Korean neural TTS MP3 assets.",
        "export const NEURAL_AUDIO_KEYS: ReadonlySet<string> = new Set<string>([",
    ]
    for k in keys:
        lines.append(f'  "{k}",')
    lines.append("]);")
    lines.append("")
    content = "\n".join(lines)

    MANIFEST_PATH.write_text(content, encoding="utf-8")
    MIRROR_MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MIRROR_MANIFEST_PATH.write_text(content, encoding="utf-8")


def sync_audio_directory(keys: List[str]) -> int:
    # Remove any orphaned mp3 files not in manifest
    key_set = set(keys)
    for mp3 in AUDIO_OUT_DIR.glob("*.mp3"):
        if mp3.stem not in key_set:
            mp3.unlink()

    if MIRROR_AUDIO_OUT_DIR.exists():
        for mp3 in MIRROR_AUDIO_OUT_DIR.glob("*.mp3"):
            if mp3.stem not in key_set:
                mp3.unlink()
    MIRROR_AUDIO_OUT_DIR.mkdir(parents=True, exist_ok=True)

    total_bytes = 0
    for k in keys:
        src = AUDIO_OUT_DIR / f"{k}.mp3"
        dst = MIRROR_AUDIO_OUT_DIR / f"{k}.mp3"
        total_bytes += src.stat().st_size
        shutil.copy2(src, dst)
    return total_bytes


def main() -> int:
    entries = extract_speech_entries()
    print(f"Extracted {len(entries)} unique Korean neural speech entries.")
    by_role: Dict[str, int] = {}
    for e in entries:
        by_role[e["speaker"]] = by_role.get(e["speaker"], 0) + 1
    print(f"Role breakdown: {by_role}")

    keys = asyncio.run(generate_all_audio(entries))
    write_manifest(keys)
    total_bytes = sync_audio_directory(keys)
    mb = total_bytes / (1024 * 1024)
    print(
        f"Generated & synced {len(keys)} neural MP3 files "
        f"({mb:.2f} MB) into frontend/public/audio/ko and topik-platform/frontend/public/audio/ko."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
