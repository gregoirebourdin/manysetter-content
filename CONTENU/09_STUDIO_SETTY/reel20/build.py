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

B1, B2 = find("fucking"), word(14, "fucking")
MC, SETTY = find("ManyChat."), find("SETTY")
BLEEPS = [B1, B2]                   # the hook and the punchline

ACCENT = {0: ["hot", "lead"], 1: ["exactly", "tonight."], 2: ["never", "comes."], 3: ["forgot."],
          4: ["cold", "feet.", "hot-cold", "empathy", "gap."], 5: ["hot-cold"], 6: ["felt", "Tomorrow,"], 7: ["eating."],
          8: ["hungry", "junk", "food", "next", "week", "tomorrow's", "burger."], 9: ["desperate."],
          10: ["finish", "hot.", "ManyChat."], 12: ["last", "question", "voice,", "two", "three", "times", "chat."],
          14: ["pancakes", "hungry", "study."], LAST: ["SETTY", "free."]}
HERO = {word(2, "comes."), word(4, "gap."), word(8, "burger."), word(10, "hot."), MC, SETTY, word(LAST, "free.")}
DISPLAY = {MC: "Manychat."}         # the voice says "ManyChat" (TTS), the screen writes "Manychat"

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
            # a bleeped word is said by Setty in close-up: the censor bar on his mouth is its caption (no second bar)
            CHUNKS.append((x, y, {"accent": [i for i in acc if x <= i <= y], "hero": any(x <= h <= y for h in HERO),
                                  "display": {i: d for i, d in DISPLAY.items() if x <= i <= y}, "hide": x == y and x in BLEEPS}))

CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # 💥 the "dingueries" (his BOOM just before the word: on the onset it eats the consonant), 😩 after each roast
    "boom1": t(word(2, "never")) - 0.1, "boom2": t(word(4, "gap.")) - 0.1, "boom3": t(word(10, "hot.")) - 0.08,
    "fahhh1": e(Z(8)) + 0.12, "fahhh2": e(Z(14)) + 0.12,
    # his click when a card pops, in the gaps before a line or a word
    "clic1": t(F(1)) - 0.16, "clic2": t(word(4, "Psychologists")) - 0.15, "clic3": t(F(6)) - 0.15, "clic4": t(F(8)) - 0.15,
    "clic5": t(F(12)) - 0.15,
    # the music dies under the dead-serious "Psychologists call it…" and comes back on the BOOM of "gap"
    "cut": t(word(4, "Psychologists")) - 0.15, "back": t(word(4, "gap.")) - 0.1,
    # the cards and the inserts follow the words
    "exactly": t(word(1, "exactly")), "shes": t(word(1, "She's")), "tonight": t(word(1, "tonight.")),
    "one": t(word(2, "one")), "spoiler": t(word(2, "Spoiler,")), "comes": t(word(2, "comes.")),
    "busy": t(word(3, "busy.")), "forgot": t(word(3, "forgot.")),
    "excited": t(word(4, "excited,")), "feet": t(word(4, "feet.")), "hotcold": t(word(4, "hot-cold")),
    "dm": t(word(6, "DM,")), "tomorrow": t(word(6, "Tomorrow,")),
    "hungry": t(word(8, "hungry")), "junk": t(word(8, "junk")), "eaten": t(word(8, "eaten.")), "ordered": t(word(8, "You")),
    "burger": t(word(8, "burger.")),
    "desperate": t(word(9, "desperate.")), "finish": t(word(10, "finish")), "plug": t(word(10, "Plug")),
    "last": t(word(12, "last")), "check": t(word(12, "check")), "two": t(word(12, "two")), "right": t(word(12, "right")),
    "pancakes": t(word(14, "pancakes")), "youre": t(word(14, "You're")), "study": t(word(14, "study.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
