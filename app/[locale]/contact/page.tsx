import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LuClock, LuDownload } from 'react-icons/lu';
import {
    ArrowIcon,
    Button,
    Card,
    CheckIcon,
    ContactRow,
    ExternalLink,
    Icon,
    MailIcon,
    MapPinIcon,
    PageHead,
    PhoneIcon,
    Section,
    SectionHeading,
    WhatsAppIcon,
    buttonClass,
    cn,
    focusRing,
    phoneDisplay,
    typography,
} from '@/components/ui';
import ContactRoutes from '@/components/v2/contact/ContactRoutes';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { PageStructuredData } from '@/components/StructuredData';
import { companyConfig } from '@/config/company.config';
import { companyInfo } from '@/data/company';
import { routes } from '@/lib/v2/routes';
import { whatsappLink } from '@/lib/v2/whatsapp';
import { Link } from '@/navigation';

// No searchParams here: the page is statically rendered (metadata in <head>).
// ?product= / ?country= are carried into the enquiry routes in the browser (ContactRoutes).
type Props = {
    params: Promise<{ locale: string }>;
};

/** Factory pin (old site's factory map; RELEASE-DECISIONS §4). Same as the G footer. */
const FACTORY_PIN = '31.433264,30.475957';

/** Contact card from the live site (public/azafco-contact.vcf): management number + export team email. */
const VCARD_PATH = '/azafco-contact.vcf';

/** "lat,lng" read from a Google Maps embed URL (!2d<lng>!3d<lat>), so the office link follows data/company.ts */
function pinFromEmbed(url: string): string | undefined {
    const m = url.match(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/);
    return m ? `${Number(m[2]).toFixed(6)},${Number(m[1]).toFixed(6)}` : undefined;
}

const mapsSearch = (pin: string) => `https://www.google.com/maps/search/?api=1&query=${pin}`;

/** Inline link on a light card (privacy, quality): navy, gold underline, 44px target. */
const cardLink = cn(
    'group inline-flex min-h-tap items-center gap-2 font-semibold text-link underline decoration-gold decoration-2 underline-offset-[6px] transition-colors hover:text-link-hover',
    focusRing,
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'contact_v2.meta' });
    return pageMetadata({ locale, path: routes.contact, title: t('title'), description: t('description') });
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'contact_v2' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const c = companyConfig.contact;
    const steps = t.raw('next.steps') as string[];
    const proof = t.raw('trust.proof') as string[];
    const newTab = t('channels.new_tab');
    const phone = phoneDisplay(c.whatsappNumber);
    const mailto = `mailto:${c.email}`;
    // Management WhatsApp with the standard prefilled opening (ledger C12)
    const waHref = whatsappLink((await getTranslations({ locale, namespace: 'g_header_v2' }))('whatsapp_message'));

    // Same roles as the G footer: WhatsApp = management direct (fast deals), email = export team.
    const channels = [
        { key: 'whatsapp', href: waHref, value: phone, icon: <WhatsAppIcon size={24} /> },
        { key: 'email', href: mailto, value: c.email, icon: <MailIcon size={24} /> },
        { key: 'phone', href: `tel:${c.phone}`, value: phone, icon: <PhoneIcon size={24} /> },
    ] as const;

    // Addresses + embeds from data/company.ts (as on the live contact page): main office first, then the plant.
    const officeEmbed = companyInfo.addresses.main.mapEmbedUrl;
    const officePin = pinFromEmbed(officeEmbed);
    const locations = [
        {
            key: 'office',
            title: t('locations.office'),
            address: tc('addresses.main.address'),
            embed: officeEmbed,
            mapTitle: t('locations.map_title_office'),
            link: officePin ? mapsSearch(officePin) : undefined,
        },
        {
            key: 'factory',
            title: t('locations.factory'),
            address: tc('addresses.factory.address'),
            embed: companyInfo.addresses.factory.mapEmbedUrl,
            mapTitle: t('locations.map_title_factory'),
            link: mapsSearch(FACTORY_PIN),
        },
    ];

    return (
        <div className={typography.body}>
            <PageStructuredData locale={locale} pageType="contact" />

            {/* 01 Opening: one gold action (WhatsApp, management) + email to the export team */}
            <PageHead crumbs={[{ label: t('breadcrumb') }]} eyebrow={t('hero.eyebrow')} title={t('hero.title')} titleId="contact-title" intro={t('hero.intro')}>
                <div className="mt-8 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                    <Button
                        href={waHref}
                        size="lg"
                        stretch="phone"
                        icon={<WhatsAppIcon size={20} />}
                        newTabLabel={newTab}
                        dataAttrs={{ 'data-cta': 'contact_hero_whatsapp' }}
                    >
                        {t('hero.actions.whatsapp')}
                    </Button>
                    <Button href={mailto} variant="outline" size="lg" stretch="phone" icon={<MailIcon size={20} />} dataAttrs={{ 'data-cta': 'contact_hero_email' }}>
                        {t('hero.actions.email')}
                    </Button>
                </div>
            </PageHead>

            {/* 02 Direct channels: rows as in the G footer, office hours, vCard */}
            <Section variant="white" labelledBy="ct-channels">
                <SectionHeading id="ct-channels" layout="split" eyebrow={t('channels.eyebrow')} title={t('channels.title')} intro={t('channels.intro')} />
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                    <ul className="m-0 min-w-0 list-none border-0 border-t border-solid border-rule p-0 lg:col-span-7">
                        {channels.map((ch) => (
                            <li key={ch.key}>
                                <ContactRow
                                    href={ch.href}
                                    external
                                    newTabLabel={newTab}
                                    icon={ch.icon}
                                    title={t(`channels.${ch.key}.title`)}
                                    sub={t(`channels.${ch.key}.sub`)}
                                    value={ch.value}
                                    valueDir="ltr"
                                    dataAttrs={{ 'data-cta': `contact_${ch.key}` }}
                                />
                            </li>
                        ))}
                    </ul>
                    <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                        <div className="flex gap-3.5 rounded-card bg-surface-offwhite p-5 lg:p-6">
                            <Icon icon={LuClock} size={24} className="mt-0.5 text-navy" />
                            <div className="min-w-0">
                                <h3 className={cn('m-0 text-ink', typography.h4)}>{t('channels.hours')}</h3>
                                <p className="mb-0 mt-1 text-ink">{tc('workingHours')}</p>
                                <p className={cn('mb-0 mt-1 text-ink-muted', typography.small)}>{tc('workingHoursNote')}</p>
                            </div>
                        </div>
                        <Card padding="sm" className="flex flex-col lg:p-6">
                            <h3 className={cn('m-0 text-ink', typography.h4)}>{t('channels.vcard.title')}</h3>
                            <p className={cn('mb-0 mt-1 flex-1 text-ink-muted', typography.small)}>{t('channels.vcard.text')}</p>
                            <a
                                href={VCARD_PATH}
                                download="AZAFCO-International.vcf"
                                type="text/vcard"
                                data-cta="contact_vcard"
                                className={buttonClass({ variant: 'outline', size: 'sm', className: 'mt-4 self-start' })}
                            >
                                <Icon icon={LuDownload} size={20} />
                                <span>{t('channels.vcard.action')}</span>
                            </a>
                        </Card>
                    </div>
                </div>
            </Section>

            {/* 03 Enquiry routes → /requirements (prepared email / WhatsApp message; no web form).
                id="partnership" keeps legacy /contact#partnership links (config.contact.partnershipForm) working. */}
            <Section variant="offwhite" id="partnership" labelledBy="contact-routes-title">
                <ContactRoutes />
            </Section>

            {/* 04 After you write (no-obligation note) + registration, official channels (anti-fraud), privacy */}
            <Section variant="white" labelledBy="ct-next">
                <SectionHeading id="ct-next" eyebrow={t('next.eyebrow')} title={t('next.title')} />
                <ol className="m-0 grid list-none gap-6 p-0 md:grid-cols-3 md:gap-5 lg:gap-8">
                    {steps.map((s, i) => (
                        <li key={s} className="border-0 border-t-2 border-solid border-gold pt-4">
                            <span aria-hidden="true" className={cn('block text-navy', typography.overline)}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="mb-0 mt-2 text-ink-muted">{s}</p>
                        </li>
                    ))}
                </ol>
                <p className="mb-0 mt-8 max-w-[720px] border-0 border-s-2 border-solid border-gold ps-4 text-ink">{t('next.no_promise')}</p>

                <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
                    <Card accent className="flex flex-col md:col-span-2 lg:col-span-1">
                        <h3 className={cn('m-0 text-ink', typography.h3)}>{t('trust.title')}</h3>
                        <dl className={cn('m-0 mt-3 grid gap-1 text-ink-muted', typography.small)}>
                            <div>
                                <dt className="inline">{t('trust.register')}: </dt>
                                <dd className="m-0 inline">
                                    <bdi dir="ltr" className="font-semibold text-ink">
                                        {companyConfig.registration.commercialRegister}
                                    </bdi>
                                </dd>
                            </div>
                            <div>
                                <dt className="inline">{t('trust.tax')}: </dt>
                                <dd className="m-0 inline">
                                    <bdi dir="ltr" className="font-semibold text-ink">
                                        {companyConfig.registration.taxCard}
                                    </bdi>
                                </dd>
                            </div>
                        </dl>
                        <h4 className={cn('mb-0 mt-5 text-ink', typography.h4)}>{t('trust.proof_title')}</h4>
                        <ul className="m-0 mt-2 flex-1 list-none space-y-2 p-0">
                            {proof.map((item) => (
                                <li key={item} className={cn('flex items-start gap-2.5 text-ink-muted', typography.small)}>
                                    <CheckIcon size={20} className="mt-0.5 text-navy" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href={routes.quality} className={cn(cardLink, 'mt-3 self-start')}>
                            {t('trust.proof_link')}
                            <ArrowIcon size={20} />
                        </Link>
                    </Card>

                    {/* Anti-fraud notice (approved copy in data.company.officialChannels) */}
                    <Card accent className="flex flex-col">
                        <h3 className={cn('m-0 text-ink', typography.h3)}>{tc('officialChannels.title')}</h3>
                        <p className={cn('mb-0 mt-3 text-ink-muted', typography.small)}>{tc('officialChannels.text', { phone, email: c.email })}</p>
                    </Card>

                    <Card accent className="flex flex-col">
                        <h3 className={cn('m-0 text-ink', typography.h3)}>{t('privacy.title')}</h3>
                        <p className={cn('mb-0 mt-3 flex-1 text-ink-muted', typography.small)}>{t('privacy.text')}</p>
                        <Link href={routes.privacy} className={cn(cardLink, 'mt-3 self-start')}>
                            {t('privacy.link')}
                            <ArrowIcon size={20} />
                        </Link>
                    </Card>
                </div>
            </Section>

            {/* 05 Locations with map embeds (addresses + embeds from data/company.ts, as on the live site) */}
            <Section variant="offwhite" labelledBy="ct-locations">
                <SectionHeading id="ct-locations" layout="split" eyebrow={t('locations.eyebrow')} title={t('locations.title')} intro={t('locations.intro')} />
                <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:gap-8">
                    {locations.map((l) => (
                        <li key={l.key} className="flex min-w-0">
                            <Card padding="none" className="flex w-full flex-col overflow-hidden">
                                <div className="relative aspect-[4/3] w-full bg-navy-100 sm:aspect-[16/10]">
                                    {/* Static placeholder behind the lazy iframe (iframes are transparent until the map paints),
                                        so the card never shows an empty box on slow connections or with embeds blocked. */}
                                    <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-navy shadow-sm">
                                            <MapPinIcon size={28} />
                                        </span>
                                        <span className={cn('font-semibold text-navy', typography.h4)}>{l.title}</span>
                                        <span className={cn('max-w-[34ch] text-ink-muted', typography.small)}>{l.address}</span>
                                    </div>
                                    <iframe
                                        src={l.embed}
                                        title={l.mapTitle}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        allowFullScreen
                                        className="absolute inset-0 h-full w-full border-0"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-5 lg:p-8">
                                    <h3 className={cn('m-0 flex items-center gap-2.5 text-ink', typography.h3)}>
                                        <MapPinIcon size={24} className="text-navy" />
                                        {l.title}
                                    </h3>
                                    <address className="mb-0 mt-2 flex-1 not-italic text-ink-muted">{l.address}</address>
                                    {l.link ? (
                                        <ExternalLink href={l.link} newTabLabel={newTab} className="mt-3 self-start" dataAttrs={{ 'data-cta': `contact_map_${l.key}` }}>
                                            {t('locations.map_open')}
                                        </ExternalLink>
                                    ) : null}
                                </div>
                            </Card>
                        </li>
                    ))}
                </ul>
                <p className={cn('mb-0 mt-4 text-ink-subtle', typography.caption)}>{t('locations.map_note')}</p>
            </Section>
        </div>
    );
}
