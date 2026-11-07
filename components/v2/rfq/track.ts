/**
 * Analytics for the RFQ page: clicks on the email / WhatsApp / phone actions.
 *   rfq_email_click, rfq_whatsapp_click, rfq_phone_click, rfq_email_copy
 * Params: rfq_type, species (slug), destination (ISO). No personal data.
 *
 * The repo has no lib/analytics in this branch, so this calls window.gtag
 * directly and does nothing if GA is blocked or not loaded.
 * TODO(lead): switch to `trackEvent` from lib/analytics once PR #12 lands.
 */

type Params = Record<string, string | number | boolean | undefined>;
// Local cast instead of a global Window augmentation (avoids clashing with other declarations)
type GtagWindow = { gtag?: (...args: unknown[]) => void };

export type RfqEvent = 'rfq_email_click' | 'rfq_whatsapp_click' | 'rfq_phone_click';

export function trackRfq(event: RfqEvent, params: Params = {}) {
    if (typeof window === 'undefined') return;
    try {
        const clean: Params = { page_path: window.location.pathname };
        for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') clean[k] = v;
        (window as unknown as GtagWindow).gtag?.('event', event, clean);
    } catch {
        /* analytics must never break the page */
    }
}
