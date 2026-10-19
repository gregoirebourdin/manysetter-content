#!/usr/bin/env python3
"""Assemble a two-voice dialogue from each speaker's tightened take (scripts/voice.py output, one per speaker).

Every line is cut out of its speaker's take at word boundaries (a little air kept around it), then the lines are laid
end to end in script order: a short gap when the speaker changes (--turn-gap), a breath when the same one goes on
(--line-gap), plus the line's own "pause" from the segments (a "Fahhh" after a roast needs ~0.9 s).
Writes vo.wav (48 kHz) and timing.json, whose words carry their line and their speaker ("who").

Usage: python3 scripts/dialogue.py vo/reel2_segments.json out_dir setty=vo/_dialogue/reel2/setty_Charon coach=… [--turn-gap 0.2]
"""
import argparse
import json
import pathlib

import numpy as np
import soundfile as sf

SR = 48000
LEAD, TAIL = 0.06, 0.12


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("segments")
    ap.add_argument("out")
    ap.add_argument("speakers", nargs="+", help="who=dir (a voice.py output: vo.wav + timing.json)")
    ap.add_argument("--turn-gap", type=float, default=0.2)
    ap.add_argument("--line-gap", type=float, default=0.28)
    a = ap.parse_args()
    segs = json.loads(pathlib.Path(a.segments).read_text())
    src = {}
    for sp in a.speakers:
        who, d = sp.split("=", 1)
        d = pathlib.Path(d)
        x, sr = sf.read(d / "vo.wav", dtype="float64")
        assert sr == SR, sr
        src[who] = {"x": x if x.ndim == 1 else x.mean(axis=1), "t": json.loads((d / "timing.json").read_text())}

    local = {w: 0 for w in src}
    out, words, lines, pos = [], [], [], 0.0
    fade = int(0.005 * SR)
    for gi, s in enumerate(segs):
        who = s["who"]
        S = src[who]
        k = local[who]
        local[who] += 1
        ws = [w for w in S["t"]["words"] if w["line"] == k]
        prev = [w for w in S["t"]["words"] if w["line"] == k - 1]
        nxt = [w for w in S["t"]["words"] if w["line"] == k + 1]
        a0 = max(ws[0]["t"] - LEAD, (prev[-1]["end"] + 0.02) if prev else 0.0)
        b0 = min(ws[-1]["end"] + TAIL, (nxt[0]["t"] - 0.03) if nxt else len(S["x"]) / SR)
        piece = S["x"][int(a0 * SR) : int(b0 * SR)].copy()
        piece[:fade] *= np.linspace(0, 1, fade)
        piece[-fade:] *= np.linspace(1, 0, fade)
        if gi:
            gap = a.turn_gap if segs[gi - 1]["who"] != who else a.line_gap
            gap += segs[gi - 1].get("pause", 0.0)
            out.append(np.zeros(int(gap * SR)))
            pos += gap
        for w in ws:
            words.append({"i": len(words), "w": w["w"], "line": gi, "who": who, "t": round(pos + w["t"] - a0, 3),
                          "end": round(pos + w["end"] - a0, 3), "score": w["score"]})
        lines.append({"id": gi, "text": s["text"], "who": who})
        out.append(piece)
        pos += len(piece) / SR
    y = np.concatenate(out + [np.zeros(int(0.3 * SR))])
    o = pathlib.Path(a.out)
    o.mkdir(parents=True, exist_ok=True)
    sf.write(o / "vo.wav", y, SR, subtype="PCM_24")
    (o / "timing.json").write_text(json.dumps({"dialogue": True, "duration": round(len(y) / SR, 3), "lines": lines,
                                               "words": words}, indent=1))
    print(f"{o / 'vo.wav'}: {len(y) / SR:.2f}s, {len(lines)} lines, {len(words)} words")


if __name__ == "__main__":
    main()
