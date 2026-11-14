import { useTranslations } from 'next-intl';
import { companyConfig } from '@/config/company.config';
import WhatsAppFloat from './WhatsAppFloat';

/**
 * Floating WhatsApp button (the only fixed layer; no quote bar, no pulse, no popup).
 * Server wrapper: reads the management WhatsApp link and the copy here and passes
 * them to the small client file (WhatsAppFloat), so the browser gets neither the
 * company config nor the g_footer_v2 messages.
 *
 * The official WhatsApp mark (Simple Icons) in white on the WhatsApp brand green
 * (token `whatsapp`), 56px circle with a soft navy shadow. Bottom end corner (left
 * in RTL), above the iOS home indicator. The number is the owner's line
 * (management direct, fast deals), so the accessible name says so
 * (g_footer_v2.float_label). It fades in once the page hero is out of view, steps
 * aside while the footer (WhatsApp row, back-to-top) is on screen, and is
 * hidden on /contact and /requirements, which already list WhatsApp. Fixed
 * position: no layout shift. The file keeps its old name to avoid churn in
 * app/[locale]/layout.tsx.
 */
export default function MobileQuoteBar() {
    const t = useTranslations('g_footer_v2');
    return <WhatsAppFloat href={companyConfig.contact.social.whatsapp} label={t('float_label')} newTab={t('new_tab')} />;
}
