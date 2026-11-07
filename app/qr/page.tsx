import { FaWhatsapp, FaEnvelope, FaGlobe, FaAddressCard, FaFish, FaCertificate, FaBuilding } from 'react-icons/fa';

const WHATSAPP = '201007736419';
const PHONE_DISPLAY = '+20 100 773 6419';
const EMAIL = 'business@azafco.com.eg';
const SITE = 'https://azafco.com.eg';

const primary = [
  { href: `https://wa.me/${WHATSAPP}`, icon: FaWhatsapp, en: 'WhatsApp', ar: 'واتساب', sub: PHONE_DISPLAY, external: true },
  { href: `mailto:${EMAIL}`, icon: FaEnvelope, en: 'Email', ar: 'البريد', sub: EMAIL },
  { href: SITE, icon: FaGlobe, en: 'Website', ar: 'الموقع', sub: 'azafco.com.eg' },
];

const pages = [
  { href: '/products', icon: FaFish, en: 'Products', ar: 'المنتجات' },
  { href: '/certificates', icon: FaCertificate, en: 'Certificates', ar: 'الشهادات' },
  { href: '/about', icon: FaBuilding, en: 'About us', ar: 'من نحن' },
];

export default function QrPage() {
  return (
    <main dir="ltr" className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-10">
      <header className="flex flex-col items-center text-center">
        <img src="/brand/azafco-logo-reversed.svg" alt="AZAFCO International" width={220} height={147} className="h-auto w-[220px]" />
        <div className="mt-5 h-[3px] w-12 rounded-full bg-[#F7B500]" />
      </header>

      <ul className="mt-8 space-y-3">
        {primary.map(({ href, icon: Icon, en, ar, sub, external }) => (
          <li key={en}>
            <a
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 text-[#002D72] shadow-lg shadow-black/10 transition active:scale-[0.98]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#002D72] text-[#F7B500]">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-bold">{en}</span>
                  <span className="text-base font-semibold" dir="rtl">{ar}</span>
                </span>
                <span className="block truncate text-sm text-slate-600" dir="ltr">{sub}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href="/azafco-contact.vcf"
        download
        className="mt-4 flex items-center justify-center gap-3 rounded-2xl bg-[#F7B500] px-4 py-4 text-lg font-bold text-[#002D72] transition active:scale-[0.98]"
      >
        <FaAddressCard className="h-6 w-6" aria-hidden />
        <span>Save contact</span>
        <span dir="rtl">حفظ جهة الاتصال</span>
      </a>

      <nav aria-label="Company pages" className="mt-8 grid grid-cols-3 gap-3">
        {pages.map(({ href, icon: Icon, en, ar }) => (
          <a
            key={en}
            href={href}
            className="flex flex-col items-center gap-1 rounded-2xl border border-white/20 px-2 py-4 text-center transition active:scale-[0.98]"
          >
            <Icon className="h-6 w-6 text-[#F7B500]" aria-hidden />
            <span className="text-sm font-semibold">{en}</span>
            <span className="text-sm text-white/80" dir="rtl">{ar}</span>
          </a>
        ))}
      </nav>

      <footer className="mt-auto pt-10 text-center text-xs text-white/60">© {new Date().getFullYear()} AZAFCO International</footer>
    </main>
  );
}
