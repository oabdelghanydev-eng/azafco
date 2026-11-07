import type { Metadata } from 'next';
import Image from 'next/image';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowIcon, Breadcrumbs, CTABand, Eyebrow, InsightCard, PageHero, Section, SectionHeader } from '@/components/v2';
import { mediaImage } from '@/lib/v2/media';
import { insightHref, routes } from '@/lib/v2/routes';
import { Link } from '@/navigation';
import { INSIGHT_CATEGORIES, insights, readingMinutes } from '@/components/v2/insights/articles';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
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
    const t = await getTranslations({ locale, namespace: 'insights_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tg = await getTranslations({ locale, namespace: 'guides_page' });
    const format = await getFormatter({ locale });

    const entries = insights
        .slice()
        .sort((a, b) => b.lastReviewed.localeCompare(a.lastReviewed))
        .map((e) => ({
            ...e,
            title: tg(`${e.translationKey}.h1`),
            excerpt: tg(`${e.translationKey}.card_summary`),
            minutes: readingMinutes(tg.raw(e.translationKey)),
            image: mediaImage(e.imageId, locale),
            href: insightHref(e.slug),
        }));
    const [featured, ...rest] = entries;

    const baseUrl = companyConfig.contact.baseUrl;
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: entries.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${baseUrl}/${locale}${e.href}`, name: e.title })),
    };

    return (
        <>
            <JsonLd data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [{ name: t('breadcrumb'), path: routes.insights }])} />
            <JsonLd data={itemList} />

            {/* 01 Editorial opening */}
            <PageHero
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                image={mediaImage('facility-exterior-night', locale)}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                primaryAction={featured ? { label: t('hero.primary'), href: featured.href } : undefined}
                secondaryAction={{ label: t('hero.secondary'), href: routes.products }}
            />

            {/* 02 Featured guide */}
            {featured ? (
                <Section variant="offwhite" labelledBy="in-featured">
                    <article className="relative grid grid-cols-1 overflow-hidden rounded-card border border-line bg-white shadow-card lg:grid-cols-12">
                        <div className="relative aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
                            <Image
                                src={featured.image.src}
                                alt={featured.image.alt}
                                fill
                                sizes="(min-width: 1024px) 700px, 100vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-5">
                            <Eyebrow>{t('featured.eyebrow')}</Eyebrow>
                            <p className="mt-4 text-caption text-ink-muted">
                                {t(`categories.${featured.category}`)} · <time dateTime={featured.lastReviewed}>{format.dateTime(new Date(featured.lastReviewed), { dateStyle: 'medium' })}</time> ·{' '}
                                {tv('insight.minutes', { count: featured.minutes })}
                            </p>
                            <h2 id="in-featured" className="mt-3 font-display text-heading-xl text-navy">
                                <Link href={featured.href} className="after:absolute after:inset-0 after:content-[''] hover:underline">
                                    {featured.title}
                                </Link>
                            </h2>
                            <p className="mt-4 text-body text-ink-muted">{featured.excerpt}</p>
                            <span aria-hidden="true" className="mt-6 inline-flex items-center gap-2 font-semibold text-navy">
                                {t('featured.read')} <ArrowIcon size={18} />
                            </span>
                        </div>
                    </article>
                </Section>
            ) : null}

            {/* 03 Categories (what we publish) */}
            <Section variant="light" labelledBy="in-categories">
                <SectionHeader id="in-categories" size="md" eyebrow={t('categories.eyebrow')} title={t('categories.title')} />
                <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {INSIGHT_CATEGORIES.map((c) => {
                        const count = entries.filter((e) => e.category === c).length;
                        return (
                            <li key={c} className="border-t-2 border-navy pt-5">
                                <h3 className="font-display text-heading-md text-navy">{t(`categories.${c}`)}</h3>
                                <p className="mt-2 text-body-sm text-ink-muted">{t(`categories.${c}_text`)}</p>
                                {count > 0 ? <p className="mt-3 text-caption font-semibold text-ink">{t('grid.count', { count })}</p> : null}
                            </li>
                        );
                    })}
                </ul>
            </Section>

            {/* 04 Content grid (only when there is more than the featured entry) */}
            {rest.length > 0 ? (
                <Section variant="offwhite" labelledBy="in-grid">
                    <SectionHeader id="in-grid" size="md" title={t('grid.title')} />
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* 07 Editorial guardrails */}
            <Section variant="light" spacing="sm" labelledBy="in-standards">
                <div className="max-w-prose-v2 border-s-2 border-gold ps-6">
                    <h2 id="in-standards" className="font-display text-heading-md text-navy">
                        {t('standards.title')}
                    </h2>
                    <p className="mt-2 text-body text-ink-muted">{t('standards.text')}</p>
                </div>
            </Section>

            {/* 08 Closing CTA */}
            <CTABand headingId="in-cta" eyebrow={t('cta.eyebrow')} title={t('cta.title')} intro={t('cta.intro')} />
        </>
    );
}
