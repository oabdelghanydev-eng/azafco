/**
 * Analytics for the RFQ form (brief §25 event dictionary):
 *   rfq_start, rfq_step_complete, qualified_rfq_submit, document_request.
 * No personal data is ever sent (no names, emails, phones, company names).
 *
 * The repo has no lib/analytics in this branch, so this calls window.gtag
 * directly and does nothing if GA is blocked or not loaded.
 * TODO(lead): switch to `trackEvent` from lib/analytics once PR #12 lands.
 */

type Params = Record<string, string | number | boolean | undefined>;
// Local cast instead of a global Window augmentation (avoids clashing with other declarations)
type GtagWindow = { gtag?: (...args: unknown[]) => void };

export function trackRfq(event: 'rfq_start' | 'rfq_step_complete' | 'qualified_rfq_submit' | 'document_request' | 'generate_lead', params: Params = {}) {
    if (typeof window === 'undefined') return;
    try {
        const clean: Params = { page_path: window.location.pathname };
        for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') clean[k] = v;
        (window as unknown as GtagWindow).gtag?.('event', event, clean);
    } catch {
        /* analytics must never break the form */
    }
}
