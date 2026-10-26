"""Vidéo horizontale du fondateur (partage d'écran + bulle webcam), rendue dynamique (demande du 26/10/2026).

Usage :
    .venv/bin/python CONTENU/06_GABARITS/montage_ecran.py CONTENU/08_YOUTUBE/<dossier>/montage.json
    ... --apercu            planche : la 1re image de chaque plan, sans rendu vidéo
    ... --de 120 --a 180    ne rend que ce passage de la vidéo montée (secondes de sortie), pour vérifier vite

La source : un enregistrement d'écran (une page de PDF dans sa fenêtre, la bulle webcam incrustée en bas à droite,
toujours au même endroit). La sortie : 1920 × 1080, 30 i/s, voix à -14 LUFS.

1. coupes (règles des reels YouTube, retours du 11/10/2026, `montage_youtube.keep_intervals`) : chaque borne est
   recalée dans un creux réel de la voix, jamais dans un mot ; les blancs de plus de 0,45 s sont raccourcis (0,12 s
   de marge) ; les plages `couper` [début du premier mot retiré, début du premier mot gardé] retirent les faux
   départs, les reprises et les « euh » ;
2. cadre de base `cadre` [x, y, l, h] (la page sans la barre d'outils, la bulle entière) ; à chaque jump cut, le plan
   alterne 100 % et `pousse` (léger zoom vers la bulle) pour que le saut se lise comme un choix de montage ;
3. zooms secs `zooms` [{de, a, rect}] : le cadre se resserre sur `rect` (un élément de la page, nommé dans
   `elements`), sans transition ; la bascule tombe au début d'un mot ; un cadre zoomé contient la bulle entière ou
   l'évite, jamais à moitié ;
4. `visage` [[de, a]] : sa bulle en grand, au centre, sur la page floutée (moments forts) ;
5. son : voix (passe-haut, présence, compression), le BOOM du fondateur sur `booms`, son clic à chaque page
   (`pages`), niveau constant à -14 LUFS et limiteur ;
6. contrôle : `coupes.json` donne chaque plan et le niveau de la voix à chaque coupe ; une coupe où la voix est encore
   audible y est listée (`coupes_dans_la_voix`), et se corrige avant de montrer la vidéo.

Chaque plan est encodé à part dans `_build/plans/` (le nom dit son contenu) : après une retouche, seuls les plans
changés sont refaits. Tout ce qui est rendu reste hors Git.
"""

from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from montage_youtube import Envelope, keep_intervals  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SOUNDS = ROOT / "CONTENU" / "09_STUDIO_SETTY" / "assets" / "sounds"
W, H, FPS, SR = 1920, 1080, 30, 48000
SPF = SR // FPS          # échantillons de son par image : les plans se raccordent à l'échantillon près
MARGE = 14               # air autour de la bulle quand un cadre la contient ou l'évite
VISAGE = 1.75            # agrandissement de la bulle dans les plans `visage`
ZMAX = 1.8               # zoom le plus serré (par rapport au cadre de base) : au-delà, le texte de la page s'empâte
SEC = 0.6                # une bascule de zoom à moins de SEC s d'une coupe se cale sur la coupe


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def probe_size(src: Path) -> tuple[int, int]:
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
               "-of", "csv=p=0", str(src)], capture_output=True, text=True).stdout
    w, h = out.strip().split(",")
    return int(w), int(h)


# --- Cadres ------------------------------------------------------------------------------

def overlaps(c, r) -> bool:
    return c[0] < r[0] + r[2] and r[0] < c[0] + c[2] and c[1] < r[1] + r[3] and r[1] < c[1] + c[3]


def contains(c, r) -> bool:
    return (c[0] <= r[0] + 0.5 and c[1] <= r[1] + 0.5
            and c[0] + c[2] >= r[0] + r[2] - 0.5 and c[1] + c[3] >= r[1] + r[3] - 0.5)


class Framer:
    """Les cadres 16:9 de la source : la base, la poussée, les zooms. Un zoom garde la bulle entière ou l'évite,
    ne tranche jamais une ligne de texte par le haut ou le bas (`lignes`, par page : [y0, y1], ou [y0, y1, x0, x1]
    pour un titre, qui se montre en entier ou pas du tout), et reste dans la fenêtre (`fenetre`) s'il le peut."""

    def __init__(self, s: dict, src_w: int, src_h: int):
        self.sw, self.sh = src_w, src_h
        self.top = s.get("haut_min", 0)                       # au-dessus : la barre d'outils de la fenêtre
        bx, by, bw, bh = s["bulle"]
        self.bubble = [bx, by, bw, bh]
        self.zone = [bx - MARGE, by - MARGE, bw + 2 * MARGE, bh + 2 * MARGE]
        self.window = s.get("fenetre", [0, 0, src_w, src_h])
        self.lines = {int(k): v for k, v in s.get("lignes", {}).items()}
        self.base = [float(v) for v in s["cadre"]]
        # fond flouté des plans `visage` : la page à gauche de la bulle (sinon la bulle floue apparaît en double)
        fw = min(self.window[0] + self.window[2], self.zone[0]) - self.window[0]
        self.backdrop = [self.window[0], self.top, fw, fw * 9 / 16]
        pw = self.base[2] / s.get("pousse", 1.08)
        ph = pw * 9 / 16
        right = min(self.sw, bx + bw + 2 * MARGE)
        bottom = min(self.sh, by + bh + MARGE)
        self.push = [right - pw, bottom - ph, pw, ph]          # la poussée garde la bulle entière, en bas à droite

    def clamp(self, c):
        x, y, w, h = c
        if w > self.sw:
            w, h = self.sw, self.sw * 9 / 16
        x = min(max(x, 0), self.sw - w)
        y = min(max(y, self.top), self.sh - h)
        return [x, y, w, h]

    def ok(self, c) -> bool:
        return not overlaps(c, self.zone) or contains(c, self.zone)

    def fit(self, rect, pad: float = 0.1, zoom: float | None = None, page: int | None = None):
        """Le cadre le plus proche de celui centré sur `rect` (avec de l'air) qui respecte la bulle, les lignes de
        texte et la fenêtre. Coût : le déplacement, plus des pénalités (rect coupé, titre coupé sur les côtés,
        fond d'écran visible)."""
        x, y, w, h = rect
        if zoom:      # zoom imposé (un élément coincé entre un titre et la bulle se cadre plus serré)
            cw = self.base[2] / zoom
        else:
            cw = max(w * (1 + 2 * pad), h * (1 + 2 * pad) * 16 / 9, self.base[2] / ZMAX)
        cw = min(cw, self.base[2])
        ch = cw * 9 / 16
        x0, t0 = x + w / 2 - cw / 2, y + h / 2 - ch / 2
        wx, wy, ww, wh = self.window
        lines = self.lines.get(page, [])
        clamp_x = lambda v: min(max(v, 0), self.sw - cw)
        xs = {round(clamp_x(v)) for v in (x0, min(max(x0, wx), wx + ww - cw),            # centré, dans la fenêtre
                                          self.zone[0] - cw,                              # à gauche de la bulle
                                          max(x0, self.zone[0] + self.zone[2] - cw))}     # bulle entière
        best = None
        for cx in xs:
            for t in np.arange(self.top, self.sh - ch + 1, 2.0):
                c = [cx, float(t), cw, ch]
                if not self.ok(c) or any(l[0] < t < l[1] or l[0] < t + ch < l[1] for l in lines):
                    continue
                cost = abs(cx - x0) + abs(t - t0)
                if not contains(c, rect):
                    cost += 3000
                cost += sum(800 for l in lines if len(l) == 4 and t <= l[0] and t + ch >= l[1]
                            and (cx > l[2] or cx + cw < l[3]))
                if not contains(c, self.zone):
                    cost += 1.5 * (max(0, wx - cx) + max(0, cx + cw - wx - ww) + max(0, wy - t) + max(0, t + ch - wy - wh))
                if best is None or cost < best[0]:
                    best = (cost, c)
        return best[1] if best else self.base


# --- Plan de montage ---------------------------------------------------------------------

class Edit:
    def __init__(self, path: Path):
        self.path = path.resolve()
        self.dir = self.path.parent
        self.s = json.loads(self.path.read_text())
        src = Path(self.s["source"])
        self.src = src if src.is_absolute() else ROOT / src
        self.framer = Framer(self.s, *probe_size(self.src))
        self.env = Envelope(self.src)
        self.elements = self.s.get("elements", {})

        # 1. ce qu'on garde (temps de la source), recalé sur la grille des images de sortie
        kept = []
        for de, a in self.s.get("garder", [[0, self.duration()]]):
            kept += keep_intervals(self.env, {"de": de, "a": a}, [c[:2] for c in self.s.get("couper", [])])
        self.kept = [(round(a * FPS) / FPS, round(b * FPS) / FPS) for a, b in kept]
        self.kept = [(a, b) for a, b in self.kept if b - a >= 2 / FPS]

        # 2. les plans : un morceau gardé, découpé aux bascules de zoom et de visage
        self.shots = self.plan_shots()
        t = 0
        for sh in self.shots:
            sh["t"] = t
            t += sh["n"]
        self.frames = t
        self.length = t / FPS

        # 3. contrôle des coupes : niveau de la voix de part et d'autre de chaque saut
        self.cut_check = []
        for k in range(len(self.kept)):
            for edge, tt in (("debut", self.kept[k][0]), ("fin", self.kept[k][1])):
                if (edge == "debut" and k == 0) or (edge == "fin" and k == len(self.kept) - 1):
                    continue
                lv = self.env.level(tt)
                if lv > self.env.quiet + 6:
                    self.cut_check.append({"source_s": round(tt, 3), "bord": edge, "niveau_db": round(lv, 1),
                                           "creux_db": round(self.env.quiet, 1)})

    def duration(self) -> float:
        out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(self.src)],
                  capture_output=True, text=True).stdout
        return float(out)

    def rect(self, r):
        return self.elements[r] if isinstance(r, str) else r

    def snap(self, t: float) -> float:
        """Une bascule de cadre au milieu d'une phrase tombe au début d'un mot (la coupe ne se voit pas dans la voix)."""
        for a, b in self.kept:
            if abs(t - a) < SEC:
                return a
            if abs(t - b) < SEC:
                return b
        return round(self.env.onset(t) * FPS) / FPS

    def plan_shots(self) -> list[dict]:
        events = []   # (début, fin, type, cadre)
        for z in self.s.get("zooms", []):
            page = 1 + sum(p <= z["de"] for p in self.s.get("pages", []))
            c = self.framer.fit(self.rect(z["rect"]), z.get("air", 0.1), z.get("zoom"), page)
            events.append((self.snap(z["de"]), self.snap(z["a"]), "zoom", c))
        for de, a in self.s.get("visage", []):
            events.append((self.snap(de), self.snap(a), "visage", self.framer.base))
        events.sort()
        shots, alt = [], 0
        for a, b in self.kept:
            # chaque saut alterne la base et la poussée
            plain = self.framer.base if alt % 2 == 0 else self.framer.push
            alt += 1
            bounds = {a, b}
            for e0, e1, _, _ in events:
                for x in (e0, e1):
                    if a < x < b:
                        bounds.add(x)
            pts = sorted(bounds)
            for p0, p1 in zip(pts, pts[1:]):
                n = int(round((p1 - p0) * FPS))
                if n <= 0:
                    continue
                mid = (p0 + p1) / 2
                ev = [e for e in events if e[0] <= mid < e[1]]
                kind, crop = ("visage", self.framer.base) if any(e[2] == "visage" for e in ev) else \
                    ("zoom", ev[-1][3]) if ev else ("plan", plain)
                if shots and shots[-1]["a"] + shots[-1]["n"] / FPS == p0 and shots[-1]["type"] == kind \
                        and shots[-1]["cadre"] == crop:
                    shots[-1]["n"] += n        # même cadre, même continuité : un seul plan
                    continue
                shots.append({"a": p0, "n": n, "type": kind, "cadre": [round(v, 1) for v in crop]})
        return shots

    def out_time(self, tau: float) -> float:
        """Temps de sortie d'un instant de la source (un instant coupé tombe au début du morceau suivant)."""
        for sh in self.shots:
            a, b = sh["a"], sh["a"] + sh["n"] / FPS
            if tau < a:
                return sh["t"] / FPS
            if tau < b:
                return (sh["t"] + (tau - a) * FPS) / FPS
        return self.length

    # --- Image -----------------------------------------------------------------------

    def mask(self) -> Path:
        bw, bh = self.face_size()
        p = self.dir / "_build" / f"masque_{bw}x{bh}.png"
        if not p.exists():
            img = Image.new("L", (bw * 4, bh * 4), 0)
            ImageDraw.Draw(img).rounded_rectangle([0, 0, bw * 4 - 1, bh * 4 - 1], radius=40 * 4, fill=255)
            img.resize((bw, bh), Image.LANCZOS).save(p)
        return p

    def face_size(self) -> tuple[int, int]:
        _, _, bw, bh = self.framer.bubble
        return int(round((bw - 6) * VISAGE / 2) * 2), int(round((bh - 6) * VISAGE / 2) * 2)

    def video_filter(self, sh: dict) -> tuple[list, str]:
        x, y, w, h = sh["cadre"]
        crop = f"crop={w:.0f}:{h:.0f}:{x:.0f}:{y:.0f},scale={W}:{H}:flags=lanczos"
        if sh["type"] != "visage":
            return [], f"[0:v]fps={FPS},{crop},format=yuv420p[v]"
        bx, by, bw, bh = self.framer.bubble
        fw, fh = self.face_size()
        x, y, w, h = self.framer.backdrop
        back = f"crop={w:.0f}:{h:.0f}:{x:.0f}:{y:.0f},scale={W}:{H}:flags=bicubic"
        g = (f"[0:v]fps={FPS},split[a][b];"
             f"[a]{back},gblur=sigma=28,eq=brightness=-0.10:saturation=0.85[bg];"
             f"[b]crop={bw - 6}:{bh - 6}:{bx + 3}:{by + 3},scale={fw}:{fh}:flags=lanczos,format=rgba[f0];"
             f"[1:v]format=gray[m];[f0][m]alphamerge[f];"
             f"[bg][f]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]")
        return ["-loop", "1", "-i", str(self.mask())], g

    def shot_file(self, sh: dict) -> Path:
        key = json.dumps([str(self.src), sh["a"], sh["n"], sh["type"], sh["cadre"], VISAGE, 2], sort_keys=True)
        return self.dir / "_build" / "plans" / (hashlib.sha1(key.encode()).hexdigest()[:16] + ".mp4")

    def render_shot(self, sh: dict) -> Path:
        out = self.shot_file(sh)
        if out.exists():
            return out
        extra, graph = self.video_filter(sh)
        tmp = out.with_suffix(".part.mp4")
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{sh['a']:.4f}", "-i", str(self.src), *extra,
             "-filter_complex", graph, "-map", "[v]", "-frames:v", str(sh["n"]), "-an",
             "-c:v", "libx264", "-preset", "fast", "-crf", "17", "-threads", "4", "-r", str(FPS),
             "-video_track_timescale", "15360", str(tmp)])
        tmp.rename(out)
        return out

    # --- Son -------------------------------------------------------------------------

    def load(self, src: Path, mono: bool = True) -> np.ndarray:
        raw = run(["ffmpeg", "-v", "error", "-i", str(src), "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                  capture_output=True).stdout
        return np.frombuffer(raw, np.float32).copy()

    def audio(self, shots: list[dict], work: Path) -> Path:
        full = self.load(self.src)
        fade = int(0.008 * SR)
        ramp = np.linspace(0, 1, fade, dtype=np.float32)
        chunks = []
        for k, sh in enumerate(shots):
            i = int(round(sh["a"] * SR))
            x = full[i:i + sh["n"] * SPF].copy()
            x = np.pad(x, (0, sh["n"] * SPF - len(x)))
            joined_before = k > 0 and abs(shots[k - 1]["a"] + shots[k - 1]["n"] / FPS - sh["a"]) < 1e-6
            joined_after = k + 1 < len(shots) and abs(sh["a"] + sh["n"] / FPS - shots[k + 1]["a"]) < 1e-6
            if not joined_before:
                x[:fade] *= ramp
            if not joined_after:
                x[-fade:] *= ramp[::-1]
            chunks.append(x)
        voice = np.concatenate(chunks)
        vin, vout = work / "voix_brute.wav", work / "voix.f32"
        write_wav(vin, voice)
        run(["ffmpeg", "-v", "error", "-y", "-i", str(vin), "-af",
             "highpass=f=75,equalizer=f=3200:t=q:w=1.2:g=3.5,equalizer=f=180:t=q:w=1:g=1.5,"
             "acompressor=threshold=-22dB:ratio=3.5:attack=4:release=90:makeup=4",
             "-ar", str(SR), "-ac", "1", "-f", "f32le", str(vout)])
        v = np.fromfile(vout, np.float32).copy()[:len(voice)]
        t0 = shots[0]["t"] / FPS
        sfx = np.zeros_like(v)
        boom = self.load(SOUNDS / "boom.mp3")[: int(3.2 * SR)]
        boom[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR), dtype=np.float32)
        clic = self.load(SOUNDS / "clic.mp3")[int(0.2 * SR): int(0.7 * SR)]
        clic[-int(0.15 * SR):] *= np.linspace(1, 0, int(0.15 * SR), dtype=np.float32)
        self.booms_out, self.clics_out = [], []
        for bt in self.s.get("booms", []):
            t = self.out_time(self.env.onset(bt) + 0.05) - t0     # l'heure des mots est approximative : on frappe sur l'attaque réelle
            if 0 <= t < len(v) / SR:
                place(sfx, boom, t, 0.42)          # le BOOM du fondateur, sous la voix (frappe à 0 s)
                self.booms_out.append(round(t + t0, 2))
        for pt in self.s.get("pages", []):
            t = self.out_time(pt) - t0
            if 0 <= t < len(v) / SR:
                place(sfx, clic, t - 0.09, 0.4)    # son clic, calé sur l'apparition de la page (frappe à 0,29 s)
                self.clics_out.append(round(t + t0, 2))
        out = work / "son.wav"
        master(v + sfx, out, work)
        return out

    # --- Rendu -----------------------------------------------------------------------

    def select(self, de: float | None, a: float | None) -> list[dict]:
        if de is None:
            return self.shots
        a = a if a is not None else self.length
        return [sh for sh in self.shots if sh["t"] / FPS < a and (sh["t"] + sh["n"]) / FPS > de]

    def build(self, de: float | None = None, a: float | None = None) -> Path:
        work = self.dir / "_build"
        (work / "plans").mkdir(parents=True, exist_ok=True)
        shots = self.select(de, a)
        todo = [sh for sh in shots if not self.shot_file(sh).exists()]
        print(f"{len(shots)} plans, {len(todo)} à encoder", flush=True)
        done = 0
        with ThreadPoolExecutor(2) as pool:
            for _ in pool.map(self.render_shot, todo):
                done += 1
                if done % 20 == 0:
                    print(f"  {done}/{len(todo)}", flush=True)
        lst = work / "liste.txt"
        lst.write_text("".join(f"file '{self.shot_file(sh)}'\n" for sh in shots))
        video = work / "image.mp4"
        run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(video)])
        son = self.audio(shots, work)
        name = self.s.get("sortie", "video.mp4")
        out = self.dir / (name if de is None else name.replace(".mp4", f"_extrait_{de:.0f}-{a or self.length:.0f}.mp4"))
        run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(son), "-map", "0:v", "-map", "1:a",
             "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-shortest", "-movflags", "+faststart",
             str(out)])
        if de is None:
            self.report()
        return out

    def report(self) -> None:
        (self.dir / "coupes.json").write_text(json.dumps({
            "duree_source_s": round(self.duration(), 2), "duree_s": round(self.length, 2), "images": self.frames,
            "sauts": len(self.kept) - 1, "plans": len(self.shots),
            "booms_s": self.booms_out, "clics_s": self.clics_out,
            "coupes_dans_la_voix": self.cut_check,
            "detail": [{"debut_s": round(sh["t"] / FPS, 2), "source_s": sh["a"], "duree_s": round(sh["n"] / FPS, 2),
                        "type": sh["type"], "cadre": sh["cadre"]} for sh in self.shots]},
            ensure_ascii=False, indent=1))

    def preview(self) -> Path:
        """Planche : la 1re image de chaque nouveau cadre (zoom, visage), avec son heure de sortie."""
        work = self.dir / "_build"
        work.mkdir(exist_ok=True)
        picks, last = [], None
        for sh in self.shots:
            key = (sh["type"], tuple(sh["cadre"]))
            if sh["type"] != "plan" and key != last:
                picks.append(sh)
            last = key
        tw, th = 640, 360
        thumbs = []
        for sh in picks:
            extra, graph = self.video_filter(sh)
            p = work / "vignette.png"
            run(["ffmpeg", "-v", "error", "-y", "-ss", f"{sh['a'] + 0.1:.3f}", "-i", str(self.src), *extra,
                 "-filter_complex", graph.replace("format=yuv420p[v]", f"scale={tw}:{th}[v]"), "-map", "[v]",
                 "-frames:v", "1", str(p)])
            im = Image.open(p).convert("RGB")
            d = ImageDraw.Draw(im)
            m, s = divmod(sh["t"] / FPS, 60)
            d.rectangle([0, th - 26, 150, th], fill=(0, 0, 0))
            d.text((6, th - 21), f"{int(m)}:{s:04.1f} {sh['type']}", fill=(255, 255, 255))
            thumbs.append(im)
        cols = 3
        rows = (len(thumbs) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * (tw + 10), rows * (th + 10)), (30, 30, 30))
        for k, im in enumerate(thumbs):
            sheet.paste(im, ((k % cols) * (tw + 10) + 5, (k // cols) * (th + 10) + 5))
        out = self.dir / "apercu_zooms.jpg"
        sheet.save(out, quality=85)
        return out


def place(dst: np.ndarray, x: np.ndarray, t: float, gain: float) -> None:
    i = int(round(t * SR))
    if i < 0:
        x, i = x[-i:], 0
    n = max(0, min(len(x), len(dst) - i))
    dst[i:i + n] += x[:n] * gain


def write_wav(path: Path, x: np.ndarray) -> None:
    run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
         "-c:a", "pcm_f32le", str(path)], input=x.astype(np.float32).tobytes())


def master(x: np.ndarray, out: Path, work: Path, target: float = -14.0, limit: float = -1.5) -> None:
    """Gain constant jusqu'à -14 LUFS, puis limiteur (jamais de loudnorm dynamique : la voix garde son relief)."""
    raw = work / "mix_brut.wav"
    write_wav(raw, x)
    r = run(["ffmpeg", "-hide_banner", "-i", str(raw), "-af", "ebur128", "-f", "null", "-"],
            capture_output=True, text=True)
    loud = float(r.stderr.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af",
         f"volume={target - loud:.2f}dB,alimiter=limit={limit}dB:attack=2:release=60:level=disabled",
         "-c:a", "pcm_s16le", str(out)])


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    ed = Edit(Path(sys.argv[1]))
    args = sys.argv[2:]
    de = float(args[args.index("--de") + 1]) if "--de" in args else None
    a = float(args[args.index("--a") + 1]) if "--a" in args else None
    print(f"{ed.duration():.1f} s → {ed.length:.1f} s, {len(ed.kept) - 1} sauts, {len(ed.shots)} plans ; "
          f"coupes dans la voix : {ed.cut_check or 'aucune'}", flush=True)
    print(ed.preview() if "--apercu" in args else ed.build(de, a))
