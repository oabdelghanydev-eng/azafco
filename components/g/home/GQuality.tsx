import { getTranslations } from 'next-intl/server';
import { Section, SectionHeading, TextLink, cardClass, cn, typography } from '@/components/ui';
import { routes } from '@/lib/v2/routes';

/**
 * Quality section of design G (boards: Group*.dc.html, section#quality):
 * the three ISO standards, certified by TÜV AUSTRIA (named once, in the intro).
 * Release decision 14 Nov: standard names only. No certificate numbers, dates,
 * site or scope, and no "copies on request" link.
 */
const CERTS = ['iso9001', 'iso14001', 'iso45001'] as const;

export default async function GQuality() {
    const t = await getTranslations('g_quality_v2');

    return (
        <Section id="quality" variant="white" labelledBy="g-quality-title" className="g-font text-body">
            <SectionHeading id="g-quality-title" layout="split" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />

            <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3 md:gap-4 lg:gap-5">
                {CERTS.map((key) => (
                    <li key={key} className={cardClass({ accent: true, className: 'px-5 pb-5 pt-[18px] text-start lg:px-7 lg:pb-7 lg:pt-7' })}>
                        <p className={cn('m-0 text-navy', typography.h2Sm)}>
                            <span dir="ltr">{t(`certs.${key}.code`)}</span>
                        </p>
                        <p className={cn('mb-0 mt-2 lg:mt-2.5', typography.h4)}>{t(`certs.${key}.name`)}</p>
                    </li>
                ))}
            </ul>

            {/* Next step for QA buyers: same text link as GAbout's "How we work" */}
            <TextLink href={routes.quality} className="mt-5 lg:mt-8" dataAttrs={{ 'data-cta': 'home_quality' }}>
                {t('link')}
            </TextLink>
        </Section>
    );
}
