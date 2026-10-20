#!/usr/bin/env python3
"""QA a voice-over take: transcribe it and diff the words against the script.

Exit code 0 = every word of the script is spoken, nothing extra. 1 = mismatch.

Transcription: faster-whisper (small.en, already in the repo's .venv) by default; whisper.cpp when
WHISPER_BACKEND=cpp and `whisper-cli` is installed.

Usage: python3 scripts/check_vo.py vo/take.wav vo/script.txt [--lang en] [--optional fucking,bitch,shit]
  --optional: words that may be missing or garbled (bleeped swear words in the final mix)
"""
import argparse
import difflib
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

BACKEND = os.environ.get("WHISPER_BACKEND", "faster")
WHISPER = os.environ.get("WHISPER_CLI", "whisper-cli")
_MODELS_DIR = os.environ.get("WHISPER_MODELS_DIR", "/opt/whisper.cpp/models")
MODELS = {"en": f"{_MODELS_DIR}/ggml-small.en.bin", "fr": f"{_MODELS_DIR}/ggml-small.bin"}
FASTER = {"en": "small.en", "fr": "small"}

# Spellings whisper uses for the brand names, mapped back to the script's spelling.
ALIASES = {
    "minichat": "manychat",
    "manychats": "manychat",
    "manysetters": "manysetter",
    "seti": "setty",
    "sethi": "setty",
    "setti": "setty",
    "settie": "setty",
    "real": "reel",
    "red": "read",
    "ok": "okay",
}


CENSORED = {("f", "ing"): "fucking", ("f", ""): "fuck", ("f", "ed"): "fucked", ("s", ""): "shit", ("b", ""): "bitch",
            ("a", ""): "ass", ("s", "ty"): "shitty"}
NUM = {
    "63": "sixty three",
    "$1,500 bucks": "fifteen hundred bucks",
    "$1500 bucks": "fifteen hundred bucks",
    "$1,500": "fifteen hundred dollar",
    "$1500": "fifteen hundred dollar",
    "1,500": "fifteen hundred",
    "1500": "fifteen hundred",
    "a hundred and twenty six": "126",
    "a hundred twenty six": "126",
    "one hundred and twenty six": "126",
    "one hundred twenty six": "126",
    "four hundred": "400",
    "two hundred": "200",
    "ten x": "10x",
    "10 x": "10x",
    "a.m.": "am",
    "p.m.": "pm",
    "2am": "two am",
    "9pm": "9 pm",
    "2": "two",
    "12": "twelve",
    "1": "one",
    "6": "six",
    "3": "three",
    "40": "forty",
    "5": "five",
}
NUM.update({"2015": "twenty fifteen", "2026": "twenty twenty six", "24": "twenty four"})  # reel8


def words(text: str) -> list[str]:
    # Whisper censors swear words itself ("f***ing", "s***"): put the word back before the vocal-tag cleanup eats the stars
    text = re.sub(r"\b([A-Za-z])\*+([A-Za-z]*)", lambda m: CENSORED.get((m.group(1).lower(), m.group(2).lower()), m.group(1) + m.group(2)), text)
    text = re.sub(r"<[^>]+>|\([^)]*\)|\[[^\]]*\]|\*[^*]*\*", " ", text)  # vocal tags, (laughs), [sighs]
    text = " " + text.replace("-", " ").lower() + " "
    for k in sorted(NUM, key=len, reverse=True):  # whole tokens only, longest first
        text = re.sub(r"(?<![\w$])" + re.escape(k) + r"(?![\w])", f" {NUM[k]} ", text)
    text = text.replace("many chat", "manychat").replace("many setter", "manysetter")
    text = text.replace("dot com", "dotcom").replace(".com", " dotcom").replace("any time", "anytime")
    text = text.replace("dm's", "dms").replace("dm s ", "dms ")
    out = re.findall(r"[a-z0-9àâäéèêëïîôöùûüç$]+", text)
    return [ALIASES.get(w, w) for w in out]


def _wav16(wav: str, tmp: str) -> str:
    out = f"{tmp}/in.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-ar", "16000", "-ac", "1", out], check=True)
    return out


def transcribe_cpp(wav: str, lang: str) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        wav16 = _wav16(wav, tmp)
        base = f"{tmp}/out"
        subprocess.run(
            [WHISPER, "-m", MODELS[lang], "-l", lang, "-f", wav16, "-ojf", "-of", base, "-np", "-ml", "1", "-sow"],
            check=True,
            capture_output=True,
        )
        data = json.loads(pathlib.Path(base + ".json").read_text())
    return " ".join(s["text"].strip() for s in data.get("transcription", []))


def transcribe_faster(wav: str, lang: str) -> str:
    from faster_whisper import WhisperModel  # the repo's .venv has it (CONTENU/06_GABARITS/reel.py uses it too)

    import soundfile as sf

    model = WhisperModel(FASTER[lang], device="cpu", compute_type="int8")
    with tempfile.TemporaryDirectory() as tmp:
        # pass samples, not a path: the venv's PyAV is newer than faster-whisper's decoder expects
        audio, _ = sf.read(_wav16(wav, tmp), dtype="float32")
        segs, _ = model.transcribe(audio, language=lang, beam_size=5, condition_on_previous_text=False)
        return " ".join(s.text.strip() for s in segs)


def transcribe(wav: str, lang: str) -> str:
    if BACKEND == "cpp" and shutil.which(WHISPER):
        return transcribe_cpp(wav, lang)
    return transcribe_faster(wav, lang)


def diff(script: str, heard: str, optional: set[str]) -> list[tuple]:
    want, got = words(script), words(heard)
    sm = difflib.SequenceMatcher(a=want, b=got, autojunk=False)
    problems = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        # a bleeped word may vanish ("delete") or come back as noise ("replace" by a short token)
        if want[i1:i2] and all(w in optional for w in want[i1:i2]) and (j2 - j1) <= (i2 - i1):
            continue
        problems.append((tag, " ".join(want[i1:i2]), " ".join(got[j1:j2])))
    return problems


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("wav")
    ap.add_argument("script")
    ap.add_argument("--lang", default="en")
    ap.add_argument("--optional", default="", help="comma-separated words allowed to be missing (bleeps)")
    ap.add_argument("--json", action="store_true", help="print a JSON verdict (for studio.py)")
    a = ap.parse_args()

    raw = pathlib.Path(a.script).read_text()
    script = " ".join(s["text"] for s in json.loads(raw)) if a.script.endswith(".json") else raw
    optional = {w for o in a.optional.split(",") if o.strip() for w in words(o)}
    heard = transcribe(a.wav, a.lang)
    problems = diff(script, heard, optional)
    if a.json:
        print(json.dumps({"heard": heard.strip(), "errors": len(problems), "problems": problems}))
        sys.exit(0 if not problems else 1)
    print(f"heard: {heard.strip()}")
    if not problems:
        print("OK: every word matches the script")
        sys.exit(0)
    for tag, want, got in problems:
        print(f"{tag.upper():8} script={want!r} heard={got!r}")
    sys.exit(1)


if __name__ == "__main__":
    main()
