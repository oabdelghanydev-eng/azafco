'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaFish, FaSnowflake, FaUserTie, FaGlobe, FaWhatsapp, FaHandshake } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import { featuredProducts } from '@/data/products';
import { marketCountries } from '@/data/markets';
import { companyInfo } from '@/data/company';

export default function HomePage() {
    const t = useTranslations();
    const locale = useLocale();

    const features = [
        {
            icon: <FaFish className="text-5xl text-primary-600" />,
            title: t('home.features.trusted_source'),
            description: t('home.features.trusted_source_desc'),
        },
        {
            icon: <FaSnowflake className="text-5xl text-blue-500" />,
            title: t('home.features.cold_chain'),
            description: t('home.features.cold_chain_desc'),
        },
        {
            icon: <FaUserTie className="text-5xl text-secondary-600" />,
            title: t('home.features.professionals'),
            description: t('home.features.professionals_desc'),
        },
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative text-white overflow-hidden min-h-[90vh] flex items-center">
                <div className="absolute inset-0">
                    <Image
                        src="/images/bg-homepage.webp"
                        alt={locale === 'ar' ? 'خلفية المصنع' : 'Factory Background'}
                        fill
                        sizes="100vw"
                        priority
                        quality={80}
                        className="object-cover scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-secondary-900/85"></div>
                    {/* Animated particles effect */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="absolute top-40 right-20 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                    </div>
                </div>
                <div className="container-custom relative z-10 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="mb-8"
                        >
                            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-white/30">
                                🐟 {locale === 'ar'
                                    ? `رواد تصدير الأسماك الطازجة منذ ${companyInfo.established}`
                                    : `Leaders in fresh fish export since ${companyInfo.established}`}
                            </span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            {t('home.hero.title')}
                            <br />
                            <span className="text-secondary-400">
                                {locale === 'ar' ? 'للإستثمار والتنمية' : 'Investment & Development'}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-200 leading-relaxed">
                            {t('home.hero.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Link
                                href="/products"
                                className="bg-secondary-500 hover:bg-secondary-600 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl inline-flex items-center justify-center gap-2"
                                id="hero-products-btn"
                            >
                                <FaFish />
                                {t('common.browse_products')}
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 border border-white/30 inline-flex items-center justify-center gap-2"
                                id="hero-contact-btn"
                            >
                                <FaGlobe />
                                {t('common.contact_us')}
                            </Link>
                        </div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                        >
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="text-3xl md:text-4xl font-bold text-secondary-400">{companyInfo.stats.experience}</div>
                                <div className="text-sm text-gray-300">{t('home.stats.years')}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="text-3xl md:text-4xl font-bold text-secondary-400">{companyInfo.stats.countries}</div>
                                <div className="text-sm text-gray-300">{t('home.stats.countries')}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="text-3xl md:text-4xl font-bold text-secondary-400">{companyInfo.stats.tonnage}</div>
                                <div className="text-sm text-gray-300">{t('home.stats.tonnage')}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="text-3xl md:text-4xl font-bold text-secondary-400">{companyInfo.stats.certificates}</div>
                                <div className="text-sm text-gray-300">{t('home.stats.certificates')}</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-24 text-gray-50" viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none">
                        <path d="M0,50 C720,100 720,0 1440,50 L1440,100 L0,100 Z"></path>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">{t('home.why_us.title')}</h2>
                        <p className="section-subtitle">
                            {locale === 'ar'
                                ? 'نقدم لكم أفضل خدمات تصدير الأسماك الطازجة'
                                : 'We provide the best fresh fish export services'}
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card p-8 text-center group hover:bg-primary-50"
                            >
                                <div className="mb-4 transform group-hover:scale-110 transition-transform flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Preview Section */}
            <section className="py-20 bg-gray-100">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">{t('home.products.title')}</h2>
                        <p className="section-subtitle">{t('home.products.subtitle')}</p>
                    </motion.div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card group cursor-pointer"
                            >
                                <div className="h-48 overflow-hidden bg-gray-200">
                                    <Image
                                        src={product.image}
                                        alt={locale === 'ar' ? product.name : product.nameEn || product.name}
                                        width={300}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-center">
                                        {locale === 'ar' ? product.name : product.nameEn || product.name}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link href="/products" className="btn-primary inline-block" id="view-all-products-btn">
                            {t('home.products.view_all')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-20 bg-primary-900 text-white">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-400">{companyInfo.stats.experience}</div>
                            <div className="text-lg">{t('home.stats.years')}</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-400">{companyInfo.stats.clients}</div>
                            <div className="text-lg">{t('common.satisfied_clients')}</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-400">{companyInfo.stats.countries}</div>
                            <div className="text-lg">{t('home.stats.countries')}</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-400">{companyInfo.stats.tonnage}</div>
                            <div className="text-lg">{t('home.stats.tonnage')}</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Markets Section */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">{t('home.markets.title')}</h2>
                        <p className="section-subtitle">{t('home.markets.subtitle')}</p>
                    </motion.div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {marketCountries.map((market, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white border-2 border-primary-600 rounded-full px-6 py-3 text-lg font-semibold text-primary-800 hover:bg-primary-600 hover:text-white transition-all duration-300 shadow-lg flex items-center gap-3"
                            >
                                <Image src={market.flag} alt={locale === 'ar' ? market.country : market.countryEn || market.country} width={32} height={24} className="w-8 h-6 object-cover rounded" />
                                {locale === 'ar' ? market.country : market.countryEn || market.country}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t('home.cta.title')}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {t('home.cta.description')}
                        </p>
                        <Link
                            href="/contact"
                            className="bg-white text-secondary-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3 text-lg"
                            id="cta-contact-btn"
                        >
                            <FaHandshake className="text-2xl" />
                            {locale === 'ar' ? 'ابدأ التعاون معنا' : 'Start Partnership'}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
