import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, Container, Eyebrow, GeoArcs, MailIcon, MapPinIcon, Pending, PhoneIcon, WhatsAppIcon } from '@/components/v2';
import ContactRoutes from '@/components/v2/contact/ContactRoutes';
import { resolveRfqParams } from '@/components/v2/rfq/options';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { PageStructuredData } from '@/components/StructuredData';
import { companyConfig } from '@/config/company.config';
import { routes } from '@/lib/v2/routes';
import { Link } from '@/navigation';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'contact_v2.meta' });
    return pageMetadata({ locale, path: routes.contact, title: t('title'), description: t('description') });
}

export default async function ContactPage({ params, searchParams }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const { product, country } = resolveRfqParams(await searchParams);

    const t = await getTranslations({ locale, namespace: 'contact_v2' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const c = companyConfig.contact;
    const steps = t.raw('next.steps') as string[];
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${companyConfig.geo.latitude},${companyConfig.geo.longitude}`;

    return (
        <>
            <PageStructuredData locale={locale} pageType="contact" />

            {/* 01 Intro */}
            <section data-surface="light" aria-labelledby="contact-title" className="relative overflow-hidden bg-surface-offwhite pb-10 pt-8 text-fg md:pb-14 md:pt-12">
                <GeoArcs className="absolute -end-48 -top-48 hidden w-[560px] opacity-60 lg:block" />
                <Container>
                    <Breadcrumbs items={[{ label: t('breadcrumb') }]} />
                    <Eyebrow className="mt-8">{t('hero.eyebrow')}</Eyebrow>
                    <h1 id="contact-title" className="v2-heading mt-4 max-w-4xl font-display text-display-lg">
                        {t('hero.title')}
                    </h1>
                    <p className="mt-4 max-w-prose-v2 text-body-lg text-fg-muted">{t('hero.intro')}</p>
                </Container>
            </section>

            <section data-surface="light" className="bg-white py-10 text-ink md:py-16">
                <Container grid className="gap-y-12">
                    {/* 02–03 Enquiry routes (no form: each opens the matching /rfq email / WhatsApp page) */}
                    {/* id="partnership" keeps legacy /contact#partnership links (config.contact.partnershipForm) working */}
                    <div id="partnership" className="col-span-4 scroll-mt-28 sm:col-span-8 lg:col-span-8">
                        <ContactRoutes prefillSpecies={product} prefillCountry={country} />

                        {/* What happens after the enquiry: 01-02-03 timeline in the main column */}
                        <section aria-labelledby="ct-next" className="mt-14 border-t border-line pt-10">
                            <h2 id="ct-next" className="font-display text-heading-md text-navy">
                                {t('next.title')}
                            </h2>
                            <ol className="mt-6 grid gap-8 md:grid-cols-3 md:gap-6">
                                {steps.map((s, i) => (
                                    <li key={s} className="relative ps-14 md:ps-0">
                                        {i < steps.length - 1 ? (
                                            <span
                                                aria-hidden="true"
                                                className="absolute start-5 top-12 -bottom-6 w-px bg-line md:-end-4 md:bottom-auto md:start-14 md:top-5 md:h-px md:w-auto"
                                            />
                                        ) : null}
                                        <span
                                            aria-hidden="true"
                                            className="absolute start-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-body-sm font-semibold tabular-nums text-navy md:relative md:mb-4"
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <p className="pt-2 text-body-sm text-ink-muted md:pt-0">
                                            <span className="sr-only">{String(i + 1).padStart(2, '0')}. </span>
                                            {s}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                            <Pending label={t('pending.response_sla')} className="mt-4" />
                        </section>

                        {/* Registered company + privacy note, side by side */}
                        <div className="mt-12 grid gap-6 md:grid-cols-2">
                            <section aria-labelledby="ct-trust" className="rounded-card bg-surface-offwhite p-6">
                                <h2 id="ct-trust" className="font-display text-heading-sm text-navy">
                                    {t('trust.title')}
                                </h2>
                                <dl className="mt-2 grid grid-cols-1 gap-2 text-body-sm">
                                    <div>
                                        <dt className="text-caption text-ink-muted">{t('trust.legal_name')}</dt>
                                        <dd dir="ltr" className="text-start font-medium text-ink rtl:text-right">
                                            {companyConfig.identity.legalName}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-caption text-ink-muted">{t('trust.register')}</dt>
                                        <dd dir="ltr" className="font-medium text-ink rtl:text-right">
                                            {companyConfig.registration.commercialRegister}
                                        </dd>
                                    </div>
                                </dl>
                            </section>
                            <section aria-labelledby="ct-privacy" className="rounded-card border border-line p-6">
                                <h2 id="ct-privacy" className="font-display text-heading-sm text-navy">
                                    {t('privacy.title')}
                                </h2>
                                <p className="mt-2 text-body-sm text-ink-muted">{t('privacy.text')}</p>
                                <Link href={routes.privacy} className="mt-1 inline-flex min-h-[44px] items-center text-body-sm font-semibold text-navy underline underline-offset-4">
                                    {t('privacy.link')}
                                </Link>
                            </section>
                        </div>
                    </div>

                    {/* 04–08 Direct channels, locations, next step, privacy, trust */}
                    <aside className="col-span-4 flex flex-col gap-8 sm:col-span-8 lg:col-span-4" aria-label={t('channels.title')}>
                        <section aria-labelledby="ct-channels" className="rounded-card border border-line bg-surface-offwhite p-6">
                            <h2 id="ct-channels" className="font-display text-heading-md text-navy">
                                {t('channels.title')}
                            </h2>
                            <p className="mt-1 text-body-sm text-ink-muted">{t('channels.intro')}</p>
                            <ul className="mt-4 flex flex-col gap-1">
                                <li>
                                    <a href={`tel:${c.phone}`} className="flex min-h-[48px] items-center gap-3 hover:underline" data-cta="contact_phone">
                                        <PhoneIcon className="shrink-0 text-navy" />
                                        <span>
                                            <span className="block text-caption text-ink-muted">{t('channels.phone')}</span>
                                            <span dir="ltr" className="font-semibold text-navy">
                                                {c.phoneDisplay}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href={c.social.whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-center gap-3 hover:underline" data-cta="contact_whatsapp">
                                        <WhatsAppIcon className="shrink-0 text-navy" />
                                        <span>
                                            <span className="block text-caption text-ink-muted">{t('channels.whatsapp')}</span>
                                            <span className="font-semibold text-navy">{t('channels.whatsapp_action')}</span>
                                            <span className="sr-only"> {tv('cta.opens_new_tab')}</span>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:${c.email}`} className="flex min-h-[48px] items-center gap-3 hover:underline" data-cta="contact_email">
                                        <MailIcon className="shrink-0 text-navy" />
                                        <span>
                                            <span className="block text-caption text-ink-muted">{t('channels.email')}</span>
                                            <span dir="ltr" className="font-semibold text-navy">
                                                {c.email}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                            <p className="mt-4 border-t border-line pt-4 text-body-sm text-ink-muted">
                                <span className="block font-semibold text-ink">{t('channels.hours')}</span>
                                {tc('workingHours')}
                            </p>
                            <Pending block label={t('pending.contact_details')} className="mt-4" />
                        </section>

                        <section aria-labelledby="ct-locations">
                            <h2 id="ct-locations" className="font-display text-heading-sm text-navy">
                                {t('locations.title')}
                            </h2>
                            <ul className="mt-3 flex flex-col gap-4 text-body-sm text-ink-muted">
                                <li className="flex gap-3">
                                    <MapPinIcon size={18} className="mt-1 shrink-0 text-navy" />
                                    <span>
                                        <span className="block font-semibold text-ink">{t('locations.factory')}</span>
                                        {tc('addresses.factory.address')}
                                        <a
                                            href={mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 flex min-h-[44px] items-center font-semibold text-navy underline underline-offset-4"
                                        >
                                            {t('locations.map')}
                                            <span className="sr-only"> {tv('cta.opens_new_tab')}</span>
                                        </a>
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <MapPinIcon size={18} className="mt-1 shrink-0 text-navy" />
                                    <span>
                                        <span className="block font-semibold text-ink">{t('locations.office')}</span>
                                        {tc('addresses.main.address')}
                                    </span>
                                </li>
                            </ul>
                        </section>

                    </aside>
                </Container>
            </section>
        </>
    );
}
