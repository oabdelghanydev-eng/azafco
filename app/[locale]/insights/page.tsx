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
import { mediaImage } from '@/lib/v2/media';
import { insightHref, routes } from '@/lib/v2/routes';
import { Link } from '@/navigation';
import { insights, readingMinutes } from '@/components/v2/insights/articles';
import { newsItems } from '@/data/news';
import { REVIEW_DATE_FORMAT, isoDate } from '@/data/market-import';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { companyConfig } from '@/config/company.config';

type Props = { params: Promise<{ locale: string }> };

/** Company news lives on this page (the old /insights/news 308s here). */
const NEWS_ID = 'news';
const NEWS_HREF = `${routes.insights}#${NEWS_ID}`;

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
    // One date format everywhere ("14 November 2026" / «14 نوفمبر 2026»)
    const fmt = (iso: string) => format.dateTime(isoDate(iso), REVIEW_DATE_FORMAT);

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

    const baseUrl = companyConfig.contact.baseUrl;
    const pageUrl = `${baseUrl}/${locale}${routes.insights}`;
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: t('hero.title'),
        itemListElement: [
            ...entries.map((e) => ({ url: `${baseUrl}/${locale}${e.href}`, name: e.title })),
            ...newsItems.map((n) => ({ url: `${pageUrl}#news-${n.key}`, name: tn(`items.${n.key}.title`) })),
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
                    {newsItems.length > 0 ? (
                        <Button href={NEWS_HREF} variant="outline" size="lg" stretch="phone">
                            {t('hero.secondary')}
                        </Button>
                    ) : null}
                </div>
            </PageHead>

            {/* 02 The importer guide */}
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

            {/* 03 More guides (only when there is more than the featured entry) */}
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

            {/* 04 Company news (target of /insights#news and the old /insights/news) */}
            {newsItems.length > 0 ? (
                <Section id={NEWS_ID} variant={rest.length > 0 ? 'offwhite' : 'white'} labelledBy="in-news" className="scroll-mt-28">
                    <SectionHeading
                        id="in-news"
                        eyebrow={tn('press.eyebrow')}
                        title={tn('press.title')}
                        intro={tn('press.intro')}
                        action={<TextLink href={`${routes.about}#about-journey`}>{tn('milestones_link')}</TextLink>}
                    />
                    <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {newsItems.map((n) => (
                            <li key={n.key} className="min-w-0">
                                <NewsCard
                                    id={`news-${n.key}`}
                                    title={tn(`items.${n.key}.title`)}
                                    summary={tn(`items.${n.key}.summary`)}
                                    date={n.date}
                                    dateLabel={fmt(n.date)}
                                    sourceLine={tn('source', { name: tn(`items.${n.key}.source`) })}
                                    sourceUrl={n.sourceUrl}
                                    viewSourceLabel={tn('view_source')}
                                    newTabLabel={tn('new_tab')}
                                />
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}
        </>
    );
}
