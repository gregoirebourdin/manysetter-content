"""Monte un reel ManySetter (1080 x 1920) à partir d'une fiche script.json et d'une voix off.

Usage :
    .venv/bin/python CONTENU/06_GABARITS/reel.py CONTENU/07_PRET_A_PUBLIER/<id>/script.json [options]
    .venv/bin/python CONTENU/06_GABARITS/reel.py --transcribe <audio ou vidéo> [--out texte.txt]

Options :
    --tts            voix de remplacement (voix système « Samantha ») si voix.wav manque : sert
                     seulement à caler le rythme, la sortie s'appelle alors reel_maquette.mp4
    --model NOM      modèle faster-whisper (small.en par défaut ; base.en plus rapide)
    --music FICHIER  musique très basse sous la voix (normalement choisie au moment de programmer)

Étapes : 1. découpe des silences de la voix off (ffmpeg silenceremove) ; 2. horaire de chaque
mot (faster-whisper) ; 3. un plan par phrase du script, calé sur la voix ; 4. sous-titres mot à
mot et titre fixe dessinés avec Pillow (le ffmpeg installé n'a pas de module de sous-titres) ;
5. export H.264 1080 x 1920, 30 i/s, AAC. Rien d'important dans les 270 px du haut ni les 650 px
du bas (interface Instagram). Un plan absent de la banque devient un carton « plan à générer ».

La fiche script.json : title (titre fixe, option), voice (fichier dans le dossier du post),
lines[] = {text, shot, fit ("cover" ou "contain"), zoom ("in" ou rien)}. Un plan `HOOK/…`,
`BODY/…` ou `CTA/…` vient de CONTENU/04_BANQUE_BROLL ; un plan `CONTENU/…` part de la racine du
dépôt ; sinon il est relatif au dossier du post. Les fichiers de travail vont dans `_build/`.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from difflib import SequenceMatcher
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
SAFE_TOP, SAFE_BOTTOM = 270, 650
ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "CONTENU" / "04_BANQUE_BROLL"
FONTS = Path(__file__).resolve().parent / "fonts"
SUB_FONT = FONTS / "inter" / "Inter-Bold.otf"
TITLE_FONT = FONTS / "nohemi" / "Nohemi-SemiBold.woff2"
INK_950, INK_50, INK_900, BRAND = "#0d0c0a", "#faf9f8", "#1a1816", "#ff611d"


def run(cmd: list[str]) -> None:
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        sys.exit("ffmpeg a échoué :\n" + " ".join(cmd) + "\n" + res.stderr[-2000:])


def duration(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=nw=1:nk=1", str(path)], capture_output=True, text=True)
    return float(out.stdout.strip())


# --- 1. Voix ----------------------------------------------------------------

def tts(text: str, out: Path) -> None:
    aiff = out.with_suffix(".aiff")
    subprocess.run(["say", "-v", "Samantha", "-r", "190", "-o", str(aiff), text], check=True)
    run(["ffmpeg", "-y", "-i", str(aiff), "-ar", "48000", "-ac", "1", str(out)])
    aiff.unlink()


def cut_silences(src: Path, out: Path) -> None:
    """Garde des respirations courtes, coupe les blancs plus longs que 0,3 s."""
    af = ("silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05:"
          "stop_periods=-1:stop_duration=0.3:stop_threshold=-40dB:stop_silence=0.12")
    run(["ffmpeg", "-y", "-i", str(src), "-af", af, "-ar", "48000", "-ac", "1", str(out)])


# --- 2. Horaire des mots ---------------------------------------------------

def load_16k(path: Path):
    """Audio mono 16 kHz en tableau numpy (on évite le décodeur de faster-whisper)."""
    import wave
    import numpy as np
    tmp = Path(tempfile.mkdtemp()) / "voix_16k.wav"
    run(["ffmpeg", "-y", "-i", str(path), "-vn", "-ar", "16000", "-ac", "1", "-sample_fmt", "s16", str(tmp)])
    with wave.open(str(tmp)) as w:
        raw = w.readframes(w.getnframes())
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def transcribe(path: Path, model_name: str) -> list[tuple[str, float, float]]:
    from faster_whisper import WhisperModel
    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(load_16k(path), word_timestamps=True, language="en")
    return [(w.word.strip(), w.start, w.end) for seg in segments for w in (seg.words or [])]


def norm(word: str) -> str:
    return re.sub(r"[^a-z0-9$]", "", word.lower())


def align(lines: list[str], words: list[tuple[str, float, float]], total: float):
    """Donne à chaque mot du script un début et une fin, d'après les mots reconnus."""
    tokens = [(i, tok) for i, line in enumerate(lines) for tok in line.split()]
    a = [norm(t) for _, t in tokens]
    b = [norm(w) for w, _, _ in words]
    times: list[tuple[float, float] | None] = [None] * len(tokens)
    for blk in SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size):
            _, s, e = words[blk.b + k]
            times[blk.a + k] = (s, e)
    # Mots non reconnus : interpolation entre les voisins connus.
    known = [k for k, t in enumerate(times) if t]
    for k in range(len(tokens)):
        if times[k]:
            continue
        prev = max((j for j in known if j < k), default=None)
        nxt = min((j for j in known if j > k), default=None)
        t0 = times[prev][1] if prev is not None else 0.0
        t1 = times[nxt][0] if nxt is not None else total
        span = (nxt if nxt is not None else len(tokens)) - (prev if prev is not None else -1)
        pos = k - (prev if prev is not None else -1)
        s = t0 + (t1 - t0) * (pos - 1) / span
        times[k] = (s, t0 + (t1 - t0) * pos / span)
    return [(i, tok, times[k][0], times[k][1]) for k, (i, tok) in enumerate(tokens)]


def line_bounds(aligned, n_lines: int, total: float) -> list[tuple[float, float]]:
    firsts, lasts = {}, {}
    for i, _, s, e in aligned:
        firsts.setdefault(i, s)
        lasts[i] = e
    cuts = [0.0]
    for i in range(1, n_lines):
        cuts.append((lasts[i - 1] + firsts[i]) / 2)
    cuts.append(total)
    return [(cuts[i], cuts[i + 1]) for i in range(n_lines)]


# --- 3. Plans ----------------------------------------------------------------

def resolve(shot: str, post_dir: Path) -> Path:
    if shot.split("/")[0] in ("HOOK", "BODY", "CTA"):
        return BANK / shot
    if shot.startswith("CONTENU/"):
        return ROOT / shot
    return post_dir / shot


def placeholder(shot: str, text: str, out: Path) -> Path:
    img = Image.new("RGB", (W, H), INK_900)
    d = ImageDraw.Draw(img)
    f1, f2 = ImageFont.truetype(str(SUB_FONT), 54), ImageFont.truetype(str(SUB_FONT), 40)
    d.text((W / 2, 760), "PLAN À GÉNÉRER", font=f1, fill=BRAND, anchor="mm")
    d.text((W / 2, 840), Path(shot).name, font=f2, fill="#d7d4d2", anchor="mm")
    y = 940
    for chunk in wrap_text(text, f2, 860):
        d.text((W / 2, y), chunk, font=f2, fill="#76736f", anchor="mm")
        y += 56
    img.save(out)
    return out


SCREEN_TOP, SCREEN_BOTTOM = SAFE_TOP + 40, 1130   # zone des écrans, au-dessus des sous-titres
SUB_Y = 1205                                         # centre des sous-titres (zone sûre : < 1270)


def screen_frame(src: Path, out: Path, top: int = SCREEN_TOP) -> Path:
    """Écran (capture, conversation) recadré sur son contenu et posé dans la moitié haute."""
    im = Image.open(src).convert("RGB")
    bg = im.getpixel((5, 5))
    diff = Image.eval(Image.merge("RGB", [c.point(lambda v, b=b: 255 if abs(v - b) > 12 else 0)
                                         for c, b in zip(im.split(), bg)]), lambda v: v).convert("L")
    box = diff.getbbox() or (0, 0, im.width, im.height)
    m = 36
    box = (max(0, box[0] - m), max(0, box[1] - m), min(im.width, box[2] + m), min(im.height, box[3] + m))
    im = im.crop(box)
    scale = min((W - 60) / im.width, (SCREEN_BOTTOM - top) / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    canvas = Image.new("RGB", (W, H), bg)
    canvas.paste(im, ((W - im.width) // 2, top + (SCREEN_BOTTOM - top - im.height) // 2))
    canvas.save(out)
    return out


def clip(shot: Path, dur: float, fit: str, zoom: str | None, out: Path, top: int = SCREEN_TOP) -> None:
    frames = max(1, round(dur * FPS))
    if shot.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"):
        if fit == "contain":
            shot = screen_frame(shot, out.with_suffix(".png"), top)
        base = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}"
        z = "1+0.06*on/{}".format(frames) if zoom == "in" else "1"
        vf = (f"{base},scale={W * 2}:{H * 2},zoompan=z='{z}':x='iw/2-(iw/zoom/2)':"
              f"y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS},setsar=1")
        cmd = ["ffmpeg", "-y", "-loop", "1", "-framerate", str(FPS), "-t", f"{dur:.3f}", "-i", str(shot), "-vf", vf]
    else:
        vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},setsar=1"
        cmd = ["ffmpeg", "-y", "-stream_loop", "-1", "-i", str(shot), "-t", f"{dur:.3f}", "-an", "-vf", vf]
    run(cmd + ["-frames:v", str(frames), "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
               "-pix_fmt", "yuv420p", str(out)])


# --- 4. Sous-titres et titre ----------------------------------------------------

def wrap_text(text: str, f: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    lines, cur = [], ""
    for word in text.split():
        cand = (cur + " " + word).strip()
        if cur and f.getlength(cand) > max_w:
            lines.append(cur)
            cur = word
        else:
            cur = cand
    return lines + ([cur] if cur else [])


def chunks(aligned) -> list[tuple[str, float]]:
    """Groupes de 1 à 3 mots, coupés après une ponctuation, avec leur heure de début."""
    out, cur, start = [], [], None
    for _, tok, s, _ in aligned:
        if not cur:
            start = s
        cur.append(tok)
        if len(cur) == 3 or len(" ".join(cur)) > 16 or tok[-1] in ".,?!:;":
            out.append((" ".join(cur), start))
            cur = []
    if cur:
        out.append((" ".join(cur), start))
    return out


def title_lines(title: str):
    ft = ImageFont.truetype(str(TITLE_FONT), 60)
    return ft, wrap_text(title, ft, 860)


def title_bottom(title: str) -> int:
    """Bas du bloc titre (ou haut de la zone sûre sans titre)."""
    if not title:
        return SCREEN_TOP - 40
    _, lines = title_lines(title)
    return SAFE_TOP + 30 + 72 * len(lines) + 48


def overlay_frame(title: str, sub: str, out: Path) -> None:
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if title:
        ft, lines = title_lines(title)
        lh = 72
        box_h = lh * len(lines) + 48
        top = SAFE_TOP + 30
        widest = max(ft.getlength(l) for l in lines)
        d.rounded_rectangle([(W - widest) / 2 - 36, top, (W + widest) / 2 + 36, top + box_h], radius=28, fill=(13, 12, 10, 225))
        for k, l in enumerate(lines):
            d.text((W / 2, top + 24 + k * lh + lh / 2), l, font=ft, fill="#ffffff", anchor="mm")
    if sub:
        fs = ImageFont.truetype(str(SUB_FONT), 74)
        d.text((W / 2, SUB_Y), sub, font=fs, fill="#ffffff", anchor="mm", stroke_width=9, stroke_fill=INK_950)
    img.save(out)


# --- Montage ----------------------------------------------------------------

def build(script_path: Path, use_tts: bool, model: str, music: Path | None) -> Path:
    post_dir = script_path.parent
    sc = json.loads(script_path.read_text())
    lines = [l["text"] for l in sc["lines"]]
    work = post_dir / "_build"
    if work.exists():
        shutil.rmtree(work)
    work.mkdir()
    draft = False

    voice = post_dir / sc.get("voice", "voix.wav")
    if not voice.exists():
        if not use_tts:
            sys.exit(f"Voix off absente : {voice}. Dépose-la, ou lance avec --tts pour une maquette.")
        voice = work / "voix_tts.wav"
        tts(" ".join(lines), voice)
        draft = True
    cut = work / "voix_coupee.wav"
    cut_silences(voice, cut)
    total = duration(cut) + 0.4

    words = transcribe(cut, model)
    aligned = align(lines, words, total)
    bounds = line_bounds(aligned, len(lines), total)

    clips = []
    for k, (line, (s, e)) in enumerate(zip(sc["lines"], bounds)):
        shot = resolve(line["shot"], post_dir)
        fit, zoom = line.get("fit", "cover"), line.get("zoom")
        if not shot.exists():
            shot = placeholder(line["shot"], line["text"], work / f"carton_{k:02d}.png")
            fit, zoom, draft = "cover", None, True
        out = work / f"plan_{k:02d}.mp4"
        clip(shot, e - s, fit, zoom, out, top=title_bottom(sc.get("title", "")) + 40)
        clips.append(out)
    (work / "plans.txt").write_text("".join(f"file '{c.name}'\n" for c in clips))
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(work / "plans.txt"), "-c", "copy", str(work / "image.mp4")])

    # Sous-titres : une image transparente par groupe de mots, enchaînées selon l'horaire.
    title = sc.get("title", "")
    events = chunks(aligned)
    entries = []
    blank = work / "sub_vide.png"
    overlay_frame(title, "", blank)
    if events and events[0][1] > 0.05:
        entries.append((blank, events[0][1]))
    for k, (text, start) in enumerate(events):
        end = events[k + 1][1] if k + 1 < len(events) else total
        f = work / f"sub_{k:03d}.png"
        overlay_frame(title, text, f)
        entries.append((f, max(0.04, end - start)))
    listing = "".join(f"file '{p.name}'\nduration {d:.3f}\n" for p, d in entries) + f"file '{entries[-1][0].name}'\n"
    (work / "sous-titres.txt").write_text(listing)

    name = "reel_maquette.mp4" if draft else "reel.mp4"
    out = post_dir / name
    cmd = ["ffmpeg", "-y", "-i", str(work / "image.mp4"), "-f", "concat", "-safe", "0", "-i", str(work / "sous-titres.txt"),
           "-i", str(cut)]
    fc = f"[1:v]fps={FPS},format=rgba[s];[0:v][s]overlay=0:0[v];[2:a]apad[voice]"
    if music:
        cmd += ["-stream_loop", "-1", "-i", str(music)]
        fc += ";[3:a]volume=0.08[m];[voice][m]amix=inputs=2:duration=first:dropout_transition=0[a]"
    else:
        fc += ";[voice]anull[a]"
    cmd += ["-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-t", f"{total:.3f}",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS),
            "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(out)]
    run(cmd)

    (post_dir / "montage.json").write_text(json.dumps({
        "sortie": name, "duree_s": round(total, 2), "maquette": draft,
        "plans": [{"texte": l["text"], "plan": l["shot"], "debut": round(s, 2), "fin": round(e, 2)}
                  for l, (s, e) in zip(sc["lines"], bounds)],
    }, ensure_ascii=False, indent=2))
    return out


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("script", nargs="?")
    p.add_argument("--tts", action="store_true")
    p.add_argument("--model", default="small.en")
    p.add_argument("--music")
    p.add_argument("--transcribe")
    p.add_argument("--out")
    a = p.parse_args()
    if a.transcribe:
        words = transcribe(Path(a.transcribe), a.model)
        text = " ".join(w for w, _, _ in words)
        timed = "\n".join(f"{s:6.2f}  {w}" for w, s, _ in words)
        if a.out:
            Path(a.out).write_text(text + "\n\n" + timed + "\n")
        print(text)
        return
    if not a.script:
        sys.exit(__doc__)
    out = build(Path(a.script), a.tts, a.model, Path(a.music) if a.music else None)
    print(out)


if __name__ == "__main__":
    main()
