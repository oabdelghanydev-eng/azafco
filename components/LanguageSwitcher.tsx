'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales, localeConfig, Locale } from '@/i18n';

const LOCALE_STORAGE_KEY = 'azafco-preferred-locale';

// Flag emojis for each locale
const localeFlags: Record<Locale, string> = {
    ar: '🇪🇬',
    en: '🇬🇧',
    es: '🇪🇸',
    ru: '🇷🇺',
    de: '🇩🇪',
    fr: '🇫🇷',
};

const LanguageSwitcher: React.FC = () => {
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const switchLocale = (newLocale: Locale) => {
        // Save preference to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
        }
        router.replace(pathname, { locale: newLocale });
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLocaleConfig = localeConfig[locale];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Current language button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white"
                aria-label="Select language"
                aria-expanded={isOpen}
            >
                <span className="text-lg">{localeFlags[locale]}</span>
                <span className="text-sm font-medium hidden sm:inline">{currentLocaleConfig.nativeName}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[160px] z-50">
                    {locales.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => switchLocale(loc)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${locale === loc
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-lg">{localeFlags[loc]}</span>
                            <span className="font-medium">{localeConfig[loc].nativeName}</span>
                            {locale === loc && (
                                <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
