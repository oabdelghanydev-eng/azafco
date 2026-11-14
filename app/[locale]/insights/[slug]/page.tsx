import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { mediaImage } from '@/lib/v2/media';
import { insightHref, routes } from '@/lib/v2/routes';
import { getInsight, insightSlugs, readingMinutes } from '@/components/v2/insights/articles';
import ImportingGuideBody, { IMPORTING_SECTIONS, importingSectionTitles, importingSourceCount } from '@/components/v2/insights/ImportingGuideBody';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { ArrowIcon, Container, PageHead, containerClass, Section, SectionHeading, cardClass, cn, focusRing, typography } from '@/components/ui';
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

    const relatedHrefs = [routes.forImporters, routes.markets, routes.products];
    const related = (t.raw('article.related') as { title: string; text: string }[]).map((r, i) => ({ ...r, href: relatedHrefs[i] }));

    const meta = [
        { label: t('article.by'), value: t('article.author') },
        { label: t('article.published'), value: <time dateTime={entry.datePublished}>{fmt(entry.datePublished)}</time> },
        { label: t('article.reviewed'), value: <time dateTime={entry.lastReviewed}>{reviewed}</time> },
    ];

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
            <PageHead
                crumbs={[{ label: t('breadcrumb'), href: routes.insights }, { label: tg('breadcrumb') }]}
                eyebrow={t(`categories.${entry.category}`)}
                title={title}
                titleId="article-title"
            >
                <dl className="m-0 mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-solid border-rule pt-6">
                    {meta.map((m) => (
                        <div key={m.label}>
                            <dt className={cn('text-fg-muted', typography.small)}>{m.label}</dt>
                            <dd className="m-0 font-bold text-fg">{m.value}</dd>
                        </div>
                    ))}
                    <div>
                        <dt className="sr-only">{t('article.reading_time')}</dt>
                        <dd className={cn('m-0 text-fg-muted sm:pt-[1.6em]', typography.small)}>{tv('insight.minutes', { count: minutes })}</dd>
                    </div>
                </dl>
            </PageHead>

            {image ? (
                <Container className="pt-10 lg:pt-14">
                    <div className="relative aspect-[16/7] overflow-hidden rounded-card">
                        <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1320px) 1256px, 100vw" className="object-cover" />
                    </div>
                </Container>
            ) : null}

            {/* Body + side rail */}
            <article aria-labelledby="article-title" className={cn(containerClass, 'py-section-sm md:py-20 lg:py-24')}>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
                    <aside className="min-w-0 lg:order-2">
                        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
                            <nav aria-labelledby="toc-title" className={cardClass({ padding: 'sm' })}>
                                <h2 id="toc-title" className={cn('m-0 text-ink', typography.h3)}>
                                    {t('article.toc')}
                                </h2>
                                <ol className="m-0 mt-3 flex list-none flex-col p-0">
                                    {IMPORTING_SECTIONS.map((id, i) => (
                                        <li key={id}>
                                            <a
                                                href={`#${id}`}
                                                className={cn('flex min-h-tap items-center gap-3 text-ink hover:text-navy hover:underline', typography.small, focusRing)}
                                            >
                                                <span aria-hidden="true" dir="ltr" className="w-6 shrink-0 font-bold text-navy">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                {sectionTitles[id]}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                            <div className="rounded-card bg-surface-offwhite p-5 lg:p-6">
                                <p className={cn('m-0 text-ink', typography.h3)}>{t('article.sources_side')}</p>
                                <p className={cn('mb-0 mt-1 text-ink-muted', typography.small)}>{t('article.sources_side_text', { count: importingSourceCount })}</p>
                            </div>
                        </div>
                    </aside>
                    <div className="min-w-0 lg:order-1">
                        <ImportingGuideBody locale={locale} reviewedLabel={reviewed} />
                        {/* No closing button row: the G footer carries the contact block (ledger C9) */}
                    </div>
                </div>
            </article>

            {/* Related pages */}
            <Section variant="offwhite" labelledBy="article-related">
                <SectionHeading id="article-related" eyebrow={t('article.related_eyebrow')} title={t('article.related_title')} />
                <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 lg:gap-5">
                    {related.map((r) => (
                        <li key={r.title} className="min-w-0">
                            <Link href={r.href} className={cn(cardClass({ interactive: true, padding: 'md' }), 'group flex h-full flex-col', focusRing)}>
                                <span className={cn('block text-ink', typography.h3)}>{r.title}</span>
                                <span className={cn('mb-5 mt-2 block flex-1 text-ink-muted', typography.small)}>{r.text}</span>
                                <span
                                    aria-hidden="true"
                                    className="grid h-tap w-tap place-items-center rounded-full border border-solid border-line text-navy transition-colors duration-base group-hover:border-gold group-hover:bg-gold group-hover:text-navy-900 motion-reduce:transition-none"
                                >
                                    <ArrowIcon size={20} />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Section>
        </>
    );
}
