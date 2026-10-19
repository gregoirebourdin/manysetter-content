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

# ---- the signature hook (no "Hey [bleep]." since 19/10): "You did your fucking <format>, right?"
B2 = find("fucking")              # the hook's bleep
FMT = B2 + 1                      # the coach's format: webinar, VSL, algorithm…
RIGHT = find("right?")            # last word of the hook
# ---- the CTA: "Comment SETTY. I'll slide into your DMs."
CTA = find("Comment", LAST - 8)
B3 = find("fucking", RIGHT)       # bleep 2, in the punchline: put the script's word here

BLEEPS = [B2, B3]                 # three at most

CHUNKS = [
    *R.auto_chunks(0, B2 - 1),
    (B2, B2, {}),
    (FMT, RIGHT, {"accent": [FMT], "hero": True}),
    # ---- the middle: start from auto chunks, then tune (accent: [i], hero, display: {i: "400"}, hide, count)
    *R.auto_chunks(RIGHT + 1, CTA - 1),
    (CTA, CTA + 1, {"accent": [CTA + 1]}),
    (CTA + 2, LAST, {"accent": [LAST], "hold": 0.3}),
]

CUES = {
    "youdid": t(0), "bleep2": t(B2), "format": t(FMT),
    "right": t(RIGHT), "right_end": e(RIGHT),
    # ---- name the words that trigger the middle scenes, e.g. "stayed": t(find("stayed.")),
    "bleep3": t(B3),
    "comment": t(CTA), "setty": t(CTA + 1), "setty_end": e(CTA + 1), "slide": t(CTA + 3), "dms_end": e(LAST), "end": e(LAST),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
