import { getTranslations } from 'next-intl/server';
import { Section, SectionHeading, TextLink, cardClass, cn, typography } from '@/components/ui';
import { routes } from '@/lib/v2/routes';

/**
 * Quality section of design G (boards: Group*.dc.html, section#quality):
 * two cards, the generic ISO line and the market documents (inspection lives in GChain stage 4). ISO line (owner, 14 Nov:
 * "ISO certificates, certified by TÜV AUSTRIA", no standard names here; they
 * appear only in the /quality FAQ and the Organization JSON-LD). Nothing here
 * may read as a certificate for the fish itself.
 */
const CARDS = ['iso', 'documents'] as const;

export default async function GQuality() {
    const t = await getTranslations('g_quality_v2');

    return (
        <Section id="quality" variant="white" labelledBy="g-quality-title" className="g-font text-body">
            <SectionHeading id="g-quality-title" layout="split" eyebrow={t('eyebrow')} title={t('title')} />

            <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2 md:gap-4 lg:gap-5">
                {CARDS.map((key) => (
                    <li key={key} className={cardClass({ accent: true, className: 'px-5 pb-5 pt-[18px] text-start lg:px-7 lg:pb-7 lg:pt-7' })}>
                        <h3 className={cn('m-0 text-navy', typography.h3Lg)}>{t(`cards.${key}.title`)}</h3>
                        <p className="mb-0 mt-2 text-fg-muted lg:mt-2.5">{t(`cards.${key}.text`)}</p>
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
