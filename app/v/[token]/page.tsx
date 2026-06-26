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
    title: `Certificate Verification — ${cert.holder}`,
    description: `Verified training certificate for ${cert.program}`,
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
    <main className="min-h-screen bg-[#f4f6f8] py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900" dir="ltr">
      <div className="max-w-4xl mx-auto">
        
        {/* Minimal top bar for verification status */}
        <div className="mb-6 flex items-center justify-between text-sm text-gray-500 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-green-700 uppercase tracking-wider text-xs">Official Digital Verification</span>
          </div>
          <div className="text-xs uppercase tracking-wider font-mono text-gray-400">
            ID: {token.slice(0, 12)}
          </div>
        </div>

        {/* Certificate Document Card */}
        <div className="bg-white border border-gray-300 shadow-xl p-8 sm:p-16 relative">
          
          {/* Subtle inner borders for traditional certificate look */}
          <div className="absolute inset-2 border-2 border-gray-100 pointer-events-none"></div>
          <div className="absolute inset-3 border border-gray-100 pointer-events-none"></div>

          <div className="relative z-10">
            {/* Header / Branding */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/logo.svg"
                  alt="AZAFCO Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-widest text-gray-900 uppercase">AZAFCO</h2>
              <h3 className="text-sm sm:text-base tracking-widest text-gray-700 uppercase mt-2">International Investment & Development</h3>
              <p className="text-xs text-gray-500 mt-2 max-w-lg mx-auto uppercase tracking-wider">
                No. 120, Feed Sector, Industrial Zone, Motobas, Kafr El-Sheikh, Egypt | ISO & HACCP Certified
              </p>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 mb-6">
                Certificate of Training Completion
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-serif italic">
                This is to certify that
              </p>
            </div>

            {/* Holder Name */}
            <div className="text-center mb-12">
              <div className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
                {cert.holder}
              </div>
            </div>

            {/* Program Details */}
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
                has successfully completed a one-month intensive practical training program in
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-widest mb-4">
                {cert.program}
              </h2>
              <p className="text-base sm:text-lg text-gray-700">
                held from {cert.startDate} to {cert.endDate}.
              </p>
            </div>

            {/* Modules */}
            <div className="mb-16 max-w-3xl mx-auto">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">
                Training Curriculum & Covered Modules:
              </h3>
              <ul className="space-y-4 text-sm text-gray-800 leading-relaxed">
                {cert.modules.map((mod, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-3 text-gray-400 font-serif text-lg leading-none">•</span>
                    <div>
                      <span className="font-bold">{mod.title}: </span>
                      {mod.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-12 px-2 sm:px-8 mt-12">
              <div className="text-center w-48">
                <div className="h-px bg-gray-400 w-full mb-3"></div>
                <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Training & Development Manager</p>
              </div>
              
              <div className="hidden sm:flex flex-col items-center justify-center opacity-80">
                <div className="w-24 h-24 rounded-full border-4 border-double border-gray-300 flex items-center justify-center transform -rotate-12">
                  <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest text-center">Official<br/>Verification</span>
                </div>
              </div>

              <div className="text-center w-48">
                <div className="h-px bg-gray-400 w-full mb-3"></div>
                <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Managing Director</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
