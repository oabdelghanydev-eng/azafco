/**
 * Design G nav items (plain module: safe to import from server and client files).
 * Every item links to its own page (G_NAV_ROUTE), on home as everywhere else.
 */
import { routes } from '@/lib/v2/routes';

export const G_NAV_KEYS = ['about', 'fish', 'chain', 'quality', 'markets'] as const;
export type GNavKey = (typeof G_NAV_KEYS)[number] | 'contact';

/** Header order: the five board items, then Contact */
export const G_NAV_KEYS_WITH_CONTACT: readonly GNavKey[] = [...G_NAV_KEYS, 'contact'];

/** Real route behind each board anchor (inner pages link here). */
export const G_NAV_ROUTE: Record<GNavKey, string> = {
    about: routes.about,
    fish: routes.products,
    chain: routes.processing,
    quality: routes.quality,
    markets: routes.markets,
    contact: routes.contact,
};

/**
 * Routes whose page already lists every contact channel (WhatsApp, email, form):
 * the footer contact block and the WhatsApp float are not repeated there.
 */
export const CONTACT_PAGES: readonly string[] = [routes.contact, routes.rfq];

export function listsContactChannels(pathname: string): boolean {
    return CONTACT_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
