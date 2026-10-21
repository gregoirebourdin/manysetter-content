#!/usr/bin/env python3
"""Reel 21 "Human setter or AI setter": captions, bleeps and cues of the dialogue (kit: scripts/reelkit.py).

Lines come from vo/reel21_segments.json ("who" on each). F(L) / Z(L) = first / last word of line L; word(L, "text")
finds a word inside line L only. Cues: drop (end of the hook), boomN (💥 a "dinguerie"), fahhhN (😩 after a roast),
clicN (a card pops: 0.1–0.3 s BEFORE the line or a word, never on a word onset), the music cut, and the CTA cues.
Usage: python3 studio.py build reel21
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from reelkit import Reel  # noqa: E402

R = Reel(__file__)
t, e, find, W = R.t, R.e, R.find, R.W
F, Z, word, LN = R.F, R.Z, R.word, R.LN
LAST = max(LN)

B1, B2, B3 = find("fucking"), word(2, "fucking"), word(16, "fucking")
MC, SETTY = find("ManyChat,"), find("SETTY")
BLEEPS = [B1, B2, B3]               # the hook, the ring roast, the punchline

ACCENT = {0: ["hire", "setter,"], 1: ["Thirty", "DMs", "Human", "AI,", "inbox."], 2: ["boxing", "ring"],
          3: ["Round", "one,", "price."], 4: ["PayScale", "thirteen", "twenty-one", "commission.", "two", "grand"],
          6: ["nineteen", "Fifteen", "replies"], 7: ["Knockout."], 8: ["Thirty", "extra", "replies,", "thirty-nine"],
          9: ["two.", "robotic."], 10: ["voice,", "one", "question", "yourself."], 11: ["win."],
          12: ["Nope.", "sales", "call,", "big", "deals,", "objections."], 13: ["wins?"],
          14: ["Both.", "ManyChat,", "serious", "book", "hard", "call."], 16: ["fight", "group", "hug."], LAST: ["SETTY", "free."]}
HERO = {word(7, "Knockout."), word(12, "Nope."), word(14, "Both."), word(16, "hug."), SETTY, word(LAST, "free.")}
DISPLAY = {MC: "Manychat,"}         # the voice says "ManyChat" (TTS), the screen writes "Manychat"

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
    # 💥 the "dingueries" (his BOOM in the gap before the line: on a word onset it eats the consonant), 😩 after each roast
    "boom1": t(F(6)) - 0.12, "boom2": t(F(12)) - 0.12, "boom3": t(F(14)) - 0.12,
    "fahhh1": e(Z(2)) + 0.12, "fahhh2": e(Z(16)) + 0.12,
    # his click when a card pops, in the gaps before a line or a word (the AI card pops on boom1: no click there)
    "clic1": t(word(1, "DMs")) - 0.2,  # the poster pops once the camera has reached the coach
    "clic2": t(F(4)) - 0.15, "clic4": t(word(8, "Thirty")) - 0.2, "clic5": t(F(10)) - 0.16,
    "clic6": t(word(12, "He's")) - 0.15, "clic7": t(word(14, "Plug")) - 0.18,
    # the round timer on the wall: round 1 starts on "Round one", round 2 on "Round two"
    "round1": t(F(3)), "round2": t(F(9)),
    # the music dies before "Okay. How do I set you up?" (silence for the setup) and comes back after "SETTY"
    "cut": t(F(15)) - 0.15,
    # the cards follow the words
    "thirty": t(word(1, "Thirty")), "day": t(word(1, "day,")), "human": t(word(1, "Human")), "ai": t(word(1, "AI,")),
    "winner": t(word(1, "winner")),
    "says": t(word(4, "says")), "thirteen": t(word(4, "thirteen")), "commission": t(word(4, "commission.")),
    "full": t(word(4, "Full")), "grand": t(word(4, "grand")),
    "hundred": t(word(6, "hundred")), "month6": t(word(6, "month.")), "fifteen": t(word(6, "Fifteen")),
    "included": t(word(6, "included.")),
    "knockout": t(word(7, "Knockout.")),
    "easy": t(word(8, "Easy,")), "chats": t(word(8, "chats")), "needs": t(word(8, "needs")), "extra": t(word(8, "extra")),
    "nine": t(word(8, "thirty-nine")),
    "voice": t(word(10, "voice,")), "question": t(word(10, "question")), "yourself": t(word(10, "yourself.")),
    "sales": t(word(12, "sales")), "big": t(word(12, "big")), "new": t(word(12, "new")),
    "plug": t(word(14, "Plug")), "mc": t(MC), "he": t(word(14, "He")), "serious": t(word(14, "serious")), "book": t(word(14, "book")), "hard": t(word(14, "hard")),
    "call": t(word(14, "call.")),
    "fight": t(word(16, "fight")), "hug": t(word(16, "hug.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
