import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Import translations
import arTranslations from '../locales/ar/common.json'
import enTranslations from '../locales/en/common.json'

type Locale = 'ar' | 'en'
type TranslationKeys = typeof arTranslations

interface I18nContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
    dir: 'rtl' | 'ltr'
    isReady: boolean
}

const translations: Record<Locale, TranslationKeys> = {
    ar: arTranslations,
    en: enTranslations as TranslationKeys
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Start with null to prevent hydration mismatch, then set actual locale
    const [locale, setLocaleState] = useState<Locale>('ar')
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        // This only runs on client side
        let detectedLocale: Locale = 'en' // Default for international users

        // Priority 1: Check URL params first
        const urlParams = new URLSearchParams(window.location.search)
        const langParam = urlParams.get('lang')
        if (langParam === 'ar' || langParam === 'en') {
            detectedLocale = langParam
        }
        // Priority 2: Check localStorage for saved preference
        else {
            const savedLocale = localStorage.getItem('locale')
            if (savedLocale === 'ar' || savedLocale === 'en') {
                detectedLocale = savedLocale
            }
            // Priority 3: Auto-detect browser language
            else {
                const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en'
                detectedLocale = browserLang.startsWith('ar') ? 'ar' : 'en'
            }
        }

        setLocaleState(detectedLocale)
        localStorage.setItem('locale', detectedLocale)
        setIsReady(true)
    }, [])

    useEffect(() => {
        // Update document direction and lang
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale
            document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
        }
    }, [locale])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem('locale', newLocale)
        // Update URL without reload
        const url = new URL(window.location.href)
        url.searchParams.set('lang', newLocale)
        window.history.pushState({}, '', url.toString())
    }

    const t = (key: string): string => {
        const keys = key.split('.')
        let result: unknown = translations[locale]

        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = (result as Record<string, unknown>)[k]
            } else {
                return key // Return key if translation not found
            }
        }

        return typeof result === 'string' ? result : key
    }

    const dir = locale === 'ar' ? 'rtl' : 'ltr'

    return (
        <I18nContext.Provider value={{ locale, setLocale, t, dir, isReady }}>
            {children}
        </I18nContext.Provider>
    )
}

export const useI18n = () => {
    const context = useContext(I18nContext)
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider')
    }
    return context
}

export default I18nContext
