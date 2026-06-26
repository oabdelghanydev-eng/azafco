import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { certificateRegistry } from '@/config/certificates';

export async function generateMetadata(
  { params }: { params: Promise<{ token: string }> }
): Promise<Metadata> {
  const { token } = await params;
  const cert = certificateRegistry[token];

  if (!cert) {
    return { title: 'Not Found', robots: { index: false, follow: false } };
  }

  return {
    title: `Certificate Verification | ${cert.holder}`,
    description: `Verified training credential for ${cert.program}`,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}

export default async function CertificateVerificationPage(
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const cert = certificateRegistry[token];

  if (!cert) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#eceef1] py-10 px-4 sm:px-8 lg:px-16 font-sans text-slate-900 selection:bg-slate-900 selection:text-white" dir="ltr">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Verification Status Header */}
        <div className="mb-8 flex items-center justify-between text-sm max-w-[800px] mx-auto px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-600 tracking-widest text-xs uppercase">
              Secure Digital Record
            </span>
          </div>
          <div className="text-xs tracking-widest font-mono text-slate-500">
            ID: {token.substring(0, 16)}
          </div>
        </div>

        {/* The Certificate Canvas */}
        <div className="relative bg-white shadow-2xl mx-auto max-w-[800px] aspect-[1/1.414] sm:aspect-[1.414/1] flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Background Pattern / Watermark */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          {/* Intricate Border System */}
          <div className="absolute inset-4 sm:inset-6 border-[1px] border-slate-200 pointer-events-none"></div>
          <div className="absolute inset-5 sm:inset-[28px] border-[3px] border-slate-800 pointer-events-none"></div>
          <div className="absolute inset-6 sm:inset-[33px] border-[1px] border-slate-200 pointer-events-none"></div>

          {/* Corner Ornaments */}
          <div className="absolute top-5 left-5 sm:top-[28px] sm:left-[28px] w-4 h-4 border-t-[3px] border-l-[3px] border-slate-800 pointer-events-none"></div>
          <div className="absolute top-5 right-5 sm:top-[28px] sm:right-[28px] w-4 h-4 border-t-[3px] border-r-[3px] border-slate-800 pointer-events-none"></div>
          <div className="absolute bottom-5 left-5 sm:bottom-[28px] sm:left-[28px] w-4 h-4 border-b-[3px] border-l-[3px] border-slate-800 pointer-events-none"></div>
          <div className="absolute bottom-5 right-5 sm:bottom-[28px] sm:right-[28px] w-4 h-4 border-b-[3px] border-r-[3px] border-slate-800 pointer-events-none"></div>

          {/* Content Wrapper */}
          <div className="relative z-10 flex-1 flex flex-col py-12 px-10 sm:py-16 sm:px-20 text-center h-full">
            
            {/* Header Section */}
            <header className="mb-10 sm:mb-12">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/logo.svg"
                  alt="AZAFCO Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-[0.3em] text-slate-900 uppercase">
                AZAFCO
              </h1>
              <h2 className="text-[10px] sm:text-xs tracking-[0.2em] text-slate-600 uppercase mt-2">
                International Investment & Development
              </h2>
              <p className="text-[8px] sm:text-[9px] text-slate-400 mt-2 tracking-widest uppercase">
                ISO & HACCP Certified • No. 120, Feed Sector, Industrial Zone, Motobas, Kafr El-Sheikh, Egypt
              </p>
            </header>

            {/* Certificate Title */}
            <div className="mb-10 sm:mb-12">
              <h3 className="text-3xl sm:text-5xl font-serif text-slate-900 leading-none">
                Certificate of Training
              </h3>
              <p className="text-sm sm:text-base text-slate-500 font-serif italic mt-6">
                This document certifies that
              </p>
            </div>

            {/* Recipient */}
            <div className="mb-10 sm:mb-12">
              <h4 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900">
                {cert.holder}
              </h4>
              <div className="w-16 h-[1px] bg-slate-300 mx-auto mt-6"></div>
            </div>

            {/* Program Description */}
            <div className="mb-12 sm:mb-14 px-4 sm:px-12 flex-1 flex flex-col justify-center">
              <p className="text-xs sm:text-sm text-slate-600 uppercase tracking-widest leading-loose mb-3">
                has successfully completed the intensive practical training program in
              </p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 tracking-[0.15em] uppercase mb-3">
                {cert.program}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 italic font-serif">
                concluded on {cert.endDate}
              </p>
            </div>

            {/* (Signatures removed as per request) */}

          </div>
        </div>

        {/* Modules Section (Moved Outside the Certificate Canvas for cleaner UI) */}
        <div className="mt-12 bg-white p-8 sm:p-12 shadow-sm border border-slate-200 max-w-[800px] mx-auto">
          <h5 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-8 pb-4 border-b border-slate-100">
            Training Curriculum & Covered Modules
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {cert.modules.map((mod, idx) => (
              <div key={idx} className="group">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center">
                  <span className="w-4 h-[1px] bg-slate-900 mr-3 opacity-20"></span>
                  {mod.title}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-7">
                  {mod.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
