import { useTranslations } from 'next-intl';
import { cn, typography } from '@/components/ui/tokens';
import { phoneDisplay } from '@/components/ui/format';
import { companyConfig } from '@/config/company.config';

/**
 * Three short notes next to the requirements panel (owner, 25 Nov 2026: the
 * page read as machine-written, so the steps, the checklist and the long
 * notices are gone): what to tell us, the office hours /contact shows (no
 * reply-time promise) and the one-line official-channels notice.
 */
export default function RfqAside({ className }: { className?: string }) {
    const t = useTranslations('rfq_v2.aside');
    const tc = useTranslations('data.company');
    const line = cn('m-0 text-ink-muted', typography.small);

    return (
        <aside className={cn('flex flex-col gap-4 text-ink', className)}>
            <p className={cn('m-0 font-semibold text-ink', typography.body)}>{t('need')}</p>
            <p className={line}>{t('hours', { hours: tc('workingHours') })}</p>
            {/* The number stays on one line and reads left to right inside Arabic text (LRI … PDI, no-break spaces) */}
            <p className={line}>{t('official', { phone: `⁦${phoneDisplay(companyConfig.contact.whatsappNumber).replace(/ /g, ' ')}⁩` })}</p>
        </aside>
    );
}
