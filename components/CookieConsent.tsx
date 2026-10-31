'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { companyConfig } from '@/config/company.config';
import {
    CONSENT_CHANGE_EVENT,
    CONSENT_OPEN_EVENT,
    ConsentChoice,
    getStoredConsent,
    setConsent,
} from '@/lib/consent';

/**
 * Cookie consent banner (Google Consent Mode v2, see lib/consent.ts).
 *
 * The banner is rendered in the server HTML with `cookie-banner-auto`; CSS
 * hides it when <html data-consent> was set by the head script, so returning
 * visitors never see a flash. After mount, React takes over:
 *   'auto'   -> SSR / first render, visibility decided by CSS
 *   'open'   -> shown (no choice yet, or reopened from the footer)
 *   'closed' -> not rendered
 * Microsoft Clarity is only loaded after the visitor accepts.
 */
type BannerState = 'auto' | 'open' | 'closed';

function loadClarity(): void {
    const id = companyConfig.analytics.clarityId;
    if (!id || document.getElementById('clarity-script')) return;
    const w = window as unknown as { clarity?: { (...a: unknown[]): void; q?: unknown[][] } };
    if (!w.clarity) {
        const fn = (...args: unknown[]) => {
            (fn.q = fn.q || []).push(args);
        };
        fn.q = [] as unknown[][];
        w.clarity = fn;
    }
    const s = document.createElement('script');
    s.id = 'clarity-script';
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${id}?ref=bwt`;
    document.head.appendChild(s);
}

export default function CookieConsent() {
    const t = useTranslations('common.cookie_consent');
    const [state, setState] = useState<BannerState>('auto');

    useEffect(() => {
        const stored = getStoredConsent();
        setState(stored ? 'closed' : 'open');
        if (stored === 'granted') loadClarity();

        const onOpen = () => setState('open');
        const onChange = (e: Event) => {
            if ((e as CustomEvent<ConsentChoice>).detail === 'granted') loadClarity();
        };
        window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
        window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
        return () => {
            window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
            window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
        };
    }, []);

    if (state === 'closed') return null;

    const choose = (choice: ConsentChoice) => {
        setConsent(choice);
        setState('closed');
    };

    const button =
        'min-w-[7rem] rounded-lg border border-primary-700 px-5 py-2 text-sm font-semibold text-primary-800 bg-white hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500';

    return (
        <section
            id="cookie-consent"
            role="region"
            aria-label={t('label')}
            className={`${state === 'auto' ? 'cookie-banner-auto ' : ''}fixed inset-x-0 bottom-0 z-[60] p-4`}
        >
            <div className="mx-auto max-w-3xl rounded-xl bg-white text-start text-gray-700 shadow-2xl ring-1 ring-gray-200 p-4 sm:flex sm:items-center sm:gap-4">
                <p className="text-sm leading-relaxed sm:flex-1">
                    <strong className="text-gray-900">{t('title')}.</strong> {t('text')}{' '}
                    <Link href="/privacy-policy" className="underline text-primary-700 hover:text-primary-900">
                        {t('privacy')}
                    </Link>
                </p>
                <div className="mt-3 flex gap-3 sm:mt-0 sm:shrink-0">
                    <button type="button" className={button} onClick={() => choose('denied')}>
                        {t('reject')}
                    </button>
                    <button type="button" className={button} onClick={() => choose('granted')}>
                        {t('accept')}
                    </button>
                </div>
            </div>
        </section>
    );
}
