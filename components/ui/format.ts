import { Children, createElement, type ReactNode } from 'react';

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

/** "ISO 9001:2015", "ISO 22000", "ISO 9001" (standard number, optional part and edition). */
const STANDARD_RE = /ISO\s?\d{3,5}(?:-\d+)?(?::\d{4})?/g;
/** Arabic letter at the end of the text before a standard (the conjunction in "وISO 14001:2015"). */
const ARABIC_END_RE = /[\u0600-\u06FF]$/;

function isolateIn(text: string, keyPrefix: string): ReactNode {
    const parts: ReactNode[] = [];
    let last = 0;
    const re = new RegExp(STANDARD_RE.source, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
        const start = m.index;
        let before = text.slice(last, start);
        // "وISO": keep the conjunction with the standard (no line break between them), with a
        // narrow no-break space so the Arabic letter doesn't touch the Latin "I".
        if (ARABIC_END_RE.test(before)) before += '\u202F';
        if (before) parts.push(before);
        parts.push(createElement('bdi', { key: `${keyPrefix}${parts.length}`, dir: 'ltr', className: 'whitespace-nowrap' }, m[0]));
        last = start + m[0].length;
    }
    if (!parts.length) return text;
    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

/**
 * Standard names in running text ("ISO 14001:2015") as LTR isolates that never wrap,
 * so in Arabic the name never splits across lines, the edition never reorders and
 * the conjunction «و» stays beside (not glued into) "ISO". Render only: JSON-LD and
 * messages keep the plain string. Accepts a string or the result of t.rich (strings
 * and arrays are processed; elements are left as they are).
 */
export function isolateStandards(node: ReactNode): ReactNode {
    if (typeof node === 'string') return isolateIn(node, 'std-');
    if (Array.isArray(node)) {
        return Children.toArray(node).map((child, i) => (typeof child === 'string' ? isolateIn(child, `std-${i}-`) : child));
    }
    return node;
}
