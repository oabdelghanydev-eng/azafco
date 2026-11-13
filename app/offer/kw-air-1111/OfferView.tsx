'use client';

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

// General air-freight quotation, delivered Kuwait airport. Issued 11 Nov 2026, valid 15 days.
// Prices in KWD per carton, from the owner (11 Nov 2026). Per-kg = carton / carton weight, 3 decimals.
const REF = 'AZ-GEN-20261111-A';
// End of 26 Nov 2026, Kuwait time (UTC+3) = 26 Nov 2026 21:00 UTC.
const EXPIRES_AT_MS = Date.UTC(2026, 10, 26, 21, 0, 0);
const WHATSAPP = '201007736419';
const WHATSAPP_DISPLAY = '+20 100 773 6419';
const EMAIL = 'business@azafco.com.eg';
const LANG_KEY = 'azafco-offer-lang';

type Lang = 'en' | 'ar';

type Item = { en: string; ar: string; images: string[]; kg: number; tier1: number; tier2: number };

const ITEMS: Item[] = [
  { en: 'Tilapia', ar: 'بلطي', images: ['/items/tilapia.jpg'], kg: 20, tier1: 16.18, tier2: 15.84 },
  { en: 'Grey mullet', ar: 'بوري', images: ['/items/bouri.jpg'], kg: 20, tier1: 35.61, tier2: 35.26 },
  { en: 'Thinlip mullet', ar: 'طوبار', images: ['/items/thinlip_mullet.jpg'], kg: 20, tier1: 22.31, tier2: 21.97 },
  { en: 'Buni', ar: 'بني (حشايش / قشرة)', images: ['/items/grass_carp.jpg', '/items/mubarakah.jpg'], kg: 20, tier1: 18.03, tier2: 17.69 },
  { en: 'Mirror carp', ar: 'مبروكة', images: ['/items/mirror_carp.jpg'], kg: 20, tier1: 14.8, tier2: 14.45 },
  { en: 'Meagre', ar: 'لوت', images: ['/items/lout.jpg'], kg: 10, tier1: 23.01, tier2: 22.83 },
  { en: 'Sea bass', ar: 'قاروص', images: ['/items/sea_bass.jpg'], kg: 10, tier1: 34.57, tier2: 34.39 },
  { en: 'Catfish', ar: 'قراميط', images: ['/items/catfish.jpg'], kg: 20, tier1: 13.06, tier2: 12.72 },
  { en: 'Silver carp', ar: 'سليفر', images: ['/items/silver_carp.jpg'], kg: 20, tier1: 15.26, tier2: 14.91 },
  { en: 'Eel', ar: 'ثعابين', images: ['/items/eels.jpg'], kg: 10, tier1: 29.94, tier2: 29.77 },
  { en: 'Bayad catfish', ar: 'بياض', images: ['/items/bayad_catfish.jpg'], kg: 20, tier1: 25.2, tier2: 24.86 },
];

// The species photos are cut-outs on white; the eel photo is a full-frame shot and is cropped instead.
const FULL_FRAME = new Set(['/items/eels.jpg']);

const kwd = (n: number) => n.toFixed(3);
// integer fils to avoid float error (14.45 / 20 = 0.7225 -> 0.723, half-up like the PDF)
const perKg = (carton: number, kg: number) => (Math.round(Math.round(carton * 1000) / kg) / 1000).toFixed(3);

const T = {
  en: {
    switchTo: 'العربية',
    switchLabel: 'اعرض الصفحة بالعربية',
    title: 'Fresh fish prices, air-freighted to Kuwait',
    delivered: 'Delivered Kuwait Airport (KWI)',
    payment: 'Payment: cash',
    valid: 'Valid until 26 Nov 2026',
    trust: 'Exporting to Kuwait, the UAE, Qatar, Iraq, Bahrain, Lebanon and Syria.',
    expired: 'These prices expired on 26 Nov 2026. Message us for today’s prices.',
    units: 'KWD per carton',
    unitsRest: ', per kg in grey. ',
    note: 'Shipments over 10 t get a lower price per carton.',
    tier1: '5–10 t',
    tier2: '10 t+',
    kg: 'kg',
    orderTitle: 'Order for Kuwait',
    cta: 'Send your quantities on WhatsApp',
    reply: 'We reply with availability and the flight date.',
    waText: `Hello AZAFCO, about quotation ${REF} (air freight, Kuwait). Species and quantities: `,
    product: 'Fresh chilled whole fish, insulated EPS boxes at 0–4 °C.',
    legal: 'AZAFCO International for Investment and Development S.A.E. · Commercial Register 100776 · Motobas, Kafr El Sheikh, Egypt',
    ref: 'Quotation',
    orderNav: 'Order',
  },
  ar: {
    switchTo: 'English',
    switchLabel: 'View this page in English',
    title: 'أسعار السمك الطازج – شحن جوي إلى الكويت',
    delivered: 'تسليم مطار الكويت (KWI)',
    payment: 'الدفع: نقدًا',
    valid: 'سارية حتى 26 نوفمبر 2026',
    trust: 'نصدّر إلى الكويت والإمارات وقطر والعراق والبحرين ولبنان وسوريا.',
    expired: 'انتهت صلاحية هذه الأسعار في 26 نوفمبر 2026. راسلونا لأسعار اليوم.',
    units: 'دينار كويتي للكرتون',
    unitsRest: '، والكيلو أسفله. ',
    note: 'شحنات أكثر من 10 طن بسعر أقل للكرتون.',
    tier1: (
      <>
        <bdi dir="ltr">5–10</bdi> طن
      </>
    ),
    tier2: 'أكثر من 10 طن',
    kg: 'كجم',
    orderTitle: 'اطلب للكويت',
    cta: 'أرسل الكميات على واتساب',
    reply: 'نرد عليكم بالتوفر وموعد الرحلة.',
    waText: `السلام عليكم ازافكو، بخصوص عرض ${REF} (شحن جوي – الكويت). الأصناف والكميات المطلوبة: `,
    product: (
      <>
        سمك طازج مبرد كامل، صناديق بوليسترين معزولة (EPS) على <bdi dir="ltr">0–4 °م</bdi>.
      </>
    ),
    legal: 'ازافكو العالمية للاستثمار والتنمية (ش.م.م) · سجل تجاري 100776 · مطوبس، كفر الشيخ، مصر',
    ref: 'عرض رقم',
    orderNav: 'اطلب',
  },
};

// Runs as the HTML parses, before React loads: marks the page expired after the validity date,
// and hides it for a moment when Arabic is asked for (?lang=ar or a saved choice) so English never flashes.
const EARLY_SCRIPT = `(function(){
var m=document.currentScript&&document.currentScript.parentElement;if(!m)return;
if(Date.now()>=${EXPIRES_AT_MS})m.setAttribute('data-expired','');
var l=null;try{l=new URLSearchParams(location.search).get('lang');}catch(e){}
if(l!=='ar'&&l!=='en'){try{l=localStorage.getItem('${LANG_KEY}');}catch(e){}}
if(l==='ar')m.setAttribute('data-pending','');
})();`;

const CSS = `
:root{--navy:#002D72;--gold:#F7B500;--ink:#10233f}
.offer[data-pending]{visibility:hidden}
@keyframes offerUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.offer-in>*{animation:offerUp .7s cubic-bezier(.2,.7,.2,1) both}
.offer-in>*:nth-child(2){animation-delay:.07s}.offer-in>*:nth-child(3){animation-delay:.14s}.offer-in>*:nth-child(4){animation-delay:.21s}
.offer-tile img{transition:transform .35s cubic-bezier(.2,.7,.2,1)}
.offer-tile .cut{transform:scale(1.04)}
.offer-row:hover .offer-tile img{transform:scale(1.03)}
.offer-row:hover .offer-tile .cut{transform:scale(1.07)}
.offer-expired{display:none}
.offer[data-expired] .offer-expired{display:block}
.offer[data-expired] .offer-valid{text-decoration:line-through}
.offer[data-expired] .offer-prices{filter:grayscale(1);opacity:.45}
a.offer-focus:focus-visible,button.offer-focus:focus-visible{outline:2px solid var(--navy);outline-offset:3px}
#order a.offer-focus:focus-visible{outline-color:#fff}
#offer-bar{transition:transform .24s ease,opacity .24s ease}
#offer-bar[data-hidden]{transform:translateY(110%);opacity:0;pointer-events:none}
@media (prefers-reduced-motion:reduce){.offer-in>*{animation:none}#offer-bar,.offer-tile img{transition:none}}
`;

const BTN =
  'offer-focus flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#F7B500] px-3 text-[15px] font-bold text-[#002D72] shadow-[0_1px_0_rgba(0,0,0,.08)] transition-[transform,filter] duration-150 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[0.98]';

const WRAP = 'mx-auto w-full max-w-[680px] px-4 sm:px-8';

// species tile | name | 5–10 t | 10 t+
const ROW = 'grid grid-cols-[68px_minmax(0,1fr)_62px_62px] items-center gap-x-3 sm:grid-cols-[96px_minmax(0,1fr)_104px_104px] sm:gap-x-6';

function FishTile({ images, eager }: { images: string[]; eager: boolean }) {
  const loading = eager ? 'eager' : 'lazy';
  return (
    <div className="offer-tile flex aspect-[4/3] w-full flex-col overflow-hidden rounded-[10px] bg-[#F1F3F6]">
      {images.map((src) =>
        FULL_FRAME.has(src) ? (
          <img key={src} src={src} alt="" loading={loading} className="h-full w-full object-cover" />
        ) : (
          <img key={src} src={src} alt="" loading={loading} className="cut min-h-0 w-full flex-1 object-cover mix-blend-multiply" />
        ),
      )}
    </div>
  );
}

function readInitialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'ar' || q === 'en') return q;
  } catch {}
  try {
    const s = window.localStorage.getItem(LANG_KEY);
    if (s === 'ar' || s === 'en') return s;
  } catch {}
  return 'en';
}

export default function OfferView() {
  const [lang, setLang] = useState<Lang>('en');
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const t = T[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t.waText)}`;

  // Language from ?lang= or the saved choice; validity from the visitor's clock.
  useEffect(() => {
    setLang(readInitialLang());
    setExpired(Date.now() >= EXPIRES_AT_MS);
    setReady(true);
  }, []);

  // The layout sets LTR on html and body; mirror the chosen language there.
  useEffect(() => {
    if (!ready) return;
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
    document.body.dir = dir;
    document.body.style.direction = dir;
    document.querySelector('main.offer')?.removeAttribute('data-pending');
  }, [lang, dir, ready]);

  // Phone bar: off screen at the top and while the closing button shows.
  useEffect(() => {
    const bar = document.getElementById('offer-bar');
    const close = document.getElementById('order');
    if (!bar || !close || !('IntersectionObserver' in window)) return;
    let closeIn = false;
    const upd = () => bar.toggleAttribute('data-hidden', closeIn || window.scrollY < 160);
    const io = new IntersectionObserver((e) => {
      closeIn = e[0].isIntersecting;
      upd();
    });
    io.observe(close);
    window.addEventListener('scroll', upd, { passive: true });
    upd();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', upd);
    };
  }, []);

  const switchLang = () => {
    const next: Lang = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {}
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('lang');
      window.history.replaceState(null, '', url.toString());
    } catch {}
  };

  return (
    <>
      <main
        dir={dir}
        lang={lang}
        suppressHydrationWarning
        data-expired={expired ? '' : undefined}
        className="offer text-start text-[var(--ink)]"
      >
        <script dangerouslySetInnerHTML={{ __html: EARLY_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />

        {/* Top: brand, what this is, the key terms */}
        <section className={`offer-in ${WRAP} pt-5 sm:pt-10`} aria-labelledby="title">
          <header className="flex items-center justify-between gap-4" dir="ltr">
            <img src="/offer/azafco-logo.svg" alt="AZAFCO International" width={1228} height={291} className="h-8 w-auto sm:h-10" />
            <button
              type="button"
              onClick={switchLang}
              aria-label={t.switchLabel}
              lang={lang === 'en' ? 'ar' : 'en'}
              className="offer-focus -me-2 inline-flex min-h-[44px] items-center rounded-full px-3 text-[14px] font-semibold text-[var(--navy)] transition-colors hover:bg-slate-100 active:scale-[0.97]"
            >
              <span className="rounded-full border border-slate-200 px-3 py-1">{t.switchTo}</span>
            </button>
          </header>

          <h1
            id="title"
            style={{ textWrap: 'balance' }}
            className="mt-8 text-[31px] font-bold leading-[1.2] tracking-[-0.01em] text-[var(--navy)] sm:mt-12 sm:text-[44px]"
          >
            {lang === 'en' ? (
              <>
                Fresh fish prices, <span className="whitespace-nowrap">air-freighted</span> to Kuwait
              </>
            ) : (
              t.title
            )}
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-slate-700 sm:text-[17px]">
            {t.delivered} <span className="text-slate-300">·</span> {t.payment}
            <span className="offer-valid mt-0.5 block font-semibold text-[#6B4A00]">{t.valid}</span>
          </p>

          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{t.trust}</p>
        </section>

        {/* The price list */}
        <section className={`${WRAP} mt-8 sm:mt-10`} aria-labelledby="prices">
          {/* Expired state: shown after the validity date (early script first, then React) */}
          <p
            role="status"
            className="offer-expired mb-5 rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] font-semibold leading-snug text-[var(--navy)]"
          >
            {t.expired}
          </p>

          <div className="offer-prices">
            <h2 id="prices" className="text-[13px] font-normal leading-relaxed text-slate-600">
              <span className="font-semibold text-[var(--ink)]">{t.units}</span>
              {t.unitsRest}
              {t.note}
            </h2>

            <div className={`${ROW} !items-end sticky top-0 z-10 -mx-4 mt-3 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur sm:-mx-8 sm:px-8`}>
              <span className="col-span-2" />
              <span className="text-end text-[13px] font-bold leading-tight text-[var(--navy)]">{t.tier1}</span>
              <span className="text-end text-[13px] font-semibold leading-tight text-slate-600">{t.tier2}</span>
            </div>

            <ul>
              {ITEMS.map((it, i) => (
                <li key={it.en} className={`offer-row ${ROW} border-b border-slate-100 py-3 last:border-0 sm:py-4`}>
                  <FishTile images={it.images} eager={i < 5} />
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold leading-tight sm:text-[17px]">{lang === 'en' ? it.en : it.ar}</div>
                    <div className="mt-1 text-[13px] leading-snug text-slate-600">
                      <bdi dir={lang === 'en' ? 'rtl' : 'ltr'}>{lang === 'en' ? it.ar : it.en}</bdi>
                      <span className="text-slate-300"> · </span>
                      <bdi className="whitespace-nowrap text-slate-500">
                        <span className="tabular-nums">{it.kg}</span> {t.kg}
                      </bdi>
                    </div>
                  </div>
                  <div className="text-end tabular-nums">
                    <div className="text-[17px] font-bold leading-none tracking-tight text-[var(--navy)] sm:text-[20px]">{kwd(it.tier1)}</div>
                    <div className="mt-1.5 text-[11.5px] leading-none text-slate-500 sm:text-[12.5px]">{perKg(it.tier1, it.kg)}</div>
                  </div>
                  <div className="text-end tabular-nums">
                    <div className="text-[14px] font-semibold leading-none text-slate-600 sm:text-[16px]">{kwd(it.tier2)}</div>
                    <div className="mt-1.5 text-[11.5px] leading-none text-slate-500 sm:text-[12.5px]">{perKg(it.tier2, it.kg)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The one action */}
        <section id="order" className={`${WRAP} mt-10 sm:mt-12`} aria-labelledby="order-title">
          <div className="rounded-[20px] bg-[var(--navy)] px-4 py-6 sm:px-8 sm:py-8">
            <h2 id="order-title" className="text-[20px] font-bold leading-tight text-white sm:text-[24px]">
              {t.orderTitle}
            </h2>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className={`${BTN} mt-5`}>
              <FaWhatsapp className="h-5 w-5 shrink-0" aria-hidden />
              {t.cta}
            </a>
            <p className="mt-3 text-[13px] leading-relaxed text-white/80">
              {t.reply}{' '}
              <bdi dir="ltr" className="whitespace-nowrap tabular-nums">
                {WHATSAPP_DISPLAY}
              </bdi>
            </p>
          </div>
        </section>

        <footer className={`${WRAP} space-y-2 pb-[calc(96px+env(safe-area-inset-bottom))] pt-10 text-[12px] leading-relaxed text-slate-500 sm:pb-16`}>
          <p>{t.product}</p>
          <p>
            {t.legal} ·{' '}
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Quotation ${REF}`)}`}
              className="offer-focus text-slate-600 underline underline-offset-2"
            >
              {EMAIL}
            </a>
          </p>
          <p>
            {t.ref} <bdi className="tabular-nums">{REF}</bdi>
          </p>
        </footer>

        {/* Phone bar: the same action, kept off screen at the top and while the closing button shows */}
        <nav
          id="offer-bar"
          data-hidden=""
          suppressHydrationWarning
          aria-label={t.orderNav}
          className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur sm:hidden"
        >
          <a href={waHref} target="_blank" rel="noopener noreferrer" className={BTN}>
            <FaWhatsapp className="h-5 w-5 shrink-0" aria-hidden />
            {t.cta}
          </a>
        </nav>
      </main>
    </>
  );
}
