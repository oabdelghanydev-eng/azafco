import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { companyConfig } from '@/config/company.config';
import { ArrowIcon, CheckIcon, MailIcon, WhatsAppIcon } from '@/components/v2/icons';
import { rfqHref } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';

export interface ProductContactProps {
    /** Product slug (data/products.ts), preselected on the requirements form */
    slug: string;
    /** Short species name, as on the page */
    name: string;
    /** Anchor id (the hero's "Start a partnership" button points here) */
    id?: string;
    className?: string;
}

/** "+20 100 773 6419" from the config number (201007736419), same format as the G footer */
function phoneDisplay(n: string): string {
    return `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;
}

const FOCUS_DARK = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500]';

/**
 * Product-page partnership card in the Design G language (navy, gold rule eyebrow,
 * footer-style contact rows): WhatsApp = management direct, for fast deals (message
 * prefilled with the species); email = export team, for details and documents.
 * Then a quiet link to the requirements form with the product preselected, and
 * what happens after the buyer writes. No quote wording, no reply-time promise.
 */
export default function ProductContact({ slug, name, id = 'start-partnership', className }: ProductContactProps) {
    const t = useTranslations('catalogue_v2.detail.contact');
    const { email, whatsappNumber, social } = companyConfig.contact;
    const waHref = `${social.whatsapp}?text=${encodeURIComponent(t('whatsapp_message', { name }))}`;
    // Subject + a requirements checklist body, so purchasing does not have to remember it
    const mailHref = `mailto:${email}?subject=${encodeURIComponent(t('email_subject', { name }))}&body=${encodeURIComponent(
        t('email_body', { name }).replace(/\n/g, '\r\n'),
    )}`;
    const titleId = `${id}-title`;

    const row = cn(
        'group grid min-h-[72px] grid-cols-[minmax(0,1fr)_44px] items-center gap-x-4 border-b border-white/[.16] py-4 text-white transition-colors hover:bg-white/[.04] motion-reduce:transition-none',
        FOCUS_DARK,
    );
    const go =
        'grid h-11 w-11 place-items-center rounded-full border border-white/40 text-white transition-colors group-hover:border-[#f7b500] group-hover:text-[#f7b500] motion-reduce:transition-none';

    return (
        <aside
            id={id}
            aria-labelledby={titleId}
            data-surface="dark"
            className={cn('scroll-mt-28 rounded-card bg-[#001b47] p-6 text-white md:p-8', className)}
        >
            <p className="m-0 flex items-center gap-3 text-[15px] font-bold text-[#f7b500]">
                <span aria-hidden="true" className="h-0.5 w-8 shrink-0 bg-[#f7b500]" />
                {t('eyebrow')}
            </p>
            <h2 id={titleId} className="mt-3 text-heading-lg font-bold text-white">
                {t('title', { name })}
            </h2>
            <p className="mt-3 text-body-sm text-white/[.78]">{t('intro')}</p>

            <ul className="mt-6 border-t border-[rgba(247,181,0,.55)]">
                <li>
                    <a href={waHref} target="_blank" rel="noopener noreferrer" data-cta="product_whatsapp" className={row}>
                        <span className="min-w-0">
                            <span className="flex items-center gap-2 text-heading-sm font-bold">
                                <WhatsAppIcon className="shrink-0 text-[#f7b500]" />
                                {t('whatsapp_title')}
                            </span>
                            <span className="mt-0.5 block text-caption text-white/[.66]">{t('whatsapp_sub')}</span>
                            <span className="mt-1 block text-body-sm font-semibold">
                                <span dir="ltr">{phoneDisplay(whatsappNumber)}</span>
                            </span>
                        </span>
                        <span aria-hidden="true" className={go}>
                            <ArrowIcon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="sr-only">{t('new_tab')}</span>
                    </a>
                </li>
                <li>
                    <a href={mailHref} data-cta="product_email" className={row}>
                        <span className="min-w-0">
                            <span className="flex items-center gap-2 text-heading-sm font-bold">
                                <MailIcon className="shrink-0 text-[#f7b500]" />
                                {t('email_title')}
                            </span>
                            <span className="mt-0.5 block text-caption text-white/[.66]">{t('email_sub')}</span>
                            <span className="mt-1 block text-body-sm font-semibold [overflow-wrap:anywhere]">
                                <span dir="ltr">{email}</span>
                            </span>
                        </span>
                        <span aria-hidden="true" className={go}>
                            <ArrowIcon className="h-[18px] w-[18px]" />
                        </span>
                    </a>
                </li>
            </ul>

            <p className="mt-5 text-body-sm text-white/[.78]">
                {t('form_lead')}{' '}
                <Link
                    href={rfqHref({ product: slug, type: 'product' })}
                    data-cta="product_requirements"
                    className={cn(
                        'inline-flex min-h-11 items-center font-semibold text-white underline decoration-[#f7b500] decoration-2 underline-offset-[6px] hover:text-[#f7b500]',
                        FOCUS_DARK,
                    )}
                >
                    {t('form_link')}
                </Link>
            </p>

            <div className="mt-6 border-t border-white/[.16] pt-5">
                <h3 id={`${id}-next`} className="m-0 text-body-sm font-bold text-white">
                    {t('after_title')}
                </h3>
                <ol aria-labelledby={`${id}-next`} className="mt-3 space-y-2.5">
                    {(['after_1', 'after_2', 'after_3'] as const).map((k) => (
                        <li key={k} className="flex gap-2.5 text-body-sm text-white/[.78]">
                            <CheckIcon size={18} className="mt-0.5 shrink-0 text-[#f7b500]" aria-hidden="true" />
                            <span>{t(k)}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </aside>
    );
}
