/**
 * "+20 100 773 6419" from the config number (201007736419). One formatter for
 * the header, footer, contact page and WhatsApp rows. Render it with dir="ltr".
 */
export function phoneDisplay(n: string): string {
    const d = n.replace(/\D/g, '');
    return `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
}

/**
 * Keeps a measured value on one line: "300–500 g", "1–2 kg", "500 g and above",
 * "≤ 300 g" never wrap inside the number or between the number and its unit
 * (QA at 390px). Text before the value ("Medium (") can still wrap. Render only:
 * the stored values (RFQ prefill, messages) stay plain.
 *   - word joiners (U+2060) around the en dash of a range;
 *   - a no-break space after a number, "+", "≤" or an LTR isolate end (U+2069).
 */
export function noBreakValue(s: string): string {
    return s
        .replace(/\s*–\s*/g, '⁠–⁠')
        .replace(/([\d+≤⁩])[ \t]+/g, '$1 ');
}
