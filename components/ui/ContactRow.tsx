import type { ReactNode } from 'react';
import { Link } from '@/navigation';
import { ArrowIcon } from './icons';
import { cn, focusRing } from './tokens';

/**
 * One contact route as a full-width row link (the G footer pattern, generalised):
 * icon (or a "01" index) · title + sub line · value (number / email, LTR) · round arrow.
 * Works on light and navy (follows data-surface). Whole row is the link; 44px+ target.
 *
 *   <ContactRow href={wa} external newTabLabel={t('new_tab')} icon={<WhatsAppIcon size={24} />}
 *     title={t('whatsapp.title')} sub={t('whatsapp.sub')} value="+20 100 773 6419" valueDir="ltr" />
 *
 * Channels (owner rule): WhatsApp = management direct (fast deals);
 * business@azafco.com.eg = export team (details and documents).
 */
export interface ContactRowProps {
    href: string;
    title: ReactNode;
    sub?: ReactNode;
    value?: ReactNode;
    /** 'ltr' for phone numbers and emails inside Arabic text */
    valueDir?: 'ltr' | 'auto';
    /** Leading icon (24px) or index text such as "01" */
    icon?: ReactNode;
    /** Plain <a> (wa.me, mailto:, tel:, maps). http(s) opens in a new tab. */
    external?: boolean;
    /** Screen-reader hint for new-tab links */
    newTabLabel?: string;
    className?: string;
    dataAttrs?: Record<`data-${string}`, string>;
}

export function ContactRow({ href, title, sub, value, valueDir = 'auto', icon, external, newTabLabel, className, dataAttrs }: ContactRowProps) {
    const cls = cn(
        'group grid grid-cols-[32px_minmax(0,1fr)_44px] items-center gap-x-3 border-0 border-b border-solid border-rule py-5 text-fg transition-colors lg:px-3 lg:py-6 xl:grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)_52px] xl:gap-5',
        'hover:bg-tint',
        focusRing,
        className,
    );
    const newTab = /^https?:/.test(href);
    const body = (
        <>
            <span aria-hidden="true" className="col-start-1 row-span-2 row-start-1 inline-flex text-eyebrow xl:row-span-1">
                {icon}
            </span>
            <span className="col-start-2 row-start-1 min-w-0">
                <span className="block font-display text-heading-md">{title}</span>
                {sub ? <span className="block text-body-sm text-fg-muted">{sub}</span> : null}
            </span>
            {value ? (
                <span
                    dir={valueDir === 'ltr' ? 'ltr' : undefined}
                    className="col-start-2 row-start-2 mt-0.5 block min-w-0 text-start font-semibold [overflow-wrap:anywhere] xl:col-start-3 xl:row-start-1 xl:mt-0"
                >
                    {value}
                </span>
            ) : null}
            <span
                aria-hidden="true"
                className="col-start-3 row-span-2 row-start-1 grid h-tap w-tap place-items-center rounded-full border border-solid border-edge transition-colors group-hover:border-link-hover group-hover:text-link-hover xl:col-start-4 xl:row-span-1 xl:h-[52px] xl:w-[52px]"
            >
                <ArrowIcon size={20} />
            </span>
            {newTab && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
        </>
    );
    if (external || /^(https?:|mailto:|tel:)/.test(href)) {
        return (
            <a href={href} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...dataAttrs}>
                {body}
            </a>
        );
    }
    return (
        <Link href={href} className={cls} {...dataAttrs}>
            {body}
        </Link>
    );
}

export default ContactRow;
