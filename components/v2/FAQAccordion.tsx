import type { ReactNode } from 'react';
import { cn } from '@/lib/v2/cn';
import { PlusIcon } from '@/components/ui/icons';

export interface FAQItem {
    question: string;
    answer: ReactNode;
    /** Stable id (anchor links, analytics) */
    id?: string;
}

export interface FAQAccordionProps {
    items: FAQItem[];
    /** Index opened on load (none by default) */
    defaultOpen?: number;
    /**
     * Group name: with modern browsers, opening one item closes the others
     * (native <details name>). Omit to allow several open.
     */
    exclusiveName?: string;
    className?: string;
}

/**
 * Accessible FAQ built on native <details>/<summary>: keyboard (Enter/Space),
 * screen-reader state and find-in-page work with zero JS, so it stays a
 * server component. Add FAQPage JSON-LD separately if the page needs it.
 * Design G: hairline dividers, bold questions, round toggle that turns gold when open.
 */
export default function FAQAccordion({ items, defaultOpen, exclusiveName, className }: FAQAccordionProps) {
    return (
        <div className={cn('v2-faq divide-y divide-rule border-y border-rule', className)}>
            {items.map((item, i) => (
                <details
                    key={item.id ?? i}
                    id={item.id}
                    className="group"
                    open={defaultOpen === i || undefined}
                    {...(exclusiveName ? { name: exclusiveName } : {})}
                >
                    <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-5 text-heading-sm text-fg transition-colors duration-base hover:text-link motion-reduce:transition-none lg:py-6">
                        <span>{item.question}</span>
                        <span
                            aria-hidden="true"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-edge text-fg transition-[transform,background-color,border-color] duration-base group-open:rotate-45 group-open:border-gold group-open:bg-gold group-open:text-navy-900 motion-reduce:transition-none"
                        >
                            <PlusIcon size={18} />
                        </span>
                    </summary>
                    <div className="max-w-[720px] pb-6 pe-16 text-body text-fg-muted lg:pb-7">{item.answer}</div>
                </details>
            ))}
        </div>
    );
}
