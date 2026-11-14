'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/navigation';
import { listsContactChannels } from './nav';

/**
 * Hides the footer contact block (photo, "every shipment starts with a message",
 * the four channel rows) on /contact and /requirements: those pages already list
 * the same channels, and DESIGN-SYSTEM §6.3 forbids a second contact band.
 * The bottom bar (logo, links, languages, legal) stays on every page.
 */
export default function GFooterContactGate({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    if (listsContactChannels(pathname)) return null;
    return <>{children}</>;
}
