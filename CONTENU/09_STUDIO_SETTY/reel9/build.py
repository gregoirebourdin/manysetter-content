#!/usr/bin/env python3
"""Reel 9 "ChatGPT or Claude" (dialogue in the coach's podcast studio): captions, bleeps and cues from the two voices.

Kit: scripts/reelkit.py. Lines (vo/reel9_segments.json): 0 hook (Setty) · 1 the debate (coach, on air) · 2 round one, tie ·
4 round two · 5 copy · 7 paste · 8 roast (human clipboard) · 10 the turn ("you're still the setter") · 12 everything around
the model · 13 the coach's roast (little bubble) · 14 his own model, Manychat · 15 "how do I set you up?" (the music cuts) ·
16 roast (your listeners, bleep) · 17 the CTA.
Usage: python3 studio.py build reel9
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from reelkit import Reel  # noqa: E402

R = Reel(__file__)
t, e, find, W = R.t, R.e, R.find, R.W
LN = {}
for i, w in enumerate(W):
    a, b = LN.get(w["line"], (i, i))
    LN[w["line"]] = (min(a, i), max(b, i))
F = lambda L: LN[L][0]  # noqa: E731  first word of line L
Z = lambda L: LN[L][1]  # noqa: E731  last word of line L
LAST = max(LN)


def word(L, txt):
    """index of `txt` inside line L"""
    return find(txt, F(L))


B1, B2 = find("fucking"), word(16, "shit")
MC, SETTY = word(14, "ManyChat"), find("SETTY")
BLEEPS = [B1, B2]

ACCENT = {0: ["ChatGPT"], 1: ["air", "ChatGPT", "Claude"], 2: ["tie"], 3: ["AI"], 4: ["reads"], 5: ["copy"], 6: ["sends"],
          7: ["paste"], 8: ["you", "clipboard"], 9: ["wins"], 10: ["still", "setter"], 11: ["real"],
          12: ["model", "offer", "voice", "typing", "one", "booking", "follow-ups"], 13: ["little", "bubble"],
          14: ["Little", "own", "ManyChat", "nobody"], 15: ["set", "up"], 16: ["recording", "listeners"], 17: ["SETTY", "free"]}
HERO = {word(8, "clipboard"), word(10, "setter"), word(14, "anything"), SETTY, word(LAST, "free")}
DISPLAY = {MC: "Manychat,"}

CHUNKS = []
for L in sorted(LN):
    acc = [word(L, w) for w in ACCENT.get(L, [])]
    for a, b, o in R.auto_chunks(F(L), Z(L)):
        cuts = sorted(x for x in BLEEPS if a <= x <= b and a < b)  # each bleeped word alone (the censor bar)
        parts, x0 = [], a
        for x in cuts:
            parts += [(x0, x - 1), (x, x)]
            x0 = x + 1
        parts.append((x0, b))
        for x, y in parts:
            if x > y:
                continue
            CHUNKS.append((x, y, {"accent": [i for i in acc if x <= i <= y], "hero": any(x <= h <= y for h in HERO),
                                  "display": {i: d for i, d in DISPLAY.items() if x <= i <= y}}))

CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # the debate, round by round
    "air": t(word(1, "air")), "gpt": t(word(1, "ChatGPT")), "claude": t(word(1, "Claude")), "better": t(word(1, "better")),
    "great": t(word(2, "great")), "tie": t(word(2, "tie")), "ai": t(word(3, "AI")),
    # the copy-paste loop
    "copy": t(word(5, "copy")), "in": t(word(5, "in")), "again": t(word(7, "again")), "paste": t(word(7, "paste")),
    "back": t(word(7, "back")), "you8": t(word(8, "you")), "clipboard": t(word(8, "clipboard")),
    "podcast": t(word(8, "podcast")),
    # everything around the model, item by item
    "offer": t(word(12, "offer")), "typing": t(word(12, "waiting")), "one": t(word(12, "one")), "booking": t(word(12, "booking")),
    "little": t(F(14)), "own": t(word(14, "own")), "years": t(word(14, "years")), "nobody": t(word(14, "nobody")),
    "listeners": t(word(16, "listeners")),
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops
    "boom1": t(word(10, "setter")), "boom2": t(word(14, "anything")),
    "fahhh1": e(Z(8)) + 0.12, "fahhh2": e(Z(13)) + 0.12, "fahhh3": e(Z(16)) + 0.12,
    "clic1": t(word(1, "ChatGPT")) - 0.12, "clic2": t(F(2)) + 0.1, "clic3": t(F(4)) + 0.05, "clic4": t(F(5)) + 0.05,
    "clic5": t(F(7)) + 0.05, "clic6": t(F(8)) + 0.1, "clic7": t(F(12)) + 0.1, "clic8": t(F(14)) + 0.25,
    "setup": t(F(15)), "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "send": t(word(LAST, "send")), "free": t(word(LAST, "free")), "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
