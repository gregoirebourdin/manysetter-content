#!/usr/bin/env python3
"""Reel 2 "The webinar" v3 sound: the two voices with bleeps, Grégoire's riser, BOOMs, Fahhh, clicks and music.

Kit: scripts/sound.py. Usage: python3 studio.py audio reel2
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from sound import *  # noqa: E402,F403

M = Mix(__file__)
C = M.C
H = lambda key: C[key]  # noqa: E731

# his music: its drop right after the hook; it dies like a tape before "Okay… how much?" (silence for the joke)
# and comes back once "SETTY" is said
DROP = H("drop")
M.music_bed(drop=DROP, play=[(DROP, H("howmuch") - 0.05), (H("setty_end") + 0.12, H("end") + 2.6)])
M.tape_stop(H("howmuch") - 0.55, 0.5)

M.riser_into(DROP, gain=0.45)  # his riser from frame 0, its climax + a BOOM on the drop
for k, t in C.items():
    if k.startswith("boom"):
        M.boom(t)
    elif k.startswith("fahhh"):
        M.fahhh(t)
    elif k.startswith("clic"):
        M.clic(t, 0.8)
for k in range(5):  # SETTY typed in the comment bar, once the word is said
    M.clic(H("setty_end") + 0.06 + k * 0.07, 0.45)

M.finish(music_gain=0.5, tp_max=-1.5)
