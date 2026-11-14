import { useTranslations } from 'next-intl';
import { StatStrip } from '@/components/ui';
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

/**
 * Design G: hero (#top) with four user-switched slides, then the key-figures strip
 * (approved facts only, from g_hero_v2.stats). `id="top"` is also the hero the
 * floating WhatsApp button waits for (components/v2/MobileQuoteBar).
 */
export default function GHero() {
    const t = useTranslations('g_hero_v2');

    const copy = (t.raw('slides') ?? []) as SlideCopy[];
    const slides: GHeroSlide[] = SLIDE_MEDIA.filter((_, k) => copy[k]).map((m, k) => ({ ...copy[k], ...m }));
    const stats = (t.raw('stats') ?? []) as Stat[];

    return (
        <>
            <section id="top" data-surface="dark" className="g-font relative overflow-hidden bg-navy-900 text-body text-white">
                <GHeroSlides slides={slides} groupLabel={t('groupLabel')} ctaPartner={t('ctaPartner')} ctaFish={t('ctaFish')} />
            </section>

            <StatStrip items={stats} label={t('statsLabel')} className="g-font text-body" />
        </>
    );
}
