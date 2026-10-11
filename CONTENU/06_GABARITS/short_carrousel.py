"""Transforme un carrousel en Short vertical (YouTube Shorts) : les slides défilent au rythme de lecture, sur une musique douce.

Usage :
    .venv/bin/python CONTENU/06_GABARITS/short_carrousel.py CONTENU/07_PRET_A_PUBLIER/<id>/post.json [musique.mp3]

1. chaque slide (1080 × 1350) est posée sur un fond 1080 × 1920 de sa propre couleur, un peu réduite et remontée
   pour laisser libre le bas de l'écran (titre et boutons de YouTube) ;
2. durée de chaque slide selon son nombre de mots (environ 4 mots par seconde, entre 2,3 et 6,5 s), couverture à 3 s ;
3. passage d'une slide à l'autre en glissé vers la gauche, comme un swipe (0,3 s) ;
4. musique (`post.json` → `musique`, ou 2e argument) : fondu d'entrée et de sortie, -16 LUFS, jamais de voix.

Sortie : `short.mp4` dans le dossier du post.
"""
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
MUSIC = Path(__file__).resolve().parent / "musique"
W, H, FPS = 1080, 1920, 30
SLIDE_W = 1000          # la slide réduite (1000 × 1250)
TOP = 230               # remontée : le bas de l'écran reste libre
XF = 0.3                # durée du glissé
SKIP = {"photo", "handle", "image", "file", "src", "align", "width", "ratio", "bg", "spacer", "start"}


def words(o) -> int:
    if isinstance(o, dict):
        return sum(words(v) for k, v in o.items() if k not in SKIP)
    if isinstance(o, list):
        return sum(words(v) for v in o)
    if isinstance(o, str) and not o.endswith((".png", ".jpg")):
        return len(o.replace("*", " ").split())
    return 0


def frame(slide: Path, out: Path) -> None:
    im = Image.open(slide).convert("RGB")
    bg = im.getpixel((4, 4))
    canvas = Image.new("RGB", (W, H), bg)
    small = im.resize((SLIDE_W, round(im.height * SLIDE_W / im.width)), Image.LANCZOS)
    canvas.paste(small, ((W - SLIDE_W) // 2, TOP))
    canvas.save(out)


def build(post_json: Path, music: Path | None = None) -> Path:
    post_json = post_json.resolve()
    s = json.loads(post_json.read_text())
    d = post_json.parent
    work = d / "_short"
    work.mkdir(exist_ok=True)
    slides = sorted(d.glob("slide-*.png"))
    if not slides:
        sys.exit("Aucune slide : lancer carrousel.py d'abord.")
    music = music or (MUSIC / s["musique"] if s.get("musique") else None)
    if not music or not Path(music).exists():
        sys.exit("Musique introuvable (`musique` dans post.json, ou 2e argument).")

    durs = []
    for i, sl in enumerate(slides):
        frame(sl, work / f"f_{i:02d}.png")
        n = words(s["slides"][i]) if i < len(s.get("slides", [])) else 10
        # la couverture ne reste que 3 s : le hook doit vite laisser place à la suite
        durs.append(3.0 if i == 0 else round(min(6.5, max(2.3, 1.0 + n / 4.0)), 2))
    total = sum(durs) - XF * (len(durs) - 1)

    cmd = ["ffmpeg", "-y", "-v", "error"]
    for i, dur in enumerate(durs):
        cmd += ["-loop", "1", "-t", str(dur), "-i", str(work / f"f_{i:02d}.png")]
    cmd += ["-i", str(music)]
    fc = [f"[{i}:v]fps={FPS},format=yuv420p,settb=AVTB[s{i}]" for i in range(len(durs))]
    last, off = "s0", 0.0
    for i in range(1, len(durs)):
        off += durs[i - 1] - XF
        fc.append(f"[{last}][s{i}]xfade=transition=slideleft:duration={XF}:offset={off:.2f}[x{i}]")
        last = f"x{i}"
    m = len(durs)
    fc.append(f"[{m}:a]atrim=0:{total:.2f},asetpts=PTS-STARTPTS,afade=t=in:d=0.4,"
              f"afade=t=out:st={max(0, total - 1.5):.2f}:d=1.5,loudnorm=I=-16:TP=-1.5:LRA=7[a]")
    out = d / "short.mp4"
    cmd += ["-filter_complex", ";".join(fc), "-map", f"[{last}]", "-map", "[a]",
            "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k", "-t", f"{total:.2f}", "-movflags", "+faststart", str(out)]
    subprocess.run(cmd, check=True)
    (d / "short.json").write_text(json.dumps({"duree_s": round(total, 2), "slides_s": durs,
                                              "musique": Path(music).name}, ensure_ascii=False, indent=2))
    return out


if __name__ == "__main__":
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    print(build(Path(sys.argv[1]), Path(sys.argv[2]) if len(sys.argv) == 3 else None))
