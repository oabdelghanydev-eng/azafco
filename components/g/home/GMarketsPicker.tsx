'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { cn, focusRing } from '@/components/ui/tokens';
import styles from './GMarkets.module.css';

/** Market picker row: 44px+ tall, tinted when pressed; colours follow the dark surface. */
const btn = cn(
    'group flex min-h-tap w-full cursor-pointer items-center gap-3.5 rounded-lg border-0 bg-transparent px-3.5 py-2.5 text-start font-bold text-white lg:py-3',
    'text-heading-sm transition-colors duration-base hover:bg-white/[.06] aria-pressed:bg-white/[.12] motion-reduce:transition-none',
    focusRing,
);

type SelState = readonly [number, (k: number) => void];

const SelContext = createContext<SelState>([0, () => {}]);

/**
 * Holds the selected market and exposes it as `data-sel` so the server-rendered
 * map (routes, country fills, pins) restyles through CSS only; the heavy map
 * geometry never ships in the client bundle.
 */
export function GMarketsState({ children, className }: { children: ReactNode; className?: string }) {
    const [sel, setSel] = useState(0);
    return (
        <SelContext.Provider value={[sel, setSel]}>
            <div data-sel={sel} className={[styles.state, className].filter(Boolean).join(' ')}>
                {children}
            </div>
        </SelContext.Provider>
    );
}

export type GMarketItem = {
    /** flag-icons code, also the id suffix of the flag image in the map <defs> */
    code: string;
    name: string;
    since: string;
};

/** The seven market buttons (aria-pressed); flags reuse the map's <defs> images via <use>. */
export function GMarketsList({ items, className }: { items: GMarketItem[]; className?: string }) {
    const [sel, setSel] = useContext(SelContext);
    return (
        <ul className={className}>
            {items.map((m, k) => (
                <li key={m.code}>
                    <button type="button" aria-pressed={k === sel} onClick={() => setSel(k)} className={btn}>
                        <span
                            aria-hidden="true"
                            className="h-8 w-8 flex-none overflow-hidden rounded-full bg-white ring-2 ring-white/30 transition-shadow duration-base group-aria-pressed:ring-gold motion-reduce:transition-none"
                        >
                            <svg viewBox="0 0 36.4 27.3" preserveAspectRatio="xMidYMid slice" focusable="false" className="block h-full w-full">
                                <use href={`#gmk-flag-${m.code}`} />
                            </svg>
                        </span>
                        <span className="flex-1">{m.name}</span>
                        <span className="whitespace-nowrap text-caption font-semibold text-fg-muted">{m.since}</span>
                    </button>
                </li>
            ))}
        </ul>
    );
}
