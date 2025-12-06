import React, { useState } from 'react'
import Link from 'next/link'
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'
import BackToTop from './BackToTop'
import LanguageSwitcher from './LanguageSwitcher'
import { companyInfo } from '../data/company'
import { useI18n } from '../contexts/I18nContext'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, locale, dir } = useI18n()

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.products'), href: '/products' },
    // { name: t('nav.certificates'), href: '/certificates' }, // Hidden temporarily
    { name: t('nav.markets'), href: '/markets' },
    { name: t('nav.media'), href: '/media' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        {locale === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>

      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className={`flex items-center ${locale === 'ar' ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
              <img src="/images/logo.svg" alt={locale === 'ar' ? 'ازافكو' : 'AZAFCO'} className="h-16 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex items-center gap-6 ${locale === 'ar' ? 'space-x-8 space-x-reverse' : ''}`} aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className={`absolute bottom-0 ${locale === 'ar' ? 'right-0' : 'left-0'} w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full`}></span>
                </Link>
              ))}
              {/* Language Switcher */}
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full">
                <LanguageSwitcher />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 text-2xl p-2"
                aria-label={isMenuOpen ? (locale === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (locale === 'ar' ? 'فتح القائمة' : 'Open menu')}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0 }}
            animate={{ height: isMenuOpen ? 'auto' : 0 }}
            className="md:hidden overflow-hidden"
            aria-label={locale === 'ar' ? 'القائمة المتنقلة' : 'Mobile menu'}
          >
            <div className="py-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2 px-4 hover:bg-gray-50 rounded-lg transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow">
        {children}
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href={companyInfo.contact.whatsapp.link}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 z-40 hover:scale-110"
        aria-label={locale === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us via WhatsApp'}
      >
        <FaWhatsapp className="text-3xl" />
      </a>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
        <div className="container-custom py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <img src="/images/logo.svg" alt={locale === 'ar' ? 'ازافكو' : 'AZAFCO'} className="h-24 mb-4" />
              <p className="text-gray-400 text-sm">
                {t('footer.description')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.quick_links')}</h4>
              <nav aria-label={locale === 'ar' ? 'روابط التذييل' : 'Footer links'}>
                <ul className="space-y-2">
                  {navigation.slice(0, 4).map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-primary-400 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a
                      href="https://forms.gle/rEYRPSP3vpW8Cggv5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-400 transition-colors"
                    >
                      {t('footer.partnership')}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.contact_us')}</h4>
              <ul className="space-y-3 text-sm">
                <li className={`flex items-start ${locale === 'ar' ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                  <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                  <span>{locale === 'ar' ? companyInfo.addresses.factory.address : companyInfo.addresses.factory.addressEn}</span>
                </li>
                <li className={`flex items-center ${locale === 'ar' ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                  <FaPhone className="text-primary-400 flex-shrink-0" />
                  <a href={companyInfo.contact.phone.link} className="hover:text-primary-400" dir="ltr">
                    {companyInfo.contact.phone.display}
                  </a>
                </li>
                <li className={`flex items-center ${locale === 'ar' ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                  <FaEnvelope className="text-primary-400 flex-shrink-0" />
                  <a href={companyInfo.contact.email.link} className="hover:text-primary-400">
                    {companyInfo.contact.email.display}
                  </a>
                </li>
                <li className={`flex items-center ${locale === 'ar' ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                  <FaWhatsapp className="text-green-500 flex-shrink-0" />
                  <a href={companyInfo.contact.whatsapp.link} target="_blank" rel="noopener noreferrer" className="hover:text-green-400" dir="ltr">
                    {companyInfo.contact.whatsapp.display}
                  </a>
                </li>
              </ul>
            </div>

            {/* ISO Certifications */}
            <div>
              <h4 className="text-white font-bold mb-4">{locale === 'ar' ? 'شهادات الجودة' : 'Quality Certificates'}</h4>
              <div className="flex flex-wrap gap-2">
                {['ISO 9001', 'ISO 14001', 'ISO 45001', 'HACCP', 'ISO 22000'].map((cert) => (
                  <span key={cert} className="bg-gray-700 text-xs px-2 py-1 rounded">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} {locale === 'ar' ? 'ازافكو العالمية للإستثمار والتنمية' : 'AZAFCO International'}. {t('footer.copyright')}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
