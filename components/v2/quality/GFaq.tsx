import type { ReactNode } from 'react';
import { gType } from '@/components/v2/processing/GPage';

export interface GFaqItem {
    id: string;
    question: string;
    /** Rendered answer (may contain links); the JSON-LD uses a plain-text copy */
    answer: ReactNode;
}

/**
 * FAQ list in the design G look (white rows, navy text, gold marker), built on
 * native <details>/<summary>: keyboard and screen-reader support without client JS.
 * The answers are always in the HTML, so they match the FAQPage JSON-LD on the page.
 */
export default function GFaq({ ar, items }: { ar: boolean; items: GFaqItem[] }) {
    const ty = gType(ar);
    return (
        <ul className="m-0 list-none divide-y divide-[#d5dde9] border-y border-solid border-[#d5dde9] p-0">
            {items.map((f) => (
                <li key={f.id}>
                    <details name="quality-faq" className="group">
                        <summary
                            className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-start text-[#0d1f3f] hover:text-[#002d72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002d72] [&::-webkit-details-marker]:hidden ${
                                ar ? 'text-[18px] font-bold leading-[1.6] lg:text-[19px]' : 'text-[17px] font-extrabold leading-[1.4] lg:text-[18px]'
                            }`}
                        >
                            <span>{f.question}</span>
                            <span
                                aria-hidden="true"
                                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-[#d5dde9] text-[#002d72] group-open:border-[#f7b500] group-open:bg-[#f7b500]"
                            >
                                <span className="absolute h-[2px] w-3.5 bg-current" />
                                <span className="absolute h-3.5 w-[2px] bg-current group-open:hidden" />
                            </span>
                        </summary>
                        <p className={`m-0 max-w-[760px] pb-6 text-[#4a5a75] ${ty.small} lg:text-[17px]`}>{f.answer}</p>
                    </details>
                </li>
            ))}
        </ul>
    );
}
