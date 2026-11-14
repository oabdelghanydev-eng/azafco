import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Badge,
    BadgeCheckIcon,
    Card,
    PageHead,
    Section,
    SectionHeading,
    TextLink,
    cn,
    typography,
} from '@/components/ui';
import NewsCard from '@/components/v2/insights/NewsCard';
import { getMedia, mediaImage } from '@/lib/v2/media';
import { routes } from '@/lib/v2/routes';
import { industryItems, isoStandards, milestones, pressItems, type NewsItem } from '@/data/news';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { companyConfig } from '@/config/company.config';

type Props = { params: Promise<{ locale: string }> };

/** /insights/news (lead: add to lib/v2/routes.ts as routes.news and to the sitemap) */
const NEWS_PATH = routes.news;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'news_v2.meta' });
    return pageMetadata({ locale, path: NEWS_PATH, title: t('title'), description: t('description') });
}

export default async function NewsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'news_v2' });
    const ti = await getTranslations({ locale, namespace: 'insights_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const format = await getFormatter({ locale });
    const fmt = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00Z`), { dateStyle: 'long', timeZone: 'UTC' });

    const card = (n: NewsItem) => {
        const m = n.imageId ? getMedia(n.imageId) : undefined;
        return (
            <NewsCard
                id={`news-${n.key}`}
                title={t(`items.${n.key}.title`)}
                summary={t(`items.${n.key}.summary`)}
                date={n.date}
                dateLabel={fmt(n.date)}
                sourceLine={t('source', { name: t(`items.${n.key}.source`) })}
                image={n.imageId ? mediaImage(n.imageId, locale) : undefined}
                illustrativeLabel={m?.illustrative ? t('illustrative') : undefined}
                sourceUrl={n.sourceUrl}
                viewSourceLabel={t('view_source')}
                newTabLabel={t('new_tab')}
            />
        );
    };

    const baseUrl = companyConfig.contact.baseUrl;
    const pageUrl = `${baseUrl}/${locale}${NEWS_PATH}`;
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: t('hero.title'),
        itemListElement: [...pressItems, ...industryItems].map((n, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${pageUrl}#news-${n.key}`,
            name: t(`items.${n.key}.title`),
        })),
    };

    return (
        <>
            <JsonLd
                data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [
                    { name: ti('breadcrumb'), path: routes.insights },
                    { name: t('breadcrumb'), path: NEWS_PATH },
                ])}
            />
            <JsonLd data={itemList} />

            {/* 01 Opening */}
            <PageHead
                crumbs={[{ label: ti('breadcrumb'), href: routes.insights }, { label: t('breadcrumb') }]}
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                titleId="news-title"
                intro={t('hero.intro')}
            />

            {/* 02 Company news and press */}
            <Section variant="white" labelledBy="news-press">
                <SectionHeading id="news-press" eyebrow={t('press.eyebrow')} title={t('press.title')} intro={t('press.intro')} />
                <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {pressItems.map((n) => (
                        <li key={n.key} className="min-w-0">
                            {card(n)}
                        </li>
                    ))}
                </ul>
            </Section>

            {/* 03 Milestones */}
            <Section variant="offwhite" labelledBy="news-milestones">
                <SectionHeading id="news-milestones" eyebrow={t('milestones.eyebrow')} title={t('milestones.title')} />
                <ol aria-label={t('milestones.list_label')} className="m-0 grid list-none grid-cols-1 gap-0 p-0 md:grid-cols-3 md:gap-6">
                    {milestones.map((m) => (
                        <li
                            key={m.key}
                            className="relative border-s-2 border-solid border-line-track pb-8 ps-6 md:border-s-0 md:border-t-2 md:pb-0 md:ps-0 md:pt-6"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute -start-[7px] top-1 h-3 w-3 rounded-full bg-gold md:-top-[7px] md:start-0"
                            />
                            <p className={cn('m-0 leading-none text-navy', typography.h2Sm)}>
                                {m.year}
                            </p>
                            <h3 className={cn('m-0 mt-3 text-ink', typography.h3)}>{t(`milestones.items.${m.key}.title`)}</h3>
                            <p className={cn('m-0 mt-2 text-ink-muted', typography.small)}>{t(`milestones.items.${m.key}.text`)}</p>
                        </li>
                    ))}
                </ol>

                <Card accent className="mt-8 md:mt-12">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
                        <div className="flex min-w-0 items-start gap-4">
                            <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface-offwhite text-navy">
                                <BadgeCheckIcon size={24} />
                            </span>
                            <div className="min-w-0">
                                <h3 className={cn('m-0 text-ink', typography.h3)}>{t('milestones.iso.title')}</h3>
                                <p className={cn('m-0 mt-2 max-w-[640px] text-ink-muted', typography.small)}>{t('milestones.iso.text')}</p>
                                <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                                    {isoStandards.map((s) => (
                                        <li key={s}>
                                            <Badge tone="outline">
                                                <span dir="ltr">{s}</span>
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <TextLink href={routes.quality} className="shrink-0">
                            {t('milestones.iso.link')}
                        </TextLink>
                    </div>
                </Card>
            </Section>

            {/* 04 Industry context */}
            <Section variant="white" labelledBy="news-industry">
                <SectionHeading id="news-industry" eyebrow={t('industry.eyebrow')} title={t('industry.title')} intro={t('industry.intro')} />
                <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {industryItems.map((n) => (
                        <li key={n.key} className="min-w-0">
                            {card(n)}
                        </li>
                    ))}
                </ul>
                <p className={cn('m-0 mt-8 max-w-[760px] border-s-4 border-solid border-gold bg-surface-offwhite p-4 text-ink-muted lg:p-5', typography.small)}>
                    {t('industry.note')}
                </p>
            </Section>
        </>
    );
}
