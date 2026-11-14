import type { Metadata } from 'next';
import Image from 'next/image';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import {
    ArrowIcon,
    Button,
    Eyebrow,
    PageHead,
    Section,
    SectionHeading,
    TextLink,
    cardClass,
    cn,
    focusRing,
    typography,
} from '@/components/ui';
import { InsightCard } from '@/components/v2';
import NewsCard from '@/components/v2/insights/NewsCard';
import { getMedia, mediaImage } from '@/lib/v2/media';
import { insightHref, routes } from '@/lib/v2/routes';
import { Link } from '@/navigation';
import { insights, readingMinutes } from '@/components/v2/insights/articles';
import { industryItems, latestPress, pressItems } from '@/data/news';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { companyConfig } from '@/config/company.config';

type Props = { params: Promise<{ locale: string }> };

/** /insights/news (lead: add routes.news to lib/v2/routes.ts) */
const NEWS_PATH = routes.news;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'insights_v2.meta' });
    return pageMetadata({ locale, path: routes.insights, title: t('title'), description: t('description') });
}

export default async function InsightsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'insights_v2' });
    const tn = await getTranslations({ locale, namespace: 'news_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tg = await getTranslations({ locale, namespace: 'guides_page' });
    const format = await getFormatter({ locale });
    const fmt = (iso: string, style: 'medium' | 'long' = 'medium') =>
        format.dateTime(new Date(`${iso}T00:00:00Z`), { dateStyle: style, timeZone: 'UTC' });

    const entries = insights
        .slice()
        .sort((a, b) => b.lastReviewed.localeCompare(a.lastReviewed))
        .map((e) => ({
            ...e,
            title: tg(`${e.translationKey}.h1`),
            excerpt: tg(`${e.translationKey}.card_summary`),
            minutes: readingMinutes(tg.raw(e.translationKey)),
            image: e.imageId ? mediaImage(e.imageId, locale) : undefined,
            href: insightHref(e.slug),
        }));
    const [featured, ...rest] = entries;

    // Content types with published entries only (articles.ts rule). News lives on /insights/news.
    const newsCount = pressItems.length + industryItems.length;
    const categories = [
        { key: 'importer_guide', count: t('grid.count', { count: entries.length }), href: featured?.href, show: entries.length > 0 },
        { key: 'company_news', count: t('categories.news_count', { count: newsCount }), href: NEWS_PATH, show: newsCount > 0 },
    ].filter((c): c is { key: string; count: string; href: string; show: boolean } => c.show && !!c.href);

    const teaser = latestPress(3);

    const baseUrl = companyConfig.contact.baseUrl;
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: [
            ...entries.map((e) => ({ url: `${baseUrl}/${locale}${e.href}`, name: e.title })),
            { url: `${baseUrl}/${locale}${NEWS_PATH}`, name: tn('hero.title') },
        ].map((x, i) => ({ '@type': 'ListItem', position: i + 1, ...x })),
    };

    return (
        <>
            <JsonLd data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [{ name: t('breadcrumb'), path: routes.insights }])} />
            <JsonLd data={itemList} />

            {/* 01 Opening */}
            <PageHead crumbs={[{ label: t('breadcrumb') }]} eyebrow={t('hero.eyebrow')} title={t('hero.title')} titleId="insights-title" intro={t('hero.intro')}>
                <div className="mt-8 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                    {featured ? (
                        <Button href={featured.href} size="lg" stretch="phone" arrow>
                            {t('hero.primary')}
                        </Button>
                    ) : null}
                    <Button href={NEWS_PATH} variant="outline" size="lg" stretch="phone">
                        {t('hero.secondary')}
                    </Button>
                </div>
            </PageHead>

            {/* 02 Featured guide */}
            {featured ? (
                <Section variant="offwhite" labelledBy="in-featured">
                    <article className={cn(cardClass({ accent: true, interactive: true }), 'group relative grid grid-cols-1 overflow-hidden lg:grid-cols-12')}>
                        {featured.image ? (
                            <div className="relative aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
                                <Image
                                    src={featured.image.src}
                                    alt={featured.image.alt}
                                    fill
                                    sizes="(min-width: 1320px) 740px, (min-width: 1024px) 56vw, 100vw"
                                    className="object-cover"
                                />
                            </div>
                        ) : null}
                        <div className={cn('flex flex-col justify-center p-6 sm:p-10', featured.image ? 'lg:col-span-5' : 'lg:col-span-10 lg:p-14')}>
                            <Eyebrow>{t('featured.eyebrow')}</Eyebrow>
                            <p className={cn('mb-0 mt-4 text-ink-muted', typography.small)}>
                                {t(`categories.${featured.category}`)} · <time dateTime={featured.lastReviewed}>{fmt(featured.lastReviewed)}</time> ·{' '}
                                {tv('insight.minutes', { count: featured.minutes })}
                            </p>
                            <h2 id="in-featured" className={cn('mb-0 mt-3 text-ink', typography.h2Sm)}>
                                <Link
                                    href={featured.href}
                                    className={cn('underline-offset-4 after:absolute after:inset-0 after:content-[\'\'] group-hover:underline', focusRing)}
                                >
                                    {featured.title}
                                </Link>
                            </h2>
                            <p className={cn('mb-0 mt-4 max-w-[680px] text-ink-muted', typography.body)}>{featured.excerpt}</p>
                            <span aria-hidden="true" className="v2-btn mt-6 inline-flex items-center gap-2.5 text-link">
                                {t('featured.read')} <ArrowIcon size={20} />
                            </span>
                        </div>
                    </article>
                </Section>
            ) : null}

            {/* 03 Content types: each card opens its listing */}
            {categories.length > 1 ? (
                <Section variant="white" labelledBy="in-categories">
                    <SectionHeading id="in-categories" eyebrow={t('categories.eyebrow')} title={t('categories.title')} />
                    <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:gap-6">
                        {categories.map(({ key, count, href }) => (
                            <li key={key} className="min-w-0">
                                <Link
                                    href={href}
                                    className={cn(cardClass({ accent: true, interactive: true, padding: 'md' }), 'group flex h-full flex-col', focusRing)}
                                >
                                    <span className={cn('block text-ink', typography.h3)}>{t(`categories.${key}`)}</span>
                                    <span className={cn('mt-2 block flex-1 text-ink-muted', typography.small)}>{t(`categories.${key}_text`)}</span>
                                    <span className="mt-6 flex items-center justify-between gap-4">
                                        <span className={cn('font-bold text-navy', typography.small)}>{count}</span>
                                        <span
                                            aria-hidden="true"
                                            className="grid h-tap w-tap place-items-center rounded-full border border-solid border-line text-navy transition-colors duration-base group-hover:border-gold group-hover:bg-gold group-hover:text-navy-900 motion-reduce:transition-none"
                                        >
                                            <ArrowIcon size={20} />
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}

            {/* Editorial standards (the one navy band; mid-page, so it never sits on the navy footer) */}
            <Section variant="navy" labelledBy="in-standards" spacing="lg">
                <div className="max-w-[760px]">
                    <Eyebrow as="h2" id="in-standards">
                        {t('standards.title')}
                    </Eyebrow>
                    <p className={cn('mb-0 mt-4 text-fg-muted', typography.lead)}>{t('standards.text')}</p>
                </div>
            </Section>

            {/* 04 News and press teaser */}
            {teaser.length > 0 ? (
                <Section variant="offwhite" labelledBy="in-news">
                    <SectionHeading
                        id="in-news"
                        eyebrow={tn('teaser.eyebrow')}
                        title={tn('teaser.title')}
                        intro={tn('teaser.intro')}
                        action={<TextLink href={NEWS_PATH}>{tn('teaser.all')}</TextLink>}
                    />
                    <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {teaser.map((n) => (
                            <li key={n.key} className="min-w-0">
                                <NewsCard
                                    title={tn(`items.${n.key}.title`)}
                                    summary={tn(`items.${n.key}.summary`)}
                                    date={n.date}
                                    dateLabel={fmt(n.date, 'long')}
                                    sourceLine={tn('source', { name: tn(`items.${n.key}.source`) })}
                                    image={n.imageId ? mediaImage(n.imageId, locale) : undefined}
                                    illustrativeLabel={n.imageId && getMedia(n.imageId).illustrative ? tn('illustrative') : undefined}
                                    href={`${NEWS_PATH}#news-${n.key}`}
                                />
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}

            {/* 05 More articles (only when there is more than the featured entry) */}
            {rest.length > 0 ? (
                <Section variant="white" labelledBy="in-grid">
                    <SectionHeading id="in-grid" title={t('grid.title')} />
                    <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                        {rest.map((e) => (
                            <li key={e.slug}>
                                <InsightCard
                                    title={e.title}
                                    href={e.href}
                                    excerpt={e.excerpt}
                                    image={e.image}
                                    category={t(`categories.${e.category}`)}
                                    date={e.lastReviewed}
                                    readingMinutes={e.minutes}
                                />
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}
        </>
    );
}
