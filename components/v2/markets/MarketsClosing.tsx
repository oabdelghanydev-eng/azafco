import { Button, Card, Eyebrow, MailIcon, Section, WhatsAppIcon, cn, typography } from '@/components/ui';
import { companyConfig } from '@/config/company.config';

/**
 * Closing action for the markets pages (DESIGN-SYSTEM §6.3): an off-white section
 * with one accent card, not a second navy contact band above the G footer.
 * One gold primary (start a partnership), then the two owner-set routes:
 * WhatsApp = management (fast deals, new tab), email = export team (details, documents).
 */
export interface MarketsClosingProps {
    headingId: string;
    eyebrow: string;
    title: string;
    text: string;
    primary: { label: string; href: string };
    whatsappLabel: string;
    emailLabel: string;
    /** Email subject, e.g. "Enquiry from azafco.com.eg: Kuwait" */
    emailSubject?: string;
    newTabLabel: string;
    disclaimer?: string;
    /** Analytics prefix for data-cta, e.g. "markets" */
    cta: string;
}

export default function MarketsClosing({
    headingId,
    eyebrow,
    title,
    text,
    primary,
    whatsappLabel,
    emailLabel,
    emailSubject,
    newTabLabel,
    disclaimer,
    cta,
}: MarketsClosingProps) {
    const c = companyConfig.contact;
    const mail = `mailto:${c.email}${emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ''}`;
    return (
        <Section variant="offwhite" labelledBy={headingId}>
            <Card accent padding="lg">
                <Eyebrow className="mb-3 lg:mb-4">{eyebrow}</Eyebrow>
                <h2 id={headingId} className={cn('v2-heading m-0 max-w-[760px]', typography.h2Sm)}>
                    {title}
                </h2>
                <p className={cn('m-0 mt-3 max-w-[680px] text-ink-muted lg:mt-4', typography.lead)}>{text}</p>
                <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-9">
                    <Button href={primary.href} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': `${cta}_partnership` }}>
                        {primary.label}
                    </Button>
                    <Button
                        href={c.social.whatsapp}
                        variant="outline"
                        size="lg"
                        stretch="phone"
                        icon={<WhatsAppIcon />}
                        newTabLabel={newTabLabel}
                        dataAttrs={{ 'data-cta': `${cta}_whatsapp` }}
                    >
                        {whatsappLabel}
                    </Button>
                    <Button href={mail} variant="outline" size="lg" stretch="phone" icon={<MailIcon />} dataAttrs={{ 'data-cta': `${cta}_email` }}>
                        {emailLabel}
                    </Button>
                </div>
                {disclaimer ? <p className={cn('m-0 mt-8 border-t border-line-soft pt-5 text-ink-subtle', typography.caption)}>{disclaimer}</p> : null}
            </Card>
        </Section>
    );
}
