#!/usr/bin/env python3
"""Reel 6 "The 5-day challenge" sound: the two voices with bleeps, Grégoire's riser, BOOMs, Fahhh, clicks and music.

Kit: scripts/sound.py. Usage: python3 studio.py audio reel6
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from sound import *  # noqa: E402,F403

M = Mix(__file__)
C = M.C
H = lambda key: C[key]  # noqa: E731

# his music: its drop right after the hook; it dies like a tape under "How many did you answer?" (silence for "Like
# twenty."), comes back on the BOOM of "read.", stops under "Comment SETTY" so the keyword lands clean, then returns
DROP = H("drop")
M.music_bed(drop=DROP, play=[(DROP, H("twenty") - 0.1), (H("boom1"), H("comment") - 0.12), (H("setty_end") + 0.12, H("end") + 2.6)])
M.tape_stop(H("twenty") - 0.6, 0.5)

M.riser_into(DROP)  # his riser from frame 0, its climax + a BOOM on the drop
for k, t in C.items():
    if k.startswith("boom"):
        M.boom(t)
    elif k.startswith("fahhh"):
        M.fahhh(t)
    elif k.startswith("clic"):
        M.clic(t, 0.8)
for k in range(5):  # SETTY typed in the comment bar, once the word is said
    M.clic(H("setty_end") + 0.06 + k * 0.07, 0.45)
M.clic(H("dms_end") + 0.75, 0.9)  # the ring light switched off at last

M.finish(music_gain=MUSIC_BED_GAIN, tp_max=-1.5)  # his music well under the voices
