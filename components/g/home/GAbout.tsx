import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

/** Design G: "Who we are" section (#about). */
export default function GAbout() {
    const t = useTranslations('g_about_v2');
    const isAr = useLocale() === 'ar';

    return (
        <section
            id="about"
            aria-labelledby="g-about-title"
            className={`g-font bg-white text-[#0d1f3f] ${
                isAr
                    ? 'text-[17px] leading-[1.85] lg:text-[18px]'
                    : 'text-[16px] leading-[1.6] lg:text-[17px] lg:leading-[1.65]'
            }`}
        >
            <div className="mx-auto box-border max-w-[1320px] px-5 py-16 md:max-w-[600px] lg:grid lg:max-w-[1320px] lg:grid-cols-2 lg:items-center lg:gap-x-20 lg:px-8 lg:py-28">
            <div className="relative min-w-0 pb-4 ps-4 lg:pb-7 lg:ps-7">
                <span aria-hidden="true" className="absolute bottom-0 start-0 h-[52%] w-[46%] rounded bg-[#f7b500]" />
                <Image
                    src="/images/g/farm-ponds.webp"
                    alt={t('imageAlt')}
                    width={1536}
                    height={1024}
                    sizes="(min-width: 1320px) 590px, (min-width: 1024px) 45vw, (min-width: 768px) 544px, calc(100vw - 56px)"
                    className="relative block aspect-[3/2] h-auto w-full rounded object-cover"
                />
            </div>

            <div className="min-w-0">
                <p
                    className={`text-[#002d72] ${
                        isAr
                            ? 'mb-2 mt-[34px] text-[15px] font-bold lg:mb-3 lg:mt-0 lg:text-[17px]'
                            : 'mb-2.5 mt-9 text-[14px] font-extrabold lg:mb-3.5 lg:mt-0 lg:text-[15px]'
                    }`}
                >
                    {t('eyebrow')}
                </p>
                <h2
                    id="g-about-title"
                    className={
                        isAr
                            ? 'm-0 text-[#0d1f3f] text-[28px] font-bold leading-[1.4] lg:text-[clamp(32px,3.4vw,50px)] lg:leading-[1.35]'
                            : 'm-0 text-[#0d1f3f] text-[29px] font-extrabold leading-[1.15] tracking-[-0.02em] lg:text-[clamp(32px,3.6vw,52px)] lg:leading-[1.12]'
                    }
                >
                    {t('title')}
                </h2>
                <p className={`mb-0 text-[#4a5a75] ${isAr ? 'mt-4 lg:mt-[22px]' : 'mt-[18px] lg:mt-6'}`}>{t('p1')}</p>
                <p className={`mb-0 text-[#4a5a75] ${isAr ? 'mt-3 lg:mt-3.5' : 'mt-3.5 lg:mt-4'}`}>{t('p2')}</p>
                <a
                    href="#chain"
                    className={`group inline-flex items-center gap-2.5 py-3 text-[#002d72] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002d72] ${
                        isAr ? 'mt-3.5 font-bold lg:mt-6' : 'mt-4 font-extrabold lg:mt-7'
                    }`}
                >
                    {t('link')}
                    <span
                        aria-hidden="true"
                        className={`inline-block motion-safe:transition-transform ${
                            isAr ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                        }`}
                    >
                        {isAr ? '←' : '→'}
                    </span>
                </a>
            </div>
            </div>
        </section>
    );
}
