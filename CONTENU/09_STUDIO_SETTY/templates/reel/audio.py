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
    (H("right_end") + 0.05, H("comment") - 0.12, "full"),  # drops in after the hook line; split it to stop on the comedic beats
    (H("setty_end") + 0.08, H("end") + 0.25, "full"),  # the beat stops under "Comment SETTY." so the keyword lands clean
])
# M.drone(<turn> - 0.2, <flex> - 0.12)   # low drone under the dead-serious line on black

# ---------------- SFX: every sound carries a moment (Grégoire, 19/10: no cute chimes in bursts, no tick on every word)
# hook: a riser from frame 0 into the drop, right after the hook line, where the beat comes in
M.riser_into(H("right_end") + 0.05)
for k in ("bleep2", "bleep3"):
    place(sfx, thump(140), H(k) - 0.02, 0.6)
    place(sfx, click(), H(k) - 0.02, 0.4)
place(sfx, whoosh(0.35, 700, 4200), H("format") - 0.32, 0.35, pan=0.3)  # the hop toward the stage
place(sfx, impact_word(46), H("format") - 0.03, 0.7)
place(sfx, swish(0.6), H("format") - 0.05, 0.3)

# ---------------- SFX: the middle: M.cut(t) on each shot change, boom(42) on a punch-in, M.suck(t) before a punchline,
# M.tape_stop(t) when the beat dies on a comedic beat

# ---------------- SFX: CTA (the keyword is typed after it is said, so the clicks never mask "SETTY")
place(sfx, whoosh(0.4, 400, 2400), H("comment") - 0.12, 0.35)
for k in range(5):
    place(sfx, key_click(), H("setty_end") + 0.04 + k * 0.05, 0.4)
place(sfx, blip("send"), H("setty_end") + 0.28, 0.45)
place(sfx, whoosh(0.5, 500, 5000), H("slide") - 0.05, 0.6, pan=0.6)
place(sfx, whoosh(0.5, 5000, 700), H("slide") + 0.36, 0.2, pan=-0.6)  # quiet: "your DMs" lands on it (reel2)

M.finish(tp_max=-1.5)  # the MP4 (AAC) then stays under -1 dBTP
