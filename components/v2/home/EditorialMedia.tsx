import type { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import type { ImageProps } from '@/lib/v2/media';
import { ArrowIcon, Eyebrow } from '@/components/v2';

export interface EditorialLink {
    label: string;
    href: string;
}

export interface EditorialMediaProps {
    /** Heading id (pair with <Section labelledBy>) */
    id: string;
    title: ReactNode;
    eyebrow?: ReactNode;
    /** Paragraphs */
    body?: string[];
    /** Omit when no professional photo exists: text-only editorial layout */
    image?: ImageProps;
    /** Which side the photo sits on (logical: flips in RTL) */
    imageSide?: 'start' | 'end';
    /** Photo crop on large screens */
    aspect?: '4/3' | '4/5' | '16/9';
    imagePosition?: string;
    /** Bordered link list under the text (min 44px rows) */
    links?: EditorialLink[];
    /** Buttons / extra blocks under the text */
    children?: ReactNode;
    className?: string;
}

const aspectClass = {
    '4/3': 'aspect-[4/3]',
    '4/5': 'aspect-[4/3] lg:aspect-[4/5]',
    '16/9': 'aspect-[4/3] sm:aspect-[16/9]',
};

/**
 * Editorial text + real photo split, used inside a <Section>. Surface-aware.
 * Mobile: photo first, then text. Desktop: 12-col split, 6/6 (photo side configurable).
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
    children,
    className,
}: EditorialMediaProps) {
    if (!image) {
        // Text-only: heading block on the start side, copy + links on the end side.
        return (
            <div className={cn('grid grid-cols-4 gap-x-4 gap-y-8 sm:grid-cols-8 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8', className)}>
                <div className="col-span-4 sm:col-span-8 lg:col-span-5">
                    {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
                    <h2 id={id} className="v2-heading font-display text-display-lg">
                        {title}
                    </h2>
                    <span aria-hidden="true" className="mt-8 hidden h-1 w-16 rounded-full bg-gold lg:block" />
                </div>
                <div className="col-span-4 sm:col-span-8 lg:col-span-6 lg:col-start-7">
                    {body?.map((p, i) => (
                        <p key={i} className={cn('max-w-prose-v2 text-fg-muted', i === 0 ? 'text-body-lg' : 'mt-4 text-body')}>
                            {p}
                        </p>
                    ))}
                    {links?.length ? <EditorialLinks links={links} /> : null}
                    {children ? <div className="mt-8">{children}</div> : null}
                </div>
            </div>
        );
    }
    return (
        <div className={cn('grid grid-cols-4 items-center gap-x-4 gap-y-10 sm:grid-cols-8 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8', className)}>
            <div
                className={cn(
                    'col-span-4 sm:col-span-8 lg:col-span-6',
                    imageSide === 'start' ? 'lg:order-1' : 'lg:order-2',
                )}
            >
                <div className={cn('relative overflow-hidden rounded-card bg-surface-mist', aspectClass[aspect])}>
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                        className={image.cutout ? 'object-contain p-[2%] drop-shadow-[0_10px_14px_rgba(0,45,114,0.14)]' : 'object-cover'}
                        style={{ objectPosition: imagePosition }}
                    />
                </div>
            </div>
            <div
                className={cn(
                    'col-span-4 sm:col-span-8 lg:col-span-5',
                    imageSide === 'start' ? 'lg:order-2 lg:col-start-8' : 'lg:order-1',
                )}
            >
                {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
                <h2 id={id} className="v2-heading font-display text-display-lg">
                    {title}
                </h2>
                {body?.map((p, i) => (
                    <p key={i} className={cn('max-w-prose-v2 text-fg-muted', i === 0 ? 'mt-5 text-body-lg' : 'mt-4 text-body')}>
                        {p}
                    </p>
                ))}
                {links?.length ? <EditorialLinks links={links} /> : null}
                {children ? <div className="mt-8">{children}</div> : null}
            </div>
        </div>
    );
}

function EditorialLinks({ links }: { links: EditorialLink[] }) {
    return (
        <ul className="mt-8 border-t border-rule">
            {links.map((l) => (
                <li key={l.href} className="border-b border-rule">
                    <Link
                        href={l.href}
                        className="group flex min-h-[52px] items-center justify-between gap-4 py-3 font-semibold text-fg hover:underline hover:decoration-gold hover:decoration-2 hover:underline-offset-[6px]"
                    >
                        <span>{l.label}</span>
                        <ArrowIcon
                            size={18}
                            className="shrink-0 text-eyebrow transition-transform duration-base group-hover:translate-x-1 motion-reduce:transition-none rtl:group-hover:-translate-x-1"
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
