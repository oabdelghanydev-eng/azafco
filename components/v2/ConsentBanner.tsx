'use client';

/**
 * Cookie consent for GA4 (Consent Mode v2) and Microsoft Clarity.
 *
 * - The layout's GA inline script sets every consent type to 'denied' before
 *   `gtag('config')`, and re-grants at once if the visitor accepted on an earlier
 *   visit (same storage key as here), so GA only sends cookieless pings until then.
 * - Clarity is never loaded before consent: this component injects it after
 *   Accept, or on load when the stored choice is 'granted'.
 * - The choice is remembered in localStorage (try/catch: private modes may throw).
 *   No choice → the banner shows. It is a non-modal region at the bottom: it does
 *   not block the page or take focus, and Accept and Reject have equal weight.
 * - While it shows, the WhatsApp float (components/v2/WhatsAppFloat.tsx,
 *   data-cta="float_whatsapp") moves up by the banner's height through the CSS
 *   variable --azafco-consent-h and a rule rendered only while the banner is open.
 * - Re-open later: any element with [data-consent-open] (e.g. a "Cookie settings"
 *   link in the footer), or `window.dispatchEvent(new Event('azafco:consent-open'))`.
 *
 * Copy comes in as props from the server layout (v2.consent), so no messages ship.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Link } from '@/navigation';
import { cn, focusRingLight, typography } from '@/components/ui/tokens';
import { CONSENT_STORAGE_KEY, CONSENT_TYPES, type ConsentChoice } from './consent';

export interface ConsentBannerCopy {
    title: string;
    text: string;
    accept: string;
    reject: string;
    privacy: string;
}

export interface ConsentBannerProps {
    copy: ConsentBannerCopy;
    /** companyConfig.analytics.clarityId */
    clarityId: string;
    /** Locale-less privacy policy path (routes.privacy) */
    privacyHref: string;
}

type ConsentWindow = Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
};

function readChoice(): ConsentChoice | null {
    try {
        const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        return v === 'granted' || v === 'denied' ? v : null;
    } catch {
        return null;
    }
}

function storeChoice(choice: ConsentChoice) {
    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
        /* storage blocked: the choice applies to this page view only */
    }
}

function updateGtag(choice: ConsentChoice) {
    const w = window as ConsentWindow;
    // Same queue the GA snippet uses; works even if gtag.js has not loaded yet
    w.dataLayer = w.dataLayer || [];
    const gtag =
        w.gtag ??
        function gtag() {
            // eslint-disable-next-line prefer-rest-params
            w.dataLayer!.push(arguments);
        };
    gtag('consent', 'update', Object.fromEntries(CONSENT_TYPES.map((k) => [k, choice])));
}

/** Microsoft Clarity tag, injected only after consent. */
function loadClarity(id: string) {
    const w = window as ConsentWindow;
    if (!id || document.getElementById('clarity-script')) return;
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
    // Clarity consent API v2: tell Clarity that cookies are allowed
    w.clarity('consentv2', { ad_Storage: 'granted', analytics_Storage: 'granted' });
}

function revokeClarity() {
    const w = window as ConsentWindow;
    w.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
}

export default function ConsentBanner({ copy, clarityId, privacyHref }: ConsentBannerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLElement>(null);

    // Stored choice: apply it (Clarity) or show the banner
    useEffect(() => {
        const choice = readChoice();
        if (choice === 'granted') loadClarity(clarityId);
        else if (choice === null) setOpen(true);

        const reopen = () => setOpen(true);
        const onClick = (e: MouseEvent) => {
            const el = (e.target as Element | null)?.closest?.('[data-consent-open]');
            if (!el) return;
            e.preventDefault();
            reopen();
        };
        window.addEventListener('azafco:consent-open', reopen);
        document.addEventListener('click', onClick);
        return () => {
            window.removeEventListener('azafco:consent-open', reopen);
            document.removeEventListener('click', onClick);
        };
    }, [clarityId]);

    // Lift the WhatsApp float above the banner while it shows
    useEffect(() => {
        const root = document.documentElement;
        const el = ref.current;
        if (!open || !el) {
            root.style.removeProperty('--azafco-consent-h');
            return;
        }
        const set = () => root.style.setProperty('--azafco-consent-h', `${Math.ceil(el.getBoundingClientRect().height)}px`);
        set();
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(set) : null;
        ro?.observe(el);
        return () => {
            ro?.disconnect();
            root.style.removeProperty('--azafco-consent-h');
        };
    }, [open]);

    const choose = useCallback(
        (choice: ConsentChoice) => {
            storeChoice(choice);
            updateGtag(choice);
            if (choice === 'granted') loadClarity(clarityId);
            else revokeClarity();
            setOpen(false);
        },
        [clarityId],
    );

    if (!open) return null;

    return (
        <>
            <style>{`[data-cta="float_whatsapp"]{translate:0 calc(-1 * var(--azafco-consent-h, 0px))}`}</style>
            <section
                ref={ref}
                aria-labelledby="consent-title"
                data-surface="light"
                className="pointer-events-none fixed inset-x-0 bottom-0 z-bar px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-4 md:pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            >
                <div className="g-font pointer-events-auto mx-auto flex max-w-[760px] flex-col gap-4 rounded-card border border-solid border-line bg-white p-4 text-ink shadow-raised sm:flex-row sm:items-center sm:gap-6 sm:p-5">
                    <div className="min-w-0 flex-1">
                        <h2 id="consent-title" className={cn('m-0 text-ink', typography.h4)}>
                            {copy.title}
                        </h2>
                        <p className={cn('mb-0 mt-1 text-ink-muted', typography.small)}>
                            {copy.text}{' '}
                            <Link
                                href={privacyHref}
                                className={cn(
                                    'font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-navy-900',
                                    focusRingLight,
                                )}
                            >
                                {copy.privacy}
                            </Link>
                        </p>
                    </div>
                    {/* Equal weight: same variant, size and width for both choices */}
                    <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:flex">
                        <Button variant="navy" size="sm" className="sm:min-w-[7.5rem]" onClick={() => choose('denied')} dataAttrs={{ 'data-consent': 'reject' }}>
                            {copy.reject}
                        </Button>
                        <Button variant="navy" size="sm" className="sm:min-w-[7.5rem]" onClick={() => choose('granted')} dataAttrs={{ 'data-consent': 'accept' }}>
                            {copy.accept}
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
