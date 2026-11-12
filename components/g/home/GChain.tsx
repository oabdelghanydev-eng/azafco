import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';

/**
 * Value chain section of design G (boards: Group*.dc.html, section#chain).
 * Phone (<lg): vertical list, 80px round photos, connecting line on the start side.
 * Desktop (>=lg): five centred columns, 168px round photos.
 */
const STAGES = [
    { key: 'farming', src: '/images/g/farm-ponds.webp' },
    { key: 'harvest', src: '/images/g/harvest.webp' },
    { key: 'packing', src: '/images/g/sorting-packing.webp' },
    { key: 'temperature', src: '/images/g/temperature-check.webp' },
    { key: 'export', src: '/images/g/logistics-truck.webp' },
] as const;

export default async function GChain() {
    const [t, locale] = await Promise.all([getTranslations('g_chain_v2'), getLocale()]);
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
    const intro = ar ? 'mt-3.5 mb-[30px] lg:mt-[18px] lg:mb-0' : 'mt-4 mb-8 lg:mt-5 lg:mb-0';
    const stage = ar
        ? 'text-[13px] font-bold lg:mt-[18px] lg:mb-0.5 lg:text-[14px]'
        : 'text-[12px] font-extrabold lg:mt-5 lg:mb-1 lg:text-[13px]';
    const h3 = ar
        ? 'text-[19px] leading-[1.5] font-bold lg:mb-1 lg:text-[22px] lg:leading-[1.4]'
        : 'mb-0.5 text-[19px] leading-[1.25] font-extrabold lg:mb-1.5 lg:text-[21px] lg:leading-[1.65]';
    const text = ar
        ? 'text-[15px] leading-[1.6] lg:text-[16px] lg:leading-[1.7]'
        : 'text-[15px] leading-[1.45] lg:leading-[1.65]';

    return (
        <section
            id="chain"
            aria-labelledby="g-chain-title"
            className={`scroll-mt-24 bg-[#f2f5fa] text-[#0d1f3f] ${base}`}
        >
            <div className="mx-auto box-border max-w-[1320px] px-5 py-16 lg:px-8 lg:py-28">
                <div className={`text-start lg:mx-auto lg:mb-16 lg:text-center ${ar ? 'lg:max-w-[740px]' : 'lg:max-w-[720px]'}`}>
                    <p className={`m-0 text-[#002d72] ${eyebrow}`}>{t('eyebrow')}</p>
                    <h2 id="g-chain-title" className={`m-0 ${h2}`}>
                        {t('title')}
                    </h2>
                    <p className={`text-[#4a5a75] ${intro}`}>{t('intro')}</p>
                </div>

                <ol className="relative m-0 list-none p-0 lg:grid lg:grid-cols-5 lg:gap-x-3 lg:gap-y-10 xl:gap-x-5">
                    {/* connecting line, phone only: centred on the 88px photo column */}
                    <span
                        aria-hidden="true"
                        className="absolute bottom-11 start-[43px] top-11 w-0.5 bg-[#c9d4e6] lg:hidden"
                    />
                    {STAGES.map((s, i) => (
                        <li
                            key={s.key}
                            className={`relative flex items-center gap-[18px] last:pb-0 lg:block lg:pb-0 lg:text-center ${ar ? 'pb-[22px]' : 'pb-6'}`}
                        >
                            <Image
                                src={s.src}
                                alt=""
                                aria-hidden="true"
                                width={168}
                                height={168}
                                sizes="(min-width: 1024px) 168px, 80px"
                                className="box-content h-20 w-20 flex-none rounded-full border-4 border-white object-cover shadow-[0_0_0_2px_#002d72] lg:mx-auto lg:block lg:max-w-none lg:h-[168px] lg:w-[168px] lg:border-[6px]"
                            />
                            <div className="min-w-0">
                                <p className={`m-0 text-[#002d72] ${stage}`}>{t('stageLabel', { n: i + 1 })}</p>
                                <h3 className={`m-0 ${h3}`}>{t(`stages.${s.key}.title`)}</h3>
                                <p className={`m-0 text-[#4a5a75] lg:mx-auto lg:max-w-[220px] ${text}`}>
                                    {t(`stages.${s.key}.text`)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
