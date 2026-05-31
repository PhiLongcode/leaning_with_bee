#!/usr/bin/env python3
"""Generate placeholder brand SFX/reminder WAV files for Cuder Học Tiếng."""

from __future__ import annotations

import math
import struct
import wave
from pathlib import Path

SAMPLE_RATE = 44100
ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    ROOT / "brand" / "audio",
    ROOT / "apps" / "mobile" / "assets" / "brand" / "audio",
]


def sine(freq: float, duration: float, volume: float = 0.28, fade_ms: float = 8.0) -> list[float]:
    n = max(1, int(SAMPLE_RATE * duration))
    fade = max(1, int(SAMPLE_RATE * fade_ms / 1000))
    out: list[float] = []
    for i in range(n):
        t = i / SAMPLE_RATE
        env = 1.0
        if i < fade:
            env = i / fade
        elif i > n - fade:
            env = (n - i) / fade
        out.append(volume * env * math.sin(2 * math.pi * freq * t))
    return out


def silence(duration: float) -> list[float]:
    return [0.0] * max(1, int(SAMPLE_RATE * duration))


def mix(*tracks: list[float]) -> list[float]:
    length = max(len(t) for t in tracks)
    merged = [0.0] * length
    for track in tracks:
        for i, sample in enumerate(track):
            merged[i] += sample
    return merged


def concat(*tracks: list[float], gap: float = 0.0) -> list[float]:
    gap_samples = silence(gap)
    out: list[float] = []
    for i, track in enumerate(tracks):
        out.extend(track)
        if i < len(tracks) - 1:
            out.extend(gap_samples)
    return out


def normalize(samples: list[float], peak: float = 0.92) -> list[float]:
    max_val = max((abs(s) for s in samples), default=0.0)
    if max_val <= 0:
        return samples
    scale = peak / max_val
    return [s * scale for s in samples]


def write_wav(path: Path, samples: list[float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    clipped = normalize(samples)
    with wave.open(str(path), "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        frames = b"".join(
            struct.pack("<h", max(-32767, min(32767, int(s * 32767)))) for s in clipped
        )
        wf.writeframes(frames)


def build_sounds() -> dict[str, list[float]]:
    return {
        "sfx/answer_correct.wav": mix(
            sine(523.25, 0.18, 0.22),
            sine(659.25, 0.18, 0.2),
            sine(783.99, 0.32, 0.24),
        ),
        "sfx/answer_wrong.wav": mix(
            sine(196.0, 0.12, 0.18),
            sine(185.0, 0.28, 0.22),
        ),
        "sfx/answer_partial.wav": concat(sine(392.0, 0.14, 0.2), sine(493.88, 0.18, 0.18), gap=0.04),
        "sfx/xp_gain.wav": concat(sine(880.0, 0.08, 0.24), sine(1174.66, 0.14, 0.22), gap=0.02),
        "sfx/streak_tick.wav": mix(sine(740.0, 0.06, 0.26), sine(987.77, 0.12, 0.2)),
        "reminder/reminder_default.wav": concat(
            sine(523.25, 0.22, 0.2),
            sine(659.25, 0.22, 0.2),
            sine(783.99, 0.22, 0.2),
            sine(1046.5, 0.35, 0.22),
            gap=0.08,
        ),
        "reminder/reminder_gentle.wav": concat(
            sine(440.0, 0.28, 0.14),
            sine(554.37, 0.28, 0.14),
            sine(659.25, 0.4, 0.15),
            gap=0.1,
        ),
        "reminder/reminder_urgent.wav": concat(
            sine(622.25, 0.12, 0.24),
            sine(783.99, 0.12, 0.24),
            sine(987.77, 0.2, 0.26),
            sine(622.25, 0.1, 0.22),
            sine(987.77, 0.24, 0.26),
            gap=0.05,
        ),
    }


def main() -> None:
    sounds = build_sounds()
    for base in TARGETS:
        for rel, samples in sounds.items():
            out = base / rel
            write_wav(out, samples)
            print(f"Wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
