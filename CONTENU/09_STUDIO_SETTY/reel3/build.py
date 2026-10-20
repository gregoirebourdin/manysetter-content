#!/usr/bin/env python3
"""Reel 3 "Claude on WhatsApp" (dialogue in the coach's gym): captions, bleeps and cues from the two voices.

Kit: scripts/reelkit.py. Lines (vo/reel3_segments.json): 0 hook (Setty) · 1 the tutorial (coach) · 4 the laptop, closed ·
5 his WhatsApp · 6 roast (intern) · 8 WhatsApp's terms · 9 his number (bleep) · 10 roast (your ex, the README) ·
12 Manychat · 14 hand-off · 15 "how do I set you up?" (the music cuts) · 16 roast (the bench) · 17 the CTA.
Usage: python3 studio.py build reel3
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
BLEEPS = [B1, B2]

ACCENT = {0: ["Claude"], 1: ["AI", "answers"], 2: ["right", "now?"], 3: ["Claude,"], 4: ["Closed."], 5: ["itself?"],
          6: ["intern."], 7: ["gym."], 8: ["suspend"], 9: ["number."], 10: ["every", "chat.", "ex."], 11: ["developer."],
          12: ["ManyChat.", "official"], 13: ["training?"], 14: ["own,", "hand"], 15: ["set", "up?"], 16: ["ten", "minutes."],
          17: ["SETTY", "free."]}
HERO = {word(4, "Closed."), word(6, "intern."), word(9, "number."), word(10, "ex."), MC, SETTY, find("free.")}
DISPLAY = {MC: "Manychat.", word(16, "ten"): "10"}

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
    # the tutorial, step by step on the coach's words
    "gh": t(word(1, "GitHub,")), "qr": t(word(1, "QR")), "cfg": t(word(1, "config")), "ai": t(word(1, "AI")),
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops
    "boom1": t(word(4, "Closed.")), "boom2": t(word(9, "number.")), "boom3": t(MC),
    "fahhh1": e(Z(6)) + 0.12, "fahhh2": e(Z(10)) + 0.12, "fahhh3": e(Z(16)) + 0.12,
    "clic1": t(word(1, "GitHub,")) - 0.25, "clic2": t(F(4)) + 0.1, "clic3": t(F(5)) + 0.1, "clic4": t(F(8)) + 0.15,
    "clic5": t(F(10)) + 0.1, "clic6": t(F(12)) - 0.05, "clic7": t(F(14)) + 0.05,
    "home": t(word(4, "home.")), "auto": t(word(8, "auto-messaging,")), "suspend": t(word(8, "suspend")),
    "every": t(word(10, "every")), "ex": t(word(10, "ex.")), "official": t(word(12, "official")),
    "hand": t(word(14, "hand")), "bench": t(word(16, "bench")),
    "setup": t(F(15)), "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "send": t(word(LAST, "send")), "free": t(find("free.")), "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
