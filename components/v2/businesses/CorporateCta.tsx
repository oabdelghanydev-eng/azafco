import type { ReactNode } from 'react';
import { Link } from '@/navigation';
import { companyConfig } from '@/config/company.config';
import { cn } from '@/lib/v2/cn';
import { ArrowIcon, Button, Container, Eyebrow, GeoArcs, MailIcon } from '@/components/v2';

interface Action {
    label: string;
    href: string;
}

export interface CorporateCtaProps {
    id?: string;
    eyebrow: ReactNode;
    title: ReactNode;
    intro: ReactNode;
    primary: Action;
    secondary?: Action;
    /** Small text link that sends seafood buyers back to the RFQ */
    supplyLink?: Action & { lead: string };
    /** Label for the email line */
    emailLabel: string;
    /** e.g. <Pending block label="Company profile PDF" /> */
    extra?: ReactNode;
    className?: string;
}

/**
 * Corporate (non-RFQ) closing band for About / Our Businesses: partnership
 * enquiry kept separate from the fish quote path. Navy surface.
 */
export default function CorporateCta({
    id = 'corporate-cta-title',
    eyebrow,
    title,
    intro,
    primary,
    secondary,
    supplyLink,
    emailLabel,
    extra,
    className,
}: CorporateCtaProps) {
    const email = companyConfig.contact.email;
    return (
        <section
            data-surface="dark"
            aria-labelledby={id}
            className={cn('relative isolate overflow-hidden bg-navy-900 py-16 text-fg md:py-24', className)}
        >
            <GeoArcs tone="onDark" className="absolute -bottom-48 -end-40 -z-10 w-[640px]" />
            <Container>
                <div className="max-w-3xl">
                    <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
                    <h2 id={id} className="v2-heading font-display text-display-lg">
                        {title}
                    </h2>
                    <p className="mt-5 max-w-prose-v2 text-body-lg text-fg-muted">{intro}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button href={primary.href} size="lg" arrow dataAttrs={{ 'data-cta': 'corporate_primary' }}>
                            {primary.label}
                        </Button>
                        {secondary ? (
                            <Button href={secondary.href} size="lg" variant="outline" dataAttrs={{ 'data-cta': 'corporate_secondary' }}>
                                {secondary.label}
                            </Button>
                        ) : null}
                    </div>
                    <ul className="mt-8 space-y-1 text-body-sm">
                        <li>
                            <a
                                href={`mailto:${email}`}
                                className="inline-flex min-h-[44px] items-center gap-3 font-medium text-fg hover:underline"
                                data-cta="corporate_email"
                            >
                                <MailIcon className="shrink-0 text-gold" />
                                <span className="sr-only">{emailLabel}: </span>
                                <span dir="ltr">{email}</span>
                            </a>
                        </li>
                        {supplyLink ? (
                            <li className="flex flex-wrap items-center gap-x-2 text-fg-muted">
                                <span>{supplyLink.lead}</span>
                                <Link
                                    href={supplyLink.href}
                                    className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-fg underline decoration-gold decoration-2 underline-offset-[6px]"
                                >
                                    {supplyLink.label}
                                    <ArrowIcon size={16} />
                                </Link>
                            </li>
                        ) : null}
                    </ul>
                    {extra ? <div className="mt-6">{extra}</div> : null}
                </div>
            </Container>
        </section>
    );
}
