'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import styles from './GMarkets.module.css';

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
                    <button type="button" aria-pressed={k === sel} onClick={() => setSel(k)} className={styles.btn}>
                        <span aria-hidden="true" className={styles.btnFlag}>
                            <svg viewBox="0 0 36.4 27.3" preserveAspectRatio="xMidYMid slice" focusable="false">
                                <use href={`#gmk-flag-${m.code}`} />
                            </svg>
                        </span>
                        <span className="flex-1">{m.name}</span>
                        <span className={styles.since}>{m.since}</span>
                    </button>
                </li>
            ))}
        </ul>
    );
}
