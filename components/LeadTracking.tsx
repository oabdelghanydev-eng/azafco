'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { trackEvent, pageContext, LeadEventName } from '@/lib/analytics';

/**
 * One delegated click listener that turns contact links into lead events:
 *   wa.me / api.whatsapp.com  -> whatsapp_click
 *   tel:                      -> phone_click
 *   mailto:                   -> email_click
 *   internal /contact links   -> contact_cta_click ("Request a quote" / contact CTAs)
 *   Google Forms (B2B form)   -> quote_form_open
 * Any link can override the event with `data-track="<event_name>"`.
 * No href, phone number or email address is sent, only the page context.
 */
function classify(anchor: HTMLAnchorElement): LeadEventName | null {
    const override = anchor.dataset.track;
    if (override) return override as LeadEventName;

    const href = anchor.getAttribute('href') || '';
    if (href.startsWith('tel:')) return 'phone_click';
    if (href.startsWith('mailto:')) return 'email_click';

    let url: URL;
    try {
        url = new URL(href, window.location.href);
    } catch {
        return null;
    }
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'wa.me' || host === 'api.whatsapp.com' || host === 'web.whatsapp.com') return 'whatsapp_click';
    if (host === 'forms.gle' || (host === 'docs.google.com' && url.pathname.startsWith('/forms'))) return 'quote_form_open';
    if (url.origin === window.location.origin && /\/contact\/?$/.test(url.pathname)) {
        return 'contact_cta_click';
    }
    return null;
}

function linkLocation(anchor: HTMLAnchorElement): string {
    if (anchor.closest('header, nav')) return 'header';
    if (anchor.closest('footer')) return 'footer';
    if (window.getComputedStyle(anchor).position === 'fixed') return 'floating';
    return 'content';
}

export default function LeadTracking() {
    const locale = useLocale();

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const target = event.target as Element | null;
            const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
            if (!anchor) return;
            const name = classify(anchor);
            if (!name) return;
            trackEvent(name, {
                ...pageContext(window.location.pathname, locale),
                link_location: linkLocation(anchor),
            });
        };
        // Capture phase so it fires even if a handler stops propagation.
        document.addEventListener('click', onClick, true);
        return () => document.removeEventListener('click', onClick, true);
    }, [locale]);

    return null;
}
