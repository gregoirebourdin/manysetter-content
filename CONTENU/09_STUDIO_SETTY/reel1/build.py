#!/usr/bin/env python3
"""Reel 1 "The challenge" (the reference): captions, bleeps and scene cues from the voice timing.

Every cue in the picture (src/scenes.js) and in the sound (audio.py) comes from the aligned voice
(../vo/reel1/timing.json), so a new take re-times the whole reel. Usage: python3 reel1/build.py
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from reelkit import Reel  # noqa: E402

R = Reel(__file__)
t, e = R.t, R.e

# swear words: bleeped in the mix, censor bar on Setty's mouth and over the caption
BLEEPS = [1, 5, 79]

# caption chunks: (first word, last word, options), see scripts/reelkit.py
CHUNKS = [
    (0, 0, {}),
    (1, 1, {"hide": True}),  # the hook is a close-up: the censor bar on Setty's mouth is the caption
    (2, 4, {}),
    (5, 5, {}),
    (6, 7, {"accent": [6], "hero": True}),
    (8, 10, {"accent": [10]}),
    (11, 12, {"accent": [12]}),
    (13, 16, {}),
    (17, 18, {}),
    (19, 21, {"accent": [19], "display": {19: "400", 20: ""}, "hero": True, "count": {19: (400, 21)}}),
    (22, 25, {"display": {25: "like…"}}),
    (26, 26, {"hide": True}),  # the giant "info?" bubble says it
    (27, 30, {"display": {30: "them…"}}),
    (31, 32, {"accent": [32], "hero": True}),
    (33, 34, {"accent": [34]}),
    (35, 36, {"accent": [36]}),
    (37, 40, {}),
    (41, 44, {"accent": [43, 44]}),
    (45, 48, {"accent": [48], "display": {48: "Manychat."}}),
    (49, 52, {"accent": [52]}),
    (53, 56, {"accent": [56]}),
    (57, 59, {}),
    (60, 63, {"display": {60: "“I’ll", 63: "it”…"}}),
    (64, 68, {"accent": [68]}),
    (69, 71, {"accent": [71]}),
    (72, 72, {"accent": [72], "hero": True}),
    (73, 75, {"accent": [75]}),
    (76, 78, {}),
    (79, 79, {}),
    (80, 81, {"accent": [81]}),
    (82, 86, {"accent": [86], "hold": 0.3}),
]

# scene cues, in seconds (shared with the sound design)
CUES = {
    "hey": t(0), "bleep1": t(1), "youdid": t(2), "bleep2": t(5), "challenge": t(6), "right": t(7),
    "five": t(8), "days": t(9), "live": t(10), "voice": t(11), "dead": t(12), "ring": t(13), "stillon": t(15),
    "andnow": t(17), "four": t(19), "people": t(21), "dms": t(24), "like": t(25), "info": t(26), "info_end": e(26),
    "answer": t(27), "byhand": t(31), "hand": t(32), "midnight": t(34), "inbed": t(35), "bed": t(36),
    "business": t(37), "business_end": e(40), "hostage_line": t(41), "hostage": t(43), "situation": t(44),
    "situation_end": e(44),
    "plug": t(45), "manychat": t(48), "manychat_end": e(48),
    "learn": t(49), "offer": t(52), "talk": t(53), "likeyou": t(56), "handle": t(57), "illthink": t(60),
    "thinkend": e(63), "andbook": t(64), "call": t(68), "inyour": t(69), "calendar": t(71), "calendar_end": e(71),
    "you": t(72), "gosleep": t(73), "sleep": t(75), "youlook": t(76), "bleep3": t(79),
    "comment": t(80), "setty": t(81), "slide": t(83), "dms_end": e(86), "end": e(86),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
