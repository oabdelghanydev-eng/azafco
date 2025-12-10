'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCertificate, FaCheckCircle, FaAward, FaTimes, FaHandshake } from 'react-icons/fa';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import { certificates } from '@/data/certificates';

export default function CertificatesPageClient() {
    const locale = useLocale();
    const isAr = locale === 'ar';
    const t = useTranslations();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const benefits = [
        {
            icon: <FaShieldAlt className="text-4xl text-primary-600" />,
            title: t('certificates_page.quality_assurance'),
            description: t('certificates_page.qa_desc'),
        },
        {
            icon: <FaCertificate className="text-4xl text-green-600" />,
            title: t('certificates_page.global_standards'),
            description: t('certificates_page.gs_desc'),
        },
        {
            icon: <FaCheckCircle className="text-4xl text-blue-600" />,
            title: t('certificates_page.monitoring'),
            description: t('certificates_page.monitoring_desc'),
        },
        {
            icon: <FaAward className="text-4xl text-secondary-600" />,
            title: t('certificates_page.continuous_excellence'),
            description: t('certificates_page.ce_desc'),
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
                            {t('certificates_page.title')}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            {t('certificates_page.subtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-gray-100">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">
                            {t('certificates_page.why_important')}
                        </h2>
                        <p className="section-subtitle">
                            {t('certificates_page.why_subtitle')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card p-6 text-center hover:shadow-2xl group"
                            >
                                <div className="mb-4 transform group-hover:scale-110 transition-transform flex items-center justify-center">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                                <p className="text-gray-600 text-sm">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certificates Grid */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">
                            {t('certificates_page.certified_certs')}
                        </h2>
                        <p className="section-subtitle">
                            {t('certificates_page.click_to_view')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card overflow-hidden hover:shadow-2xl cursor-pointer group"
                                onClick={() => setSelectedImage(cert.image)}
                            >
                                <div className="relative h-64 bg-gray-100">
                                    <Image
                                        src={cert.image}
                                        alt={cert.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-primary-800">
                                        {cert.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {cert.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">
                                            {t('certificates_page.issuer')}
                                        </span>
                                        <span className="text-primary-600 font-medium">{cert.issuer}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal for enlarged image */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('certificates_page.click_to_view')}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 left-0 text-white text-3xl hover:text-gray-300 transition-colors"
                            title={t('common.close')}
                            aria-label={t('common.close')}
                        >
                            <FaTimes />
                        </button>
                        <Image
                            src={selectedImage}
                            alt="Certificate"
                            width={1000}
                            height={800}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Quality Standards Section */}
            <section className="py-16 bg-primary-900 text-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            {t('certificates_page.quality_standards')}
                        </h2>
                        <p className="text-xl mb-8 max-w-3xl mx-auto">
                            {t('certificates_page.standards_subtitle')}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-secondary-400 mb-2">100%</div>
                                <div>{t('certificates_page.compliance')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-secondary-400 mb-2">5+</div>
                                <div>{t('certificates_page.certified_intl')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-secondary-400 mb-2">24/7</div>
                                <div>{t('certificates_page.continuous_monitoring')}</div>
                            </div>
                        </div>
                    </motion.div>
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
                            {t('certificates_page.cta_title')}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {t('certificates_page.cta_subtitle')}
                        </p>
                        <Link
                            href="/contact"
                            className="bg-white text-secondary-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3 text-lg"
                            id="certificates-cta-btn"
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
