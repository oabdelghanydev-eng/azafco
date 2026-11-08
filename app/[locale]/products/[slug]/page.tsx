import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FaArrowLeft, FaBox, FaDna, FaCalendarCheck, FaHandshake, FaRulerHorizontal, FaThermometerHalf, FaWater } from 'react-icons/fa';
import { locales, ogLocaleMap, Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import { products, getProductBySlug, categoryLabelKey, Product } from '@/data/products';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

const baseUrl = companyConfig.contact.baseUrl;
const TITLE_MAX = 60; // full <title>, including the layout's " | AZAFCO" template
const DESCRIPTION_MAX = 155;
const RELATED_COUNT = 4;

// Only the slugs below are valid; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
    return locales.flatMap((locale) => products.map((product) => ({ locale, slug: product.slug })));
}

type Translator = {
    (key: string, values?: Record<string, string | number>): string;
    raw(key: string): unknown;
};

/** All species facts come from data/products.ts + data.products.<translationKey> translations. */
function getSpeciesData(t: Translator, product: Product) {
    const key = `data.products.${product.translationKey}`;
    return {
        name: t(`${key}.name`),
        description: t(`${key}.description`),
        altNames: (t.raw(`${key}.alt_names`) ?? []) as string[],
        sizes: (t.raw(`${key}.sizes`) ?? []) as string[],
        storageTemp: t(`${key}.storage_temp`),
        packaging: t(`${key}.packaging`),
        availability: t(`${key}.availability`),
        categoryLabel: t(categoryLabelKey(product.category)),
        imageAlt: ((t.raw('products_page.alt_template') ?? '{product}') as string).replace('{product}', t(`${key}.name`)),
    };
}

const pagePath = (slug: string) => `/products/${slug}`;

function fitTitle(t: Translator, name: string): string {
    const template = (t.raw('metadata.site.title_template') ?? '%s') as string;
    const fits = (title: string) => template.replace('%s', title).length <= TITLE_MAX;
    const long = t('species_page.meta_title', { name });
    if (fits(long)) return long;
    const short = t('species_page.meta_title_short', { name });
    return fits(short) ? short : name;
}

function fitDescription(t: Translator, species: ReturnType<typeof getSpeciesData>): string {
    const separator = (t.raw('species_page.list_separator') ?? ', ') as string;
    const values = {
        sizes: species.sizes.join(separator),
        packaging: species.packaging,
        temp: species.storageTemp,
        availability: species.availability,
    };
    // Longest variant that fits: description + sizes/packing, + packing only, description alone
    const candidates = [
        `${species.description} ${t('species_page.meta_description_suffix', values)}`,
        `${species.description} ${t('species_page.meta_description_suffix_short', values)}`,
        species.description,
    ];
    const fitting = candidates.find((c) => c.length <= DESCRIPTION_MAX);
    if (fitting) return fitting;
    const cut = species.description.slice(0, DESCRIPTION_MAX - 1);
    return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) return {};

    const t = await getTranslations({ locale });
    const species = getSpeciesData(t, product);
    const title = fitTitle(t, species.name);
    const description = fitDescription(t, species);
    const path = pagePath(slug);

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/${locale}${path}`,
            languages: {
                'ar': `${baseUrl}/ar${path}`,
                'en': `${baseUrl}/en${path}`,
                'es': `${baseUrl}/es${path}`,
                'ru': `${baseUrl}/ru${path}`,
                'de': `${baseUrl}/de${path}`,
                'fr': `${baseUrl}/fr${path}`,
                'x-default': `${baseUrl}${path}`,
            },
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}${path}`,
            type: 'website',
            siteName: t('metadata.site.name'),
            locale: ogLocaleMap[locale as Locale] || 'en_US',
            images: [{ url: product.image, alt: species.imageAlt }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [product.image],
        },
    };
}

function JsonLd({ schemas }: { schemas: object[] }) {
    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    // Escape "<" so translated text can never close the script tag
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
                />
            ))}
        </>
    );
}

export default async function SpeciesPage({ params }: Props) {
    const { locale, slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) notFound();

    setRequestLocale(locale);
    const t = await getTranslations({ locale });
    const species = getSpeciesData(t, product);
    const localeUrl = `${baseUrl}/${locale}`;
    const pageUrl = `${localeUrl}${pagePath(slug)}`;
    const imageUrl = `${baseUrl}${product.image}`;

    // Related: same category first, then the rest, in catalogue order
    const others = products.filter((p) => p.slug !== product.slug);
    const related = [
        ...others.filter((p) => p.category === product.category),
        ...others.filter((p) => p.category !== product.category),
    ].slice(0, RELATED_COUNT);

    // No offers / price / aggregateRating: AZAFCO publishes none.
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${pageUrl}#product`,
        name: species.name,
        description: species.description,
        image: imageUrl,
        url: pageUrl,
        category: t('schema.freshFishCategory'),
        ...(species.altNames.length > 0 && { alternateName: species.altNames }),
        // schema.org Product has no scientific-name property; PropertyValue is the standard extension point
        additionalProperty: [
            { '@type': 'PropertyValue', name: t('species_page.scientific_name'), value: product.scientificName },
            { '@type': 'PropertyValue', name: t('species_page.category'), value: species.categoryLabel },
        ],
        brand: { '@type': 'Brand', name: t('schema.alternateName') },
        manufacturer: { '@id': `${baseUrl}/#organization` },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('schema.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: t('schema.products'), item: `${localeUrl}/products` },
            { '@type': 'ListItem', position: 3, name: species.name, item: pageUrl },
        ],
    };

    const specs = [
        { icon: <FaDna />, label: t('species_page.scientific_name'), value: <i lang="la">{product.scientificName}</i> },
        { icon: <FaWater />, label: t('species_page.category'), value: species.categoryLabel },
        { icon: <FaThermometerHalf />, label: t('species_page.storage_temp'), value: species.storageTemp },
        { icon: <FaBox />, label: t('species_page.packaging'), value: species.packaging },
        { icon: <FaCalendarCheck />, label: t('species_page.availability'), value: species.availability },
    ];
    const orderingNotes = [t('data.products._note.custom_sizes'), t('data.products._note.min_order')];

    return (
        <>
            <JsonLd schemas={[productSchema, breadcrumbSchema]} />
            <Layout>
                {/* Hero */}
                <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-12 md:py-16">
                    <div className="container-custom">
                        <nav aria-label={t('species_page.breadcrumb_label')} className="mb-4 text-sm text-white/80">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li><Link href="/" className="hover:text-white underline-offset-2 hover:underline">{t('schema.home')}</Link></li>
                                <li aria-hidden="true">/</li>
                                <li><Link href="/products" className="hover:text-white underline-offset-2 hover:underline">{t('schema.products')}</Link></li>
                                <li aria-hidden="true">/</li>
                                <li aria-current="page" className="text-white">{species.name}</li>
                            </ol>
                        </nav>
                        <h1 className="text-3xl md:text-5xl font-bold mb-3">{species.name}</h1>
                        <p className="text-white/90 text-lg mb-2"><i lang="la">{product.scientificName}</i></p>
                        {species.altNames.length > 0 && (
                            <p className="text-white/80">
                                <span className="font-semibold">{t('species_page.also_known_as')}:</span>{' '}
                                {species.altNames.join(' • ')}
                            </p>
                        )}
                    </div>
                </section>

                {/* Image + specs */}
                <section className="py-12 md:py-16 bg-gray-50">
                    <div className="container-custom grid gap-8 lg:gap-12 md:grid-cols-2 items-start">
                        <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-xl shadow-lg bg-gray-200">
                            <Image
                                src={product.image}
                                alt={species.imageAlt}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 448px"
                                quality={80}
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <p className="text-lg text-gray-700 mb-8">{species.description}</p>

                            <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('species_page.specs_title')}</h2>
                            <dl className="grid gap-4 sm:grid-cols-2 mb-6">
                                {specs.map((spec) => (
                                    <div key={spec.label} className="bg-white rounded-lg shadow p-4">
                                        <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <span className="text-primary-500">{spec.icon}</span>
                                            {spec.label}
                                        </dt>
                                        <dd className="mt-1 font-semibold text-gray-800">{spec.value}</dd>
                                    </div>
                                ))}
                                <div className="bg-white rounded-lg shadow p-4 sm:col-span-2">
                                    <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <span className="text-primary-500"><FaRulerHorizontal /></span>
                                        {t('species_page.available_sizes')}
                                    </dt>
                                    <dd className="mt-2">
                                        <ul className="flex flex-wrap gap-2">
                                            {species.sizes.map((size) => (
                                                <li key={size} className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded">{size}</li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                            </dl>

                            <h2 className="text-xl font-bold text-primary-800 mb-2">{t('species_page.ordering_title')}</h2>
                            <ul className="list-disc ps-5 text-gray-700 space-y-1 mb-8">
                                {orderingNotes.map((note) => <li key={note}>{note}</li>)}
                            </ul>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">
                                    <FaHandshake />
                                    {t('species_page.cta_button')}
                                </Link>
                                <Link href="/products" className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:underline">
                                    <FaArrowLeft className="rtl:rotate-180" aria-hidden="true" />
                                    {t('species_page.back_to_products')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related species */}
                <section className="py-12 md:py-16 bg-white">
                    <div className="container-custom">
                        <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-8 text-center">{t('species_page.related_title')}</h2>
                        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {related.map((item) => {
                                const name = t(`data.products.${item.translationKey}.name`);
                                return (
                                    <li key={item.slug}>
                                        <Link href={pagePath(item.slug)} className="card group block">
                                            <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={((t.raw('products_page.alt_template') ?? '{product}') as string).replace('{product}', name)}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 300px"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="p-3 md:p-4 font-bold text-primary-800">{name}</h3>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-12 md:py-16 bg-primary-900 text-white">
                    <div className="container-custom text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('species_page.cta_title')}</h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">{t('species_page.cta_text')}</p>
                        <Link
                            href="/contact"
                            className="bg-secondary-500 text-white px-8 py-4 rounded-full font-bold hover:bg-secondary-600 transition-all duration-300 shadow-xl inline-flex items-center gap-3"
                        >
                            <FaHandshake className="text-xl" />
                            {t('species_page.cta_button')}
                        </Link>
                    </div>
                </section>
            </Layout>
        </>
    );
}
