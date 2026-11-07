import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { cn } from '@/lib/v2/cn';
import type { ImageProps } from '@/lib/v2/media';
import Button from './Button';
import Pending from './Pending';
import { DocumentIcon } from './icons';

export interface CertificateCardProps {
    /** e.g. "ISO 22000:2018" */
    name: string;
    /**
     * Must be true only when the owner has supplied the current certificate
     * (copy, issuer, scope, expiry) and approved public display. Otherwise the
     * card renders only a <Pending> chip (nothing in production).
     */
    verified: boolean;
    issuer?: string;
    scope?: string;
    /** ISO date (YYYY-MM-DD) */
    validUntil?: string;
    /** Link to a shareable copy or verification page */
    href?: string;
    image?: ImageProps;
    className?: string;
}

/** Proof card for a certificate / approval. Verified data only (brief: "badges verified only"). */
export default function CertificateCard({ name, verified, issuer, scope, validUntil, href, image, className }: CertificateCardProps) {
    const t = useTranslations('v2.certificate');
    const tp = useTranslations('v2.pending');
    const format = useFormatter();
    if (!verified) return <Pending label={tp('certificate_card', { name })} />;

    return (
        <article data-surface="light" className={cn('flex h-full flex-col rounded-card border border-line bg-white p-6 text-ink', className)}>
            <div className="flex items-start gap-4">
                {image ? (
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded border border-line bg-surface-offwhite">
                        <Image src={image.src} alt={image.alt} fill sizes="64px" className="object-cover" />
                    </div>
                ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-navy-50 text-navy">
                        <DocumentIcon size={24} />
                    </span>
                )}
                <h3 className="text-heading-md text-navy" dir="auto">
                    {name}
                </h3>
            </div>
            <dl className="mt-5 space-y-2 text-body-sm">
                {issuer ? (
                    <div>
                        <dt className="text-caption text-ink-subtle">{t('issuer')}</dt>
                        <dd className="font-medium">{issuer}</dd>
                    </div>
                ) : null}
                {scope ? (
                    <div>
                        <dt className="text-caption text-ink-subtle">{t('scope')}</dt>
                        <dd className="font-medium">{scope}</dd>
                    </div>
                ) : null}
                {validUntil ? (
                    <div>
                        <dt className="text-caption text-ink-subtle">{t('valid_until')}</dt>
                        <dd className="font-medium">
                            <time dateTime={validUntil}>{format.dateTime(new Date(validUntil), { dateStyle: 'medium' })}</time>
                        </dd>
                    </div>
                ) : null}
            </dl>
            {href ? (
                <div className="mt-auto pt-5">
                    <Button href={href} variant="text">
                        {t('view')}
                    </Button>
                </div>
            ) : null}
        </article>
    );
}
