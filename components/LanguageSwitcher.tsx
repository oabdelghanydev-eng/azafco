import React from 'react'
import { useI18n } from '../contexts/I18nContext'

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useI18n()

    return (
        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
            <button
                onClick={() => setLocale('ar')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${locale === 'ar'
                        ? 'bg-white text-primary-800 shadow-md'
                        : 'text-white hover:bg-white/20'
                    }`}
                aria-label="العربية"
            >
                عربي
            </button>
            <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${locale === 'en'
                        ? 'bg-white text-primary-800 shadow-md'
                        : 'text-white hover:bg-white/20'
                    }`}
                aria-label="English"
            >
                EN
            </button>
        </div>
    )
}

export default LanguageSwitcher
