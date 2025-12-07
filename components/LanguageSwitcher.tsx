'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';

const LanguageSwitcher: React.FC = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: 'ar' | 'en') => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
            <button
                onClick={() => switchLocale('ar')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${locale === 'ar'
                    ? 'bg-white text-primary-800 shadow-md'
                    : 'text-white hover:bg-white/20'
                    }`}
                aria-label="العربية"
            >
                عربي
            </button>
            <button
                onClick={() => switchLocale('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${locale === 'en'
                    ? 'bg-white text-primary-800 shadow-md'
                    : 'text-white hover:bg-white/20'
                    }`}
                aria-label="English"
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
