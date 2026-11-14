/**
 * Analytics consent without a banner.
 *
 * - Google Analytics runs with Consent Mode v2. Default: granted, except in the
 *   EEA, the UK and Switzerland (CONSENT_DENIED_REGIONS), where it is denied
 *   (cookieless pings only) unless the visitor turns analytics on.
 * - A visitor can turn analytics on or off for their browser on the privacy page
 *   (components/v2/AnalyticsChoice.tsx, linked as "Cookie settings" in the footer).
 *   The choice is kept in localStorage and applied on every page by the inline GA
 *   snippet in app/[locale]/layout.tsx and by components/v2/ClarityLoader.tsx.
 *
 * Plain module (no 'use client'): the server layout imports the constants, and the
 * client components import the helpers.
 */

/** localStorage key holding 'granted' or 'denied'. */
export const CONSENT_STORAGE_KEY = 'azafco-consent';
export type ConsentChoice = 'granted' | 'denied';

/** Consent Mode v2 types, switched together. */
export const CONSENT_TYPES = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'] as const;

/** ISO 3166-1 codes where analytics default to denied: EU, EEA, UK, Switzerland. */
export const CONSENT_DENIED_REGIONS = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
    'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO',
    'GB', 'CH',
] as const;

/** Fired on window when the visitor changes the choice on the privacy page. */
export const CONSENT_EVENT = 'azafco-consent-change';

type ConsentWindow = Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
};

export function readChoice(): ConsentChoice | null {
    try {
        const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        return v === 'granted' || v === 'denied' ? v : null;
    } catch {
        return null;
    }
}

export function storeChoice(choice: ConsentChoice) {
    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
        /* storage blocked: the choice applies to this page view only */
    }
}

/** Consent Mode update; works even before gtag.js has loaded (same dataLayer queue). */
export function updateGtag(choice: ConsentChoice) {
    const w = window as ConsentWindow;
    w.dataLayer = w.dataLayer || [];
    const gtag =
        w.gtag ??
        function gtag() {
            // eslint-disable-next-line prefer-rest-params
            w.dataLayer!.push(arguments);
        };
    gtag('consent', 'update', Object.fromEntries(CONSENT_TYPES.map((k) => [k, choice])));
}

/** Microsoft Clarity tag. `granted` sends Clarity's consent signal for cookies. */
export function loadClarity(id: string, granted: boolean) {
    const w = window as ConsentWindow;
    if (!id) return;
    if (!document.getElementById('clarity-script')) {
        w.clarity =
            w.clarity ||
            Object.assign(
                function clarity() {
                    // eslint-disable-next-line prefer-rest-params
                    (w.clarity!.q = w.clarity!.q || []).push(arguments);
                },
                { q: [] as unknown[] },
            );
        const s = document.createElement('script');
        s.id = 'clarity-script';
        s.async = true;
        s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}?ref=bwt`;
        document.head.appendChild(s);
    }
    if (granted) w.clarity?.('consentv2', { ad_Storage: 'granted', analytics_Storage: 'granted' });
}

export function revokeClarity() {
    const w = window as ConsentWindow;
    w.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
}
