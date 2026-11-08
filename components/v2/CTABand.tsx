import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { companyConfig } from '@/config/company.config';
import { rfqHref, type RfqPrefill } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import Button from './Button';
import { Container, Eyebrow } from './Layout';
import GeoArcs from './GeoArcs';
import { CheckIcon, MailIcon, PhoneIcon, WhatsAppIcon } from './icons';

export interface CTABandProps {
    /** Defaults come from v2.cta_band. The heading is always "Talk to our export team". */
    eyebrow?: ReactNode;
    intro?: ReactNode;
    /** Prefill for the secondary quote link (product page → { product: slug, type: 'product' }) */
    prefill?: RfqPrefill;
    /** Show the secondary "Prepare a quote request" link (default true; off on corporate/editorial pages) */
    showQuote?: boolean;
    /** "What happens next" list; default 3 neutral steps (no response-time promise) */
    reassurance?: string[];
    headingId?: string;
    className?: string;
}

/**
 * Closing contact band: the export team's phone / WhatsApp / email are the main
 * content; the quote request (/rfq, a prepared email/WhatsApp message) is a quiet
 * secondary outline link. Contact data comes from config/company.config.ts.
 */
export default function CTABand({
    eyebrow,
    intro,
    prefill,
    showQuote = true,
    reassurance,
    headingId = 'cta-band-title',
    className,
}: CTABandProps) {
    const t = useTranslations('v2');
    const steps = reassurance ?? [t('cta_band.after_1'), t('cta_band.after_2'), t('cta_band.after_3')];
    const c = companyConfig.contact;
    const row = 'flex min-h-[48px] items-center gap-4 py-2 text-heading-sm font-medium text-fg hover:underline';

    return (
        <section data-surface="dark" aria-labelledby={headingId} className={cn('relative isolate overflow-hidden bg-navy-900 py-16 text-fg md:py-24', className)}>
            <GeoArcs tone="onDark" className="absolute -bottom-48 -end-40 -z-10 w-[640px]" />
            <Container grid className="gap-y-12">
                <div className="col-span-4 sm:col-span-8 lg:col-span-7">
                    <Eyebrow className="mb-5">{eyebrow ?? t('cta_band.eyebrow')}</Eyebrow>
                    <h2 id={headingId} className="v2-heading font-display text-display-lg">
                        {t('cta_band.title')}
                    </h2>
                    <p className="mt-5 max-w-prose-v2 text-body-lg text-fg-muted">{intro ?? t('cta_band.intro')}</p>

                    {/* Direct routes: the main content of the band */}
                    <ul className="mt-8 max-w-xl divide-y divide-rule border-y border-rule">
                        <li>
                            <a href={`tel:${c.phone}`} className={row} data-cta="cta_band_phone">
                                <PhoneIcon className="shrink-0 text-gold" />
                                <span className="sr-only">{t('cta.call')}: </span>
                                <span dir="ltr">{c.phoneDisplay}</span>
                            </a>
                        </li>
                        <li>
                            <a href={c.social.whatsapp} target="_blank" rel="noopener noreferrer" className={row} data-cta="cta_band_whatsapp">
                                <WhatsAppIcon className="shrink-0 text-gold" />
                                <span>{t('cta.whatsapp')}</span>
                                <span className="sr-only">{t('cta.opens_new_tab')}</span>
                            </a>
                        </li>
                        <li>
                            <a href={`mailto:${c.email}`} className={row} data-cta="cta_band_email">
                                <MailIcon className="shrink-0 text-gold" />
                                <span className="sr-only">{t('cta.email')}: </span>
                                <span dir="ltr">{c.email}</span>
                            </a>
                        </li>
                    </ul>

                    {showQuote ? (
                        <div className="mt-8">
                            <Button href={rfqHref(prefill)} variant="outline" dataAttrs={{ 'data-cta': 'cta_band_rfq' }}>
                                {t('cta.prepare_quote')}
                            </Button>
                        </div>
                    ) : null}
                </div>

                <div className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9 lg:self-end">
                    <div className="rounded-card border border-rule p-6 md:p-8">
                        <p className="text-body-sm font-semibold text-fg">{t('cta_band.after_title')}</p>
                        <ul className="mt-3 space-y-2">
                            {steps.map((s) => (
                                <li key={s} className="flex items-start gap-3 text-body-sm text-fg-muted">
                                    <CheckIcon size={18} className="mt-0.5 shrink-0 text-gold" />
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
