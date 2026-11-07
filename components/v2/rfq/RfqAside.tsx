import { useTranslations } from 'next-intl';
import { CheckIcon, DocumentIcon } from '@/components/v2/icons';
import { cn } from '@/lib/v2/cn';

/**
 * Buyer reassurance column next to the RFQ request panel: what happens after
 * the buyer writes to us (no response-time or price promise), what to have
 * ready, and a note to attach a specification. Direct channels live in
 * RfqRequestPanel.
 */
export default function RfqAside({ short = false, headingAs: H = 'h2', className }: { short?: boolean; headingAs?: 'h2' | 'h3'; className?: string }) {
    const t = useTranslations('rfq_v2.aside');
    const steps = t.raw('steps') as string[];
    const prepare = t.raw('prepare') as string[];

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

            <section className="flex gap-3 rounded-card border border-line bg-surface-offwhite p-5">
                <DocumentIcon size={20} className="mt-0.5 shrink-0 text-navy" />
                <div>
                    <H className="font-display text-heading-sm text-navy">{t('attach_title')}</H>
                    <p className="mt-1 text-body-sm text-ink-muted">{t('attach_text')}</p>
                </div>
            </section>
        </aside>
    );
}
