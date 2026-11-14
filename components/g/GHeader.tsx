import { useLocale, useTranslations } from 'next-intl';
import { localeConfig, type Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import { whatsappLink } from '@/lib/v2/whatsapp';
import { phoneDisplay } from '@/components/ui/format';
import GHeaderClient from './GHeaderClient';
import { G_NAV_KEYS_WITH_CONTACT, type GNavKey } from './nav';
import { publishedLangs } from './publishedLangs';

/**
 * Design G site header (boards GroupAr / Group / *Mobile), server wrapper.
 * Reads the copy, the management WhatsApp link and the published locales on the
 * server and hands them to GHeaderClient as props, so the browser bundle carries
 * neither the company config nor the g_header_v2 messages.
 */
export default function GHeader() {
    const t = useTranslations('g_header_v2');
    const locale = useLocale() as Locale;
    const langName = localeConfig[locale]?.nativeName ?? locale;

    return (
        <GHeaderClient
            locale={locale}
            langName={langName}
            langs={publishedLangs()}
            whatsappHref={whatsappLink(t('whatsapp_message'))}
            phone={phoneDisplay(companyConfig.contact.whatsappNumber)}
            copy={{
                homeLabel: t('home_label'),
                logoAlt: t('logo_alt'),
                navLabel: t('nav_label'),
                nav: Object.fromEntries(G_NAV_KEYS_WITH_CONTACT.map((k) => [k, t(`nav.${k}`)])) as Record<GNavKey, string>,
                langAria: t('lang_aria', { name: langName }),
                langListLabel: t('lang_list_label'),
                menuOpen: t('menu_open'),
                menuClose: t('menu_close'),
                whatsappCta: t('whatsapp_cta'),
                whatsappAria: t('whatsapp_aria'),
            }}
        />
    );
}
