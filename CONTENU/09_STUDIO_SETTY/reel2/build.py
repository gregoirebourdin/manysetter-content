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

BLEEPS = [1, 5, 172]  # bitch. / fucking (hook) · fucking (the roast)

CHUNKS = [
    (0, 0, {}),
    (1, 1, {"hide": True}),  # close-up: the censor bar on Setty's mouth is the caption
    (2, 4, {}),
    (5, 5, {}),
    (6, 7, {"accent": [6], "hero": True}),
    (8, 9, {"accent": [8], "display": {8: "2"}, "hero": True}),
    (10, 12, {"accent": [10], "display": {10: "12"}}),
    (13, 15, {"accent": [14]}),
    (16, 18, {}),
    (19, 21, {}),
    (22, 23, {"accent": [23]}),
    (24, 25, {"accent": [25]}),
    (26, 28, {"accent": [28]}),
    (29, 30, {}),
    (31, 34, {"display": {34: "go…"}}),
    (35, 35, {"hide": True}),  # the giant "price?" bubble says it
    (36, 39, {"accent": [39]}),
    (40, 40, {"accent": [40], "hero": True}),
    (41, 44, {}),
    (45, 48, {"accent": [48], "display": {48: "program…"}}),
    (49, 49, {}),
    (50, 53, {"accent": [50, 51, 52, 53], "display": {50: "“I’ll", 53: "it.”"}}),
    (54, 58, {"accent": [58]}),
    (59, 63, {"accent": [62, 63]}),
    (64, 66, {}),
    (67, 69, {"accent": [68, 69], "display": {68: "1", 69: "AM."}, "hero": True}),
    (70, 75, {"accent": [72], "display": {72: "6"}}),
    (76, 77, {"accent": [76], "hero": True}),
    (78, 81, {}),
    (82, 86, {"accent": [84, 85, 86]}),
    (87, 90, {"accent": [90], "display": {90: "Manychat."}}),
    (91, 95, {"accent": [94, 95]}),
    (96, 99, {"accent": [97, 98], "display": {97: "2"}}),
    (100, 103, {"accent": [103]}),
    (104, 107, {"accent": [107]}),
    (108, 111, {"accent": [111]}),
    (112, 116, {"accent": [112, 113]}),
    (117, 122, {"accent": [122]}),
    (123, 126, {"accent": [126]}),
    (127, 132, {"accent": [128, 132]}),
    (133, 134, {"accent": [134]}),
    (135, 137, {}),
    (138, 140, {"accent": [138], "display": {138: "3"}}),
    (141, 141, {"accent": [141], "hero": True}),
    (142, 146, {"accent": [146]}),
    (147, 149, {"accent": [149]}),
    (150, 152, {"accent": [152]}),
    (153, 156, {"accent": [156]}),
    (157, 161, {"accent": [161]}),
    (162, 162, {"accent": [162], "hero": True}),
    (163, 165, {"accent": [165]}),
    (166, 170, {"accent": [169]}),
    (171, 171, {}),
    (172, 172, {"hide": True}),  # close-up: the censor bar on Setty's mouth is the caption (one bar, not two)
    (173, 173, {"accent": [173], "hero": True}),
    (174, 175, {"accent": [175]}),
    (176, 180, {"accent": [180], "hold": 0.3}),
]

CUES = {
    # hook
    "hey": t(0), "bleep1": t(1), "bleep1_end": e(1), "youdid": t(2), "bleep2": t(5), "format": t(6), "right": t(7), "right_end": e(7),
    # the flop
    "two": t(8), "hours": t(9), "twelve": t(10), "stayed": t(12), "stayed_end": e(12),
    "your_mom": t(13), "mom": t(14), "left": t(15), "pitch": t(18), "pitch_end": e(18),
    "half": t(19), "camera": t(22), "off": t(23), "eating": t(24), "cereal": t(25), "cereal_end": e(25),
    # the DMs
    "then": t(26), "replay": t(28), "dms": t(33), "go": t(34), "price": t(35), "price_end": e(35),
    "send": t(36), "ghosted": t(40), "ghosted_end": e(40),
    "another": t(41), "explain": t(45), "program": t(48), "then2": t(49), "think": t(50), "think_end": e(53),
    "never": t(54), "again": t(58), "again_end": e(58),
    "rest": t(59), "free": t(62), "indms": t(64), "at1": t(67), "one": t(68), "am_end": e(69),
    "six_line": t(70), "six": t(72), "booked": t(75), "zero": t(76), "clients_end": e(77),
    # the turn
    "funnel_line": t(78), "funnel": t(81), "hotline_line": t(82), "free2": t(84), "hotline": t(86), "hotline_end": e(86),
    # the flex
    "plug": t(87), "manychat": t(90), "manychat_end": e(90),
    "read": t(91), "salespage": t(94), "about": t(96), "know": t(100), "offer": t(103), "talk": t(104), "likeyou": t(107),
    "notbot": t(108), "bot": t(111), "bot_end": e(111),
    "onequestion": t(112), "time": t(116), "wait": t(117), "typing": t(122), "typing_end": e(122),
    "tire": t(123), "replay2": t(126), "serious": t(127), "calendar1": t(132), "calendar1_end": e(132),
    "theyghost": t(133), "followup": t(135), "three": t(138), "max": t(140), "classy": t(141), "classy_end": e(141),
    "book": t(142), "call": t(146), "summary": t(147), "incal": t(150), "calendar2": t(152), "calendar2_end": e(152),
    "spicy_line": t(153), "spicy": t(156), "spicy_end": e(156), "hand": t(157), "handyou_end": e(161),
    # the roast
    "you": t(162), "close": t(163), "laptop": t(165), "pants_line": t(166), "pants": t(169), "animal_you": t(171),
    "bleep3": t(172), "bleep3_end": e(172), "animal": t(173), "animal_end": e(173),
    # CTA
    "comment": t(174), "setty": t(175), "setty_end": e(175), "slide": t(177), "dms_end": e(180), "end": e(180),
}

if __name__ == "__main__":
    R.build(CHUNKS, BLEEPS, CUES)
