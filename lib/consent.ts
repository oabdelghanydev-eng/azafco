/**
 * Cookie consent state + Google Consent Mode v2.
 *
 * - The consent DEFAULT (everything denied) is set by an inline script in
 *   <head> (`CONSENT_DEFAULT_SCRIPT`) before gtag('config') runs.
 * - The visitor's choice is kept in localStorage under `CONSENT_STORAGE_KEY`
 *   ('granted' | 'denied'); every access is wrapped in try/catch so private
 *   windows / blocked storage just mean "no choice yet".
 * - Only analytics_storage is ever granted. ad_storage, ad_user_data and
 *   ad_personalization stay denied: the site runs no ads.
 */

export type ConsentChoice = 'granted' | 'denied';

export const CONSENT_STORAGE_KEY = 'azafco_consent_v1';
/** Fired on window after the visitor makes a choice (detail: ConsentChoice). */
export const CONSENT_CHANGE_EVENT = 'azafco:consent-change';
/** Fired on window to reopen the banner (footer "Cookie settings" link). */
export const CONSENT_OPEN_EVENT = 'azafco:consent-open';

type GtagFn = (...args: unknown[]) => void;

export function getStoredConsent(): ConsentChoice | null {
    if (typeof window === 'undefined') return null;
    try {
        const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        return v === 'granted' || v === 'denied' ? v : null;
    } catch {
        return null;
    }
}

export function hasAnalyticsConsent(): boolean {
    return getStoredConsent() === 'granted';
}

export function setConsent(choice: ConsentChoice): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
        /* storage blocked: the choice applies to this page view only */
    }
    try {
        document.documentElement.dataset.consent = choice;
    } catch {
        /* ignore */
    }
    try {
        const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                analytics_storage: choice,
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
            });
        }
    } catch {
        /* never break the UI because of analytics */
    }
    window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_CHANGE_EVENT, { detail: choice }));
}

/** Reopen the consent banner (used by the footer "Cookie settings" link). */
export function openConsentSettings(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/**
 * Inline <head> script. Runs before gtag.js / gtag('config'):
 * defines dataLayer + gtag, sets every consent type to denied, then re-applies
 * a stored "granted" choice and marks <html data-consent> so the SSR banner
 * stays hidden for visitors who already chose.
 */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
gtag('set','ads_data_redaction',true);
try{var c=localStorage.getItem('${CONSENT_STORAGE_KEY}');
if(c==='granted'||c==='denied'){document.documentElement.setAttribute('data-consent',c);}
if(c==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}
`.trim();
