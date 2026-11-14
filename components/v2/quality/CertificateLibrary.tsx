import { getTranslations } from 'next-intl/server';
import { publicCertificates } from '@/data/certificates';
import { BadgeCheckIcon, Card, typography } from '@/components/ui';

export interface CertificateLibraryProps {
    locale: string;
}

/**
 * The ISO certificates AZAFCO holds, as design-system accent cards (gold top rule,
 * as on the home #quality section). Owner decision 13 Nov 2026
 * (RELEASE-DECISIONS §3): each card shows only the standard name and one plain
 * line on what it covers. Numbers, expiry dates, site, holder, scope and images
 * are never rendered (data/certificates.ts · CERTIFICATE_PUBLIC_FIELDS), and
 * there is no "copies on request" link. The certifier is named once, in the
 * section intro on the page.
 */
export default async function CertificateLibrary({ locale }: CertificateLibraryProps) {
    const t = await getTranslations({ locale, namespace: 'quality_v2.certs.items' });
    const items = publicCertificates();
    if (items.length === 0) return null;

    return (
        <ul className="m-0 grid list-none gap-3 p-0 md:gap-4 lg:grid-cols-3 lg:gap-5">
            {items.map((c) => (
                <Card
                    key={c.id}
                    as="li"
                    accent
                    padding="md"
                    className="flex flex-col text-start sm:flex-row sm:items-start sm:gap-5 lg:flex-col lg:gap-0"
                >
                    <span className="flex shrink-0 text-navy sm:mt-1.5 lg:mt-0">
                        <BadgeCheckIcon size={24} />
                    </span>
                    <div className="min-w-0 sm:flex-1">
                        <h3 className="m-0 mt-4 sm:mt-0 lg:mt-4">
                            <span className={`block whitespace-nowrap text-navy ${typography.h2Sm}`}>
                                <bdi dir="ltr">{c.name}</bdi>
                            </span>
                            <span className={`mt-2 block text-ink ${typography.h4}`}>{t(`${c.key}.name`)}</span>
                        </h3>
                        <p className={`mb-0 mt-2.5 max-w-prose text-ink-muted ${typography.small}`}>{t(`${c.key}.covers`)}</p>
                    </div>
                </Card>
            ))}
        </ul>
    );
}
