import type { ReactNode } from 'react';
import { cn } from '@/lib/v2/cn';
import Pending from './Pending';

export interface ProofItem {
    /** Short, verifiable statement, e.g. "Own processing plant, Kafr El Sheikh" */
    title: ReactNode;
    detail?: ReactNode;
    icon?: ReactNode;
    /**
     * Mark an item whose fact is not yet approved. It is then replaced by
     * <Pending label={pending}/> (invisible in production).
     */
    pending?: string;
}

export interface ProofStripProps {
    items: ProofItem[];
    /** Compact inline variant for use inside a hero */
    compact?: boolean;
    className?: string;
}

/**
 * Trust strip: 3–5 short proof points with thin dividers. Surface-aware.
 * Only verified facts — anything unconfirmed goes through `pending`.
 *
 *   <ProofStrip items={[{ title: 'Kafr El Sheikh, Egypt', detail: 'Factory location' },
 *                       { title: '…', pending: 'Monthly capacity (t)' }]} />
 */
export default function ProofStrip({ items, compact = false, className }: ProofStripProps) {
    const visible = items.filter((i) => !i.pending);
    const pending = items.filter((i) => i.pending);
    return (
        <div className={className}>
            <ul
                className={cn(
                    'grid divide-rule',
                    compact
                        ? 'grid-cols-2 gap-y-4 sm:flex sm:flex-wrap sm:divide-x rtl:sm:divide-x-reverse'
                        : 'grid-cols-1 gap-y-6 border-y border-rule py-6 sm:grid-cols-2 lg:flex lg:divide-x rtl:lg:divide-x-reverse',
                )}
            >
                {visible.map((item, i) => (
                    <li
                        key={i}
                        className={cn(
                            'flex items-start gap-3',
                            compact ? 'sm:px-5 sm:first:ps-0' : 'lg:flex-1 lg:px-6 lg:first:ps-0 lg:last:pe-0',
                        )}
                    >
                        {item.icon ? <span className="mt-0.5 shrink-0 text-eyebrow">{item.icon}</span> : null}
                        <div>
                            <p className={cn('font-semibold text-fg', compact ? 'text-body-sm' : 'text-body')}>{item.title}</p>
                            {item.detail ? <p className="mt-0.5 text-caption text-fg-muted">{item.detail}</p> : null}
                        </div>
                    </li>
                ))}
            </ul>
            {pending.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {pending.map((p, i) => (
                        <Pending key={i} label={p.pending!} />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
