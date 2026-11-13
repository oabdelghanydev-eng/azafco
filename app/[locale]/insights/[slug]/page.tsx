import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { mediaImage } from '@/lib/v2/media';
import { insightHref, rfqHref, routes } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import { getInsight, insightSlugs, readingMinutes } from '@/components/v2/insights/articles';
import ImportingGuideBody, { IMPORTING_SECTIONS, importingSectionTitles, importingSourceCount } from '@/components/v2/insights/ImportingGuideBody';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { FOCUS_LIGHT, GArrow, GEyebrow, GLinkButton, GPageHead, gBody, gCard, gH3, gSmall, gWrap } from '@/components/v2/contact/g';
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
    const ar = locale === 'ar';

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
        <div className={cn('g-font bg-white text-[#0d1f3f]', gBody(ar))}>
            <JsonLd data={article} />
            <JsonLd
                data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [
                    { name: t('breadcrumb'), path: routes.insights },
                    { name: tg('breadcrumb'), path: insightHref(slug) },
                ])}
            />

            {/* Article header */}
            <GPageHead
                ar={ar}
                crumbs={[{ label: t('breadcrumb'), href: routes.insights }, { label: tg('breadcrumb') }]}
                eyebrow={t(`categories.${entry.category}`)}
                title={title}
                titleId="article-title"
            >
                <dl className="m-0 mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/[.16] pt-6">
                    {meta.map((m) => (
                        <div key={m.label}>
                            <dt className={cn('text-white/[.66]', gSmall(ar))}>{m.label}</dt>
                            <dd className="m-0 font-bold text-white">{m.value}</dd>
                        </div>
                    ))}
                    <div>
                        <dt className="sr-only">{t('article.reading_time')}</dt>
                        <dd className={cn('m-0 text-white/[.66] sm:pt-[1.6em]', gSmall(ar))}>{tv('insight.minutes', { count: minutes })}</dd>
                    </div>
                </dl>
            </GPageHead>

            {image ? (
                <div className={cn(gWrap, 'pt-10 lg:pt-14')}>
                    <div className="relative aspect-[16/7] overflow-hidden rounded">
                        <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1320px) 1256px, 100vw" className="object-cover" />
                    </div>
                </div>
            ) : null}

            {/* Body + side rail */}
            <article aria-labelledby="article-title" className={cn(gWrap, 'py-14 lg:py-24')}>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
                    <aside className="min-w-0 lg:order-2">
                        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
                            <nav aria-labelledby="toc-title" className="rounded border border-[#d5dde9] p-5 lg:p-6">
                                <h2 id="toc-title" className={cn(gH3(ar), 'text-[#0d1f3f]')}>
                                    {t('article.toc')}
                                </h2>
                                <ol className="m-0 mt-3 flex list-none flex-col p-0">
                                    {IMPORTING_SECTIONS.map((id, i) => (
                                        <li key={id}>
                                            <a
                                                href={`#${id}`}
                                                className={cn('flex min-h-[44px] items-center gap-3 text-[#0d1f3f] hover:text-[#002d72] hover:underline', gSmall(ar), FOCUS_LIGHT)}
                                            >
                                                <span aria-hidden="true" className="w-6 shrink-0 font-bold text-[#002d72]">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                {sectionTitles[id]}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                            <div className="rounded bg-[#f2f5fa] p-5 lg:p-6">
                                <p className={cn(gH3(ar), 'text-[#0d1f3f]')}>{t('article.sources_side')}</p>
                                <p className={cn('mb-0 mt-1 text-[#4a5a75]', gSmall(ar))}>{t('article.sources_side_text', { count: importingSourceCount })}</p>
                            </div>
                        </div>
                    </aside>
                    <div className="min-w-0 lg:order-1">
                        <ImportingGuideBody locale={locale} reviewedLabel={reviewed} />
                        {/* The article's single requirements link (no inline offer box) */}
                        <div className="mt-14 flex flex-col gap-3 border-t border-[#d5dde9] pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                            <GLinkButton href={rfqHref()} ar={ar} variant="gold" arrow dataAttrs={{ 'data-cta': 'article_requirements' }}>
                                {t('article.contact')}
                            </GLinkButton>
                            <GLinkButton href={routes.insights} ar={ar} variant="outline">
                                {t('article.back')}
                            </GLinkButton>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related pages */}
            <section aria-labelledby="article-related" className="bg-[#f2f5fa]">
                <div className={cn(gWrap, 'py-16 lg:py-24')}>
                    <GEyebrow ar={ar} className="mb-2 lg:mb-3">
                        {t('article.related_eyebrow')}
                    </GEyebrow>
                    <h2
                        id="article-related"
                        className={cn('m-0 text-[#0d1f3f]', ar ? 'text-[26px] font-bold leading-[1.45] lg:text-[34px]' : 'text-[27px] font-extrabold leading-[1.2] tracking-[-0.02em] lg:text-[36px]')}
                    >
                        {t('article.related_title')}
                    </h2>
                    <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 lg:gap-5">
                        {related.map((r) => (
                            <li key={r.title} className="min-w-0">
                                <Link href={r.href} className={cn(gCard(), 'group flex h-full flex-col p-6 transition-colors hover:border-[#002d72] lg:p-8', FOCUS_LIGHT)}>
                                    <span className={cn(gH3(ar), 'block text-[#0d1f3f]')}>{r.title}</span>
                                    <span className={cn('mb-5 mt-2 block flex-1 text-[#4a5a75]', gSmall(ar))}>{r.text}</span>
                                    <span
                                        aria-hidden="true"
                                        className="grid h-11 w-11 place-items-center rounded-full border border-[#d5dde9] text-[#002d72] transition-colors group-hover:border-[#f7b500] group-hover:bg-[#f7b500] group-hover:text-[#001b47]"
                                    >
                                        <GArrow ar={ar} />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}
