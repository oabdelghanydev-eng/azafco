import { getLocale, getTranslations } from 'next-intl/server';
import { Card, ExternalLink, Section, SectionHeading, TextLink, cn, typography } from '@/components/ui';
import { newsItems } from '@/data/news';
import { routes } from '@/lib/v2/routes';

/**
 * "In the news" teaser on the home page (carried over from the live site's Media
 * Center). Two company press items with a public link to the coverage itself,
 * newest first: the Governor's visit to the Motobas plant and the TV episode.
 * Data (date, source URL) from data/news.ts; title, summary and source name from
 * news_v2.items.<key> (the copy of /insights/news, one source of truth); section
 * heading and link labels from home_v2.news. The newspaper feature links only to
 * the paper's home page, so it stays on /insights/news.
 */
const ITEMS = ['governor_visit', 'tv_program'] as const;
const NEWS_PATH = routes.news;

export default async function GNews() {
    const [t, tn, locale] = await Promise.all([getTranslations('home_v2.news'), getTranslations('news_v2.items'), getLocale()]);

    // Dates and source URLs from data/news.ts; text from home_v2.news (approved, shortened copy)
    const items = ITEMS.map((key) => ({ key, item: newsItems.find((n) => n.key === key) }))
        .filter((x): x is { key: (typeof ITEMS)[number]; item: NonNullable<typeof x.item> } => !!x.item?.sourceUrl)
        .sort((a, b) => b.item.date.localeCompare(a.item.date));
    if (!items.length) return null;

    // Month and year, Western digits in Arabic too (release decisions: Arabic style)
    const month = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG-u-nu-latn' : locale, {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });

    return (
        <Section id="news" variant="offwhite" labelledBy="g-news-title" className="g-font text-body">
            <SectionHeading id="g-news-title" layout="split" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />

            <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2 md:gap-4 lg:gap-5">
                {items.map(({ key, item }) => (
                    <li key={key} className="min-w-0">
                        <Card as="article" accent padding="md" className="flex h-full flex-col">
                            <p className={cn('m-0 text-ink-muted', typography.caption)}>
                                <span className="font-bold text-navy">{tn(`${key}.source`)}</span>
                                <span aria-hidden="true"> · </span>
                                <time dateTime={item.date} className="whitespace-nowrap">{month.format(new Date(`${item.date}T00:00:00Z`))}</time>
                            </p>
                            <h3 className={cn('v2-heading mb-0 mt-2.5', typography.h3)}>{tn(`${key}.title`)}</h3>
                            <p className="mb-0 mt-2 text-ink-muted">{tn(`${key}.summary`)}</p>
                            <ExternalLink
                                href={item.sourceUrl as string}
                                newTabLabel={t('new_tab')}
                                className="mt-auto self-start pt-4"
                                dataAttrs={{ 'data-cta': `home_news_${key}` }}
                            >
                                {t(`links.${key}`)}
                            </ExternalLink>
                        </Card>
                    </li>
                ))}
            </ul>

            <TextLink href={NEWS_PATH} className="mt-5 lg:mt-8" dataAttrs={{ 'data-cta': 'home_news_all' }}>
                {t('all')}
            </TextLink>
        </Section>
    );
}
