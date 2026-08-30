#!/usr/bin/env python3
"""Genere les trois cartons fixes du spot : couverture, fiche Amazon, carton de fin.

Chaque carton est une image 1080x1080 prete a etre animee par un leger zoom
dans build.sh. Le rituel, lui, ne recoit aucune incrustation.
"""
import argparse
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONTS = "/mnt/skills/examples/canvas-design/canvas-fonts/"
S = 1080

BONE = (242, 235, 224)
GOLD = (200, 162, 74)
DARK = (11, 9, 7)
MUTED = (150, 141, 128)


def font(name, size):
    return ImageFont.truetype(FONTS + name, size)


def tracked_width(draw, text, fnt, track):
    if not text:
        return 0
    return sum(draw.textlength(c, font=fnt) + track for c in text) - track


def draw_centered(draw, y, text, fnt, fill, track=0):
    """Texte centre avec interlettrage manuel (Pillow n'a pas de letter-spacing)."""
    x = S / 2 - tracked_width(draw, text, fnt, track) / 2
    for c in text:
        draw.text((x, y), c, font=fnt, fill=fill)
        x += draw.textlength(c, font=fnt) + track


def background(glow, tint):
    """Fond tres sombre traverse d'une lueur chaude diffuse."""
    im = Image.new("RGB", (S, S), DARK)
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).ellipse(
        (-S * 0.35, -S * 0.25, S * 1.35, S * 1.25), fill=int(255 * glow)
    )
    mask = mask.filter(ImageFilter.GaussianBlur(220))
    return Image.composite(Image.new("RGB", (S, S), tint), im, mask)


def vignette(im, strength):
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).ellipse((-S * 0.18, -S * 0.18, S * 1.18, S * 1.18), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(160))
    black = Image.new("RGB", (S, S), (0, 0, 0))
    return Image.composite(im, Image.blend(im, black, strength), mask)


def rounded(im, radius):
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, im.size[0] - 1, im.size[1] - 1), radius=radius, fill=255
    )
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def paste_with_shadow(canvas, img, pos, blur=40, dy=18, alpha=200, radius=0):
    img = rounded(img, radius) if radius else img.convert("RGBA")
    solid = Image.new("RGBA", img.size, (0, 0, 0, 255))
    solid.putalpha(img.split()[-1].point(lambda v: v * alpha // 255))
    shadow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    shadow.paste(solid, (pos[0], pos[1] + dy), solid)
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(blur)))
    canvas.alpha_composite(img, pos)


def fit_height(path, height):
    im = Image.open(path).convert("RGB")
    return im.resize((int(im.width * height / im.height), height), Image.LANCZOS)


def scene_cover(src, out):
    cov = fit_height(os.path.join(src, "cover.jpg"), 950)
    canvas = background(0.50, (44, 26, 14)).convert("RGBA")
    x, y = (S - cov.width) // 2, (S - cov.height) // 2
    paste_with_shadow(canvas, cov, (x, y), blur=46, dy=22, alpha=210)
    ImageDraw.Draw(canvas).rectangle(
        (x, y, x + cov.width - 1, y + cov.height - 1), outline=(255, 255, 255, 26), width=1
    )
    vignette(canvas.convert("RGB"), 0.55).save(os.path.join(out, "scene_cover.png"))


def scene_amazon(src, out):
    shot = Image.open(os.path.join(src, "amazon.jpg")).convert("RGB")
    w = 920
    shot = shot.resize((w, int(shot.height * w / shot.width)), Image.LANCZOS)
    canvas = background(0.42, (40, 30, 16)).convert("RGBA")
    d = ImageDraw.Draw(canvas)

    head = font("Italiana-Regular.ttf", 62)
    draw_centered(d, 196, "DISPONIBLE MAINTENANT", head, BONE + (255,), track=11)
    hw = tracked_width(d, "DISPONIBLE MAINTENANT", head, 11)
    d.line((S / 2 - hw / 2, 288, S / 2 + hw / 2, 288), fill=GOLD + (170,), width=2)

    paste_with_shadow(canvas, shot, ((S - w) // 2, 360), blur=44, dy=20, alpha=205, radius=22)
    draw_centered(
        d, 360 + shot.height + 62, "Broché  ·  10,76 €  ·  Olio classique",
        font("CrimsonPro-Regular.ttf", 40), GOLD + (255,), track=2,
    )
    vignette(canvas.convert("RGB"), 0.50).save(os.path.join(out, "scene_amazon.png"))


def scene_end(src, out):
    cov = fit_height(os.path.join(src, "cover.jpg"), 520)
    canvas = background(0.45, (42, 25, 13)).convert("RGBA")
    x = (S - cov.width) // 2
    paste_with_shadow(canvas, cov, (x, 128), blur=40, dy=18, alpha=205)
    d = ImageDraw.Draw(canvas)
    d.rectangle((x, 128, x + cov.width - 1, 128 + cov.height - 1),
                outline=(255, 255, 255, 26), width=1)

    draw_centered(d, 712, "MANUSCRIT : TITRE INCONNU", font("Gloock-Regular.ttf", 58),
                  BONE + (255,), track=3)
    draw_centered(d, 792, "de Sangwa Lugozi", font("CrimsonPro-Italic.ttf", 40),
                  MUTED + (255,), track=1)
    d.line((S / 2 - 170, 864, S / 2 + 170, 864), fill=GOLD + (150,), width=2)
    draw_centered(d, 894, "COMMANDEZ SUR AMAZON.FR", font("Italiana-Regular.ttf", 50),
                  GOLD + (255,), track=9)
    draw_centered(d, 968, "Broché  ·  10,76 €  ·  Olio classique",
                  font("CrimsonPro-Regular.ttf", 32), MUTED + (245,), track=1)
    vignette(canvas.convert("RGB"), 0.50).save(os.path.join(out, "scene_end.png"))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--src", required=True, help="dossier contenant cover.jpg et amazon.jpg")
    p.add_argument("--out", required=True, help="dossier de sortie des cartons")
    a = p.parse_args()
    os.makedirs(a.out, exist_ok=True)
    scene_cover(a.src, a.out)
    scene_amazon(a.src, a.out)
    scene_end(a.src, a.out)


if __name__ == "__main__":
    main()
