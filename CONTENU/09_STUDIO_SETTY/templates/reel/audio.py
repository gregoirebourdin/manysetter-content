#!/usr/bin/env python3
"""Sound of this reel: Charon voice with bleeps, the trap beat, an SFX on every motion (kit: scripts/sound.py).

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

# ---------------- music: stop the beat on the comedic beats (the dead-serious turn, a punchline), "lite" under the roast
M.trap([
    (0.0, H("comment") - 0.12, "full"),  # split it: stop before the turn on black, restart on the flex
    (H("comment") - 0.12, H("end") + 0.25, "full"),
])
# M.drone(<turn> - 0.2, <flex> - 0.12)   # low drone under the dead-serious line on black

# ---------------- SFX: hook
M.word_ticks()
place(sfx, impact(44), 0.0, 0.5)
place(sfx, whoosh(0.5, 400, 2600), 0.0, 0.35)
for k in ("bleep1", "bleep2", "bleep3"):
    place(sfx, thump(140), H(k) - 0.02, 0.6)
    place(sfx, click(), H(k) - 0.02, 0.4)
place(sfx, whoosh(0.35, 700, 4200), H("youdid") - 0.1, 0.4, pan=-0.3)
place(sfx, impact_word(46), H("format") - 0.03, 0.7)
place(sfx, swish(0.6), H("format") - 0.05, 0.3)

# ---------------- SFX: the middle (one per motion)

# ---------------- SFX: CTA (the keyword is typed after it is said, so the clicks never mask "SETTY")
place(sfx, whoosh(0.4, 400, 2400), H("comment") - 0.12, 0.35)
for k in range(5):
    place(sfx, key_click(), H("setty_end") - 0.05 + k * 0.05, 0.4)
place(sfx, blip("send"), H("setty_end") + 0.28, 0.45)
place(sfx, whoosh(0.5, 500, 5000), H("slide") - 0.05, 0.6, pan=0.6)
place(sfx, whoosh(0.5, 5000, 700), H("slide") + 0.5, 0.45, pan=-0.6)
place(sfx, ping(1318), H("dms_end") + 0.05, 0.35)
place(sfx, ping(1760), H("dms_end") + 0.2, 0.3)
place(sfx, pop(), H("end") + 0.32, 0.45)
place(sfx, sparkle(0.8), H("end") + 0.34, 0.3)

M.finish()
