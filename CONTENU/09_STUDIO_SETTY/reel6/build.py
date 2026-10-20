#!/usr/bin/env python3
"""Reel 6 "The 5-day challenge" (dialogue in the coach's living room, the night of day 6): captions, bleeps and cues.

Kit: scripts/reelkit.py. Lines (vo/reel6_segments.json): 0 hook (Setty) · 1 the challenge (coach) · 2 roast (cold pizza) ·
3 his DMs exploded · 4-5 "how many?" "like twenty" (the music dies) · 6 on read (BOOM) · 7 "oh [bleep]", no more
challenges · 8 the turn: what's outdated (BOOM) · 9 he roasts Setty back (speech bubble) · 10 Manychat (BOOM) ·
12 qualification, the calendar · 13 "how do I get you?" · 14 roast (the ring light) · 15 the CTA.
Usage: python3 studio.py build reel6
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


B1, B2 = find("fucking"), find("shit.")
MC, SETTY = find("ManyChat."), find("SETTY")
BLEEPS = [B1, B2]

ACCENT = {0: ["five-day"], 1: ["live,", "Banger."], 2: ["cold", "pizza"], 3: ["exploded."], 4: ["answer?"], 5: ["twenty."],
          6: ["hundreds.", "read."], 7: ["fried."], 8: ["worked,", "outdated", "hand."], 9: ["speech", "bubble."],
          10: ["Rude.", "ManyChat.", "voice."], 11: ["price?"], 12: ["calendar,", "real"], 13: ["get", "you?"],
          14: ["ring", "Monday."], 15: ["SETTY", "free."]}
HERO = {word(5, "twenty."), word(6, "read."), word(8, "hand."), word(9, "bubble."), MC, word(14, "Monday."), SETTY, find("free.")}
DISPLAY = {find("five-day"): "5-day", MC: "Manychat.", word(5, "twenty."): "20.", word(3, "two"): "2"}

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
    # his challenge, step by step on the coach's words
    "five": t(F(1)), "pitched": t(word(1, "Pitched")), "banger": t(word(1, "Banger.")),
    "pizza": t(word(2, "cold")), "exploded": t(word(3, "exploded.")), "open": t(word(3, "Still")), "pay": t(word(3, "Can")),
    # the deadpan beat: the music dies before "Like twenty.", comes back on the BOOM of "read."
    "twenty": t(F(5)), "hundreds": t(word(6, "hundreds.")), "showed": t(word(6, "showed")), "now": t(word(6, "now")),
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops
    "boom1": t(word(6, "read.")), "boom2": t(word(8, "hand.")), "boom3": t(MC),
    "fahhh1": e(Z(2)) + 0.12, "fahhh2": e(Z(9)) + 0.12, "fahhh3": e(Z(14)) + 0.12,
    "clic1": t(F(1)) - 0.2, "clic2": t(word(3, "My")) - 0.1, "clic3": t(word(6, "showed")) - 0.3, "clic4": t(word(10, "Plug")) - 0.1,
    "clic5": t(F(12)) + 0.05,
    "outdated": t(word(8, "outdated")), "inbox": t(word(8, "inbox.")), "bubble": t(word(9, "speech")), "rude": t(F(10)),
    "learn": t(word(10, "learn")), "sales": t(word(10, "sales")), "answer": t(word(10, "answer")), "voice": t(word(10, "voice.")),
    "worked": t(word(8, "worked,")),
    "serious": t(word(12, "Serious")), "calendar": t(word(12, "calendar,")), "rest": t(word(12, "rest")),
    "howget": t(F(13)), "ring": t(word(14, "ring")), "monday": t(word(14, "Monday.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "send": t(word(LAST, "send")), "free": t(find("free.")), "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
