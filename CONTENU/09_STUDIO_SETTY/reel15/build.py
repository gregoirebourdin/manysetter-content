#!/usr/bin/env python3
"""Captions, bleeps and cues of reel15 "AI in 2 seconds", from the two voices (kit: scripts/reelkit.py).

Lines come from vo/reel15_segments.json ("who" on each). F(L) / Z(L) = first / last word of line L; word(L, "text")
finds a word inside line L only. Cues: drop (end of the hook), boomN (💥 a "dinguerie"), fahhhN (😩 after a roast),
clicN (a card pops, 0.1–0.3 s before the line), the chat bubbles on Setty's words, and the CTA cues.
Usage: python3 studio.py build reel15
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
MC, SETTY = word(10, "ManyChat."), find("SETTY")
BLEEPS = [B1, B2]

ACCENT = {0: ["AI", "auto-reply,"], 1: ["Two", "seconds,", "servers"], 2: ["leave", "two", "seconds", "too."],
          3: ["Speed", "flex."], 4: ['"hey."', "booking", 'link!"'], 5: ["still", "typing."], 6: ["already", "proposed."],
          7: ["goal.", "told"], 8: ["form", "emojis."], 9: ["number", "one", "instantly.", "slow"],
          10: ["ManyChat.", "done", "typing,", "one", "reply,", "question."], 11: ["goal"], 12: ["remember", "twice?", "Never."],
          13: ["set", "up?"], 14: ["server", "room.", "wrong", "faster."], 15: ["SETTY", "free."]}
HERO = {word(2, "too."), word(6, "proposed."), word(8, "emojis."), MC, word(12, "Never."), word(14, "faster."), SETTY,
        word(LAST, "free.")}
DISPLAY = {MC: "Manychat.", word(4, 'your..."'): 'your…"'}

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
            # both bleeps are Setty's, in close-up: the censor bar on his mouth is the caption (no second bar)
            CHUNKS.append((x, y, {"accent": [i for i in acc if x <= i <= y], "hero": any(x <= h <= y for h in HERO),
                                  "display": {i: d for i, d in DISPLAY.items() if x <= i <= y}, "hide": x == y and x in BLEEPS}))

CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # 💥 the "dingueries" (his BOOM), 😩 "Fahhh" after each roast, his click when a card pops (before the line, never on a word)
    "boom1": e(word(2, "too.")) + 0.02, "boom2": e(word(8, "emojis.")) + 0.02, "boom3": t(MC),
    "fahhh1": e(Z(6)) + 0.12, "fahhh2": e(Z(14)) + 0.12,
    "clic1": t(F(1)) - 0.17, "clic2": t(F(4)) - 0.2, "clic6": t(word(4, "Lead:", 2)) - 0.25, "clic3": t(F(7)) - 0.2, "clic4": t(word(10, "I")) - 0.2,
    "clic5": t(F(12)) - 0.25, "mem": t(F(12)) - 0.1, "demo2": t(word(4, "Lead:", 2)) - 0.12,
    # 1 his auto-reply
    "two": t(F(1)), "seconds": t(word(1, "seconds,")), "upgrading": t(word(1, "upgrading")), "one": t(word(1, "one.")),
    # 4 the demo: the lead types, the bot fires back
    "hey": t(word(4, '"hey."')), "bot1": t(word(4, '"How')), "lead2": t(word(4, '"so')), "bot2": t(word(4, '"Here\'s')),
    "link": t(word(4, 'link!"')),
    # 7 the goal asked again
    "goal": t(word(7, "goal.")), "told": t(word(7, "told")),
    # 9 the complaint
    "instantly": t(word(9, "instantly.")), "slow": t(word(9, "slow")),
    # 10 ManySetter: it waits, then one reply, one question
    "wait": t(word(10, "wait")), "done": t(word(10, "done")), "send": t(word(10, "send")), "question": t(word(10, "question.")),
    # 12 what it remembers
    "remember": t(word(12, "remember")), "same": t(word(12, "Same")), "never": t(word(12, "Never.")),
    # 14 the punchline: cut to his rack's "2.0 s" screen on "servers", back to his face on "wrong"
    "room": t(word(14, "room.")), "servers": t(word(14, "servers")), "wrong": t(word(14, "wrong")),
    "comment": t(word(LAST, "comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
