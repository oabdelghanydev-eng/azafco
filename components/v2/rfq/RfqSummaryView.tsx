'use client';

/**
 * Non-sensitive summary of the request just sent (species, volume,
 * destination), read once from sessionStorage on /rfq/thank-you. Renders
 * nothing if there is no summary (direct visit, private mode, short form).
 */
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RFQ_SUMMARY_KEY, type RfqSummary } from './schema';

export default function RfqSummaryView() {
    const t = useTranslations('rfq_v2.thanks');
    const [summary, setSummary] = useState<RfqSummary | null>(null);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(RFQ_SUMMARY_KEY);
            if (raw) setSummary(JSON.parse(raw) as RfqSummary);
        } catch {
            /* ignore */
        }
    }, []);

    if (!summary || summary.variant !== 'full') return null;
    const rows = [
        { label: t('summary_species'), value: summary.species },
        { label: t('summary_volume'), value: summary.volume },
        { label: t('summary_destination'), value: summary.destination },
    ].filter((r) => r.value);
    if (!rows.length) return null;

    return (
        <section aria-labelledby="rfq-summary-title" className="mt-10 rounded-card border border-line bg-white p-6">
            <h2 id="rfq-summary-title" className="font-display text-heading-sm text-navy">
                {t('summary_title')}
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                {rows.map((r) => (
                    <div key={r.label}>
                        <dt className="text-caption text-ink-muted">{r.label}</dt>
                        <dd className="mt-1 font-semibold text-ink">{r.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
