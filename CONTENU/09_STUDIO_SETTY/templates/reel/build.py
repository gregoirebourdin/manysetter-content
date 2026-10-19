#!/usr/bin/env python3
"""Captions, bleeps and scene cues of this reel, from the voice timing (kit: scripts/reelkit.py).

Starter from templates/reel: the signature hook and the CTA are already chunked and cued; the middle is
auto-chunked (a new chunk at each punctuation or every 4 words): hand-tune the chunks that matter.
Usage: python3 studio.py build <reel>   (or python3 <reel>/build.py)
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from reelkit import Reel  # noqa: E402

R = Reel(__file__)
t, e, find = R.t, R.e, R.find
LAST = len(R.W) - 1

# ---- the signature hook: "Hey, bitch. You did your fucking <format>, right?"
B1 = find("bitch.")               # bleep 1 (the censor bar on Setty's mouth is its caption)
B2 = find("fucking")              # bleep 2
FMT = B2 + 1                      # the coach's format: webinar, VSL, algorithm…
RIGHT = find("right?")            # last word of the hook
# ---- the CTA: "Comment SETTY. I'll slide into your DMs."
CTA = find("Comment", LAST - 8)
B3 = find("shit.", RIGHT)         # bleep 3, in the punchline: put the script's word here

BLEEPS = [B1, B2, B3]             # three at most: two in the hook, one in the punchline

CHUNKS = [
    (0, 0, {}),
    (B1, B1, {"hide": True}),
    *R.auto_chunks(B1 + 1, B2 - 1),
    (B2, B2, {}),
    (FMT, RIGHT, {"accent": [FMT], "hero": True}),
    # ---- the middle: start from auto chunks, then tune (accent: [i], hero, display: {i: "400"}, hide, count)
    *R.auto_chunks(RIGHT + 1, CTA - 1),
    (CTA, CTA + 1, {"accent": [CTA + 1]}),
    (CTA + 2, LAST, {"accent": [LAST], "hold": 0.3}),
]

CUES = {
    "hey": t(0), "bleep1": t(B1), "bleep1_end": e(B1), "youdid": t(B1 + 1), "bleep2": t(B2), "format": t(FMT),
    "right": t(RIGHT), "right_end": e(RIGHT),
    # ---- name the words that trigger the middle scenes, e.g. "stayed": t(find("stayed.")),
    "bleep3": t(B3),
    "comment": t(CTA), "setty": t(CTA + 1), "setty_end": e(CTA + 1), "slide": t(CTA + 3), "dms_end": e(LAST), "end": e(LAST),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
