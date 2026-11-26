import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHead, Section, cn, typography } from '@/components/ui';
import SpeciesStage, { type StageItem } from '@/components/v2/products/SpeciesStage';
import { baseUrl, getCatalogue, getRootT, getSpecView, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { localeConfig, type Locale } from '@/i18n';
import { routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'catalogue_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    return pageMetadata({ locale, path: routes.products, title: t('title'), description: t('description'), siteName: site('name') });
}

export default async function CataloguePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'catalogue_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const root = await getRootT(locale);
    // Published species only (eel is kept in data but unpublished)
    const catalogue = await getCatalogue(locale);

    // Origin, form and packing are the same for all 12 and said once in the hero intro;
    // each species keeps only what differs: names, water type and the indicative weight grades (data/specs.ts).
    const items: StageItem[] = catalogue.map((p, i) => {
        const spec = getSpecView(root, locale, p.slug);
        return {
            slug: p.slug,
            href: p.href,
            num: String(i + 1).padStart(2, '0'),
            name: p.name,
            scientificName: p.scientificName,
            altNames: p.altNames,
            water: t(`water.${p.category}`),
            gradesLabel: spec.grades.length ? t('card.grades') : t('card.grades_label'),
            grades: spec.grades.length ? spec.grades : [t('card.grades_none')],
            image: p.image,
        };
    });

    const localeUrl = `${baseUrl}/${locale}`;
    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${localeUrl}${routes.products}#catalogue`,
            name: t('schema.list_name'),
            numberOfItems: catalogue.length,
            itemListElement: catalogue.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: p.name,
                url: `${localeUrl}${p.href}`,
            })),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: tv('breadcrumbs.home'), item: localeUrl },
                { '@type': 'ListItem', position: 2, name: t('breadcrumb'), item: `${localeUrl}${routes.products}` },
            ],
        },
    ];

    return (
        <>
            {schemas.map((s, i) => (
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(s) }} />
            ))}

            {/* No contact buttons here (owner, 25 Nov 2026): a visitor who opens this page came for the fish;
                the header, the footer and the floating WhatsApp button carry the contact. */}
            <PageHead
                compact
                crumbs={[{ label: t('breadcrumb') }]}
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                titleId="catalogue-title"
                intro={t('hero.intro')}
            />

            {/* The species stage: the one list on this page (pick a species, see it large with its grades) */}
            <Section variant="navy" spacing="sm" labelledBy="catalogue-species" className="!pt-0">
                <h2 id="catalogue-species" className="sr-only">
                    {t('grid.title')}
                </h2>
                <SpeciesStage
                    items={items}
                    rtl={localeConfig[locale as Locale]?.dir === 'rtl'}
                    pickLabel={t('grid.title')}
                    openLabel={tv('cta.view_specifications')}
                />

                {/* Owner, 13 Nov 2026: the 12 are the main species; others on request */}
                <p className={cn('m-0 mt-8 font-medium text-fg', typography.lead)}>{t('grid.more_species')}</p>
            </Section>
        </>
    );
}
