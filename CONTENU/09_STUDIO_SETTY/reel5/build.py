#!/usr/bin/env python3
"""Captions, bleeps and cues of this dialogue reel, from the two voices (kit: scripts/reelkit.py).

Lines come from vo/<reel>_segments.json ("who" on each). F(L) / Z(L) = first / last word of line L; word(L, "text")
finds a word inside line L. Name the cues the scenes and the sound use: drop (end of the hook), boomN (💥 a
"dinguerie"), fahhhN (😩 after a roast), clicN (a card pops), howmuch-like beats, and the CTA cues.
Usage: python3 studio.py build <reel>
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
F = lambda L: LN[L][0]  # noqa: E731
Z = lambda L: LN[L][1]  # noqa: E731
LAST = max(LN)


def word(L, txt):
    return find(txt, F(L))


B1 = find("fucking")
SETTY = find("SETTY")
BLEEPS = [B1]                       # 3 at most

ACCENT = {0: [], LAST: ["SETTY", "free."]}   # line → words in orange
HERO = {SETTY}                      # words that make their chunk big
DISPLAY = {}                        # {i: "Manychat."} when the voice script says "ManyChat."

CHUNKS = []
for L in sorted(LN):
    acc = [word(L, w) for w in ACCENT.get(L, [])]
    for a, b, o in R.auto_chunks(F(L), Z(L)):
        parts = [(a, B1 - 1), (B1, B1), (B1 + 1, b)] if a <= B1 <= b and a < b else [(a, b)]  # the bleep alone
        for x, y in parts:
            if x <= y:
                CHUNKS.append((x, y, {"accent": [i for i in acc if x <= i <= y], "hero": any(x <= h <= y for h in HERO),
                                      "display": {i: d for i, d in DISPLAY.items() if x <= i <= y}}))

CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # "boom1": t(word(3, "sixty-three")), "fahhh1": e(Z(6)) + 0.12, "clic1": t(F(3)) + 0.15,
    "comment": t(word(LAST, "comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
