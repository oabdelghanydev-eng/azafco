import type { ReactNode } from 'react';
import { Button, DocumentIcon, ExternalLink, Section, SectionHeading, cn, typography } from '@/components/ui';
import type { ImportGroupView } from './importRules';

/**
 * "Importing fresh fish into {country}" block for /markets/[slug] (ROUND1-SPEC §3, §6 R4).
 * Data: data/market-import.ts via marketImportView (components/v2/markets/importRules.ts);
 * sentences: markets_v2.import.*. Items that share a source are listed together under
 * one attribution lead-in (when the source needs one), followed by one link to that source
 * (new tab, visible text = the source description in the page language, then its year,
 * the document language and the source type). Without items it shows the two-line
 * fallback (guide link + "confirm with the authority").
 * Server component; every string arrives translated from the page.
 */
export interface MarketImportRulesProps {
    headingId: string;
    eyebrow: string;
    title: string;
    intro?: string;
    authority?: { label: string; name: string; url: string };
    groups: ImportGroupView[];
    sourceLabel: string;
    newTabLabel: string;
    /** "Last reviewed: 14 November 2026" (may contain a <time>) */
    reviewed: ReactNode;
    disclaimer: string;
    guide: { href: string; label: string };
    /** Shown instead of the list when `groups` is empty */
    fallback: { guide: string; confirm: string };
}

export default function MarketImportRules({
    headingId,
    eyebrow,
    title,
    intro,
    authority,
    groups,
    sourceLabel,
    newTabLabel,
    reviewed,
    disclaimer,
    guide,
    fallback,
}: MarketImportRulesProps) {
    const guideLink = (
        <Button href={guide.href} variant="text" icon={<DocumentIcon />}>
            {guide.label}
        </Button>
    );

    return (
        <Section variant="white" labelledBy={headingId}>
            <SectionHeading id={headingId} eyebrow={eyebrow} title={title} intro={groups.length ? intro : undefined} />

            {groups.length ? (
                <>
                    {authority ? (
                        <p className={cn('m-0 mb-6 flex flex-wrap items-center gap-x-3 text-fg', typography.body)}>
                            <span className="font-semibold">{authority.label}</span>
                            <ExternalLink href={authority.url} newTabLabel={newTabLabel}>
                                <bdi>{authority.name}</bdi>
                            </ExternalLink>
                        </p>
                    ) : null}

                    <div className="divide-y divide-rule border-y border-rule">
                        {groups.map((g) => (
                            <div key={g.source.id} className="py-6">
                                {g.source.leadIn ? <p className={cn('m-0 mb-2 font-semibold text-fg', typography.body)}>{g.source.leadIn}</p> : null}
                                {g.caveats.map((c) => (
                                    <p key={c.id} className={cn('m-0 mb-2 text-fg', typography.body)}>
                                        {c.text}
                                    </p>
                                ))}
                                <ul className={cn('m-0 grid list-disc gap-2 ps-5 text-fg', typography.body)}>
                                    {g.items.map((item) => (
                                        <li key={item.id}>{item.text}</li>
                                    ))}
                                </ul>
                                <p className={cn('m-0 mt-3 flex flex-wrap items-center gap-x-2 text-fg-muted', typography.small)}>
                                    <span>{sourceLabel}</span>
                                    <ExternalLink href={g.source.url} newTabLabel={newTabLabel}>
                                        <bdi>{g.source.title}</bdi>
                                        {g.source.year ? <> ({g.source.year})</> : null}
                                    </ExternalLink>
                                    {g.source.notes.length ? <span>{g.source.notes.join(' · ')}</span> : null}
                                </p>
                            </div>
                        ))}
                    </div>

                    <p className={cn('m-0 mt-6 text-fg-muted', typography.small)}>{reviewed}</p>
                    <p className={cn('m-0 mt-2 text-fg-muted', typography.small)}>{disclaimer}</p>
                    <div className="mt-6">{guideLink}</div>
                </>
            ) : (
                <>
                    <p className={cn('m-0 text-fg', typography.body)}>{fallback.guide}</p>
                    <div className="mt-2">{guideLink}</div>
                    <p className={cn('m-0 mt-4 text-fg', typography.body)}>{fallback.confirm}</p>
                </>
            )}
        </Section>
    );
}
