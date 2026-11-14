import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Section, cn, typography } from '@/components/ui';

/**
 * Value chain section of design G (boards: Group*.dc.html, section#chain).
 * Phone/tablet (<lg): vertical list, 80px round photos, connecting line on the start side.
 * Desktop (>=lg): five centred columns, 168px round photos.
 */
const STAGES = [
    { key: 'farming', src: '/images/g/farm-ponds.webp' },
    { key: 'harvest', src: '/images/g/harvest.webp' },
    { key: 'packing', src: '/images/g/sorting-packing.webp' },
    { key: 'inspection', src: '/images/g/temperature-check.webp' },
    { key: 'export', src: '/images/g/logistics-truck.webp' },
] as const;

export default async function GChain() {
    const t = await getTranslations('g_chain_v2');

    return (
        <Section id="chain" variant="offwhite" labelledBy="g-chain-title" className="g-font text-body">
            <div className="mb-8 text-start lg:mx-auto lg:mb-16 lg:max-w-[740px] lg:text-center">
                <Eyebrow className="mb-2.5 lg:mb-3.5 lg:justify-center">{t('eyebrow')}</Eyebrow>
                <h2 id="g-chain-title" className={cn('v2-heading m-0', typography.h2)}>
                    {t('title')}
                </h2>
                <p className="mb-0 mt-4 text-fg-muted lg:mt-5">{t('intro')}</p>
            </div>

            <ol className="relative m-0 list-none p-0 lg:grid lg:grid-cols-5 lg:gap-x-3 lg:gap-y-10 xl:gap-x-5">
                {/* connecting line, phone/tablet only: centred on the 88px photo column */}
                <span aria-hidden="true" className="absolute bottom-11 start-[43px] top-11 w-0.5 bg-line-track lg:hidden" />
                {STAGES.map((s, i) => (
                    <li key={s.key} className="relative flex items-center gap-[18px] pb-6 last:pb-0 lg:block lg:pb-0 lg:text-center">
                        <Image
                            src={s.src}
                            alt=""
                            aria-hidden="true"
                            width={168}
                            height={168}
                            sizes="(min-width: 1024px) 168px, 80px"
                            className="box-content h-20 w-20 flex-none rounded-full border-4 border-solid border-white object-cover ring-2 ring-navy lg:mx-auto lg:block lg:h-[168px] lg:w-[168px] lg:max-w-none lg:border-[6px]"
                        />
                        <div className="min-w-0">
                            <p className={cn('m-0 text-eyebrow lg:mb-1 lg:mt-5', typography.overline)}>{t('stageLabel', { n: i + 1 })}</p>
                            <h3 className={cn('v2-heading m-0 lg:mb-1.5', typography.h3)}>{t(`stages.${s.key}.title`)}</h3>
                            <p className={cn('m-0 text-fg-muted lg:mx-auto lg:max-w-[220px]', typography.small)}>{t(`stages.${s.key}.text`)}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </Section>
    );
}
