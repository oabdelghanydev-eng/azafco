import { useTranslations } from 'next-intl';
import { cn } from '@/lib/v2/cn';

/** True only in previews where the owner wants to see missing facts. */
export const SHOW_PENDING = process.env.NEXT_PUBLIC_SHOW_PENDING === '1';

export interface PendingProps {
    /** What is missing, e.g. "Monthly capacity (t)" or "ISO 22000 certificate copy + expiry" */
    label: string;
    /** `block` renders as its own line/box (e.g. in place of a section); default inline chip */
    block?: boolean;
    className?: string;
}

/**
 * Placeholder for an unapproved business fact (figures, certificates, markets,
 * MOQ, lead times, dates). Renders NOTHING unless NEXT_PUBLIC_SHOW_PENDING=1.
 *
 *   <Pending label="Monthly processing capacity" />
 *   {SHOW_PENDING ? <Pending block label="Leadership photos + titles" /> : null}
 */
export default function Pending({ label, block = false, className }: PendingProps) {
    const t = useTranslations('v2.pending');
    if (!SHOW_PENDING) return null;
    const Tag = block ? 'div' : 'span';
    return (
        <Tag
            data-pending=""
            className={cn(
                'border border-dashed border-pending-border bg-pending-bg text-pending-ink text-caption font-medium rounded-control',
                block ? 'flex w-full items-start gap-2 p-4' : 'inline-flex items-center gap-1.5 px-2 py-0.5 align-middle',
                className,
            )}
        >
            <span aria-hidden="true">◌</span>
            <span>
                {t('prefix')} {label}
            </span>
        </Tag>
    );
}
