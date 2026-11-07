import type { ReactNode } from 'react';
import { cn } from '@/lib/v2/cn';
import { PlusIcon } from './icons';

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
                    <summary className="flex min-h-[56px] cursor-pointer items-center justify-between gap-6 py-5 text-heading-sm text-fg">
                        <span>{item.question}</span>
                        <span
                            aria-hidden="true"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rule text-fg transition-transform duration-base group-open:rotate-45 motion-reduce:transition-none"
                        >
                            <PlusIcon size={16} />
                        </span>
                    </summary>
                    <div className="max-w-prose-v2 pb-6 pe-14 text-body text-fg-muted">{item.answer}</div>
                </details>
            ))}
        </div>
    );
}
