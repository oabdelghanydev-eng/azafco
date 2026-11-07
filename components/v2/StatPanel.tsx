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
 * Large figures with labels. Forces an explicit `verified` flag per figure
 * because the brief forbids unapproved production numbers / counts.
 */
export default function StatPanel({ stats, columns = 4, className }: StatPanelProps) {
    const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
    const shown = stats.filter((s) => s.verified);
    const pending = stats.filter((s) => !s.verified);
    return (
        <div className={className}>
            {shown.length ? (
                <dl className={cn('grid gap-px overflow-hidden rounded-card border border-rule bg-rule', cols)}>
                    {shown.map((s, i) => (
                        <div key={i} className="flex flex-col-reverse bg-panel p-6">
                            <dt className="mt-2 text-body-sm text-fg-muted">
                                {s.label}
                                {s.note ? <span className="mt-1 block text-caption">{s.note}</span> : null}
                            </dt>
                            <dd className="font-display text-display-lg text-fg tabular-nums">{s.value}</dd>
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
