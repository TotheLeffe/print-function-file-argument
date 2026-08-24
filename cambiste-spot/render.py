#!/usr/bin/env python3
"""Capture spot.html image par image et encode le spot en MP4.

Le rendu est piloté par window.renderFrame(n) : chaque image est dessinee
explicitement, sans dependance a l'horloge, donc la capture est reproductible.

Usage:  python3 render.py [--out cambiste-spot-15s.mp4] [--scale 1.0]
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

def chromium_path():
    """Chromium pre-installe de l'environnement (la version pilote/navigateur
    peut differer de celle attendue par le paquet playwright)."""
    import glob, os
    for pat in ("/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                "/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell"):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None



def ffmpeg_bin() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def capture(frames_dir: Path, scale: float) -> int:
    from playwright.sync_api import sync_playwright

    frames_dir.mkdir(parents=True, exist_ok=True)
    for old in frames_dir.glob("*.png"):
        old.unlink()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=chromium_path(),
                                   args=["--force-color-profile=srgb", "--disable-lcd-text"])
        page = browser.new_page(
            viewport={"width": 1080, "height": 1080},
            device_scale_factor=scale,
        )
        page.goto((HERE / "spot.html").as_uri())
        page.wait_for_function("window.ready === true", timeout=30000)
        total = page.evaluate("window.TOTAL")
        canvas = page.locator("#stage")

        for n in range(total):
            page.evaluate("n => window.renderFrame(n)", n)
            canvas.screenshot(path=str(frames_dir / f"{n:04d}.png"))
            if n % 50 == 0:
                print(f"  image {n}/{total}", flush=True)

        browser.close()
    return total


def encode(frames_dir: Path, out: Path, ff: str) -> None:
    cmd = [
        ff, "-y", "-framerate", "30",
        "-i", str(frames_dir / "%04d.png"),
        "-c:v", "libx264", "-profile:v", "high", "-preset", "slow",
        "-crf", "17", "-pix_fmt", "yuv420p",
        "-x264-params", "keyint=60:min-keyint=30",
        "-movflags", "+faststart",
        str(out),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        sys.stderr.write(res.stderr[-4000:])
        raise SystemExit("echec de l'encodage ffmpeg")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(HERE / "cambiste-spot-24s.mp4"))
    ap.add_argument("--frames", default=str(HERE / "build" / "frames"))
    ap.add_argument("--scale", type=float, default=1.0)
    args = ap.parse_args()

    frames_dir = Path(args.frames)
    out = Path(args.out)

    print("Capture des images...")
    total = capture(frames_dir, args.scale)
    print(f"{total} images capturees dans {frames_dir}")

    print("Encodage...")
    encode(frames_dir, out, ffmpeg_bin())
    size = out.stat().st_size / 1e6
    print(f"OK -> {out} ({size:.1f} Mo, {total / 30:.2f} s)")


if __name__ == "__main__":
    main()
