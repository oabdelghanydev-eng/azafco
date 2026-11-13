/**
 * Site v2 route map. Paths are locale-less: pass them to the next-intl `Link`
 * from '@/navigation' (or `<Button href>`), which adds /ar, /en, ...
 *
 *   import { routes, productHref, rfqHref } from '@/lib/v2/routes';
 *   <Link href={routes.processing}>…</Link>
 *   <Button href={rfqHref({ product: 'tilapia', type: 'product' })}>…</Button>
 */
export const routes = {
    home: '/',
    seafood: '/seafood',
    products: '/products',
    processing: '/processing',
    quality: '/quality',
    markets: '/markets',
    forImporters: '/for-importers',
    about: '/about',
    businesses: '/businesses',
    insights: '/insights',
    contact: '/contact',
    rfq: '/requirements',
    privacy: '/privacy-policy',
} as const;

export type RouteKey = keyof typeof routes;
export type StaticRoute = (typeof routes)[RouteKey];

/** /products/[slug] */
export function productHref(slug: string): string {
    return `${routes.products}/${encodeURIComponent(slug)}`;
}

/** /insights/[slug] */
export function insightHref(slug: string): string {
    return `${routes.insights}/${encodeURIComponent(slug)}`;
}

/** Enquiry type preselected on the RFQ form. `corporate` must not force a species. */
export type RfqType = 'product' | 'market' | 'specifications' | 'documents' | 'corporate' | 'general';

export interface RfqPrefill {
    /** Product slug (as in data/products.ts), e.g. 'tilapia' */
    product?: string;
    /** ISO 3166-1 alpha-2 country code, e.g. 'KW' */
    country?: string;
    type?: RfqType;
    /** Product form code (lib/v2/specs FORM_KINDS), e.g. 'fresh_whole'. Applied only if the RFQ offers it. */
    form?: string;
    /** Free-text size grade, e.g. 'Medium (300–500 g)'. Goes into the grade field. */
    grade?: string;
}

/** Query-param names the RFQ page reads. Keep in sync with the RFQ form. */
export const rfqParams = { product: 'product', country: 'country', type: 'type', form: 'form', grade: 'grade' } as const;

/** Same limit as the RFQ grade field (components/v2/rfq/schema.ts LIMITS.grade). */
const GRADE_MAX = 120;

/**
 * Build an /rfq link with prefill params.
 *   rfqHref()                                  -> '/requirements'
 *   rfqHref({ product: 'sea-bass' })           -> '/requirements?product=sea-bass'
 *   rfqHref({ country: 'kw', type: 'market' }) -> '/requirements?country=KW&type=market'
 *   rfqHref({ product: 'tilapia', type: 'product', form: 'fresh_whole', grade: 'Medium (300–500 g)' })
 */
export function rfqHref(prefill: RfqPrefill = {}): string {
    const qs = new URLSearchParams();
    if (prefill.product) qs.set(rfqParams.product, prefill.product);
    if (prefill.country) qs.set(rfqParams.country, prefill.country.toUpperCase());
    if (prefill.type) qs.set(rfqParams.type, prefill.type);
    if (prefill.form) qs.set(rfqParams.form, prefill.form);
    if (prefill.grade) qs.set(rfqParams.grade, prefill.grade.slice(0, GRADE_MAX));
    const q = qs.toString();
    return q ? `${routes.rfq}?${q}` : routes.rfq;
}

/** Read prefill back on the RFQ page (server: pass `await searchParams`). */
export function readRfqPrefill(params: Record<string, string | string[] | undefined>): RfqPrefill {
    const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
    const type = one(params[rfqParams.type]);
    const allowed: RfqType[] = ['product', 'market', 'specifications', 'documents', 'corporate', 'general'];
    return {
        product: one(params[rfqParams.product]),
        country: one(params[rfqParams.country])?.toUpperCase(),
        type: type && (allowed as string[]).includes(type) ? (type as RfqType) : undefined,
        form: one(params[rfqParams.form])?.toLowerCase().replace(/[^a-z_]/g, '').slice(0, 40) || undefined,
        grade: one(params[rfqParams.grade])?.trim().slice(0, GRADE_MAX) || undefined,
    };
}

/** True if `pathname` (locale-less, from usePathname) is the route or below it. */
export function isActivePath(pathname: string, href: string): boolean {
    if (href === routes.home) return pathname === '/' || pathname === '';
    return pathname === href || pathname.startsWith(`${href}/`);
}
