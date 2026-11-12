import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { productHref } from '@/lib/v2/routes';
import styles from './GFish.module.css';

/**
 * "Our fish" section of the G landing (boards GroupAr / Group / *Mobile, section#fish).
 * Navy section over the fish-on-ice photo with the 12 species tiles.
 * Each tile links quietly to its product page (data/products.ts slug).
 */

// Board order. key = translation key in g-fish.json, slug = data/products.ts slug.
const SPECIES = [
    { key: 'tilapia', slug: 'tilapia', latin: 'Oreochromis niloticus' },
    { key: 'sea_bass', slug: 'sea-bass', latin: 'Dicentrarchus labrax' },
    { key: 'sea_bream', slug: 'sea-bream', latin: 'Sparus aurata' },
    { key: 'meagre', slug: 'meagre', latin: 'Argyrosomus regius' },
    { key: 'mullet', slug: 'mullet', latin: 'Mugil cephalus' },
    { key: 'thinlip_mullet', slug: 'thinlip-mullet', latin: 'Chelon ramada' },
    { key: 'common_carp', slug: 'common-carp', latin: 'Cyprinus carpio' },
    { key: 'mirror_carp', slug: 'mirror-carp', latin: 'Cyprinus carpio' },
    { key: 'grass_carp', slug: 'grass-carp', latin: 'Ctenopharyngodon idella' },
    { key: 'silver_carp', slug: 'silver-carp', latin: 'Hypophthalmichthys molitrix' },
    { key: 'catfish', slug: 'catfish', latin: 'Clarias gariepinus' },
    { key: 'bayad_catfish', slug: 'bayad-catfish', latin: 'Bagrus bajad' },
] as const;

export default async function GFish() {
    const locale = await getLocale();
    const t = await getTranslations('g_fish_v2');
    const ar = locale === 'ar';

    return (
        <section id="fish" className="relative overflow-hidden bg-[#001b47] text-white">
            <Image
                src="/images/g/fish-on-ice.webp"
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 1024px) 1200px, 100vw"
                className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[rgba(0,27,71,.78)] lg:bg-[rgba(0,27,71,.74)]" />

            <div className="relative mx-auto box-border max-w-[1320px] px-5 py-16 lg:px-8 lg:py-[104px]">
                <div className="lg:mb-12 lg:flex lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-[72px] lg:gap-y-5">
                    <div>
                        <p
                            className={
                                ar
                                    ? 'm-0 mb-2 text-[15px] font-bold text-[#f7b500] lg:mb-3 lg:text-[17px]'
                                    : 'm-0 mb-[10px] text-[14px] font-extrabold text-[#f7b500] lg:mb-[14px] lg:text-[15px]'
                            }
                        >
                            {t('eyebrow')}
                        </p>
                        <h2
                            className={
                                ar
                                    ? 'm-0 text-[28px] font-bold leading-[1.4] lg:text-[clamp(32px,3.4vw,50px)] lg:leading-[1.35]'
                                    : 'm-0 text-[29px] font-extrabold leading-[1.15] tracking-[-0.02em] lg:text-[clamp(32px,3.6vw,52px)] lg:leading-[1.12]'
                            }
                        >
                            {t('title')}
                        </h2>
                    </div>
                    <p
                        className={
                            ar
                                ? 'mb-[26px] mt-[14px] text-[17px] leading-[1.85] text-white/[.88] lg:m-0 lg:max-w-[500px] lg:text-[18px]'
                                : 'mb-7 mt-4 text-[16px] leading-[1.6] text-white/[.88] lg:m-0 lg:max-w-[480px] lg:text-[17px] lg:leading-[1.65] lg:text-white/[.86]'
                        }
                    >
                        {t('intro')}
                    </p>
                </div>

                <ul className={`m-0 grid list-none grid-cols-2 gap-[10px] p-0 md:grid-cols-3 md:gap-3 lg:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] lg:gap-4`}>
                    {SPECIES.map((s) => (
                        <li key={s.slug} className="min-w-0">
                            <Link
                                href={productHref(s.slug)}
                                prefetch={false}
                                className={`${styles.tile} block h-full border border-white/45 bg-[rgba(0,27,71,.45)] px-3 pb-[14px] pt-[10px] text-white lg:px-[22px] lg:pb-5 lg:pt-4`}
                            >
                                <span className="relative block aspect-video w-full">
                                    <Image
                                        src={`/images/species/${s.slug}.webp`}
                                        alt=""
                                        aria-hidden="true"
                                        fill
                                        sizes="(min-width: 1024px) 300px, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 170px"
                                        className={`object-contain ${styles.fish} ${ar ? '-scale-x-100' : ''}`}
                                    />
                                </span>
                                <span
                                    className={
                                        ar
                                            ? `${styles.name} mt-2 block text-[16px] font-bold leading-[1.45] lg:mt-[10px] lg:text-[21px] lg:leading-[1.4]`
                                            : `${styles.name} mt-2 block text-[14px] font-extrabold uppercase leading-[1.2] lg:mt-[10px] lg:text-[19px] lg:tracking-[0.01em]`
                                    }
                                >
                                    {t(`species.${s.key}.name`)}
                                </span>
                                <span
                                    lang="la"
                                    dir="ltr"
                                    className={
                                        ar
                                            ? 'mt-0.5 block break-words text-right text-[12px] italic leading-[1.35] text-white/[.84] [overflow-wrap:anywhere] lg:text-[14px] lg:leading-[1.4] lg:text-white/[.82]'
                                            : 'mt-[3px] block text-left text-[12px] italic leading-[1.3] text-white/[.84] [overflow-wrap:anywhere] lg:mt-0.5 lg:text-[14px] lg:leading-[1.65] lg:text-white/[.82]'
                                    }
                                >
                                    {s.latin}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
