"""Carrousels ManySetter, style éditorial (1080 x 1350), d'après le compte de référence du fondateur.

Usage :
    python3 CONTENU/06_GABARITS/carrousel.py CONTENU/07_PRET_A_PUBLIER/<id>/post.json

Le style (retour du fondateur du 10/10/2026, post de référence instagram.com/p/Dcgl8i7CvDT) :
- titres en serif condensée (Instrument Serif) étirée en hauteur, en minuscules, interlignage serré ;
- *mots* d'un titre : italique + surligneur orange en bas des lettres (la signature ManySetter) ;
- texte courant parlé (Inter), aligné à gauche, **gras** pour la phrase-thèse, étiquettes grises en capitales ;
- une idée = une slide de texte puis, souvent, une slide visuelle épurée (graphique, capture, collage) ;
- fond blanc, une slide noire pour la phrase choc ; ni numéro de slide ni logo.

Une slide : {"bg": "white" | "black", "valign": "center" | "top", "blocks": [...]}.
Blocs : {"title": txt, "size": 118} (couverture, centré) · {"heading": txt} (titre de section, centré)
· {"lead": txt} (phrase-thèse en gras) · {"text": txt} (paragraphes séparés par une ligne vide)
· {"label": txt} · {"caption": txt} · {"spacer": px} · {"image": chemin, "width": px}
· {"collage": [chemin, chemin]} · {"chart": "quadrant" | "curve" | "compare" | "dots", ...}
· {"vote": {"incoming": message reçu, "options": [réponse 1, réponse 2, ...]}}
· {"list": [élément, ...], "start": 1} (liste numérotée, chiffres en serif orange)
· {"chat": [{"from": "lead" | "me", "text": ...}, ...]} (bulles : le lead en gris à gauche, la réponse en orange à droite)
· {"photo": chemin, "handle": "@compte", "width": 560, "ratio": 1.1} (portrait arrondi ; cadre « photo à déposer » si le fichier manque)
· {"versus": [{"photo": chemin, "handle": "@a"}, {"photo": chemin, "handle": "@b"}]} (deux visages et « vs »)
· {"code": "texte", "file": "nom.json"} (fenêtre de code sombre, pour les carrousels tuto).
Fiche avec "style": "grid" (retours du 19/10/2026) : habillage premium, quadrillage fin qui s'efface au centre,
une lueur orange douce qui déborde d'un coin, repères de coupe aux coins, léger grain ; textes plus grands. Sans "style", la fiche sort comme avant (les carrousels déjà publiés ne bougent pas).
Gros mot masqué : écrire \\* dans la fiche (« h\\*ll ») pour un astérisque visible.
Les chemins d'images partent de la racine du dépôt.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
MX = 112
CW = W - 2 * MX
ROOT = Path(__file__).resolve().parents[2]
F = Path(__file__).resolve().parent / "fonts"
SERIF = F / "instrument-serif" / "InstrumentSerif-Regular.ttf"
SERIF_I = F / "instrument-serif" / "InstrumentSerif-Italic.ttf"
SANS = F / "inter" / "Inter-Regular.otf"
SANS_M = F / "inter" / "Inter-Medium.otf"
SANS_SB = F / "inter" / "Inter-SemiBold.otf"
SANS_B = F / "inter" / "Inter-Bold.otf"

INK = "#0d0c0a"
WHITE = "#ffffff"
GREY = "#8a8784"
LIGHT = "#d7d4d2"
MARK = "#ff884d"        # surligneur orange (brand-400), sous le bas des lettres
ORANGE = "#ff611d"      # brand-500
STRETCH = 1.16          # étirement vertical des titres
GAP = 34

_fc: dict = {}


def font(p: Path, s: int) -> ImageFont.FreeTypeFont:
    if (p, s) not in _fc:
        _fc[(p, s)] = ImageFont.truetype(str(p), s)
    return _fc[(p, s)]


def colors(bg: str) -> dict:
    if bg == "black":
        return {"bg": INK, "fg": WHITE, "muted": "#a3a09d", "line": "#42403c", "soft": "#585552"}
    return {"bg": WHITE, "fg": INK, "muted": GREY, "line": LIGHT, "soft": LIGHT}


# --- Titres : serif étirée, mots surlignés ---------------------------------------

LIT = "\u2217"   # astérisque littéral (gros mots masqués), écrit \\* dans la fiche


def title_tokens(text: str):
    out = []
    text = text.replace("\\*", LIT)
    for i, part in enumerate(re.split(r"\*(.+?)\*", text)):
        for w in part.split():
            out.append((w.replace(LIT, "*"), i % 2 == 1))
    # ponctuation collée après un passage surligné
    merged = []
    for w, m in out:
        if merged and not m and re.fullmatch(r"[.,!?;:)»\"']+", w):
            pw, pm = merged.pop()
            merged.append((pw + w, pm))
        else:
            merged.append((w, m))
    return merged


def serif_title(text: str, size: int, c: dict, align: str = "center") -> Image.Image:
    fr, fi = font(SERIF, size), font(SERIF_I, size)
    space = fr.getlength(" ")
    toks = title_tokens(text)

    def wrap(width):
        lines, cur, cur_w = [], [], 0.0
        for w, m in toks:
            ww = (fi if m else fr).getlength(w)
            add = ww + (space if cur else 0)
            if cur and cur_w + add > width:
                lines.append(cur)
                cur, cur_w = [], 0.0
                add = ww
            cur.append((w, m, ww))
            cur_w += add
        return lines + ([cur] if cur else [])

    lines = wrap(CW)
    # pas de mot tout seul sur la dernière ligne : on resserre jusqu'à équilibrer
    width = CW
    while len(lines) > 1 and len(lines[-1]) == 1 and width > CW * 0.6:
        width -= 20
        tried = wrap(width)
        if len(tried) > len(lines):
            break
        lines = tried
    lh = int(size * 0.98)
    imgs = []
    for line in lines:
        lw = sum(x[2] for x in line) + space * (len(line) - 1)
        ascent, descent = fr.getmetrics()
        # assez haut pour les jambages (y, g, p) : sinon le bas des lettres est coupé
        im = Image.new("RGBA", (W, max(int(size * 1.15), int(size * 0.1) + ascent + descent)), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        x = MX + (CW - lw) / 2 if align == "center" else MX
        base = int(size * 0.05) + ascent
        # surligneur : bandes continues sous les mots marqués (fond blanc seulement)
        if c["bg"] == WHITE:
            xx = x
            for k, (w, m, ww) in enumerate(line):
                if m:
                    nxt_m = k + 1 < len(line) and line[k + 1][1]
                    wd = ww + (space if nxt_m else 0)
                    d.rectangle([xx - 6, base - int(size * 0.34), xx + wd + 6, base + int(size * 0.07)], fill=MARK)
                xx += ww + space
        xx = x
        for w, m, ww in line:
            color = c["fg"] if (c["bg"] == WHITE or not m) else ORANGE
            d.text((xx, int(size * 0.05)), w, font=fi if m else fr, fill=color)
            xx += ww + space
        im = im.resize((W, int(im.height * STRETCH)), Image.LANCZOS)
        imgs.append(im)
    total = int(lh * STRETCH) * (len(imgs) - 1) + imgs[-1].height
    out = Image.new("RGBA", (W, total), (0, 0, 0, 0))
    for i, im in enumerate(imgs):
        out.alpha_composite(im, (0, i * int(lh * STRETCH)))
    return out


# --- Texte courant ---------------------------------------------------------------

def rich_tokens(text: str):
    out = []
    text = text.replace("\\*", LIT)
    for i, part in enumerate(re.split(r"\*\*(.+?)\*\*", text)):
        for j, w in enumerate(part.split(" ")):
            if not w:
                continue
            w = w.replace(LIT, "*")
            # ponctuation collée juste après un passage en gras : elle reste sur la même ligne
            if j == 0 and out and not part.startswith(" ") and re.fullmatch(r"[.,!?;:)»\"']+", w):
                pw, pb = out.pop()
                out.append((pw + w, pb))
            else:
                out.append((w, i % 2 == 1))
    return out


def paragraph(text: str, size: int, c: dict, bold_all: bool = False, color: str | None = None,
              width: int = CW, align: str = "left", leading: float = 1.3) -> Image.Image:
    fr = font(SANS_B if bold_all else SANS, size)
    fb = font(SANS_B, size)
    space = fr.getlength(" ")
    rows: list = []
    for para_i, para in enumerate(text.split("\n\n")):
        if para_i:
            rows.append(None)
        for raw_line in para.split("\n"):
            cur, cur_w = [], 0.0
            for w, b in rich_tokens(raw_line):
                f = fb if (b or bold_all) else fr
                ww = f.getlength(w)
                add = ww + (space if cur else 0)
                if cur and cur_w + add > width:
                    rows.append(cur)
                    cur, cur_w = [], 0.0
                    add = ww
                cur.append((w, b or bold_all, ww))
                cur_w += add
            rows.append(cur)
    lh = int(size * leading)
    h = sum(int(lh * 0.6) if r is None else lh for r in rows) + int(size * 0.3)
    im = Image.new("RGBA", (W, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    y = 0
    for r in rows:
        if r is None:
            y += int(lh * 0.6)
            continue
        lw = sum(x[2] for x in r) + space * (len(r) - 1)
        x = MX + ((CW - lw) / 2 if align == "center" else 0)
        for w, b, ww in r:
            d.text((x, y), w, font=fb if b else fr, fill=color or c["fg"])
            x += ww + space
        y += lh
    return im


def label(text: str, c: dict, size: int = 23, align: str = "left") -> Image.Image:
    f = font(SANS_SB, size)
    t = text.upper()
    spacing = 2.4
    lw = sum(f.getlength(ch) + spacing for ch in t)
    im = Image.new("RGBA", (W, int(size * 1.5)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = MX + ((CW - lw) / 2 if align == "center" else 0)
    for ch in t:
        d.text((x, 0), ch, font=f, fill=c["muted"])
        x += f.getlength(ch) + spacing
    return im


# --- Images ------------------------------------------------------------------------

def load_cropped(path: Path) -> Image.Image:
    """Recadre une capture sur son contenu (enlève le fond uni autour)."""
    im = Image.open(path).convert("RGB")
    bg = im.getpixel((4, 4))
    mask = Image.eval(Image.merge("RGB", [ch.point(lambda v, b=b: 255 if abs(v - b) > 14 else 0)
                                          for ch, b in zip(im.split(), bg)]), lambda v: v).convert("L")
    box = mask.getbbox()
    if box:
        m = 44
        im = im.crop((max(0, box[0] - m), max(0, box[1] - m), min(im.width, box[2] + m), min(im.height, box[3] + m)))
    return im


def rounded(im: Image.Image, width: int, radius: int = 30, border: str | None = LIGHT) -> Image.Image:
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS).convert("RGBA")
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.width - 1, im.height - 1], radius=radius, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    if border:
        ImageDraw.Draw(out).rounded_rectangle([0, 0, im.width - 1, im.height - 1], radius=radius, outline=border, width=2)
    return out


def image_block(spec: dict) -> Image.Image:
    im = rounded(load_cropped(ROOT / spec["image"]), spec.get("width", 760))
    out = Image.new("RGBA", (W, im.height), (0, 0, 0, 0))
    out.alpha_composite(im, ((W - im.width) // 2, 0))
    return out


def collage(paths: list[str], width: int = 520) -> Image.Image:
    a = rounded(load_cropped(ROOT / paths[0]), width)
    b = rounded(load_cropped(ROOT / paths[1]), width)
    off_y = int(a.height * 0.38)
    h = max(a.height, off_y + b.height)
    out = Image.new("RGBA", (W, h), (0, 0, 0, 0))
    out.alpha_composite(a, (MX - 30, 0))
    out.alpha_composite(b, (W - MX + 30 - b.width, off_y))
    return out


# --- Graphiques épurés ---------------------------------------------------------------

def _axes(d, c, x0, y0, x1, y1, xl, yl, k=1.0):
    d.line([x0, y1, x1, y1], fill=c["line"], width=3)
    d.line([x0, y0, x0, y1], fill=c["line"], width=3)
    f = font(SANS_SB, int(22 * k))
    t = xl.upper()
    d.text(((x0 + x1) / 2, y1 + int(66 * k)), t, font=f, fill=c["muted"], anchor="mm")
    lab = Image.new("RGBA", (int(f.getlength(yl.upper())) + 40, int(34 * k)), (0, 0, 0, 0))
    ImageDraw.Draw(lab).text((20, 4), yl.upper(), font=f, fill=c["muted"])
    return lab.rotate(90, expand=True)


def smooth(pts: list, steps: int = 14) -> list:
    """Courbe lissée (Catmull-Rom) passant par les points donnés."""
    if len(pts) < 3:
        return pts
    p = [pts[0]] + pts + [pts[-1]]
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for s in range(steps):
            t = s / steps
            out.append(tuple(0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t
                                    + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t
                                    + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t ** 3) for k in (0, 1)))
    return out + [pts[-1]]


def chart(spec: dict, c: dict, k: float = 1.0) -> Image.Image:
    kind = spec["chart"]
    h = int(spec.get("height", 700) * min(k, 1.3))
    if kind in ("dots", "compare"):
        h = 2400                      # recadré à la fin sur le contenu
    im = Image.new("RGBA", (W, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    fb, fs = font(SANS_B, int(26 * k)), font(SANS, int(22 * k))
    if kind in ("quadrant", "curve"):
        x0, y0, x1, y1 = MX + 60, 20, W - MX, h - int(84 * k)
        lab = _axes(d, c, x0, y0, x1, y1, spec.get("x", ""), spec.get("y", ""), k)
        im.alpha_composite(lab, (MX - 10, int((y0 + y1) / 2 - lab.height / 2)))
        X = lambda v: x0 + v * (x1 - x0)
        Y = lambda v: y1 - v * (y1 - y0)
        if kind == "quadrant":
            for q in range(0, int(x1 - x0), 18):
                d.line([x0 + q, Y(0.5), x0 + q + 8, Y(0.5)], fill=c["line"], width=2)
            for q in range(0, int(y1 - y0), 18):
                d.line([X(0.5), y0 + q, X(0.5), y0 + q + 8], fill=c["line"], width=2)
            for note in spec.get("corners", []):
                pos = {"tl": (X(0.03), Y(0.96), "la"), "br": (X(0.97), Y(0.04), "rd"),
                       "tr": (X(0.97), Y(0.96), "ra"), "bl": (X(0.03), Y(0.04), "ld")}[note["at"]]
                d.text(pos[:2], note["text"], font=fs, fill=c["muted"], anchor=pos[2])
            for p in spec["points"]:
                r = int((22 if p.get("strong") else 15) * k)
                cx, cy = X(p["x"]), Y(p["y"])
                d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ORANGE if p.get("strong") else c["fg"])
                anchor = p.get("anchor", "lm")
                dx = r + 14 if anchor[0] == "l" else -(r + 14)
                d.text((cx + dx, cy), p["label"], font=fb, fill=c["fg"], anchor=anchor)
        else:
            if spec.get("ref"):
                ref = spec["ref"]
                d.line([X(0), Y(ref["y0"]), X(1), Y(ref["y1"])], fill=c["line"], width=4)
                if ref.get("label_at") == "below-left":
                    d.text((X(0.06), Y(ref["y0"]) + int(14 * k)), ref["label"], font=fs, fill=c["muted"], anchor="la")
                else:
                    d.text((X(1), Y(ref["y1"]) - int(22 * k)), ref["label"], font=fs, fill=c["muted"], anchor="rb")
            pts = smooth([(X(x), Y(y)) for x, y in spec["points"]])
            if spec.get("gap") and spec.get("ref"):
                # zone surlignée entre la courbe et la ligne de référence (au-dessus de la ligne)
                ry = Y(spec["ref"]["y0"])
                layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
                ImageDraw.Draw(layer).polygon(pts + [(X(1), ry), (X(0), ry)], fill=MARK + "8c")
                layer.paste((0, 0, 0, 0), (0, int(ry), W, h))
                im.alpha_composite(layer)
                d = ImageDraw.Draw(im)
                d.line([X(0), ry, X(1), ry], fill=c["muted"], width=4)
            d.line(pts, fill=c["fg"], width=6, joint="curve")
            a = spec.get("note")
            if a:
                ax, ay = X(a["x"]), Y(a["y"])
                d.ellipse([ax - 16, ay - 16, ax + 16, ay + 16], fill=ORANGE)
                if ay - 150 * k >= 0:
                    d.line([ax, ay - 20, ax, ay - int(90 * k)], fill=c["fg"], width=2)
                    d.text((ax + 12, ay - int(152 * k)), a["title"], font=fb, fill=c["fg"])
                    d.text((ax + 12, ay - int(118 * k)), a["sub"], font=fs, fill=c["muted"])
                else:
                    d.line([ax + 20, ay, ax + 70, ay], fill=c["fg"], width=2)
                    d.text((ax + 84, ay - int(32 * k)), a["title"], font=fb, fill=c["fg"])
                    d.text((ax + 84, ay + 4), a["sub"], font=fs, fill=c["muted"])
            for xv, t in spec.get("ticks", []):
                d.text((X(xv), y1 + 14), t, font=fs, fill=c["muted"], anchor="ma")
    elif kind == "compare":
        y = 0
        fr_big, fb_big = font(SANS, int(29 * k)), font(SANS_B, int(29 * k))
        for g in spec["groups"]:
            lab = label(g["label"], c, size=int(23 * k))
            im.alpha_composite(lab, (0, y))
            y += int(52 * k)
            widest = max((fb_big if r.get("strong") else fr_big).getlength(r["text"]) for r in g["rows"])
            bar_max = max(60, min(460, int(CW - widest - 30)))
            for row in g["rows"]:
                bw = max(8, int(row["w"] * bar_max))
                bh = int(40 * k)
                d.rectangle([MX, y, MX + bw, y + bh], fill=c["fg"] if row.get("strong") else c["soft"])
                d.text((MX + bw + 24, y + bh / 2), row["text"], font=fb_big if row.get("strong") else fr_big,
                       fill=c["fg"], anchor="lm")
                y += int(66 * k)
            if g.get("caption"):
                cap = paragraph(g["caption"], int(25 * k), c, color=c["muted"])
                im.alpha_composite(cap, (0, y + 2))
                y += cap.height + int(10 * k)
            y += int(34 * k)
        im = im.crop((0, 0, W, y))
    elif kind == "dots":
        y = 0
        for row in spec["rows"]:
            lab = label(row["label"], c, size=int(23 * k))
            im.alpha_composite(lab, (0, y))
            y += int(52 * k)
            step, rr = 50 * k, 11 * k
            per = max(1, int((CW - 24) // step) + 1)
            for i in range(row["total"]):
                cx = MX + 12 + (i % per) * step
                cy = y + 12 * k + (i // per) * 46 * k
                filled = i >= row["total"] - row["filled"]
                d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=c["fg"] if filled else c["soft"])
            y += int(((row["total"] - 1) // per + 1) * 46 * k + 10)
            d.text((MX, y), row.get("caption", ""), font=fs, fill=c["muted"])
            y += int(70 * k)
        im = im.crop((0, 0, W, y))
    return im


# --- Vote : un message reçu, des réponses numérotées ------------------------------------

def _wrap(text: str, f, width: int) -> list[str]:
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if cur and f.getlength(t) > width:
            lines.append(cur)
            cur = w
        else:
            cur = t
    return lines + [cur]


def vote(spec: dict, c: dict, k: float = 1.0) -> Image.Image:
    f = font(SANS, int(min(29 * k, 44)))
    lh = int(f.size * 1.35)
    im = Image.new("RGBA", (W, 2000), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    y = 0
    if spec.get("incoming"):
        lines = _wrap(spec["incoming"], f, int(CW * 0.72))
        bw = max(f.getlength(l) for l in lines) + 56
        bh = len(lines) * lh + 34
        d.rounded_rectangle([MX, y, MX + bw, y + bh], radius=30, fill="#ecebe9" if c["bg"] == WHITE else "#2a2826")
        for i, l in enumerate(lines):
            d.text((MX + 28, y + 17 + i * lh), l, font=f, fill=c["fg"])
        y += bh + 40
    num = font(SERIF, int(f.size * 2.7))
    bx = MX + int(f.size * 2.6)          # début des cadres de réponse
    pad = int(f.size * 0.9)
    for i, opt in enumerate(spec["options"], 1):
        lines = _wrap(opt, f, W - MX - bx - 2 * pad)
        bh = len(lines) * lh + 34
        d.text((MX + 4, y + bh / 2 + 4), str(i), font=num, fill=ORANGE, anchor="lm")
        d.rounded_rectangle([bx, y, W - MX, y + bh], radius=22, outline=c["line"], width=2)
        for j, l in enumerate(lines):
            d.text((bx + pad, y + 17 + j * lh), l, font=f, fill=c["fg"])
        y += bh + 20
    return im.crop((0, 0, W, y - 20))


def _find_photo(path: str) -> Path | None:
    """Accepte le chemin tel quel, ou la même photo en .jpg / .jpeg / .png / .webp."""
    base = ROOT / path
    for cand in [base] + [base.with_suffix(s) for s in (".jpg", ".jpeg", ".png", ".webp")]:
        if cand.exists():
            return cand
    return None


def portrait(path: str, handle: str, width: int, ratio: float, c: dict) -> Image.Image:
    """Photo recadrée (centrée, un peu vers le haut), coins arrondis, @ en légende.
    Sans fichier : un cadre gris qui dit quelle photo déposer."""
    h = int(width * ratio)
    f = _find_photo(path)
    if f:
        im = Image.open(f).convert("RGB")
        s = max(width / im.width, h / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        left = (im.width - width) // 2
        top = int((im.height - h) * 0.3)
        im = im.crop((left, top, left + width, top + h)).convert("RGBA")
    else:
        im = Image.new("RGBA", (width, h), "#e9e7e5" if c["bg"] == WHITE else "#2a2826")
        d = ImageDraw.Draw(im)
        fs = font(SANS_SB, max(20, width // 18))
        for i, line in enumerate(["photo à déposer", Path(path).stem + ".jpg"]):
            d.text((width / 2, h / 2 + (i - 0.5) * fs.size * 1.5), line, font=fs, fill=GREY, anchor="mm")
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, width - 1, h - 1], radius=34, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def photo_block(b: dict, c: dict, k: float) -> Image.Image:
    width = int(min(b.get("width", 560) * k ** 0.3, CW))
    ph = portrait(b["photo"], b.get("handle", ""), width, b.get("ratio", 1.1), c)
    # rien sous la photo par défaut (retour du fondateur du 10/10/2026) ; "show_handle": true pour l'afficher
    lab = label(b.get("handle", ""), c, size=int(22 * min(k, 1.4)), align="center") if b.get("show_handle") and b.get("handle") else None
    hh = ph.height + (lab.height + 14 if lab else 0)
    out = Image.new("RGBA", (W, hh), (0, 0, 0, 0))
    out.alpha_composite(ph, ((W - ph.width) // 2, 0))
    if lab:
        out.alpha_composite(lab, (0, ph.height + 14))
    return out


def versus(people: list[dict], c: dict, k: float) -> Image.Image:
    """Deux visages côte à côte avec « vs » en serif orange entre les deux."""
    gap = 120
    width = (CW - gap) // 2
    ratio = 1.25
    a = portrait(people[0]["photo"], people[0].get("handle", ""), width, ratio, c)
    b2 = portrait(people[1]["photo"], people[1].get("handle", ""), width, ratio, c)
    fl = int(22 * min(k, 1.4))
    show = any(pp.get("show_handle") for pp in people)
    hh = a.height + (int(fl * 2.6) if show else 0)
    out = Image.new("RGBA", (W, hh), (0, 0, 0, 0))
    out.alpha_composite(a, (MX, 0))
    out.alpha_composite(b2, (W - MX - width, 0))
    d = ImageDraw.Draw(out)
    d.text((W / 2, a.height / 2), "vs", font=font(SERIF_I, 120), fill=ORANGE, anchor="mm")
    f = font(SANS_SB, fl)
    for x, pp in ((MX + width / 2, people[0]), (W - MX - width / 2, people[1])):
        if pp.get("show_handle"):
            d.text((x, a.height + fl * 1.3), pp.get("handle", "").upper(), font=f, fill=c["muted"], anchor="mm")
    return out


def chat(msgs: list[dict], c: dict, k: float = 1.0) -> Image.Image:
    """Bulles de conversation : le lead à gauche en gris, la réponse à droite en orange."""
    f = font(SANS, int(min(30 * k, 50)))
    lh = int(f.size * 1.35)
    im = Image.new("RGBA", (W, 2400), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    y = 0
    for m in msgs:
        mine = m.get("from") == "me"
        lines = _wrap(m["text"], f, int(CW * 0.74))
        bw = max(f.getlength(l) for l in lines) + 60
        bh = len(lines) * lh + 36
        x0 = W - MX - bw if mine else MX
        fill = ORANGE if mine else ("#ecebe9" if c["bg"] == WHITE else "#2a2826")
        d.rounded_rectangle([x0, y, x0 + bw, y + bh], radius=32, fill=fill)
        for i, l in enumerate(lines):
            d.text((x0 + 30, y + 18 + i * lh), l, font=f, fill=WHITE if mine else c["fg"])
        y += bh + 18
    return im.crop((0, 0, W, y - 18))


def numbered(items: list[str], c: dict, start: int = 1, size: int = 33) -> Image.Image:
    """Liste numérotée : chiffres en serif orange, texte parlé à droite."""
    num = font(SERIF, int(size * 2.5))
    ind = int(size * 2.9)
    parts = []
    for i, it in enumerate(items, start):
        p = paragraph(it, size, c, width=CW - ind)
        row = Image.new("RGBA", (W, max(p.height, int(size * 2.4))), (0, 0, 0, 0))
        row.alpha_composite(p, (ind, 0))
        ImageDraw.Draw(row).text((MX + 4, -int(size * 0.42)), str(i), font=num, fill=ORANGE)
        parts.append(row)
    h = sum(p.height for p in parts) + 30 * (len(parts) - 1)
    out = Image.new("RGBA", (W, h), (0, 0, 0, 0))
    y = 0
    for p in parts:
        out.alpha_composite(p, (0, y))
        y += p.height + 30
    return out


MONO = Path("/System/Library/Fonts/Menlo.ttc")


def code_block(spec: dict, c: dict, k: float = 1.0) -> Image.Image:
    """Bloc de code façon éditeur (carrousels tuto) : fenêtre sombre, 3 pastilles, nom du fichier,
    texte à chasse fixe ; les chaînes entre guillemets en orange."""
    f = font(MONO, int(min(24 * k, 34)))
    lh = int(f.size * 1.5)
    lines = spec["code"].split("\n")
    pad, bar = 34, 64
    w = CW
    h = bar + pad + len(lines) * lh + pad
    im = Image.new("RGBA", (W, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([MX, 0, MX + w, h], radius=28, fill="#17161a")
    for i, col in enumerate(("#ff5f57", "#febc2e", "#28c840")):
        d.ellipse([MX + 28 + i * 30, 24, MX + 46 + i * 30, 42], fill=col)
    if spec.get("file"):
        lf = font(SANS_M, 22)
        d.text((MX + w / 2 - lf.getlength(spec["file"]) / 2, 20), spec["file"], font=lf, fill="#8f8c94")
    y = bar + pad - 10
    for line in lines:
        x = MX + pad
        for part in re.split(r'("[^"]*")', line):
            if not part:
                continue
            col = "#ffa066" if part.startswith('"') else "#e8e6ea"
            d.text((x, y), part, font=f, fill=col)
            x += f.getlength(part)
        y += lh
    return im


def doc_card(spec: dict, c: dict, k: float = 1.0) -> Image.Image:
    """Carte « document » : la vraie phrase d'une source (conditions, README…), passages clés surlignés.
    {"doc": {"source": "WhatsApp Terms of Service", "text": "...", "marks": ["auto-messaging"]}}"""
    f = font(SANS, int(min(31 * k, 42)))
    fb = font(SANS_SB, int(min(31 * k, 42)))
    lf = font(SANS_SB, int(min(20 * k, 26)))
    lh = int(f.size * 1.45)
    pad, w = 46, CW
    words = spec["text"].split()
    marked = [False] * len(words)
    low = [x.lower().strip('.,"…()') for x in words]
    for m in spec.get("marks", []):
        mw = [x.lower().strip('.,"…()') for x in m.split()]
        for i in range(len(low) - len(mw) + 1):
            if low[i:i + len(mw)] == mw:
                for j in range(i, i + len(mw)):
                    marked[j] = True
    lines, cur, cw = [], [], 0.0
    for wd, mk in zip(words, marked):
        ww = (fb if mk else f).getlength(wd)
        sp = f.getlength(" ") if cur else 0
        if cur and cw + sp + ww > w - 2 * pad:
            lines.append(cur)
            cur, cw, sp = [], 0.0, 0
        cur.append((wd, mk, ww))
        cw += sp + ww
    lines.append(cur)
    head = 70
    h = pad + head + len(lines) * lh + pad - 8
    im = Image.new("RGBA", (W, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([MX, 0, MX + w, h], radius=30, fill=WHITE, outline="#e4e1dd", width=2)
    # icône de page (coin plié) et nom de la source
    x0, y0 = MX + pad, pad - 4
    d.polygon([(x0, y0), (x0 + 22, y0), (x0 + 32, y0 + 10), (x0 + 32, y0 + 38), (x0, y0 + 38)], fill="#efedea", outline="#cfcbc6")
    d.line([(x0 + 22, y0), (x0 + 22, y0 + 10), (x0 + 32, y0 + 10)], fill="#cfcbc6", width=2)
    d.text((x0 + 50, y0 + 6), spec["source"].upper(), font=lf, fill="#8a8784")
    y = pad + head
    sp = f.getlength(" ")
    for line in lines:
        x = MX + pad
        for i, (wd, mk, ww) in enumerate(line):
            if mk:
                nxt = i + 1 < len(line) and line[i + 1][1]
                d.rectangle([x - 4, y + int(f.size * 0.18), x + ww + (sp if nxt else 0) + 4, y + int(f.size * 1.18)], fill="#ffd9c7")
            x += ww + sp
        x = MX + pad
        for wd, mk, ww in line:
            d.text((x, y), wd, font=fb if mk else f, fill=INK)
            x += ww + sp
        y += lh
    return im


def route(rows: list, c: dict, k: float = 1.0) -> Image.Image:
    """Schéma de tri : chaque type de lead → où il va. La 1re ligne (le bon lead) est en orange.
    {"route": [["ready to buy", "your calendar"], ["not ready yet", "a free guide"]]}"""
    f = font(SANS_M, int(min(30 * k, 40)))
    ph, gap = int(f.size * 2.3), int(f.size * 0.9)
    h = len(rows) * ph + (len(rows) - 1) * gap
    im = Image.new("RGBA", (W, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    lw = max(f.getlength(a) for a, _ in rows) + 64
    rw = max(f.getlength(b) for _, b in rows) + 64
    ax0, ax1 = MX + lw + 26, W - MX - rw - 26
    for i, (a, b) in enumerate(rows):
        y = i * (ph + gap)
        best = i == 0
        grey = "#f1efec" if c["bg"] == WHITE else "#2a2826"
        d.rounded_rectangle([MX, y, MX + lw, y + ph], radius=ph // 2, fill=grey)
        d.text((MX + 32, y + (ph - f.size) / 2 - 4), a, font=f, fill=c["fg"])
        cy = y + ph / 2
        col = ORANGE if best else c["muted"]
        d.line([(ax0, cy), (ax1 - 10, cy)], fill=col, width=4)
        d.polygon([(ax1, cy), (ax1 - 18, cy - 11), (ax1 - 18, cy + 11)], fill=col)
        x1 = W - MX - rw
        if best:
            d.rounded_rectangle([x1, y, W - MX, y + ph], radius=ph // 2, fill=ORANGE)
            d.text((x1 + 32, y + (ph - f.size) / 2 - 4), b, font=f, fill=WHITE)
        else:
            d.rounded_rectangle([x1, y, W - MX, y + ph], radius=ph // 2, outline=c["line"], width=3)
            d.text((x1 + 32, y + (ph - f.size) / 2 - 4), b, font=f, fill=c["fg"])
    return im


def cta_block(spec: dict, c: dict, k: float = 1.0) -> Image.Image:
    """Slide CTA (retour du 19/10/2026 : « vraiment clean, que ça donne envie de commenter ») :
    « comment SETTY » en très grand, la promesse en une ligne, une barre de commentaire avec le mot déjà tapé."""
    kw = spec.get("keyword", "SETTY")
    title = serif_title(f"comment *{kw}*", int(min(150 * k, 190)), c)
    line = paragraph(spec["line"], int(min(34 * k, 46)), c, color=c["muted"], align="center")
    bf = font(SANS_SB, int(min(34 * k, 44)))
    pf = font(SANS_SB, int(min(30 * k, 38)))
    bh = int(bf.size * 2.9)
    bar = Image.new("RGBA", (W, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(bar)
    fill = WHITE if c["bg"] == WHITE else "#1c1b19"
    d.rounded_rectangle([MX, 0, W - MX, bh], radius=bh // 2, fill=fill, outline="#dedad5" if c["bg"] == WHITE else "#3a3835", width=2)
    r = int(bh * 0.31)
    ax = MX + 22 + r
    d.ellipse([ax - r, bh / 2 - r, ax + r, bh / 2 + r], fill="#ffb48f")
    tx = ax + r + 26
    d.text((tx, (bh - bf.size) / 2 - 6), kw, font=bf, fill=c["fg"])
    cx = tx + bf.getlength(kw) + 6
    d.line([(cx, bh * 0.3), (cx, bh * 0.7)], fill=ORANGE, width=4)
    post = "Post"
    d.text((W - MX - 36 - pf.getlength(post), (bh - pf.size) / 2 - 5), post, font=pf, fill=ORANGE)
    parts = [title, line, bar]
    gaps = [int(26 * k), int(70 * k)]
    h = sum(p.height for p in parts) + sum(gaps)
    out = Image.new("RGBA", (W, h), (0, 0, 0, 0))
    y = 0
    for p, g in zip(parts, gaps + [0]):
        out.alpha_composite(p, (0, y))
        y += p.height + g
    return out


# --- Habillage premium (retours du fondateur du 19/10/2026) -----------------------------
# « Pas de petits motifs qui font gamin, du super design » : quadrillage fin qui s'efface au centre,
# une lueur orange douce par slide, repères de coupe aux coins, léger grain. Rien ne touche le texte.

import random  # noqa: E402

from PIL import ImageChops, ImageFilter  # noqa: E402

GRID = 54
_FADE = None


def _fade_mask() -> Image.Image:
    """Masque radial : le quadrillage est presque invisible au centre et plein sur les bords."""
    global _FADE
    if _FADE is None:
        small = Image.new("L", (W // 6, H // 6))
        cx, cy = small.width / 2, small.height / 2
        rmax = (cx ** 2 + cy ** 2) ** 0.5
        small.putdata([int(255 * min(1.0, max(0.18, ((((x - cx) ** 2 + (y - cy) ** 2) ** 0.5) / rmax) ** 1.6 * 1.35)))
                       for y in range(small.height) for x in range(small.width)])
        _FADE = small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(4))
    return _FADE


def decorate(img: Image.Image, c: dict, rnd: random.Random, index: int, cover: bool) -> None:
    dark = c["bg"] != WHITE
    # 1. la lueur : un grand dégradé orange flou qui déborde d'un coin (le coin tourne d'une slide à l'autre)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    corners = [(W + 60, -120), (-140, H + 80), (W + 80, H + 60), (-120, -100)]
    gx, gy = corners[index % 4]
    r = 560 if cover else 470
    gd.ellipse([gx - r, gy - r, gx + r, gy + r], fill=(255, 136, 77, 120 if dark else 70))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(170)))
    # 2. le quadrillage, effacé au centre
    lines = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lines)
    col = (255, 255, 255, 26) if dark else (13, 12, 10, 22)
    for x in range(GRID // 2, W, GRID):
        ld.line([(x, 0), (x, H)], fill=col, width=1)
    for y in range(GRID // 2, H, GRID):
        ld.line([(0, y), (W, y)], fill=col, width=1)
    a = ImageChops.multiply(lines.split()[-1], _fade_mask())
    lines.putalpha(a)
    img.alpha_composite(lines)
    # 3. repères de coupe fins aux quatre coins
    d = ImageDraw.Draw(img)
    mc = "#5a5753" if dark else "#bdb9b4"
    m, L = 40, 30
    for x, y, sx, sy in [(m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)]:
        d.line([(x, y), (x + sx * L, y)], fill=mc, width=2)
        d.line([(x, y), (x, y + sy * L)], fill=mc, width=2)
    # 4. un léger grain, comme une impression
    noise = Image.effect_noise((W, H), 28).point(lambda v: 128 + (v - 128) // 2)
    grain = Image.merge("RGBA", (noise, noise, noise, Image.new("L", (W, H), 10 if not dark else 14)))
    img.alpha_composite(grain)


LOGOS = ROOT / "CONTENU" / "05_BANQUE_IMAGES" / "logos"


def place_logo(img: Image.Image, spec: dict) -> Image.Image | None:
    """Logo 3D d'un outil (retour du 19/10/2026) : énorme, il sort d'un coin et passe derrière le texte.
    {"name": "claude", "corner": "bl", "size": 760, "angle": -12}. Renvoie son masque (pour le halo du texte)."""
    path = LOGOS / f"{spec['name']}.png"
    if not path.exists():
        print(f"  logo manquant : {path.relative_to(ROOT)} (à fournir par le fondateur)")
        return None
    s = spec.get("size", 760)
    logo = Image.open(path).convert("RGBA").resize((s, s), Image.LANCZOS)
    if spec.get("angle"):
        logo = logo.rotate(spec["angle"], resample=Image.BICUBIC, expand=True)
    lw, lh = logo.size
    out = spec.get("out", 0.3)
    x, y = {"bl": (-out * lw, H - (1 - out) * lh), "br": (W - (1 - out) * lw, H - (1 - out) * lh),
            "tl": (-out * lw, -out * lh), "tr": (W - (1 - out) * lw, -out * lh)}[spec.get("corner", "bl")]
    x, y = int(x), int(y)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh = Image.new("RGBA", logo.size, (0, 0, 0, 0))
    sh.putalpha(logo.split()[-1].point(lambda v: v * 0.28))
    layer.alpha_composite(sh.filter(ImageFilter.GaussianBlur(28)), (x + 18, y + 30))
    layer.alpha_composite(logo, (x, y))
    img.alpha_composite(layer)
    return layer.split()[-1]


def halo(img: Image.Image, parts_layer: Image.Image, logo_mask: Image.Image, bg: str) -> None:
    """Halo de la couleur du fond autour des lettres, seulement là où elles passent sur le logo : le texte reste net."""
    a = parts_layer.split()[-1].filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(14))
    a = ImageChops.multiply(a, logo_mask.filter(ImageFilter.MaxFilter(9)))
    lay = Image.new("RGBA", (W, H), bg)
    lay.putalpha(a.point(lambda v: min(255, int(v * 1.1))))
    img.alpha_composite(lay)


# --- Montage d'une slide ------------------------------------------------------------

BOOST = 1.0   # plafonds de taille x BOOST : 1,35 pour le style « grid » (peu de texte, retour du 19/10/2026)


def block_image(b: dict, c: dict, k: float = 1.0) -> Image.Image:
    """Dessine un bloc ; k agrandit le texte (et les images) quand la slide a de la place."""
    z = lambda v, cap=None: int(min(v * k, cap * BOOST) if cap else v * k)
    if "title" in b:
        return serif_title(b["title"], z(b.get("size", 118), 176), c)
    if "heading" in b:
        return serif_title(b["heading"], z(b.get("size", 86), 140), c)
    if "lead" in b:
        return paragraph(b["lead"], z(b.get("size", 39), 64), c, bold_all=True, align=b.get("align", "left"))
    if "text" in b:
        return paragraph(b["text"], z(b.get("size", 36), 62), c, align=b.get("align", "left"))
    if "label" in b:
        return label(b["label"], c, size=z(23, 34), align=b.get("align", "left"))
    if "caption" in b:
        return paragraph(b["caption"], z(25, 38), c, color=c["muted"], align=b.get("align", "left"))
    # le texte d'abord : les images ne grandissent qu'à peine, les graphiques grossissent leurs légendes
    zi = lambda v, cap: int(min(v * k ** 0.35, cap))
    if "image" in b:
        return image_block({**b, "width": zi(b.get("width", 760), CW)})
    if "collage" in b:
        return collage(b["collage"], zi(b.get("width", 520), 600))
    if "chart" in b:
        return chart(b, c, min(k, 1.6))
    if "vote" in b:
        return vote(b["vote"], c, k)
    if "chat" in b:
        return chat(b["chat"], c, k)
    if "photo" in b:
        return photo_block(b, c, k)
    if "versus" in b:
        return versus(b["versus"], c, k)
    if "list" in b:
        return numbered(b["list"], c, b.get("start", 1), z(b.get("size", 36), 60))
    if "code" in b:
        return code_block(b, c, min(k, 1.4))
    if "doc" in b:
        return doc_card(b["doc"], c, min(k, 1.4))
    if "route" in b:
        return route(b["route"], c, min(k, 1.4))
    if "cta" in b:
        return cta_block(b["cta"], c, min(k, 1.3))
    if "spacer" in b:
        return Image.new("RGBA", (W, z(b["spacer"])), (0, 0, 0, 0))
    raise ValueError(f"bloc inconnu : {b}")


MARGIN = 104                      # marge haute et basse minimale
SCALES = [x / 100 for x in range(200, 84, -5)]   # 2,00 → 0,85


def compose(s: dict, rnd: random.Random | None = None, cover: bool = False, index: int = 0) -> Image.Image:
    """Choisit la plus grande taille de texte qui tient : une slide n'a jamais de grand vide
    (retour du fondateur du 10/10/2026 : « écris plus gros, ça se lit mieux »).
    Avec rnd (fiche "style": "grid"), le fond quadrillé et les éléments graphiques passent sous le contenu."""
    c = colors(s.get("bg", "white"))
    avail = H - 2 * MARGIN
    for k in ([s["scale"]] if "scale" in s else SCALES):
        parts = [block_image(b, c, k) for b in s["blocks"]]
        gaps = [int(s.get("gap", GAP) * max(1.0, k ** 0.5))] * (len(parts) - 1)
        total = sum(p.height for p in parts) + sum(gaps)
        if total <= avail:
            break
    else:
        raise SystemExit(f"Slide trop chargée ({total} px pour {avail}) : {s['blocks'][0]}")
    y = MARGIN if s.get("valign") == "top" else (H - total) // 2
    img = Image.new("RGBA", (W, H), c["bg"])
    if rnd is not None:
        decorate(img, c, rnd, index, cover)
    logo_mask = place_logo(img, s["logo"]) if s.get("logo") else None
    text = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for p, g in zip(parts, gaps + [0]):
        text.alpha_composite(p, (0, y))
        y += p.height + g
    if logo_mask is not None:
        halo(img, text, logo_mask, c["bg"])
    img.alpha_composite(text)
    return img.convert("RGB")


FORBIDDEN = ("—", "–")


def check(post: dict) -> list[str]:
    blob = json.dumps(post, ensure_ascii=False)
    issues = [f"tiret interdit « {d} »" for d in FORBIDDEN if d in blob]
    if "ManyChat" in blob:
        issues.append("écrire « Manychat »")
    if "alternative" in blob.lower():
        issues.append("jamais « alternative »")
    return issues


def render(path: Path) -> list[Path]:
    post = json.loads(path.read_text())
    issues = check(post)
    if issues:
        raise SystemExit("Fiche refusée : " + ", ".join(issues))
    out = []
    for old in path.parent.glob("slide-*.png"):
        old.unlink()
    grid = post.get("style") == "grid"
    global BOOST
    BOOST = 1.35 if grid else 1.0
    for i, s in enumerate(post["slides"], 1):
        p = path.parent / f"slide-{i:02d}.png"
        rnd = random.Random(f"{path.parent.name}-{i}") if grid else None
        compose(s, rnd, cover=(i == 1), index=i - 1).save(p, optimize=True)
        out.append(p)
    tw, th = 300, 375
    sheet = Image.new("RGB", (tw * len(out) + 16 * (len(out) + 1), th + 32), "#cfcdca")
    for i, p in enumerate(out):
        sheet.paste(Image.open(p).resize((tw, th)), (16 + i * (tw + 16), 16))
    sheet.save(path.parent / "apercu.png", optimize=True)
    return out


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    for p in render(Path(sys.argv[1])):
        print(p)
