#!/usr/bin/env python3
"""Planche de controle : 16 images cles assemblees en une seule PNG."""
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

KEY = [ 70, 104, 140, 164, 224, 254, 300, 350,
        389, 440, 470, 520, 584, 625, 700, 734]


def main() -> None:
    out_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "build" / "preview"
    out_dir.mkdir(parents=True, exist_ok=True)

    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=chromium_path(),
                           args=["--force-color-profile=srgb"])
        p = b.new_page(viewport={"width": 1080, "height": 1080}, device_scale_factor=0.34)
        p.goto((HERE / "spot.html").as_uri())
        p.wait_for_function("window.ready === true", timeout=30000)
        for i, n in enumerate(KEY):
            p.evaluate("n => window.renderFrame(n)", n)
            p.locator("#stage").screenshot(path=str(out_dir / f"k{i:02d}.png"))
        b.close()

    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    sheet = out_dir / "sheet.png"
    subprocess.run([ff, "-y", "-v", "error", "-i", str(out_dir / "k%02d.png"),
                    "-filter_complex", "tile=4x4:padding=6:color=#555555",
                    "-frames:v", "1", str(sheet)], check=True)
    print(sheet)


if __name__ == "__main__":
    main()
