import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, Button, CTABand, Container, Eyebrow, FeatureGrid, Section, SectionHeader } from '@/components/v2';
import { mediaImage } from '@/lib/v2/media';
import { insightHref, routes } from '@/lib/v2/routes';
import { getInsight, insightSlugs, readingMinutes } from '@/components/v2/insights/articles';
import ImportingGuideBody, { IMPORTING_SECTIONS, importingSectionTitles, importingSourceCount } from '@/components/v2/insights/ImportingGuideBody';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { companyConfig } from '@/config/company.config';
import { ogImageMap, type Locale } from '@/i18n';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
    return insightSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const entry = getInsight(slug);
    if (!entry) return {};
    const t = await getTranslations({ locale, namespace: `guides_page.${entry.translationKey}` });
    return pageMetadata({
        locale,
        path: insightHref(slug),
        title: t('meta_title'),
        description: t('meta_description'),
        type: 'article',
        publishedTime: entry.datePublished,
        modifiedTime: entry.lastReviewed,
    });
}

export default async function InsightArticlePage({ params }: Props) {
    const { locale, slug } = await params;
    const entry = getInsight(slug);
    if (!entry) notFound();
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'insights_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tg = await getTranslations({ locale, namespace: `guides_page.${entry.translationKey}` });
    const format = await getFormatter({ locale });
    const fmt = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00Z`), { dateStyle: 'long', timeZone: 'UTC' });

    const title = tg('h1');
    const tgAll = await getTranslations({ locale, namespace: 'guides_page' });
    const minutes = readingMinutes(tgAll.raw(entry.translationKey));
    const image = entry.imageId ? mediaImage(entry.imageId, locale) : undefined;
    const reviewed = fmt(entry.lastReviewed);
    const sectionTitles = await importingSectionTitles(locale);

    const baseUrl = companyConfig.contact.baseUrl;
    const pageUrl = `${baseUrl}/${locale}${insightHref(slug)}`;
    const org = {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: companyConfig.identity.tradeName,
        url: baseUrl,
    };
    const article = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: title,
        description: tg('meta_description'),
        inLanguage: locale,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        image: [...(image ? [`${baseUrl}${image.src}`] : []), `${baseUrl}${ogImageMap[locale as Locale] ?? ogImageMap.en}`],
        datePublished: entry.datePublished,
        dateModified: entry.lastReviewed,
        author: org,
        publisher: org,
    };

    const related = (t.raw('article.related') as { title: string; text: string }[]).map((r, i) => ({
        title: r.title,
        description: r.text,
        href: [routes.forImporters, routes.markets, routes.products][i],
        linkLabel: tv('cta.learn_more'),
    }));

    return (
        <>
            <JsonLd data={article} />
            <JsonLd
                data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [
                    { name: t('breadcrumb'), path: routes.insights },
                    { name: tg('breadcrumb'), path: insightHref(slug) },
                ])}
            />

            {/* Article header */}
            <section data-surface="light" aria-labelledby="article-title" className="bg-surface-offwhite pb-10 pt-8 text-fg md:pb-14 md:pt-12">
                <Container>
                    <Breadcrumbs items={[{ label: t('breadcrumb'), href: routes.insights }, { label: tg('breadcrumb') }]} />
                    <div className="mt-8 max-w-4xl">
                        <Eyebrow>{t(`categories.${entry.category}`)}</Eyebrow>
                        <h1 id="article-title" className="v2-heading mt-4 font-display text-display-lg">
                            {title}
                        </h1>
                        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-body-sm">
                            <div>
                                <dt className="text-caption text-fg-muted">{t('article.by')}</dt>
                                <dd className="font-semibold text-fg">{t('article.author')}</dd>
                            </div>
                            <div>
                                <dt className="text-caption text-fg-muted">{t('article.published')}</dt>
                                <dd className="font-semibold text-fg">
                                    <time dateTime={entry.datePublished}>{fmt(entry.datePublished)}</time>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-caption text-fg-muted">{t('article.reviewed')}</dt>
                                <dd className="font-semibold text-fg">
                                    <time dateTime={entry.lastReviewed}>{reviewed}</time>
                                </dd>
                            </div>
                        </dl>
                        <p className="mt-3 text-body-sm text-fg-muted">{tv('insight.minutes', { count: minutes })}</p>
                    </div>
                </Container>
            </section>

            {image ? (
                <div className="bg-white">
                    <Container>
                        <div className="relative -mt-2 aspect-[16/7] overflow-hidden rounded-card md:mt-0">
                            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
                        </div>
                    </Container>
                </div>
            ) : null}

            {/* Body + side rail */}
            <article aria-labelledby="article-title" className="bg-white py-12 text-ink md:py-16">
                <Container grid className="gap-y-10">
                    <aside className="col-span-4 sm:col-span-8 lg:order-2 lg:col-span-4 lg:col-start-9">
                        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
                            <nav aria-labelledby="toc-title" className="rounded-card border border-line p-5">
                                <h2 id="toc-title" className="font-display text-heading-sm text-navy">
                                    {t('article.toc')}
                                </h2>
                                <ol className="mt-3 flex flex-col">
                                    {IMPORTING_SECTIONS.map((id, i) => (
                                        <li key={id}>
                                            <a href={`#${id}`} className="flex min-h-[44px] items-center gap-3 text-body-sm text-ink hover:text-navy hover:underline">
                                                <span aria-hidden="true" className="text-caption font-semibold text-gold-ink">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                {sectionTitles[id]}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                            <div className="rounded-card bg-surface-offwhite p-5">
                                <p className="font-display text-heading-sm text-navy">{t('article.sources_side')}</p>
                                <p className="mt-1 text-body-sm text-ink-muted">{t('article.sources_side_text', { count: importingSourceCount })}</p>
                            </div>
                        </div>
                    </aside>
                    <div className="col-span-4 sm:col-span-8 lg:order-1 lg:col-span-8">
                        <ImportingGuideBody locale={locale} reviewedLabel={reviewed} />
                        {/* The article's single contact link (no inline quote box) */}
                        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line pt-6">
                            <Button href={routes.contact} variant="text" dataAttrs={{ 'data-cta': 'article_contact' }}>
                                {tv('cta.contact_export_team')}
                            </Button>
                            <Button href={routes.insights} variant="text">
                                {t('article.back')}
                            </Button>
                        </div>
                    </div>
                </Container>
            </article>

            <Section variant="offwhite" labelledBy="article-related">
                <SectionHeader id="article-related" size="md" title={t('article.related_title')} />
                <FeatureGrid columns={3} style="card" items={related} />
            </Section>

            <CTABand headingId="article-cta" eyebrow={t('cta.eyebrow')} intro={t('cta.intro')} showQuote={false} />
        </>
    );
}
