'use client';

import { useEffect } from 'react';
import { CONSENT_EVENT, loadClarity, readChoice, revokeClarity } from './consent';

/**
 * Loads Microsoft Clarity after the page is interactive, unless the visitor turned
 * analytics off on the privacy page. Renders nothing (no banner, no popup).
 */
export default function ClarityLoader({ clarityId }: { clarityId: string }) {
    useEffect(() => {
        const apply = () => {
            const choice = readChoice();
            if (choice === 'denied') revokeClarity();
            else loadClarity(clarityId, choice === 'granted');
        };
        // Same moment as next/script lazyOnload: after load, when the browser is idle
        const start = () => {
            if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(apply);
            else setTimeout(apply, 1);
        };
        if (document.readyState === 'complete') start();
        else window.addEventListener('load', start, { once: true });
        window.addEventListener(CONSENT_EVENT, apply);
        return () => {
            window.removeEventListener('load', start);
            window.removeEventListener(CONSENT_EVENT, apply);
        };
    }, [clarityId]);
    return null;
}
