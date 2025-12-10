'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales, localeConfig, Locale } from '@/i18n';

const LOCALE_STORAGE_KEY = 'azafco-preferred-locale';

// Flag SVG paths for each locale - using optimized SVGs from public/flags
const localeFlagPaths: Record<Locale, string> = {
    ar: '/flags/eg.svg',  // Egypt flag for Arabic
    en: '/flags/gb.svg',  // UK flag for English
    es: '/flags/es.svg',  // Spain flag for Spanish
    ru: '/flags/ru.svg',  // Russia flag for Russian
    de: '/flags/de.svg',  // Germany flag for German
    fr: '/flags/fr.svg',  // France flag for French
};

// Memoized Flag component for optimal re-renders
const FlagImage = memo(({ locale, size = 20 }: { locale: Locale; size?: number }) => (
    <Image
        src={localeFlagPaths[locale]}
        alt={`${localeConfig[locale].nativeName} flag`}
        width={size}
        height={Math.round(size * 0.75)} // 4:3 aspect ratio for flags
        className="rounded-sm object-cover"
        // Performance optimizations
        loading="eager" // Flags are critical UI elements
        priority={false}
        unoptimized // SVGs don't need Next.js optimization
        style={{
            width: size,
            height: 'auto',
            minHeight: Math.round(size * 0.6),
        }}
    />
));

FlagImage.displayName = 'FlagImage';

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

    // Close on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    const currentLocaleConfig = localeConfig[locale];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Current language button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Select language"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <FlagImage locale={locale} size={20} />
                <span className="text-sm font-medium hidden sm:inline">{currentLocaleConfig.nativeName}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[180px] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    role="listbox"
                    aria-label="Available languages"
                >
                    {locales.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => switchLocale(loc)}
                            role="option"
                            aria-selected={locale === loc}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${locale === loc
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <FlagImage locale={loc} size={24} />
                            <span className="font-medium">{localeConfig[loc].nativeName}</span>
                            {locale === loc && (
                                <svg
                                    className="w-4 h-4 ml-auto text-primary-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                >
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
