import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import type { Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import { routes } from '@/lib/v2/routes';
import GFooterContactGate from './GFooterContactGate';
import GFooterLangs from './GFooterLangs';
import GFooterNav from './GFooterNav';
import GFooterWordmark from './GFooterWordmark';
import { G_NAV_KEYS, type GNavKey } from './nav';
import { publishedLangs } from './publishedLangs';
import { ArrowIcon, ArrowUpIcon } from '@/components/ui/icons';
import { IconButton } from '@/components/ui/IconButton';
import { Eyebrow } from '@/components/ui/Layout';
import { phoneDisplay } from '@/components/ui/format';
import { cn, focusRingDark as FOCUS_DARK, typography } from '@/components/ui/tokens';
import s from './GFooter.module.css';

/** Factory pin (from the old site's factory map embed). */
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=31.433264,30.475957';

/** Quiet secondary links under the bottom bar (not on the boards; kept small and muted) */
const SECONDARY = [
    { key: 'for_importers', href: routes.forImporters },
    { key: 'contact', href: routes.contact },
    { key: 'privacy', href: routes.privacy },
] as const;

interface RowProps {
    n: string;
    href: string;
    title: string;
    sub: string;
    value: React.ReactNode;
    external?: boolean;
    /** Locale-aware site route (next-intl Link) instead of a plain href */
    internal?: boolean;
    newTab: string;
    cta: string;
}

function ContactRow({ n, href, title, sub, value, external, internal, newTab, cta }: RowProps) {
    const className = `${s.row} grid grid-cols-[30px_minmax(0,1fr)_44px] items-center gap-x-3 border-b border-white/[.16] py-5 lg:px-3 lg:py-6 xl:grid-cols-[56px_minmax(0,1fr)_minmax(0,1fr)_52px] xl:gap-5 ${FOCUS_DARK}`;
    const body = (
        <>
            <span
                dir="ltr"
                aria-hidden="true"
                className="col-start-1 row-span-2 row-start-1 text-caption font-bold leading-none text-white/50 xl:row-span-1"
            >
                {n}
            </span>
            <span className="col-start-2 row-start-1 min-w-0">
                <span className={cn(s.title, 'block font-bold text-white', typography.h3Lg)}>{title}</span>
                <span className={cn('block text-white/[.62]', typography.caption)}>{sub}</span>
            </span>
            <span className="col-start-2 row-start-2 mt-0.5 block min-w-0 text-start text-white [overflow-wrap:anywhere] xl:col-start-3 xl:row-start-1 xl:mt-0">
                {value}
            </span>
            <span
                aria-hidden="true"
                className={`${s.go} col-start-3 row-span-2 row-start-1 grid h-11 w-11 place-items-center rounded-full border border-white/40 text-white xl:col-start-4 xl:row-span-1 xl:h-[52px] xl:w-[52px] motion-reduce:transition-none`}
            >
                <ArrowIcon size={20} />
            </span>
            {external && <span className="sr-only">{newTab}</span>}
        </>
    );

    if (internal) {
        return (
            <Link href={href} data-cta={cta} className={className}>
                {body}
            </Link>
        );
    }

    return (
        <a
            href={href}
            data-cta={cta}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={className}
        >
            {body}
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
    const locale = useLocale() as Locale;
    const rtl = locale === 'ar';
    const { email, whatsappNumber, social } = companyConfig.contact;
    const langs = publishedLangs();
    const navLabels = Object.fromEntries(G_NAV_KEYS.map((k) => [k, tNav(`nav.${k}`)])) as Partial<Record<GNavKey, string>>;
    const valueCls = cn('font-semibold leading-snug', typography.body);

    const valueLtr = (text: string) => (
        <span dir="ltr" className={valueCls}>
            {text}
        </span>
    );

    const secondary = (cls: string) => (
        <nav aria-label={t('secondary_label')} className={cls}>
            {SECONDARY.map((l) => (
                <Link
                    key={l.key}
                    href={l.href}
                    className={`inline-flex min-h-11 items-center transition-colors hover:text-gold ${FOCUS_DARK}`}
                >
                    {t(`secondary.${l.key}`)}
                </Link>
            ))}
        </nav>
    );

    // Commercial register and tax card numbers, kept LTR inside the Arabic sentence
    const registration = t.rich('registration', {
        cr: companyConfig.registration.commercialRegister,
        tax: companyConfig.registration.taxCard,
        n: (chunks) => <span dir="ltr">{chunks}</span>,
    });

    const backToTop = (
        <IconButton href="#top" label={t('back_to_top')} variant="outline">
            <ArrowUpIcon size={20} />
        </IconButton>
    );

    return (
        <footer id="contact" data-surface="dark" className={cn('g-font box-border bg-navy-900 text-white/[.86]', typography.body)}>
            {/* Contact block: not repeated on /contact and /requirements, which list the same channels */}
            <GFooterContactGate>
            <div className="relative flex flex-col lg:grid lg:min-h-[600px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                {/* Ice wordmark: bottom of the contact block on the phone, under both columns from lg */}
                <div
                    aria-hidden="true"
                    className={`${s.wordmark} absolute inset-x-0 bottom-0 z-0 box-border lg:z-[1] lg:mx-auto lg:max-w-v2 lg:px-8`}
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
                <div className="relative z-[1] box-border px-5 pb-14 md:px-8 lg:order-1 lg:z-[2] lg:pb-[120px] lg:pe-16 lg:ps-[max(32px,calc((100vw_-_1320px)/2_+_32px))] lg:pt-24">
                    <Eyebrow tone="dark" className="relative -mt-9 mb-2 lg:mb-3 lg:mt-0">
                        {t('kicker')}
                    </Eyebrow>
                    <div className="lg:flex lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-10 lg:gap-y-3">
                        <h2 className={cn('m-0 text-white', typography.h2)}>
                            {t('title_1')} <br />
                            {t('title_2')}
                        </h2>
                        <p
                            className={cn('mb-0 mt-2.5 text-white/[.78] lg:mt-0', typography.body, rtl ? 'lg:max-w-[340px]' : 'lg:max-w-[560px]')}
                        >
                            {t('lead')}
                        </p>
                    </div>

                    <div className="mt-7 border-t border-gold/55 lg:mt-10">
                        <ContactRow
                            n="01"
                            href={social.whatsapp}
                            cta="footer_whatsapp"
                            title={t('whatsapp.title')}
                            sub={t('whatsapp.sub')}
                            value={valueLtr(phoneDisplay(whatsappNumber))}
                            external
                            newTab={t('new_tab')}
                        />
                        <ContactRow
                            n="02"
                            href={`mailto:${email}`}
                            cta="footer_email"
                            title={t('email.title')}
                            sub={t('email.sub')}
                            value={valueLtr(email)}
                            newTab={t('new_tab')}
                        />
                        <ContactRow
                            n="03"
                            href={routes.rfq}
                            cta="footer_requirements"
                            title={t('form.title')}
                            sub={t('form.sub')}
                            value={<span className={valueCls}>{t('form.value')}</span>}
                            internal
                            newTab={t('new_tab')}
                        />
                        <ContactRow
                            n="04"
                            href={MAPS_URL}
                            cta="footer_map"
                            title={t('factory.title')}
                            sub={t('factory.sub')}
                            value={<span className={valueCls}>{t('factory.address')}</span>}
                            external
                            newTab={t('new_tab')}
                        />
                    </div>
                </div>
            </div>
            </GFooterContactGate>

            {/* Bottom bar */}
            <div className="bg-navy-925">
                {/* Phone / tablet */}
                <div className="px-5 pb-6 pt-8 md:px-8 lg:hidden">
                    <div className="flex items-center justify-between gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/g/logo-reversed.svg" alt={t('logo_alt')} width={81} height={54} loading="lazy" decoding="async" className="block h-[54px] w-auto" />
                        {backToTop}
                    </div>
                    <p className={cn('mb-0 mt-3.5 text-white/70', typography.caption)}>
                        {t('tagline_1')} {t('tagline_2')}.
                    </p>
                    <GFooterNav
                        label={t('links_label')}
                        labels={navLabels}
                        className={cn('mt-[18px] flex flex-wrap gap-x-[18px]', typography.small)}
                        linkClassName={`py-2 transition-colors hover:text-gold aria-[current=page]:text-gold ${FOCUS_DARK}`}
                    />
                    <div className="mt-4">
                        <GFooterLangs label={t('langs_label')} locale={locale} langs={langs} />
                    </div>
                    <div className={cn('mt-6 border-t border-white/[.14] pt-2 text-white/60', typography.micro)}>
                        {secondary('-mb-1 flex flex-wrap gap-x-5')}
                        <p className="m-0 pt-1">{t('copyright')}</p>
                        <p className="m-0">{registration}</p>
                    </div>
                </div>

                {/* Desktop */}
                <div className="mx-auto box-border hidden max-w-v2 px-8 pb-7 pt-9 lg:block">
                    <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
                        <div className="flex items-center gap-5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/g/logo-reversed.svg" alt={t('logo_alt')} width={95} height={64} loading="lazy" decoding="async" className="block h-16 w-auto" />
                            <p className={cn('m-0 text-white/70', typography.caption)}>
                                {t('tagline_1')}
                                <br />
                                {t('tagline_2')}
                            </p>
                        </div>
                        <GFooterNav
                            label={t('links_label')}
                            labels={navLabels}
                            className={cn('flex flex-wrap gap-x-7', typography.body)}
                            linkClassName={`py-2 transition-colors hover:text-gold aria-[current=page]:text-gold ${FOCUS_DARK}`}
                        />
                        <div className="flex items-center gap-4">
                            <GFooterLangs label={t('langs_label')} locale={locale} langs={langs} />
                            {backToTop}
                        </div>
                    </div>
                    <div className={cn('mt-[26px] flex flex-wrap items-center justify-between gap-x-8 border-t border-white/[.12] pt-[7px] text-white/60', typography.micro)}>
                        <p className="m-0 flex flex-wrap gap-x-6 py-[11px]">
                            <span>{t('copyright')}</span>
                            <span>{registration}</span>
                        </p>
                        {secondary('flex flex-wrap gap-x-6')}
                    </div>
                </div>
            </div>
        </footer>
    );
}
