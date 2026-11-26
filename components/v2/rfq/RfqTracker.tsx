'use client';

/**
 * One delegated click listener for the RFQ actions, so the panel itself stays
 * a server component. Any element with data-rfq-track="<event>" is tracked,
 * with data-rfq-type / data-rfq-species / data-rfq-destination as params.
 * Mount once per page (a window flag guards against double listeners).
 */
import { useEffect } from 'react';
import { trackRfq, type RfqEvent } from './track';

const EVENTS: RfqEvent[] = ['rfq_email_click', 'rfq_whatsapp_click', 'rfq_phone_click'];
const FLAG = '__azafcoRfqTracker';

export default function RfqTracker() {
    useEffect(() => {
        const w = window as unknown as Record<string, boolean>;
        if (w[FLAG]) return;
        w[FLAG] = true;
        const onClick = (e: MouseEvent) => {
            const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-rfq-track]');
            if (!el) return;
            const event = el.dataset.rfqTrack as RfqEvent;
            if (!EVENTS.includes(event)) return;
            trackRfq(event, { rfq_type: el.dataset.rfqType, species: el.dataset.rfqSpecies, destination: el.dataset.rfqDestination });
        };
        document.addEventListener('click', onClick);
        return () => {
            document.removeEventListener('click', onClick);
            w[FLAG] = false;
        };
    }, []);
    return null;
}
