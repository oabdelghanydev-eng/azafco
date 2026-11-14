/**
 * Design G nav items (plain module: safe to import from server and client files).
 * Every item links to its own page (G_NAV_ROUTE), on home as everywhere else.
 */
import { routes } from '@/lib/v2/routes';

export const G_NAV_KEYS = ['about', 'fish', 'chain', 'quality', 'markets'] as const;
export type GNavKey = (typeof G_NAV_KEYS)[number] | 'contact';

/** Header order: the five board items, then Contact */
export const G_NAV_KEYS_WITH_CONTACT: readonly GNavKey[] = [...G_NAV_KEYS, 'contact'];

/** Footer only: two more pages the header does not list (internal links to /seafood and /insights). */
export const G_FOOTER_EXTRA_KEYS = ['seafood', 'insights'] as const;
export type GFooterExtraKey = (typeof G_FOOTER_EXTRA_KEYS)[number];
export type GFooterNavKey = (typeof G_NAV_KEYS)[number] | GFooterExtraKey;

/** Footer order: the five board items, then Seafood and Insights. */
export const G_FOOTER_NAV_KEYS: readonly GFooterNavKey[] = [...G_NAV_KEYS, ...G_FOOTER_EXTRA_KEYS];

/** Real route behind each nav item (header and footer). */
export const G_NAV_ROUTE: Record<GNavKey | GFooterExtraKey, string> = {
    about: routes.about,
    fish: routes.products,
    chain: routes.processing,
    quality: routes.quality,
    markets: routes.markets,
    contact: routes.contact,
    seafood: routes.seafood,
    insights: routes.insights,
};

/**
 * Routes whose page already lists every contact channel (WhatsApp, email, form):
 * the footer contact block and the WhatsApp float are not repeated there.
 */
export const CONTACT_PAGES: readonly string[] = [routes.contact, routes.rfq];

export function listsContactChannels(pathname: string): boolean {
    return CONTACT_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
