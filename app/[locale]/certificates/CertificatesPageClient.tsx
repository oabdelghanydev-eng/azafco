'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCertificate, FaCheckCircle, FaAward, FaTimes, FaHandshake } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import { certificates } from '@/data/certificates';

export default function CertificatesPageClient() {
    const locale = useLocale();
    const isAr = locale === 'ar';
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const benefits = [
        {
            icon: <FaShieldAlt className="text-4xl text-primary-600" />,
            title: isAr ? 'ضمان الجودة' : 'Quality Assurance',
            description: isAr
                ? 'نضمن لعملائنا أعلى معايير الجودة المعتمدة دولياً'
                : 'We guarantee our customers the highest internationally certified quality standards',
        },
        {
            icon: <FaCertificate className="text-4xl text-green-600" />,
            title: isAr ? 'معايير عالمية' : 'Global Standards',
            description: isAr
                ? 'نلتزم بتطبيق أحدث المعايير العالمية في صناعة الأغذية'
                : 'We are committed to applying the latest global standards in the food industry',
        },
        {
            icon: <FaCheckCircle className="text-4xl text-blue-600" />,
            title: isAr ? 'رقابة مستمرة' : 'Continuous Monitoring',
            description: isAr
                ? 'خضوع دائم للتفتيش والمراجعة من الجهات المعتمدة'
                : 'Constant inspection and review by certified authorities',
        },
        {
            icon: <FaAward className="text-4xl text-secondary-600" />,
            title: isAr ? 'التميز المستمر' : 'Continuous Excellence',
            description: isAr
                ? 'نسعى دائماً للحصول على أحدث الشهادات والاعتمادات'
                : 'We always strive to obtain the latest certifications and accreditations',
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
                            {isAr ? 'شهاداتنا واعتماداتنا' : 'Our Certificates & Accreditations'}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            {isAr
                                ? 'نفخر بحصولنا على أهم الشهادات الدولية التي تؤكد التزامنا بأعلى معايير الجودة والسلامة'
                                : 'We are proud to have obtained the most important international certificates that confirm our commitment to the highest quality and safety standards'}
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
                            {isAr ? 'لماذا الشهادات مهمة؟' : 'Why Are Certificates Important?'}
                        </h2>
                        <p className="section-subtitle">
                            {isAr
                                ? 'التزامنا بالمعايير الدولية يضمن لكم الأفضل دائماً'
                                : 'Our commitment to international standards ensures you always get the best'}
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
                            {isAr ? 'شهاداتنا المعتمدة' : 'Our Certified Certificates'}
                        </h2>
                        <p className="section-subtitle">
                            {isAr
                                ? 'اضغط على أي شهادة لعرضها بحجم أكبر'
                                : 'Click on any certificate to view it in larger size'}
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
                                            {isAr ? 'جهة الإصدار:' : 'Issuer:'}
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
                    aria-label={isAr ? 'عرض الشهادة بحجم كامل' : 'View certificate in full size'}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 left-0 text-white text-3xl hover:text-gray-300 transition-colors"
                            title={isAr ? 'إغلاق' : 'Close'}
                            aria-label={isAr ? 'إغلاق عرض الشهادة' : 'Close certificate view'}
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
                            {isAr ? 'معايير الجودة والسلامة' : 'Quality & Safety Standards'}
                        </h2>
                        <p className="text-xl mb-8 max-w-3xl mx-auto">
                            {isAr
                                ? 'نطبق أعلى معايير الجودة والسلامة في جميع مراحل الإنتاج والتصدير'
                                : 'We apply the highest quality and safety standards in all stages of production and export'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-secondary-400 mb-2">100%</div>
                                <div>{isAr ? 'التزام بالمعايير الدولية' : 'Compliance with international standards'}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-secondary-400 mb-2">5+</div>
                                <div>{isAr ? 'شهادات دولية معتمدة' : 'International certified certificates'}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-secondary-400 mb-2">24/7</div>
                                <div>{isAr ? 'مراقبة جودة مستمرة' : 'Continuous quality monitoring'}</div>
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
                            {isAr ? 'هل تريد معرفة المزيد عن معايير الجودة لدينا؟' : 'Want to Learn More About Our Quality Standards?'}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {isAr
                                ? 'تواصل معنا للحصول على نسخ من شهاداتنا أو لمزيد من المعلومات'
                                : 'Contact us to get copies of our certificates or for more information'}
                        </p>
                        <Link
                            href="/contact"
                            className="bg-white text-secondary-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3 text-lg"
                            id="certificates-cta-btn"
                        >
                            <FaHandshake className="text-2xl" />
                            {isAr ? 'تواصل معنا' : 'Contact Us'}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
