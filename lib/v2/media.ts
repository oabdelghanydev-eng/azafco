/**
 * Site v2 media manifest. Real, professional AZAFCO photos (no stock), plus a small set of
 * lead-approved illustrative AI photos (`illustrative: true`, ids `photo-*`).
 * Plant photos are produced by `node scripts/v2-images.mjs` into public/images/v2/;
 * species cut-outs live in public/images/species/.
 * Alt text describes only what is visible. Do not add claims (certificates,
 * capacity, markets, visiting organisations) to alt text or captions.
 *
 *   import { media, mediaImage, mediaBySubject } from '@/lib/v2/media';
 *   <ProductCard image={mediaImage('species-tilapia', locale)} … />
 */

export type MediaSubject =
    | 'facility' // factory buildings, exterior
    | 'processing' // processing hall, crew in hygiene gear
    | 'quality' // hygiene / inspection context (NOT proof of certification)
    | 'dispatch' // loading bays, refrigerated trucks
    | 'product' // fish close-ups
    | 'people' // staff, visits, meetings
    | 'farm' // ponds, harvest, landscape
    | 'texture'; // background textures (ice)

export interface MediaItem {
    id: string;
    src: string;
    /** 640px-wide variant, for places that can't use next/image srcset */
    srcSmall?: string;
    width: number;
    height: number;
    alt: { en: string; ar: string };
    subject: MediaSubject;
    /** Extra tags for picking (visible content only) */
    tags?: string[];
    /** Transparent cut-out: render with object-contain on a light panel, never cropped */
    cutout?: boolean;
    /** Owner follow-up attached to this photo (consent, species, etc.) */
    note?: string;
    /**
     * AI-generated contextual photo (lead-approved, 8 Nov 2026). Illustrative only: never
     * caption or alt it as AZAFCO's own farm, plant, staff or equipment.
     */
    illustrative?: boolean;
}

/** Shape accepted by v2 components (PageHero, ProductCard, MediaGallery…) */
export interface ImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** Transparent cut-out (species photos): show whole, object-contain */
    cutout?: boolean;
}

// Photo quality rule (owner, 7 Nov 2026): only professional-looking real photographs.
// No phone snapshots, staged group photos, old logo, renders or image-of-text. Better no
// image than a weak one: components have no-image variants (PageHero, EditorialMedia,
// InsightCard). The earlier WhatsApp plant/visit photos were removed for that reason.
// New plant photography goes in public/images/v2/<id>.webp via scripts/v2-images.mjs.

export const media: MediaItem[] = [
    // ── Species cut-outs (owner set, 7 Nov 2026; transparent, 4:3; tags = data/products.ts slugs) ──
    // Alt text uses the short species names of locales/{ar,en}/data/products.json (same names on every page).
    {
        id: 'species-tilapia',
        src: '/images/species/tilapia.webp',
        srcSmall: '/images/species/tilapia-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['tilapia'],
        cutout: true,
        alt: { en: 'Whole tilapia, side view', ar: 'سمكة بلطي كاملة، منظر جانبي' },
    },
    {
        id: 'species-sea-bass',
        src: '/images/species/sea-bass.webp',
        srcSmall: '/images/species/sea-bass-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['sea-bass'],
        cutout: true,
        alt: { en: 'Whole sea bass, side view', ar: 'سمكة قاروص كاملة، منظر جانبي' },
    },
    {
        id: 'species-mullet',
        src: '/images/species/mullet.webp',
        srcSmall: '/images/species/mullet-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['mullet'],
        cutout: true,
        alt: { en: 'Whole grey mullet, side view', ar: 'سمكة بوري كاملة، منظر جانبي' },
    },
    {
        id: 'species-grass-carp',
        src: '/images/species/grass-carp.webp',
        srcSmall: '/images/species/grass-carp-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['grass-carp'],
        cutout: true,
        alt: { en: 'Whole grass carp, side view', ar: 'سمكة حشايش كاملة، منظر جانبي' },
    },
    {
        id: 'species-common-carp',
        src: '/images/species/common-carp.webp',
        srcSmall: '/images/species/common-carp-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['common-carp'],
        cutout: true,
        alt: { en: 'Whole common carp, side view', ar: 'سمكة قشرة كاملة، منظر جانبي' },
    },
    {
        id: 'species-catfish',
        src: '/images/species/catfish.webp',
        srcSmall: '/images/species/catfish-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['catfish'],
        cutout: true,
        alt: { en: 'Whole catfish, side view', ar: 'سمكة قراميط كاملة، منظر جانبي' },
    },
    {
        id: 'species-meagre',
        src: '/images/species/meagre.webp',
        srcSmall: '/images/species/meagre-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['meagre'],
        cutout: true,
        alt: { en: 'Whole meagre, side view', ar: 'سمكة لوت كاملة، منظر جانبي' },
    },
    {
        id: 'species-thinlip-mullet',
        src: '/images/species/thinlip-mullet.webp',
        srcSmall: '/images/species/thinlip-mullet-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['thinlip-mullet'],
        cutout: true,
        alt: { en: 'Whole thinlip mullet, side view', ar: 'سمكة طوبار كاملة، منظر جانبي' },
    },
    {
        id: 'species-bayad-catfish',
        src: '/images/species/bayad-catfish.webp',
        srcSmall: '/images/species/bayad-catfish-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['bayad-catfish'],
        cutout: true,
        alt: { en: 'Whole bayad catfish, side view', ar: 'سمكة بياض كاملة، منظر جانبي' },
    },
    {
        id: 'species-silver-carp',
        src: '/images/species/silver-carp.webp',
        srcSmall: '/images/species/silver-carp-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['silver-carp'],
        cutout: true,
        alt: { en: 'Whole silver carp, side view', ar: 'سمكة سلفر كاملة، منظر جانبي' },
    },
    {
        id: 'species-mirror-carp',
        src: '/images/species/mirror-carp.webp',
        srcSmall: '/images/species/mirror-carp-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['mirror-carp'],
        cutout: true,
        alt: { en: 'Whole mirror carp, side view', ar: 'سمكة مبروكة كاملة، منظر جانبي' },
    },
    {
        id: 'species-sea-bream',
        src: '/images/species/sea-bream.webp',
        srcSmall: '/images/species/sea-bream-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['sea-bream'],
        cutout: true,
        alt: { en: 'Whole sea bream, side view', ar: 'سمكة دنيس كاملة، منظر جانبي' },
    },
    // ── Illustrative photos (AI-generated, lead-approved 8 Nov 2026) ──
    // Sources + prompts: docs/images/ai-candidates (MANIFEST.md); built by `python scripts/ai-photos.py`
    // into public/images/photos/. Generic context, not documentary: alt describes what is
    // visible and never says "our farm / plant / team". Replace with real shoots when they exist.
    {
        id: 'photo-home-hero',
        src: '/images/photos/home-hero.webp',
        srcSmall: '/images/photos/home-hero-800.webp',
        width: 1536,
        height: 1024,
        subject: 'farm',
        illustrative: true,
        alt: {
            en: 'Earthen fish ponds with a paddlewheel aerator at sunrise in the Nile Delta',
            ar: 'أحواض سمكية ترابية تعمل فيها بدّالة تهوية عند شروق الشمس في دلتا النيل',
        },
    },
    {
        id: 'photo-seafood-hero',
        src: '/images/photos/seafood-hero.webp',
        srcSmall: '/images/photos/seafood-hero-800.webp',
        width: 1536,
        height: 1024,
        subject: 'product',
        illustrative: true,
        alt: {
            en: 'Two whole fresh tilapia on crushed ice in a white insulated box',
            ar: 'سمكتا بلطي طازجتان كاملتان على ثلج مجروش داخل صندوق أبيض معزول',
        },
    },
    {
        id: 'photo-processing',
        src: '/images/photos/processing.webp',
        srcSmall: '/images/photos/processing-800.webp',
        width: 1536,
        height: 1024,
        subject: 'processing',
        illustrative: true,
        alt: {
            en: 'Gloved hands placing a whole tilapia into a crate of crushed ice on a stainless steel table',
            ar: 'يدان بقفازين تضعان سمكة بلطي كاملة في صندوق به ثلج مجروش فوق طاولة من الستانلس ستيل',
        },
    },
    {
        id: 'photo-quality',
        src: '/images/photos/quality.webp',
        srcSmall: '/images/photos/quality-800.webp',
        width: 1448,
        height: 1086,
        subject: 'quality',
        illustrative: true,
        alt: {
            en: 'A gloved hand checking the temperature of the ice-water slurry around whole fresh tilapia',
            ar: 'قياس حرارة مياه التبريد المثلّجة حول أسماك بلطي كاملة طازجة',
        },
    },
    {
        id: 'photo-cold-chain',
        src: '/images/photos/cold-chain.webp',
        srcSmall: '/images/photos/cold-chain-800.webp',
        width: 1536,
        height: 1024,
        subject: 'dispatch',
        illustrative: true,
        alt: {
            en: 'A pallet of white insulated boxes being loaded into a refrigerated truck at a loading dock at dawn',
            ar: 'منصة عليها صناديق بيضاء معزولة تُحمَّل في شاحنة مبرّدة على رصيف التحميل عند الفجر',
        },
    },
    {
        id: 'photo-harvest',
        src: '/images/photos/harvest.webp',
        srcSmall: '/images/photos/harvest-800.webp',
        width: 1536,
        height: 1024,
        subject: 'farm',
        illustrative: true,
        alt: {
            en: 'Two workers pulling a seine net with tilapia to the bank of an earthen pond',
            ar: 'عاملان يسحبان شبكة جرّ فيها أسماك بلطي إلى ضفة حوض ترابي',
        },
    },
    {
        id: 'photo-delta-landscape',
        src: '/images/photos/delta-landscape.webp',
        srcSmall: '/images/photos/delta-landscape-800.webp',
        width: 1817,
        height: 866,
        subject: 'farm',
        illustrative: true,
        alt: {
            en: 'Aerial view of earthen fish ponds with paddlewheel aerators in the Nile Delta',
            ar: 'منظر جوي لأحواض سمكية ترابية تعمل فيها بدّالات تهوية في دلتا النيل',
        },
    },
    {
        id: 'photo-ice-texture',
        src: '/images/photos/ice-texture.webp',
        srcSmall: '/images/photos/ice-texture-800.webp',
        width: 1672,
        height: 941,
        subject: 'texture',
        illustrative: true,
        alt: { en: 'Close-up of crushed flake ice', ar: 'لقطة قريبة لثلج مجروش' },
    },
];

const byId = new Map(media.map((m) => [m.id, m]));

/** Look up a manifest entry. Throws on an unknown id so typos fail fast. */
export function getMedia(id: string): MediaItem {
    const item = byId.get(id);
    if (!item) throw new Error(`[v2 media] unknown id: ${id}`);
    return item;
}

/** Component-ready image props with alt in the right language (ar → Arabic, others → English). */
export function mediaImage(id: string, locale: string): ImageProps {
    const m = getMedia(id);
    return { src: m.src, width: m.width, height: m.height, alt: locale === 'ar' ? m.alt.ar : m.alt.en, cutout: m.cutout };
}

export function mediaBySubject(subject: MediaSubject): MediaItem[] {
    return media.filter((m) => m.subject === subject);
}

/** Manifest id of the product photo for a data/products.ts slug, if one exists. */
export function productMediaId(slug: string): string | undefined {
    return media.find((m) => m.subject === 'product' && m.tags?.includes(slug))?.id;
}
