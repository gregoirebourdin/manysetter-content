#!/usr/bin/env python3
"""Reel 10 "The big coaches' DMs" (dialogue in a rented private jet): captions, bleeps and cues from the two voices.

Kit: scripts/reelkit.py. Lines (vo/reel10_segments.json): 0 hook (Setty) · 1 the jet (coach) · 2 roast (forty minutes in
your DMs, his inbox) · 4 the job posts · 5 the real post, 363K (bleep, BOOM) · 6 the big-account system · 8 roast (the
one-man call center) · 9 midnight · 10 copy the system, not the payroll (BOOM) · 12 Manychat · 14 you jump in, $119 (BOOM)
· 15 "how do I set you up?" (the music cuts) · 16 roast (the jet turns back into an Uber) · 17 the CTA.
Usage: python3 studio.py build reel10
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


B1, B2 = find("fucking"), find("shit,")
MC, SETTY = find("ManyChat."), find("SETTY")
N363, PRICE = word(5, "three"), word(14, "A")
BLEEPS = [B1, B2]

ACCENT = {0: ["DMs,"], 1: ["private", "jet."], 2: ["forty", "minutes"], 3: ["trust."], 4: ["hire", "people"],
          5: ["three", "hiring"], 6: ["films,", "answers,", "closes."], 7: ["all", "three?"], 8: ["one-man", "call", "center"],
          9: ["midnight.", "coaching"], 10: ["system,", "payroll."], 11: ["bots."], 12: ["ManyChat.", "voice,", "serious"],
          13: ["big", "deals?"], 14: ["jump", "A"], 15: ["set", "up?"], 16: ["Uber"], 17: ["SETTY", "free."]}
HERO = {N363, word(8, "beanie."), word(10, "payroll."), MC, PRICE, word(16, "Uber"), SETTY, find("free.")}
DISPLAY = {MC: "Manychat.", word(2, "forty"): "40", N363: "363K", word(5, "sixty-three"): "", word(5, "K"): "",
           PRICE: "$119", word(14, "hundred"): "", word(14, "nineteen"): "", word(14, "bucks"): "", word(16, "ten"): "10"}

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
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops
    "boom1": t(word(5, "someone?")), "boom2": t(word(10, "payroll.")), "boom3": t(word(14, "month.")),
    "fahhh1": e(Z(2)) + 0.12, "fahhh2": e(Z(8)) + 0.12, "fahhh3": e(Z(16)) + 0.12,
    "clic1": t(F(2)) + 0.1, "clic2": t(F(5)) + 0.05, "clic3": t(F(6)) + 0.05, "clic4": t(word(8, "one-man")) - 0.3,
    "clic5": t(F(10)) + 0.05, "clic6": t(F(12)) - 0.05, "clic7": t(F(14)) + 0.05,
    "jet": t(word(1, "jet.")), "live": t(word(1, "live.")), "forty": t(word(2, "forty")), "indms": t(word(2, "DMs.")),
    "trust": t(word(3, "trust.")), "posts": t(word(4, "posts.")), "n363": t(N363), "hiring": t(word(5, "hiring")),
    "films": t(word(6, "films,")), "answers": t(word(6, "answers,")), "closes": t(word(6, "closes.")),
    "three": t(word(7, "three?")), "oneman": t(word(8, "one-man")), "callc": t(word(8, "call")), "beanie": t(word(8, "beanie.")),
    "midnight": t(word(9, "midnight.")), "coaching": t(word(9, "coaching")), "system": t(word(10, "system,")),
    "bots": t(word(11, "bots.")), "mc": t(MC), "voice": t(word(12, "voice,")), "serious": t(word(12, "serious")),
    "calendar": t(word(12, "calendar.")), "jump": t(word(14, "jump")), "price": t(PRICE),
    "uber": t(word(16, "Uber")), "minutes": t(word(16, "minutes.")),
    "setup": t(F(15)), "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "send": t(word(LAST, "send")), "free": t(find("free.")), "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
