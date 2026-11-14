import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageStructuredData } from '@/components/StructuredData';
import { buildPageMetadata } from '@/components/v2/businesses/pageMetadata';
import GHero from '@/components/g/home/GHero';
import GAbout from '@/components/g/home/GAbout';
import GFish from '@/components/g/home/GFish';
import GChain from '@/components/g/home/GChain';
import GQuality from '@/components/g/home/GQuality';
import GMarkets from '@/components/g/home/GMarkets';
import GNews from '@/components/g/home/GNews';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'home_v2.meta' });
    return buildPageMetadata({ locale, path: '', title: t('title'), description: t('description') });
}

/** Home page, design G (navy/gold). Sections in the order of the approved G canvas boards. */
export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="g-scope">
            <PageStructuredData locale={locale} pageType="home" />
            <GHero />
            <GAbout />
            <GFish />
            <GChain />
            <GQuality />
            <GMarkets />
            <GNews />
        </div>
    );
}
