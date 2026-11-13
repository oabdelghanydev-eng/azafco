import type { Metadata } from 'next';
import Image from 'next/image';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { InsightCard } from '@/components/v2';
import { mediaImage } from '@/lib/v2/media';
import { insightHref, rfqHref, routes } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import { Link } from '@/navigation';
import { INSIGHT_CATEGORIES, insights, readingMinutes } from '@/components/v2/insights/articles';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { FOCUS_LIGHT, GArrow, GEyebrow, GLinkButton, GPageHead, GSectionHead, gBody, gCard, gH2, gH3, gSectionY, gSmall, gWrap } from '@/components/v2/contact/g';
import { companyConfig } from '@/config/company.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'insights_v2.meta' });
    return pageMetadata({ locale, path: routes.insights, title: t('title'), description: t('description') });
}

export default async function InsightsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const ar = locale === 'ar';
    const t = await getTranslations({ locale, namespace: 'insights_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tg = await getTranslations({ locale, namespace: 'guides_page' });
    const format = await getFormatter({ locale });
    const fmt = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00Z`), { dateStyle: 'medium', timeZone: 'UTC' });

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
    const categories = INSIGHT_CATEGORIES.map((key) => ({ key, count: entries.filter((e) => e.category === key).length })).filter((c) => c.count > 0);

    const baseUrl = companyConfig.contact.baseUrl;
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: entries.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${baseUrl}/${locale}${e.href}`, name: e.title })),
    };

    return (
        <div className={cn('g-font bg-white text-[#0d1f3f]', gBody(ar))}>
            <JsonLd data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [{ name: t('breadcrumb'), path: routes.insights }])} />
            <JsonLd data={itemList} />

            {/* 01 Opening */}
            <GPageHead ar={ar} crumbs={[{ label: t('breadcrumb') }]} eyebrow={t('hero.eyebrow')} title={t('hero.title')} titleId="insights-title" intro={t('hero.intro')}>
                <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                    {featured ? (
                        <GLinkButton href={featured.href} ar={ar} variant="gold" arrow dark>
                            {t('hero.primary')}
                        </GLinkButton>
                    ) : null}
                    <GLinkButton href={routes.products} ar={ar} variant="outline-light">
                        {t('hero.secondary')}
                    </GLinkButton>
                </div>
            </GPageHead>

            {/* 02 Featured guide */}
            {featured ? (
                <section aria-labelledby="in-featured" className="bg-[#f2f5fa]">
                    <div className={cn(gWrap, gSectionY)}>
                        <article className={cn(gCard(true), 'relative grid grid-cols-1 overflow-hidden lg:grid-cols-12')}>
                            {featured.image ? (
                                <div className="relative aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
                                    <Image src={featured.image.src} alt={featured.image.alt} fill sizes="(min-width: 1320px) 740px, (min-width: 1024px) 56vw, 100vw" className="object-cover" />
                                </div>
                            ) : null}
                            <div className={cn('flex flex-col justify-center p-6 sm:p-10', featured.image ? 'lg:col-span-5' : 'lg:col-span-10 lg:p-14')}>
                                <GEyebrow ar={ar}>{t('featured.eyebrow')}</GEyebrow>
                                <p className={cn('mb-0 mt-4 text-[#4a5a75]', gSmall(ar))}>
                                    {t(`categories.${featured.category}`)} · <time dateTime={featured.lastReviewed}>{fmt(featured.lastReviewed)}</time> ·{' '}
                                    {tv('insight.minutes', { count: featured.minutes })}
                                </p>
                                <h2
                                    id="in-featured"
                                    className={cn(
                                        'mb-0 mt-3 text-[#0d1f3f]',
                                        ar ? 'text-[26px] font-bold leading-[1.45] lg:text-[34px]' : 'text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] lg:text-[36px]',
                                    )}
                                >
                                    <Link href={featured.href} className={cn('after:absolute after:inset-0 after:content-[\'\'] hover:underline', FOCUS_LIGHT)}>
                                        {featured.title}
                                    </Link>
                                </h2>
                                <p className="mb-0 mt-4 max-w-[680px] text-[#4a5a75]">{featured.excerpt}</p>
                                <span aria-hidden="true" className={cn('mt-6 inline-flex items-center gap-2.5 text-[#002d72]', ar ? 'font-bold' : 'font-extrabold')}>
                                    {t('featured.read')} <GArrow ar={ar} />
                                </span>
                            </div>
                        </article>
                    </div>
                </section>
            ) : null}

            {/* 03 Categories (what we publish): only categories with published entries (articles.ts rule) */}
            {categories.length > 1 ? (
                <section aria-labelledby="in-categories" className={cn(gWrap, gSectionY)}>
                    <GSectionHead ar={ar} id="in-categories" eyebrow={t('categories.eyebrow')} title={t('categories.title')} />
                    <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 lg:gap-5">
                        {categories.map(({ key, count }) => (
                            <li key={key} className={cn(gCard(true), 'p-6 lg:p-8')}>
                                <h3 className={cn(gH3(ar), 'text-[#0d1f3f]')}>{t(`categories.${key}`)}</h3>
                                <p className={cn('mb-0 mt-2 text-[#4a5a75]', gSmall(ar))}>{t(`categories.${key}_text`)}</p>
                                <p className={cn('mb-0 mt-4 font-bold text-[#002d72]', gSmall(ar))}>{t('grid.count', { count })}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            {/* 04 Content grid (only when there is more than the featured entry) */}
            {rest.length > 0 ? (
                <section aria-labelledby="in-grid" className="bg-[#f2f5fa]">
                    <div className={cn(gWrap, gSectionY)}>
                        <GSectionHead ar={ar} id="in-grid" title={t('grid.title')} />
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
                    </div>
                </section>
            ) : null}

            {/* 05 Editorial standards */}
            <section aria-labelledby="in-standards" className="bg-[#002d72] text-white" data-surface="dark">
                <div className={cn(gWrap, 'py-16 lg:py-20')}>
                    <div className="max-w-[760px]">
                        <GEyebrow ar={ar} dark as="h2" id="in-standards">
                            {t('standards.title')}
                        </GEyebrow>
                        <p className={cn('mb-0 mt-4 text-white/[.86]', ar ? 'text-[19px] leading-[1.85] lg:text-[21px]' : 'text-[18px] leading-[1.6] lg:text-[20px]')}>
                            {t('standards.text')}
                        </p>
                    </div>
                </div>
            </section>

            {/* 06 Next step: requirements or the fish */}
            <section aria-labelledby="in-cta" className={cn(gWrap, 'py-16 lg:py-24')}>
                <div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
                    <div className="max-w-[720px]">
                        <GEyebrow ar={ar} className="mb-2 lg:mb-3">
                            {t('cta.eyebrow')}
                        </GEyebrow>
                        <h2 id="in-cta" className={cn(gH2(ar), 'text-[#0d1f3f]')}>
                            {t('cta.title')}
                        </h2>
                        <p className="mb-0 mt-4 text-[#4a5a75]">{t('cta.text')}</p>
                    </div>
                    <div className="mt-8 grid shrink-0 gap-3 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-0">
                        <GLinkButton href={rfqHref()} ar={ar} variant="gold" arrow dataAttrs={{ 'data-cta': 'insights_requirements' }}>
                            {t('cta.primary')}
                        </GLinkButton>
                        <GLinkButton href={routes.products} ar={ar} variant="outline">
                            {t('cta.secondary')}
                        </GLinkButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
