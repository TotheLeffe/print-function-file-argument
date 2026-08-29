#!/usr/bin/env python3
"""Narrate the Machiavel-au-Congo essay with a French male Piper voice."""

import sys
import time
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

HERE = Path(__file__).parent
MODEL = HERE / "voices/vits-piper-fr_FR-tom-medium/fr_FR-tom-medium.onnx"
TEXT = HERE / "texte.txt"
OUT_WAV = HERE / "machiavel-au-congo.wav"

SR = 44100
# Pause lengths in seconds, by the role a line plays in the essay.
PAUSE_TITLE = 1.1
PAUSE_AFTER_TITLE_BLOCK = 1.8
PAUSE_BEFORE_SECTION = 1.6
PAUSE_AFTER_SECTION = 1.0
PAUSE_PARAGRAPH = 0.8
PAUSE_SENTENCE = 0.38
LEAD_IN = 0.6
LEAD_OUT = 2.0


def silence(seconds):
    return np.zeros(int(SR * seconds), dtype=np.int16)


def main():
    voice = PiperVoice.load(MODEL)
    syn = SynthesisConfig(length_scale=1.06, noise_scale=0.667,
                          noise_w_scale=0.8, normalize_audio=True)

    def say(text):
        chunks = [
            np.frombuffer(c.audio_int16_bytes, dtype=np.int16)
            for c in voice.synthesize(text, syn_config=syn)
        ]
        return np.concatenate(chunks) if chunks else silence(0)

    lines = TEXT.read_text(encoding="utf-8").splitlines()
    pieces = [silence(LEAD_IN)]
    started = time.time()
    spoken = 0
    in_title_block = False

    for i, raw in enumerate(lines):
        line = raw.strip()
        if not line:
            if in_title_block:
                pieces.append(silence(PAUSE_AFTER_TITLE_BLOCK))
                in_title_block = False
            else:
                pieces.append(silence(PAUSE_PARAGRAPH))
            continue

        if line.startswith("## "):
            pieces.append(silence(PAUSE_BEFORE_SECTION))
            pieces.append(say(line[3:]))
            pieces.append(silence(PAUSE_AFTER_SECTION))
        elif line.startswith("# "):
            in_title_block = True
            pieces.append(say(line[2:]))
            pieces.append(silence(PAUSE_TITLE))
        else:
            pieces.append(say(line))
            pieces.append(silence(PAUSE_SENTENCE))

        spoken += 1
        if spoken % 20 == 0:
            secs = sum(len(p) for p in pieces) / SR
            print(f"  line {i + 1}/{len(lines)} — {secs / 60:.1f} min audio, "
                  f"{time.time() - started:.0f}s elapsed", flush=True)

    pieces.append(silence(LEAD_OUT))
    audio = np.concatenate(pieces)

    with wave.open(str(OUT_WAV), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(audio.tobytes())

    print(f"DONE: {OUT_WAV} — {len(audio) / SR / 60:.2f} min "
          f"in {time.time() - started:.0f}s", flush=True)


if __name__ == "__main__":
    sys.exit(main())
