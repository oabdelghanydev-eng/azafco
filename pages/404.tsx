import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaHome, FaFish, FaSearch } from 'react-icons/fa'
import { useI18n } from '../contexts/I18nContext'

const NotFoundPage = () => {
    const { locale } = useI18n()
    const isAr = locale === 'ar'

    return (
        <Layout>
            <SEO
                title="الصفحة غير موجودة"
                titleEn="Page Not Found - AZAFCO International"
                description="عذراً، الصفحة التي تبحث عنها غير موجودة. يرجى العودة للصفحة الرئيسية."
                descriptionEn="Sorry, the page you are looking for does not exist. Please return to the homepage."
                url="https://azafco.com.eg/404"
            />

            <section className="min-h-[60vh] flex items-center justify-center py-20">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-9xl font-bold text-primary-200 mb-4">404</div>
                        <FaFish className="text-6xl text-primary-600 mx-auto mb-6 wave-animation" />
                        <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
                            {isAr ? 'عذراً، الصفحة غير موجودة' : 'Sorry, Page Not Found'}
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
                            {isAr
                                ? 'يبدو أن الصفحة التي تبحث عنها قد انتقلت أو لم تعد موجودة'
                                : 'The page you are looking for may have been moved or no longer exists'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="btn-primary inline-flex items-center justify-center gap-2"
                                id="404-home-btn"
                            >
                                <FaHome />
                                {isAr ? 'العودة للرئيسية' : 'Back to Home'}
                            </Link>
                            <Link
                                href="/products"
                                className="btn-secondary inline-flex items-center justify-center gap-2"
                                id="404-products-btn"
                            >
                                <FaSearch />
                                {isAr ? 'تصفح المنتجات' : 'Browse Products'}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    )
}

export default NotFoundPage
