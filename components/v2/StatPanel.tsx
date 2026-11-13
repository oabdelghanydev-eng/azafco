import type { ReactNode } from 'react';
import { cn } from '@/lib/v2/cn';
import Pending from './Pending';

export interface Stat {
    /** Display value incl. unit, e.g. "2008" or "Kafr El Sheikh" */
    value: ReactNode;
    label: ReactNode;
    note?: ReactNode;
    /**
     * Required. Only `true` when management has approved this figure for
     * publication. Unverified stats render <Pending label={pendingLabel}/>.
     */
    verified: boolean;
    /** What to ask the owner (defaults to the label when it is a string) */
    pendingLabel?: string;
}

export interface StatPanelProps {
    stats: Stat[];
    columns?: 2 | 3 | 4;
    className?: string;
}

/**
 * Large figures with labels, as the G key-figures strip: each figure under a
 * hairline with a short gold segment, big navy number (white on navy), muted label.
 * Forces an explicit `verified` flag per figure because the brief forbids
 * unapproved production numbers / counts.
 */
export default function StatPanel({ stats, columns = 4, className }: StatPanelProps) {
    const cols = { 2: 'grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' }[columns];
    const shown = stats.filter((s) => s.verified);
    const pending = stats.filter((s) => !s.verified);
    return (
        <div className={className}>
            {shown.length ? (
                <dl className={cn('m-0 grid gap-x-5 gap-y-8 lg:gap-x-8', cols)}>
                    {shown.map((s, i) => (
                        <div key={i} className="relative flex min-w-0 flex-col-reverse border-t border-rule pt-5 lg:pt-7">
                            <span aria-hidden="true" className="absolute -top-px start-0 h-[3px] w-11 bg-gold" />
                            <dt className="mt-2 text-body-sm font-semibold text-fg-muted lg:mt-2.5 lg:text-body">
                                {s.label}
                                {s.note ? <span className="mt-1 block text-caption font-normal">{s.note}</span> : null}
                            </dt>
                            <dd className="m-0 font-display text-figure text-stat tabular-nums [overflow-wrap:anywhere]">{s.value}</dd>
                        </div>
                    ))}
                </dl>
            ) : null}
            {pending.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {pending.map((s, i) => (
                        <Pending key={i} label={s.pendingLabel ?? (typeof s.label === 'string' ? s.label : 'figure')} />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
