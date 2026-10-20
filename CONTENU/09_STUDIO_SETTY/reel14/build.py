#!/usr/bin/env python3
"""Reel 14 "Free coaching in the DMs": captions, bleeps and cues of the dialogue (kit: scripts/reelkit.py).

Lines come from vo/reel14_segments.json ("who" on each). F(L) / Z(L) = first / last word of line L; word(L, "text")
finds a word inside line L only. Cues: drop (end of the hook), boomN (💥 a "dinguerie"), fahhhN (😩 after a roast),
clicN (a card pops: 0.1–0.3 s BEFORE the line or a word, never on a word onset), the music cut, and the CTA cues.
Usage: python3 studio.py build reel14
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from reelkit import Reel  # noqa: E402

R = Reel(__file__)
t, e, find, W = R.t, R.e, R.find, R.W
F, Z, word, LN = R.F, R.Z, R.word, R.LN
LAST = max(LN)

B1, B2 = find("fucking"), word(12, "fucking")
MC, SETTY = find("ManyChat."), find("SETTY")
BLEEPS = [B1, B2]                   # the hook and the punchline

ACCENT = {0: ["stranger", "free"], 1: ["quick", "question,", "diet,", "sleep."], 2: ["full", "program.", "thumbs."],
          3: ["think", "Never"], 4: ["feel?"], 5: ["Five", "hours", "can't", "pay,", "doesn't"], 6: ["free", "consulting."],
          7: ["ghost", "good"], 8: ["Ask", "teach.", "fix?", "invest?"], 9: ["every", "DM."],
          10: ["ManyChat.", "One", "question", "right", "ones", "calendar,", "free", "guide."], 11: ["evenings"],
          12: ["YouTube", "channel", "beanie."], LAST: ["SETTY", "free."]}
HERO = {word(2, "thumbs."), word(5, "Five"), word(5, "hours"), word(6, "consulting."), MC, word(12, "beanie."), SETTY,
        word(LAST, "free.")}
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
    "boom1": t(word(5, "Five")) - 0.12, "boom2": t(MC),
    "fahhh1": e(Z(2)) + 0.12, "fahhh2": e(Z(12)) + 0.12,
    # his click when a card pops, in the gaps before a line or a word
    "clic1": t(F(1)) - 0.16, "clic2": t(F(2)) - 0.15, "clic3": t(F(3)) - 0.3, "clic4": t(F(8)) - 0.18,
    "clic6": t(word(10, "Only")) - 0.17,
    # the music dies under the dead-serious line (6) and comes back before line 7
    "cut": t(F(6)) - 0.15, "back": e(Z(6)) + 0.12,
    # the cards follow the words
    "quick": t(word(1, "quick")), "diet": t(word(1, "diet,")), "training": t(word(1, "training")), "sleep": t(word(1, "sleep.")),
    "typed": t(word(2, "typed")), "program": t(word(2, "program.")), "thumbs": t(word(2, "thumbs.")),
    "think": t(word(3, "think")), "never": t(word(3, "Never")), "again": t(word(3, "again.")),
    "feel": t(word(4, "feel?")),
    "teens": t(word(5, "Teens")), "cant": t(word(5, "can't")), "doesnt": t(word(5, "doesn't")), "want": t(word(5, "want")),
    "consulting": t(word(6, "consulting.")), "ghost": t(word(7, "ghost")),
    "what": t(word(8, "What")), "fix": t(word(8, "fix?")), "ready": t(word(8, "Ready")),
    "one": t(word(10, "One")), "time": t(word(10, "time.")), "right": t(word(10, "right")), "calendar": t(word(10, "calendar,")),
    "rest": t(word(10, "rest")), "guide": t(word(10, "free")),
    "evenings": t(word(11, "evenings")), "youtube": t(word(12, "YouTube")), "beanie": t(word(12, "beanie.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
