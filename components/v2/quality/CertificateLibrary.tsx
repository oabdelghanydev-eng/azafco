import { getTranslations } from 'next-intl/server';
import { publicCertificates } from '@/data/certificates';
import { gType } from '@/components/v2/processing/GPage';

export interface CertificateLibraryProps {
    locale: string;
}

/**
 * The ISO certificates AZAFCO holds, as design G cards (gold top rule, as on the home
 * #quality section). Owner decision 13 Nov 2026: each card shows only the standard
 * name and one plain line on what it covers. Numbers, expiry dates, site, holder,
 * scope and images are never rendered (data/certificates.ts · CERTIFICATE_PUBLIC_FIELDS),
 * and there is no "copies on request" link. The certifier is named once, in the
 * section intro on the page.
 */
export default async function CertificateLibrary({ locale }: CertificateLibraryProps) {
    const t = await getTranslations({ locale, namespace: 'quality_v2.certs.items' });
    const ar = locale === 'ar';
    const ty = gType(ar);
    const items = publicCertificates();
    if (items.length === 0) return null;

    return (
        <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3 md:gap-4 lg:gap-5">
            {items.map((c) => (
                <li
                    key={c.id}
                    className={`flex flex-col rounded border border-t-4 border-[#d5dde9] border-t-[#f7b500] bg-white text-start ${
                        ar ? 'px-5 pb-5 pt-[18px] lg:px-7 lg:pb-7 lg:pt-[26px]' : 'p-5 lg:px-7 lg:pb-[30px] lg:pt-7'
                    }`}
                >
                    <h3 className="m-0">
                        <span
                            dir="ltr"
                            className={`block font-extrabold text-[#002d72] ${ar ? 'text-[24px] leading-[1.2] lg:text-[30px]' : 'text-[24px] leading-[1.1] lg:text-[30px] lg:tracking-[-0.01em]'}`}
                        >
                            {c.name}
                        </span>
                        <span className={`block font-bold ${ar ? 'mt-2 text-[17px] leading-[1.5] lg:mt-2.5 lg:text-[19px]' : 'mt-2 text-[16px] lg:mt-2.5 lg:text-[18px]'}`}>
                            {t(`${c.key}.name`)}
                        </span>
                    </h3>
                    <p className={`mb-0 text-[#4a5a75] ${ar ? 'mt-2 lg:mt-3' : 'mt-2.5 lg:mt-3'} ${ty.small}`}>{t(`${c.key}.covers`)}</p>
                </li>
            ))}
        </ul>
    );
}
