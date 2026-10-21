#!/usr/bin/env python3
"""Captions, bleeps and cues of this dialogue reel, from the two voices (kit: scripts/reelkit.py).

Lines come from vo/<reel>_segments.json ("who" on each). F(L) / Z(L) = first / last word of line L; word(L, "text")
finds a word inside line L only (an error names the line's words if it is not there). Name the cues the scenes and the
sound use: drop (end of the hook), boomN (💥 a "dinguerie"), fahhhN (😩 after a roast), clicN (a card pops: 0.1–0.3 s
BEFORE the line or a word, never on a word onset), and the CTA cues. "total" is the kit's: never a cue name.
Usage: python3 studio.py build <reel>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from reelkit import Reel  # noqa: E402

R = Reel(__file__)
t, e, find, W = R.t, R.e, R.find, R.W
F, Z, word, LN = R.F, R.Z, R.word, R.LN
LAST = max(LN)

B1, B2 = word(0, "fucking"), word(15, "fucking")
MC, SETTY = word(11, "ManyChat."), find("SETTY")
BLEEPS = [B1, B2]                   # 3 at most

ACCENT = {0: ["price"], 1: ["Fifteen"], 3: ["Seen", "nine"], 4: ["discount."], 5: ["not", "price."], 6: ["no?"],
          7: ["awkward.", "zero"], 8: ["damn"], 9: ["one", "question."], 10: ["calls"], 11: ["Me.", "ManyChat."],
          12: ["desperate."], 13: ["forgot.", "three"], 15: ["motion", "sensor,", "Tuesday."], LAST: ["SETTY", "free."]}
HERO = {word(4, "discount."), word(7, "words."), word(11, "Me."), SETTY, word(LAST, "free.")}  # words that make their chunk big
DISPLAY = {word(1, "Fifteen"): "$1,500,", word(1, "hundred,"): "", word(1, "twelve"): "12", word(3, "nine"): "$999.",
           word(3, "ninety-nine."): "", MC: "Manychat.", word(13, "three"): "3", word(13, "twenty-four"): "24"}

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
            if x <= y:
                CHUNKS.append((x, y, {"accent": [i for i in acc if x <= i <= y], "hero": any(x <= h <= y for h in HERO),
                                      "display": {i: d for i, d in DISPLAY.items() if x <= i <= y}}))

CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops (before the line)
    "boom1": t(word(5, "not")), "boom2": t(word(7, "zero")), "boom3": t(MC),
    "fahhh1": e(Z(4)) + 0.12, "fahhh2": e(Z(15)) + 0.12,
    "clic1": t(F(1)) - 0.15, "clic2": t(F(5)) - 0.15, "clic3": t(F(9)) - 0.15, "clic4": t(word(11, "Plug")) - 0.15,
    "clic5": t(F(13)) - 0.15,
    # card A (lines 1 to 3): his DM, "Seen", the status turns red on "Tuesday", the price struck on "nine"
    "how": t(word(1, "how")) - 0.05, "fifteen": t(word(1, "Fifteen")) - 0.1, "seen": t(word(3, "Seen")),
    "tue": t(word(3, "Tuesday.")), "nine": t(word(3, "nine")),
    # the price tag: "?" on "He", "know", "yet", the pill on "what"
    "q1": t(word(5, "He")), "q2": t(word(5, "know")), "q3": t(word(5, "yet")), "ask": t(word(5, "what")) - 0.05,
    "price9": t(word(9, "price,")) - 0.05, "what9": t(word(9, "What")) - 0.05, "typing9": t(word(9, "reach")),
    "damn": t(word(8, "damn")), "answer": t(word(11, "answer")), "next": t(word(11, "next")),
    "n1": t(word(13, "nudge")) - 0.05, "n2": t(word(13, "three")) - 0.05, "n3": t(word(13, "twenty-four")) - 0.05,
    # the music dies on "Okay." (setup); the lights go off (two clicks, never on a word onset), back on after the Fahhh
    # (each switch in a gap of the onsets: no word starts 0.03 s before to 0.12 s after it)
    "cut": t(F(14)) - 0.1, "lamps": t(word(15, "lights")) - 0.08, "off1": t(word(15, "lights")) + 0.12,
    "off2": t(word(15, "motion")) + 0.08, "off3": t(word(15, "motion")) + 0.36, "off4": t(word(15, "sensor,")) + 0.1,
    "bro": t(word(15, "bro.")) - 0.12, "you15": t(word(15, "You")), "back": e(Z(15)) + 0.72,
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
