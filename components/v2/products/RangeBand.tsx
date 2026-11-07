/**
 * "Our species range": the real species cut-outs lined up on navy, all at the
 * same scale and side-on (heads face the reading direction: mirrored in RTL).
 * Each fish links to its species page. No ice, props or styling: cut-outs only.
 */
import type { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Section, SectionHeader } from '@/components/v2';
import type { ImageProps } from '@/lib/v2/media';

export interface RangeBandItem {
    slug: string;
    name: string;
    href: string;
    image?: ImageProps;
}

export interface RangeBandProps {
    id: string;
    eyebrow?: string;
    title: string;
    intro?: string;
    action?: ReactNode;
    items: RangeBandItem[];
    /** Accessible name of the list */
    listLabel: string;
}

export default function RangeBand({ id, eyebrow, title, intro, action, items, listLabel }: RangeBandProps) {
    const withImage = items.filter((i) => i.image?.cutout);
    if (withImage.length === 0) return null;
    return (
        <Section variant="navy" spacing="md" labelledBy={id}>
            <SectionHeader id={id} eyebrow={eyebrow} title={title} intro={intro} action={action} size="md" />
            <ul aria-label={listLabel} className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
                {withImage.map((it) => (
                    <li key={it.slug}>
                        <Link
                            href={it.href}
                            className="group flex h-full flex-col items-center rounded-card px-2 pb-3 pt-1 text-center transition-colors duration-fast hover:bg-white/5 motion-reduce:transition-none"
                        >
                            <span className="relative block aspect-[16/9] w-full">
                                {/* soft light under each fish so dark species stay legible on navy */}
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-[4%] inset-y-[8%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.22),rgba(255,255,255,0))]"
                                />
                                <Image
                                    src={it.image!.src}
                                    alt=""
                                    aria-hidden="true"
                                    fill
                                    sizes="(min-width: 1024px) 200px, (min-width: 768px) 24vw, (min-width: 640px) 31vw, 46vw"
                                    className="object-cover drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)] rtl:-scale-x-100"
                                />
                            </span>
                            <span className="mt-1 inline-flex min-h-[44px] items-center text-body-sm font-semibold text-fg underline-offset-4 group-hover:underline group-focus-visible:underline">
                                {it.name}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
