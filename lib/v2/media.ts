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
import type { Locale } from '@/i18n-config';

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
    /** Alt text in every site locale (describe only what is visible) */
    alt: Record<Locale, string>;
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
    // Alt text uses the short species names of locales/<locale>/data/products.json (same names on every page).
    {
        id: 'species-tilapia',
        src: '/images/species/tilapia.webp',
        srcSmall: '/images/species/tilapia-800.webp',
        width: 1600,
        height: 1200,
        subject: 'product',
        tags: ['tilapia'],
        cutout: true,
        alt: {
            en: 'Whole tilapia, side view',
            ar: 'سمكة بلطي كاملة، منظر جانبي',
            es: 'Tilapia entera, vista lateral',
            ru: 'Тилапия целиком, вид сбоку',
            de: 'Ganze Tilapia, Seitenansicht',
            fr: 'Tilapia entier, vue de profil',
        },
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
        alt: {
            en: 'Whole sea bass, side view',
            ar: 'سمكة قاروص كاملة، منظر جانبي',
            es: 'Lubina entera, vista lateral',
            ru: 'Лаврак (сибас) целиком, вид сбоку',
            de: 'Ganzer Wolfsbarsch, Seitenansicht',
            fr: 'Bar entier, vue de profil',
        },
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
        alt: {
            en: 'Whole grey mullet, side view',
            ar: 'سمكة بوري كاملة، منظر جانبي',
            es: 'Mújol entero, vista lateral',
            ru: 'Кефаль-лобан целиком, вид сбоку',
            de: 'Ganze Großkopfmeeräsche, Seitenansicht',
            fr: 'Mulet cabot entier, vue de profil',
        },
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
        alt: {
            en: 'Whole grass carp, side view',
            ar: 'سمكة حشايش كاملة، منظر جانبي',
            es: 'Carpa herbívora entera, vista lateral',
            ru: 'Белый амур целиком, вид сбоку',
            de: 'Ganzer Graskarpfen, Seitenansicht',
            fr: 'Carpe amour entière, vue de profil',
        },
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
        alt: {
            en: 'Whole common carp, side view',
            ar: 'سمكة قشرة كاملة، منظر جانبي',
            es: 'Carpa común entera, vista lateral',
            ru: 'Карп целиком, вид сбоку',
            de: 'Ganzer Karpfen, Seitenansicht',
            fr: 'Carpe commune entière, vue de profil',
        },
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
        alt: {
            en: 'Whole catfish, side view',
            ar: 'سمكة قراميط كاملة، منظر جانبي',
            es: 'Pez gato africano entero, vista lateral',
            ru: 'Африканский клариевый сом целиком, вид сбоку',
            de: 'Ganzer Afrikanischer Raubwels, Seitenansicht',
            fr: 'Poisson-chat africain entier, vue de profil',
        },
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
        alt: {
            en: 'Whole meagre, side view',
            ar: 'سمكة لوت كاملة، منظر جانبي',
            es: 'Corvina entera, vista lateral',
            ru: 'Горбыль целиком, вид сбоку',
            de: 'Ganzer Adlerfisch, Seitenansicht',
            fr: 'Maigre entier, vue de profil',
        },
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
        alt: {
            en: 'Whole thinlip mullet, side view',
            ar: 'سمكة طوبار كاملة، منظر جانبي',
            es: 'Morragute entero, vista lateral',
            ru: 'Тонкогубая кефаль целиком, вид сбоку',
            de: 'Ganze Dünnlippige Meeräsche, Seitenansicht',
            fr: 'Mulet porc entier, vue de profil',
        },
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
        alt: {
            en: 'Whole bayad catfish, side view',
            ar: 'سمكة بياض كاملة، منظر جانبي',
            es: 'Bagre bayad entero, vista lateral',
            ru: 'Багрус (Bagrus bajad) целиком, вид сбоку',
            de: 'Ganzer Bagrus-Wels (Bagrus bajad), Seitenansicht',
            fr: 'Bagre bayad entier, vue de profil',
        },
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
        alt: {
            en: 'Whole silver carp, side view',
            ar: 'سمكة سلفر كاملة، منظر جانبي',
            es: 'Carpa plateada entera, vista lateral',
            ru: 'Белый толстолобик целиком, вид сбоку',
            de: 'Ganzer Silberkarpfen, Seitenansicht',
            fr: 'Carpe argentée entière, vue de profil',
        },
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
        alt: {
            en: 'Whole mirror carp, side view',
            ar: 'سمكة مبروكة كاملة، منظر جانبي',
            es: 'Carpa espejo entera, vista lateral',
            ru: 'Зеркальный карп целиком, вид сбоку',
            de: 'Ganzer Spiegelkarpfen, Seitenansicht',
            fr: 'Carpe miroir entière, vue de profil',
        },
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
        alt: {
            en: 'Whole sea bream, side view',
            ar: 'سمكة دنيس كاملة، منظر جانبي',
            es: 'Dorada entera, vista lateral',
            ru: 'Дорада целиком, вид сбоку',
            de: 'Ganze Dorade, Seitenansicht',
            fr: 'Dorade royale entière, vue de profil',
        },
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
            es: 'Estanques de tierra para peces con un aireador de paletas al amanecer en el delta del Nilo',
            ru: 'Земляные рыбоводные пруды с лопастным аэратором на рассвете в дельте Нила',
            de: 'Fischteiche aus Erde mit einem Schaufelradbelüfter bei Sonnenaufgang im Nildelta',
            fr: 'Bassins piscicoles en terre avec un aérateur à palettes au lever du soleil dans le delta du Nil',
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
            es: 'Dos tilapias frescas enteras sobre hielo picado en una caja isotérmica blanca',
            ru: 'Две целые свежие тилапии на колотом льду в белом изотермическом ящике',
            de: 'Zwei ganze frische Tilapia auf zerstoßenem Eis in einer weißen Isolierbox',
            fr: 'Deux tilapias frais entiers sur de la glace pilée dans une caisse isotherme blanche',
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
            es: 'Manos con guantes colocan una tilapia entera en una caja con hielo picado sobre una mesa de acero inoxidable',
            ru: 'Руки в перчатках кладут целую тилапию в ящик с колотым льдом на столе из нержавеющей стали',
            de: 'Hände in Handschuhen legen eine ganze Tilapia in eine Kiste mit zerstoßenem Eis auf einem Edelstahltisch',
            fr: 'Des mains gantées placent un tilapia entier dans une caisse de glace pilée sur une table en inox',
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
            es: 'Una mano con guante comprueba la temperatura de la mezcla de agua y hielo alrededor de tilapias frescas enteras',
            ru: 'Рука в перчатке проверяет температуру водно-ледяной смеси вокруг целых свежих тилапий',
            de: 'Eine Hand im Handschuh prüft die Temperatur des Eiswassers rund um ganze frische Tilapia',
            fr: 'Une main gantée contrôle la température du mélange d\'eau et de glace autour de tilapias frais entiers',
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
            es: 'Un palé de cajas isotérmicas blancas se carga en un camión frigorífico en un muelle de carga al amanecer',
            ru: 'Поддон с белыми изотермическими ящиками загружают в рефрижератор у погрузочной рампы на рассвете',
            de: 'Eine Palette mit weißen Isolierboxen wird im Morgengrauen an einer Laderampe in einen Kühl-Lkw geladen',
            fr: 'Une palette de caisses isothermes blanches chargée dans un camion frigorifique à un quai de chargement à l\'aube',
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
            es: 'Dos trabajadores arrastran una red de cerco con tilapias hacia la orilla de un estanque de tierra',
            ru: 'Двое рабочих тянут невод с тилапией к берегу земляного пруда',
            de: 'Zwei Arbeiter ziehen ein Zugnetz mit Tilapia an das Ufer eines Erdteichs',
            fr: 'Deux ouvriers tirent une senne avec des tilapias vers la berge d\'un bassin en terre',
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
            es: 'Vista aérea de estanques de tierra para peces con aireadores de paletas en el delta del Nilo',
            ru: 'Вид сверху на земляные рыбоводные пруды с лопастными аэраторами в дельте Нила',
            de: 'Luftaufnahme von Fischteichen aus Erde mit Schaufelradbelüftern im Nildelta',
            fr: 'Vue aérienne de bassins piscicoles en terre avec des aérateurs à palettes dans le delta du Nil',
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
        alt: {
            en: 'Close-up of crushed flake ice',
            ar: 'لقطة قريبة لثلج مجروش',
            es: 'Primer plano de hielo en escamas',
            ru: 'Крупный план чешуйчатого льда',
            de: 'Nahaufnahme von Scherbeneis',
            fr: 'Gros plan sur de la glace en paillettes',
        },
    },
];

const byId = new Map(media.map((m) => [m.id, m]));

/** Look up a manifest entry. Throws on an unknown id so typos fail fast. */
export function getMedia(id: string): MediaItem {
    const item = byId.get(id);
    if (!item) throw new Error(`[v2 media] unknown id: ${id}`);
    return item;
}

/** Component-ready image props with alt in the page locale (English for an unknown locale). */
export function mediaImage(id: string, locale: string): ImageProps {
    const m = getMedia(id);
    const alt = m.alt[locale as Locale] ?? m.alt.en;
    return { src: m.src, width: m.width, height: m.height, alt, cutout: m.cutout };
}

export function mediaBySubject(subject: MediaSubject): MediaItem[] {
    return media.filter((m) => m.subject === subject);
}

/** Manifest id of the product photo for a data/products.ts slug, if one exists. */
export function productMediaId(slug: string): string | undefined {
    return media.find((m) => m.subject === 'product' && m.tags?.includes(slug))?.id;
}
