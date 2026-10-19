#!/usr/bin/env python3
"""Remove whole lines from a reel's validated voice without a new take (free, and the voice Grégoire liked stays).

Cuts vo/<reel>/vo.wav at word boundaries (keeps LEAD s of air before the next kept word, 10 ms crossfades), shifts every
word of timing.json, and drops the lines from vo/<reel>_segments.json and vo/<reel>_script.txt.
Then shift the word indices of <reel>/build.py (the words of the cut lines are gone) and rebuild.

Usage: python3 scripts/cutvo.py reel2 0 [5 …]   (line indices from 0, as in timing.json "line")
"""
import json
import pathlib
import sys

import numpy as np
import soundfile as sf

STUDIO = pathlib.Path(__file__).resolve().parents[1]
LEAD = 0.06  # air kept before the first word after a cut
XF = 0.01  # crossfade at each joint


def main():
    reel, drop = sys.argv[1], sorted({int(x) for x in sys.argv[2:]})
    d = STUDIO / f"vo/{reel}"
    tim = json.loads((d / "timing.json").read_text())
    W = tim["words"]
    info = sf.info(d / "vo.wav")
    x, sr = sf.read(d / "vo.wav", dtype="float64")
    total = len(x) / sr

    cuts = []
    for L in drop:
        ws = [w for w in W if w["line"] == L]
        if not ws:
            sys.exit(f"line {L} not in timing.json")
        nxt = [w for w in W if w["i"] > ws[-1]["i"] and w["line"] not in drop]
        a = 0.0 if ws[0]["i"] == 0 else max(0.0, ws[0]["t"] - LEAD)
        b = nxt[0]["t"] - LEAD if nxt else total
        cuts.append([a, b])
    cuts.sort()
    merged = []
    for a, b in cuts:
        if merged and a <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], b)
        else:
            merged.append([a, b])

    # keep the audio outside the cuts, joined with short crossfades
    keep, pos = [], 0.0
    for a, b in merged:
        if a > pos:
            keep.append((pos, a))
        pos = b
    if pos < total:
        keep.append((pos, total))
    n = int(XF * sr)
    out = None
    for a, b in keep:
        seg = x[int(a * sr) : int(b * sr)].copy()
        if out is None:
            out = seg
            continue
        ramp = np.linspace(0, 1, n)[:, None] if seg.ndim > 1 else np.linspace(0, 1, n)
        out[-n:] = out[-n:] * (1 - ramp) + seg[:n] * ramp
        out = np.concatenate([out, seg[n:]])

    def removed_before(t):
        r, joints = 0.0, 0
        for a, b in merged:
            if b <= t:
                r += b - a
                joints += 1 if a > 0 else 0
        return r + joints * XF  # each joint overlaps XF

    kept_lines = [li for li in range(len(tim["lines"])) if li not in drop]
    line_map = {old: new for new, old in enumerate(kept_lines)}
    words = []
    for w in W:
        if w["line"] in drop:
            continue
        sh = removed_before(w["t"])
        words.append({**w, "i": len(words), "line": line_map[w["line"]], "t": round(w["t"] - sh, 3), "end": round(w["end"] - sh, 3)})
    sf.write(d / "vo.wav", out, sr, subtype=info.subtype)
    tim.update({"words": words, "duration": round(len(out) / sr, 3),
                "lines": [{"id": line_map[l["id"]], "text": l["text"]} for l in tim["lines"] if l["id"] not in drop],
                "cut": tim.get("cut", []) + [{"lines": drop, "seconds": round(sum(b - a for a, b in merged), 3)}]})
    (d / "timing.json").write_text(json.dumps(tim, indent=1))

    seg_file = STUDIO / f"vo/{reel}_segments.json"
    segs = [s for k, s in enumerate(json.loads(seg_file.read_text())) if k not in drop]
    seg_file.write_text("[\n" + ",\n".join(" " + json.dumps(s, ensure_ascii=False) for s in segs) + "\n]\n")
    (STUDIO / f"vo/{reel}_script.txt").write_text(" ".join(s["text"] for s in segs) + "\n")
    removed = len(W) - len(words)
    print(f"vo/{reel}/vo.wav: {total:.2f}s → {len(out) / sr:.2f}s, {removed} words removed (lines {drop}); "
          f"word indices after the cut are {removed} lower: update {reel}/build.py, then rebuild")


if __name__ == "__main__":
    main()
