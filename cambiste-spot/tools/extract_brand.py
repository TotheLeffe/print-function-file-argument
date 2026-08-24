#!/usr/bin/env python3
"""Extrait les actifs de marque Cambiste depuis la video de marque officielle.

Produit brand/brand.js (consomme par spot.html) :

  - le logotype "Cambiste" en masque alpha PNG a sa resolution native, teintable
    a la volee (noir sur fond clair, blanc sur fond sombre) ;
  - la marque (carre vert + glyphe) en vectoriel : le carre est une superellipse
    ajustee sur le profil mesure, le glyphe est trace au potrace. Le glyphe a une
    symetrie centrale exacte : un seul lobe est trace, l'autre en est la rotation
    a 180 degres, ce qui garantit la symetrie et divise le bruit par deux ;
  - les couleurs relevees sur les aplats (et non estimees).

Usage:  python3 tools/extract_brand.py <video-de-marque.mov>
"""

import base64
import json
import subprocess
import sys
import tempfile
from collections import Counter
from pathlib import Path

import numpy as np
import potrace
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent


def ffmpeg_bin() -> str:
    import shutil
    return shutil.which("ffmpeg") or __import__("imageio_ffmpeg").get_ffmpeg_exe()


def grab_frame(video: Path, at: float = 3.9) -> Image.Image:
    """Derniere image : le verrouillage de marque y est complet et immobile."""
    with tempfile.TemporaryDirectory() as td:
        out = Path(td) / "f.png"
        subprocess.run([ffmpeg_bin(), "-v", "error", "-ss", str(at), "-i", str(video),
                        "-frames:v", "1", str(out)], check=True)
        return Image.open(out).convert("RGB").copy()


def components(mask: np.ndarray):
    """Composantes connexes 4-voisinage, de la plus grande a la plus petite."""
    lab = np.zeros(mask.shape, int)
    cur = 0
    for y in range(mask.shape[0]):
        for x in range(mask.shape[1]):
            if mask[y, x] and lab[y, x] == 0:
                cur += 1
                stack = [(y, x)]
                lab[y, x] = cur
                while stack:
                    cy, cx = stack.pop()
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if (0 <= ny < mask.shape[0] and 0 <= nx < mask.shape[1]
                                and mask[ny, nx] and lab[ny, nx] == 0):
                            lab[ny, nx] = cur
                            stack.append((ny, nx))
    sizes = [(int((lab == i).sum()), i) for i in range(1, cur + 1)]
    sizes.sort(reverse=True)
    return lab, sizes


def locate(a: np.ndarray):
    """Boites du logotype (noir) et de la marque (vert) sur la ligne du logo."""
    green = (a[:, :, 1] > 110) & (a[:, :, 1] - a[:, :, 0] > 50) & (a[:, :, 1] - a[:, :, 2] > 30)
    gy, gx = np.nonzero(green)
    mark = (gx.min(), gy.min(), gx.max(), gy.max())

    band = a[mark[1] - 12:mark[3] + 12, :mark[0] - 5].mean(2) < 110
    wy, wx = np.nonzero(band)
    word = (wx.min(), mark[1] - 12 + wy.min(), wx.max(), mark[1] - 12 + wy.max())
    return word, mark


def trace_lobe(lobe: np.ndarray, up=18, blur=20, tol=3.5):
    """Trace un lobe unique. Rejette le contour du cadre de la bitmap."""
    big = (Image.fromarray((lobe * 255).astype(np.uint8))
           .resize((lobe.shape[1] * up, lobe.shape[0] * up), Image.LANCZOS)
           .filter(ImageFilter.GaussianBlur(blur)))
    path = potrace.Bitmap(np.array(big) > 128).trace(
        turdsize=up * up * 4, alphamax=1.0, opticurve=True, opttolerance=tol)
    s = 100.0 / (lobe.shape[1] * up)
    for c in path:
        xs = [c.start_point.x * s] + [seg.end_point.x * s for seg in c]
        if max(xs) - min(xs) > 70:          # contour du cadre entier
            continue
        p = lambda pt: (round(pt.x * s, 2), round(pt.y * s, 2))
        d = "M{} {} ".format(*p(c.start_point))
        for seg in c:
            if seg.is_corner:
                d += "L{} {} L{} {} ".format(*p(seg.c), *p(seg.end_point))
            else:
                d += "C{} {} {} {} {} {} ".format(*p(seg.c1), *p(seg.c2), *p(seg.end_point))
        return d.strip() + " Z"
    raise SystemExit("lobe introuvable")


def fit_squircle(mask: np.ndarray):
    """Ajuste le coin en superellipse : ((R-x)/R)^n + ((R-y)/R)^n = 1."""
    prof = []
    for y in range(mask.shape[0]):
        r = np.nonzero(mask[y])[0]
        prof.append((y, r.min() if len(r) else None))
    best = None
    for R in np.arange(14, 40, 0.5):
        for n in np.arange(1.6, 6.01, 0.05):
            err = cnt = 0
            for y, xl in prof:
                if xl is None or y > R:
                    continue
                t = (R - y) / R
                v = 1 - t ** n
                x = R - R * (v ** (1 / n)) if v > 0 else R
                err += (x - xl) ** 2
                cnt += 1
            if cnt > 6 and (best is None or err / cnt < best[0]):
                best = (err / cnt, float(R), float(n))
    return best[1], best[2]


def main() -> None:
    video = Path(sys.argv[1] if len(sys.argv) > 1 else "")
    if not video.exists():
        raise SystemExit(f"video de marque introuvable : {video}")

    frame = grab_frame(video)
    a = np.array(frame).astype(float)
    (wx0, wy0, wx1, wy1), (mx0, my0, mx1, my1) = locate(a)

    # ---- logotype : alpha = 1 - luminance (noir sur blanc) -----------------
    lum = a[wy0:wy1 + 1, wx0:wx1 + 1].mean(2)
    al = np.clip((255.0 - lum) / 255.0, 0, 1)
    al = np.clip(al / al.max(), 0, 1)
    h, w = al.shape
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., 3] = (al * 255).round()
    (ROOT / "brand").mkdir(exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(ROOT / "brand" / "cambiste-wordmark.png")

    # ---- marque -------------------------------------------------------------
    sub = a[my0:my1 + 1, mx0:mx1 + 1]
    box = np.abs(sub - 255.0).sum(2) > 150            # silhouette du carre
    mh, mw = box.shape
    R, n = fit_squircle(box)

    glyph = sub.sum(2) > 620                          # glyphe blanc interieur
    lab, sizes = components(glyph)
    # les deux lobes sont de taille identique : ce sont les deux plus grandes
    lobe = (lab == sizes[0][1])
    ys, xs = np.nonzero(lobe | (lab == sizes[1][1]))
    cx, cy = (xs.min() + xs.max() + 1) / 2, (ys.min() + ys.max() + 1) / 2

    d = trace_lobe(lobe)
    sc = 100.0 / mw

    # ---- couleurs relevees --------------------------------------------------
    def modal(region):
        px = region.reshape(-1, 3).round().astype(int)
        return "#%02X%02X%02X" % Counter(map(tuple, px)).most_common(1)[0][0]

    green = modal(sub[(box) & (~glyph)][None, ...] if False else
                  sub[np.nonzero(box & ~glyph)])

    b64 = base64.b64encode((ROOT / "brand" / "cambiste-wordmark.png").read_bytes()).decode()
    js = f"""/* Actifs de marque Cambiste, extraits de la video de reference officielle.
   Genere par tools/extract_brand.py — ne pas retoucher a la main. */
window.BRAND = {{
  wordmark : 'data:image/png;base64,{b64}',
  wordmarkRatio : {w} / {h},
  mark : {{
    w : {mw}, h : {mh},
    R : {R}, n : {round(n, 2)},
    cx : {round(cx * sc, 3)}, cy : {round(cy * sc, 3)},
    vbw : 100.0, vbh : {round(mh * sc, 2)},
    lobe : '{d}'
  }},
  color : {{ green : '{green}', blue : '#2361EA', ink : '#0B0B0C', white : '#FFFFFF' }},
  tagline : 'Limitless Africa'
}};
"""
    (ROOT / "brand" / "brand.js").write_text(js)
    print(f"logotype {w}x{h} · marque {mw}x{mh} (R={R} n={n:.2f}) · vert {green}")
    print("-> brand/brand.js")


if __name__ == "__main__":
    main()
