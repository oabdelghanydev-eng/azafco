/**
 * Server-side entry for the requirements messages. Everything lives in the pure
 * ./compose module (also used by client components); server code may add
 * helpers here that read the company config.
 */
export * from './compose';
import type { RfqMessageInput } from './compose';
import { whatsappText } from './compose';

/** https://wa.me/<digits>?text=… (number in international format, digits only). */
export function whatsappHref(number: string, m: RfqMessageInput): string {
    return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappText(m))}`;
}
