#!/usr/bin/env python3
"""Reel 13 "The 24-hour rule": captions, bleeps and cues, from the two voices (kit: scripts/reelkit.py).

Lines come from vo/reel13_segments.json ("who" on each). F(L) / Z(L) = first / last word of line L; word(L, "text")
finds a word inside line L only. Cues: drop (end of the hook), boomN (💥 a "dinguerie"), fahhhN (😩 after a roast),
clicN (a card pops: in the gap before the line, never on a word onset), the card beats, and the CTA cues.
Usage: python3 studio.py build reel13
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
SETTY = find("SETTY")
BLEEPS = [B1, B2]                   # the hook and the punchline

ACCENT = {0: ["ten", "contacts"], 1: ["nobody", "buys.", "blast"], 2: ["Meta", "twenty-four", "hours."], 3: ["March."],
          4: ["automated", "won't", "send"], 5: ["anymore?"], 6: ["hand,", "seven", "promo.", "graveyard,"],
          7: ["locked"], 8: ["Meta", "did."], 9: ["sell"], 10: ["talking.", "twenty-four", "fresh"], 11: ["two", "days"],
          12: ["done", "typing,", "three", "follow-ups", "twenty-four"], 13: ["set", "up?"], 14: ["green", "nobody", "fake", "Lambo."],
          LAST: ["SETTY", "free."]}
HERO = {word(4, "won't"), word(6, "graveyard,"), word(8, "did."), word(10, "fresh"), word(14, "Lambo."), SETTY, word(LAST, "free.")}
# numbers in digits, "Manychat" spelled right (the voice script says "ManyChat" for the TTS)
DISPLAY = {word(0, "ten"): "10,000", word(0, "thousand"): "", word(1, "Ten"): "10,000,", word(1, "thousand,"): "",
           word(2, "twenty-four"): "24", word(6, "seven"): "7", word(10, "twenty-four"): "24", word(11, "two"): "2",
           word(12, "three"): "3", word(12, "twenty-four"): "24"}
for i, w in enumerate(W):
    if w["w"].startswith("ManyChat"):
        DISPLAY[i] = "Manychat" + w["w"][len("ManyChat"):]

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
                # the hook's bleep: the censor bar on Setty's mouth is its caption (no second bar); the punchline's bleep
                # falls while the camera is on the monitor, so its caption keeps the bar
                CHUNKS.append((x, y, {"accent": [i for i in acc if x <= i <= y], "hero": any(x <= h <= y for h in HERO),
                                      "display": {i: d for i, d in DISPLAY.items() if x <= i <= y}, "hide": x == y and x == B1}))

def pop(i, after=0.13):
    """a card pops (and his click lands) once the camera has reached the speaker (it arrives ~0.08 s after the line starts),
    inside word i: never within 0.12 s before a word onset (the click would eat its consonant)"""
    x = t(i) + after
    while any(x - 0.04 <= w["t"] <= x + 0.13 for w in W):  # the house rule's window, with a margin
        x += 0.01
    return round(x, 3)


CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # 💥 the "dingueries" (just before the word: on the onset his BOOM eats the consonant), 😩 after each roast
    "boom1": t(word(4, "won't")) - 0.1, "boom2": t(word(8, "Meta")) - 0.1, "boom3": t(word(12, "twenty-four")) - 0.1,
    "fahhh1": e(Z(6)) + 0.12, "fahhh2": e(Z(14)) + 0.12,
    # his click when a card pops: just after the camera has reached the speaker (never on a face mid-move)
    "clic1": pop(F(1)), "clic2": pop(F(2)), "clic3": pop(F(4)), "clic4": pop(F(6)), "clic5": pop(F(10)),
    "clic6": pop(word(12, "answer"), -0.25),
    # line 1: his contacts, the blast
    "ten": t(word(1, "Ten")), "nobody": t(word(1, "nobody")), "blast": t(word(1, "blast")),
    # line 2: the window opens
    "dms": t(word(2, "DMs")), "meta": t(word(2, "Meta")), "h24": t(word(2, "twenty-four")),
    # line 4: it closes
    "after": t(word(4, "After")), "automated": t(word(4, "automated")), "send4": t(word(4, "send")),
    # line 6: what's left, March
    "hand": t(word(6, "hand,")), "seven": t(word(6, "seven")), "promo": t(word(6, "promo.")), "march": t(word(6, "March")),
    "graveyard": t(word(6, "graveyard,")),
    # line 10: a new message, 24 fresh hours
    "talking": t(word(10, "talking.")), "every": t(word(10, "Every")), "fresh": t(word(10, "fresh")),
    # line 12: the setter in the window
    "plug": t(F(12)), "answer": t(word(12, "answer")), "typing": e(word(12, "typing,")), "followups": t(word(12, "follow-ups")),
    "inside": t(word(12, "inside")),
    # line 13: the music dies for the setup
    "setup": t(F(13)),
    # line 14: the punchline on the monitor
    "green": t(word(14, "green")), "pitching": t(word(14, "pitching")), "fake": t(word(14, "fake")), "lambo": t(word(14, "Lambo.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY), "free": t(word(LAST, "free.")),
    "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
