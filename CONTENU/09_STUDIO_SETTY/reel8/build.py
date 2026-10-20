#!/usr/bin/env python3
"""Reel 8 "The DM funnel stuck in 2015" (dialogue on a rooftop at sunset): captions, bleeps and cues from the two voices.

Kit: scripts/reelkit.py. Lines (vo/reel8_segments.json): 0 hook (Setty) · 1 his funnel, "and..." (the music cuts) ·
2 the inbox void (BOOM, music back) · 4 the missing person (BOOM) · 6 roast (drunk ex) · 8 Manychat · 10 the real answer
and the calendar · 12 the follow-ups, sober (BOOM) · 13 "how do I set you up?" · 14 roast (the sunset, bleep) · 15 the CTA.
Usage: python3 studio.py build reel8
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


B1, B2 = find("fucking"), word(14, "fucking")
MC, SETTY = find("ManyChat."), find("SETTY")
BLEEPS = [B1, B2]

ACCENT = {0: ["DM", "funnel", "2015,"], 1: ["link", "bio,", "how", "much,"], 2: ["no.", "inbox", "void."], 3: ["thinking"],
          4: ["two", "weeks?", "missing", "person."], 5: ["remember."], 6: ["midnight,", "drunk", "ex."], 7: ["desperate."],
          8: ["first.", "answering.", "ManyChat."], 9: ["link", "bio?"], 10: ["real", "voice,", "calendar."], 11: ["ghost"],
          12: ["three", "twenty-four", "sober."], 13: ["2026.", "set", "up?"], 14: ["reel.", "sunset's"], 15: ["SETTY", "free."]}
HERO = {word(2, "void."), word(4, "person."), word(6, "ex."), MC, word(12, "sober."), SETTY, find("free.")}
DISPLAY = {MC: "Manychat.", word(4, "two"): "2", word(6, "Three"): "3", word(12, "three"): "3", word(12, "twenty-four"): "24"}

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
    # his 2015 funnel, step by step on his words; the music dies on "and..."
    "post": t(word(1, "post,")), "link": t(word(1, "link")), "ask": t(word(1, "ask")), "tell": t(word(1, "tell")),
    "and": t(word(1, "and...")), "cut": e(word(1, "and...")) + 0.05,
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops
    "boom1": t(word(2, "void.")), "boom2": t(word(4, "missing")), "boom3": t(word(12, "sober.")),
    "fahhh1": e(Z(6)) + 0.12, "fahhh2": e(Z(14)) + 0.12,
    "clic1": t(word(1, "post,")) - 0.25, "clic2": t(F(2)) + 0.1, "clic3": t(F(4)) + 0.1, "clic4": t(F(6)) + 0.1,
    "clic5": t(F(8)) + 0.1, "clic6": t(F(10)) + 0.1, "clic7": t(F(12)) + 0.1,
    "inbox": t(word(2, "inbox")), "when": t(word(5, "When")), "weeks": t(word(4, "weeks?")), "midnight": t(word(6, "midnight,")), "hey": t(word(6, "hey,")),
    "ex": t(word(6, "ex.")), "slid": t(word(8, "slid")), "answering": t(word(8, "answering.")), "mc": t(MC), "mc_end": e(MC), "q11": t(F(11)), "ghost_end": e(word(11, "ghost")),
    "real": t(word(10, "real")), "time": t(word(10, "time.")), "right": t(word(10, "right")), "calendar": t(word(10, "calendar.")),
    "three": t(word(12, "three")), "inside": t(word(12, "inside")), "hours": t(word(12, "hours,")),
    "setup": t(F(13)), "stop": t(word(14, "stop")), "sunset": t(word(14, "sunset's")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "send": t(word(LAST, "send")), "free": t(find("free.")), "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
