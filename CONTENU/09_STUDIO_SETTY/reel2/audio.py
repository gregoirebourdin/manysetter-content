#!/usr/bin/env python3
"""Reel 2 "The webinar" sound: Charon with bleeps, the trap beat stopping on the punchlines, an SFX on every motion.

Kit: scripts/sound.py. Usage: python3 studio.py audio reel2   (or python3 reel2/audio.py)
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from sound import *  # noqa: E402,F403

M = Mix(__file__)
C, WORDS, sfx = M.C, M.WORDS, M.sfx
H = lambda key: C[key]  # noqa: E731

# ---------------- music: the beat drops out on "Ghosted.", goes lite under the story, stops for the turn on black
M.trap([
    (0.0, H("ghosted") - 0.05, "full"),
    (H("ghosted_end") + 0.25, H("rest") - 0.1, "lite"),
    (H("rest") - 0.1, H("funnel_line") - 0.2, "full"),
    (H("manychat_end") - 0.05, H("classy") - 0.05, "full"),  # the beat drops back in on the spark, after "Manychat"
    (H("classy_end") + 0.1, H("you") - 0.15, "full"),
    (H("you") - 0.15, H("comment") - 0.12, "lite"),
    (H("comment") - 0.12, H("end") + 2.4, "full"),
])
M.drone(H("funnel_line") - 0.2, H("manychat_end") - 0.05)  # under the line on black, until the spark

# ---------------- SFX
M.word_ticks()
# hook
place(sfx, impact(44), 0.0, 0.5)
place(sfx, whoosh(0.5, 400, 2600), 0.0, 0.35)
for k in ("bleep1", "bleep2", "bleep3"):
    place(sfx, thump(140), H(k) - 0.02, 0.6)
    place(sfx, click(), H(k) - 0.02, 0.4)
place(sfx, whoosh(0.35, 700, 4200), H("youdid") - 0.1, 0.4, pan=-0.3)
place(sfx, impact_word(46), H("format") - 0.03, 0.7)
place(sfx, swish(0.6), H("format") - 0.05, 0.3)
# the flop: LIVE pill, viewers melting, mom leaves, camera off
place(sfx, pop(), H("two") - 0.25, 0.4)
for k in range(8):
    place(sfx, woodblock(1100 - k * 70), H("two") + 0.15 + k * ((H("stayed") - H("two") - 0.1) / 8), 0.07)
place(sfx, blip("recv"), H("left") - 0.25, 0.35)
place(sfx, whoosh(0.35, 2500, 700), H("pitch_end") + 0.05, 0.25)
place(sfx, pop(), H("camera") - 0.25, 0.35)
for k in range(5):
    place(sfx, woodblock(900), H("off") + 0.08 + k * 0.08, 0.12)
for k in range(3):
    place(sfx, thump(320), H("cereal_end") + 0.03 + k * 0.12, 0.25)  # crunch, once the word is said
# the DMs: the rain, the giant "price?", ghosted
M.ping_storm(H("replay") - 0.15, H("price") - 0.25)
place(sfx, impact(52), H("price") - 0.06, 0.55)
place(sfx, whoosh(0.4, 900, 3000), H("price") - 0.12, 0.3)
place(sfx, whoosh(0.7, 2500, 300), H("send") - 0.12, 0.35)
place(sfx, blip("send"), H("send") - 0.2, 0.4)
place(sfx, impact(48), H("ghosted") - 0.02, 0.55)
place(sfx, whoosh(0.6, 600, 5000), H("ghosted_end") + 0.05, 0.45, pan=0.4)
# the program wall, "I'll think about it", seen 3 days ago
place(sfx, whoosh(0.45, 300, 2500), H("another") - 0.15, 0.3)
place(sfx, blip("send"), H("explain") - 0.2, 0.4)
for k in range(6):
    place(sfx, key_click(), H("explain") + 0.35 + k * 0.09, 0.1)
place(sfx, blip("recv"), H("think") - 0.25, 0.35)
place(sfx, blip("send"), H("never") - 0.2, 0.3)
place(sfx, scratch(), H("again_end") + 0.03, 0.3)
# free coaching at 1 AM, six calls zero clients
place(sfx, whoosh(0.4, 2600, 500), H("rest") - 0.15, 0.3)
for k, key in enumerate(("free", "indms", "at1", "one")):  # the lock screen lights up: a soft ping per notification
    place(sfx, ping(1568 if k % 2 else 1318), H(key) - 0.15, 0.14)
place(sfx, blip("recv"), H("six") - 0.25, 0.35)
place(sfx, impact_word(50), H("zero") - 0.03, 0.6)
# the turn
place(sfx, scratch(), H("funnel_line") - 0.32, 0.45)
place(sfx, hum(1.4), H("free2") - 0.12, 0.45)  # the neon buzzes on
place(sfx, impact(48), H("free2") - 0.02, 0.5)
place(sfx, impact(40), H("hotline") - 0.02, 0.8)
# the plug
place(sfx, riser(0.55), H("plug") - 0.67, 0.3)
place(sfx, impact(46), H("plug") - 0.12, 0.6)
place(sfx, whoosh(0.4, 400, 3000), H("plug") - 0.15, 0.3)
# the spark lands once "Manychat" is said (an SFX on the brand name blurs it)
place(sfx, key_click(), H("manychat_end") - 0.04, 0.6)
place(sfx, zap(0.35), H("manychat_end") - 0.03, 0.35)
place(sfx, blip("recv"), H("manychat_end") + 0.03, 0.35)
# the pipeline: messages travel Instagram → Manychat → ManySetter → Calendly
for k in range(4):
    place(sfx, blip("recv"), H("manychat_end") + 0.25 + k * 0.3, 0.12, pan=-0.3 + 0.2 * k)
# the flex: playbook, thread, typing, replay, qualified, follow-ups, booked, calendar
place(sfx, whoosh(0.45, 300, 2500), H("read") - 0.2, 0.35)
scan = t_(H("offer") - H("read") + 0.15)
place(sfx, np.sin(2 * np.pi * np.cumsum(500 + 900 * scan / scan[-1]) / SR) * 0.15 * np.sin(np.linspace(0, np.pi, len(scan))), H("read"), 0.5)
place(sfx, sparkle(0.6), H("offer") + 0.05, 0.35)
place(sfx, whoosh(0.35, 3000, 900), H("talk") - 0.14, 0.3)
place(sfx, blip("recv"), H("talk") - 0.12, 0.3)
place(sfx, blip("send"), H("likeyou") + 0.02, 0.4)
for k in range(4):
    place(sfx, key_click(), H("wait") + 0.05 + k * 0.12, 0.1)
place(sfx, blip("recv"), H("typing_end") + 0.02, 0.35)
place(sfx, blip("send"), H("replay2") - 0.2, 0.4)
place(sfx, sparkle(0.3), H("calendar1") + 0.15, 0.15)  # short: "They ghost?" follows right after
for key in ("followup", "three", "max"):
    place(sfx, blip("send"), H(key) - 0.22, 0.25)
place(sfx, pop(), H("book") - 0.25, 0.35)
place(sfx, impact_word(52), H("call") - 0.05, 0.55)
place(sfx, sparkle(1.0, 90, 108), H("call"), 0.5)
place(sfx, hp(rng.standard_normal(int(0.25 * SR)) * np.exp(-t_(0.25) * 18), 1500), H("call"), 0.35)
place(sfx, whoosh(0.4, 500, 2600), H("incal") - 0.12, 0.3)
place(sfx, thump(200), H("calendar2"), 0.5)
for k in range(3):
    place(sfx, pop(), H("calendar2") + 0.22 + k * 0.1, 0.25)
# the sorter: each lead slides into its lane
for key, dt in (("tire", 0.22), ("tire", 0.6), ("serious", 0.22), ("serious", 0.62)):
    place(sfx, whoosh(0.3, 1800, 600), H(key) + dt, 0.12)
# spicy: flame, handed to you
place(sfx, whoosh(0.4, 2600, 500), H("spicy_line") - 0.2, 0.3)
place(sfx, zap(0.3), H("spicy_end") + 0.02, 0.25)
place(sfx, blip("recv"), H("hand") - 0.25, 0.35)
# the roast
place(sfx, whoosh(0.4, 2600, 500), H("you") - 0.2, 0.35)
place(sfx, pop(), H("close") - 0.25, 0.3)
place(sfx, thump(110), H("laptop") + 0.25, 0.45)  # the laptop shuts
place(sfx, thump(110), H("pants") - 0.02, 0.35)  # low: a boing here blurred "put"
# CTA (the keyword is typed after it is said, so the clicks never mask "SETTY")
place(sfx, whoosh(0.4, 400, 2400), H("comment") - 0.12, 0.35)
for k in range(5):
    place(sfx, key_click(), H("setty_end") - 0.05 + k * 0.05, 0.4)
place(sfx, blip("send"), H("setty_end") + 0.28, 0.45)
place(sfx, whoosh(0.5, 500, 5000), H("slide") - 0.05, 0.6, pan=0.6)
place(sfx, whoosh(0.5, 5000, 700), H("slide") + 0.36, 0.2, pan=-0.6)  # quiet: "your DMs" lands on it
place(sfx, ping(1318), H("dms_end") + 0.05, 0.35)
place(sfx, ping(1760), H("dms_end") + 0.2, 0.3)
place(sfx, pop(), H("end") + 0.32, 0.45)
place(sfx, sparkle(0.8), H("end") + 0.34, 0.3)

M.finish(tp_max=-1.5)  # the MP4 (AAC) then stays under -1 dBTP
