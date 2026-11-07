import type { ReactNode } from 'react';
import { CertificateCard, Pending } from '@/components/v2';
import { certificates } from '@/data/certificates';

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

export interface CertificateLibraryProps {
    locale: string;
    /** Rendered when no certificate is verified + current (production today) */
    empty: ReactNode;
}

/**
 * Certificate cards from data/certificates.ts. A card is shown only when the
 * certificate is in the published list AND still valid; scope is not in the
 * data yet, so it is never shown. Standards without a current certificate
 * appear as <Pending> chips (preview only).
 */
export default function CertificateLibrary({ locale, empty }: CertificateLibraryProps) {
    const current = certificates.filter((c) => isCurrent(c.validUntil));
    const missing = STANDARDS.filter((s) => !current.some((c) => c.name.toUpperCase().startsWith(s.toUpperCase())));

    return (
        <div className="space-y-6">
            {current.length > 0 ? (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {current.map((c) => (
                        <li key={c.id}>
                            <CertificateCard
                                verified
                                name={c.name}
                                issuer={c.issuer}
                                validUntil={validUntilIso(c.validUntil)}
                                image={{ src: c.image, alt: locale === 'ar' ? `صورة شهادة ${c.name}` : `${c.name} certificate`, width: 600, height: 840 }}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                empty
            )}
            {missing.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {missing.map((s) => (
                        <CertificateCard key={s} name={s} verified={false} />
                    ))}
                    <Pending label="Certificate scope (sites/products covered) is not in data/certificates.ts" />
                </div>
            ) : null}
        </div>
    );
}
