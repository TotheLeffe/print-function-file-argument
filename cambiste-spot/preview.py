#!/usr/bin/env python3
"""Planche de controle d'un spot : 16 images cles assemblees en une PNG.

Les images sont choisies automatiquement a partir du decoupage declare par le
spot : pour chaque plan, une image pendant l'entree (l'animation en cours) et
une image de tenue (la composition complete). C'est la seule facon de voir
d'un coup d'oeil qu'un plan s'anime ET qu'il se pose.

Usage:  python3 preview.py [--spot 01] [--frames 12,40,90]
"""
import argparse
import glob
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent


def chromium_path():
    """Chromium pre-installe (sa version peut differer de celle du paquet)."""
    for pat in ("/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                "/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell"):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None


def pick(scenes, n=16):
    """Deux images par plan : une en pleine animation, une en tenue."""
    keys = []
    for s in scenes:
        span = s["end"] - s["start"]
        keys.append(s["start"] + min(span, s["tin"] + max(6, span // 6)))
        keys.append(s["end"] - 2)
    while len(keys) < n:                       # complete avec des intermediaires
        gaps = [(keys[i + 1] - keys[i], i) for i in range(len(keys) - 1)]
        g, i = max(gaps)
        keys.insert(i + 1, keys[i] + g // 2)
    return sorted(keys)[:n]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--spot", default="01")
    ap.add_argument("--frames", default="")
    ap.add_argument("--page", default="spot.html")
    args = ap.parse_args()

    out = HERE / "build" / f"preview-{args.spot}"
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("*.png"):
        old.unlink()

    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=chromium_path(),
                               args=["--force-color-profile=srgb"])
        p = b.new_page(viewport={"width": 1080, "height": 1080},
                       device_scale_factor=0.34)
        p.goto((HERE / args.page).as_uri() + f"?spot={args.spot}")
        p.wait_for_function("window.ready === true", timeout=30000)
        scenes = p.evaluate("window.SCENES")
        keys = ([int(x) for x in args.frames.split(",")] if args.frames
                else pick(scenes))
        for i, n in enumerate(keys):
            p.evaluate("n => window.renderFrame(n)", n)
            p.locator("#stage").screenshot(path=str(out / f"k{i:02d}.png"))
        b.close()

    import imageio_ffmpeg
    sheet = out / "sheet.png"
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-v", "error",
                    "-i", str(out / "k%02d.png"),
                    "-filter_complex", "tile=4x4:padding=6:color=#888888",
                    "-frames:v", "1", str(sheet)], check=True)
    print(",".join(map(str, keys)))
    print(sheet)


if __name__ == "__main__":
    main()
