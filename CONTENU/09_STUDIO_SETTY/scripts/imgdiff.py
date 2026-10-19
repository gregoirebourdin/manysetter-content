#!/usr/bin/env python3
"""Compare two snapshot folders frame by frame (mean / p99 / max absolute difference, 0-255).
Exit 1 if a frame really changed (mean > 0.5 or more than 0.2 % of pixels off by > 40): GPU noise stays under that.
Usage: python3 scripts/imgdiff.py before_dir after_dir
"""
import pathlib
import sys

import numpy as np
from PIL import Image

a, b = map(pathlib.Path, sys.argv[1:3])
bad = 0
for fa in sorted(a.glob("frame-*.png")):
    fb = b / fa.name
    if not fb.exists():
        print(f"{fa.name}: missing in {b}")
        bad += 1
        continue
    x = np.asarray(Image.open(fa).convert("RGB"), dtype=np.int16)
    y = np.asarray(Image.open(fb).convert("RGB"), dtype=np.int16)
    d = np.abs(x - y).max(axis=2)
    m, big = d.mean(), (d > 40).mean() * 100
    changed = m > 0.5 or big > 0.2
    bad += changed
    print(f"{fa.name}: mean {m:.3f}  p99 {np.percentile(d, 99):.0f}  max {d.max()}  >40: {big:.2f}%{'  <-- CHANGED' if changed else ''}")
print("identical (within GPU noise)" if not bad else f"{bad} frame(s) changed")
sys.exit(1 if bad else 0)
