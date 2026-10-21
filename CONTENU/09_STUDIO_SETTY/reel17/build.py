#!/usr/bin/env python3
"""Captions, bleeps and cues of reel 17 "Make and ChatGPT" (kit: scripts/reelkit.py).

Lines come from vo/reel17_segments.json ("who" on each). F(L) / Z(L) = first / last word of line L; word(L, "text", nth)
finds a word inside line L only. Cues: drop (end of the hook), boomN (a "dinguerie", just before its word), fahhhN (after
a roast), clicN (a card pops, in a gap, never on a word onset), the words the cards follow, the music cut, the CTA.
Usage: python3 studio.py build reel17
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
MC1, MC2, SETTY = word(1, "ManyChat"), word(10, "ManyChat."), find("SETTY")
BLEEPS = [B1, B2]                   # the hook and the punchline

ACCENT = {0: ["AI", "setter"], 1: ["ManyChat", "Make,", "ChatGPT", "back."], 2: ["three", "messages"],
          3: ["all", "three?", "espresso."], 4: ["remember"], 5: ["twice."],
          6: ["Memory", "wire", "Conversation", "ID", "too."], 7: ["cheap."], 8: ["credits,", "tokens,", "Saturday", "nights"],
          9: ["developer.", "maintain."], 10: ["model", "setter,", "I", "am.", "already", "built.", "ManyChat."],
          12: ["bed.", "webhooks."], LAST: ["SETTY", "free."]}
HERO = {word(3, "espresso."), word(6, "too."), word(10, "am."), word(12, "webhooks."), SETTY, word(LAST, "free.")}
DISPLAY = {MC1: "Manychat", MC2: "Manychat."}  # the voice says "ManyChat" (TTS), the screen writes "Manychat"

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
    "boom1": e(word(3, "on")), "boom2": e(word(6, "those")), "boom3": t(word(10, "I")) - 0.1,
    "fahhh1": e(Z(8)) + 0.12, "fahhh2": e(Z(12)) + 0.12,
    # his click when a card pops, in the gaps before a line or a word
    "clic1": t(MC1) - 0.17, "clic2": t(F(2)) - 0.16, "clic3": t(F(3)) - 0.16, "clic4": t(F(6)) - 0.16,
    "clic5": t(word(6, "The")) - 0.14, "clic6": t(F(8)) - 0.16, "clic7": e(word(10, "am.")) + 0.06,
    # the music dies under "Okay. How do I set you up?" (silence for the setup) and comes back after "SETTY"
    "cut": t(F(11)) - 0.15,
    # the cards follow the words
    "mc": t(MC1), "make": t(word(1, "Make,")), "gpt": t(word(1, "ChatGPT")), "back": t(word(1, "Make", 2)),
    "now": t(word(2, "Now")), "sends": t(word(2, "sends")), "msgs": t(word(2, "messages")),
    "answers": t(word(3, "answers")), "three": t(word(3, "three?")), "robot": t(word(3, "robot")),
    "memory": t(word(6, "Memory")), "save": t(word(6, "save")), "id": t(word(6, "ID")), "sendback": t(word(6, "send")),
    "right": t(word(6, "right")), "booking": t(word(6, "booking,")), "follow": t(word(6, "follow-ups?")),
    "credits": t(word(8, "credits,")), "tokens": t(word(8, "tokens,")), "saturday": t(word(8, "Saturday")),
    "garage": t(word(8, "garage.")),
    "wait": t(word(10, "wait,")), "mem2": t(word(10, "memory,")), "questions": t(word(10, "questions,")),
    "booking2": t(word(10, "booking,")), "follow2": t(word(10, "follow-ups,")), "built": t(word(10, "already")),
    "plug": t(word(10, "Plug")), "bed": t(word(12, "bed.")), "webhooks": t(word(12, "webhooks.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
