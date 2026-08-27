#!/usr/bin/env python3
"""Capture un spot image par image et l'encode en MP4.

Le rendu est pilote par window.renderFrame(n) : chaque image est dessinee
explicitement, sans dependance a l'horloge, donc la capture est reproductible.

Usage:
    python3 render.py --spot 01
    python3 render.py --all
    python3 render.py --page spot-fr-24s.html --out cambiste-fr-24s.mp4
"""

import argparse
import glob
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SPOTS = sorted(p.stem for p in (HERE / "spots").glob("*.js"))


def chromium_path():
    """Chromium pre-installe (sa version peut differer de celle du paquet)."""
    for pat in ("/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                "/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell"):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None


def ffmpeg_bin() -> str:
    return shutil.which("ffmpeg") or __import__("imageio_ffmpeg").get_ffmpeg_exe()


def capture(page: str, spot: str, frames_dir: Path, scale: float) -> int:
    from playwright.sync_api import sync_playwright

    frames_dir.mkdir(parents=True, exist_ok=True)
    for old in frames_dir.glob("*.png"):
        old.unlink()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            executable_path=chromium_path(),
            args=["--force-color-profile=srgb", "--disable-lcd-text"])
        page_obj = browser.new_page(
            viewport={"width": 1080, "height": 1080}, device_scale_factor=scale)
        errors = []
        page_obj.on("pageerror", lambda e: errors.append(str(e)))
        url = (HERE / page).as_uri() + (f"?spot={spot}" if spot else "")
        page_obj.goto(url)
        page_obj.wait_for_function("window.ready === true", timeout=30000)
        if errors:
            raise SystemExit("erreur JavaScript : " + errors[0])
        total = page_obj.evaluate("window.TOTAL")
        canvas = page_obj.locator("#stage")
        for n in range(total):
            page_obj.evaluate("n => window.renderFrame(n)", n)
            canvas.screenshot(path=str(frames_dir / f"{n:04d}.png"))
            if n % 100 == 0:
                print(f"    image {n}/{total}", flush=True)
        browser.close()
    return total


def encode(frames_dir: Path, out: Path, ff: str) -> None:
    cmd = [ff, "-y", "-framerate", "30", "-i", str(frames_dir / "%04d.png"),
           "-c:v", "libx264", "-profile:v", "high", "-preset", "slow",
           "-crf", "17", "-pix_fmt", "yuv420p",
           "-x264-params", "keyint=60:min-keyint=30",
           "-movflags", "+faststart", str(out)]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        sys.stderr.write(res.stderr[-4000:])
        raise SystemExit("echec de l'encodage ffmpeg")


def render_one(page: str, spot: str, out: Path, scale: float) -> None:
    frames = HERE / "build" / f"frames-{spot or 'page'}"
    print(f"  capture {spot or page}...")
    total = capture(page, spot, frames, scale)
    encode(frames, out, ffmpeg_bin())
    size = out.stat().st_size / 1e6
    print(f"  -> {out.name}  {total} images  {total/30:.2f} s  {size:.1f} Mo")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--spot", default="01")
    ap.add_argument("--all", action="store_true", help="rend toute la serie")
    ap.add_argument("--page", default="spot.html")
    ap.add_argument("--out", default="")
    ap.add_argument("--scale", type=float, default=1.0)
    args = ap.parse_args()

    if args.all:
        for s in SPOTS:
            render_one(args.page, s, HERE / f"cambiste-{s}.mp4", args.scale)
        return

    spot = "" if args.page != "spot.html" else args.spot
    out = Path(args.out) if args.out else HERE / f"cambiste-{spot or 'page'}.mp4"
    render_one(args.page, spot, out, args.scale)


if __name__ == "__main__":
    main()
