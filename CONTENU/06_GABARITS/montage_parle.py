"""Montage d'un reel parlé face caméra (plans Veo qui portent déjà la voix de Seth).

Usage :
    .venv/bin/python CONTENU/06_GABARITS/montage_parle.py CONTENU/07_PRET_A_PUBLIER/<id>/script.json

Ce que fait le script (retours du fondateur du 10/10/2026) :
1. met bout à bout les plans (`plans[].video`, chemins depuis la racine du dépôt), en 1080 × 1920, 30 i/s ;
2. horaire de chaque mot (faster-whisper) ;
3. **jump cuts** : coupe chaque blanc de plus de 0,25 s et chaque fin de phrase, pour changer de plan toutes les 1 à 3 s ;
4. **zooms secs** : les segments alternent 100 % et 108 % ; un segment qui contient une phrase de
   `montage.zooms_secs` passe à 124 %, sans transition ;
5. **booms** : un impact grave synthétisé ici (aucun son sous droits) au début de chaque mot de `montage.booms` ;
6. sous-titres mot à mot (1 à 3 mots, blanc contour noir, mots clés en orange) dans la zone sûre ;
7. titre fixe façon Instagram au-dessus de la tête : étiquette blanche, texte noir, `*mot*` en orange.

`plans[].garder` : [début, fin] en secondes pour ne garder qu'une partie d'un plan.
Voix : passe-haut, présence, compression, -13 LUFS (niveau des pubs qui tournent dans la niche).

Sortie : `reel.mp4` dans le dossier du post (fichier vidéo hors Git), et `montage.json` (les coupes).
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from reel import transcribe, norm, run, duration  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
FONTS = Path(__file__).resolve().parent / "fonts"
BOLD = FONTS / "inter" / "Inter-Bold.otf"
W, H, FPS = 1080, 1920, 30
ORANGE = "#ff611d"
INK = "#0d0c0a"
SAFE_TOP = 270
SUB_Y = 1235


# --- Son -----------------------------------------------------------------------------

def make_boom(out: Path, sr: int = 48000) -> None:
    """Impact grave : balayage 140 → 38 Hz avec décroissance rapide, plus un clic d'attaque."""
    d = 0.75
    t = np.linspace(0, d, int(sr * d), endpoint=False)
    f = 38 + (140 - 38) * np.exp(-t * 9)
    phase = 2 * np.pi * np.cumsum(f) / sr
    body = np.sin(phase) * np.exp(-t * 5.5)
    click = np.random.default_rng(7).normal(0, 1, t.size) * np.exp(-t * 90) * 0.35
    sig = body + click
    sig = sig / np.max(np.abs(sig)) * 0.8
    with wave.open(str(out), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((sig * 32767).astype(np.int16).tobytes())


# --- Images (titre, sous-titres) ---------------------------------------------------

def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(BOLD), size)


def tokens(text: str):
    out = []
    for i, part in enumerate(re.split(r"\*(.+?)\*", text)):
        for j, wd in enumerate(part.split()):
            # ponctuation collée au mot marqué qui précède (« *setter*? » → « setter? »)
            if j == 0 and out and not part.startswith(" ") and re.fullmatch(r"[.,!?;:)]+", wd):
                pw, pm = out.pop()
                out.append((pw + wd, pm))
            else:
                out.append((wd, i % 2 == 1))
    return out


def title_png(title: str, out: Path) -> int:
    """Étiquette blanche arrondie, texte noir, mots *marqués* en orange. Renvoie le bas du bloc."""
    f = font(64)
    space = f.getlength(" ")
    lines, cur, cur_w = [], [], 0.0
    for wd, m in tokens(title):
        ww = f.getlength(wd)
        add = ww + (space if cur else 0)
        if cur and cur_w + add > 880:
            lines.append(cur)
            cur, cur_w = [], 0.0
            add = ww
        cur.append((wd, m, ww))
        cur_w += add
    if cur:
        lines.append(cur)
    lh = 80
    pad_x, pad_y = 36, 24
    widest = max(sum(x[2] for x in l) + space * (len(l) - 1) for l in lines)
    box_w, box_h = widest + 2 * pad_x, lh * len(lines) + 2 * pad_y
    top = SAFE_TOP + 10
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x0 = (W - box_w) / 2
    d.rounded_rectangle([x0, top, x0 + box_w, top + box_h], radius=26, fill="#ffffff")
    for k, l in enumerate(lines):
        lw = sum(x[2] for x in l) + space * (len(l) - 1)
        x = (W - lw) / 2
        y = top + pad_y + k * lh + lh / 2
        for wd, m, ww in l:
            d.text((x, y), wd, font=f, fill=ORANGE if m else INK, anchor="lm")
            x += ww + space
    img.save(out)
    return int(top + box_h)


def sub_png(words: list[tuple[str, bool]], out: Path) -> None:
    f = font(78)
    space = f.getlength(" ")
    total = sum(f.getlength(w) for w, _ in words) + space * (len(words) - 1)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x = (W - total) / 2
    for w, key in words:
        d.text((x, SUB_Y), w, font=f, fill=ORANGE if key else "#ffffff", anchor="lm",
               stroke_width=10, stroke_fill=INK)
        x += f.getlength(w) + space
    img.save(out)


# --- Découpe ---------------------------------------------------------------------------

def segments(words, total: float, gap: float = 0.25):
    """Segments de parole : on coupe sur les blancs et après une fin de phrase si le segment dépasse 1,4 s."""
    segs, cur = [], []
    for i, (w, s, e) in enumerate(words):
        if cur and (s - cur[-1][2] > gap):
            segs.append(cur)
            cur = []
        cur.append((w, s, e))
        if w[-1:] in ".?!:," and cur[-1][2] - cur[0][1] > 1.4:
            segs.append(cur)
            cur = []
    if cur:
        segs.append(cur)
    out = []
    for sg in segs:
        a = max(0.0, sg[0][1] - 0.07)
        b = min(total, sg[-1][2] + 0.12)
        out.append({"start": round(a, 3), "end": round(b, 3), "words": sg})
    # pas de chevauchement
    for i in range(1, len(out)):
        if out[i]["start"] < out[i - 1]["end"]:
            mid = (out[i]["start"] + out[i - 1]["end"]) / 2
            out[i - 1]["end"] = out[i]["start"] = round(mid, 3)
    # un changement de cadre toutes les ~1,3 s : on recoupe les longs segments entre deux mots (sans perte de son)
    fine = []
    for sg in out:
        ws = sg["words"]
        if sg["end"] - sg["start"] <= 1.7 or len(ws) < 3:
            fine.append(sg)
            continue
        start, cur = sg["start"], []
        for k, wd in enumerate(ws):
            cur.append(wd)
            rest = ws[k + 1:]
            on_comma = wd[0][-1:] in ",;:" and wd[2] - start >= 0.6
            comma_soon = any(x[0][-1:] in ",;:" for x in rest[:2])
            if rest and len(rest) >= 2 and (on_comma or (wd[2] - start >= 1.3 and not comma_soon)):
                cut = round((wd[2] + rest[0][1]) / 2, 3)
                fine.append({"start": start, "end": cut, "words": cur, "suite": True})
                start, cur = cut, []
        fine.append({"start": start, "end": sg["end"], "words": cur})
    return fine


def align_to_script(words, script_words):
    """Reprend l'orthographe du script mot à mot ; recolle deux mots entendus quand ils en forment un seul (« many setter » → « ManySetter »)."""
    out, i = [], 0
    for sw in script_words:
        if i >= len(words):
            return None
        w, a, b = words[i]
        if norm(w) == norm(sw):
            out.append((sw, a, b))
            i += 1
        elif i + 1 < len(words) and norm(w) + norm(words[i + 1][0]) == norm(sw):
            out.append((sw, a, words[i + 1][2]))
            i += 2
        else:
            return None
    return out if i == len(words) else None


def contains_phrase(seg_words, phrases) -> bool:
    """Le segment contient une phrase clé, ou en est un morceau (après la recoupe fine)."""
    text = " ".join(norm(w) for w, _, _ in seg_words)
    keys = [" ".join(norm(x) for x in p.split()) for p in phrases]
    return any(k in text or (len(text) > 6 and text in k) for k in keys)


# --- Montage ---------------------------------------------------------------------------

def build(script_path: Path, model: str = "small.en") -> Path:
    script_path = script_path.resolve()
    s = json.loads(script_path.read_text())
    post = script_path.parent
    work = post / "_build"
    work.mkdir(exist_ok=True)
    clips = [ROOT / p["video"] for p in s["plans"] if p.get("video")]
    if not clips:
        sys.exit("Aucun plan vidéo (`plans[].video`) dans le script.")

    # 1. bout à bout, format commun
    norm_clips = []
    keeps = [p.get("garder") for p in s["plans"] if p.get("video")]
    for i, c in enumerate(clips):
        o = work / f"plan_{i + 1}.mp4"
        cut = ["-ss", str(keeps[i][0]), "-to", str(keeps[i][1])] if keeps[i] else []
        run(["ffmpeg", "-y", *cut, "-i", str(c), "-vf",
             f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS}",
             "-c:v", "libx264", "-crf", "16", "-preset", "veryfast", "-c:a", "aac", "-ar", "48000", "-ac", "1", str(o)])
        norm_clips.append(o)
    lst = work / "plans.txt"
    lst.write_text("".join(f"file '{c.resolve()}'\n" for c in norm_clips))
    brut = work / "brut.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(brut)])
    total = duration(brut)

    # 2. mots
    words = transcribe(brut, model)
    if not words:
        sys.exit("Aucun mot reconnu dans la voix.")
    # l'orthographe vient du script (Whisper peut entendre « center » pour « setter ») quand le compte de mots colle
    script_words = " ".join(p.get("ligne_gardee") or p.get("ligne", "") for p in s["plans"] if p.get("video")).split()
    aligned = align_to_script(words, script_words)
    if aligned:
        words = aligned
    else:
        print(f"Attention : {len(words)} mots entendus pour {len(script_words)} dans le script, sous-titres tels qu'entendus.")
    segs = segments(words, total)
    mont = s.get("montage", {})
    zooms = mont.get("zooms_secs", [])
    booms = {norm(b) for b in mont.get("booms", [])}

    # 3-4. coupes et zooms
    t_new = 0.0
    run_key = 0
    for i, sg in enumerate(segs):
        if contains_phrase(sg["words"], zooms):
            sg["zoom"] = 1.26 if run_key % 2 == 0 else 1.38   # zoom sec, puis un cran de plus
            run_key += 1
        else:
            sg["zoom"] = 1.0 if i % 2 == 0 else 1.12
            run_key = 0
        sg["t0"] = t_new
        t_new += sg["end"] - sg["start"]
    out_len = t_new

    parts_v, parts_a = [], []
    fc = []
    for i, sg in enumerate(segs):
        z = sg["zoom"]
        zw, zh = int(W * z) // 2 * 2, int(H * z) // 2 * 2
        cy = int((zh - H) * 0.32)  # garde le visage (haut de l'image) dans le cadre
        fc.append(f"[0:v]trim=start={sg['start']}:end={sg['end']},setpts=PTS-STARTPTS,"
                  f"scale={zw}:{zh},crop={W}:{H}:{(zw - W) // 2}:{cy}[v{i}]")
        fc.append(f"[0:a]atrim=start={sg['start']}:end={sg['end']},asetpts=PTS-STARTPTS[a{i}]")
        parts_v.append(f"[v{i}]")
        parts_a.append(f"[a{i}]")
    fc.append("".join(p for pair in zip(parts_v, parts_a) for p in pair) + f"concat=n={len(segs)}:v=1:a=1[vc][ac]")

    # 6-7. titre et sous-titres
    inputs = ["-i", str(brut)]
    title = s.get("hook", {}).get("titre_fixe", "")
    overlays = []
    if title:
        tp = work / "titre.png"
        title_png(title, tp)
        overlays.append((tp, 0.0, out_len))
    subs = []
    for sg in segs:
        ws = sg["words"]
        group = []
        for w, a, b in ws:
            group.append((w, a, b))
            if len(group) == 3 or w[-1:] in ".,?!:;" or len(" ".join(x[0] for x in group)) > 16:
                subs.append((group, sg))
                group = []
        if group:
            subs.append((group, sg))
    for k, (group, sg) in enumerate(subs):
        a = sg["t0"] + max(0.0, group[0][1] - sg["start"])
        nxt = subs[k + 1] if k + 1 < len(subs) else None
        b = (nxt[1]["t0"] + max(0.0, nxt[0][0][1] - nxt[1]["start"])) if nxt else out_len
        sp = work / f"sub_{k:03d}.png"
        sub_png([(w.strip(), norm(w) in booms) for w, _, _ in group], sp)
        overlays.append((sp, a, b))
    last = "vc"
    for j, (png, a, b) in enumerate(overlays):
        inputs += ["-i", str(png)]
        fc.append(f"[{last}][{j + 1}:v]overlay=0:0:enable='between(t,{a:.3f},{b:.3f})'[o{j}]")
        last = f"o{j}"

    # 5. booms
    boom = work / "boom.wav"
    make_boom(boom)
    boom_times, used = [], set()
    for sg in segs:
        for w, a, _ in sg["words"]:
            if norm(w) in booms and norm(w) not in used:  # un boom par mot clé, à sa première occurrence
                used.add(norm(w))
                boom_times.append(sg["t0"] + max(0.0, a - sg["start"]))
    audio_last = "ac"
    if boom_times:
        bi = len(overlays) + 1
        inputs += ["-i", str(boom)]
        fc.append(f"[{bi}:a]asplit={len(boom_times)}" + "".join(f"[b{k}]" for k in range(len(boom_times))))
        for k, t in enumerate(boom_times):
            ms = int(t * 1000)
            fc.append(f"[b{k}]adelay={ms}|{ms},volume=0.9[bd{k}]")
        fc.append("[ac]" + "".join(f"[bd{k}]" for k in range(len(boom_times)))
                  + f"amix=inputs={len(boom_times) + 1}:normalize=0:duration=first[am]")
        audio_last = "am"

    # voix qui porte (retour du 10/10/2026) : passe-haut, présence, compression, -13 LUFS
    fc.append(f"[{audio_last}]highpass=f=75,equalizer=f=3200:t=q:w=1.2:g=3.5,equalizer=f=180:t=q:w=1:g=1.5,"
              "acompressor=threshold=-22dB:ratio=3.5:attack=4:release=90:makeup=4,"
              "loudnorm=I=-13:TP=-1.0:LRA=6[afin]")
    audio_last = "afin"
    out = post / "reel.mp4"
    run(["ffmpeg", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", f"[{last}]", "-map", f"[{audio_last}]",
         "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-r", str(FPS), "-movflags", "+faststart", str(out)])
    (post / "montage.json").write_text(json.dumps({
        "duree_s": round(out_len, 2),
        "segments": [{"de": round(sg["t0"], 2), "a": round(sg["t0"] + sg["end"] - sg["start"], 2),
                      "zoom": sg["zoom"], "texte": " ".join(w for w, _, _ in sg["words"])} for sg in segs],
        "booms_s": [round(t, 2) for t in boom_times]}, ensure_ascii=False, indent=2))
    return out


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    print(build(Path(sys.argv[1])))
