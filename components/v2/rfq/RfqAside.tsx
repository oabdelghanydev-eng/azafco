import { useTranslations } from 'next-intl';
import { companyConfig } from '@/config/company.config';
import { CheckIcon, MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/v2/icons';
import { cn } from '@/lib/v2/cn';

/**
 * Buyer reassurance column next to the RFQ form (brief §21 "LEFT — buyer
 * reassurance"): what happens next (no response-time or price promise), what to
 * prepare, direct channels from config, privacy note.
 */
export default function RfqAside({ short = false, headingAs: H = 'h2', className }: { short?: boolean; headingAs?: 'h2' | 'h3'; className?: string }) {
    const t = useTranslations('rfq_v2.aside');
    const tv = useTranslations('v2.cta');
    const steps = t.raw('steps') as string[];
    const prepare = t.raw('prepare') as string[];
    const c = companyConfig.contact;

    return (
        <aside className={cn('flex flex-col gap-8 text-ink', className)} aria-label={t('title')}>
            <section>
                <H className="font-display text-heading-md text-navy">{t('title')}</H>
                <ol className="mt-4 space-y-4">
                    {steps.map((s, i) => (
                        <li key={s} className="flex gap-4">
                            <span aria-hidden="true" className="font-display text-heading-sm text-gold-ink">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-body-sm text-ink-muted">{s}</span>
                        </li>
                    ))}
                </ol>
                <p className="mt-4 border-s-2 border-gold ps-4 text-caption text-ink-muted">{t('no_promise')}</p>
            </section>

            {!short ? (
                <section>
                    <H className="font-display text-heading-sm text-navy">{t('prepare_title')}</H>
                    <ul className="mt-3 space-y-2">
                        {prepare.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-body-sm text-ink-muted">
                                <CheckIcon size={18} className="mt-0.5 shrink-0 text-navy" />
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            <section className="rounded-card border border-line bg-surface-offwhite p-5">
                <H className="font-display text-heading-sm text-navy">{t('direct_title')}</H>
                <p className="mt-1 text-body-sm text-ink-muted">{t('direct_intro')}</p>
                <ul className="mt-3">
                    <li>
                        <a href={`tel:${c.phone}`} className="flex min-h-[44px] items-center gap-3 font-medium text-navy hover:underline" data-cta="rfq_aside_phone">
                            <PhoneIcon size={18} className="shrink-0" />
                            <span className="sr-only">{tv('call')}: </span>
                            <span dir="ltr">{c.phoneDisplay}</span>
                        </a>
                    </li>
                    <li>
                        <a href={c.social.whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-3 font-medium text-navy hover:underline" data-cta="rfq_aside_whatsapp">
                            <WhatsAppIcon size={18} className="shrink-0" />
                            <span>{tv('whatsapp')}</span>
                            <span className="sr-only">{tv('opens_new_tab')}</span>
                        </a>
                    </li>
                    <li>
                        <a href={`mailto:${c.email}`} className="flex min-h-[44px] items-center gap-3 font-medium text-navy hover:underline" data-cta="rfq_aside_email">
                            <MailIcon size={18} className="shrink-0" />
                            <span className="sr-only">{tv('email')}: </span>
                            <span dir="ltr">{c.email}</span>
                        </a>
                    </li>
                </ul>
            </section>

            <section>
                <H className="font-display text-heading-sm text-navy">{t('privacy_title')}</H>
                <p className="mt-1 text-caption text-ink-muted">{t('privacy_text')}</p>
            </section>
        </aside>
    );
}
