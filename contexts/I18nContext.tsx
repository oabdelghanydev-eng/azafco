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
}

const translations: Record<Locale, TranslationKeys> = {
    ar: arTranslations,
    en: enTranslations as TranslationKeys
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState<Locale>('ar')

    useEffect(() => {
        // Check localStorage for saved locale
        const savedLocale = localStorage.getItem('locale') as Locale
        if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
            setLocaleState(savedLocale)
        }
        // Check URL params
        const urlParams = new URLSearchParams(window.location.search)
        const langParam = urlParams.get('lang') as Locale
        if (langParam && (langParam === 'ar' || langParam === 'en')) {
            setLocaleState(langParam)
        }
    }, [])

    useEffect(() => {
        // Update document direction and lang
        document.documentElement.lang = locale
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
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
        <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
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
