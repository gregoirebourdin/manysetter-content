"""Compose les slides d'un carrousel ManySetter (1080 x 1350) à partir d'une fiche JSON.

Usage :
    python3 CONTENU/06_GABARITS/slides.py CONTENU/07_PRET_A_PUBLIER/<id>/post.json

Écrit slide-01.png, slide-02.png… et apercu.png (planche de toutes les slides)
dans le dossier de la fiche. Les types de slides et leurs champs sont décrits
dans CONTENU/06_GABARITS/README.md.

Dans un titre, *ces mots* sont soulignés en orange (1 à 3 mots, pas sur chaque slide).
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
MARGIN_X = 96
TOP = 120
BOTTOM = 120
CONTENT_W = W - 2 * MARGIN_X

FONTS = Path(__file__).resolve().parent / "fonts"
HEADING = FONTS / "nohemi" / "Nohemi-SemiBold.woff2"
HEADING_MEDIUM = FONTS / "nohemi" / "Nohemi-Medium.woff2"
BODY = FONTS / "inter" / "Inter-Regular.otf"
BODY_MEDIUM = FONTS / "inter" / "Inter-Medium.otf"
BODY_SEMIBOLD = FONTS / "inter" / "Inter-SemiBold.otf"

# Jetons du site (oklch convertis en hex), voir charte.md.
INK = {
    0: "#ffffff", 50: "#faf9f8", 100: "#f5f3f2", 200: "#e6e5e3", 300: "#d7d4d2",
    400: "#a3a09d", 500: "#76736f", 600: "#585552", 700: "#42403c",
    800: "#2a2825", 900: "#1a1816", 950: "#0d0c0a",
}
BRAND = {
    50: "#fff7ef", 100: "#ffead8", 200: "#ffd4b4", 300: "#ffb283", 400: "#ff884d",
    500: "#ff611d", 600: "#e64b15", 700: "#bc3a17", 800: "#943016",
}

THEMES = {
    "light": {"bg": INK[50], "fg": INK[950], "muted": INK[500], "body": INK[700],
              "card": INK[0], "line": INK[200], "incoming": INK[200], "incoming_fg": INK[950]},
    "dark": {"bg": INK[950], "fg": INK[0], "muted": INK[400], "body": INK[300],
             "card": INK[900], "line": INK[800], "incoming": INK[800], "incoming_fg": INK[0]},
}

_font_cache: dict[tuple[Path, int], ImageFont.FreeTypeFont] = {}


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    key = (path, size)
    if key not in _font_cache:
        _font_cache[key] = ImageFont.truetype(str(path), size)
    return _font_cache[key]


# --- Texte riche : mots soulignés et retour à la ligne -----------------------

def tokens(text: str) -> list[tuple[str, bool]]:
    """Découpe en mots, chaque mot marqué souligné ou non (*...*)."""
    out: list[tuple[str, bool]] = []
    for i, part in enumerate(re.split(r"\*(.+?)\*", text)):
        words = part.split()
        # Une ponctuation collée juste après *mots* reste collée au mot souligné.
        if words and out and part[:1] not in (" ", "\n") and i % 2 == 0:
            prev, hl = out.pop()
            out.append((prev + words.pop(0), hl))
        for word in words:
            out.append((word, i % 2 == 1))
    return out


TRAILING_PUNCT = ".,!?;:"


def wrap(text: str, f: ImageFont.FreeTypeFont, max_w: int) -> list[list[tuple[str, bool]]]:
    lines: list[list[tuple[str, bool]]] = []
    for paragraph in text.split("\n"):
        line: list[tuple[str, bool]] = []
        for word, hl in tokens(paragraph):
            candidate = " ".join(w for w, _ in line + [(word, hl)])
            if line and f.getlength(candidate) > max_w:
                lines.append(line)
                line = [(word, hl)]
            else:
                line.append((word, hl))
        lines.append(line)
    return lines


def text_block_height(lines, f, leading: float) -> int:
    return int(len(lines) * f.size * leading)


def draw_lines(d: ImageDraw.ImageDraw, lines, f, x: int, y: int, color: str,
               leading: float, align: str = "left", width: int = CONTENT_W) -> int:
    space = f.getlength(" ")
    for line in lines:
        line_w = sum(f.getlength(w) for w, _ in line) + space * max(len(line) - 1, 0)
        cx = x + (width - line_w) / 2 if align == "center" else x
        for j, (word, hl) in enumerate(line):
            ww = f.getlength(word)
            if hl:
                # Soulignement orange, sous la ligne de base, sans la ponctuation finale.
                ascent, _ = f.getmetrics()
                bar_y = y + ascent + int(f.size * 0.06)
                extend = space if j < len(line) - 1 and line[j + 1][1] else 0
                bar_w = f.getlength(word.rstrip(TRAILING_PUNCT)) if not extend else ww
                d.rounded_rectangle([cx, bar_y, cx + bar_w + extend, bar_y + max(8, f.size // 9)],
                                    radius=4, fill=BRAND[500])
            d.text((cx, y), word, font=f, fill=color)
            cx += ww + space
        y += int(f.size * leading)
    return y


# --- Éléments communs ---------------------------------------------------------

def counter(d, t, index: int, total: int):
    f = font(BODY_MEDIUM, 28)
    label = f"{index}/{total}"
    d.text((W - MARGIN_X - f.getlength(label), 64), label, font=f, fill=t["muted"])


def accent(t) -> str:
    return BRAND[600] if t is THEMES["light"] else BRAND[400]


def kicker(d, t, text: str, y: int, k: float) -> int:
    f = font(BODY_SEMIBOLD, round(30 * k))
    d.text((MARGIN_X, y), text.upper(), font=f, fill=accent(t))
    return y + round(66 * k)


def title(d, t, text: str, y: int, size: int, leading: float = 1.12) -> int:
    f = font(HEADING, size)
    return draw_lines(d, wrap(text, f, CONTENT_W), f, MARGIN_X, y, t["fg"], leading)


def paragraph(d, t, text: str, y: int, size: int, color_key: str = "body", leading: float = 1.42,
              x: int = MARGIN_X, width: int = CONTENT_W) -> int:
    f = font(BODY, size)
    return draw_lines(d, wrap(text, f, width), f, x, y, t[color_key], leading)


def bubble(d, t, text: str, side: str, y: int, size: int) -> int:
    f = font(BODY, size)
    max_w = int(CONTENT_W * 0.76)
    pad_x, pad_y = round(size * 0.95), round(size * 0.66)
    lead = 1.32
    lines = wrap(text, f, max_w - 2 * pad_x)
    widest = max((sum(f.getlength(w) for w, _ in ln) + f.getlength(" ") * (len(ln) - 1)) for ln in lines)
    bw = int(widest + 2 * pad_x)
    bh = int(text_block_height(lines, f, lead) + 2 * pad_y - f.size * (lead - 1))
    if side == "lead":
        x0, fill, fg = MARGIN_X, t["incoming"], t["incoming_fg"]
    else:
        x0, fill, fg = W - MARGIN_X - bw, BRAND[500], INK[0]
    d.rounded_rectangle([x0, y, x0 + bw, y + bh], radius=round(size * 1.05), fill=fill)
    draw_lines(d, lines, f, x0 + pad_x, y + pad_y - 4, fg, lead)
    return y + bh


# --- Types de slides ------------------------------------------------------------
# Chaque type dessine son contenu à partir de y = 0 sur une toile haute, avec un
# facteur d'échelle k. render() choisit le plus grand k qui tient dans la zone
# utile, puis centre le bloc verticalement (sauf notes, aligné en haut).

def slide_hook(d, t, s, k):
    y = 0
    if s.get("kicker"):
        y = kicker(d, t, s["kicker"], y, k)
    y = title(d, t, s["title"], y, round(100 * k))
    if s.get("sub"):
        y = paragraph(d, t, s["sub"], y + round(40 * k), round(42 * k))
    return y


def slide_text(d, t, s, k):
    y = 0
    if s.get("kicker"):
        y = kicker(d, t, s["kicker"], y, k)
    y = title(d, t, s["title"], y, round(76 * k), 1.14)
    if s.get("body"):
        y = paragraph(d, t, s["body"], y + round(40 * k), round(42 * k))
    return y


def slide_list(d, t, s, k):
    y = 0
    if s.get("kicker"):
        y = kicker(d, t, s["kicker"], y, k)
    y = title(d, t, s["title"], y, round(70 * k), 1.14) + round(44 * k)
    size = round(42 * k)
    indent = round(86 * k)
    for n, item in enumerate(s["items"], 1):
        if s.get("style") == "checks":
            d.text((MARGIN_X, y), "✓", font=font(BODY_SEMIBOLD, size), fill=BRAND[500])
        else:
            d.text((MARGIN_X, y), str(n), font=font(HEADING, round(size * 1.05)), fill=BRAND[500])
        y = paragraph(d, t, item, y, size, leading=1.34, x=MARGIN_X + indent, width=CONTENT_W - indent)
        y += round(32 * k)
    return y


def slide_notes(d, t, s, k):
    """Capture lo-fi façon appli Notes (fond blanc forcé par render)."""
    y = 0
    d.text((MARGIN_X - 30, y), "‹ Notes", font=font(BODY_MEDIUM, round(34 * k)), fill=BRAND[500])
    y += round(100 * k)
    ft = font(BODY_SEMIBOLD, round(58 * k))
    y = draw_lines(d, wrap(s["title"], ft, CONTENT_W), ft, MARGIN_X - 30, y, INK[950], 1.2) + round(30 * k)
    fi = font(BODY, round(42 * k))
    for item in s["items"]:
        y = draw_lines(d, wrap("- " + item, fi, CONTENT_W + 30), fi, MARGIN_X - 30, y, INK[900], 1.36)
        y += round(16 * k)
    return y


def slide_dm(d, t, s, k):
    y = 0
    if s.get("label"):
        d.text((MARGIN_X, y), s["label"], font=font(BODY_MEDIUM, round(28 * k)), fill=t["muted"])
        y += round(60 * k)
    name = s.get("contact", "Lead")
    av = round(76 * k)
    d.ellipse([MARGIN_X, y, MARGIN_X + av, y + av], fill=BRAND[100])
    fi = font(HEADING_MEDIUM, round(36 * k))
    initial = name[0].upper()
    d.text((MARGIN_X + av / 2 - fi.getlength(initial) / 2, y + av * 0.22), initial, font=fi, fill=BRAND[700])
    d.text((MARGIN_X + av + 24, y + 2), name, font=font(BODY_SEMIBOLD, round(34 * k)), fill=t["fg"])
    d.text((MARGIN_X + av + 24, y + round(46 * k)), s.get("channel", "Instagram"),
           font=font(BODY, round(26 * k)), fill=t["muted"])
    y += av + round(40 * k)
    d.line([MARGIN_X, y, W - MARGIN_X, y], fill=t["line"], width=2)
    y += round(44 * k)
    for msg in s["messages"]:
        if msg.get("note"):
            fn = font(BODY_MEDIUM, round(28 * k))
            d.text(((W - fn.getlength(msg["note"])) / 2, y), msg["note"], font=fn, fill=t["muted"])
            y += round(64 * k)
            continue
        y = bubble(d, t, msg["text"], msg["from"], y, round(38 * k)) + round(22 * k)
    if s.get("caption"):
        y = title(d, t, s["caption"], y + round(40 * k), round(52 * k), 1.16)
    return y


def slide_vote(d, t, s, k):
    y = 0
    if s.get("kicker"):
        y = kicker(d, t, s["kicker"], y, k)
    y = title(d, t, s["title"], y, round(64 * k), 1.14) + round(28 * k)
    y = bubble(d, t, s["incoming"], "lead", y, round(38 * k)) + round(40 * k)
    size = round(37 * k)
    fo = font(BODY, size)
    fn = font(HEADING, round(52 * k))
    indent = round(104 * k)
    for n, option in enumerate(s["options"], 1):
        lines = wrap(option, fo, CONTENT_W - indent - 40)
        h = text_block_height(lines, fo, 1.3) + round(48 * k)
        d.rounded_rectangle([MARGIN_X, y, W - MARGIN_X, y + h], radius=round(28 * k),
                            fill=t["card"], outline=t["line"], width=2)
        d.text((MARGIN_X + round(34 * k), y + h / 2), str(n), font=fn, fill=BRAND[500], anchor="lm")
        draw_lines(d, lines, fo, MARGIN_X + indent, y + round(24 * k), t["body"], 1.3)
        y += h + round(18 * k)
    if s.get("footer"):
        ff = font(BODY_SEMIBOLD, round(36 * k))
        d.text((MARGIN_X, y + round(20 * k)), s["footer"], font=ff, fill=t["fg"])
        y += round(20 * k) + ff.size
    return y


def slide_cta(d, t, s, k):
    y = title(d, t, s["title"], 0, round(84 * k)) + round(56 * k)
    if s.get("keyword"):
        fl = font(BODY_MEDIUM, round(42 * k))
        fk = font(HEADING, round(66 * k))
        pill_h = round(100 * k)
        d.text((MARGIN_X, y + pill_h / 2), "Comment", font=fl, fill=t["body"], anchor="lm")
        x = MARGIN_X + fl.getlength("Comment") + 24
        pw = fk.getlength(s["keyword"]) + round(76 * k)
        d.rounded_rectangle([x, y, x + pw, y + pill_h], radius=pill_h // 2, fill=BRAND[500])
        d.text((x + pw / 2, y + pill_h / 2), s["keyword"], font=fk, fill=INK[0], anchor="mm")
        y += pill_h + round(50 * k)
    if s.get("body"):
        y = paragraph(d, t, s["body"], y, round(42 * k))
    if s.get("button"):
        # CTA « lien en bio » : un bouton comme sur le site, puis la précision en petit.
        y += round(44 * k)
        fb = font(BODY_SEMIBOLD, round(40 * k))
        pill_h = round(96 * k)
        pw = fb.getlength(s["button"]) + round(96 * k)
        d.rounded_rectangle([MARGIN_X, y, MARGIN_X + pw, y + pill_h], radius=pill_h // 2, fill=BRAND[500])
        d.text((MARGIN_X + pw / 2, y + pill_h / 2), s["button"], font=fb, fill=INK[0], anchor="mm")
        y += pill_h + round(26 * k)
        note = s.get("button_note", "Link in bio")
        fn = font(BODY_MEDIUM, round(30 * k))
        d.text((MARGIN_X, y), note, font=fn, fill=t["muted"])
        y += fn.size
    return y


def signature(d, t, s):
    """Signature discrète en bas de la dernière slide : le produit arrive en dernier."""
    fw = font(HEADING, 40)
    y = H - BOTTOM - 20
    d.text((MARGIN_X, y), "ManySetter", font=fw, fill=t["fg"])
    d.text((MARGIN_X + fw.getlength("ManySetter") + 20, y + 12),
           s.get("signature", "The AI setter for Manychat"), font=font(BODY, 26), fill=t["muted"])


RENDERERS = {
    "hook": slide_hook, "text": slide_text, "list": slide_list, "notes": slide_notes,
    "dm": slide_dm, "vote": slide_vote, "cta": slide_cta,
}
TOP_ALIGNED = {"notes"}
MAX_SCALE = {"hook": 1.1, "notes": 1.0}


def photo_background(path: Path) -> Image.Image:
    """Photo recadrée en 1080 x 1350, assombrie vers le bas pour porter le texte."""
    photo = Image.open(path).convert("RGB")
    scale = max(W / photo.width, H / photo.height)
    photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
    left, top = (photo.width - W) // 2, (photo.height - H) // 2
    photo = photo.crop((left, top, left + W, top + H)).convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    start = int(H * 0.38)
    for y in range(start, H):
        alpha = int(235 * ((y - start) / (H - start)) ** 0.8)
        sd.line([(0, y), (W, y)], fill=(13, 12, 10, alpha))
    return Image.alpha_composite(photo, shade)


def compose(s: dict, theme: str, base_dir: Path) -> Image.Image:
    photo = s.get("photo")
    if photo:
        theme = "dark"  # texte clair sur le dégradé sombre
    t = THEMES[theme]
    bg = INK[0] if s["type"] == "notes" else t["bg"]
    available = H - TOP - BOTTOM - (110 if s["type"] == "cta" else 0)
    if photo:
        available = int(H * 0.5) - BOTTOM // 2
    k = MAX_SCALE.get(s["type"], 1.3)
    while True:
        # Toile transparente : le texte se pose aussi bien sur un aplat que sur une photo.
        canvas = Image.new("RGBA", (W, 3 * H), (0, 0, 0, 0))
        used = RENDERERS[s["type"]](ImageDraw.Draw(canvas), t, s, k)
        if used <= available or k <= 0.55:
            break
        k = round(k - 0.04, 2)
    if photo:
        img = photo_background(base_dir / photo)
        top = H - BOTTOM - used
    else:
        img = Image.new("RGBA", (W, H), bg)
        top = TOP - 30 if s["type"] in TOP_ALIGNED else TOP + max(0, (available - used) // 2)
    block = canvas.crop((0, 0, W, used))
    img.alpha_composite(block, (0, top))
    img = img.convert("RGB")
    if s["type"] == "cta":
        signature(ImageDraw.Draw(img), t, s)
    return img


FORBIDDEN = ("—", "–")  # tirets cadratin et demi-cadratin


def check_copy(post: dict) -> list[str]:
    """Contrôles de la trame qualité qu'un script peut faire."""
    problems = []
    blob = json.dumps(post, ensure_ascii=False)
    for dash in FORBIDDEN:
        if dash in blob:
            problems.append(f"tiret interdit « {dash} » dans la fiche")
    if "ManyChat" in blob:
        problems.append("écrire « Manychat », jamais « ManyChat »")
    if "alternative" in blob.lower():
        problems.append("le mot « alternative » : ManySetter n'est jamais présenté comme une alternative à Manychat")
    return problems


def render(post_path: Path) -> list[Path]:
    post = json.loads(post_path.read_text())
    problems = check_copy(post)
    if problems:
        sys.exit("Fiche refusée :\n- " + "\n- ".join(problems))
    theme = post.get("theme", "light")
    out_dir = post_path.parent
    slides = post["slides"]
    paths = []
    for i, s in enumerate(slides, 1):
        img = compose(s, s.get("theme", theme), out_dir)
        if s["type"] != "notes" and len(slides) > 1:
            counter(ImageDraw.Draw(img), THEMES["dark" if s.get("photo") else s.get("theme", theme)], i, len(slides))
        p = out_dir / f"slide-{i:02d}.png"
        img.save(p, optimize=True)
        paths.append(p)
    # Planche d'aperçu pour la revue.
    thumb_w = 360
    thumb_h = int(thumb_w * H / W)
    sheet = Image.new("RGB", (thumb_w * len(paths) + 20 * (len(paths) + 1), thumb_h + 40), INK[200])
    for i, p in enumerate(paths):
        sheet.paste(Image.open(p).resize((thumb_w, thumb_h)), (20 + i * (thumb_w + 20), 20))
    sheet.save(out_dir / "apercu.png", optimize=True)
    return paths


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    for path in render(Path(sys.argv[1])):
        print(path)
