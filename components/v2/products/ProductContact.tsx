import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { companyConfig } from '@/config/company.config';
import { ArrowIcon, CheckIcon, Eyebrow, MailIcon, TextLink, WhatsAppIcon, cn, focusRing, phoneDisplay, typography } from '@/components/ui';
import { rfqHref } from '@/lib/v2/routes';
import { whatsappLink } from '@/lib/v2/whatsapp';

export interface ProductContactProps {
    /** Product slug (data/products.ts), preselected on the requirements form */
    slug: string;
    /** Short species name, as on the page */
    name: string;
    /** Anchor id (the hero's "Start a partnership" button points here) */
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
 * Product-page partnership card (navy surface, gold-rule eyebrow, contact rows):
 * WhatsApp = management direct, for fast deals (message prefilled with the species);
 * email = export team, for details and documents (subject + a requirements checklist).
 * Then a quiet link to the requirements form with the product preselected, and what
 * happens after the buyer writes. No quote wording, no reply-time promise.
 */
export default function ProductContact({ slug, name, id = 'start-partnership', className }: ProductContactProps) {
    const t = useTranslations('catalogue_v2.detail.contact');
    const { email, whatsappNumber } = companyConfig.contact;
    const waHref = whatsappLink(t('whatsapp_message', { name }));
    const mailHref = `mailto:${email}?subject=${encodeURIComponent(t('email_subject', { name }))}&body=${encodeURIComponent(
        t('email_body', { name }).replace(/\n/g, '\r\n'),
    )}`;
    const titleId = `${id}-title`;
    const nextId = `${id}-next`;

    return (
        <aside
            id={id}
            aria-labelledby={titleId}
            data-surface="dark"
            className={cn('scroll-mt-28 rounded-card bg-navy-900 p-6 text-fg md:p-8', className)}
        >
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <h2 id={titleId} className={cn('m-0 mt-3 text-heading-lg text-fg')}>
                {t('title', { name })}
            </h2>
            <p className={cn('m-0 mt-3 text-fg-muted', typography.small)}>{t('intro')}</p>

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

            <div className="mt-5">
                <p className={cn('m-0 text-fg-muted', typography.small)}>{t('form_lead')}</p>
                <TextLink href={rfqHref({ product: slug, type: 'product' })} dataAttrs={{ 'data-cta': 'product_requirements' }}>
                    {t('form_link')}
                </TextLink>
            </div>

            <div className="mt-5 border-0 border-t border-solid border-rule pt-5">
                <h3 id={nextId} className={cn('m-0 font-bold text-fg', typography.small)}>
                    {t('after_title')}
                </h3>
                <ol aria-labelledby={nextId} className="m-0 mt-3 list-none space-y-2.5 p-0">
                    {(['after_1', 'after_2', 'after_3'] as const).map((k) => (
                        <li key={k} className={cn('flex gap-2.5 text-fg-muted', typography.small)}>
                            <CheckIcon size={20} className="mt-0.5 shrink-0 text-eyebrow" />
                            <span>{t(k)}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </aside>
    );
}
