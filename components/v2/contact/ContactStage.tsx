/**
 * The two contact channels on /contact (owner's pick "A", 25 Nov 2026): WhatsApp
 * to management and email to the export team, side by side on one navy panel
 * cut by the diagonal gold stripe (the same cut as the phone header and the
 * /products stage). On phones the two are separate cards, each with its own cut.
 *
 * The phone number appears once: "Call" is a second button beside WhatsApp,
 * because it is the same number. Server component; copy comes in as props.
 */
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
import { cn, typography } from '@/components/ui/tokens';

export interface ContactStageProps {
    rtl: boolean;
    newTab: string;
    whatsapp: { title: string; role: string; number: string; href: string; action: string; actionShort: string };
    call: { label: string; href: string };
    email: { title: string; role: string; address: string; href: string; action: string };
}

/** Diagonal cut between two x positions (in % from the start edge in RTL), mirrored in LTR. */
function cut(rtl: boolean, top: [number, number], bottom: [number, number]): CSSProperties {
    const x = (v: number) => `${rtl ? v : 100 - v}%`;
    return { clipPath: `polygon(${x(top[0])} 0, ${x(top[1])} 0, ${x(bottom[1])} 100%, ${x(bottom[0])} 100%)` };
}

const NUM = 'pointer-events-none absolute end-3.5 top-2.5 font-display text-[72px] font-extrabold leading-none tracking-tighter text-transparent lg:top-4 lg:text-[150px]';
const NUM_STROKE: CSSProperties = { WebkitTextStroke: '1.6px rgba(247,181,0,.75)' };

function Channel({
    rtl,
    num,
    dark,
    className,
    numClass,
    title,
    role,
    value,
    valueClass,
    children,
}: {
    rtl: boolean;
    num: string;
    dark?: boolean;
    /** Desktop padding of this half (the half next to the cut keeps clear of the stripe) */
    className: string;
    /** Desktop inline-end offset of the outlined number */
    numClass: string;
    title: string;
    role: string;
    value: string;
    valueClass: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                'relative mb-2.5 overflow-hidden rounded-[8px] px-5 pb-[22px] pt-5 lg:mb-0 lg:flex lg:flex-col lg:justify-center lg:overflow-visible lg:rounded-none lg:bg-transparent lg:py-10',
                dark ? 'bg-[#072452]' : 'bg-[#0B2F6B]',
                className,
            )}
        >
            {/* phone cut: one per card, in the top band only, so it never runs behind the number or the buttons */}
            <span aria-hidden="true" className={cn('absolute inset-x-0 top-0 h-[98px] lg:hidden', dark ? 'bg-[#0B2F6B]' : 'bg-[#072452]')} style={cut(rtl, [0, 36], [0, 24])} />
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[98px] bg-gold lg:hidden" style={cut(rtl, [36, 38.2], [24, 26.2])} />
            <span aria-hidden="true" className={cn(NUM, numClass)} style={NUM_STROKE}>
                {num}
            </span>

            <div className="relative">
                {/* On phones the heading keeps clear of the band's cut and number (36% of the card) */}
                <div className="min-h-[58px] pe-[40%] lg:min-h-0 lg:pe-0">
                    <h2 className={cn('m-0 text-white', typography.h3Lg)}>{title}</h2>
                    <p className={cn('m-0 mt-0.5 font-semibold text-gold', typography.small)}>{role}</p>
                </div>
                <p className={cn('m-0 mt-3.5 font-display font-extrabold leading-tight text-white lg:mt-5', valueClass)}>
                    <bdi dir="ltr" className="whitespace-nowrap">
                        {value}
                    </bdi>
                </p>
                <div className="mt-4 flex flex-wrap gap-2 lg:mt-6 lg:gap-2.5">{children}</div>
            </div>
        </div>
    );
}

export default function ContactStage({ rtl, newTab, whatsapp, call, email }: ContactStageProps) {
    return (
        <div className="relative lg:grid lg:min-h-[410px] lg:grid-cols-2 lg:overflow-hidden lg:rounded-[8px] lg:bg-[#0B2F6B]">
            {/* desktop cut: one across the panel */}
            <span aria-hidden="true" className="absolute inset-0 hidden bg-[#072452] lg:block" style={cut(rtl, [0, 53], [0, 43])} />
            <span aria-hidden="true" className="absolute inset-0 hidden bg-gold lg:block" style={cut(rtl, [53, 54], [43, 44])} />

            <Channel
                rtl={rtl}
                num="01"
                className="lg:px-14"
                numClass="lg:end-[88px]"
                title={whatsapp.title}
                role={whatsapp.role}
                value={whatsapp.number}
                valueClass="text-[clamp(26px,8.4vw,33px)] lg:text-[44px] xl:text-[60px]"
            >
                <Button
                    href={whatsapp.href}
                    external
                    newTabLabel={newTab}
                    icon={<WhatsAppIcon size={20} />}
                    className="flex-1 lg:flex-none"
                    dataAttrs={{ 'data-cta': 'contact_whatsapp' }}
                >
                    <span className="lg:hidden">{whatsapp.actionShort}</span>
                    <span className="hidden lg:inline">{whatsapp.action}</span>
                </Button>
                <Button href={call.href} external variant="outline" icon={<PhoneIcon size={20} />} dataAttrs={{ 'data-cta': 'contact_phone' }}>
                    {call.label}
                </Button>
            </Channel>

            <Channel
                rtl={rtl}
                num="02"
                dark
                className="lg:pe-14 lg:ps-[120px]"
                numClass="lg:end-11"
                title={email.title}
                role={email.role}
                value={email.address}
                valueClass="text-[clamp(18px,5.9vw,23px)] lg:text-[28px] xl:text-[38px]"
            >
                <Button
                    href={email.href}
                    external
                    variant="outline"
                    icon={<MailIcon size={20} />}
                    className="flex-1 lg:flex-none"
                    dataAttrs={{ 'data-cta': 'contact_email' }}
                >
                    {email.action}
                </Button>
            </Channel>
        </div>
    );
}
