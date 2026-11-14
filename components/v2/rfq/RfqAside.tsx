import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { cardClass } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Layout';
import { CheckIcon } from '@/components/ui/icons';
import { cn, typography } from '@/components/ui/tokens';
import { phoneDisplay } from '@/components/ui/format';
import { companyConfig } from '@/config/company.config';
import { RfqShowWhen } from './RfqQuery';

/**
 * Buyer reassurance column next to the requirements panel (design G): what
 * happens after the buyer writes to us, with the office hours /contact shows
 * (no response-time or price promise),
 * what to have ready and the official channels (anti-fraud notice). Direct
 * channels and the "attach your specification" note live in RfqRequestPanel.
 * Light surfaces only (white / off-white sections).
 *
 * `short`: true hides "Helpful to have ready" (corporate / documents); 'query'
 * decides in the browser from ?type= (static /requirements; shown in the static HTML).
 */
export default function RfqAside({
    short = false,
    headingAs: H = 'h2',
    className,
}: {
    short?: boolean | 'query';
    headingAs?: 'h2' | 'h3';
    className?: string;
}) {
    const t = useTranslations('rfq_v2.aside');
    const tc = useTranslations('data.company');
    const c = companyConfig.contact;
    const steps = t.raw('steps') as string[];
    const prepare = t.raw('prepare') as string[];

    const prepareSection = (
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
    );

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
                {/* Office hours from the same source as /contact (ROUND1-SPEC §6 R7); no reply-time promise */}
                <p className={cn('mb-0 mt-5 text-ink-muted', typography.small)}>{t('hours', { hours: tc('workingHours') })}</p>
                <p className={cn('mb-0 mt-5 border-0 border-s-2 border-solid border-gold ps-4 text-ink', typography.small)}>{t('no_promise')}</p>
            </section>

            {short === 'query' ? (
                <Suspense fallback={prepareSection}>
                    <RfqShowWhen short={false}>{prepareSection}</RfqShowWhen>
                </Suspense>
            ) : !short ? (
                prepareSection
            ) : null}

            {/* Anti-fraud notice (approved copy in data.company.officialChannels) */}
            <section className={cardClass({ accent: true, padding: 'sm', className: 'lg:p-6' })}>
                <H className={cn('m-0 text-ink', typography.h4)}>{tc('officialChannels.title')}</H>
                <p className={cn('mb-0 mt-2 text-ink-muted', typography.small)}>{tc('officialChannels.text', { phone: phoneDisplay(c.whatsappNumber), email: c.email })}</p>
            </section>
        </aside>
    );
}
