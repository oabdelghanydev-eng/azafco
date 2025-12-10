'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaBullseye, FaHandshake, FaAward, FaIndustry, FaUsers, FaGlobe } from 'react-icons/fa';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import { companyInfo } from '@/data/company';

export default function AboutPageClient() {
    const locale = useLocale();
    const isAr = locale === 'ar';
    const t = useTranslations();

    const timeline = [
        { year: '2008', event: t('about_page.timeline_2008_founding') },
        { year: '2008', event: t('about_page.timeline_2008_export') },
        { year: '2018', event: t('about_page.timeline_2018_factory') },
        { year: '2018', event: t('about_page.timeline_2018_iso') },
        { year: '2018', event: t('about_page.timeline_2018_expansion') },
        { year: '2025', event: t('about_page.timeline_2025_upgrade') },
    ];

    const values = [
        {
            icon: <FaHandshake className="text-4xl text-primary-600" />,
            title: t('about_page.value_trust'),
            description: t('about_page.value_trust_desc'),
        },
        {
            icon: <FaAward className="text-4xl text-secondary-600" />,
            title: t('about_page.value_quality'),
            description: t('about_page.value_quality_desc'),
        },
        {
            icon: <FaUsers className="text-4xl text-green-600" />,
            title: t('about_page.value_team'),
            description: t('about_page.value_team_desc'),
        },
        {
            icon: <FaGlobe className="text-4xl text-blue-600" />,
            title: t('about_page.value_leadership'),
            description: t('about_page.value_leadership_desc'),
        },
    ];

    return (
        <Layout>
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
                            {t('about.title')}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            {t('about.subtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Company Info Section */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-primary-800">
                                {t('about_page.success_story')}
                            </h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('about_page.company_description')}
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('about_page.success_story_p2')}
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                {t('about_page.success_story_p3')}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-primary-100 rounded-2xl p-8 shadow-xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <FaIndustry className="text-5xl text-primary-600 mx-auto mb-3" />
                                        <h4 className="font-bold text-lg">{t('about_page.modern_factory')}</h4>
                                        <p className="text-sm text-gray-600">{t('about_page.factory_desc')}</p>
                                    </div>
                                    <div className="text-center">
                                        <FaAward className="text-5xl text-secondary-600 mx-auto mb-3" />
                                        <h4 className="font-bold text-lg">{t('about_page.international_certs')}</h4>
                                        <p className="text-sm text-gray-600">{t('about_page.certs_desc')}</p>
                                    </div>
                                    <div className="text-center">
                                        <FaUsers className="text-5xl text-green-600 mx-auto mb-3" />
                                        <h4 className="font-bold text-lg">{t('about_page.professional_team')}</h4>
                                        <p className="text-sm text-gray-600">{t('about_page.export_experts')}</p>
                                    </div>
                                    <div className="text-center">
                                        <FaGlobe className="text-5xl text-blue-600 mx-auto mb-3" />
                                        <h4 className="font-bold text-lg">{t('about_page.regional_presence')}</h4>
                                        <p className="text-sm text-gray-600">{t('about_page.in_countries')}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="py-20 bg-gray-100">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="card p-8"
                        >
                            <div className={`flex items-center mb-4 ${isAr ? '' : 'flex-row-reverse justify-end'}`}>
                                <FaEye className={`text-4xl text-primary-600 ${isAr ? 'ml-4' : 'mr-4'}`} />
                                <h3 className="text-2xl font-bold text-primary-800">{t('about_page.our_vision')}</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {t('about_page.vision_text')}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="card p-8"
                        >
                            <div className={`flex items-center mb-4 ${isAr ? '' : 'flex-row-reverse justify-end'}`}>
                                <FaBullseye className={`text-4xl text-secondary-600 ${isAr ? 'ml-4' : 'mr-4'}`} />
                                <h3 className="text-2xl font-bold text-primary-800">{t('about_page.our_mission')}</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {t('about_page.mission_text')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">{t('about_page.our_values')}</h2>
                        <p className="section-subtitle">
                            {t('about_page.values_subtitle')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center group"
                            >
                                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 bg-primary-900 text-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-center mb-12">
                            {t('about_page.journey_title')}
                        </h2>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute right-1/2 transform translate-x-1/2 h-full w-1 bg-secondary-400"></div>
                        {timeline.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-5/12 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                                    <div className="bg-white text-primary-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <span className="inline-block bg-secondary-500 text-white text-sm font-bold px-4 py-1 rounded-full mb-3">{item.year}</span>
                                        <p className="text-base font-medium">{item.event}</p>
                                    </div>
                                </div>
                                <div className="w-2/12 flex justify-center relative">
                                    <div className="w-5 h-5 bg-secondary-400 rounded-full border-4 border-primary-800 shadow-lg z-10"></div>
                                </div>
                                <div className="w-5/12"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Company Details Section */}
            <section className="py-20 bg-gray-100">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">{t('about_page.company_info')}</h2>
                        <p className="section-subtitle">
                            {t('about_page.company_info_subtitle')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="card p-8"
                        >
                            <h3 className="text-xl font-bold mb-6 text-primary-800">
                                {t('about_page.official_data')}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">{t('about_page.trade_name')}</p>
                                    <p className="font-semibold">
                                        {t('about_page.company_name')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t('about_page.commercial_register')}</p>
                                    <p className="font-semibold">100776</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t('about_page.tax_card')}</p>
                                    <p className="font-semibold">537-340-483</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="card p-8"
                        >
                            <h3 className="text-xl font-bold mb-6 text-primary-800">
                                {t('about_page.contact_info')}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">{t('contact.info.email')}</p>
                                    <a href={companyInfo.contact.email.link} className="font-semibold hover:text-primary-600 transition-colors">
                                        {companyInfo.contact.email.display}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t('contact.info.phone')}</p>
                                    <a href={companyInfo.contact.phone.link} className="font-semibold hover:text-primary-600 transition-colors" dir="ltr">
                                        {companyInfo.contact.phone.display}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t('contact.info.whatsapp')}</p>
                                    <a href={companyInfo.contact.whatsapp.link} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary-600 transition-colors" dir="ltr">
                                        {companyInfo.contact.whatsapp.display}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-4">
                            {t('common.contact_us_today')}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {t('about_page.cta_subtitle')}
                        </p>
                        <Link
                            href="/contact"
                            className="bg-white text-secondary-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3 text-lg"
                            id="about-contact-btn"
                        >
                            <FaHandshake className="text-2xl" />
                            {t('common.contact_us')}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
