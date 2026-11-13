import { useTranslations } from 'next-intl';
import { products } from '@/data/products';
import { certificates } from '@/data/certificates';
import { activeMarketConfigs } from '@/components/v2/markets/marketData';
import StatPanel from './StatPanel';

/**
 * Facts already published elsewhere on the site, computed from the data (never
 * hard-coded): species in the register (data/products.ts), active export
 * markets (config markets with status 'active'), current publishable ISO
 * management-system certificates (data/certificates.ts: count, issuer, earliest
 * expiry year), and the plant location stated on Home/About/Contact.
 * No volumes, years, clients or capacity. The strip never shows expiry dates or
 * certificate numbers (owner decision 13 Nov); isoValidYear stays in the return
 * value for callers only.
 */
export function publishedFacts() {
    const today = new Date().toISOString().slice(0, 10);
    const iso = certificates.filter(
        (c) =>
            c.publishable !== false &&
            c.name.toUpperCase().startsWith('ISO') &&
            c.group === 'management_system' &&
            /^\d{4}-\d{2}-\d{2}$/.test(c.validUntil) &&
            c.validUntil >= today,
    );
    const issuers = Array.from(new Set(iso.map((c) => c.issuer.split(' (')[0].trim())));
    const validYear = iso.length ? Math.min(...iso.map((c) => Number(c.validUntil.slice(0, 4)))) : undefined;
    return {
        species: products.length,
        markets: activeMarketConfigs.length,
        isoCount: iso.length,
        // Only name an issuer when every certificate shares it
        isoIssuer: issuers.length === 1 ? issuers[0] : undefined,
        isoValidYear: validYear,
    };
}

export interface FactsStripProps {
    className?: string;
}

/**
 * Four-cell facts strip (StatPanel). Surface-aware.
 * Markets show as "7+" / «+7» (owner decision: 7 registered active markets, framed
 * as "the Middle East and beyond"); the ISO note names the certification body only.
 */
export default function FactsStrip({ className }: FactsStripProps) {
    const t = useTranslations('v2.facts');
    const f = publishedFacts();
    const isoNote = f.isoIssuer ? t('iso_note') : undefined;
    return (
        <StatPanel
            className={className}
            columns={4}
            stats={[
                { value: f.species, label: t('species'), verified: f.species > 0 },
                { value: t('markets_value', { count: f.markets }), label: t('markets'), verified: f.markets > 0 },
                { value: f.isoCount, label: t('iso'), note: isoNote, verified: f.isoCount > 0 },
                {
                    value: <span className="block pt-1 text-heading-lg">{t('plant_value')}</span>,
                    label: t('plant'),
                    verified: true,
                },
            ]}
        />
    );
}
