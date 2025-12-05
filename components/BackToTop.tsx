import React, { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false)
    const { locale } = useI18n()

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToTop}
                    className="fixed bottom-40 left-10 z-50 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-colors duration-300"
                    aria-label={locale === 'ar' ? 'العودة لأعلى الصفحة' : 'Back to top'}
                >
                    <FaArrowUp className="text-xl" />
                </motion.button>
            )}
        </AnimatePresence>
    )
}

export default BackToTop
