import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LuDownload } from 'react-icons/lu';
import { ExternalLink, Icon, PageHead, Section, cn, focusRing, phoneDisplay, typography } from '@/components/ui';
import ContactStage from '@/components/v2/contact/ContactStage';
import InfoBlock from '@/components/v2/contact/InfoBlock';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { PageStructuredData } from '@/components/StructuredData';
import { companyConfig } from '@/config/company.config';
import { companyInfo } from '@/data/company';
import { localeConfig, type Locale } from '@/i18n';
import { routes } from '@/lib/v2/routes';
import { whatsappLink } from '@/lib/v2/whatsapp';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'contact_v2.meta' });
    return pageMetadata({ locale, path: routes.contact, title: t('title'), description: t('description') });
}

/**
 * /contact (owner's pick "A", 25 Nov 2026): the two channels on one panel, then
 * the addresses and the registration, about one screen long.
 *
 * Gone on purpose: the embedded maps (two large grey boxes; the Google Maps
 * links stay), the separate phone row (same number as WhatsApp: now a "Call"
 * button) and the three enquiry links to /requirements (owner, 26 Nov 2026, after
 * the B2B review: they led to the same two buttons this page already shows).
 */
export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'contact_v2' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const c = companyConfig.contact;
    const newTab = t('channels.new_tab');
    const phone = phoneDisplay(c.whatsappNumber);
    // Management WhatsApp with the standard prefilled opening (ledger C12)
    const waHref = whatsappLink((await getTranslations({ locale, namespace: 'g_header_v2' }))('whatsapp_message'));

    const officePin = pinFromEmbed(companyInfo.addresses.main.mapEmbedUrl);
    const locations = [
        { key: 'office', title: t('locations.office'), address: tc('addresses.main.address'), link: officePin ? mapsSearch(officePin) : undefined },
        { key: 'factory', title: t('locations.factory'), address: tc('addresses.factory.address'), link: mapsSearch(FACTORY_PIN) },
    ];

    return (
        <div className={typography.body}>
            <PageStructuredData locale={locale} pageType="contact" />

            <PageHead
                compact
                crumbs={[{ label: t('breadcrumb') }]}
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                titleId="contact-title"
                intro={
                    <>
                        <span className={cn('block font-bold text-gold', typography.small)}>{t('channels.hours')}</span>
                        <span className="block font-semibold text-white">{tc('workingHours')}</span>
                    </>
                }
            />

            {/* id="partnership" keeps legacy /contact#partnership links working */}
            <Section variant="navy" spacing="sm" id="partnership" labelledBy="contact-title" className="!pt-0">
                <ContactStage
                    rtl={localeConfig[locale as Locale]?.dir === 'rtl'}
                    newTab={newTab}
                    whatsapp={{
                        title: t('channels.whatsapp.title'),
                        role: t('channels.whatsapp.sub'),
                        number: phone,
                        href: waHref,
                        action: t('hero.actions.whatsapp'),
                        actionShort: t('channels.whatsapp.title'),
                    }}
                    call={{ label: tv('cta.call'), href: `tel:${c.phone}` }}
                    email={{
                        title: t('channels.email.title'),
                        role: t('channels.email.sub'),
                        address: c.email,
                        href: `mailto:${c.email}`,
                        action: t('hero.actions.email'),
                    }}
                />

                {/* Addresses and registration: three columns from lg, rows that open on tap on phones */}
                <div className="mt-3.5 border-0 border-b border-solid border-white/25 lg:mt-10 lg:grid lg:grid-cols-3 lg:gap-11 lg:border-b-0">
                    {locations.map((l) => (
                        <InfoBlock key={l.key} title={l.title}>
                            <address className="m-0 not-italic text-white/80">{l.address}</address>
                            {l.link ? (
                                <ExternalLink href={l.link} newTabLabel={newTab} className="mt-1" dataAttrs={{ 'data-cta': `contact_map_${l.key}` }}>
                                    {t('locations.map_open')}
                                </ExternalLink>
                            ) : null}
                        </InfoBlock>
                    ))}

                    {/* Registration and the anti-fraud notice (approved copy in data.company.officialChannels) */}
                    <InfoBlock title={t('official.title')}>
                        <dl className="m-0 grid gap-1 text-white/80">
                            {/* Legal name first: the same localized value as the /about fact table */}
                            <div>
                                <dt className="inline">{t('trust.legal')}: </dt>
                                <dd className="m-0 inline font-semibold text-white">{tc('fullName')}</dd>
                            </div>
                            <div>
                                <dt className="inline">{t('trust.register')}: </dt>
                                <dd className="m-0 inline">
                                    <bdi dir="ltr" className="font-semibold text-white">
                                        {companyConfig.registration.commercialRegister}
                                    </bdi>
                                </dd>
                            </div>
                            <div>
                                <dt className="inline">{t('trust.tax')}: </dt>
                                <dd className="m-0 inline">
                                    <bdi dir="ltr" className="font-semibold text-white">
                                        {companyConfig.registration.taxCard}
                                    </bdi>
                                </dd>
                            </div>
                        </dl>
                        <p className="mb-0 mt-3 text-white/80">{tc('officialChannels.text', { phone, email: c.email })}</p>
                        <a
                            href={VCARD_PATH}
                            download="AZAFCO-International.vcf"
                            type="text/vcard"
                            data-cta="contact_vcard"
                            className={cn(
                                'mt-2 inline-flex min-h-tap items-center gap-2 font-bold text-link underline-offset-4 transition-colors hover:text-link-hover hover:underline',
                                focusRing,
                            )}
                        >
                            <Icon icon={LuDownload} size={20} />
                            <span>{t('channels.vcard.action')}</span>
                        </a>
                    </InfoBlock>
                </div>
            </Section>
        </div>
    );
}
