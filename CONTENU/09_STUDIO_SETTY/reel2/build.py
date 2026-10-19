#!/usr/bin/env python3
"""Reel 2 "The webinar" (1 minute): captions, bleeps and scene cues from the voice timing (kit: scripts/reelkit.py).

Usage: python3 studio.py build reel2   (or python3 reel2/build.py)
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from reelkit import Reel  # noqa: E402

R = Reel(__file__)
t, e = R.t, R.e

BLEEPS = [3, 170]  # fucking (hook) · fucking (the roast); "Hey, bitch." cut on 19/10 (studio.py cut reel2 0)

CHUNKS = [
    (0, 2, {}),
    (3, 3, {}),
    (4, 5, {"accent": [4], "hero": True}),
    (6, 7, {"accent": [6], "display": {6: "2"}, "hero": True}),
    (8, 10, {"accent": [8], "display": {8: "12"}}),
    (11, 13, {"accent": [12]}),
    (14, 16, {}),
    (17, 19, {}),
    (20, 21, {"accent": [21]}),
    (22, 23, {"accent": [23]}),
    (24, 26, {"accent": [26]}),
    (27, 28, {}),
    (29, 32, {"display": {32: "go…"}}),
    (33, 33, {"hide": True}),  # the giant "price?" bubble says it
    (34, 37, {"accent": [37]}),
    (38, 38, {"accent": [38], "hero": True}),
    (39, 42, {}),
    (43, 46, {"accent": [46], "display": {46: "program…"}}),
    (47, 47, {}),
    (48, 51, {"accent": [48, 49, 50, 51], "display": {48: "“I’ll", 51: "it.”"}}),
    (52, 56, {"accent": [56]}),
    (57, 61, {"accent": [60, 61]}),
    (62, 64, {}),
    (65, 67, {"accent": [66, 67], "display": {66: "1", 67: "AM."}, "hero": True}),
    (68, 73, {"accent": [70], "display": {70: "6"}}),
    (74, 75, {"accent": [74], "hero": True}),
    (76, 79, {}),
    (80, 84, {"accent": [82, 83, 84]}),
    (85, 88, {"accent": [88], "display": {88: "Manychat."}}),
    (89, 93, {"accent": [92, 93]}),
    (94, 97, {"accent": [95, 96], "display": {95: "2"}}),
    (98, 101, {"accent": [101]}),
    (102, 105, {"accent": [105]}),
    (106, 109, {"accent": [109]}),
    (110, 114, {"accent": [110, 111]}),
    (115, 120, {"accent": [120]}),
    (121, 124, {"accent": [124]}),
    (125, 130, {"accent": [126, 130]}),
    (131, 132, {"accent": [132]}),
    (133, 135, {}),
    (136, 138, {"accent": [136], "display": {136: "3"}}),
    (139, 139, {"accent": [139], "hero": True}),
    (140, 144, {"accent": [144]}),
    (145, 147, {"accent": [147]}),
    (148, 150, {"accent": [150]}),
    (151, 154, {"accent": [154]}),
    (155, 159, {"accent": [159]}),
    (160, 160, {"accent": [160], "hero": True}),
    (161, 163, {"accent": [163]}),
    (164, 168, {"accent": [167]}),
    (169, 169, {}),
    (170, 170, {"hide": True}),  # close-up: the censor bar on Setty's mouth is the caption (one bar, not two)
    (171, 171, {"accent": [171], "hero": True}),
    (172, 173, {"accent": [173]}),
    (174, 178, {"accent": [178], "hold": 0.3}),
]

CUES = {
    # hook
    "youdid": t(0), "bleep2": t(3), "format": t(4), "right": t(5), "right_end": e(5),
    # the flop
    "two": t(6), "hours": t(7), "twelve": t(8), "stayed": t(10), "stayed_end": e(10),
    "your_mom": t(11), "mom": t(12), "left": t(13), "pitch": t(16), "pitch_end": e(16),
    "half": t(17), "camera": t(20), "off": t(21), "eating": t(22), "cereal": t(23), "cereal_end": e(23),
    # the DMs
    "then": t(24), "replay": t(26), "dms": t(31), "go": t(32), "price": t(33), "price_end": e(33),
    "send": t(34), "ghosted": t(38), "ghosted_end": e(38),
    "another": t(39), "explain": t(43), "program": t(46), "then2": t(47), "think": t(48), "think_end": e(51),
    "never": t(52), "again": t(56), "again_end": e(56),
    "rest": t(57), "free": t(60), "indms": t(62), "at1": t(65), "one": t(66), "am_end": e(67),
    "six_line": t(68), "six": t(70), "booked": t(73), "zero": t(74), "clients_end": e(75),
    # the turn
    "funnel_line": t(76), "funnel": t(79), "hotline_line": t(80), "free2": t(82), "hotline": t(84), "hotline_end": e(84),
    # the flex
    "plug": t(85), "manychat": t(88), "manychat_end": e(88),
    "read": t(89), "salespage": t(92), "about": t(94), "know": t(98), "offer": t(101), "talk": t(102), "likeyou": t(105),
    "notbot": t(106), "bot": t(109), "bot_end": e(109),
    "onequestion": t(110), "time": t(114), "wait": t(115), "typing": t(120), "typing_end": e(120),
    "tire": t(121), "replay2": t(124), "serious": t(125), "calendar1": t(130), "calendar1_end": e(130),
    "theyghost": t(131), "followup": t(133), "three": t(136), "max": t(138), "classy": t(139), "classy_end": e(139),
    "book": t(140), "call": t(144), "summary": t(145), "incal": t(148), "calendar2": t(150), "calendar2_end": e(150),
    "spicy_line": t(151), "spicy": t(154), "spicy_end": e(154), "hand": t(155), "handyou_end": e(159),
    # the roast
    "you": t(160), "close": t(161), "laptop": t(163), "pants_line": t(164), "pants": t(167), "animal_you": t(169),
    "bleep3": t(170), "bleep3_end": e(170), "animal": t(171), "animal_end": e(171),
    # CTA
    "comment": t(172), "setty": t(173), "setty_end": e(173), "slide": t(175), "dms_end": e(178), "end": e(178),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
