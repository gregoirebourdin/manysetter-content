#!/usr/bin/env python3
"""Reel 14 "Free coaching in the DMs": the voices with bleeps, Grégoire's music, riser, BOOMs, Fahhh and clicks (kit: scripts/sound.py).

Never an SFX on a word onset: the clicks sit 0.15–0.3 s before a line, the BOOMs just before their word.
Usage: python3 studio.py audio reel14   (or python3 reel14/audio.py)
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from sound import *  # noqa: E402,F403

M = Mix(__file__)
C, WORDS, sfx = M.C, M.WORDS, M.sfx
H = lambda key: C[key]  # noqa: E731

# his music: its drop right after the hook; it dies like a tape before the dead-serious line ("That's not lead gen. That's
# free consulting." in silence), comes back before "So I ghost them?", and stops under "Comment SETTY." (the keyword clean)
DROP = H("drop")
M.music_bed(drop=DROP, play=[(DROP, H("cut")), (H("back"), H("comment") - 0.12), (H("setty_end") + 0.08, H("end") + 2.6)])
M.tape_stop(H("cut") - 0.5, 0.5)

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

M.finish(music_gain=MUSIC_BED_GAIN, tp_max=-1.5)  # his music well under the voices
