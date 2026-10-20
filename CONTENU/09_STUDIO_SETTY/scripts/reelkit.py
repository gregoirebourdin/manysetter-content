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
    def __init__(self, build_file, tail=None):
        self.here = pathlib.Path(build_file).resolve().parent
        meta = self.here / "reel.json"
        if tail is None:  # end hold after the last word (CTA, loop): reel.json "tail_s", 1.6 s by default
            tail = json.loads(meta.read_text()).get("tail_s", 1.6) if meta.exists() else 1.6
        self.id = self.here.name  # the folder name is the reel id: reel1, reel2…
        self.timing = json.loads((STUDIO / f"vo/{self.id}/timing.json").read_text())
        self.W = self.timing["words"]
        self.tail = tail  # end hold after the last word (CTA, loop)
        self.total = round(self.W[-1]["end"] + tail, 2)
        self.LN = {}  # dialogue reels: line → (first word, last word)
        for i, w in enumerate(self.W):
            if "line" in w:
                a, b = self.LN.get(w["line"], (i, i))
                self.LN[w["line"]] = (min(a, i), max(b, i))

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

    def F(self, L):
        """First word of line L (dialogue reels)."""
        return self.LN[L][0]

    def Z(self, L):
        """Last word of line L (dialogue reels)."""
        return self.LN[L][1]

    def word(self, L, word, nth=1):
        """Index of `word` inside line L only (the nth time it is said there): find() from the line start ran on into
        the next lines when the word was not in the line (20/10 lot)."""
        i = self.F(L) - 1
        for _ in range(nth):
            i = self.find(word, i + 1)
        if i > self.Z(L):
            raise KeyError(f"{word!r} is not said {nth} time(s) in line {L}: "
                           + " ".join(w["w"] for w in self.W[self.F(L):self.Z(L) + 1]))
        return i

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
        if bad := [k for k in CUES if k in RESERVED]:  # reel5: a cue named "total" made the mix 17 s long
            raise SystemExit(f"{self.id}: cue name(s) {bad} are reserved by the kit ({', '.join(RESERVED)}): rename them")
        if bad := [k for k, v in CUES.items() if not isinstance(v, (int, float)) or not 0 <= v <= self.total + 3]:
            raise SystemExit(f"{self.id}: cue(s) {bad} are not a time inside the reel (0–{self.total:.1f} s)")
        cues = {"total": self.total, **CUES}
        data = {"words": [{k: w[k] for k in ("w", "t", "end")} for w in self.W], "chunks": self.chunks(CHUNKS, BLEEPS),
                "cues": cues, "bleeps": [{"i": i, "t": self.t(i), "end": self.e(i)} for i in BLEEPS], "icons": lucide}
        meta = self.here / "reel.json"
        rj = json.loads(meta.read_text()) if meta.exists() else {}
        layout = rj.get("layout")
        if layout:
            data["layout"] = layout  # "stage": hook title on top, the stage in the middle, Setty small at the bottom
        if layout == "set":  # the 3D set and its mood ("set": the coach and Setty talk in it)
            data["set"], data["mood"] = rj.get("set", "bedroom"), rj.get("mood", "golden")
        if rj.get("hook_title"):
            data["hook_title"] = rj["hook_title"]
        if rj.get("cam_track"):  # each camera move takes over from the previous one (engine.js, 20/10)
            data["cam_track"] = True
        if self.timing.get("dialogue"):  # who says each line, and the mouths follow the voice
            for d, w in zip(data["words"], self.W):
                d["who"] = w["who"]
            data["lines"] = [{"id": L["id"], "who": L["who"], "t": ws[0]["t"], "end": ws[-1]["end"]}
                             for L in self.timing["lines"] if (ws := [w for w in self.W if w["line"] == L["id"]])]
            data["lips"] = lips(STUDIO / f"vo/{self.id}/vo.wav", data["lines"], self.total)
        (self.here / "cues.json").write_text(json.dumps(data, indent=1, ensure_ascii=False))
        shell = (STUDIO / "assets/engine/shell.html").read_text()
        scenes = (self.here / "src/scenes.js").read_text().rstrip("\n")
        scenes = "\n".join(("      " + line) if line.strip() else "" for line in scenes.splitlines()).lstrip()
        # a card in its own file (assets/engine/card_<name>.js + .css, exporting <name>) is loaded only by the reels whose
        # scenes call st.<name>(…): a card being written in another session never breaks this reel's build
        used = sorted(set(re.findall(r"\bst\.(\w+)\s*\(", scenes)))
        cards = [n for n in used if (STUDIO / f"assets/engine/card_{n}.js").exists()]
        shell = shell.replace("/*CARD_IMPORTS*/", "\n      ".join(f'import {{ {n} }} from "./assets/engine/card_{n}.js";' for n in cards))
        shell = shell.replace("/*CARD_NAMES*/", "".join(f", {n}" for n in cards))
        shell = shell.replace("<!--CARD_CSS-->", "\n    ".join(f'<link rel="stylesheet" href="assets/engine/card_{n}.css" />' for n in cards
                                                                 if (STUDIO / f"assets/engine/card_{n}.css").exists()))
        html = shell.replace("/*DATA*/", "const DATA = " + json.dumps(data, ensure_ascii=False) + ";")
        html = html.replace("/*SCENES*/", scenes).replace("{{TOTAL}}", f"{self.total:.2f}").replace("{{ID}}", self.id)
        (self.here / "index.html").write_text(html)
        meta = self.here / "reel.json"
        hi = json.loads(meta.read_text()).get("voice_s", [25.5, 29.5])[1] if meta.exists() else 29.5
        warn = lint(data, max_total=hi + 2.1) + lint_code(self.here, data)
        print(f"{self.id}: {self.total:.2f}s, {len(data['chunks'])} caption chunks → index.html, cues.json")
        for w in warn:
            print(f"  ! {w}")
        return data


RESERVED = ("total",)  # cue names the kit writes itself


def lint_code(here, data):
    """Drawing rules the render cannot show until it is too late (CLAUDE.md § 8)."""
    warn = []
    files = [here / "src/scenes.js"] + ([STUDIO / f"assets/sets/{data['set']}.js"] if data.get("set") else [])
    for f in files:
        if f.exists() and re.search(r"\.filter\s*=", f.read_text()):
            warn.append(f"{f.relative_to(STUDIO)}: ctx.filter in a canvas painter: the render's Chrome ignores it and the "
                        "texture comes out black (reel10); soften with gradients")
    return warn


def lips(wav, lines, total, fps=30):
    """Mouth opening per speaker, 0–9 per frame (a string per speaker), from the voice envelope inside its own lines."""
    import numpy as np
    import soundfile as sf
    x, sr = sf.read(wav, dtype="float64")
    x = x if x.ndim == 1 else x.mean(axis=1)
    hop, n = sr // fps, int(total * fps) + 2
    rms = np.array([np.sqrt(np.mean(x[k * hop:(k + 1) * hop] ** 2)) if k * hop < len(x) else 0.0 for k in range(n)])
    out = {"fps": fps}
    for who in sorted({L["who"] for L in lines}):
        m = np.zeros(n, bool)
        for L in lines:
            if L["who"] == who:
                m[int((L["t"] - 0.03) * fps):int((L["end"] + 0.05) * fps) + 1] = True
        ref = np.percentile(rms[m], 92) if m.any() else 1.0
        lv = np.clip(rms / (ref + 1e-9), 0, 1) ** 0.7 * m
        y = np.zeros(n)
        for k in range(n):  # opens fast, closes a bit slower: reads as talking, not flapping
            y[k] = max(lv[k], y[k - 1] * 0.55 if k else 0)
        out[who] = "".join(str(int(round(v * 9))) for v in y)
    return out


def lint(data, max_total=31.6):
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
    if data["cues"]["total"] > max_total:
        warn.append(f"{data['cues']['total']:.1f}s: longer than the reel's target ({max_total:.1f} s max)")
    if data["cues"]["total"] > 60.0 and data.get("layout") == "set":
        warn.append(f"{data['cues']['total']:.1f}s: over 60.0 s (the one-minute format): cut a line (studio.py cut) or tighten tail_s")
    if len(data.get("hook_title", [])) > 2:
        warn.append(f"hook title on {len(data['hook_title'])} lines: it reaches below y 600 and eats the close-ups "
                    "(reel8, reel11): 2 lines, or ask Grégoire before shortening the carousel's slide 1")
    return warn
