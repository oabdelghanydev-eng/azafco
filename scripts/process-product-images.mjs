#!/usr/bin/env node
// Builds the product photo set in public/items/ (960x1280, 3:4, sRGB, JPEG q82)
// and a labelled contact sheet for owner review.
//
// Usage:
//   node scripts/process-product-images.mjs [originalsDir] [contactSheetPath]
// Defaults assume the AZAFCO workspace layout (originals live outside the repo):
//   ../docs/images/originals   and   ../docs/images/contact-sheet.jpg
//
// Licenses for every source file are recorded in docs/images/LICENSES.md (workspace).

import path from 'node:path'
import fs from 'node:fs'
import sharp from 'sharp'

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
const originals = path.resolve(process.argv[2] ?? path.join(repoRoot, '..', 'docs', 'images', 'originals'))
const sheetOut = path.resolve(process.argv[3] ?? path.join(repoRoot, '..', 'docs', 'images', 'contact-sheet.jpg'))
const itemsDir = path.join(repoRoot, 'public', 'items')

const W = 960
const H = 1280

// crop: region of the source (px) to use before resizing; must be ~3:4.
// enhance: gentle tone/colour lift for the older phone photos.
const set = [
    { out: 'tilapia.jpg', label: 'Tilapia (Oreochromis niloticus) - stock', src: 'pexels-17953596.jpg', crop: null, enhance: 'stock' },
    { out: 'sea_bass.jpg', label: 'Sea bass (Dicentrarchus labrax) - stock', src: 'pexels-2042564.jpg', crop: { left: 1500, top: 0, width: 4092, height: 5456 }, enhance: 'stock' },
    { out: 'bouri.jpg', label: 'Grey mullet (Mugil cephalus) - own', src: 'own-previous-bouri.jpg', crop: null, enhance: 'own' },
    { out: 'buni.jpg', label: 'Bunni (Labeobarbus bynni) - own, ID pending', src: 'own-previous-buni.jpg', crop: null, enhance: 'own' },
    { out: 'mubarakah.jpg', label: 'Common carp (Cyprinus carpio) - own', src: 'own-previous-mubarakah.jpg', crop: { left: 230, top: 0, width: 576, height: 768 }, enhance: 'own' },
    { out: 'catfish.jpg', label: 'African catfish (Clarias gariepinus) - own', src: 'own-previous-catfish.jpg', crop: null, enhance: 'own' },
    { out: 'lout.jpg', label: 'Meagre (Argyrosomus regius) - own', src: 'own-previous-lout.jpg', crop: null, enhance: 'own' },
    { out: 'eels.jpg', label: 'European eel (Anguilla anguilla) - own', src: 'own-previous-eels.jpg', crop: null, enhance: 'own' },
]

function pipeline(item) {
    let img = sharp(path.join(originals, item.src)).rotate() // honour EXIF orientation
    if (item.crop) img = img.extract(item.crop)
    img = img.resize(W, H, { fit: 'cover', position: 'attention', kernel: 'lanczos3' })
    if (item.enhance === 'own') {
        // phone shots: lift contrast a touch, slight warmth/saturation, crisp up after upscaling
        img = img.linear(1.08, -8).modulate({ brightness: 1.03, saturation: 1.1 }).sharpen({ sigma: 0.9, m1: 0.6, m2: 2 })
    } else {
        img = img.modulate({ saturation: 1.04 }).sharpen({ sigma: 0.6 })
    }
    return img.toColourspace('srgb').withIccProfile('srgb')
}

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function main() {
    for (const item of set) {
        const dest = path.join(itemsDir, item.out)
        await pipeline(item).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(dest)
        const meta = await sharp(dest).metadata()
        console.log(`${item.out.padEnd(14)} ${meta.width}x${meta.height}  ${(fs.statSync(dest).size / 1024).toFixed(0)} KB`)
    }

    // Contact sheet: 4 x 2 grid of 3:4 tiles with a caption strip under each.
    const tw = 360, th = 480, cap = 44, gap = 16, cols = 4, rows = 2
    const sheetW = cols * tw + (cols + 1) * gap
    const sheetH = rows * (th + cap) + (rows + 1) * gap + 50
    const composites = [{
        input: Buffer.from(`<svg width="${sheetW}" height="50" xmlns="http://www.w3.org/2000/svg"><text x="${gap}" y="34" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#0f2a44">AZAFCO product photos - review sheet (public/items, 960x1280)</text></svg>`),
        top: 0, left: 0,
    }]
    for (const [i, item] of set.entries()) {
        const x = gap + (i % cols) * (tw + gap)
        const y = 50 + gap + Math.floor(i / cols) * (th + cap + gap)
        const tile = await sharp(path.join(itemsDir, item.out)).resize(tw, th).toBuffer()
        composites.push({ input: tile, left: x, top: y })
        const [name, src] = item.label.split(' - ')
        composites.push({
            input: Buffer.from(`<svg width="${tw}" height="${cap}" xmlns="http://www.w3.org/2000/svg"><text x="4" y="18" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#111">${escapeXml(item.out)}: ${escapeXml(name)}</text><text x="4" y="37" font-family="Arial, sans-serif" font-size="14" fill="#555">${escapeXml(src ?? '')}</text></svg>`),
            left: x, top: y + th,
        })
    }
    await sharp({ create: { width: sheetW, height: sheetH, channels: 3, background: '#ffffff' } })
        .composite(composites)
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(sheetOut)
    console.log(`contact sheet -> ${sheetOut}`)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
