#!/usr/bin/env python3
"""Reel 5 "Calendly and the no-shows" (dialogue in a coffee shop): captions, bleeps and cues from the two voices.

Kit: scripts/reelkit.py. Lines (vo/reel5_segments.json): 0 hook (Setty) · 1 booked all week (Calendly events) ·
3 "fifteen minutes" (the laptop insert) · 4 roast (waving on Zoom) · 5 the no-shows (bleep) · 6 the link asks nothing
(the auto DM) · 8 "free to ghost" · 9 "so I stop sending the link?" (the music dies) · 10 "earn it", Manychat (the
music slams back) · 12 the free guide (the sorter) · 14 the times and the booked call · 16 roast (he's still asleep) ·
17 the CTA.
Usage: python3 studio.py build reel5
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


B1, B2 = find("fucking"), word(5, "fucking")
MC, SETTY = word(10, "ManyChat,"), find("SETTY")
BLEEPS = [B1, B2]

ACCENT = {0: ["Calendly"], 1: ["Booked", "week,"], 2: ["nine", "o'clock?"], 3: ["fifteen", "minutes."], 4: ["Zoom.", "public."],
          5: ["no-show", "energy!"], 6: ["budget,", "goal,", "idea"], 7: ["book?"], 8: ["free.", "ghost."], 9: ["stop", "link?"],
          10: ["earn", "it.", "ManyChat,"], 11: ["fit?"], 12: ["guide.", "calendar."], 13: ["good"], 14: ["two", "three", "summary"],
          15: ["get", "you?"], 16: ["Zoom,", "asleep."], 17: ["SETTY", "free."]}
HERO = {word(4, "public."), word(8, "ghost."), word(10, "it."), word(16, "asleep."), SETTY, word(LAST, "free.")}
DISPLAY = {MC: "Manychat,", word(2, "nine"): "9", word(3, "fifteen"): "15", word(14, "two"): "2", word(14, "three"): "3"}

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
    "boom1": t(word(8, "ghost.")), "boom2": t(word(10, "earn")),
    "fahhh1": e(Z(4)) + 0.12, "fahhh2": e(Z(16)) + 0.12,
    "clic1": t(F(1)) + 0.1, "clic2": t(F(5)) + 0.1, "clic3": t(F(6)) + 0.1, "clic4": t(word(10, "Plug")) - 0.05,
    "clic5": t(F(12)) + 0.1, "clic6": t(F(14)) + 0.1, "clic7": t(word(14, "time")) - 0.12, "book": t(word(14, "book")), "offer": t(word(14, "offer")),
    # the week fills on "Booked"; the laptop insert from "Like,"; the no-shows land on their words
    "booked": t(word(1, "Booked")), "late": t(word(3, "Like,")), "public": t(word(4, "public.")),
    "ns1": e(word(5, "Third")), "ns2": e(word(5, "no-show")), "ns3": e(word(5, "week.")), "nstotal": t(word(5, "These")),
    "budget": t(word(6, "budget,")), "goal": t(word(6, "goal,")), "idea": t(word(6, "idea")),
    "stop": t(F(9)), "ask": t(word(10, "ask")),
    "guide": t(word(12, "guide.")), "calendar": t(word(12, "calendar.")),
    "times": t(word(14, "two")), "summary": t(word(14, "summary")),
    "zoomw": t(word(16, "Zoom,")), "still": t(word(16, "He's")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "send": t(word(LAST, "send")), "free": t(word(LAST, "free.")), "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
