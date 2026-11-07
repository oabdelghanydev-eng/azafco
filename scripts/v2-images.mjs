/**
 * Site v2 image pipeline: real AZAFCO photos -> optimised WebP in public/images/v2/.
 *
 *   node scripts/v2-images.mjs            # uses ../raw assets next to the workspace
 *   RAW_DIR="D:/azafco/raw assets" node scripts/v2-images.mjs
 *
 * - Sources are read-only (WhatsApp originals in "raw assets", plus public/items).
 * - EXIF orientation is applied, all metadata (incl. GPS) is stripped.
 * - Each photo is written at its native width (never upscaled) and at 640px:
 *     public/images/v2/<id>.webp, public/images/v2/<id>-640.webp
 * - Dimensions are printed; copy them into lib/v2/media.ts when adding photos.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = process.env.RAW_DIR || 'D:/azafco/raw assets';
const OUT = path.join(root, 'public/images/v2');
const PUB = path.join(root, 'public');

/** id -> source. Keep ids descriptive; they are the public filenames. */
const photos = [
    // Facility / dispatch (exterior)
    { id: 'facility-exterior-night', src: path.join(PUB, 'images/bg-homepage.webp') },
    { id: 'dispatch-truck-loading-bays-group', src: path.join(RAW, 'IMG-20261029-WA0087.jpg') },
    { id: 'dispatch-truck-loading-bays-wide', src: path.join(RAW, 'IMG-20261029-WA0077.jpg') },
    // Processing hall / hygiene
    { id: 'processing-hall-team', src: path.join(RAW, 'IMG-20261029-WA0070.jpg') },
    { id: 'processing-hall-team-crates', src: path.join(RAW, 'IMG-20261029-WA0076.jpg') },
    { id: 'processing-crew-hygiene-gear', src: path.join(RAW, 'IMG-20261029-WA0062.jpg') },
    { id: 'processing-area-visit-hygiene', src: path.join(RAW, 'IMG-20261029-WA0033.jpg') },
    { id: 'processing-area-entrance-visit', src: path.join(RAW, 'IMG-20261029-WA0051.jpg') },
    // People / corporate
    { id: 'meeting-room-visit', src: path.join(RAW, 'IMG-20261029-WA0067.jpg') },
    { id: 'staff-recognition-group', src: path.join(RAW, 'IMG-20261029-WA0021.jpg') },
    { id: 'staff-certificate-handover', src: path.join(RAW, 'IMG-20261029-WA0012.jpg') },
    // Species photos: see scripts/species-images.py (owner cut-out set, 7 Nov 2026)
];

fs.mkdirSync(OUT, { recursive: true });

for (const p of photos) {
    if (!fs.existsSync(p.src)) {
        console.warn(`skip ${p.id}: missing ${p.src}`);
        continue;
    }
    const base = sharp(p.src).rotate(); // apply EXIF orientation; metadata is dropped on output
    const meta = await base.metadata();
    const { data: full, info } = await base
        .clone()
        .webp({ quality: 80, effort: 5 })
        .toBuffer({ resolveWithObject: true });
    fs.writeFileSync(path.join(OUT, `${p.id}.webp`), full);
    if ((meta.width ?? 0) > 640) {
        await base.clone().resize({ width: 640 }).webp({ quality: 78, effort: 5 }).toFile(path.join(OUT, `${p.id}-640.webp`));
    }
    console.log(`${p.id}\t${info.width}x${info.height}\t${Math.round(full.length / 1024)} KB`);
}
