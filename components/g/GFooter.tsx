import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { companyConfig } from '@/config/company.config';
import { routes } from '@/lib/v2/routes';
import GFooterLangs from './GFooterLangs';
import GFooterNav from './GFooterNav';
import GFooterWordmark from './GFooterWordmark';
import s from './GFooter.module.css';

/** Board link for the factory row (Google Maps search, Motobas). */
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Motobas%20Kafr%20El%20Sheikh';

/** "+20 100 773 6419" from the config number (201007736419) */
function phoneDisplay(n: string): string {
    return `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;
}

/** Quiet secondary links under the bottom bar (not on the boards; kept small and muted) */
const SECONDARY = [
    { key: 'for_importers', href: routes.forImporters },
    { key: 'contact', href: routes.contact },
    { key: 'privacy', href: routes.privacy },
] as const;

const FOCUS_DARK = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500]';

function Arrow({ rtl }: { rtl: boolean }) {
    return (
        <svg className="h-[18px] w-[18px] lg:h-5 lg:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d={rtl ? 'M19 12H5M11 6l-6 6 6 6' : 'M5 12h14M13 6l6 6-6 6'} />
        </svg>
    );
}

function UpArrow() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
    );
}

interface RowProps {
    n: string;
    href: string;
    title: string;
    sub: string;
    value: React.ReactNode;
    external?: boolean;
    newTab: string;
    rtl: boolean;
    cta: string;
}

function ContactRow({ n, href, title, sub, value, external, newTab, rtl, cta }: RowProps) {
    return (
        <a
            href={href}
            data-cta={cta}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`${s.row} grid grid-cols-[30px_minmax(0,1fr)_44px] items-center gap-x-3 border-b border-white/[.16] py-5 lg:px-3 lg:py-6 xl:grid-cols-[56px_minmax(0,1fr)_minmax(0,1fr)_52px] xl:gap-5 ${FOCUS_DARK}`}
        >
            <span
                dir="ltr"
                aria-hidden="true"
                className="col-start-1 row-span-2 row-start-1 text-[13px] font-bold leading-none text-white/50 lg:text-[14px] xl:row-span-1"
            >
                {n}
            </span>
            <span className="col-start-2 row-start-1 min-w-0">
                <span className={`${s.title} block text-[22px] font-bold leading-[1.35] text-white lg:text-[26px] lg:leading-[1.3]`}>{title}</span>
                <span className="block text-[13px] leading-[1.6] text-white/[.62] lg:text-[14px] lg:leading-[1.85]">{sub}</span>
            </span>
            <span className="col-start-2 row-start-2 mt-0.5 block min-w-0 text-start text-white [overflow-wrap:anywhere] xl:col-start-3 xl:row-start-1 xl:mt-0">
                {value}
            </span>
            <span
                aria-hidden="true"
                className={`${s.go} col-start-3 row-span-2 row-start-1 grid h-11 w-11 place-items-center rounded-full border border-white/40 text-white xl:col-start-4 xl:row-span-1 xl:h-[52px] xl:w-[52px]`}
            >
                <Arrow rtl={rtl} />
            </span>
            {external && <span className="sr-only">{newTab}</span>}
        </a>
    );
}

/**
 * Design G site footer (boards GroupAr / Group / *Mobile, footer#contact):
 * "every shipment starts with a message" contact block over the AZAFCO ice
 * wordmark, truck photo (side column from lg, banner on top on the phone), and
 * the dark bottom bar with links, language pills, copyright and back-to-top.
 */
export default function GFooter() {
    const t = useTranslations('g_footer_v2');
    const tNav = useTranslations('g_header_v2');
    const locale = useLocale();
    const rtl = locale === 'ar';
    const { email, whatsappNumber, social } = companyConfig.contact;

    const valueLtr = (text: string) => (
        <span dir="ltr" className="text-[15px] font-semibold leading-[1.4] lg:text-[18px]">
            {text}
        </span>
    );

    const secondary = (cls: string) => (
        <nav aria-label={t('secondary_label')} className={cls}>
            {SECONDARY.map((l) => (
                <Link
                    key={l.key}
                    href={l.href}
                    className={`inline-flex min-h-11 items-center transition-colors hover:text-[#f7b500] ${FOCUS_DARK}`}
                >
                    {t(`secondary.${l.key}`)}
                </Link>
            ))}
        </nav>
    );

    const backToTop = (
        <a
            href="#top"
            aria-label={t('back_to_top')}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/35 text-white transition-colors hover:border-[#f7b500] hover:text-[#f7b500] ${FOCUS_DARK}`}
        >
            <UpArrow />
        </a>
    );

    return (
        <footer id="contact" className="g-font box-border bg-[#001b47] text-[16px] leading-[1.85] text-white/[.86] lg:text-[17px]">
            <div className="relative flex flex-col lg:grid lg:min-h-[600px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                {/* Ice wordmark: bottom of the contact block on the phone, under both columns from lg */}
                <div
                    aria-hidden="true"
                    className={`${s.wordmark} absolute inset-x-0 bottom-0 z-0 box-border lg:z-[1] lg:mx-auto lg:max-w-[1320px] lg:px-8`}
                >
                    <GFooterWordmark />
                </div>

                {/* Truck photo */}
                <div className="relative h-[280px] overflow-hidden lg:order-2 lg:h-auto">
                    <Image
                        src="/images/g/logistics-truck.webp"
                        alt={t('photo_alt')}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover object-[40%_50%] lg:object-[35%_50%]"
                    />
                    <div className={`${s.fade} absolute inset-0`} />
                </div>

                {/* Contact block */}
                <div className="relative z-[1] box-border px-5 pb-14 md:px-8 lg:order-1 lg:z-[2] lg:pb-[120px] lg:pe-16 lg:ps-[max(32px,calc((100vw_-_1320px)/2))] lg:pt-24">
                    <p className="relative -mt-9 mb-2 flex items-center gap-2.5 text-[15px] font-bold text-[#f7b500] lg:mb-3 lg:mt-0 lg:gap-3 lg:text-[17px]">
                        <span aria-hidden="true" className="h-0.5 w-7 bg-[#f7b500] lg:w-10" />
                        {t('kicker')}
                    </p>
                    <div className="lg:flex lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-10 lg:gap-y-3">
                        <h2 className="m-0 text-[34px] font-bold leading-[1.25] text-white lg:text-[clamp(38px,3.8vw,58px)] lg:leading-[1.2]">
                            {t('title_1')} <br className="lg:hidden" />
                            {t('title_2')}
                        </h2>
                        <p
                            className={`mb-0 mt-2.5 text-[16px] leading-[1.7] text-white/[.78] lg:mt-0 lg:leading-[1.75] ${rtl ? 'lg:max-w-[340px]' : 'lg:max-w-[560px]'}`}
                        >
                            {t('lead')}
                        </p>
                    </div>

                    <div className="mt-7 border-t border-[rgba(247,181,0,.55)] lg:mt-10">
                        <ContactRow
                            n="01"
                            href={social.whatsapp}
                            cta="footer_whatsapp"
                            title={t('whatsapp.title')}
                            sub={t('whatsapp.sub')}
                            value={valueLtr(phoneDisplay(whatsappNumber))}
                            external
                            newTab={t('new_tab')}
                            rtl={rtl}
                        />
                        <ContactRow
                            n="02"
                            href={`mailto:${email}`}
                            cta="footer_email"
                            title={t('email.title')}
                            sub={t('email.sub')}
                            value={valueLtr(email)}
                            newTab={t('new_tab')}
                            rtl={rtl}
                        />
                        <ContactRow
                            n="03"
                            href={MAPS_URL}
                            cta="footer_map"
                            title={t('factory.title')}
                            sub={t('factory.sub')}
                            value={
                                <span className="text-[15px] font-semibold leading-[1.5] lg:text-[17px]">{t('factory.address')}</span>
                            }
                            external
                            newTab={t('new_tab')}
                            rtl={rtl}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-[#00143a]">
                {/* Phone / tablet */}
                <div className="px-5 pb-6 pt-8 md:px-8 lg:hidden">
                    <div className="flex items-center justify-between gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/g/logo-reversed.svg" alt={t('logo_alt')} width={81} height={54} loading="lazy" decoding="async" className="block h-[54px] w-auto" />
                        {backToTop}
                    </div>
                    <p className="mb-0 mt-3.5 text-[14px] leading-[1.7] text-white/70">
                        {t('tagline_1')} {t('tagline_2')}.
                    </p>
                    <GFooterNav
                        label={t('links_label')}
                        className="mt-[18px] flex flex-wrap gap-x-[18px] text-[15px]"
                        linkClassName={`py-2 transition-colors hover:text-[#f7b500] aria-[current=page]:text-[#f7b500] ${FOCUS_DARK}`}
                    />
                    <div className="mt-4">
                        <GFooterLangs label={t('langs_label')} />
                    </div>
                    <div className="mt-6 border-t border-white/[.14] pt-2 text-[12px] leading-[1.7] text-white/60">
                        {secondary('-mb-1 flex flex-wrap gap-x-5')}
                        <p className="m-0 pt-1">{t('copyright')}</p>
                    </div>
                </div>

                {/* Desktop */}
                <div className="mx-auto box-border hidden max-w-[1320px] px-8 pb-7 pt-9 lg:block">
                    <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
                        <div className="flex items-center gap-5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/g/logo-reversed.svg" alt={t('logo_alt')} width={95} height={64} loading="lazy" decoding="async" className="block h-16 w-auto" />
                            <p className="m-0 text-[14px] leading-[1.6] text-white/70">
                                {t('tagline_1')}
                                <br />
                                {t('tagline_2')}
                            </p>
                        </div>
                        <GFooterNav
                            label={t('links_label')}
                            className="flex flex-wrap gap-x-7 text-[16px]"
                            linkClassName={`py-2 transition-colors hover:text-[#f7b500] aria-[current=page]:text-[#f7b500] ${FOCUS_DARK}`}
                        />
                        <div className="flex items-center gap-4">
                            <GFooterLangs label={t('langs_label')} />
                            {backToTop}
                        </div>
                    </div>
                    <div className="mt-[26px] flex flex-wrap items-center justify-between gap-x-8 border-t border-white/[.12] pt-[7px] text-[13px] text-white/60">
                        <p className="m-0 py-[11px]">{t('copyright')}</p>
                        {secondary('flex flex-wrap gap-x-6')}
                    </div>
                </div>
            </div>
        </footer>
    );
}
