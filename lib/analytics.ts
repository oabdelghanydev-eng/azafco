/**
 * Lead / conversion tracking helper.
 *
 * One function, `trackEvent`, sends the same event to:
 *   - Google Analytics 4 (via `window.gtag`, only if the GA4 script has loaded
 *     AND the visitor accepted analytics cookies in the consent banner,
 *     see lib/consent.ts), and
 *   - Vercel Web Analytics custom events (`track` from `@vercel/analytics`;
 *     cookieless, no personal data, so it does not need the banner).
 *
 * Privacy: params must never contain personal data. Values that look like an
 * email address or a phone number are dropped before sending, and only flat
 * string / number / boolean values are forwarded.
 */
import { track } from '@vercel/analytics';
import { hasAnalyticsConsent } from '@/lib/consent';

export type LeadEventName =
    | 'whatsapp_click'
    | 'phone_click'
    | 'email_click'
    | 'contact_cta_click'
    | 'quote_form_open'
    | 'generate_lead';

export type TrackParams = Record<string, string | number | boolean | null | undefined>;

type Gtag = (...args: unknown[]) => void;

declare global {
    interface Window {
        gtag?: Gtag;
    }
}

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
// 7+ digits, optionally separated by spaces, dashes, dots or parentheses, optional leading +
const PHONE_RE = /\+?\d[\d\s().-]{6,}\d/;

/** Remove empty values and anything that looks like personal data. */
export function sanitizeParams(params: TrackParams = {}): Record<string, string | number | boolean> {
    const out: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined || value === '') continue;
        if (typeof value === 'string') {
            if (EMAIL_RE.test(value) || PHONE_RE.test(value)) continue;
            out[key] = value.slice(0, 255);
        } else {
            out[key] = value;
        }
    }
    return out;
}

/**
 * GA4 is usable only when gtag is defined, the visitor granted analytics
 * consent, and the property is not opted out.
 */
function gaAvailable(): boolean {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
    if (!hasAnalyticsConsent()) return false;
    // Also respect GA's standard opt-out flag (`window['ga-disable-G-XXXX'] = true`).
    const w = window as unknown as Record<string, unknown>;
    return !Object.keys(w).some((k) => k.startsWith('ga-disable-') && w[k] === true);
}

/**
 * Send a lead/conversion event to GA4 and Vercel Analytics.
 * Safe to call on the server or before analytics scripts load (it no-ops).
 */
export function trackEvent(name: LeadEventName | string, params: TrackParams = {}): void {
    if (typeof window === 'undefined') return;
    const clean = sanitizeParams(params);

    try {
        if (gaAvailable()) window.gtag!('event', name, clean);
    } catch {
        /* never break the UI because of analytics */
    }

    try {
        track(name, clean);
    } catch {
        /* ignore */
    }
}

/**
 * Page context shared by every lead event: path without query string,
 * locale (first path segment, localePrefix is 'always'), and the species or
 * market slug when on /products/[slug] or /markets/[slug].
 */
export function pageContext(pathname: string, fallbackLocale?: string): TrackParams {
    const segments = pathname.split('/').filter(Boolean);
    const locale = segments[0] && /^[a-z]{2}$/.test(segments[0]) ? segments[0] : fallbackLocale;
    const rest = locale === segments[0] ? segments.slice(1) : segments;
    return {
        page_path: pathname,
        locale,
        species: rest[0] === 'products' && rest[1] ? rest[1] : undefined,
        market: rest[0] === 'markets' && rest[1] ? rest[1] : undefined,
    };
}
