import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, Container, Eyebrow, GeoArcs } from '@/components/v2';
import RfqForm from '@/components/v2/rfq/RfqForm';
import RfqAside from '@/components/v2/rfq/RfqAside';
import { getRfqFormOptions, resolveRfqParams } from '@/components/v2/rfq/options';
import { variantForTopic } from '@/components/v2/rfq/schema';
import { pageMetadata, breadcrumbJsonLd } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { Link } from '@/navigation';
import { rfqHref, routes } from '@/lib/v2/routes';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'rfq_v2.meta' });
    // Canonical is always the bare /rfq (prefilled ?product= / ?country= URLs fold into it)
    return pageMetadata({ locale, path: routes.rfq, title: t('title'), description: t('description') });
}

export default async function RfqPage({ params, searchParams }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const { topic, product, country } = resolveRfqParams(await searchParams);
    const short = variantForTopic(topic) === 'short';

    const t = await getTranslations({ locale, namespace: 'rfq_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const { speciesOptions, countries } = await getRfqFormOptions(locale);

    const title = short ? t(`short_hero.${topic}_title`) : t('hero.title');
    const intro = short ? t(`short_hero.${topic}_intro`) : t('hero.intro');

    return (
        <>
            <JsonLd data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [{ name: t('breadcrumb'), path: routes.rfq }])} />

            <section data-surface="light" aria-labelledby="rfq-title" className="relative overflow-hidden bg-surface-offwhite pb-10 pt-8 text-fg md:pb-14 md:pt-12">
                <GeoArcs className="absolute -end-48 -top-48 hidden w-[560px] opacity-60 lg:block" />
                <Container>
                    <Breadcrumbs items={[{ label: t('breadcrumb') }]} />
                    <Eyebrow className="mt-8">{t('hero.eyebrow')}</Eyebrow>
                    <h1 id="rfq-title" className="v2-heading mt-4 max-w-4xl font-display text-display-lg">
                        {title}
                    </h1>
                    <p className="mt-4 max-w-prose-v2 text-body-lg text-fg-muted">{intro}</p>
                    <p className="mt-4 text-body-sm text-fg-muted">
                        {t.rich(short ? 'switch.to_seafood' : 'switch.to_corporate', {
                            link: (chunks) => (
                                <Link
                                    href={short ? rfqHref() : rfqHref({ type: 'corporate' })}
                                    className="inline-flex min-h-[44px] items-center font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4"
                                >
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </p>
                </Container>
            </section>

            <section className="bg-white py-10 text-fg md:py-16" data-surface="light">
                <Container grid className="gap-y-12">
                    <div className="col-span-4 sm:col-span-8 lg:order-2 lg:col-span-8">
                        <RfqForm topic={topic} prefillSpecies={product} prefillCountry={country} speciesOptions={speciesOptions} countries={countries} />
                    </div>
                    <RfqAside short={short} className="col-span-4 sm:col-span-8 lg:order-1 lg:col-span-4" />
                </Container>
            </section>
        </>
    );
}
