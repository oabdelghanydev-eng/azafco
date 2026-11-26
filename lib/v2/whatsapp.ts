import { companyConfig } from '@/config/company.config';

/**
 * The one wa.me link builder for the site (ledger C12): every WhatsApp link opens
 * with a prefilled message from the locale files.
 *
 *   whatsappLink(t('whatsapp_message'))   // g_header_v2.whatsapp_message: the standard opening
 *   whatsappLink(t('whatsapp_message', { name }))   // a page's own message (product pages)
 *
 * Default number = the management line (companyConfig.contact.whatsappNumber).
 * Server side only (it reads the company config): client components get the
 * finished href as a prop (GHeader → GHeaderClient, MobileQuoteBar → WhatsAppFloat).
 */
export function whatsappLink(text: string, number: string = companyConfig.contact.whatsappNumber): string {
    const base = `https://wa.me/${number.replace(/\D/g, '')}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
