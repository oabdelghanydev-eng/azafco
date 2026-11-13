import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/v2/cn';

export interface SpecRow {
    label: ReactNode;
    /** null / undefined / '' → "Confirmed with sales" empty state */
    value?: ReactNode | null;
}

export interface SpecTableProps {
    /** Visible caption / table name, e.g. "Tilapia: specifications" */
    caption: ReactNode;
    rows: SpecRow[];
    /** Override the empty-state text */
    emptyLabel?: string;
    /** Hide the caption visually (still read by screen readers) */
    hideCaption?: boolean;
    className?: string;
}

/**
 * Product specification. Desktop (md+): accessible <table> with row headers.
 * Mobile: label–value list (no horizontal scroll). Unknown fields render a
 * neutral "Confirmed with sales" state instead of an invented value.
 */
export default function SpecTable({ caption, rows, emptyLabel, hideCaption = false, className }: SpecTableProps) {
    const t = useTranslations('v2.spec');
    const empty = emptyLabel ?? t('confirmed_with_sales');
    const isEmpty = (v: SpecRow['value']) => v === null || v === undefined || v === '';
    const Empty = () => (
        <span className="inline-flex items-center gap-2 text-ink-muted">
            <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
            {empty}
        </span>
    );

    return (
        <div data-surface="light" className={cn('rounded-card border border-t-4 border-line border-t-gold bg-white text-ink', className)}>
            {/* Desktop table */}
            <table className="hidden w-full border-collapse text-start text-body-sm md:table">
                <caption
                    className={cn(
                        'px-6 pb-3 pt-5 text-start text-heading-md text-ink',
                        hideCaption && 'sr-only',
                    )}
                >
                    {caption}
                </caption>
                <thead className="sr-only">
                    <tr>
                        <th scope="col">{t('attribute')}</th>
                        <th scope="col">{t('value')}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className="border-t border-line-soft">
                            <th scope="row" className="w-2/5 px-6 py-3.5 text-start align-top font-medium text-ink-muted">
                                {r.label}
                            </th>
                            <td className="px-6 py-3.5 align-top font-medium text-ink">{isEmpty(r.value) ? <Empty /> : r.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile list */}
            <div className="md:hidden">
                <p className={cn('m-0 px-4 pb-2 pt-4 text-heading-md text-ink', hideCaption && 'sr-only')}>{caption}</p>
                <dl className="m-0">
                    {rows.map((r, i) => (
                        <div key={i} className="border-t border-line-soft px-4 py-3">
                            <dt className="text-caption text-ink-subtle">{r.label}</dt>
                            <dd className="mt-0.5 text-body-sm font-medium text-ink">{isEmpty(r.value) ? <Empty /> : r.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
