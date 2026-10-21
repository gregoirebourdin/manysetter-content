#!/usr/bin/env python3
"""Sound of this reel: the voices with bleeps, Grégoire's music, riser, BOOMs, Fahhh and clicks (kit: scripts/sound.py).

Starter from templates/reel: hook and CTA sounds are placed; place the middle on its cues (PROPS.md gives
each prop's sound). Never an SFX on a word onset: ticks 0.07 s before, blips 0.1–0.3 s before, taps after.
Usage: python3 studio.py audio <reel>   (or python3 <reel>/audio.py)
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from sound import *  # noqa: E402,F403

M = Mix(__file__)
C, WORDS, sfx = M.C, M.WORDS, M.sfx
H = lambda key: C[key]  # noqa: E731

# ---------------- the coach's take has a click in the silence after "late?" (line 5, a 30 ms burst near full scale at
# 16.57 s: AAC turned it into a -0.1 dBTP peak): mute the gap between "late?" and "I'm", 3 ms fades
_k = next(k for k, w in enumerate(WORDS) if w["w"] == "late?" and WORDS[k + 1]["w"] == "I'm")
_late, _im = WORDS[_k], WORDS[_k + 1]
_a, _b, _f = int((_late["end"] + 0.02) * SR), int((_im["t"] - 0.12) * SR), int(0.003 * SR)
for _v in (M.voice, M.VOX):
    _v[_a - _f:_a] *= np.linspace(1, 0, _f)[:, None] if _v.ndim == 2 else np.linspace(1, 0, _f)
    _v[_a:_b] = 0
    _v[_b:_b + _f] *= np.linspace(0, 1, _f)[:, None] if _v.ndim == 2 else np.linspace(0, 1, _f)

# ---------------- music: Grégoire's track, its drop on the end of the hook line; cut it on the comedic beats with
# play=[(t0, t1), …] (it keeps its own time, like a mute) and M.tape_stop(t1 - 0.5) where a joke kills it
DROP = H("right_end") + 0.05
M.music_bed(drop=DROP, play=[
    (DROP, H("cut") - 0.05),                  # it dies on "Okay," (the setup, the punchline and the Fahhh in silence)
    (H("setty_end") + 0.08, H("end") + 2.6),  # back after "Comment SETTY." so the keyword lands clean
])
M.tape_stop(H("cut") - 0.55, 0.5)

# ---------------- SFX: only his sounds, each one carries a moment (no cute chimes, no tick under every word)
M.riser_into(DROP)                       # his riser from frame 0, its climax + a BOOM on the drop
for k, t in C.items():
    if k.startswith("boom"):             # build.py: "boom1": t(find("word")) on every "dinguerie"
        M.boom(t, length=1.2 if k == "boom3" else 3.2)  # boom3 lands 0.8 s before "Okay," in the silence: a short tail
    elif k.startswith("fahhh"):          # build.py: "fahhh1": e(last word of the roast) + 0.08
        M.fahhh(t)
    elif k.startswith("clic"):           # build.py: "clic1": the moment a card pops on screen
        M.clic(t)

# ---------------- SFX: CTA (the keyword is typed after it is said, so the clicks never mask "SETTY")
for k in range(5):
    M.clic(H("setty_end") + 0.05 + k * 0.07, 0.5)  # SETTY typed in the comment bar, once the word is said

M.finish(music_gain=MUSIC_BED_GAIN, tp_max=-1.5)  # music well under the voices; the MP4 stays under -1 dBTP
