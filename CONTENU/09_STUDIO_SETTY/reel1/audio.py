#!/usr/bin/env python3
"""Reel 1 sound: Charon voice with bleeps, the trap beat, and an SFX on every motion.

  cues.json (build.py) + ../vo/reel1/vo.wav  →  audio/mix.wav          (voice + music + SFX, -14 LUFS, ≤ -1 dBTP)
                                              audio/mix_nomusic.wav  (same without music, for trending sounds)
Every sound is placed from the same cues as the picture. Kit: scripts/sound.py. Usage: python3 reel1/audio.py
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from sound import *  # noqa: E402,F403

M = Mix(__file__)
C, WORDS, sfx = M.C, M.WORDS, M.sfx
H = lambda key: C[key]  # noqa: E731

# ---------------- music: sections stop on the comedic beats ("dead.", the hostage line, the roast)
M.trap([
    (0.0, C["dead"] + 0.02, "full"),
    (C["ring"] - 0.02, C["business"] - 0.2, "full"),
    (C["plug"] - 0.12, C["you"] - 0.15, "full"),
    (C["you"] - 0.15, C["comment"] - 0.12, "lite"),
    (C["comment"] - 0.12, C["end"] + 0.25, "full"),
])
M.drone(C["business"] - 0.2, C["plug"] - 0.12)  # the hostage drop: a low drone under the silence

# ---------------- SFX
M.word_ticks()
place(sfx, impact(44), 0.0, 0.5)
place(sfx, whoosh(0.5, 400, 2600), 0.0, 0.35)
for k in ("bleep1", "bleep2", "bleep3"):
    place(sfx, thump(140), H(k) - 0.02, 0.6)
    place(sfx, click(), H(k) - 0.02, 0.4)
place(sfx, whoosh(0.35, 700, 4200), H("youdid") - 0.1, 0.4, pan=-0.3)
place(sfx, impact_word(46), H("challenge") - 0.03, 0.7)
place(sfx, swish(0.6), H("challenge") - 0.05, 0.3)
place(sfx, pop(), H("five") - 0.03, 0.4)
for d in range(4):
    place(sfx, woodblock(700 + d * 60), H("days") + d * ((H("live") + 0.15 - H("days")) / 3.2), 0.25)
M.ecg_beeps(H("voice"), H("dead"))
place(sfx, hum(1.0), H("ring") - 0.04, 0.5)
place(sfx, thump(90), H("ring") - 0.04, 0.6)
for k in range(4):
    place(sfx, click(), H("ring") + 0.24 + k * 0.04, 0.12)
place(sfx, thump(70), H("andnow") - 0.12, 0.4)
M.ping_storm(H("four") - 0.15, H("info") - 0.25)  # 40 notifications, the rain
place(sfx, impact(52), H("info") - 0.06, 0.55)
place(sfx, whoosh(0.4, 900, 3000), H("info") - 0.12, 0.3)
place(sfx, whoosh(0.7, 2500, 300), H("answer") - 0.1, 0.35)
hand_end = WORDS[32]["end"]
place(sfx, pop(), H("byhand") - 0.1, 0.35)
for k in range(5):
    place(sfx, woodblock(900), hand_end + 0.03 + k * 0.08, 0.14)
for k, f in enumerate((1200, 900, 1200)):
    place(sfx, woodblock(f), H("midnight") - 0.22 + k * 0.3, 0.22)
place(sfx, boing(150, 420), H("inbed") - 0.08, 0.35)
place(sfx, scratch(), H("business") - 0.32, 0.45)
place(sfx, whoosh(0.3, 3000, 600), H("hostage") - 0.12, 0.35, pan=-0.4)
place(sfx, impact(48), H("hostage") - 0.02, 0.6)
place(sfx, whoosh(0.3, 600, 3000), H("situation") - 0.12, 0.35, pan=0.4)
place(sfx, impact(40), H("situation") - 0.02, 0.85)
place(sfx, riser(0.55), H("plug") - 0.67, 0.3)
place(sfx, impact(46), H("plug") - 0.12, 0.6)
place(sfx, whoosh(0.4, 400, 3000), H("plug") - 0.15, 0.3)
place(sfx, key_click(), H("manychat") - 0.01, 0.6)
place(sfx, zap(0.35), H("manychat"), 0.35)
place(sfx, blip("recv"), H("manychat") + 0.06, 0.35)
place(sfx, whoosh(0.45, 300, 2500), H("learn") - 0.2, 0.35)
scan = t_(H("offer") - H("learn") + 0.15)
place(sfx, np.sin(2 * np.pi * np.cumsum(500 + 900 * scan / scan[-1]) / SR) * 0.15 * np.sin(np.linspace(0, np.pi, len(scan))), H("learn"), 0.5)
place(sfx, sparkle(0.6), H("offer") + 0.12, 0.35)
place(sfx, whoosh(0.35, 3000, 900), H("talk") - 0.14, 0.3)
place(sfx, blip("recv"), H("talk") - 0.12, 0.3)
for k in range(3):
    place(sfx, key_click(), H("talk") + 0.25 + k * 0.08, 0.2)
place(sfx, blip("send"), H("likeyou") - 0.2, 0.4)
place(sfx, blip("recv"), H("illthink") - 0.32, 0.3)
for k in range(3):
    place(sfx, key_click(), H("illthink") + 0.42 + k * 0.1, 0.2)
place(sfx, blip("send"), H("thinkend") + 0.02, 0.4)
place(sfx, pop(), H("andbook"), 0.35)
place(sfx, impact_word(52), H("call") - 0.05, 0.55)
place(sfx, sparkle(1.0, 90, 108), H("call"), 0.5)
place(sfx, hp(rng.standard_normal(int(0.25 * SR)) * np.exp(-t_(0.25) * 18), 1500), H("call"), 0.35)
place(sfx, whoosh(0.4, 500, 2600), H("inyour") - 0.12, 0.3)
place(sfx, thump(200), H("calendar"), 0.5)
for k in range(3):
    place(sfx, pop(), H("calendar") + 0.22 + k * 0.1, 0.25)
place(sfx, whoosh(0.4, 2600, 500), H("you") - 0.2, 0.35)
place(sfx, sparkle(0.9, 80, 96), H("gosleep"), 0.25)
place(sfx, whoosh(0.4, 400, 2400), H("comment") - 0.12, 0.35)
for k in range(5):
    place(sfx, key_click(), H("setty") - 0.02 + k * 0.065, 0.45)
place(sfx, blip("send"), H("setty") + 0.38, 0.45)
place(sfx, whoosh(0.5, 500, 5000), H("slide") - 0.05, 0.6, pan=0.6)
place(sfx, whoosh(0.5, 5000, 700), H("slide") + 0.5, 0.45, pan=-0.6)
place(sfx, ping(1318), H("dms_end") + 0.05, 0.35)
place(sfx, ping(1760), H("dms_end") + 0.2, 0.3)
place(sfx, pop(), H("end") + 0.32, 0.45)
place(sfx, sparkle(0.8), H("end") + 0.34, 0.3)

M.finish()
