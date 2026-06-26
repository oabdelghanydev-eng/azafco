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
    title: `Credential Verification | ${cert.holder}`,
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
    <main className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 selection:bg-emerald-500 selection:text-white" dir="ltr">
      <div className="max-w-2xl mx-auto">
        
        {/* Company Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-3">
            <Image
              src="/images/logo.svg"
              alt="AZAFCO Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-slate-900 uppercase">
            AZAFCO
          </h1>
          <p className="text-xs text-slate-500 tracking-wider uppercase mt-1">
            International Investment & Development
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Status Banner */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">
                Verified Credential Record
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              ID: {token.substring(0, 8)}...
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Record Intro */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Holder Name
              </span>
              <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                {cert.holder}
              </h2>
            </div>

            {/* Main Program Section */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Completed Program
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {cert.program}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Duration
                  </span>
                  <p className="text-sm font-medium text-slate-700">
                    {cert.duration}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Issue Date
                  </span>
                  <p className="text-sm font-medium text-slate-700">
                    {cert.issuedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Credential Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-400 font-medium block">Training Period</span>
                <span className="font-semibold text-slate-700">{cert.startDate} – {cert.endDate}</span>
              </div>
              <div className="pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-400 font-medium block">Issued By</span>
                <span className="font-semibold text-slate-700">AZAFCO — Training & Development Division</span>
              </div>
              <div className="sm:col-span-2 pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-400 font-medium block">Secure Hash ID</span>
                <span className="font-mono text-xs text-slate-600 break-all select-all">{token}</span>
              </div>
            </div>

            {/* Program Curriculum Modules */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                Covered Modules & Skills
              </h4>
              <div className="space-y-3">
                {cert.modules.map((mod, idx) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-150">
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-sm font-semibold text-slate-900 block">{mod.title}</span>
                      <p className="text-xs text-slate-500 leading-normal">{mod.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            This page is the official digital record for the credential above.
            Issued and maintained by AZAFCO International Investment &amp; Development.
          </p>
        </div>

      </div>
    </main>
  );
}
