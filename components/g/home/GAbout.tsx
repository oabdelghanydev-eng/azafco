import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Eyebrow, Section, TextLink, cn, typography } from '@/components/ui';
import { routes } from '@/lib/v2/routes';

/** Design G: "Who we are" section (#about). Photo with the gold offset block, copy on the end side from lg. */
export default function GAbout() {
    const t = useTranslations('g_about_v2');

    return (
        <Section id="about" variant="white" labelledBy="g-about-title" className="g-font text-body">
            <div className="md:mx-auto md:max-w-[600px] lg:grid lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-x-20">
                <div className="relative min-w-0 pb-4 ps-4 lg:pb-7 lg:ps-7">
                    <span aria-hidden="true" className="absolute bottom-0 start-0 h-[52%] w-[46%] rounded-card bg-gold" />
                    <Image
                        src="/images/g/farm-ponds.webp"
                        alt={t('imageAlt')}
                        width={1536}
                        height={1024}
                        sizes="(min-width: 1320px) 590px, (min-width: 1024px) 45vw, (min-width: 768px) 544px, calc(100vw - 56px)"
                        className="relative block aspect-[3/2] h-auto w-full rounded-card object-cover"
                    />
                </div>

                <div className="mt-9 min-w-0 lg:mt-0">
                    <Eyebrow className="mb-2.5 lg:mb-3.5">{t('eyebrow')}</Eyebrow>
                    <h2 id="g-about-title" className={cn('v2-heading m-0', typography.h2)}>
                        {t('title')}
                    </h2>
                    <p className="mb-0 mt-4 text-fg-muted lg:mt-6">{t('p1')}</p>
                    <p className="mb-0 mt-3.5 text-fg-muted lg:mt-4">{t('p2')}</p>
                    <TextLink href={routes.about} className="mt-4 lg:mt-7" dataAttrs={{ 'data-cta': 'home_about_page' }}>
                        {t('pageLink')}
                    </TextLink>
                </div>
            </div>
        </Section>
    );
}
