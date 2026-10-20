#!/usr/bin/env python3
"""Reel 11 "The DM script" (dialogue by the villa pool): captions, bleeps and cues from the two voices.

Kit: scripts/reelkit.py. Lines (vo/reel11_segments.json): 0 hook (Setty) · 1 his free PDF (coach) · 2 roast (the same
opener) · 3 "how much" → his call link · 4 "And then?" · 5 "Seen." · 6 roast (in caps) · 7 "what do I send?" · 8 the
script, said out loud · 9 "while I'm at the pool?" · 10 Manychat · 11 "won't sound copied?" · 12 "minus the caps lock" ·
13 "how do I set you up?" (the music cuts) · 14 roast (the villa, bleep) · 15 the CTA.
Usage: python3 studio.py build reel11
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from reelkit import Reel  # noqa: E402

R = Reel(__file__)
t, e, find, W = R.t, R.e, R.find, R.W
LN = {}
for i, w in enumerate(W):
    a, b = LN.get(w["line"], (i, i))
    LN[w["line"]] = (min(a, i), max(b, i))
F = lambda L: LN[L][0]  # noqa: E731  first word of line L
Z = lambda L: LN[L][1]  # noqa: E731  last word of line L
LAST = max(LN)


def word(L, txt):
    """index of `txt` inside line L"""
    return find(txt, F(L))


B1, B2 = find("fucking"), word(14, "fucking")
MC, SETTY = find("ManyChat."), find("SETTY")
BLEEPS = [B1, B2]

ACCENT = {0: ["DM", "script", "YouTube,"], 1: ["Lambo.", "every", "lead."], 2: ["exact", "message"], 3: ["how", "much,", "call"],
          5: ["Seen.", "pitch"], 6: ["caps."], 7: ["send?"], 8: ["Answer", "One", "question", "fit,", "two", "which", "part."],
          9: ["pool?"], 10: ["Me.", "ManyChat.", "every", "lead."], 11: ["copied?"], 12: ["you.", "caps", "lock."],
          13: ["set", "up?"], 14: ["villa", "PDF."], 15: ["SETTY", "free."]}
HERO = {word(5, "Seen."), word(6, "caps."), MC, word(12, "lock."), word(14, "PDF."), SETTY, word(LAST, "free.")}
DISPLAY = {MC: "Manychat."}

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
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops
    # the BOOMs land just before "Seen." and "caps" (on the onset they ate the word in Whisper)
    "boom1": t(word(5, "Seen.")) - 0.12, "boom2": t(MC), "boom3": t(word(12, "caps")) - 0.08,
    "fahhh1": e(Z(2)) + 0.12, "fahhh2": e(Z(6)) + 0.12, "fahhh3": e(Z(14)) + 0.12,
    "clic1": t(F(1)) + 0.1, "clic2": t(F(2)) + 0.1, "clic3": t(F(3)) + 0.05, "clic4": t(F(5)) + 0.02,
    "clic5": t(F(6)) + 0.02, "clic6": t(F(8)) - 0.05, "clic7": t(word(10, "build")) - 0.15, "clic8": t(F(12)) + 0.02, "clic9": t(word(8, "offer")) - 0.12,
    # his PDF, the lead's inbox, the chat
    "pdf": t(word(1, "PDF,")), "lambo": t(word(1, "Lambo.")), "paste": t(word(1, "paste")), "every1": t(word(1, "every")),
    "exact": t(word(2, "exact")), "guy": t(word(2, "guy")), "video": t(word(2, "video.")),
    "much": t(word(3, "much,")), "link": t(word(3, "call")),
    "think": t(word(5, "I'll")), "pitch": t(word(5, "pitch")), "caps": t(word(6, "caps.")),
    # the script, step by step on Setty's words
    "s1": t(F(8)), "s2": t(word(8, "One")), "s3": t(word(8, "Check")), "s4": t(word(8, "offer")), "think2": t(word(8, "I'll")), "s5": t(word(8, "Ask")),
    "pool": t(word(9, "pool?")),
    "build": t(word(10, "build")), "offer": t(word(10, "offer")), "adapt": t(word(10, "adapt")), "every2": t(word(10, "every")),
    "like": t(word(12, "like")), "caps2": t(word(12, "caps")), "lock_end": e(word(12, "lock.")),
    "setup": t(F(13)), "villa": t(word(14, "villa")), "copy": t(word(14, "copy-paste")), "pdf2": t(word(14, "PDF.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "send": t(word(LAST, "send")), "free": t(word(LAST, "free.")), "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
