import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { Container, Section, SectionHeading, TextLink, cn, focusRing, typography } from '@/components/ui';
import { productHref, routes } from '@/lib/v2/routes';

/**
 * "Our fish" section of the G landing (boards GroupAr / Group / *Mobile, section#fish).
 * Navy section over the fish-on-ice photo with the 12 main species tiles
 * (names = locales/*\/data/products.json) and the "other species on request" line.
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

/** Tile: hairline white frame on a translucent navy panel; gold frame and name on hover. */
const tile = cn(
    'group block h-full border border-solid border-white/45 bg-navy-900/[.45] px-3 pb-3.5 pt-2.5 text-white no-underline',
    'transition-colors duration-base ease-out hover:border-gold hover:bg-navy-900/60 motion-reduce:transition-none',
    'lg:px-[22px] lg:pb-5 lg:pt-4',
    focusRing,
);

export default async function GFish() {
    const t = await getTranslations('g_fish_v2');

    return (
        <Section id="fish" variant="navy" labelledBy="g-fish-title" contained={false} className="g-font overflow-hidden text-body">
            <Image src="/images/g/fish-on-ice.webp" alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 1200px, 100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-navy-900/[.78] lg:bg-navy-900/[.74]" />

            <Container className="relative">
                <SectionHeading id="g-fish-title" layout="split" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />

                <ul className="m-0 grid list-none grid-cols-2 gap-2.5 p-0 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4">
                    {SPECIES.map((s) => (
                        <li key={s.slug} className="min-w-0">
                            <Link href={productHref(s.slug)} prefetch={false} className={tile}>
                                <span className="relative block aspect-video w-full">
                                    <Image
                                        src={`/images/species/${s.slug}.webp`}
                                        alt=""
                                        aria-hidden="true"
                                        fill
                                        sizes="(min-width: 1024px) 300px, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 170px"
                                        className="object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)] rtl:-scale-x-100 lg:drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]"
                                    />
                                </span>
                                <span
                                    className={cn(
                                        'mt-2 block text-white transition-colors duration-base group-hover:text-gold motion-reduce:transition-none lg:mt-2.5',
                                        typography.h4,
                                        'lg:text-heading-md',
                                    )}
                                >
                                    {t(`species.${s.key}.name`)}
                                </span>
                                <span
                                    lang="la"
                                    dir="ltr"
                                    className="mt-0.5 block text-left text-caption italic text-fg-muted [overflow-wrap:anywhere] rtl:text-right"
                                >
                                    {s.latin}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* The 12 are the main species; others are supplied on request (owner, 13 Nov) */}
                <p className="mb-0 mt-6 text-fg-muted lg:mt-8">{t('note')}</p>
                <TextLink href={routes.products} className="mt-4 lg:mt-5" dataAttrs={{ 'data-cta': 'home_fish_page' }}>
                    {t('pageLink')}
                </TextLink>
            </Container>
        </Section>
    );
}
