import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '@/components/v2/icons';
import ContactRoutes from '@/components/v2/contact/ContactRoutes';
import { FOCUS_DARK, FOCUS_LIGHT, GArrow, GEyebrow, GPageHead, GSectionHead, gBody, gCard, gH3, gSectionY, gSmall, gWrap, phoneDisplay } from '@/components/v2/contact/g';
import { resolveRfqParams } from '@/components/v2/rfq/options';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { PageStructuredData } from '@/components/StructuredData';
import { companyConfig } from '@/config/company.config';
import { companyInfo } from '@/data/company';
import { cn } from '@/lib/v2/cn';
import { routes } from '@/lib/v2/routes';
import { Link } from '@/navigation';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Factory pin (old site's factory map; RELEASE-DECISIONS §4). Same as the G footer. */
const FACTORY_PIN = '31.433264,30.475957';

/** "lat,lng" read from a Google Maps embed URL (!2d<lng>!3d<lat>), so the office link follows data/company.ts */
function pinFromEmbed(url: string): string | undefined {
    const m = url.match(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/);
    return m ? `${Number(m[2]).toFixed(6)},${Number(m[1]).toFixed(6)}` : undefined;
}

const mapsSearch = (pin: string) => `https://www.google.com/maps/search/?api=1&query=${pin}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'contact_v2.meta' });
    return pageMetadata({ locale, path: routes.contact, title: t('title'), description: t('description') });
}

export default async function ContactPage({ params, searchParams }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const { product, country } = resolveRfqParams(await searchParams);
    const ar = locale === 'ar';

    const t = await getTranslations({ locale, namespace: 'contact_v2' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const c = companyConfig.contact;
    const steps = t.raw('next.steps') as string[];
    const proof = t.raw('trust.proof') as string[];
    const newTab = t('channels.new_tab');
    const phone = phoneDisplay(c.whatsappNumber);

    // Three channels, same roles as the G footer: WhatsApp = management (fast deals), email = export team.
    const channels = [
        { key: 'whatsapp', href: c.social.whatsapp, value: phone, icon: <WhatsAppIcon size={22} />, external: true },
        { key: 'email', href: `mailto:${c.email}`, value: c.email, icon: <MailIcon size={22} />, external: false },
        { key: 'phone', href: `tel:${c.phone}`, value: phone, icon: <PhoneIcon size={22} />, external: false },
    ] as const;

    const officeEmbed = companyInfo.addresses.main.mapEmbedUrl;
    const factoryEmbed = companyInfo.addresses.factory.mapEmbedUrl;
    const officePin = pinFromEmbed(officeEmbed);
    const locations = [
        { key: 'factory', title: t('locations.factory'), address: tc('addresses.factory.address'), embed: factoryEmbed, mapTitle: t('locations.map_title_factory'), link: mapsSearch(FACTORY_PIN) },
        { key: 'office', title: t('locations.office'), address: tc('addresses.main.address'), embed: officeEmbed, mapTitle: t('locations.map_title_office'), link: officePin ? mapsSearch(officePin) : undefined },
    ];

    return (
        <div className={cn('g-font bg-white text-[#0d1f3f]', gBody(ar))}>
            <PageStructuredData locale={locale} pageType="contact" />

            {/* 01 Opening */}
            <GPageHead ar={ar} crumbs={[{ label: t('breadcrumb') }]} eyebrow={t('hero.eyebrow')} title={t('hero.title')} titleId="contact-title" intro={t('hero.intro')} />

            {/* 02 Direct channels (roles as in the G footer) */}
            <section aria-labelledby="ct-channels" className={cn(gWrap, gSectionY)}>
                <GSectionHead ar={ar} id="ct-channels" eyebrow={t('channels.eyebrow')} title={t('channels.title')} />
                <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 lg:gap-5">
                    {channels.map((ch, i) => (
                        <li key={ch.key} className="min-w-0">
                            <a
                                href={ch.href}
                                data-cta={`contact_${ch.key}`}
                                {...(ch.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                className={cn(
                                    gCard(i === 0),
                                    'group flex h-full min-h-[44px] flex-col p-6 transition-colors hover:border-[#002d72] lg:p-8',
                                    FOCUS_LIGHT,
                                )}
                            >
                                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f2f5fa] text-[#002d72]">{ch.icon}</span>
                                <span className={cn(gH3(ar), 'mt-5 block text-[#0d1f3f]')}>{t(`channels.${ch.key}.title`)}</span>
                                <span className={cn('mb-5 mt-1 block text-[#4a5a75]', gSmall(ar))}>{t(`channels.${ch.key}.sub`)}</span>
                                <span className="mt-auto flex items-center justify-between gap-3 border-t border-[#d5dde9] pt-4">
                                    <span dir="ltr" className="min-w-0 text-[16px] font-bold text-[#002d72] [overflow-wrap:anywhere] lg:text-[17px]">
                                        {ch.value}
                                    </span>
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#d5dde9] text-[#002d72] transition-colors group-hover:border-[#f7b500] group-hover:bg-[#f7b500] group-hover:text-[#001b47]">
                                        <GArrow ar={ar} />
                                    </span>
                                </span>
                                {ch.external ? <span className="sr-only">{newTab}</span> : null}
                            </a>
                        </li>
                    ))}
                </ul>
                <p className={cn('mb-0 mt-6 text-[#4a5a75]', gSmall(ar))}>
                    <span className="font-bold text-[#0d1f3f]">{t('channels.hours')}: </span>
                    {tc('workingHours')}
                </p>
            </section>

            {/* 03 Enquiry routes → /rfq (prepared email / WhatsApp message; no web form) */}
            {/* id="partnership" keeps legacy /contact#partnership links (config.contact.partnershipForm) working */}
            <section id="partnership" aria-labelledby="contact-routes-title" className="scroll-mt-28 bg-[#f2f5fa]">
                <div className={cn(gWrap, gSectionY)}>
                    <ContactRoutes prefillSpecies={product} prefillCountry={country} />
                </div>
            </section>

            {/* 04 Locations with map embeds (addresses + embeds from data/company.ts) */}
            <section aria-labelledby="ct-locations" className={cn(gWrap, gSectionY)}>
                <GSectionHead ar={ar} id="ct-locations" eyebrow={t('locations.eyebrow')} title={t('locations.title')} />
                <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:gap-8">
                    {locations.map((l) => (
                        <li key={l.key} className={cn(gCard(), 'flex min-w-0 flex-col overflow-hidden')}>
                            <div className="relative aspect-[4/3] w-full bg-[#f2f5fa] sm:aspect-[16/10]">
                                <iframe
                                    src={l.embed}
                                    title={l.mapTitle}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    allowFullScreen
                                    className="absolute inset-0 h-full w-full border-0"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-6 lg:p-8">
                                <h3 className={cn(gH3(ar), 'flex items-center gap-2.5 text-[#0d1f3f]')}>
                                    <MapPinIcon size={20} className="shrink-0 text-[#002d72]" />
                                    {l.title}
                                </h3>
                                <p className="mb-0 mt-2 flex-1 text-[#4a5a75]">{l.address}</p>
                                {l.link ? (
                                    <a
                                        href={l.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-cta={`contact_map_${l.key}`}
                                        className={cn(
                                            'mt-4 inline-flex min-h-[44px] items-center gap-2.5 self-start text-[#002d72] underline-offset-4 hover:underline',
                                            ar ? 'font-bold' : 'font-extrabold',
                                            FOCUS_LIGHT,
                                        )}
                                    >
                                        {t('locations.map_open')}
                                        <GArrow ar={ar} />
                                        <span className="sr-only">{newTab}</span>
                                    </a>
                                ) : null}
                            </div>
                        </li>
                    ))}
                </ul>
                <p className={cn('mb-0 mt-4 text-[#4a5a75]', gSmall(ar))}>{t('locations.map_note')}</p>
            </section>

            {/* 05 After you write (no-obligation note), privacy note, registration + proof, official channels (anti-fraud) */}
            <section aria-labelledby="ct-next" className="bg-[#002d72] text-white" data-surface="dark">
                <div className={cn(gWrap, 'py-16 lg:py-24')}>
                    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-20">
                        <div className="min-w-0">
                            <h2
                                id="ct-next"
                                className={cn(
                                    'm-0 text-white',
                                    ar ? 'text-[26px] font-bold leading-[1.45] lg:text-[34px]' : 'text-[27px] font-extrabold leading-[1.2] tracking-[-0.02em] lg:text-[36px]',
                                )}
                            >
                                {t('next.title')}
                            </h2>
                            <ol className="m-0 mt-8 grid list-none gap-6 p-0 md:grid-cols-3 md:gap-5">
                                {steps.map((s, i) => (
                                    <li key={s} className="border-t-2 border-[#f7b500] pt-4">
                                        <span aria-hidden="true" className="block text-[14px] font-bold text-[#f7b500]">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <p className={cn('mb-0 mt-2 text-white/[.86]', gSmall(ar))}>{s}</p>
                                    </li>
                                ))}
                            </ol>
                            <p className={cn('mb-0 mt-8 max-w-[640px] border-s-2 border-[#f7b500] ps-4 text-white/[.86]', gSmall(ar))}>{t('next.no_promise')}</p>
                        </div>
                        <div className="flex min-w-0 flex-col gap-8">
                            <div>
                                <GEyebrow ar={ar} dark as="h2">
                                    {t('privacy.title')}
                                </GEyebrow>
                                <p className={cn('mb-0 mt-3 text-white/[.82]', gSmall(ar))}>{t('privacy.text')}</p>
                                <Link
                                    href={routes.privacy}
                                    className={cn(
                                        'mt-2 inline-flex min-h-[44px] items-center text-white underline decoration-[#f7b500] decoration-2 underline-offset-4 hover:text-[#f7b500]',
                                        ar ? 'font-bold' : 'font-extrabold',
                                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500]',
                                    )}
                                >
                                    {t('privacy.link')}
                                </Link>
                            </div>
                            <div className="border-t border-white/[.16] pt-6">
                                <GEyebrow ar={ar} dark as="h2">
                                    {t('trust.title')}
                                </GEyebrow>
                                <dl className={cn('m-0 mt-3 grid gap-1 text-white/[.82]', gSmall(ar))}>
                                    <div>
                                        <dt className="inline">{t('trust.register')}: </dt>
                                        <dd className="m-0 inline">
                                            <bdi dir="ltr" className="font-bold text-white">
                                                {companyConfig.registration.commercialRegister}
                                            </bdi>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="inline">{t('trust.tax')}: </dt>
                                        <dd className="m-0 inline">
                                            <bdi dir="ltr" className="font-bold text-white">
                                                {companyConfig.registration.taxCard}
                                            </bdi>
                                        </dd>
                                    </div>
                                </dl>
                                <h3 className={cn('mb-0 mt-6 font-bold text-white', gSmall(ar))}>{t('trust.proof_title')}</h3>
                                <ul className="m-0 mt-2 list-none space-y-2 p-0">
                                    {proof.map((item) => (
                                        <li key={item} className={cn('flex gap-3 text-white/[.86]', gSmall(ar))}>
                                            <span aria-hidden="true" className="mt-[0.8em] h-0.5 w-4 shrink-0 bg-[#f7b500]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={routes.quality}
                                    className={cn(
                                        'mt-2 inline-flex min-h-[44px] items-center gap-2.5 text-white underline decoration-[#f7b500] decoration-2 underline-offset-4 hover:text-[#f7b500]',
                                        ar ? 'font-bold' : 'font-extrabold',
                                        FOCUS_DARK,
                                    )}
                                >
                                    {t('trust.proof_link')}
                                    <GArrow ar={ar} />
                                </Link>
                            </div>
                            {/* Anti-fraud notice (approved copy in data.company.officialChannels) */}
                            <div className="rounded border-t-4 border-t-[#f7b500] bg-white/[.06] p-5 lg:p-6">
                                <GEyebrow ar={ar} dark as="h2">
                                    {tc('officialChannels.title')}
                                </GEyebrow>
                                <p className={cn('mb-0 mt-3 text-white/[.86]', gSmall(ar))}>{tc('officialChannels.text', { phone, email: c.email })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
