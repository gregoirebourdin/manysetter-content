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

B1, B2, B3 = word(0, "fucking"), word(5, "fucking"), word(14, "fucking")
MC, SETTY = word(8, "ManyChat."), find("SETTY")
BLEEPS = [B1, B2, B3]               # 3 at most: the hook, the coach's "six hundred [bleep]ing bucks", the punchline

ACCENT = {0: ["six"], 1: ["five"], 2: ["answer"], 3: ["two,", "five."], 4: ["another", "DMs."], 5: ["three", "hours", "firing"],
          6: ["fault.", "sleep.", "you."], 7: ["myself,"], 8: ["Nope,", "ManyChat.", "still"], 9: ["tricky"], 10: ["team,"],
          11: ["much"], 12: ["hundred", "five"], 13: ["set"], 14: ["home", "human."], LAST: ["SETTY", "free."]}
HERO = {word(4, "DMs."), MC, word(12, "five"), word(14, "human."), SETTY, word(LAST, "free.")}  # words that make their chunk big
DISPLAY = {word(0, "six"): "$600", word(0, "hundred"): "", word(1, "five"): "5%.", word(1, "percent."): "",
           word(3, "two,"): "2,", word(3, "five."): "5.", word(4, "five,"): "5,", word(5, "Six"): "$600", word(5, "hundred"): "",
           word(5, "three"): "3", MC: "Manychat.", word(12, "A"): "", word(12, "hundred"): "$119", word(12, "nineteen"): "",
           word(12, "five"): "5%.", word(12, "percent."): ""}

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
                                      "display": {i: d for i, d in DISPLAY.items() if x <= i <= y}, "hide": x == y and x in BLEEPS}))

CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops (before the line)
    "boom1": t(word(4, "DMs.")), "boom2": t(MC), "boom3": t(word(12, "five")),
    "fahhh1": e(Z(6)) + 0.12, "fahhh2": e(Z(14)) + 0.12,
    "clic1": t(F(1)) - 0.15, "clic2": t(F(3)) - 0.15, "clic3": t(F(5)) - 0.15, "clic4": t(word(6, "Other")) - 0.15,
    "clic5": t(F(8)) - 0.15, "clic6": t(F(9)) - 0.15, "clic7": t(F(12)) - 0.15,
    # card 1 (the deal): the pill "+ 5% of sales" on "five"
    "five1": t(word(1, "five")) - 0.05,
    # card 2 (his lead's DM): the question on "asked", the reply "+3 h" on "five", her status turns red after it; the camera
    # leaves the coach on Setty's "she"
    "asked": t(word(3, "asked")), "five3": t(word(3, "five.")), "she4": t(word(4, "she")),
    # card 3 (the black slide): a line on "Six", "for", "three" (the highlighter); "firing"
    "six5": t(word(5, "Six")) - 0.05, "for5": t(word(5, "for")) - 0.05, "three5": t(word(5, "three")) - 0.05,
    "firing": t(word(5, "firing")),
    # card 4 (not his fault): pops after "It's not his fault.", then other clients, a life, sleep; "not even you" is the jab
    "clients": t(word(6, "clients,")) - 0.05, "life": t(word(6, "life,")) - 0.05, "sleep": t(word(6, "sleep.")) - 0.05,
    "nobody": t(word(6, "Nobody")), "even": t(word(6, "even")), "desk": t(word(7, "desk?")),
    # card 5 (the same lead, answered while she is still here): the dots on "plug", the reply on "answer", the question on "still"
    "plug8": t(word(8, "plug")), "answer8": t(word(8, "answer")), "still8": t(word(8, "still")),
    # card 6 (the hand-off): "tricky ones?" on "tricky", "→ your team" on "team", "+ the context" on "context"
    "tricky": t(word(9, "tricky")), "team": t(word(10, "team,")), "context": t(word(10, "context")),
    # card 7 (the new math, the same paper tag as the deal): $119 a month, the pill "no commission" on "and"
    "and12": t(word(12, "and")) - 0.05,
    # the music dies on "Okay," (the setup); the punchline cuts to the sticky note on "he went home"
    "cut": t(F(13)) - 0.1, "he14": t(word(14, "he")), "home": t(word(14, "home")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
