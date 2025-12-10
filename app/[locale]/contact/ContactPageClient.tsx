'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaWpforms, FaEnvelope, FaMapMarkerAlt, FaPhone, FaClock, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useLocale, useTranslations } from 'next-intl';
import Layout from '@/components/Layout';
import { companyInfo } from '@/data/company';

export default function ContactPageClient() {
    const locale = useLocale();
    const isAr = locale === 'ar';
    const t = useTranslations();

    const contactChannels = [
        {
            icon: <FaWhatsapp className="text-4xl" />,
            title: t('contact_page.whatsapp_title'),
            subtitle: t('contact_page.whatsapp_subtitle'),
            description: t('contact_page.whatsapp_desc'),
            note: t('contact_page.whatsapp_note'),
            buttonText: t('common.start_chat_now'),
            link: companyInfo.contact.whatsapp.link,
            gradient: 'from-green-500 to-emerald-600',
            iconBg: 'bg-green-500',
            badge: t('common.instant_response'),
            badgeColor: 'bg-green-100 text-green-700',
        },
        {
            icon: <FaWpforms className="text-4xl" />,
            title: t('contact_page.b2b_title'),
            subtitle: t('contact_page.b2b_subtitle'),
            description: t('contact_page.b2b_desc'),
            note: t('contact_page.b2b_note'),
            buttonText: t('contact_page.open_form'),
            link: 'https://forms.gle/rEYRPSP3vpW8Cggv5',
            gradient: 'from-primary-600 to-primary-700',
            iconBg: 'bg-primary-600',
            badge: '24-48h',
            badgeColor: 'bg-primary-100 text-primary-700',
        },
        {
            icon: <FaEnvelope className="text-4xl" />,
            title: t('contact_page.email_title'),
            subtitle: t('contact_page.email_subtitle'),
            description: t('contact_page.email_desc'),
            note: t('contact_page.email_note'),
            buttonText: t('contact_page.send_email'),
            link: companyInfo.contact.email.link,
            gradient: 'from-red-500 to-rose-600',
            iconBg: 'bg-red-500',
            badge: t('contact_page.quick_response'),
            badgeColor: 'bg-red-100 text-red-700',
        },
    ];

    const quickInfo = [
        {
            icon: <FaPhone className="text-lg" />,
            label: t('contact.info.phone'),
            value: companyInfo.contact.phone.display,
            link: companyInfo.contact.phone.link,
        },
        {
            icon: <FaClock className="text-lg" />,
            label: t('contact_page.office_hours'),
            value: t('contact_page.office_hours_value'),
            link: null,
        },
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-400 rounded-full blur-3xl"></div>
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            {t('contact.title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                            {t('contact.subtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Channels Section */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {t('contact_page.channels_title')}
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            {t('contact_page.channels_subtitle')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {contactChannels.map((channel, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="group h-full"
                            >
                                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col border border-gray-100 relative">
                                    {/* Top gradient bar */}
                                    <div className={`h-1.5 bg-gradient-to-r ${channel.gradient}`}></div>

                                    {/* Badge and Icon header - flex for proper RTL/LTR alignment */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-6">
                                            {/* Icon */}
                                            <div className={`w-16 h-16 ${channel.iconBg} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                {channel.icon}
                                            </div>
                                            {/* Badge */}
                                            <span className={`${channel.badgeColor} text-xs font-bold px-3 py-1 rounded-full`}>
                                                {channel.badge}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {channel.title}
                                        </h3>
                                        <p className="text-sm font-semibold text-gray-500 mb-4">
                                            {channel.subtitle}
                                        </p>
                                        <p className="text-gray-600 leading-relaxed mb-4 flex-1">
                                            {channel.description}
                                        </p>

                                        {/* Note with checkmark */}
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                            <div className="flex gap-3">
                                                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {channel.note}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Button */}
                                        <a
                                            href={channel.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-full text-center bg-gradient-to-r ${channel.gradient} text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3`}
                                        >
                                            {channel.buttonText}
                                            <FaArrowLeft className={`text-sm ${isAr ? '' : 'rotate-180'}`} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Locations Section */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {t('contact_page.locations_title')}
                        </h2>
                        <p className="text-gray-600 text-lg">
                            {t('contact_page.locations_subtitle')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Main Office */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden group"
                        >
                            <div className="p-6 bg-gradient-to-r from-primary-50 to-white border-b border-primary-100">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-600 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <FaMapMarkerAlt className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1 text-primary-800">
                                            {t('contact_page.main_office')}
                                        </h3>
                                        <p className="text-gray-600">
                                            {isAr ? companyInfo.addresses.main.address : companyInfo.addresses.main.addressEn}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-64">
                                <iframe
                                    src={companyInfo.addresses.main.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={t('contact_page.main_on_map')}
                                ></iframe>
                            </div>
                        </motion.div>

                        {/* Factory */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden group"
                        >
                            <div className="p-6 bg-gradient-to-r from-secondary-50 to-white border-b border-secondary-100">
                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-500 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <FaMapMarkerAlt className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1 text-secondary-700">
                                            {t('contact_page.factory')}
                                        </h3>
                                        <p className="text-gray-600">
                                            {isAr ? companyInfo.addresses.factory.address : companyInfo.addresses.factory.addressEn}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-64">
                                <iframe
                                    src={companyInfo.addresses.factory.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={t('contact_page.factory_on_map')}
                                ></iframe>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </Layout >
    );
}
