import { useTranslations } from 'next-intl';
import { whatsappLink } from '@/lib/v2/whatsapp';
import WhatsAppFloat from './WhatsAppFloat';

/**
 * Floating WhatsApp button (the only fixed layer; no quote bar, no pulse, no popup).
 * Server wrapper: builds the management WhatsApp link (prefilled opening message,
 * g_header_v2.whatsapp_message, lib/v2/whatsapp) and reads the copy here, and passes
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
    const tHeader = useTranslations('g_header_v2');
    return <WhatsAppFloat href={whatsappLink(tHeader('whatsapp_message'))} label={t('float_label')} newTab={t('new_tab')} />;
}
