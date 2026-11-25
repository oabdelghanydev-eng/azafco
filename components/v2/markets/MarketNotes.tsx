import Image from 'next/image';
import { Link } from '@/navigation';
import { ArrowIcon, Badge, TextLink, cardClass, cn, typography } from '@/components/ui';
import { routes } from '@/lib/v2/routes';
import { flagSrc } from './marketData';

/**
 * Market-by-market cards for /markets: flag, name, the market note and the buyer
 * types we supply there (carried over from the live site, without the superlatives;
 * the start year is in the markets band above). The whole card is one link to the market page (stretched link,
 * accessible name = the country). The last tile invites planned / unlisted markets.
 * Server component; every string arrives translated.
 */
export interface MarketNote {
    key: string;
    countryCode: string;
    name: string;
    note?: string;
    buyers: string[];
}

export interface MarketNotesProps {
    items: MarketNote[];
    detailsLabel: string;
    newMarket?: { title: string; text: string; action: string; href: string };
    className?: string;
}

export default function MarketNotes({ items, detailsLabel, newMarket, className }: MarketNotesProps) {
    return (
        <ul className={cn('m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6', className)}>
            {items.map((m) => (
                <li
                    key={m.key}
                    className={cardClass({
                        accent: true,
                        interactive: true,
                        className:
                            'group relative flex flex-col px-5 pb-5 pt-5 lg:px-7 lg:pb-7 lg:pt-6 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus',
                    })}
                >
                    <div className="flex items-center gap-3">
                        <span aria-hidden="true" className="relative h-10 w-10 flex-none overflow-hidden rounded-full bg-white ring-1 ring-line">
                            <Image src={flagSrc(m.countryCode)} alt="" aria-hidden="true" fill sizes="40px" className="object-cover" />
                        </span>
                        <h3 className={cn('m-0 min-w-0 flex-1 text-ink', typography.h3)}>
                            <Link
                                href={`${routes.markets}/${m.key}`}
                                className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                            >
                                {m.name}
                            </Link>
                        </h3>
                    </div>
                    {m.note ? <p className={cn('m-0 mt-3 text-ink-muted', typography.body)}>{m.note}</p> : null}
                    {m.buyers.length ? (
                        <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                            {m.buyers.map((b) => (
                                <li key={b}>
                                    <Badge tone="outline">{b}</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                    <span
                        aria-hidden="true"
                        className="v2-btn mt-auto inline-flex items-center gap-2.5 pt-5 text-body text-link group-hover:text-link-hover group-hover:underline group-hover:underline-offset-4"
                    >
                        {detailsLabel}
                        <ArrowIcon
                            size={20}
                            className="transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
                        />
                    </span>
                </li>
            ))}
            {newMarket ? (
                <li className="flex flex-col rounded-card bg-tint-strong p-5 lg:p-7">
                    <h3 className={cn('m-0 text-ink', typography.h3)}>{newMarket.title}</h3>
                    <p className={cn('m-0 mt-2 text-ink-muted', typography.body)}>{newMarket.text}</p>
                    <div className="mt-auto pt-4">
                        <TextLink href={newMarket.href}>{newMarket.action}</TextLink>
                    </div>
                </li>
            ) : null}
        </ul>
    );
}
