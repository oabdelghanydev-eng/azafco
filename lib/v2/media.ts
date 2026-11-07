/**
 * Site v2 media manifest. Real AZAFCO photos only (no stock).
 * Files are produced by `node scripts/v2-images.mjs` into public/images/v2/.
 * Alt text describes only what is visible. Do not add claims (certificates,
 * capacity, markets, visiting organisations) to alt text or captions.
 *
 *   import { media, mediaImage, mediaBySubject } from '@/lib/v2/media';
 *   <PageHero image={mediaImage('processing-hall-team', locale)} … />
 */

export type MediaSubject =
    | 'facility' // factory buildings, exterior
    | 'processing' // processing hall, crew in hygiene gear
    | 'quality' // hygiene / inspection context (NOT proof of certification)
    | 'dispatch' // loading bays, refrigerated trucks
    | 'product' // fish close-ups
    | 'people'; // staff, visits, meetings

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

const v2 = (id: string) => `/images/v2/${id}.webp`;
const v2s = (id: string) => `/images/v2/${id}-640.webp`;

const PEOPLE_NOTE = 'Shows identifiable people: confirm consent before publishing (brief section 28).';

export const media: MediaItem[] = [
    // ── Facility / dispatch ────────────────────────────────────────────────
    {
        id: 'facility-exterior-night',
        src: v2('facility-exterior-night'),
        srcSmall: v2s('facility-exterior-night'),
        width: 1280,
        height: 720,
        subject: 'facility',
        tags: ['exterior', 'wide', 'night', 'hero'],
        alt: {
            en: 'Factory buildings and boundary wall lit at night, with a gate marked Gate 02',
            ar: 'مباني المصنع وسوره الخارجي مضاءة ليلًا، وبوابة مكتوب عليها Gate 02',
        },
    },
    {
        id: 'dispatch-truck-loading-bays-group',
        src: v2('dispatch-truck-loading-bays-group'),
        srcSmall: v2s('dispatch-truck-loading-bays-group'),
        width: 1280,
        height: 960,
        subject: 'dispatch',
        tags: ['exterior', 'truck', 'loading-bays', 'people', 'hero'],
        alt: {
            en: 'Staff and visitors standing in front of the factory loading bays beside a refrigerated truck branded Azafco International',
            ar: 'عاملون وزوار أمام أرصفة التحميل بالمصنع بجوار شاحنة مبردة تحمل اسم ازافكو العالمية',
        },
        note: `${PEOPLE_NOTE} A child is visible. The truck shows the previous logo.`,
    },
    {
        id: 'dispatch-truck-loading-bays-wide',
        src: v2('dispatch-truck-loading-bays-wide'),
        srcSmall: v2s('dispatch-truck-loading-bays-wide'),
        width: 1280,
        height: 960,
        subject: 'dispatch',
        tags: ['exterior', 'truck', 'loading-bays', 'people'],
        alt: {
            en: 'Refrigerated truck branded Azafco International parked at the factory loading bays, with a line of people in front',
            ar: 'شاحنة مبردة تحمل اسم ازافكو العالمية متوقفة عند أرصفة التحميل بالمصنع، وأمامها صف من الأشخاص',
        },
        note: `${PEOPLE_NOTE} The truck shows the previous logo.`,
    },
    // ── Processing hall ────────────────────────────────────────────────────
    {
        id: 'processing-hall-team',
        src: v2('processing-hall-team'),
        srcSmall: v2s('processing-hall-team'),
        width: 1280,
        height: 960,
        subject: 'processing',
        tags: ['interior', 'team', 'hygiene', 'crates', 'hero'],
        alt: {
            en: 'Processing crew in navy uniforms, hairnets, masks and blue gloves with supervisors in a white-tiled hall, next to crates of fish on ice',
            ar: 'فريق التجهيز بزي كحلي وأغطية شعر وكمامات وقفازات زرقاء مع المشرفين داخل صالة مكسوة بالبلاط الأبيض، بجوار صناديق أسماك على الثلج',
        },
        note: PEOPLE_NOTE,
    },
    {
        id: 'processing-hall-team-crates',
        src: v2('processing-hall-team-crates'),
        srcSmall: v2s('processing-hall-team-crates'),
        width: 1280,
        height: 960,
        subject: 'processing',
        tags: ['interior', 'team', 'hygiene', 'crates'],
        alt: {
            en: 'Processing crew in hygiene gear gathered in a white-tiled hall beside stacked plastic crates',
            ar: 'فريق التجهيز بملابس السلامة الصحية داخل صالة مكسوة بالبلاط الأبيض بجوار صناديق بلاستيكية مرصوصة',
        },
        note: PEOPLE_NOTE,
    },
    {
        id: 'processing-crew-hygiene-gear',
        src: v2('processing-crew-hygiene-gear'),
        srcSmall: v2s('processing-crew-hygiene-gear'),
        width: 960,
        height: 1280,
        subject: 'processing',
        tags: ['interior', 'team', 'hygiene', 'portrait'],
        alt: {
            en: 'Processing crew in navy uniforms and red gloves in a white-tiled hall',
            ar: 'فريق التجهيز بزي كحلي وقفازات حمراء داخل صالة مكسوة بالبلاط الأبيض',
        },
        note: PEOPLE_NOTE,
    },
    {
        id: 'processing-area-visit-hygiene',
        src: v2('processing-area-visit-hygiene'),
        srcSmall: v2s('processing-area-visit-hygiene'),
        width: 720,
        height: 1280,
        subject: 'quality',
        tags: ['interior', 'visit', 'hygiene', 'portrait'],
        alt: {
            en: 'Visitors and staff wearing hairnets and face masks inside a white-tiled processing area',
            ar: 'زوار وعاملون يرتدون أغطية الشعر والكمامات داخل منطقة تجهيز مكسوة بالبلاط الأبيض',
        },
        note: `${PEOPLE_NOTE} Which visit this was must be confirmed before captioning.`,
    },
    {
        id: 'processing-area-entrance-visit',
        src: v2('processing-area-entrance-visit'),
        srcSmall: v2s('processing-area-entrance-visit'),
        width: 720,
        height: 1280,
        subject: 'quality',
        tags: ['interior', 'visit', 'hygiene', 'portrait'],
        alt: {
            en: 'People in hairnets walking through a white-tiled corridor towards a curtained doorway',
            ar: 'أشخاص يرتدون أغطية الشعر يسيرون في ممر مكسو بالبلاط الأبيض نحو مدخل بستارة شرائح',
        },
        note: PEOPLE_NOTE,
    },
    // ── People / corporate ─────────────────────────────────────────────────
    {
        id: 'meeting-room-visit',
        src: v2('meeting-room-visit'),
        srcSmall: v2s('meeting-room-visit'),
        width: 1280,
        height: 960,
        subject: 'people',
        tags: ['interior', 'meeting', 'visit'],
        alt: {
            en: 'Visitors and staff seated in a meeting room at the factory, facing a host at the front',
            ar: 'زوار وعاملون جالسون في قاعة اجتماعات بالمصنع يستمعون إلى المضيف في صدر القاعة',
        },
        note: `${PEOPLE_NOTE} Do not name the visiting organisation without approval.`,
    },
    {
        id: 'staff-recognition-group',
        src: v2('staff-recognition-group'),
        srcSmall: v2s('staff-recognition-group'),
        width: 1280,
        height: 960,
        subject: 'people',
        tags: ['interior', 'team', 'recognition'],
        alt: {
            en: 'Large group of factory staff in blue jackets holding certificates of appreciation in a meeting hall',
            ar: 'مجموعة كبيرة من عاملي المصنع بسترات زرقاء يحملون شهادات تقدير داخل قاعة اجتماعات',
        },
        note: PEOPLE_NOTE,
    },
    {
        id: 'staff-certificate-handover',
        src: v2('staff-certificate-handover'),
        srcSmall: v2s('staff-certificate-handover'),
        width: 960,
        height: 1280,
        subject: 'people',
        tags: ['interior', 'recognition', 'portrait'],
        alt: {
            en: 'Two men holding a certificate of appreciation beside an Egyptian flag, with stacks of blue jackets on the table',
            ar: 'رجلان يحملان شهادة تقدير بجوار علم مصر، وعلى الطاولة رزم من السترات الزرقاء',
        },
        note: PEOPLE_NOTE,
    },
    // ── Species cut-outs (owner set, 7 Nov 2026; transparent, 4:3; tags = data/products.ts slugs) ──
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
        alt: { en: 'Whole European sea bass, side view', ar: 'سمكة قاروص كاملة، منظر جانبي' },
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
        alt: { en: 'Whole flathead grey mullet, side view', ar: 'سمكة بوري كاملة، منظر جانبي' },
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
        alt: { en: 'Whole African catfish, side view', ar: 'سمكة قراميط كاملة، منظر جانبي' },
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
        alt: { en: 'Whole gilthead sea bream, side view', ar: 'سمكة دنيس كاملة، منظر جانبي' },
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
