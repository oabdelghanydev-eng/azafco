import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { CertificateCard, Pending } from '@/components/v2';
import { certificates, type Certificate, type CertificateGroup } from '@/data/certificates';
import { rfqHref } from '@/lib/v2/routes';

/**
 * Standards named on the current/previous site. Each is listed on its own:
 * four separate ISO standards + HACCP (not an ISO standard). Never collapse
 * them into "five ISO certifications".
 */
const STANDARDS = ['ISO 22000', 'ISO 9001', 'ISO 14001', 'ISO 45001', 'HACCP'] as const;

/** data/certificates.ts stores validity as a year ("2023") or an ISO date. */
function validUntilIso(v: string): string | undefined {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    if (/^\d{4}$/.test(v)) return `${v}-12-31`;
    return undefined;
}

function isCurrent(v: string): boolean {
    const iso = validUntilIso(v);
    return !!iso && new Date(`${iso}T23:59:59Z`).getTime() >= Date.now();
}

/** Purpose groups, in display order (food safety first: it is what importers ask for). */
const GROUPS: CertificateGroup[] = ['food_safety', 'export_approval', 'management_system'];

/** Explicit group from the data, else inferred from the standard's name. */
function groupOf(c: Certificate): CertificateGroup {
    if (c.group) return c.group;
    const n = c.name.toUpperCase();
    if (n.startsWith('ISO 22000') || n.startsWith('HACCP') || n.includes('FSSC') || n.includes('BRC') || n.includes('IFS')) return 'food_safety';
    if (n.startsWith('ISO 9001') || n.startsWith('ISO 14001') || n.startsWith('ISO 45001')) return 'management_system';
    return 'export_approval';
}

export interface CertificateLibraryProps {
    locale: string;
    /** Rendered when no certificate is verified + current (production today) */
    empty: ReactNode;
}

/**
 * Certificate cards from data/certificates.ts, grouped by purpose (food safety,
 * export approvals, management systems). A card is shown only when the
 * certificate is in the list, still valid and not withheld (`publishable: false`);
 * each card shows issuer, scope, site and valid-until when present, plus a
 * "Request a copy" action (documents RFQ). Standards without a current certificate
 * appear as <Pending> chips (preview only).
 */
export default function CertificateLibrary({ locale, empty }: CertificateLibraryProps) {
    const tp = useTranslations('v2.pending');
    const tc = useTranslations('v2.certificate');
    // Shown only when current AND not explicitly withheld by the owner
    const current = certificates.filter((c) => isCurrent(c.validUntil) && c.publishable !== false);
    const groups = GROUPS.map((g) => ({ g, items: current.filter((c) => groupOf(c) === g) })).filter((x) => x.items.length > 0);
    const request = rfqHref({ type: 'documents' });
    const missing = STANDARDS.filter((s) => !current.some((c) => c.name.toUpperCase().startsWith(s.toUpperCase())));

    return (
        <div className="space-y-6">
            {groups.length > 0 ? (
                groups.map(({ g, items }) => (
                    <section key={g} aria-labelledby={`cert-group-${g}`}>
                        <h3 id={`cert-group-${g}`} className="mb-4 text-heading-md text-navy">
                            {tc(`groups.${g}`)}
                        </h3>
                        <ul className="grid gap-6 sm:grid-cols-2">
                            {items.map((c) => (
                                <li key={c.id}>
                                    <CertificateCard
                                        verified
                                        headingAs="h4"
                                        name={c.name}
                                        issuer={c.issuer}
                                        scope={c.scope}
                                        site={c.site}
                                        validUntil={validUntilIso(c.validUntil)}
                                        requestHref={request}
                                        image={
                                            c.image
                                                ? { src: c.image, alt: locale === 'ar' ? `صورة شهادة ${c.name}` : `${c.name} certificate`, width: 600, height: 840 }
                                                : undefined
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                ))
            ) : (
                empty
            )}
            {missing.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {missing.map((s) => (
                        <CertificateCard key={s} name={s} verified={false} />
                    ))}
                    <Pending label={tp('certificate_scope')} />
                </div>
            ) : null}
        </div>
    );
}
