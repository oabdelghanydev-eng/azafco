"""Normalise the owner's species cut-outs (D:/azafco/new/fishs, transparent PNG)
into one consistent web set: public/images/species/<slug>.webp (1600x1200) and
<slug>-800.webp. Each fish is trimmed to its alpha box, scaled to fill the same
safe area (88% wide x 72% high of a 4:3 canvas), centred, and kept transparent.
Run: python scripts/species-images.py [source_dir]"""
import os, sys
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else 'D:/azafco/new/fishs'
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'species')
W, H = 1600, 1200
SAFE_W, SAFE_H = 0.88, 0.72
MAP = {  # owner's Arabic file name -> product slug (data/products.ts)
    'بلطي': 'tilapia', 'قاروص': 'sea-bass', 'بوري': 'mullet', 'حشايش': 'grass-carp',
    'قشرة': 'common-carp', 'قراميط': 'catfish', 'لوت': 'meagre', 'طوبار': 'thinlip-mullet',
    'بياض': 'bayad-catfish', 'سلفر': 'silver-carp', 'مبروكة': 'mirror-carp', 'دنيس': 'sea-bream',
}

os.makedirs(OUT, exist_ok=True)
for ar, slug in MAP.items():
    im = Image.open(os.path.join(SRC, ar + '.png')).convert('RGBA')
    # drop near-invisible fringe pixels before measuring the box
    a = im.getchannel('A').point(lambda v: 0 if v < 8 else v)
    im.putalpha(a)
    im = im.crop(a.getbbox())
    s = min(W * SAFE_W / im.width, H * SAFE_H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    canvas.alpha_composite(im, ((W - im.width) // 2, (H - im.height) // 2))
    canvas.save(os.path.join(OUT, f'{slug}.webp'), 'WEBP', quality=86, method=6)
    canvas.resize((800, 600), Image.LANCZOS).save(os.path.join(OUT, f'{slug}-800.webp'), 'WEBP', quality=84, method=6)
    print(slug, im.size)
