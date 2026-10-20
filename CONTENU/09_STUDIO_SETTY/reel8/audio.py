#!/usr/bin/env python3
"""Reel 8 "The DM funnel stuck in 2015" sound: the two voices with bleeps, Grégoire's riser, BOOMs, Fahhh, clicks and music.

Kit: scripts/sound.py. Usage: python3 studio.py audio reel8
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from sound import *  # noqa: E402,F403

M = Mix(__file__)
C = M.C
H = lambda key: C[key]  # noqa: E731

# his music: its drop right after the hook; it dies like a tape on the coach's "and..." (he hears his own funnel),
# silence under Setty's dead-serious line, back on the BOOM of "void"; it stops under "Comment SETTY" and comes back after
DROP = H("drop")
# (a breath of silence under "Manychat": with the music on it, Whisper heard "minichab"; it comes back on the pipeline's spark)
# and lower under "And when they ghost you?" (Whisper heard "goes to" with the music at full level, clean without it)
M.music_bed(drop=DROP, play=[(DROP, H("cut")), (H("boom1"), H("mc") - 0.12), (H("mc_end") + 0.1, H("q11") - 0.06),
                             (H("ghost_end") + 0.1, H("comment") - 0.08), (H("setty_end") + 0.12, H("end") + 2.6)])
M.music_bed(drop=DROP, play=[(H("q11") - 0.06, H("ghost_end") + 0.1)], gain=0.4)
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
