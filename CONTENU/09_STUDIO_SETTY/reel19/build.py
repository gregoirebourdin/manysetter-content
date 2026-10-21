#!/usr/bin/env python3
"""Reel 19 "The follow-up": captions, bleeps and cues of the dialogue (kit: scripts/reelkit.py).

Lines come from vo/reel19_segments.json ("who" on each). F(L) / Z(L) = first / last word of line L; word(L, "text")
finds a word inside line L only. Cues: drop (end of the hook), boomN (💥 a "dinguerie"), fahhhN (😩 after a roast),
clicN (a card pops: 0.1–0.3 s BEFORE the line or a word, never on a word onset), the music cut, and the CTA cues.
Usage: python3 studio.py build reel19
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from reelkit import Reel  # noqa: E402

R = Reel(__file__)
t, e, find, W = R.t, R.e, R.find, R.W
F, Z, word, LN = R.F, R.Z, R.word, R.LN
LAST = max(LN)

B1, B2 = find("fucking"), word(13, "fucking")
MC, H24, SETTY = find("ManyChat."), word(12, "twenty-four"), find("SETTY")
BLEEPS = [B1, B2]                   # the hook and the punchline

ACCENT = {0: ["cold,"], 1: ["program.", "nothing."], 2: ["followed", "up?"], 3: ["desperate?", "chase"],
          4: ["refreshing", "ex."], 5: ["follow-ups"], 6: ["Three.", "didn't", "say", "no.", "forgot."], 7: ["pushy?"],
          8: ["few", "hours"], 9: ["timing", "budget?\""], 10: ["Last", "one:"], 11: ["every", "lead?"],
          12: ["ManyChat.", "once,", "twenty-four", "hours,", "replies", "books."], 13: ["pigeons", "follow-ups"],
          LAST: ["SETTY", "free."]}
HERO = {word(6, "Three."), word(6, "no."), MC, word(13, "pigeons"), SETTY, word(LAST, "free.")}
DISPLAY = {MC: "Manychat.", H24: "24"}  # the voice says "ManyChat" (TTS) and "twenty-four", the screen writes them so

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
            # both bleeped words are Setty's, in close-up: the censor bar on his mouth is their caption (no second bar)
            CHUNKS.append((x, y, {"accent": [i for i in acc if x <= i <= y], "hero": any(x <= h <= y for h in HERO),
                                  "display": {i: d for i, d in DISPLAY.items() if x <= i <= y}, "hide": x == y and x in BLEEPS}))

CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # 💥 the "dingueries" (his BOOM just before the word: on the onset it eats the consonant), 😩 after each roast
    "boom1": t(word(6, "didn't")) - 0.12, "boom2": e(MC) + 0.02,  # after "ManyChat": on it, the BOOM made it "mini chat"
    "fahhh1": e(Z(4)) + 0.12, "fahhh2": e(Z(13)) + 0.12,
    # his click when a card pops, in the gaps before a line or a word
    "clic1": t(F(1)) - 0.16, "clic2": t(F(8)) - 0.15, "clic3": t(F(9)) - 0.15, "clic4": t(F(10)) - 0.15,
    "clic5": t(word(12, "Write")) - 0.16,
    # the music drops out under the trap question (it masked "So you followed up?" on the mix) and dies under the pigeons'
    # roast, back after "SETTY"
    "trap": t(F(2)) - 0.1, "trap_end": e(Z(2)) + 0.12, "cut": t(F(13)) - 0.15,
    # the cards and the acting follow the words
    "asked": t(word(1, "asked")), "program": t(word(1, "program.")), "nothing": t(word(1, "nothing.")),
    "desperate": t(word(3, "desperate?")), "chase": t(word(3, "chase")),
    "park": t(word(4, "park")), "refreshing": t(word(4, "refreshing")), "ex": t(word(4, "ex.")),
    "three": t(word(6, "Three.")), "busy": t(word(6, "busy")), "forgot": t(word(6, "forgot.")),
    "pushy": t(word(7, "pushy?")),
    "hey": t(word(8, '"hey!')), "details": t(word(8, "details")),
    "nostress": t(word(9, '"no')), "whats": t(word(9, "what's")), "timing": t(word(9, "timing")),
    "illstop": t(word(10, '"i\'ll')), "promise": t(word(10, "promise.")), "ifyou": t(word(10, "if")), "reply": t(word(10, "reply")),
    "who": t(word(11, "Who")),
    "write": t(word(12, "Write")), "send": t(word(12, "send")), "inside": t(word(12, "inside")), "stop": t(word(12, "stop")),
    "books": t(word(12, "books.")), "books_end": e(word(12, "books.")),
    "pigeons": t(word(13, "pigeons")), "get": t(word(13, "get")), "leads": t(word(13, "leads.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
