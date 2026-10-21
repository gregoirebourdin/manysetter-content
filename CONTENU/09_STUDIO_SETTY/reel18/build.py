#!/usr/bin/env python3
"""Captions, bleeps and cues of reel 18 "DM ads" (a dialogue in the boardroom), from the two voices (kit: scripts/reelkit.py).

Lines come from vo/reel18_segments.json ("who" on each). F(L) / Z(L) = first / last word of line L; word(L, "text")
finds a word inside line L only. Cues: drop (end of the hook), boomN (💥 a "dinguerie"), fahhhN (😩 after a roast), clicN
(a card pops, before the line or a word, never on a word onset), the cards' words, the music cut and the CTA cues.
Usage: python3 studio.py build reel18
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

ACCENT = {0: ["Meta"], 1: ["Three", "started,"], 2: ["answer?"], 3: ["conversations."], 4: ["messaged", "Not", "answer."],
          5: ["leads?"], 6: ["hellos.", "guestbook."], 7: ["ghost"], 8: ["serious", "whoever"], 9: ["DMs."],
          10: ["ManyChat.", "take", "over."], 11: ["bot?"], 12: ["One", "question", "right", "calendar."], 13: ["set"],
          14: ["empty", "boardroom."], LAST: ["SETTY", "free."]}
HERO = {word(1, "Three"), word(4, "answer."), word(6, "guestbook."), word(8, "whoever"), MC, word(14, "boardroom."), SETTY,
        word(LAST, "free.")}
# the voice says "ManyChat" (TTS), the screen writes "Manychat"; "three hundred" reads "300", like the title and the screen
DISPLAY = {MC: "Manychat."}
for L in (1, 5, 6):
    DISPLAY[word(L, "Three" if L == 1 else "three")] = "300"
    DISPLAY[word(L, "hundred")] = ""

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
    "boom1": t(word(4, "Not")) - 0.12, "boom2": t(word(8, "whoever")) - 0.12,
    "fahhh1": e(Z(6)) + 0.12, "fahhh2": e(Z(14)) + 0.12,
    # his click when a card pops, in the gaps before a line or a word
    "clic1": t(F(1)) - 0.16, "clic2": t(F(4)) - 0.16, "clic3": t(F(8)) - 0.16, "clic4": t(word(10, "Plug")) - 0.16,
    "clic5": t(F(12)) - 0.16,
    # the music dies on the setup (line 13) and comes back after "SETTY"
    "cut": t(F(13)) - 0.15,
    # the cards and the acting follow the words
    "started": t(word(1, "started,")), "look": t(word(1, "Look")),
    "answer1": t(word(2, "answer?")), "literally": t(word(3, "literally")),
    "counts": t(word(4, "counts")), "messaged": t(word(4, "messaged")), "ad": t(word(4, "ad.")),
    "leads": t(word(5, "leads?")), "hellos": t(word(6, "hellos.")), "guestbook": t(word(6, "guestbook.")),
    "ghost": t(word(7, "ghost")),
    "serious": t(word(8, "serious")), "waited": t(word(8, "waited,")), "moved": t(word(8, "moved")), "first": t(word(8, "first.")),
    "calls": t(word(9, "calls")), "live": t(word(9, "live")),
    "mc": t(MC), "trigger": t(word(10, "trigger,")), "they": t(word(10, "they")), "over": t(word(10, "over.")),
    "bot": t(word(11, "bot?")),
    "one": t(word(12, "One")), "time": t(word(12, "time.")), "only": t(word(12, "Only")), "calendar": t(word(12, "calendar.")),
    "presenting": t(word(14, "presenting")), "empty": t(word(14, "empty")), "boardroom": t(word(14, "boardroom.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
