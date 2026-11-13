import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/v2/cn';
import type { ImageProps } from '@/lib/v2/media';
import Button from './Button';
import Pending from './Pending';
import { DocumentIcon } from './icons';

export interface CertificateCardProps {
    /** e.g. "ISO 22000:2018" */
    name: string;
    /**
     * Must be true only when the owner has approved public display of this
     * certificate. Otherwise the card renders only a <Pending> chip (nothing in production).
     */
    verified: boolean;
    /** Certification body, e.g. "TÜV AUSTRIA" */
    issuer?: string;
    /** Link to a verification page (e.g. /v/[token]) */
    href?: string;
    /**
     * Optional "Ask about this certificate" link to the export team (enquiry only:
     * no promise to send copies, owner decision 13 Nov).
     */
    requestHref?: string;
    headingAs?: 'h3' | 'h4';
    image?: ImageProps;
    className?: string;
}

/**
 * Proof card for a certificate / approval (design G quality card: white, thin
 * border, 4px gold top bar, standard name large in navy). Verified data only.
 * Owner decision 13 Nov: the standard name (and issuer) only. The card has no
 * fields for certificate numbers, expiry dates, site or scope, by design.
 */
export default function CertificateCard({
    name,
    verified,
    issuer,
    href,
    requestHref,
    image,
    headingAs: H = 'h3',
    className,
}: CertificateCardProps) {
    const t = useTranslations('v2.certificate');
    const tp = useTranslations('v2.pending');
    if (!verified) return <Pending label={tp('certificate_card', { name })} />;

    return (
        <article
            data-surface="light"
            className={cn(
                'flex h-full flex-col rounded-card border border-t-4 border-line border-t-gold bg-white px-5 pb-6 pt-5 text-ink lg:px-7 lg:pb-7 lg:pt-6',
                className,
            )}
        >
            <div className="flex items-start gap-4">
                {image ? (
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-card border border-line bg-surface-offwhite">
                        <Image src={image.src} alt={image.alt} fill sizes="64px" className="object-cover" />
                    </div>
                ) : null}
                <H className="m-0 text-[1.5rem] font-extrabold leading-[1.15] text-navy lg:text-[1.875rem]" dir="auto">
                    {name}
                </H>
            </div>
            <dl className="m-0 mt-4 space-y-2 text-body-sm">
                {issuer ? (
                    <div>
                        <dt className="text-caption text-ink-subtle">{t('issuer')}</dt>
                        <dd className="font-medium">{issuer}</dd>
                    </div>
                ) : null}
            </dl>
            {href || requestHref ? (
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
                    {href ? (
                        <Button href={href} variant="text">
                            {t('view')}
                        </Button>
                    ) : null}
                    {requestHref ? (
                        <Button href={requestHref} variant="outline" icon={<DocumentIcon size={18} />}>
                            {t('request_copy')}
                            <span className="sr-only">{t('request_copy_for', { name })}</span>
                        </Button>
                    ) : null}
                </div>
            ) : null}
        </article>
    );
}
