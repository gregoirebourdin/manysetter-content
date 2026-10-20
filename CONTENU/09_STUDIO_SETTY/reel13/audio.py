#!/usr/bin/env python3
"""Reel 13 "The 24-hour rule": the voices with bleeps, Grégoire's music, riser, BOOMs, Fahhh and clicks
(kit: scripts/sound.py). Never an SFX on a word onset: the cues sit in the breaths (build.py).
Usage: python3 studio.py audio reel13   (or python3 reel13/audio.py)
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from sound import *  # noqa: E402,F403

M = Mix(__file__)
C, WORDS, sfx = M.C, M.WORDS, M.sfx
H = lambda key: C[key]  # noqa: E731

# his music: its drop right after the hook; it dies like a tape after the last BOOM ("twenty-four hours."), so
# "Okay. How do I set you up?" and the green-screen roast land in silence, and comes back once "SETTY" is said
DROP = H("right_end") + 0.05
M.music_bed(drop=DROP, play=[(DROP, H("setup") - 0.15), (H("setty_end") + 0.12, H("end") + 2.6)])
M.tape_stop(H("setup") - 0.65, 0.5)

M.riser_into(DROP)  # his riser from frame 0, its climax + a BOOM on the drop
for k, t in C.items():
    if k.startswith("boom"):    # 💥 the dingueries (build.py: just before the word)
        M.boom(t)
    elif k.startswith("fahhh"):  # 😩 after each roast (a 0.95 s pause in the voice)
        M.fahhh(t)
    elif k.startswith("clic"):   # a card pops, in the breath before the line
        M.clic(t, 0.8)
for k in range(5):  # SETTY typed in the comment bar, once the word is said
    M.clic(H("setty_end") + 0.06 + k * 0.07, 0.45)

M.finish(music_gain=MUSIC_BED_GAIN, tp_max=-1.5)  # his music well under the voices
