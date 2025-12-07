'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaShip, FaHandshake, FaMapMarkedAlt, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import Layout from '@/components/Layout';
import { marketCountries } from '@/data/markets';
import { companyInfo } from '@/data/company';

export default function MarketsPageClient() {
    const locale = useLocale();
    const isAr = locale === 'ar';

    const stats = [
        { icon: <FaGlobe />, number: '8+', label: isAr ? 'دولة' : 'Countries' },
        { icon: <FaShip />, number: '5000+', label: isAr ? 'طن سنوياً' : 'Tons Yearly' },
        { icon: <FaHandshake />, number: '500+', label: isAr ? 'عميل' : 'Clients' },
        { icon: <FaMapMarkedAlt />, number: '15+', label: isAr ? 'سنة خبرة' : 'Years Experience' },
    ];

    const advantages = [
        {
            icon: <FaShip className="text-4xl text-primary-600" />,
            title: isAr ? 'شحن موثوق' : 'Reliable Shipping',
            description: isAr
                ? 'شبكة لوجستية قوية تضمن وصول منتجاتنا طازجة لجميع الأسواق'
                : 'Strong logistics network ensuring fresh product delivery to all markets',
        },
        {
            icon: <FaHandshake className="text-4xl text-secondary-600" />,
            title: isAr ? 'شراكات استراتيجية' : 'Strategic Partnerships',
            description: isAr
                ? 'نبني علاقات طويلة الأمد مع عملائنا ونعتبرهم شركاء نجاح'
                : 'We build long-term relationships with our customers as success partners',
        },
        {
            icon: <FaMapMarkedAlt className="text-4xl text-green-600" />,
            title: isAr ? 'تغطية واسعة' : 'Wide Coverage',
            description: isAr
                ? 'شبكة توزيع قوية تغطي أهم الأسواق في منطقة الخليج والشرق الأوسط'
                : 'Strong distribution network covering key markets in the Gulf and Middle East',
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
                            {isAr ? 'أسواقنا' : 'Our Markets'}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            {isAr
                                ? 'نفخر بخدمة عملائنا في أهم الأسواق الإقليمية بمنتجات عالية الجودة'
                                : 'We proudly serve our clients in the most important regional markets with high-quality products'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-gray-100">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-primary-600 text-4xl mb-2 flex justify-center">{stat.icon}</div>
                                <div className="text-3xl font-bold text-primary-800 mb-1">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Markets Grid */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">
                            {isAr ? 'الدول التي نصدر إليها' : 'Countries We Export To'}
                        </h2>
                        <p className="section-subtitle">
                            {isAr ? 'خبرة طويلة في خدمة أسواق المنطقة' : 'Long experience serving regional markets'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {marketCountries.map((market, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card p-6 hover:shadow-2xl group transform hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-12 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                        <img
                                            src={market.flag}
                                            alt={`${isAr ? 'علم' : 'Flag of'} ${isAr ? market.country : market.countryEn}`}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-primary-800 group-hover:text-primary-600 transition-colors">
                                            {isAr ? market.country : market.countryEn}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    {isAr ? market.description : market.descriptionEn}
                                </p>
                                <div className="space-y-2 mb-4">
                                    {(isAr ? market.features : market.featuresEn).map((feature, idx) => (
                                        <div key={idx} className={`flex items-center ${isAr ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                                            <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        {isAr ? 'نخدم هذا السوق منذ' : 'Serving since'}
                                    </span>
                                    <span className="text-lg font-bold px-3 py-1 rounded-full bg-primary-50 text-primary-600">
                                        {isAr && market.sinceAr ? market.sinceAr : market.since}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className="py-20 bg-gray-100">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">
                            {isAr ? 'مميزات التعامل معنا' : 'Why Work With Us'}
                        </h2>
                        <p className="section-subtitle">
                            {isAr ? 'نقدم أكثر من مجرد منتجات' : 'We offer more than just products'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {advantages.map((advantage, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card p-8 text-center group hover:shadow-2xl"
                            >
                                <div className="mb-4 transform group-hover:scale-110 transition-transform flex justify-center">
                                    {advantage.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                                <p className="text-gray-600">{advantage.description}</p>
                            </motion.div>
                        ))}
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
                            {isAr ? 'هل تريد أن تصبح موزعاً لدينا؟' : 'Want to Become Our Distributor?'}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {isAr
                                ? 'نبحث دائماً عن شركاء جدد في الأسواق الإقليمية والدولية'
                                : 'We are always looking for new partners in regional and international markets'}
                        </p>
                        <a
                            href={companyInfo.contact.whatsapp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-secondary-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                            id="markets-cta-btn"
                        >
                            <FaWhatsapp className="text-xl" />
                            {isAr ? 'تواصل معنا الآن' : 'Contact Us Now'}
                        </a>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
