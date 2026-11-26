import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/v2/cn';

export interface SpecRow {
    label: ReactNode;
    /** null / undefined / '' → neutral empty state (v2.spec.confirmed_with_sales) */
    value?: ReactNode | null;
}

export interface SpecTableProps {
    /** Visible caption / table name, e.g. "Tilapia: specification" */
    caption: ReactNode;
    rows: SpecRow[];
    /** Override the empty-state text */
    emptyLabel?: string;
    /** Hide the caption visually (still read by screen readers) */
    hideCaption?: boolean;
    className?: string;
}

/**
 * Product specification: one accessible <table> with row headers at every width
 * (rendered once in the HTML). Two columns fit a 390px phone: the label column is
 * narrower and padding tighter on small screens, values wrap. Unknown fields render
 * a neutral empty state instead of an invented value.
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
            <table className="w-full table-fixed border-collapse text-start text-body-sm">
                <caption className={cn('px-4 pb-3 pt-5 text-start text-heading-md text-ink md:px-6', hideCaption && 'sr-only')}>{caption}</caption>
                <thead className="sr-only">
                    <tr>
                        <th scope="col">{t('attribute')}</th>
                        <th scope="col">{t('value')}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className="border-t border-line-soft">
                            <th scope="row" className="w-[42%] px-4 py-3 text-start align-top font-medium text-ink-muted md:w-2/5 md:px-6 md:py-3.5">
                                {r.label}
                            </th>
                            <td className="px-4 py-3 align-top font-medium text-ink [overflow-wrap:anywhere] md:px-6 md:py-3.5">
                                {isEmpty(r.value) ? <Empty /> : r.value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
