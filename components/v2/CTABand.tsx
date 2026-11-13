import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { companyConfig } from '@/config/company.config';
import { products } from '@/data/products';
import { activeMarketConfigs, otherMarketConfigs } from '@/components/v2/markets/marketData';
import { rfqHref, type RfqPrefill } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import Button from './Button';
import { Container, Eyebrow } from './Layout';
import { ArrowIcon, CheckIcon, MailIcon, WhatsAppIcon } from './icons';

export interface CTABandProps {
    /** Defaults come from v2.cta_band. The heading is always v2.cta_band.title ("Every shipment starts with a message"). */
    eyebrow?: ReactNode;
    intro?: ReactNode;
    /** Prefill for the secondary requirements link (product page → { product: slug, type: 'product' }) */
    prefill?: RfqPrefill;
    /** Show the secondary "Send your requirements" link (default true; off on corporate/editorial pages) */
    showQuote?: boolean;
    /**
     * 'closing' (default): the band is the last block before the G footer, whose
     * contact block already lists WhatsApp / email, so the band renders nothing.
     * 'inline': render the full band (mid-page use, or a page without the G footer).
     */
    placement?: 'closing' | 'inline';
    /**
     * "What happens next" list; default 4 neutral steps (non-binding enquiry first,
     * no response-time promise). Custom lists should start with t('v2.cta_band.after_free').
     */
    reassurance?: string[];
    /**
     * Topic in the email subject ("Enquiry from azafco.com.eg: {topic}"). Default: the
     * product name (prefill.product), else the market name (prefill.country), else "general".
     */
    emailTopic?: string;
    headingId?: string;
    className?: string;
}

/** "+20 100 773 6419" from the config number (201007736419), as in the G footer */
function phoneDisplay(n: string): string {
    return `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;
}

/**
 * Contact band in the G footer's language (navy, gold eyebrow rule,
 * contact rows with a round arrow). Two routes, as the owner set them:
 * WhatsApp = direct to management (fast deals), email = export team (details and
 * documents). The requirements request (/rfq) is a quiet outline pill.
 * Contact data comes from config/company.config.ts.
 *
 * Every current page uses it as the page-closing block, directly above the G footer
 * (same channels), so by default (placement="closing") it renders nothing to avoid a
 * duplicate contact block. Pass placement="inline" to show it.
 */
export default function CTABand({
    eyebrow,
    intro,
    prefill,
    showQuote = true,
    reassurance,
    emailTopic,
    headingId = 'cta-band-title',
    className,
    placement = 'closing',
}: CTABandProps) {
    const t = useTranslations('v2');
    const root = useTranslations();
    if (placement === 'closing') return null;
    const steps = reassurance ?? [t('cta_band.after_free'), t('cta_band.after_1'), t('cta_band.after_2'), t('cta_band.after_3')];
    const c = companyConfig.contact;

    // Email subject: tells the export team which product or market the message came from
    const productKey = prefill?.product ? products.find((p) => p.slug === prefill.product)?.translationKey : undefined;
    const marketKey = prefill?.country
        ? [...activeMarketConfigs, ...otherMarketConfigs].find((m) => m.countryCode === prefill.country?.toUpperCase())?.key
        : undefined;
    const topic =
        emailTopic ??
        (productKey && root.has(`data.products.${productKey}.name`)
            ? root(`data.products.${productKey}.name`)
            : marketKey && root.has(`data.markets.${marketKey}.country`)
              ? root(`data.markets.${marketKey}.country`)
              : t('cta_band.email_topic_general'));
    const mailHref = `mailto:${c.email}?subject=${encodeURIComponent(t('cta_band.email_subject', { topic }))}`;

    const row =
        'group grid min-h-[64px] grid-cols-[28px_minmax(0,1fr)_44px] items-center gap-x-4 border-b border-rule py-5 text-fg transition-colors hover:text-link-hover lg:py-6';
    const go =
        'grid h-11 w-11 place-items-center rounded-full border border-[color:var(--v2-line)] transition-colors group-hover:border-gold group-hover:text-gold';

    return (
        <section
            data-surface="dark"
            data-reveal=""
            aria-labelledby={headingId}
            className={cn('relative isolate overflow-hidden bg-navy-900 py-16 text-fg lg:py-28', className)}
        >
            <Container grid className="gap-y-12">
                <div className="col-span-4 sm:col-span-8 lg:col-span-7">
                    <Eyebrow className="mb-3.5 lg:mb-5">{eyebrow ?? t('cta_band.eyebrow')}</Eyebrow>
                    <h2 id={headingId} className="v2-heading m-0 font-display text-display-lg">
                        {t('cta_band.title')}
                    </h2>
                    <p className="m-0 mt-4 max-w-[600px] text-body-lg text-fg-muted lg:mt-5">{intro ?? t('cta_band.intro')}</p>

                    {/* Direct routes: the main content of the band */}
                    <ul className="m-0 mt-8 max-w-[640px] list-none border-t border-rule p-0">
                        <li>
                            <a href={c.social.whatsapp} target="_blank" rel="noopener noreferrer" className={row} data-cta="cta_band_whatsapp">
                                <WhatsAppIcon size={24} className="text-gold" />
                                <span className="min-w-0">
                                    <span className="block text-heading-md">{t('cta_band.whatsapp_title')}</span>
                                    <span className="block text-body-sm text-fg-muted">{t('cta_band.whatsapp_sub')}</span>
                                    <span dir="ltr" className="mt-1 block text-start font-semibold [overflow-wrap:anywhere]">
                                        {phoneDisplay(c.whatsappNumber)}
                                    </span>
                                </span>
                                <span aria-hidden="true" className={go}>
                                    <ArrowIcon size={20} />
                                </span>
                                <span className="sr-only">{t('cta.opens_new_tab')}</span>
                            </a>
                        </li>
                        <li>
                            <a href={mailHref} className={row} data-cta="cta_band_email">
                                <MailIcon size={24} className="text-gold" />
                                <span className="min-w-0">
                                    <span className="block text-heading-md">{t('cta_band.email_title')}</span>
                                    <span className="block text-body-sm text-fg-muted">{t('cta_band.email_sub')}</span>
                                    <span dir="ltr" className="mt-1 block text-start font-semibold [overflow-wrap:anywhere]">
                                        {c.email}
                                    </span>
                                </span>
                                <span aria-hidden="true" className={go}>
                                    <ArrowIcon size={20} />
                                </span>
                            </a>
                        </li>
                    </ul>

                    {showQuote ? (
                        <div className="mt-8">
                            <Button href={rfqHref(prefill)} variant="outline" size="lg" dataAttrs={{ 'data-cta': 'cta_band_rfq' }}>
                                {t('cta.send_requirements')}
                            </Button>
                        </div>
                    ) : null}
                </div>

                <div className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9 lg:self-end">
                    <div className="rounded-card border border-t-4 border-rule border-t-gold p-6 md:p-8">
                        <p className="m-0 text-body font-bold text-fg">{t('cta_band.after_title')}</p>
                        <ul className="m-0 mt-3 list-none space-y-2 p-0">
                            {steps.map((s) => (
                                <li key={s} className="flex items-start gap-3 text-body-sm text-fg-muted">
                                    <CheckIcon size={18} className="mt-1 shrink-0 text-gold" />
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Container>
        </section>
    );
}
