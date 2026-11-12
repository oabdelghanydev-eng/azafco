import { getLocale, getTranslations } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';

/**
 * Quality section of design G (boards: Group*.dc.html, section#quality):
 * the three valid ISO certificates issued by TÜV AUSTRIA Egypt.
 * Certificate numbers and dates mirror data/certificates.ts.
 */
const CERTS = ['iso9001', 'iso14001', 'iso45001'] as const;

/** Export team mailbox (details and documents). */
const EXPORT_EMAIL = companyConfig.contact.email;

export default async function GQuality() {
    const [t, locale] = await Promise.all([getTranslations('g_quality_v2'), getLocale()]);
    const ar = locale === 'ar';

    const base = ar
        ? 'text-[17px] leading-[1.85] lg:text-[18px]'
        : 'text-[16px] leading-[1.6] lg:text-[17px] lg:leading-[1.65]';
    const eyebrow = ar
        ? 'mb-2 text-[15px] font-bold lg:mb-3 lg:text-[17px]'
        : 'mb-2.5 text-[14px] font-extrabold lg:mb-3.5 lg:text-[15px]';
    const h2 = ar
        ? 'text-[28px] leading-[1.4] font-bold lg:text-[clamp(32px,3.4vw,50px)] lg:leading-[1.35]'
        : 'text-[29px] leading-[1.15] font-extrabold tracking-[-0.02em] lg:text-[clamp(32px,3.6vw,52px)] lg:leading-[1.12]';
    const intro = ar ? 'mt-3.5 mb-[26px] lg:max-w-[460px]' : 'mt-4 mb-7 lg:max-w-[440px]';
    const card = ar ? 'px-5 pt-[18px] pb-5 lg:px-7 lg:pt-[26px] lg:pb-7' : 'p-5 lg:px-7 lg:pt-7 lg:pb-[30px]';
    const code = ar
        ? 'text-[24px] leading-[1.2] lg:text-[30px]'
        : 'text-[24px] leading-[1.1] lg:text-[30px] lg:tracking-[-0.01em]';
    const name = ar
        ? 'mt-2 mb-2 text-[17px] leading-[1.5] lg:mt-2.5 lg:mb-4 lg:text-[19px]'
        : 'mt-2 mb-3 text-[16px] lg:mt-2.5 lg:mb-[18px] lg:text-[18px]';
    const meta = ar
        ? 'text-[15px] leading-[1.6] lg:text-[16px] lg:leading-[1.85]'
        : 'text-[14px] lg:text-[15px]';

    return (
        <section
            id="quality"
            aria-labelledby="g-quality-title"
            className={`mx-auto box-border max-w-[1320px] scroll-mt-24 bg-white px-5 py-16 text-[#0d1f3f] lg:px-8 lg:py-28 ${base}`}
        >
            <div className="lg:mb-12 lg:flex lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-16 lg:gap-y-4">
                <div>
                    <p className={`m-0 text-[#002d72] ${eyebrow}`}>{t('eyebrow')}</p>
                    <h2 id="g-quality-title" className={`m-0 ${h2}`}>
                        {t('title')}
                    </h2>
                </div>
                <p className={`text-[#4a5a75] lg:m-0 ${intro}`}>
                    {t.rich('intro', {
                        copies: (chunks) => (
                            <a
                                href={`mailto:${EXPORT_EMAIL}?subject=${encodeURIComponent(t('copiesSubject'))}`}
                                aria-label={t('copiesLabel')}
                                className="font-semibold text-[#002d72] underline underline-offset-4 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002d72]"
                            >
                                {chunks}
                            </a>
                        ),
                    })}
                </p>
            </div>

            <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3 md:gap-4 lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] lg:gap-5">
                {CERTS.map((key) => (
                    <li
                        key={key}
                        className={`rounded border border-t-4 border-[#d5dde9] border-t-[#f7b500] bg-white text-start ${card}`}
                    >
                        <p className={`m-0 font-extrabold text-[#002d72] ${code}`}>
                            <span dir="ltr">{t(`certs.${key}.code`)}</span>
                        </p>
                        <p className={`font-bold ${name}`}>{t(`certs.${key}.name`)}</p>
                        <p className={`m-0 text-[#4a5a75] ${meta}`}>
                            {t('certificate')} <span dir="ltr">{t(`certs.${key}.no`)}</span>
                            {/* phone: one line "… · valid until …"; desktop: second line */}
                            <span className="md:hidden">
                                {' · '}
                                {t('validUntilInline', { date: t(`certs.${key}.until`) })}
                            </span>
                            <span className={`hidden md:block ${ar ? '' : 'md:mt-0.5'}`}>
                                {t('validUntil', { date: t(`certs.${key}.until`) })}
                            </span>
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
