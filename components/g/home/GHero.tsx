import { useLocale, useTranslations } from 'next-intl';
import GHeroSlides, { type GHeroSlide } from './GHeroSlides';

type SlideCopy = Omit<GHeroSlide, 'img' | 'pos'>;
type Stat = { value: string; label: string };

/** Images and object-position per slide (board "slides": first slide 78% on phone, 70% on desktop). */
const SLIDE_MEDIA: Pick<GHeroSlide, 'img' | 'pos'>[] = [
    { img: '/images/g/hero-fish-ice.webp', pos: 'object-[78%_50%] lg:object-[70%_50%]' },
    { img: '/images/g/farm-ponds.webp', pos: 'object-center' },
    { img: '/images/g/fish-on-ice.webp', pos: 'object-center' },
    { img: '/images/g/logistics-truck.webp', pos: 'object-center' },
];

/** Design G: hero (#top) with four user-switched slides, then the key-figures strip. */
export default function GHero() {
    const t = useTranslations('g_hero_v2');
    const isAr = useLocale() === 'ar';

    const copy = (t.raw('slides') ?? []) as SlideCopy[];
    const slides: GHeroSlide[] = SLIDE_MEDIA.filter((_, k) => copy[k]).map((m, k) => ({ ...copy[k], ...m }));
    const stats = (t.raw('stats') ?? []) as Stat[];

    const base = isAr
        ? 'text-[17px] leading-[1.85] lg:text-[18px]'
        : 'text-[16px] leading-[1.6] lg:text-[17px] lg:leading-[1.65]';

    return (
        <>
            <section id="top" className={`g-font relative overflow-hidden bg-[#001b47] text-white ${base}`}>
                <GHeroSlides
                    slides={slides}
                    isAr={isAr}
                    groupLabel={t('groupLabel')}
                    ctaPartner={t('ctaPartner')}
                    ctaFish={t('ctaFish')}
                />
            </section>

            <section className={`g-font bg-white text-[#0d1f3f] ${base}`}>
                <div className="mx-auto box-border max-w-[1320px] lg:px-8">
                <dl className="m-0 grid grid-cols-2 border-0 border-b border-solid border-[#e3e8f0] px-5 lg:grid-cols-4 lg:px-0">
                    {stats.map((s, k) => {
                        const last = k === stats.length - 1;
                        const cell = [
                            // phone: 2 x 2 grid with inner rules
                            k < 2 ? 'pt-[26px] pb-[22px] border-0 border-b border-solid border-[#e3e8f0]' : 'pt-[22px] pb-[26px]',
                            k % 2 === 0 ? 'pe-3' : 'ps-4 border-0 border-s border-solid border-[#e3e8f0]',
                            // desktop: one row, no rules
                            'lg:border-0 lg:py-9 lg:ps-0',
                            last ? 'lg:pe-0' : 'lg:pe-6',
                        ].join(' ');
                        return (
                            <div key={s.label} className={`flex flex-col-reverse ${cell}`}>
                                <dt
                                    className={`font-semibold text-[#4a5a75] ${
                                        isAr
                                            ? 'mt-2 text-[15px] leading-[1.6] lg:mt-2.5 lg:text-[18px] lg:leading-[1.85]'
                                            : 'mt-1.5 text-[14px] lg:mt-2 lg:text-[17px]'
                                    }`}
                                >
                                    {s.label}
                                </dt>
                                <dd
                                    className={`m-0 text-[42px] font-extrabold leading-none text-[#002d72] lg:text-[56px] ${
                                        isAr ? '' : 'tracking-[-0.02em]'
                                    }`}
                                >
                                    {s.value}
                                </dd>
                            </div>
                        );
                    })}
                </dl>
                </div>
            </section>
        </>
    );
}
