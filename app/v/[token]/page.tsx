import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { certificateRegistry, CertificateRecord } from '@/config/certificates';
import { companyConfig } from '@/config/company.config';

// ═══════════════════════════════════════════════════════════════════════════
// METADATA — noindex on every level
// ═══════════════════════════════════════════════════════════════════════════

export async function generateMetadata(
  { params }: { params: Promise<{ token: string }> }
): Promise<Metadata> {
  const { token } = await params;
  const cert = certificateRegistry[token];

  if (!cert) {
    return { title: 'Not Found', robots: { index: false, follow: false } };
  }

  return {
    title: `Certificate Verification — ${cert.holder}`,
    description: `Verified training certificate for ${cert.program}`,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default async function CertificateVerificationPage(
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const cert = certificateRegistry[token];

  // Invalid token → generic 404, reveals nothing
  if (!cert) {
    notFound();
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto">

        {/* ─── Verification Status Banner ─── */}
        <div className="mb-6 animate-slide-up">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-emerald-800 font-bold text-sm sm:text-base">✓ Verified Certificate</p>
              <p className="text-emerald-600 text-xs sm:text-sm">This certificate has been verified by AZAFCO International</p>
            </div>
          </div>
        </div>

        {/* ─── Main Certificate Card ─── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">

          {/* Header with Company Branding */}
          <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 px-6 sm:px-8 py-8 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Logo */}
            <div className="relative z-10 mb-4 flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 shadow-lg">
                <Image
                  src="/images/logo.svg"
                  alt="AZAFCO Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <h2 className="relative z-10 text-white text-lg sm:text-xl font-bold tracking-wide">
              AZAFCO
            </h2>
            <p className="relative z-10 text-primary-200 text-xs sm:text-sm font-medium tracking-widest uppercase mt-1">
              International Investment & Development
            </p>
            <p className="relative z-10 text-primary-300/80 text-[10px] sm:text-xs mt-2">
              {companyConfig.addresses.factory.street}, {companyConfig.addresses.factory.city}, {companyConfig.addresses.factory.region}, Egypt
            </p>
            <p className="relative z-10 text-primary-200/70 text-[10px] sm:text-xs mt-1">
              ISO & HACCP Certified
            </p>
          </div>

          {/* Certificate Body */}
          <div className="px-6 sm:px-8 py-8">

            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1.5 bg-primary-50 rounded-full mb-3">
                <span className="text-primary-700 text-xs font-semibold tracking-wider uppercase">
                  Certificate of Training Completion
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-2">This is to certify that</p>
            </div>

            {/* Holder Name */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                {cert.holder}
              </h1>
              <div className="mt-3 h-0.5 w-24 bg-gradient-to-r from-transparent via-secondary-400 to-transparent mx-auto" />
            </div>

            {/* Program */}
            <div className="text-center mb-8">
              <p className="text-slate-500 text-sm mb-2">
                has successfully completed a one-month intensive practical training program in
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-primary-100/50 px-5 py-3 rounded-xl border border-primary-100">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{cert.abbreviation}</span>
                </span>
                <span className="text-primary-800 font-bold text-sm sm:text-base">
                  {cert.program}
                </span>
              </div>
            </div>

            {/* Training Period */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">From</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{cert.startDate}</p>
              </div>
              <div className="flex-shrink-0 w-8 h-[1px] bg-slate-300 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary-400 rounded-full" />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">To</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{cert.endDate}</p>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Duration: {cert.duration}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

            {/* Training Modules */}
            <div className="mb-8">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
                Training Curriculum & Covered Modules
              </h2>
              <div className="space-y-3">
                {cert.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="group bg-slate-50 hover:bg-primary-50/50 rounded-xl p-4 transition-all duration-300 border border-transparent hover:border-primary-100"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary-800 transition-colors">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

            {/* Signatories */}
            <div className="flex justify-between items-end px-4 mb-6">
              <div className="text-center">
                <div className="h-px w-28 bg-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Training & Development Manager</p>
              </div>
              <div className="text-center">
                <div className="h-px w-28 bg-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Managing Director</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 sm:px-8 py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-slate-400">
              <span>Official Website: <a href={companyConfig.contact.baseUrl} className="text-primary-500 hover:text-primary-600 transition-colors">{companyConfig.contact.website}</a></span>
              <span className="hidden sm:inline">|</span>
              <span>Email: {companyConfig.contact.email}</span>
              <span className="hidden sm:inline">|</span>
              <span>Phone: {companyConfig.contact.phoneDisplay}</span>
            </div>
            <p className="text-center text-[9px] text-slate-300 mt-2">
              Issued: {cert.issuedDate} · Verification ID: {token.slice(0, 8)}...{token.slice(-4)}
            </p>
          </div>
        </div>

        {/* Bottom security note */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-400">
            This is a digitally verified certificate. Any unauthorized reproduction is prohibited.
          </p>
        </div>
      </div>
    </main>
  );
}
