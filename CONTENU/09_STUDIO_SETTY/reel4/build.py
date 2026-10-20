#!/usr/bin/env python3
"""Reel 4 "10 calls, 0 closed" (dialogue in the coach's car at dusk): captions, bleeps and cues from the two voices.

Kit: scripts/reelkit.py. Lines (vo/reel4_segments.json): 0 hook (Setty) · 1 his week (coach) · 3 zero · 4 the call, 40 minutes
in · 5 "fifty bucks?" · 6 roast (free consulting) · 8 never buying · 10 Manychat, the questions in the DM · 12 who gets what ·
14 the invite · 15 "my next call's in two minutes" (the music cuts) · 16 roast (fifty bucks again) · 17 the CTA.
Usage: python3 studio.py build reel4
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


B1, B2 = find("fucking"), word(16, "fucking")
MC, SETTY = find("ManyChat."), find("SETTY")
BLEEPS = [B1, B2]

ACCENT = {0: ["ten"], 1: ["car."], 2: ["paid"], 3: ["zero."], 4: ["Forty", "budget."], 5: ["fifty", "bucks"],
          6: ["free", "consulting"], 7: ["suck"], 8: ["never", "buying."], 9: ["before"], 10: ["ManyChat.", "one"],
          11: ["can't", "pay?"], 12: ["calendar.", "guide", "offer."], 13: ["fewer"], 14: ["Serious", "invite."],
          15: ["two", "minutes."], 16: ["fifty", "bucks."], 17: ["SETTY", "free."]}
HERO = {word(3, "zero."), word(5, "fifty"), word(6, "consulting"), word(8, "never"), MC, word(12, "calendar."),
        word(16, "fifty"), SETTY, find("free.")}
DISPLAY = {word(0, "ten"): "10", word(1, "Ten,"): "10,", MC: "Manychat."}

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
    # his week in Calendly (line 1), the same week stamped "0 clients" on "zero." (line 3)
    "booked": t(word(1, "booked")), "car": t(word(1, "car.")), "zero": t(word(3, "zero.")), "zero_end": e(word(3, "zero.")),
    # the call: 40 minutes in, the budget (line 4), then the lead's answer (line 5)
    "forty": t(word(4, "Forty")), "ask": t(word(4, "ask")), "quote": t(word(5, "I")),
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops
    "link": t(word(8, "Your")), "boom1": t(word(5, "fifty")), "boom2": t(word(8, "never")), "boom3": t(MC),
    "fahhh1": e(Z(6)) + 0.12, "fahhh2": e(Z(16)) + 0.12,
    "clic1": t(F(1)) + 0.05, "clic2": t(F(3)) + 0.05, "clic3": t(F(4)) + 0.1, "clic4": t(F(5)) + 0.05,
    "clic5": t(F(10)) + 0.05, "clic6": t(F(12)) + 0.02, "clic7": t(F(14)) + 0.05, "clic8": t(word(15, "My")) - 0.25,
    "clic9": t(F(16)) + 0.1,
    # the DM, one question at a time (line 10); who gets what (line 12); the invite (line 14)
    "questions": t(word(10, "questions")), "time": t(word(10, "time.")),
    "nocal": t(word(12, "calendar.")), "guide": t(word(12, "free")), "cheaper": t(word(12, "cheaper")),
    "serious": t(word(14, "Serious")), "answers": t(word(14, "answers")),
    # the next call (line 15, the music dies) and the callback (line 16)
    "setup": t(F(15)), "next": t(word(15, "next")), "fifty2": t(word(16, "fifty")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "send": t(word(LAST, "send")), "free": t(find("free.")), "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
