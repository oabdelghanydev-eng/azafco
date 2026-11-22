'use client';

import { useEffect } from 'react';
import { CONSENT_EVENT, loadClarity, readChoice, revokeClarity } from './consent';

/**
 * Loads Microsoft Clarity after the page is interactive, and only if the visitor
 * turned analytics on in this browser (stored choice 'granted'). No stored choice or
 * 'denied': the script is not loaded. Turning analytics off on the privacy page sends
 * Clarity's "denied" signal at once; the script is gone from the next page load.
 * Renders nothing (no banner, no popup).
 */
export default function ClarityLoader({ clarityId }: { clarityId: string }) {
    useEffect(() => {
        const apply = () => {
            const choice = readChoice();
            if (choice === 'granted') loadClarity(clarityId);
            else if (choice === 'denied') revokeClarity();
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
