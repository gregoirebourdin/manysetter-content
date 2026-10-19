#!/usr/bin/env python3
"""Reel 2 "The webinar" v3 (dialogue: the coach at his desk, Setty in bed): captions, bleeps and cues from the voices.

Kit: scripts/reelkit.py. Lines (vo/reel2_segments.json): 0 hook (Setty) · 3 the 63 messages (coach) · 6 roast · 8 roast ·
10 Manychat · 14 calendar · 16 roast · 17 "how much?" (coach) · 18 the roast back · 19 the CTA.
Usage: python3 studio.py build reel2
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


def word(L, txt):
    """index of `txt` inside line L"""
    return find(txt, F(L))


B1, B2 = find("fucking"), find("shit,")
SIXTY, MC = find("sixty-three"), find("ManyChat.")
SETTY = find("SETTY")
BLEEPS = [B1, B2]

ACCENT = {0: ["webinar,"], 2: ["DMs."], 3: ["sixty-three"], 4: ['"how', 'much"'], 5: ["tonight."], 6: ["shoes"],
          7: ["vanished."], 8: ["first."], 9: ["disappeared."], 10: ["ManyChat."], 11: ["robotic"], 12: ["like", "you,"],
          13: ["free", "consulting?"], 14: ["calendar."], 15: ["think"], 16: ["beg."], 17: ["much?"], 18: ['"how', 'much"', "now."],
          19: ["SETTY"]}
HERO = {SIXTY, MC, find("calendar."), find("beg."), find("now."), SETTY}
DISPLAY = {SIXTY: "63", MC: "Manychat."}

CHUNKS = []
for L in sorted(LN):
    acc = [word(L, w) for w in ACCENT.get(L, [])]
    for a, b, o in R.auto_chunks(F(L), Z(L)):
        # the bleeped words get their own chunk (the censor bar), the hero words make their chunk big
        if a <= B1 <= b and a < b:
            parts = [(a, B1 - 1), (B1, B1), (B1 + 1, b)] if a < B1 else [(B1, B1), (B1 + 1, b)]
        else:
            parts = [(a, b)]
        for x, y in parts:
            if x > y:
                continue
            CHUNKS.append((x, y, {"accent": [i for i in acc if x <= i <= y], "hero": any(x <= h <= y for h in HERO),
                                  "display": {i: d for i, d in DISPLAY.items() if x <= i <= y}}))

CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops
    "boom1": t(SIXTY), "boom2": t(word(7, "vanished.")), "boom3": t(MC), "boom4": t(word(14, "calendar.")),
    "fahhh1": e(Z(6)) + 0.12, "fahhh2": e(Z(8)) + 0.12, "fahhh3": e(Z(16)) + 0.12, "fahhh4": e(Z(18)) + 0.12,
    "clic1": t(F(3)) + 0.15, "clic2": t(F(4)) + 0.1, "clic3": t(F(7)) + 0.1, "clic4": t(F(10)) - 0.05,
    "clic5": t(F(12)) + 0.1, "clic6": t(F(14)) - 0.05, "clic7": t(F(16)) - 0.05,
    "howmuch": t(F(17)), "comment": t(word(19, "comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "slide": t(word(19, "slide")), "dms_end": e(Z(19)), "end": e(Z(19)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
