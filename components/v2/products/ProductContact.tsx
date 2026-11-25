import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { companyConfig } from '@/config/company.config';
import { ArrowIcon, MailIcon, WhatsAppIcon, cn, focusRing, phoneDisplay, typography } from '@/components/ui';
import { whatsappLink } from '@/lib/v2/whatsapp';

export interface ProductContactProps {
    /** Short species name, as on the page */
    name: string;
    /** Name for the heading pattern that already carries "fish" (AR «… بشأن سمك {name}»); defaults to `name` */
    titleName?: string;
    /** Anchor id of the card */
    id?: string;
    className?: string;
}

/**
 * One contact route as a row (narrow column version of the DS <ContactRow>, which
 * switches to a four-column layout from xl and is too wide for this side card).
 * Surface-aware tokens only, so it reads on the navy card.
 */
function Route({
    href,
    icon,
    title,
    sub,
    value,
    newTabLabel,
    cta,
}: {
    href: string;
    icon: ReactNode;
    title: string;
    sub: string;
    value: string;
    newTabLabel?: string;
    cta: string;
}) {
    const newTab = href.startsWith('http');
    return (
        <a
            href={href}
            data-cta={cta}
            {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={cn(
                'group grid min-h-[72px] grid-cols-[minmax(0,1fr)_44px] items-center gap-x-4 border-0 border-b border-solid border-rule py-4 text-fg transition-colors duration-base hover:bg-tint motion-reduce:transition-none',
                focusRing,
            )}
        >
            <span className="min-w-0">
                <span className={cn('flex items-center gap-2 font-bold', typography.h4)}>
                    <span className="inline-flex text-eyebrow">{icon}</span>
                    {title}
                </span>
                <span className={cn('mt-0.5 block text-fg-muted', typography.caption)}>{sub}</span>
                <span className={cn('mt-1 block font-semibold [overflow-wrap:anywhere]', typography.small)}>
                    <span dir="ltr">{value}</span>
                </span>
            </span>
            <span
                aria-hidden="true"
                className="grid h-tap w-tap place-items-center rounded-full border border-solid border-edge transition-colors duration-base group-hover:border-link-hover group-hover:text-link-hover motion-reduce:transition-none"
            >
                <ArrowIcon size={20} />
            </span>
            {newTab && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
        </a>
    );
}

/**
 * Product-page contact card (navy surface, two contact rows):
 * WhatsApp = management, supply enquiries (message prefilled with the species);
 * email = export team, for details and documents (subject + four short lines).
 * No intro line and no requirements link: the hero carries "Send your requirements".
 * No quote wording, no reply-time promise.
 */
export default function ProductContact({ name, titleName, id = 'product-contact', className }: ProductContactProps) {
    const t = useTranslations('catalogue_v2.detail.contact');
    const { email, whatsappNumber } = companyConfig.contact;
    const waHref = whatsappLink(t('whatsapp_message', { name }));
    const mailHref = `mailto:${email}?subject=${encodeURIComponent(t('email_subject', { name }))}&body=${encodeURIComponent(
        t('email_body', { name }).replace(/\n/g, '\r\n'),
    )}`;
    const titleId = `${id}-title`;

    return (
        <aside
            id={id}
            aria-labelledby={titleId}
            data-surface="dark"
            className={cn('scroll-mt-28 rounded-card bg-navy-900 p-6 text-fg md:p-8', className)}
        >
            <h2 id={titleId} className={cn('m-0 text-heading-lg text-fg')}>
                {t('title', { name: titleName ?? name })}
            </h2>

            <ul className="m-0 mt-6 list-none border-0 border-t border-solid border-gold/50 p-0">
                <li>
                    <Route
                        href={waHref}
                        icon={<WhatsAppIcon size={20} />}
                        title={t('whatsapp_title')}
                        sub={t('whatsapp_sub')}
                        value={phoneDisplay(whatsappNumber)}
                        newTabLabel={t('new_tab')}
                        cta="product_whatsapp"
                    />
                </li>
                <li>
                    <Route
                        href={mailHref}
                        icon={<MailIcon size={20} />}
                        title={t('email_title')}
                        sub={t('email_sub')}
                        value={email}
                        cta="product_email"
                    />
                </li>
            </ul>
        </aside>
    );
}
