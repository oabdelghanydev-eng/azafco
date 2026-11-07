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
    rfq: '/rfq',
    rfqThankYou: '/rfq/thank-you',
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
export type RfqType = 'product' | 'market' | 'specifications' | 'corporate' | 'general';

export interface RfqPrefill {
    /** Product slug (as in data/products.ts), e.g. 'tilapia' */
    product?: string;
    /** ISO 3166-1 alpha-2 country code, e.g. 'KW' */
    country?: string;
    type?: RfqType;
}

/** Query-param names the RFQ page reads. Keep in sync with the RFQ form. */
export const rfqParams = { product: 'product', country: 'country', type: 'type' } as const;

/**
 * Build an /rfq link with prefill params.
 *   rfqHref()                                  -> '/rfq'
 *   rfqHref({ product: 'sea-bass' })           -> '/rfq?product=sea-bass'
 *   rfqHref({ country: 'kw', type: 'market' }) -> '/rfq?country=KW&type=market'
 */
export function rfqHref(prefill: RfqPrefill = {}): string {
    const qs = new URLSearchParams();
    if (prefill.product) qs.set(rfqParams.product, prefill.product);
    if (prefill.country) qs.set(rfqParams.country, prefill.country.toUpperCase());
    if (prefill.type) qs.set(rfqParams.type, prefill.type);
    const q = qs.toString();
    return q ? `${routes.rfq}?${q}` : routes.rfq;
}

/** Read prefill back on the RFQ page (server: pass `await searchParams`). */
export function readRfqPrefill(params: Record<string, string | string[] | undefined>): RfqPrefill {
    const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
    const type = one(params[rfqParams.type]);
    const allowed: RfqType[] = ['product', 'market', 'specifications', 'corporate', 'general'];
    return {
        product: one(params[rfqParams.product]),
        country: one(params[rfqParams.country])?.toUpperCase(),
        type: type && (allowed as string[]).includes(type) ? (type as RfqType) : undefined,
    };
}

/** True if `pathname` (locale-less, from usePathname) is the route or below it. */
export function isActivePath(pathname: string, href: string): boolean {
    if (href === routes.home) return pathname === '/' || pathname === '';
    return pathname === href || pathname.startsWith(`${href}/`);
}
