import React, { useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaNewspaper, FaIndustry, FaTrophy, FaExternalLinkAlt, FaCalendarAlt, FaImages, FaHandshake } from 'react-icons/fa'
import { newsItems, companyNews, industryNews, achievementNews, NewsItem } from '../data/news'
import { products } from '../data/products'
import { certificates } from '../data/certificates'
import { companyInfo } from '../data/company'
import { useI18n } from '../contexts/I18nContext'

const MediaPage = () => {
    const { locale } = useI18n()
    const isAr = locale === 'ar'
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const categories = [
        { id: 'all', name: isAr ? 'جميع الأخبار' : 'All News', icon: <FaNewspaper /> },
        { id: 'company', name: isAr ? 'أخبار الشركة' : 'Company News', icon: <FaIndustry /> },
        { id: 'industry', name: isAr ? 'أخبار القطاع' : 'Industry News', icon: <FaNewspaper /> },
        { id: 'achievement', name: isAr ? 'إنجازاتنا' : 'Achievements', icon: <FaTrophy /> },
    ]

    const getFilteredNews = (): NewsItem[] => {
        switch (selectedCategory) {
            case 'company':
                return companyNews
            case 'industry':
                return industryNews
            case 'achievement':
                return achievementNews
            default:
                return newsItems
        }
    }

    const filteredNews = getFilteredNews()

    const galleryImages = [
        ...products.map(p => ({ src: p.image, title: isAr ? p.name : p.nameEn, type: 'product' })),
        ...certificates.map(c => ({ src: c.image, title: c.name, type: 'certificate' })),
    ]

    const getCategoryLabel = (category: string) => {
        if (isAr) {
            return category === 'company' ? 'أخبار الشركة' :
                category === 'industry' ? 'أخبار القطاع' : 'إنجازات'
        }
        return category === 'company' ? 'Company News' :
            category === 'industry' ? 'Industry News' : 'Achievements'
    }

    return (
        <Layout>
            <SEO
                title={isAr ? 'المركز الإعلامي' : 'Media Center'}
                description={isAr
                    ? 'آخر أخبار شركة ازافكو وأخبار قطاع الأسماك في مصر'
                    : 'Latest news from AZAFCO and the fish industry in Egypt'}
                url="https://azafco.com.eg/media"
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-16">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {isAr ? 'المركز الإعلامي' : 'Media Center'}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            {isAr
                                ? 'تابع آخر أخبارنا وإنجازاتنا ومستجدات قطاع الأسماك في مصر'
                                : 'Follow our latest news, achievements, and fish industry updates in Egypt'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Statistics Banner */}
            <section className="py-8 bg-secondary-500 text-white">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold">50%</div>
                            <div className="text-sm">
                                {isAr ? 'من إنتاج مصر السمكي من كفر الشيخ' : 'of Egypt\'s fish from Kafr El Sheikh'}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">750,000</div>
                            <div className="text-sm">
                                {isAr ? 'طن صادرات سنوية من كفر الشيخ' : 'tons annual exports'}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">#1</div>
                            <div className="text-sm">
                                {isAr ? 'مصر الأولى أفريقياً في الاستزراع' : 'Egypt #1 in Africa aquaculture'}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">#6</div>
                            <div className="text-sm">
                                {isAr ? 'مصر السادسة عالمياً' : 'Egypt 6th globally'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Categories Filter */}
            <section className="py-8 bg-gray-100 sticky top-20 z-40">
                <div className="container-custom">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id
                                    ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow'
                                    }`}
                                id={`filter-${category.id}`}
                                aria-pressed={selectedCategory === category.id}
                            >
                                {category.icon}
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((news, index) => (
                            <motion.article
                                key={news.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card hover:shadow-2xl group"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${news.category === 'company' ? 'bg-blue-100 text-blue-700' :
                                            news.category === 'industry' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {getCategoryLabel(news.category)}
                                        </span>
                                        <span className="text-gray-400 text-sm flex items-center gap-1">
                                            <FaCalendarAlt className="text-xs" />
                                            {news.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 text-primary-800 group-hover:text-primary-600 transition-colors">
                                        {isAr ? news.title : news.titleEn}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {isAr ? news.summary : news.summaryEn}
                                    </p>

                                    <div className="text-sm text-gray-500">
                                        <p className="mb-3">{isAr ? news.content : news.contentEn}</p>

                                        {news.source && (
                                            <div className={`flex items-center gap-2 pt-3 border-t border-gray-100 ${isAr ? '' : 'flex-row-reverse justify-end'}`}>
                                                <span>{isAr ? 'المصدر:' : 'Source:'}</span>
                                                {news.sourceUrl ? (
                                                    <a
                                                        href={news.sourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {news.source}
                                                        <FaExternalLinkAlt className="text-xs" />
                                                    </a>
                                                ) : (
                                                    <span>{news.source}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image Gallery Section */}
            <section className="py-20 bg-gray-100">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title flex items-center justify-center gap-3">
                            <FaImages className="text-primary-600" />
                            {isAr ? 'معرض الصور' : 'Photo Gallery'}
                        </h2>
                        <p className="section-subtitle">
                            {isAr ? 'منتجاتنا وشهاداتنا' : 'Our products and certificates'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {galleryImages.map((img, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md cursor-pointer group"
                                onClick={() => setSelectedImage(img.src)}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold text-center px-2">
                                        {img.title}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 left-0 text-white text-3xl hover:text-gray-300 transition-colors"
                            aria-label={isAr ? 'إغلاق' : 'Close'}
                        >
                            ✕
                        </button>
                        <Image
                            src={selectedImage}
                            alt={isAr ? 'صورة مكبرة' : 'Enlarged image'}
                            width={1000}
                            height={800}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Social Media Section */}
            <section className="py-16 bg-primary-900 text-white">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-4">
                            {isAr ? 'تواصل معنا' : 'Contact Us'}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {isAr
                                ? 'تابعنا للحصول على آخر الأخبار والعروض'
                                : 'Follow us for the latest news and offers'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href={companyInfo.contact.whatsapp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {isAr ? 'واتساب' : 'WhatsApp'}
                            </a>
                            <a
                                href={companyInfo.contact.email.link}
                                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {isAr ? 'البريد الإلكتروني' : 'Email'}
                            </a>
                            <a
                                href="https://forms.gle/rEYRPSP3vpW8Cggv5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-primary-800 hover:bg-primary-900 text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                            >
                                <FaHandshake className="text-xl" />
                                {isAr ? 'طلب شراكة تجارية' : 'Request Partnership'}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    )
}

export default MediaPage
