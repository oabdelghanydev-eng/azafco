import { getTranslations } from 'next-intl/server';
import { publicCertificates } from '@/data/certificates';
import { BadgeCheckIcon, Card, typography } from '@/components/ui';

export interface CertificateLibraryProps {
    locale: string;
}

/**
 * The ISO statement on /quality: one accent card (gold top rule, as on the home
 * #quality section). Owner decision 14 Nov 2026 (ROUND1-SPEC §1.1): generic wording
 * only ("We hold ISO certificates, certified by TÜV AUSTRIA."); the three standard
 * names appear on /quality only in the FAQ answer. Numbers, expiry dates, site,
 * holder, scope and images are never rendered (data/certificates.ts ·
 * CERTIFICATE_PUBLIC_FIELDS). The block is hidden if no certificate is publishable
 * and valid (publicCertificates() checks validity).
 */
export default async function CertificateLibrary({ locale }: CertificateLibraryProps) {
    const t = await getTranslations({ locale, namespace: 'quality_v2.certs' });
    if (publicCertificates().length === 0) return null;

    return (
        <Card accent padding="md" className="flex max-w-[920px] flex-col sm:flex-row sm:items-start sm:gap-5">
            <span className="flex shrink-0 text-navy sm:mt-1">
                <BadgeCheckIcon size={24} />
            </span>
            <div className="min-w-0 sm:flex-1">
                <p className={`mb-0 mt-4 text-ink sm:mt-0 ${typography.h4}`}>{t('statement')}</p>
                <p className={`mb-0 mt-2.5 max-w-prose text-ink-muted ${typography.small}`}>{t('documents')}</p>
            </div>
        </Card>
    );
}
