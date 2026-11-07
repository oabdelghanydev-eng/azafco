import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { companyConfig } from '@/config/company.config';
import { mainNav } from '@/lib/v2/nav';
import { routes } from '@/lib/v2/routes';
import { Container } from './Layout';
import Logo from './Logo';
import GeoArcs from './GeoArcs';
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from './icons';

/**
 * Global footer: corporate identity, nav groups, export-team contact, legal.
 * All contact/legal data comes from config/company.config.ts and the existing
 * `data.company` translations (no new numbers).
 */
export default function SiteFooter() {
    const t = useTranslations('v2');
    const tc = useTranslations('data.company');
    const c = companyConfig.contact;
    const year = new Date().getFullYear();
    const groups = mainNav.filter((g) => g.children);
    const singles = mainNav.filter((g) => !g.children);

    return (
        <footer data-surface="dark" className="relative isolate overflow-hidden bg-navy-950 text-fg">
            <GeoArcs tone="onDark" swoosh={false} className="absolute -top-56 end-[-10rem] -z-10 w-[640px] opacity-60" />
            <Container className="pt-16 pb-28 md:pb-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Identity */}
                    <div className="lg:col-span-4">
                        <Link href={routes.home} aria-label={t('nav.home_link_label')} className="inline-block">
                            <Logo kind="reversed" width={144} alt="" />
                        </Link>
                        <p className="mt-6 font-display text-heading-md text-fg">{t('footer.tagline')}</p>
                        <p className="mt-3 max-w-sm text-body-sm text-fg-muted">{t('footer.description')}</p>
                    </div>

                    {/* Navigation groups */}
                    <nav aria-label={t('nav.footer_label')} className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
                        {groups.map((g) => (
                            <div key={g.labelKey}>
                                <h2 className="text-overline uppercase text-eyebrow">{t(`nav.${g.labelKey}`)}</h2>
                                <ul className="mt-4 space-y-1">
                                    {g.children!.map((l) => (
                                        <li key={l.href}>
                                            <FooterLink href={l.href}>{t(`nav.${l.labelKey}`)}</FooterLink>
                                        </li>
                                    ))}
                                    {g.labelKey === 'company'
                                        ? singles.map((s) => (
                                              <li key={s.href}>
                                                  <FooterLink href={s.href!}>{t(`nav.${s.labelKey}`)}</FooterLink>
                                              </li>
                                          ))
                                        : null}
                                    {g.labelKey === 'company' ? (
                                        <li>
                                            <FooterLink href={routes.contact}>{t('nav.contact')}</FooterLink>
                                        </li>
                                    ) : null}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    {/* Contact */}
                    <div className="lg:col-span-3">
                        <h2 className="text-overline uppercase text-eyebrow">{t('footer.contact_heading')}</h2>
                        <ul className="mt-4 space-y-1 text-body-sm">
                            <li>
                                <a href={`tel:${c.phone}`} className="flex min-h-[40px] items-center gap-3 text-fg hover:underline" data-cta="footer_phone">
                                    <PhoneIcon size={18} className="shrink-0 text-gold" />
                                    <span className="sr-only">{t('cta.call')}: </span>
                                    <span dir="ltr">{c.phoneDisplay}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={c.social.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-h-[40px] items-center gap-3 text-fg hover:underline"
                                    data-cta="footer_whatsapp"
                                >
                                    <WhatsAppIcon size={18} className="shrink-0 text-gold" />
                                    <span>{t('cta.whatsapp')}</span>
                                    <span className="sr-only">{t('cta.opens_new_tab')}</span>
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${c.email}`} className="flex min-h-[40px] items-center gap-3 text-fg hover:underline" data-cta="footer_email">
                                    <MailIcon size={18} className="shrink-0 text-gold" />
                                    <span className="sr-only">{t('cta.email')}: </span>
                                    <span dir="ltr">{c.email}</span>
                                </a>
                            </li>
                            <li className="flex items-start gap-3 pt-2 text-fg-muted">
                                <MapPinIcon size={18} className="mt-1 shrink-0 text-gold" />
                                <span>
                                    <span className="block font-medium text-fg">{t('footer.factory')}</span>
                                    {tc('addresses.factory.address')}
                                </span>
                            </li>
                            <li className="pt-2 text-fg-muted">
                                <span className="block font-medium text-fg">{t('footer.hours')}</span>
                                {tc('workingHours')}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Legal */}
                <div className="mt-14 flex flex-col gap-4 border-t border-rule pt-6 text-caption text-fg-muted md:flex-row md:items-center md:justify-between">
                    <p>
                        © {year} <span dir="ltr">{companyConfig.identity.legalName}</span>. {t('footer.rights')}
                        <span className="mx-2" aria-hidden="true">
                            ·
                        </span>
                        {t('footer.commercial_register')}: <span dir="ltr">{companyConfig.registration.commercialRegister}</span>
                    </p>
                    <ul className="flex flex-wrap gap-x-6">
                        <li>
                            <FooterLink href={routes.privacy}>{t('footer.privacy')}</FooterLink>
                        </li>
                    </ul>
                </div>
            </Container>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="inline-flex min-h-[36px] items-center text-body-sm text-fg-muted transition-colors duration-fast hover:text-fg hover:underline">
            {children}
        </Link>
    );
}
