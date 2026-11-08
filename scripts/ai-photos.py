"""
Site v2: approved AI-generated contextual photos -> optimised WebP.

    python scripts/ai-photos.py
    python scripts/ai-photos.py --src "D:/azafco/docs/images/ai-candidates"

Sources are the lead-approved PNGs in docs/images/ai-candidates (prompts in MANIFEST.md).
They are illustrative, NOT documentary photos of AZAFCO sites, staff or equipment.

Output per slot (never upscaled; metadata dropped):
    public/images/photos/<slot>.webp       max 1920 wide, quality 80, method 6
    public/images/photos/<slot>-800.webp   800 wide
Dimensions are printed: copy them into lib/v2/media.ts (ids `photo-<slot>`).
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SRC = Path("D:/azafco/docs/images/ai-candidates")
OUT = ROOT / "public" / "images" / "photos"

# slot -> approved source file
APPROVED = {
    "home-hero": "home-hero-v1.png",
    "seafood-hero": "seafood-hero-fresh-v1.png",
    "processing": "processing-fresh-v2.png",
    "quality": "quality-water-v1.png",
    "cold-chain": "cold-chain-v1.png",
    "harvest": "harvest-v2.png",
    "delta-landscape": "delta-landscape-v1.png",
    "ice-texture": "ice-texture-v2.png",
}

MAX_W = 1920
SMALL_W = 800


def resized(im: Image.Image, width: int) -> Image.Image:
    if im.width <= width:
        return im.copy()
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", type=Path, default=DEFAULT_SRC)
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    for slot, name in APPROVED.items():
        src = args.src / name
        if not src.exists():
            print(f"skip {slot}: missing {src}")
            continue
        with Image.open(src) as raw:
            im = raw.convert("RGB")
        full = resized(im, MAX_W)
        small = resized(im, SMALL_W)
        full_path = OUT / f"{slot}.webp"
        small_path = OUT / f"{slot}-800.webp"
        full.save(full_path, "WEBP", quality=80, method=6)
        small.save(small_path, "WEBP", quality=80, method=6)
        print(
            f"{slot:16} {full.width}x{full.height} ({full_path.stat().st_size // 1024} KB)"
            f"  800: {small.width}x{small.height} ({small_path.stat().st_size // 1024} KB)"
        )


if __name__ == "__main__":
    main()
