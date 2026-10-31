import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FaArrowRight, FaCheckCircle, FaHandshake } from 'react-icons/fa';
import { dateLocaleMap, ogLocaleMap, ogImageMap, locales, Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import { products } from '@/data/products';
import {
    getGuideBySlug,
    importingDocuments,
    importingSources,
    importingTariffRows,
} from '@/data/guides';

type Props = {
    params: Promise<{ locale: string }>;
};

const baseUrl = companyConfig.contact.baseUrl;
const SLUG = 'importing-fresh-fish-from-egypt';
const path = `/guides/${SLUG}`;
const guide = getGuideBySlug(SLUG)!;
const ns = `guides_page.${guide.translationKey}`;

const COLD_ITEMS = ['temperature', 'ice', 'boxes', 'handovers', 'arrival'] as const;
// Sources cited in the cold-chain and HS sections (documents cite their own)
const HS_SOURCES = ['wco_hs', 'taric'];
const COLD_SOURCES = ['reg_853_2004'];

const formatDate = (locale: string, iso: string) =>
    new Intl.DateTimeFormat(dateLocaleMap[locale as Locale] ?? 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${iso}T00:00:00Z`));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const title = t(`${ns}.meta_title`);
    const description = t(`${ns}.meta_description`);

    const languages: Record<string, string> = {};
    for (const l of locales) languages[l] = `${baseUrl}/${l}${path}`;
    languages['x-default'] = `${baseUrl}${path}`;

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/${locale}${path}`,
            languages,
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}${path}`,
            type: 'article',
            publishedTime: guide.datePublished,
            modifiedTime: guide.lastReviewed,
            siteName: t('metadata.site.name'),
            locale: ogLocaleMap[locale as Locale] || 'en_US',
            images: [{
                url: ogImageMap[locale as Locale],
                width: 1200,
                height: 630,
                alt: title,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageMap[locale as Locale]],
        },
    };
}

/** Numbered source references, e.g. [3][4], linking to the list at the bottom. */
function SourceRefs({ ids, label }: { ids: string[]; label: string }) {
    if (ids.length === 0) return null;
    return (
        <span className="text-sm text-gray-500 ms-1" aria-label={label}>
            {ids.map((id) => {
                const n = importingSources.findIndex((s) => s.id === id) + 1;
                return (
                    <a key={id} href={`#source-${id}`} className="text-primary-600 hover:underline">
                        [{n}]
                    </a>
                );
            })}
        </span>
    );
}

export default async function ImportingGuidePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale });

    const localeUrl = `${baseUrl}/${locale}`;
    const pageUrl = `${localeUrl}${path}`;
    const reviewed = formatDate(locale, guide.lastReviewed);
    const sourceLabel = t(`${ns}.source_label`);
    const productSlug = (key: string) => products.find((p) => p.translationKey === key)?.slug;

    const sections = [
        { id: 'hs-codes', title: t(`${ns}.hs.title`) },
        { id: 'documents', title: t(`${ns}.docs.title`) },
        { id: 'cold-chain', title: t(`${ns}.cold.title`) },
        { id: 'enquiry', title: t(`${ns}.enquiry.title`) },
        { id: 'sources', title: t(`${ns}.sources.title`) },
    ];

    const organization = {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: companyConfig.identity.tradeName,
        url: baseUrl,
        logo: { '@type': 'ImageObject', url: `${baseUrl}/images/logo.svg` },
    };
    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': `${pageUrl}#article`,
            headline: t(`${ns}.h1`),
            description: t(`${ns}.meta_description`),
            inLanguage: locale,
            url: pageUrl,
            mainEntityOfPage: pageUrl,
            image: `${baseUrl}${ogImageMap[locale as Locale]}`,
            datePublished: guide.datePublished,
            dateModified: guide.lastReviewed,
            author: organization,
            publisher: organization,
            citation: importingSources.map((s) => s.url),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: t('schema.home'), item: localeUrl },
                { '@type': 'ListItem', position: 2, name: t('guides_page.index.breadcrumb'), item: `${localeUrl}/guides` },
                { '@type': 'ListItem', position: 3, name: t(`${ns}.breadcrumb`), item: pageUrl },
            ],
        },
    ];

    const checklist = (t.raw(`${ns}.enquiry.checklist`) ?? []) as string[];

    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
                />
            ))}
            <Layout>
                {/* Hero */}
                <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-12 md:py-16">
                    <div className="container-custom max-w-4xl">
                        <nav aria-label={t('species_page.breadcrumb_label')} className="mb-4 text-sm text-white/80">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li><Link href="/" className="hover:text-white hover:underline">{t('schema.home')}</Link></li>
                                <li aria-hidden="true">/</li>
                                <li><Link href="/guides" className="hover:text-white hover:underline">{t('guides_page.index.breadcrumb')}</Link></li>
                                <li aria-hidden="true">/</li>
                                <li aria-current="page" className="text-white">{t(`${ns}.breadcrumb`)}</li>
                            </ol>
                        </nav>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">{t(`${ns}.h1`)}</h1>
                        <p className="text-white/80 text-sm">
                            <time dateTime={guide.lastReviewed}>{t(`${ns}.last_reviewed`, { date: reviewed })}</time>
                        </p>
                    </div>
                </section>

                <article className="py-12 md:py-16">
                    <div className="container-custom max-w-4xl">
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">{t(`${ns}.intro`)}</p>
                        <p className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-10">
                            {t(`${ns}.disclaimer`)}
                        </p>

                        {/* Table of contents */}
                        <nav aria-labelledby="toc-title" className="bg-gray-50 rounded-xl p-6 mb-12">
                            <h2 id="toc-title" className="text-lg font-bold text-primary-800 mb-3">{t(`${ns}.toc_title`)}</h2>
                            <ol className="list-decimal ps-5 space-y-1 text-primary-700">
                                {sections.map((s) => (
                                    <li key={s.id}><a href={`#${s.id}`} className="hover:underline">{s.title}</a></li>
                                ))}
                            </ol>
                        </nav>

                        {/* HS codes */}
                        <section id="hs-codes" className="mb-14 scroll-mt-28">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">{t(`${ns}.hs.title`)}</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                {t(`${ns}.hs.intro_1`)}
                                <SourceRefs ids={HS_SOURCES} label={sourceLabel} />
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-6">{t(`${ns}.hs.intro_2`)}</p>

                            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
                                <table className="min-w-full text-sm">
                                    <caption className="text-start p-3 font-semibold text-gray-800 bg-gray-50">
                                        {t(`${ns}.hs.table_caption`)}
                                    </caption>
                                    <thead className="bg-primary-50 text-primary-900">
                                        <tr>
                                            <th scope="col" className="p-3 text-start">{t(`${ns}.hs.col_species`)}</th>
                                            <th scope="col" className="p-3 text-start">{t(`${ns}.hs.col_scientific`)}</th>
                                            <th scope="col" className="p-3 text-start whitespace-nowrap">{t(`${ns}.hs.col_hs`)}</th>
                                            <th scope="col" className="p-3 text-start whitespace-nowrap">{t(`${ns}.hs.col_cn`)}</th>
                                            <th scope="col" className="p-3 text-start">{t(`${ns}.hs.col_notes`)}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {importingTariffRows.map((row) => {
                                            const slug = productSlug(row.productKey);
                                            const name = t(`${ns}.hs.species.${row.productKey}`);
                                            return (
                                                <tr key={row.productKey} className="align-top">
                                                    <th scope="row" className="p-3 text-start font-semibold text-gray-900">
                                                        {slug ? (
                                                            <Link href={`/products/${slug}`} className="text-primary-700 hover:underline">{name}</Link>
                                                        ) : name}
                                                    </th>
                                                    <td className="p-3 italic text-gray-700" lang="la">{row.scientificName}</td>
                                                    <td className="p-3 font-mono whitespace-nowrap" dir="ltr">{row.hs}</td>
                                                    <td className="p-3 font-mono whitespace-nowrap" dir="ltr">{row.cn}</td>
                                                    <td className="p-3 text-gray-600">
                                                        {row.note ? t(`${ns}.hs.notes.${row.note}`) : '—'}
                                                        {row.note === 'eel' && <SourceRefs ids={['cites_eel']} label={sourceLabel} />}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{t(`${ns}.hs.after`, { date: reviewed })}</p>
                        </section>

                        {/* Documents */}
                        <section id="documents" className="mb-14 scroll-mt-28">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">{t(`${ns}.docs.title`)}</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">{t(`${ns}.docs.intro`)}</p>
                            <ol className="space-y-4">
                                {importingDocuments.map((doc, index) => (
                                    <li key={doc.id} className="bg-white rounded-xl border border-gray-200 p-5">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            <span className="text-primary-600 me-2">{index + 1}.</span>
                                            {t(`${ns}.docs.items.${doc.id}.title`)}
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {t(`${ns}.docs.items.${doc.id}.text`)}
                                            <SourceRefs ids={doc.sources} label={sourceLabel} />
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        {/* Cold chain */}
                        <section id="cold-chain" className="mb-14 scroll-mt-28">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">{t(`${ns}.cold.title`)}</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                {t(`${ns}.cold.intro`)}
                                <SourceRefs ids={COLD_SOURCES} label={sourceLabel} />
                            </p>
                            <dl className="grid gap-4 sm:grid-cols-2 mb-6">
                                {COLD_ITEMS.map((id) => (
                                    <div key={id} className="bg-gray-50 rounded-xl p-5">
                                        <dt className="font-bold text-gray-900 mb-1">{t(`${ns}.cold.items.${id}.title`)}</dt>
                                        <dd className="text-gray-700 leading-relaxed">{t(`${ns}.cold.items.${id}.text`)}</dd>
                                    </div>
                                ))}
                            </dl>
                            <p className="text-gray-800 font-medium bg-primary-50 rounded-lg p-4">{t(`${ns}.cold.azafco`)}</p>
                        </section>

                        {/* Enquiry */}
                        <section id="enquiry" className="mb-14 scroll-mt-28">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">{t(`${ns}.enquiry.title`)}</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">{t(`${ns}.enquiry.intro`)}</p>
                            <ul className="space-y-2 mb-8">
                                {checklist.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-gray-700">
                                        <FaCheckCircle className="text-secondary-500 mt-1 shrink-0" aria-hidden="true" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <Link href="/contact" className="btn-secondary inline-flex items-center justify-center gap-2">
                                    <FaHandshake aria-hidden="true" />
                                    {t(`${ns}.enquiry.cta_contact`)}
                                </Link>
                                <Link href="/eu-buyers" className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-700 px-6 py-3 rounded-full font-bold hover:bg-primary-50 transition-colors">
                                    {t(`${ns}.enquiry.cta_eu`)}
                                    <FaArrowRight className="rtl:rotate-180" aria-hidden="true" />
                                </Link>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{t(`${ns}.enquiry.species_title`)}</h3>
                            <p className="text-gray-600 mb-4">{t(`${ns}.enquiry.species_text`)}</p>
                            <ul className="flex flex-wrap gap-2">
                                {importingTariffRows.map((row) => {
                                    const slug = productSlug(row.productKey);
                                    if (!slug) return null;
                                    return (
                                        <li key={row.productKey}>
                                            <Link href={`/products/${slug}`} className="inline-block bg-gray-100 hover:bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                                                {t(`${ns}.hs.species.${row.productKey}`)}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>

                        {/* Sources */}
                        <section id="sources" className="scroll-mt-28">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">{t(`${ns}.sources.title`)}</h2>
                            <p className="text-gray-700 mb-4">{t(`${ns}.sources.intro`, { date: reviewed })}</p>
                            <ol className="list-decimal ps-5 space-y-2 text-sm text-gray-700" dir="ltr">
                                {importingSources.map((source) => (
                                    <li key={source.id} id={`source-${source.id}`} className="scroll-mt-28">
                                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline">
                                            {source.title}
                                        </a>
                                        {' '}<span className="text-gray-500">({source.publisher})</span>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </div>
                </article>
            </Layout>
        </>
    );
}
