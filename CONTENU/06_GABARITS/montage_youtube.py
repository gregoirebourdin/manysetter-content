"""Reel tiré d'une vidéo YouTube du fondateur : son écran en haut, sa tête en bas (retours du 11/10/2026).

Usage :
    .venv/bin/python CONTENU/06_GABARITS/montage_youtube.py CONTENU/07_PRET_A_PUBLIER/<id>/script.json
    .venv/bin/python CONTENU/06_GABARITS/montage_youtube.py <script.json> --apercu   # planche d'images, sans vidéo

La vidéo source est un partage d'écran (Screen Studio) avec une bulle webcam ancrée en bas à gauche,
dont seule la taille change avec les zooms. Le script :
1. garde les passages `segments[].de → a` (temps de la source), retire les blancs de plus de 0,3 s et les
   plages `couper` (les « euh ») : ce sont les jump cuts ;
2. haut (1080 × 980) : l'écran, cadré sur `ecran[].rect` [x, y, l, h] de la source, à partir de `ecran[].t`.
   `ecran[].src` prend l'image d'un autre moment de la vidéo (la voix reste celle du passage) ;
3. bas (1080 × 940) : l'intérieur de la bulle webcam, suivie image par image (bord droit lu sur le pull) ;
4. zooms secs sur les plages `zooms` (écran à 125 %, visage à 110 %), et un léger 100/105 % sur le visage
   d'un jump cut à l'autre ;
5. booms (impact grave synthétisé, aucun son sous droits) aux temps `booms` ;
6. étiquette titre blanche (mot *marqué* en orange) au-dessus de la tête, tout le reel ;
   sous-titres anglais phrase par phrase (`sous_titres`, temps de la source) en haut, dans la zone sûre ;
   l'étiquette CTA (`cta`) pendant les 3 dernières secondes ;
7. voix : passe-haut, présence, compression, -14 LUFS.

Sortie : `reel.mp4` dans le dossier du script (hors Git) et `montage.json` (les coupes).
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import wave
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from montage_parle import make_boom, tokens  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
BOLD = Path(__file__).resolve().parent / "fonts" / "inter" / "Inter-Bold.otf"
W, H, FPS, SR = 1080, 1920, 30, 48000
SCREEN_H = 980            # haut : l'écran
FACE_H = H - SCREEN_H     # bas : la tête
TITLE_TOP = 290           # haut de l'étiquette titre (sous les 270 px du haut, zone sûre)
SUB_Y = SCREEN_H          # sous-titres à cheval sur la jonction écran / tête
CTA_Y = 720
ANCHOR = 0.68             # le centre du contenu d'écran tombe à 68 % de la zone haute (entre titre et sous-titres)
ORANGE, INK = (255, 97, 29), (13, 12, 10)
SRC_W, SRC_H = 1692, 1080
BUBBLE_X0, BUBBLE_Y1 = 55, 1026   # coin bas gauche de la bulle (fixe)


def run(cmd):
    subprocess.run(cmd, check=True)


# --- Coupes -----------------------------------------------------------------------------

def silences(src: Path, a: float, b: float) -> list[tuple[float, float]]:
    out = subprocess.run(["ffmpeg", "-v", "info", "-ss", str(a), "-t", str(b - a), "-i", str(src), "-vn",
                          "-af", "silencedetect=n=-33dB:d=0.22", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    st = [float(x) + a for x in re.findall(r"silence_start: ([\d.]+)", out)]
    en = [float(x) + a for x in re.findall(r"silence_end: ([\d.]+)", out)]
    return list(zip(st, en + [b] * (len(st) - len(en))))


def keep_intervals(src: Path, seg: dict, cuts: list) -> list[tuple[float, float]]:
    """Ce qu'on garde d'un segment : sans blancs > 0,3 s (0,08 s de marge) ni plages `couper`."""
    a, b = seg["de"], seg["a"]
    holes = [(s + 0.08, e - 0.08) for s, e in silences(src, a, b) if e - s > 0.30]
    holes += [tuple(c) for c in cuts if c[1] > a and c[0] < b]
    holes.sort()
    out, cur = [], a
    for s, e in holes:
        if s > cur:
            out.append((cur, min(s, b)))
        cur = max(cur, e)
    if cur < b:
        out.append((cur, b))
    return [(round(x, 3), round(y, 3)) for x, y in out if y - x >= 0.12]


# --- Bulle webcam -----------------------------------------------------------------------

def bubble_edges(src: Path, a: float, b: float) -> tuple[np.ndarray, np.ndarray]:
    """Bord droit de la bulle, 10 fois par seconde : fin de la bande rouge du pull (lignes 975 à 995)."""
    band_w = 420
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(a), "-t", str(b - a), "-i", str(src),
                          "-vf", f"fps=10,crop={band_w}:22:0:974", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, 22, band_w, 3).astype(int)
    red = ((fr[..., 0] - fr[..., 1] > 35) & (fr[..., 0] - fr[..., 2] > 25)).mean(1)  # (n, band_w)
    rights = []
    for row in red:
        x = 75
        miss = 0
        while x < band_w - 1 and miss <= 6:
            miss = 0 if row[x] > 0.5 else miss + 1
            x += 1
        rights.append(x - miss)
    r = np.clip(np.array(rights, float), 185, 300)
    k = 5  # médiane glissante sur 0,5 s
    pad = np.pad(r, (k // 2, k // 2), mode="edge")
    r = np.array([np.median(pad[i:i + k]) for i in range(len(r))])
    return a + np.arange(len(r)) / 10, r


class Bubble:
    def __init__(self, src: Path, ranges):
        self.t, self.r = [], []
        for a, b in ranges:
            t, r = bubble_edges(src, a, b)
            self.t.append(t)
            self.r.append(r)
        self.t, self.r = np.concatenate(self.t), np.concatenate(self.r)
        o = np.argsort(self.t)
        self.t, self.r = self.t[o], self.r[o]

    def crop(self, tau: float, zoom: float) -> tuple[int, int, int, int]:
        right = float(np.interp(tau, self.t, self.r))
        s = right - BUBBLE_X0
        w0 = 0.86 * s                      # marges : les coins arrondis de la bulle restent hors cadre
        h0 = w0 * FACE_H / W
        top0 = BUBBLE_Y1 - s + 0.07 * s
        cx, cy = BUBBLE_X0 + s / 2, top0 + 0.42 * h0   # on zoome autour des yeux
        w, h = w0 / zoom, h0 / zoom
        x = cx - w / 2
        y = cy - 0.42 * h
        return int(round(x)), int(round(y)), int(round(w)), int(round(h))


# --- Images -----------------------------------------------------------------------------

def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(BOLD), size)


def wrap(text: str, f, max_w: float):
    space = f.getlength(" ")
    lines, cur, cur_w = [], [], 0.0
    for wd, m in tokens(text):
        ww = f.getlength(wd)
        add = ww + (space if cur else 0)
        if cur and cur_w + add > max_w:
            lines.append(cur)
            cur, cur_w, add = [], 0.0, ww
        cur.append((wd, m, ww))
        cur_w += add
    if cur:
        lines.append(cur)
    return lines, space


def label(text: str, size: int = 60, max_w: float = 900) -> np.ndarray:
    """Étiquette blanche arrondie façon Instagram, texte noir, *mots* en orange (RGBA, taille du bloc)."""
    f = font(size)
    lines, space = balanced(text, f, max_w)
    lh, px, py = int(size * 1.25), 34, 22
    widest = max(sum(x[2] for x in l) + space * (len(l) - 1) for l in lines)
    bw, bh = int(widest + 2 * px), int(lh * len(lines) + 2 * py)
    img = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, bw - 1, bh - 1], radius=24, fill=(255, 255, 255, 255))
    for k, l in enumerate(lines):
        lw = sum(x[2] for x in l) + space * (len(l) - 1)
        x, y = (bw - lw) / 2, py + k * lh + lh / 2
        for wd, m, ww in l:
            d.text((x, y), wd, font=f, fill=ORANGE if m else INK, anchor="lm")
            x += ww + space
    return np.array(img)


def balanced(text: str, f, max_w: float):
    """Une ligne si elle tient, sinon deux lignes de largeur proche (jamais un mot seul en bas)."""
    space = f.getlength(" ")
    toks = [(wd, m, f.getlength(wd)) for wd, m in tokens(text)]
    width = lambda ts: sum(t[2] for t in ts) + space * max(len(ts) - 1, 0)
    if width(toks) <= max_w or len(toks) < 2:
        return [toks], space
    best = min(range(1, len(toks)), key=lambda i: max(width(toks[:i]), width(toks[i:])))
    return [toks[:best], toks[best:]], space


def subtitle(text: str, size: int = 64) -> np.ndarray:
    f = font(size)
    lines, space = balanced(text, f, 960)
    lh, pad = int(size * 1.22), 14
    widest = max(sum(x[2] for x in l) + space * (len(l) - 1) for l in lines)
    bw, bh = int(widest + 2 * pad + 20), int(lh * len(lines) + 2 * pad)
    img = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for k, l in enumerate(lines):
        lw = sum(x[2] for x in l) + space * (len(l) - 1)
        x, y = (bw - lw) / 2, pad + k * lh + lh / 2
        for wd, m, ww in l:
            d.text((x, y), wd, font=f, fill=ORANGE if m else (255, 255, 255), anchor="lm",
                   stroke_width=9, stroke_fill=INK)
            x += ww + space
    return np.array(img)


def blend(frame: np.ndarray, rgba: np.ndarray, cx: int, cy: int) -> None:
    h, w = rgba.shape[:2]
    x0, y0 = int(cx - w / 2), int(cy - h / 2)
    region = frame[y0:y0 + h, x0:x0 + w].astype(np.float32)
    a = rgba[..., 3:4].astype(np.float32) / 255
    frame[y0:y0 + h, x0:x0 + w] = (region * (1 - a) + rgba[..., :3] * a).astype(np.uint8)


# --- Composition ------------------------------------------------------------------------

def fit_rect(rect, zoom: float, anchor: float = ANCHOR):
    """Fenêtre au format de la zone haute qui contient `rect`, zoomée sur son centre ; le centre du contenu
    tombe à ANCHOR de la hauteur. La fenêtre peut déborder de la source (on complète avec la couleur du bord)."""
    x, y, w, h = rect
    cx, cy = x + w / 2, y + h / 2
    ar = W / SCREEN_H
    if w / h > ar:
        h = w / ar
    else:
        w = h * ar
    w, h = w / zoom, h / zoom
    if w > SRC_W:
        w, h = SRC_W, SRC_W / ar
    x = min(max(cx - w / 2, 0), SRC_W - w)
    y = cy - anchor * h
    return int(x), int(y), int(w), int(h)


def screen_part(src_frame: np.ndarray, rect, zoom: float, anchor: float = ANCHOR, top_min: int = 0) -> np.ndarray:
    """`top_min` : lignes de la source à ignorer en haut (fond d'écran, bord de fenêtre), remplacées par la
    couleur de la page."""
    x, y, w, h = fit_rect(rect, zoom, anchor)
    y0, y1 = max(y, top_min), min(y + h, SRC_H)
    crop = src_frame[y0:y1, x:x + w]
    if y0 != y or y1 != y + h:
        edge = crop[2:6] if y0 != y else crop[-6:-2]
        canvas = np.empty((h, w, 3), np.uint8)
        canvas[:] = np.median(edge.reshape(-1, 3), axis=0).astype(np.uint8)
        canvas[y0 - y:y1 - y] = crop
        crop = canvas
    return cv2.resize(crop, (W, SCREEN_H), interpolation=cv2.INTER_LANCZOS4 if w < W else cv2.INTER_AREA)


def face_part(src_frame: np.ndarray, box) -> np.ndarray:
    x, y, w, h = box
    crop = src_frame[max(y, 0):y + h, max(x, 0):x + w]
    crop = cv2.bilateralFilter(crop, 5, 18, 5)              # adoucit les blocs de compression avant d'agrandir
    up = cv2.resize(crop, (W, FACE_H), interpolation=cv2.INTER_CUBIC)
    soft = cv2.GaussianBlur(up, (0, 0), 2.2)
    return cv2.addWeighted(up, 1.55, soft, -0.55, 0)          # netteté


def frames(src: Path, t0: float, dur: float):
    """Images de la source (RGB 1692 × 1080) à 30 i/s, à partir de t0."""
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", f"{t0:.3f}", "-i", str(src), "-t", f"{dur:.3f}",
                          "-vf", f"fps={FPS}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    size = SRC_W * SRC_H * 3
    while True:
        buf = p.stdout.read(size)
        if len(buf) < size:
            break
        yield np.frombuffer(buf, np.uint8).reshape(SRC_H, SRC_W, 3)
    p.wait()


def frame_at(src: Path, t: float) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
                          "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(SRC_H, SRC_W, 3)


class Reel:
    def __init__(self, script_path: Path):
        self.path = script_path.resolve()
        self.s = json.loads(self.path.read_text())
        self.src = ROOT / self.s["source"]
        cuts = self.s.get("couper", [])
        self.pieces = []   # (de, a, segment)
        for seg in self.s["segments"]:
            for a, b in keep_intervals(self.src, seg, cuts):
                self.pieces.append((a, b, seg))
        t = 0.0
        self.starts = []
        for a, b, _ in self.pieces:
            self.starts.append(t)
            t += b - a
        self.length = t
        self.bubble = Bubble(self.src, [(a - 0.5, b + 0.5) for a, b, _ in self.pieces])
        self.zooms = self.s.get("zooms", [])
        self.title = label(self.s["titre"], 56)
        self.cta = label(self.s["cta"], 52) if self.s.get("cta") else None
        self.subs = []
        for st in self.s.get("sous_titres", []):
            a, b = self.out_time(st["de"], "start"), self.out_time(st["a"], "end")
            if b > a:
                self.subs.append([a, b, subtitle(st["texte"])])
        for k in range(len(self.subs) - 1):   # pas de trou court entre deux sous-titres
            if 0 < self.subs[k + 1][0] - self.subs[k][1] < 0.45:
                self.subs[k][1] = self.subs[k + 1][0]

    def out_time(self, tau: float, edge: str) -> float:
        for (a, b, _), t0 in zip(self.pieces, self.starts):
            if a <= tau <= b:
                return t0 + tau - a
            if tau < a:
                return t0 if edge == "start" else max(t0 - 0.001, 0)
        return self.length

    def zoomed(self, tau: float) -> bool:
        return any(a <= tau <= b for a, b in self.zooms)

    def screen_spec(self, seg: dict, tau: float, with_key: bool = False):
        keys = seg.get("ecran") or [{"rect": [0, 0, SRC_W, SRC_H]}]
        cur = keys[0]
        for k in keys:
            if k.get("t", seg["de"]) <= tau + 1e-6:
                cur = k
        t_key = cur.get("t", seg["de"])
        sigma = cur["src"] + (tau - t_key) if "src" in cur else tau
        return (cur["rect"], sigma, cur) if with_key else (cur["rect"], sigma)

    def compose(self, face_src, screen_src, tau, t_out, piece_idx, seg) -> np.ndarray:
        z = self.zoomed(tau)
        out = np.empty((H, W, 3), np.uint8)
        rect, _, key = self.screen_spec(seg, tau, with_key=True)
        out[:SCREEN_H] = screen_part(screen_src, rect, 1.25 if z else 1.0, key.get("ancre", ANCHOR),
                                     key.get("haut_min", 0))
        fz = 1.10 if z else (1.0 if piece_idx % 2 == 0 else 1.05)
        out[SCREEN_H:] = face_part(face_src, self.bubble.crop(tau, fz))
        for a, b, img in self.subs:
            if a <= t_out < b:
                blend(out, img, W // 2, SUB_Y)
        blend(out, self.title, W // 2, TITLE_TOP + self.title.shape[0] // 2)
        if self.cta is not None and t_out >= self.length - 2.2:
            blend(out, self.cta, W // 2, CTA_Y)
        return out

    def locate(self, t_out: float):
        for i, ((a, b, seg), t0) in enumerate(zip(self.pieces, self.starts)):
            if t_out < t0 + (b - a) or i == len(self.pieces) - 1:
                return i, a + (t_out - t0), seg
        raise ValueError

    # -- aperçu : une image par seconde, sans encoder la vidéo
    def preview(self, step: float = 1.0) -> Path:
        tiles = []
        t = 0.2
        while t < self.length:
            i, tau, seg = self.locate(t)
            _, sigma = self.screen_spec(seg, tau)
            fs = frame_at(self.src, tau)
            ss = fs if abs(sigma - tau) < 1e-3 else frame_at(self.src, sigma)
            img = Image.fromarray(self.compose(fs, ss, tau, t, i, seg)).resize((270, 480))
            ImageDraw.Draw(img).text((6, 4), f"{t:.1f}s / src {tau:.1f}", font=font(18), fill=(255, 0, 0),
                                     stroke_width=3, stroke_fill=(255, 255, 255))
            tiles.append(img)
            t += step
        cols = 8
        rows = (len(tiles) + cols - 1) // cols
        sheet = Image.new("RGB", (270 * cols, 480 * rows), "black")
        for k, im in enumerate(tiles):
            sheet.paste(im, ((k % cols) * 270, (k // cols) * 480))
        out = self.path.parent / "_build" / "apercu.jpg"
        out.parent.mkdir(exist_ok=True)
        sheet.save(out, quality=85)
        return out

    # -- son
    def audio(self, work: Path) -> Path:
        chunks = []
        fade = int(0.012 * SR)
        for a, b, _ in self.pieces:
            raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", str(self.src),
                                  "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
            x = np.frombuffer(raw, np.float32).copy()
            n = int(round((b - a) * SR))
            x = np.pad(x, (0, max(0, n - len(x))))[:n]
            ramp = np.linspace(0, 1, fade, dtype=np.float32)
            x[:fade] *= ramp
            x[-fade:] *= ramp[::-1]
            chunks.append(x)
        voice = np.concatenate(chunks)
        boom_wav = work / "boom.wav"
        make_boom(boom_wav, SR)
        with wave.open(str(boom_wav)) as wv:
            boom = np.frombuffer(wv.readframes(wv.getnframes()), np.int16).astype(np.float32) / 32767
        self.boom_times = []
        for bt in self.s.get("booms", []):
            t = self.out_time(bt, "start")
            if t < self.length:
                self.boom_times.append(round(t, 2))
        # la voix est traitée seule (compression, niveau), les booms sont ajoutés ensuite
        vin, vout = work / "voix_brute.wav", work / "voix.f32"
        write_wav(vin, voice)
        run(["ffmpeg", "-v", "error", "-y", "-i", str(vin), "-af",
             "highpass=f=75,equalizer=f=3200:t=q:w=1.2:g=3.5,equalizer=f=180:t=q:w=1:g=1.5,"
             "acompressor=threshold=-22dB:ratio=3.5:attack=4:release=90:makeup=4,"
             "loudnorm=I=-14:TP=-1.5:LRA=7", "-ar", str(SR), "-ac", "1", "-f", "f32le", str(vout)])
        v = np.fromfile(vout, np.float32).copy()
        for t in self.boom_times:
            i = int(t * SR)
            seg = boom[: max(0, min(len(boom), len(v) - i))]
            v[i:i + len(seg)] += seg * 0.55
        v = np.clip(v, -0.97, 0.97)
        out = work / "son.wav"
        write_wav(out, v)
        return out

    def build(self) -> Path:
        work = self.path.parent / "_build"
        work.mkdir(exist_ok=True)
        son = self.audio(work)
        out = self.path.parent / "reel.mp4"
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                                "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", str(son),
                                "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p",
                                "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(out)],
                               stdin=subprocess.PIPE)
        n_total = int(round(self.length * FPS))
        k = 0
        for i, ((a, b, seg), t0) in enumerate(zip(self.pieces, self.starts)):
            n = int(round((t0 + b - a) * FPS)) - int(round(t0 * FPS))
            _, sigma0 = self.screen_spec(seg, a)
            face_it = frames(self.src, a, (b - a) + 0.2)
            # l'écran vient d'ailleurs si une clé `src` le demande : flux séparé, relu à chaque changement de clé
            screen_it, screen_key = None, None
            last_face = None
            for j in range(n):
                tau = a + j / FPS
                fs = next(face_it, None)
                fs = last_face if fs is None else fs
                last_face = fs
                key = id(self.screen_spec(seg, tau)[0])
                _, sigma = self.screen_spec(seg, tau)
                if abs(sigma - tau) < 1e-3:
                    ss = fs
                else:
                    if screen_key != key or screen_it is None:
                        screen_it, screen_key = frames(self.src, sigma, (b - tau) + 0.2), key
                    ss = next(screen_it, None)
                    ss = fs if ss is None else ss
                enc.stdin.write(self.compose(fs, ss, tau, k / FPS, i, seg).tobytes())
                k += 1
        enc.stdin.close()
        enc.wait()
        (self.path.parent / "montage.json").write_text(json.dumps({
            "duree_s": round(self.length, 2), "images": k, "images_attendues": n_total,
            "coupes": [{"de_source": a, "a_source": b, "debut_reel": round(t0, 2)}
                       for (a, b, _), t0 in zip(self.pieces, self.starts)],
            "booms_s": self.boom_times}, ensure_ascii=False, indent=2))
        return out


def write_wav(path: Path, x: np.ndarray) -> None:
    run_input = x.astype(np.float32).tobytes()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    "-c:a", "pcm_f32le", str(path)], input=run_input, check=True)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    reel = Reel(Path(sys.argv[1]))
    print(f"{len(reel.pieces)} morceaux, {reel.length:.1f} s")
    print(reel.preview() if "--apercu" in sys.argv else reel.build())
