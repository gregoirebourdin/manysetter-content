#!/usr/bin/env python3
"""Reel 7 "The Comment GUIDE flow" (dialogue in the coach's kitchen): captions, bleeps and cues from the two voices.

Kit: scripts/reelkit.py. Lines (vo/reel7_segments.json): 0 hook (Setty) · 1 400 comments, 400 guides (coach) · 3 zero
sales (bleep) · 4 the guide went out, they replied · 5 "is this guide for beginners?", the guide again · 6 roast (vending
machine) · 8 roast (the juicer) · 10 keep Manychat, add me · 12 his real question, your calendar · 13 "how do I add you?"
(the music cuts) · 14 roast (the lawn) · 15 the CTA.
Usage: python3 studio.py build reel7
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


B1, B2 = find("fucking"), word(3, "fucking")
SETTY = find("SETTY")
BLEEPS = [B1, B2]

ACCENT = {0: ["GUIDE"], 1: ["four", "guides."], 2: ["sales?"], 3: ["Zero,"], 4: ["job,", "replied,"], 5: ["beginners?", "again."],
          6: ["keyword,", "vending", "machine."], 7: ["else?"], 8: ["dust", "juicer", "January."], 9: ["whole", "midnight?"],
          10: ["add", "me.", "no", "code."], 11: ["beginner"], 12: ["real", "voice.", "serious", "calendar."], 13: ["add", "you?"],
          14: ["lawn", "brown."], 15: ["SETTY", "free."]}
HERO = {word(3, "Zero,"), word(5, "again."), word(6, "machine."), word(8, "January."), word(10, "me."), word(14, "brown."), SETTY,
        find("free.")}
# on screen: "Manychat" (the voice says "ManyChat" for the TTS), and 400 in digits (the voice says it in words)
DISPLAY = {i: w["w"].replace("ManyChat", "Manychat") for i, w in enumerate(W) if "ManyChat" in w["w"]}
for k in (word(1, "four"), find("four", word(1, "four") + 1)):
    DISPLAY[k], DISPLAY[k + 1] = "400", ""

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
            CHUNKS.append((x, y, {"accent": [i for i in acc if x <= i <= y], "hero": any(x <= h <= y for h in HERO),
                                  "display": {i: d for i, d in DISPLAY.items() if x <= i <= y},
                                  "hide": x == y == B2}))  # the coach's censor bar says it (no second bar in his close-up)

CUES = {
    "right_end": e(Z(0)), "drop": e(Z(0)) + 0.05,
    # line 1: the comments pile up, then the automation's count
    "woke": t(word(1, "woke")), "comments": e(word(1, "comments.")), "sent": t(word(1, "sent")), "l1_end": e(Z(1)),
    # 💥 the "dingueries" (his BOOM on the word), 😩 "Fahhh" after each roast, his click when a card pops
    "boom1": t(word(3, "Zero,")), "boom2": t(word(5, "again.")), "boom3": t(word(10, "add")),
    "fahhh1": e(Z(6)) + 0.12, "fahhh2": e(Z(8)) + 0.12, "fahhh3": e(Z(14)) + 0.12,
    # the clicks sit in the gap before the line, never on its first word (a click on "Nope" made Whisper hear "no")
    **{f"clic{k + 1}": t(F(L)) - 0.12 for k, L in enumerate([1, 4, 5, 6, 8, 10, 12])},
    "replied": t(word(4, "replied,")), "read": t(word(4, "read")), "flow5": t(word(5, "flow")), "guide5": t(word(5, "guide")),
    "keyword": t(word(6, "keyword,")), "question": t(word(6, "question.")), "bro6": t(word(6, "Bro,")),
    "dust": t(word(8, "dust")), "juicer": t(word(8, "juicer")), "january": t(word(8, "January.")), "l8_end": e(Z(8)),
    "two": t(word(10, "Two")), "actions": t(word(10, "actions")), "nocode": t(word(10, "code.")),
    "real": t(word(12, "real")), "voice": t(word(12, "voice.")), "serious": t(word(12, "serious")), "calendar": t(word(12, "calendar.")),
    "setup": t(F(13)), "lawn": t(word(14, "lawn")), "brown": t(word(14, "brown.")),
    "comment": t(word(LAST, "Comment")), "setty": t(SETTY), "setty_end": e(SETTY),
    "send": t(word(LAST, "send")), "free": t(find("free.")), "dms_end": e(Z(LAST)), "end": e(Z(LAST)),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
