'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn, typography } from '@/components/ui/tokens';
import { CONSENT_EVENT, readChoice, storeChoice, updateGtag, type ConsentChoice } from './consent';

export interface AnalyticsChoiceCopy {
    title: string;
    on: string;
    off: string;
    /** Status when no choice is stored: analytics follow the regional default. */
    unset: string;
    enable: string;
    disable: string;
}

/**
 * "Cookie settings" on the privacy page (#cookies): shows whether analytics run in
 * this browser and lets the visitor switch them. No popup anywhere on the site.
 * Before a choice is stored, analytics follow the regional default (denied in the
 * EEA/UK/CH, granted elsewhere; see components/v2/consent.ts). The page can't tell
 * the region, so it shows a neutral line and both buttons.
 */
export default function AnalyticsChoice({ copy }: { copy: AnalyticsChoiceCopy }) {
    const [choice, setChoice] = useState<ConsentChoice | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setChoice(readChoice());
        setReady(true);
    }, []);

    const set = (next: ConsentChoice) => {
        storeChoice(next);
        updateGtag(next);
        setChoice(next);
        window.dispatchEvent(new Event(CONSENT_EVENT));
    };

    const status = !ready ? ' ' : choice === 'granted' ? copy.on : choice === 'denied' ? copy.off : copy.unset;

    return (
        <div className="mt-5 rounded-card bg-surface-offwhite p-5">
            <h3 className={cn('m-0 text-ink', typography.h4)}>{copy.title}</h3>
            <p role="status" className={cn('mb-0 mt-2 text-ink-muted', typography.small)}>
                {status}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
                {choice !== 'granted' && (
                    <Button size="md" onClick={() => set('granted')} disabled={!ready}>
                        {copy.enable}
                    </Button>
                )}
                {choice !== 'denied' && (
                    <Button variant="outline" size="md" onClick={() => set('denied')} disabled={!ready}>
                        {copy.disable}
                    </Button>
                )}
            </div>
        </div>
    );
}
