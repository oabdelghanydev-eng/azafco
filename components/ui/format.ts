/**
 * "+20 100 773 6419" from the config number (201007736419). One formatter for
 * the header, footer, contact page and WhatsApp rows. Render it with dir="ltr".
 */
export function phoneDisplay(n: string): string {
    const d = n.replace(/\D/g, '');
    return `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
}
