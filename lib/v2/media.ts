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
    /** Owner follow-up attached to this photo (consent, species, etc.) */
    note?: string;
}

/** Shape accepted by v2 components (PageHero, ProductCard, MediaGallery…) */
export interface ImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
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
    // ── Product close-ups (tags = data/products.ts slugs) ──────────────────
    {
        id: 'product-tilapia-whole',
        src: v2('product-tilapia-whole'),
        srcSmall: v2s('product-tilapia-whole'),
        width: 960,
        height: 720,
        subject: 'product',
        tags: ['tilapia'],
        alt: { en: 'Close-up of whole fresh tilapia', ar: 'لقطة قريبة لأسماك بلطي طازجة كاملة' },
    },
    {
        id: 'product-sea-bass-whole',
        src: v2('product-sea-bass-whole'),
        srcSmall: v2s('product-sea-bass-whole'),
        width: 960,
        height: 720,
        subject: 'product',
        tags: ['sea-bass'],
        alt: { en: 'Whole fresh sea bass laid together', ar: 'أسماك قاروص طازجة كاملة مرصوصة معًا' },
    },
    {
        id: 'product-mullet-whole',
        src: v2('product-mullet-whole'),
        srcSmall: v2s('product-mullet-whole'),
        width: 960,
        height: 720,
        subject: 'product',
        tags: ['mullet'],
        alt: { en: 'Whole fresh mullet with silver scales', ar: 'أسماك بوري طازجة كاملة بقشور فضية' },
    },
    {
        id: 'product-carp-whole',
        src: v2('product-carp-whole'),
        srcSmall: v2s('product-carp-whole'),
        width: 1024,
        height: 768,
        subject: 'product',
        tags: ['common-carp'],
        alt: { en: 'Whole fresh carp in a lined box', ar: 'أسماك مبروك طازجة كاملة داخل صندوق مبطن' },
    },
    {
        id: 'product-catfish-whole',
        src: v2('product-catfish-whole'),
        srcSmall: v2s('product-catfish-whole'),
        width: 960,
        height: 720,
        subject: 'product',
        tags: ['catfish'],
        alt: { en: 'Whole fresh catfish in a lined box', ar: 'أسماك قرموط طازجة كاملة داخل صندوق مبطن' },
    },
    {
        id: 'product-meagre-whole',
        src: v2('product-meagre-whole'),
        srcSmall: v2s('product-meagre-whole'),
        width: 960,
        height: 720,
        subject: 'product',
        tags: ['meagre'],
        alt: { en: 'Whole fresh meagre on a steel rack', ar: 'أسماك لوت طازجة كاملة على حامل معدني' },
    },
    {
        id: 'product-eel-whole',
        src: v2('product-eel-whole'),
        srcSmall: v2s('product-eel-whole'),
        width: 960,
        height: 720,
        subject: 'product',
        tags: ['eel'],
        alt: { en: 'Whole fresh eels in a lined box', ar: 'أسماك ثعابين طازجة كاملة داخل صندوق مبطن' },
        note: 'Owner to confirm eel is still sold.',
    },
    {
        id: 'product-buni-crate',
        src: v2('product-buni-crate'),
        srcSmall: v2s('product-buni-crate'),
        width: 960,
        height: 720,
        subject: 'product',
        tags: ['buni'],
        alt: { en: 'Whole fresh fish in a plastic crate', ar: 'أسماك طازجة كاملة داخل صندوق بلاستيكي' },
        note: 'Species deliberately not named: looks like grass carp, owner to confirm (T-001).',
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
    return { src: m.src, width: m.width, height: m.height, alt: locale === 'ar' ? m.alt.ar : m.alt.en };
}

export function mediaBySubject(subject: MediaSubject): MediaItem[] {
    return media.filter((m) => m.subject === subject);
}

/** Manifest id of the product photo for a data/products.ts slug, if one exists. */
export function productMediaId(slug: string): string | undefined {
    return media.find((m) => m.subject === 'product' && m.tags?.includes(slug))?.id;
}
