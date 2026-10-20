#!/usr/bin/env python3
"""Frames pulled from the rendered MP4 (what the phone shows), not from snapshots: a snapshot jumps straight to a time
and never shows two camera moves fighting (20/10: the hook jumped back at ~0.85 s, a cutaway lasted 3 frames).

    frames.py <mp4> <sheet.jpg> [--cues reelN/cues.json] [--at 0.3,4.2]

Without --at: finds the jumps (a frame that changes at once while the frames around it barely move: a camera that
snaps, a card set on, a flash), flags a jump that comes back to the picture it left within 0.3 s (two camera moves
fighting: the 3-frame cutaway), and lays out a contact sheet: frame 0, the hook, the frame before and after every jump
(orange time = flagged) and each line start + 0.5 s. A fast whip (a 0.12 s move) is not a jump back.
Prints the jumps and the flags as JSON on the last line (studio.py reads it).
"""
import argparse
import json
import pathlib
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SW, SH = 72, 128  # analysis size
TW, TH, COLS = 216, 384, 8  # thumbnails


def fps_of(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0",
                        str(path)], capture_output=True, text=True)
    a, b = r.stdout.strip().split("/")
    return float(a) / float(b)


def jumps(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"scale={SW}:{SH},format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    f = np.frombuffer(raw, np.uint8).reshape(-1, SH, SW).astype(np.int16)
    d = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2))  # d[k]: change from frame k to k+1
    med = float(np.median(d)) + 1e-6
    out = []
    for k in range(len(d)):
        around = max(d[max(0, k - 2)], d[min(len(d) - 1, k + 2)])
        if d[k] > max(10.0, 5 * med) and d[k] > 2.5 * around:
            out.append(k + 1)  # the frame where the picture has jumped
    return out, f


def font(size):
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def sheet(path, times, flagged, out, fps, n):
    idx = sorted({min(n - 1, max(0, round(t * fps))) for t in times})
    with tempfile.TemporaryDirectory() as td:
        sel = "+".join(f"eq(n\\,{k})" for k in idx)
        subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"select='{sel}',scale={TW}:{TH}", "-fps_mode", "passthrough",
                        f"{td}/f%04d.png"], check=True)
        thumbs = sorted(pathlib.Path(td).glob("f*.png"))
        rows = (len(thumbs) + COLS - 1) // COLS
        img = Image.new("RGB", (COLS * TW, rows * (TH + 34)), "#111")
        dr, fnt = ImageDraw.Draw(img), font(24)
        for j, (k, p) in enumerate(zip(idx, thumbs)):
            x, y = (j % COLS) * TW, (j // COLS) * (TH + 34)
            img.paste(Image.open(p), (x, y + 34))
            t = k / fps
            bad = any(a - 0.12 <= t <= b + 0.12 for a, b in flagged)
            dr.text((x + 8, y + 4), f"{t:.2f} s", fill="#ff611d" if bad else "#ddd", font=fnt)
        img.save(out, quality=86)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mp4")
    ap.add_argument("out")
    ap.add_argument("--cues")
    ap.add_argument("--at")
    a = ap.parse_args()
    fps = fps_of(a.mp4)
    js, f = jumps(a.mp4)
    n, jt = len(f), [k / fps for k in js]
    # a jump back: within 0.3 s, a jump lands on a picture much closer to the one before an earlier jump than to the
    # frame just before it (the camera went somewhere and came back)
    dist = lambda x, y: float(np.abs(f[x] - f[y]).mean())  # noqa: E731
    flagged = sorted({(j1 / fps, j2 / fps) for j2 in js for j1 in js if 0 < j2 - j1 < 0.3 * fps and j2 < n
                      and dist(j2, j1 - 1) < 0.5 * dist(j2, j2 - 1)})
    if a.at:
        times = [float(x) for x in a.at.split(",")]
    else:
        times = [0.0, 0.5, 0.85, 1.2, 2.0]
        for x in jt:
            times += [x - 1 / fps, x]
        if a.cues:
            lines = json.loads(pathlib.Path(a.cues).read_text()).get("lines", [])
            times += [ln["t"] + 0.5 for ln in lines]
        times += [n / fps - 0.05]
        times = sorted(set(round(t, 2) for t in times if 0 <= t < n / fps))[:48]
    sheet(a.mp4, times, flagged, a.out, fps, n)
    print(json.dumps({"fps": fps, "frames": n, "jumps": [round(t, 3) for t in jt], "jumps_back": [[round(x, 3), round(y, 3)] for x, y in flagged],
                      "sheet": a.out}))


if __name__ == "__main__":
    main()
