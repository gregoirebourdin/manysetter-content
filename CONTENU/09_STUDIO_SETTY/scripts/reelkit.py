"""Reel build kit: word timing → captions, bleeps and scene cues → index.html + cues.json.

A reel's build.py only holds its data (CHUNKS, BLEEPS, CUES); this module does the rest:
  - reads vo/<reel>/timing.json (written by scripts/voice.py), so a new take re-times the whole reel;
  - writes <reel>/cues.json (shared with the sound design in <reel>/audio.py);
  - writes <reel>/index.html = assets/engine/shell.html + <reel>/src/scenes.js + DATA.

CHUNKS: caption groups (first word, last word, options), words pop one by one on their own cue.
  accent: [i] orange words · display: {i: "text"} ("" hides a word) · hide: True (a prop or the censor bar
  says it) · hero: True (big) · count: {i: (to, until_word)} (a number counting up to `to`) · hold: seconds
  the chunk stays after its last word (default 0.9, cut by the next chunk).
"""
import json
import pathlib
import re

STUDIO = pathlib.Path(__file__).resolve().parents[1]
ARROW_DOWN = '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>'  # Lucide arrow-down


class Reel:
    def __init__(self, build_file, tail=1.6):
        self.here = pathlib.Path(build_file).resolve().parent
        self.id = self.here.name  # the folder name is the reel id: reel1, reel2…
        self.timing = json.loads((STUDIO / f"vo/{self.id}/timing.json").read_text())
        self.W = self.timing["words"]
        self.tail = tail  # end hold after the last word (CTA, loop)
        self.total = round(self.W[-1]["end"] + tail, 2)

    def t(self, i):
        return self.W[i]["t"]

    def e(self, i):
        return self.W[i]["end"]

    def find(self, word, start=0):
        """Index of the first word (from `start`) whose letters match `word` ("you're" == "You're,")."""
        key = re.sub(r"[^a-z0-9']", "", word.lower())
        for i in range(start, len(self.W)):
            if re.sub(r"[^a-z0-9']", "", self.W[i]["w"].lower()) == key:
                return i
        raise KeyError(f"{word!r} not found after word {start}")

    def auto_chunks(self, a, b, max_words=4, **opts):
        """Caption chunks for words a..b: a new chunk after punctuation, or every `max_words` words.
        Start from this, then hand-tune (accent, hero, display, hide) the chunks that matter."""
        out, start = [], a
        for i in range(a, b + 1):
            end_here = re.search(r"[.,!?…:;]\"?$", self.W[i]["w"]) or (i - start + 1) >= max_words or i == b
            if end_here:
                out.append((start, i, dict(opts)))
                start = i + 1
        return out

    def chunks(self, CHUNKS, BLEEPS):
        t, e, total = self.t, self.e, self.total
        out = []
        for k, (a, b, o) in enumerate(CHUNKS):
            nxt = t(CHUNKS[k + 1][0]) if k + 1 < len(CHUNKS) else total
            count = o.get("count", {})
            toks = []
            for i in range(a, b + 1):
                txt = o.get("display", {}).get(i, self.W[i]["w"])
                if txt == "":
                    continue
                tok = {"i": i, "text": txt.replace('"', ""), "t": t(i), "accent": i in o.get("accent", []),
                       "bleep": i in BLEEPS, "count": i in count}
                if i in count:
                    tok["countTo"], tok["countUntil"] = count[i][0], t(count[i][1])
                toks.append(tok)
            out.append({"id": k, "start": t(a), "end": min(nxt, e(b) + o.get("hold", 0.9)), "next": nxt,
                        "hide": o.get("hide", False), "hero": o.get("hero", False), "tokens": toks, "span": [a, b]})
        return out

    def build(self, CHUNKS, BLEEPS, CUES):
        lucide = json.loads((STUDIO / "assets/ui/lucide.json").read_text())
        lucide.setdefault("arrow-down", ARROW_DOWN)
        cues = {"total": self.total, **CUES}
        data = {"words": [{k: w[k] for k in ("w", "t", "end")} for w in self.W], "chunks": self.chunks(CHUNKS, BLEEPS),
                "cues": cues, "bleeps": [{"i": i, "t": self.t(i), "end": self.e(i)} for i in BLEEPS], "icons": lucide}
        (self.here / "cues.json").write_text(json.dumps(data, indent=1, ensure_ascii=False))
        shell = (STUDIO / "assets/engine/shell.html").read_text()
        scenes = (self.here / "src/scenes.js").read_text().rstrip("\n")
        scenes = "\n".join(("      " + line) if line.strip() else "" for line in scenes.splitlines()).lstrip()
        html = shell.replace("/*DATA*/", "const DATA = " + json.dumps(data, ensure_ascii=False) + ";")
        html = html.replace("/*SCENES*/", scenes).replace("{{TOTAL}}", f"{self.total:.2f}").replace("{{ID}}", self.id)
        (self.here / "index.html").write_text(html)
        warn = lint(data)
        print(f"{self.id}: {self.total:.2f}s, {len(data['chunks'])} caption chunks → index.html, cues.json")
        for w in warn:
            print(f"  ! {w}")
        return data


def lint(data):
    """House rules on the on-screen words (CLAUDE.md of the repo + the studio's)."""
    warn = []
    shown = [k["text"] for ch in data["chunks"] if not ch["hide"] for k in ch["tokens"]]
    text = " ".join(shown)
    if re.search(r"[—–]", text):
        warn.append("em/en dash on screen (never in published text)")
    if re.search(r"ManyChat|MANYCHAT", text):
        warn.append('write "Manychat" on screen (display: {i: "Manychat."})')
    if len(data["bleeps"]) > 3:
        warn.append(f"{len(data['bleeps'])} bleeps (3 max: two in the hook, one in the punchline)")
    covered = {i for ch in data["chunks"] for i in range(ch["span"][0], ch["span"][1] + 1)}
    missing = [w["w"] for i, w in enumerate(data["words"]) if i not in covered]
    if missing:
        warn.append(f"spoken words with no caption chunk: {missing}")
    if data["cues"]["total"] > 30.5:
        warn.append(f"{data['cues']['total']:.1f}s: over 30 s (aim for 25 to 30 s)")
    return warn
