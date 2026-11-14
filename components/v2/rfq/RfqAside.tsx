import { useTranslations } from 'next-intl';
import { cardClass } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Layout';
import { CheckIcon, DocumentIcon } from '@/components/ui/icons';
import { cn, typography } from '@/components/ui/tokens';
import { phoneDisplay } from '@/components/ui/format';
import { companyConfig } from '@/config/company.config';

/**
 * Buyer reassurance column next to the requirements panel (design G): what
 * happens after the buyer writes to us (no response-time or price promise),
 * what to have ready, a note to attach a specification and the official
 * channels (anti-fraud notice). Direct channels live in RfqRequestPanel.
 * Light surfaces only (white / off-white sections).
 */
export default function RfqAside({ short = false, headingAs: H = 'h2', className }: { short?: boolean; headingAs?: 'h2' | 'h3'; className?: string }) {
    const t = useTranslations('rfq_v2.aside');
    const tc = useTranslations('data.company');
    const c = companyConfig.contact;
    const steps = t.raw('steps') as string[];
    const prepare = t.raw('prepare') as string[];

    return (
        <aside className={cn('flex flex-col gap-10 text-ink', className)} aria-label={t('title')}>
            <section>
                <Eyebrow as={H} tone="light">
                    {t('title')}
                </Eyebrow>
                <ol className="m-0 mt-5 list-none space-y-5 p-0">
                    {steps.map((s, i) => (
                        <li key={s} className="flex gap-4">
                            <span aria-hidden="true" className={cn('w-7 shrink-0 text-navy', typography.overline)}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className={cn('text-ink-muted', typography.small)}>{s}</span>
                        </li>
                    ))}
                </ol>
                <p className={cn('mb-0 mt-5 border-0 border-s-2 border-solid border-gold ps-4 text-ink', typography.small)}>{t('no_promise')}</p>
            </section>

            {!short ? (
                <section>
                    <H className={cn('m-0 text-ink', typography.h3)}>{t('prepare_title')}</H>
                    <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                        {prepare.map((p) => (
                            <li key={p} className={cn('flex items-start gap-3 text-ink-muted', typography.small)}>
                                <CheckIcon size={20} className="mt-0.5 text-navy" />
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            {/* Hairline box, no fill: reads on both the white /requirements page and the off-white /for-importers band */}
            <section className="flex gap-3.5 rounded-card border border-solid border-line p-5 lg:p-6">
                <DocumentIcon size={24} className="mt-0.5 text-navy" />
                <div className="min-w-0">
                    <H className={cn('m-0 text-ink', typography.h4)}>{t('attach_title')}</H>
                    <p className={cn('mb-0 mt-1 text-ink-muted', typography.small)}>{t('attach_text')}</p>
                </div>
            </section>

            {/* Anti-fraud notice (approved copy in data.company.officialChannels) */}
            <section className={cardClass({ accent: true, padding: 'sm', className: 'lg:p-6' })}>
                <H className={cn('m-0 text-ink', typography.h4)}>{tc('officialChannels.title')}</H>
                <p className={cn('mb-0 mt-2 text-ink-muted', typography.small)}>{tc('officialChannels.text', { phone: phoneDisplay(c.whatsappNumber), email: c.email })}</p>
            </section>
        </aside>
    );
}
