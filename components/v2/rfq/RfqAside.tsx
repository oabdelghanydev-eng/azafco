import { useLocale, useTranslations } from 'next-intl';
import { CheckIcon, DocumentIcon } from '@/components/v2/icons';
import { cn } from '@/lib/v2/cn';
import { GEyebrow, gH3, gSmall, phoneDisplay } from '@/components/v2/contact/g';
import { companyConfig } from '@/config/company.config';

/**
 * Buyer reassurance column next to the requirements panel (design G): what
 * happens after the buyer writes to us (no response-time or price promise),
 * what to have ready, a note to attach a specification and the official
 * channels (anti-fraud notice). Direct channels live in RfqRequestPanel.
 */
export default function RfqAside({ short = false, headingAs: H = 'h2', className }: { short?: boolean; headingAs?: 'h2' | 'h3'; className?: string }) {
    const t = useTranslations('rfq_v2.aside');
    const tc = useTranslations('data.company');
    const c = companyConfig.contact;
    const ar = useLocale() === 'ar';
    const steps = t.raw('steps') as string[];
    const prepare = t.raw('prepare') as string[];

    return (
        <aside className={cn('g-font flex flex-col gap-10 text-[#0d1f3f]', className)} aria-label={t('title')}>
            <section>
                <GEyebrow ar={ar} as={H}>
                    {t('title')}
                </GEyebrow>
                <ol className="m-0 mt-5 list-none space-y-5 p-0">
                    {steps.map((s, i) => (
                        <li key={s} className="flex gap-4">
                            <span aria-hidden="true" className="w-7 shrink-0 text-[15px] font-extrabold leading-[1.7] text-[#002d72]">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className={cn('text-[#4a5a75]', gSmall(ar))}>{s}</span>
                        </li>
                    ))}
                </ol>
                <p className={cn('mb-0 mt-5 border-s-2 border-[#f7b500] ps-4 text-[#4a5a75]', gSmall(ar))}>{t('no_promise')}</p>
            </section>

            {!short ? (
                <section>
                    <H className={cn(gH3(ar), 'text-[#0d1f3f]')}>{t('prepare_title')}</H>
                    <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                        {prepare.map((p) => (
                            <li key={p} className={cn('flex items-start gap-3 text-[#4a5a75]', gSmall(ar))}>
                                <CheckIcon size={18} className="mt-1 shrink-0 text-[#002d72]" />
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            <section className="flex gap-3 rounded bg-[#f2f5fa] p-5 lg:p-6">
                <DocumentIcon size={20} className="mt-1 shrink-0 text-[#002d72]" />
                <div>
                    <H className={cn(gH3(ar), 'text-[#0d1f3f]')}>{t('attach_title')}</H>
                    <p className={cn('mb-0 mt-1 text-[#4a5a75]', gSmall(ar))}>{t('attach_text')}</p>
                </div>
            </section>

            {/* Anti-fraud notice (approved copy in data.company.officialChannels) */}
            <section className="rounded border border-[#d5dde9] border-t-4 border-t-[#f7b500] bg-white p-5 lg:p-6">
                <H className={cn(gH3(ar), 'text-[#0d1f3f]')}>{tc('officialChannels.title')}</H>
                <p className={cn('mb-0 mt-2 text-[#4a5a75]', gSmall(ar))}>{tc('officialChannels.text', { phone: phoneDisplay(c.whatsappNumber), email: c.email })}</p>
            </section>
        </aside>
    );
}
