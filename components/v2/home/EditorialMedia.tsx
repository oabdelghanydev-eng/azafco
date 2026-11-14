import type { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import type { ImageProps } from '@/lib/v2/media';
import { ArrowIcon, Eyebrow, cn, focusRing, typography } from '@/components/ui';
import HeadingPhoto from '@/components/v2/HeadingPhoto';

export interface EditorialLink {
    label: string;
    /** Locale-less route, optionally with an #anchor */
    href: string;
}

export interface EditorialMediaProps {
    /** Heading id (pair with <Section labelledBy>) */
    id: string;
    title: ReactNode;
    eyebrow?: ReactNode;
    /** Paragraphs */
    body?: string[];
    /** Omit when no photo exists: text-only editorial layout */
    image?: ImageProps;
    /** Which side the photo sits on (logical: flips in RTL) */
    imageSide?: 'start' | 'end';
    /** Photo crop on large screens */
    aspect?: '4/3' | '4/5' | '16/9';
    imagePosition?: string;
    /** Bordered link list under the text (52px rows) */
    links?: EditorialLink[];
    /** Text-only layout: small photo (media id) under the heading, desktop only */
    headingPhoto?: string;
    headingPhotoPosition?: string;
    /** Buttons / extra blocks under the text */
    children?: ReactNode;
    className?: string;
}

const aspectClass = {
    '4/3': 'aspect-[4/3]',
    '4/5': 'aspect-[4/3] lg:aspect-[4/5]',
    '16/9': 'aspect-[4/3] sm:aspect-[16/9]',
};

const grid = 'grid grid-cols-4 gap-x-4 sm:grid-cols-8 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8';

/**
 * Editorial text + real photo split (design G), used inside a <Section>. Surface-aware.
 * Phones and tablets: photo first, then text. From lg: 12-column split, photo 6 / text 5
 * (photo side configurable, logical so it flips in RTL).
 */
export default function EditorialMedia({
    id,
    title,
    eyebrow,
    body,
    image,
    imageSide = 'end',
    aspect = '4/3',
    imagePosition = 'center',
    links,
    headingPhoto,
    headingPhotoPosition,
    children,
    className,
}: EditorialMediaProps) {
    const heading = (
        <>
            {eyebrow ? <Eyebrow className="mb-3 lg:mb-4">{eyebrow}</Eyebrow> : null}
            <h2 id={id} className={cn('v2-heading m-0', typography.h2)}>
                {title}
            </h2>
        </>
    );
    const copy = (
        <>
            {body?.map((p, i) => (
                <p key={i} className={cn('max-w-prose-v2 text-fg-muted', i === 0 ? typography.lead : cn('mt-4', typography.body))}>
                    {p}
                </p>
            ))}
            {links?.length ? <EditorialLinks links={links} /> : null}
            {children ? <div className="mt-8">{children}</div> : null}
        </>
    );

    if (!image) {
        // Text-only: heading block on the start side, copy + links on the end side.
        return (
            <div className={cn(grid, 'gap-y-8', className)}>
                <div className="col-span-4 sm:col-span-8 lg:col-span-5">
                    {heading}
                    {headingPhoto ? <HeadingPhoto id={headingPhoto} position={headingPhotoPosition} /> : null}
                </div>
                <div className="col-span-4 sm:col-span-8 lg:col-span-6 lg:col-start-7">{copy}</div>
            </div>
        );
    }

    return (
        <div className={cn(grid, 'items-center gap-y-10', className)}>
            <div className={cn('col-span-4 sm:col-span-8 lg:col-span-6', imageSide === 'start' ? 'lg:order-1' : 'lg:order-2 lg:col-start-7')}>
                <div className={cn('relative overflow-hidden rounded-card bg-surface-mist', aspectClass[aspect])}>
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1320px) 610px, (min-width: 1024px) 46vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: imagePosition }}
                    />
                </div>
            </div>
            <div className={cn('col-span-4 sm:col-span-8 lg:col-span-5', imageSide === 'start' ? 'lg:order-2 lg:col-start-8' : 'lg:order-1')}>
                {heading}
                {body?.length ? <div className="mt-5">{copy}</div> : copy}
            </div>
        </div>
    );
}

function EditorialLinks({ links }: { links: EditorialLink[] }) {
    return (
        <ul className="m-0 mt-8 list-none border-0 border-t border-solid border-rule p-0">
            {links.map((l) => (
                <li key={l.href} className="border-0 border-b border-solid border-rule">
                    <Link
                        href={l.href}
                        className={cn(
                            'v2-btn group flex min-h-[52px] items-center justify-between gap-4 py-3 text-body text-link transition-colors duration-base hover:text-link-hover hover:underline hover:underline-offset-4 motion-reduce:transition-none',
                            focusRing,
                        )}
                    >
                        <span>{l.label}</span>
                        <ArrowIcon
                            size={20}
                            className="shrink-0 text-eyebrow transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
