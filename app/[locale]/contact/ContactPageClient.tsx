'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaWpforms, FaEnvelope, FaMapMarkerAlt, FaPhone, FaClock, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import Layout from '@/components/Layout';
import { companyInfo } from '@/data/company';

export default function ContactPageClient() {
    const locale = useLocale();
    const isAr = locale === 'ar';

    const contactChannels = [
        {
            icon: <FaWhatsapp className="text-4xl" />,
            title: isAr ? 'الاستعلامات عبر واتساب' : 'WhatsApp Inquiries',
            subtitle: isAr ? 'للاستفسارات الفورية' : 'For Instant Inquiries',
            description: isAr
                ? 'يمكنك التواصل مع فريق الاستعلامات مباشرة عبر واتساب للإجابة على أي سؤال أو للحصول على معلومات سريعة حول منتجاتنا وخدماتنا.'
                : 'Contact our inquiry team directly via WhatsApp to answer any question or get quick information about our products and services.',
            note: isAr
                ? 'موجّه للاستفسارات العامة فقط، مع توفير ردود سريعة لدعمك في اتخاذ قرارك.'
                : 'Designed for general inquiries only, with fast responses to support your decision-making.',
            buttonText: isAr ? 'ابدأ المحادثة الآن' : 'Start Chat Now',
            link: companyInfo.contact.whatsapp.link,
            gradient: 'from-green-500 to-emerald-600',
            iconBg: 'bg-green-500',
            badge: isAr ? 'رد فوري' : 'Instant Response',
            badgeColor: 'bg-green-100 text-green-700',
        },
        {
            icon: <FaWpforms className="text-4xl" />,
            title: isAr ? 'نموذج التواصل للشركات' : 'B2B Application Form',
            subtitle: isAr ? 'للطلبات التجارية وبناء الشراكات' : 'For Business Requests & Partnerships',
            description: isAr
                ? 'يرجى تعبئة نموذج التواصل المخصّص للشركات لتزويدنا ببيانات نشاطك التجاري، المنتجات المطلوبة، والكميات المتوقعة.'
                : 'Please fill out our B2B contact form to provide us with your business details, required products, and expected quantities.',
            note: isAr
                ? 'يساعدنا النموذج على فهم احتياجاتك بدقة والتواصل معك بخطوات واضحة لتأسيس التعاون. تتم مراجعة جميع الطلبات خلال 24–48 ساعة.'
                : 'The form helps us understand your needs precisely and contact you with clear steps to establish cooperation. All requests are reviewed within 24-48 hours.',
            buttonText: isAr ? 'افتح النموذج' : 'Open Form',
            link: 'https://forms.gle/rEYRPSP3vpW8Cggv5',
            gradient: 'from-primary-600 to-primary-700',
            iconBg: 'bg-primary-600',
            badge: isAr ? '24-48 ساعة' : '24-48 Hours',
            badgeColor: 'bg-primary-100 text-primary-700',
        },
        {
            icon: <FaEnvelope className="text-4xl" />,
            title: isAr ? 'البريد الإلكتروني' : 'Business Email',
            subtitle: isAr ? 'للمراسلات الرسمية والملفات المرفقة' : 'For Official Correspondence & Attachments',
            description: isAr
                ? 'يمكنك إرسال استفساراتك أو طلبات عروض الأسعار عبر البريد الإلكتروني.'
                : 'You can send your inquiries or quote requests via email.',
            note: isAr
                ? 'هذه القناة مناسبة للمراسلات التفصيلية، تبادل الملفات، والطلبات الرسمية التي تتطلب توثيقاً أو متابعة مكتوبة. سيقوم فريقنا بالرد خلال وقت قصير مع جميع التفاصيل المطلوبة.'
                : 'This channel is suitable for detailed correspondence, file exchange, and official requests that require documentation or written follow-up. Our team will respond shortly with all required details.',
            buttonText: isAr ? 'أرسل بريد إلكتروني' : 'Send Email',
            link: companyInfo.contact.email.link,
            gradient: 'from-red-500 to-rose-600',
            iconBg: 'bg-red-500',
            badge: isAr ? 'رد سريع' : 'Quick Response',
            badgeColor: 'bg-red-100 text-red-700',
        },
    ];

    const quickInfo = [
        {
            icon: <FaPhone className="text-lg" />,
            label: isAr ? 'الهاتف' : 'Phone',
            value: companyInfo.contact.phone.display,
            link: companyInfo.contact.phone.link,
        },
        {
            icon: <FaClock className="text-lg" />,
            label: isAr ? 'ساعات العمل' : 'Working Hours',
            value: isAr ? companyInfo.contact.workingHours : 'Sat - Thu: 8 AM - 5 PM',
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
                            {isAr ? 'تواصل معنا' : 'Get in Touch'}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                            {isAr
                                ? 'اختر الطريقة الأنسب لك للتواصل مع فريقنا المتخصص'
                                : 'Choose the most suitable way to connect with our specialized team'}
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
                            {isAr ? 'قنوات التواصل المتاحة' : 'Available Contact Channels'}
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            {isAr
                                ? 'كل قناة مصممة لتلبية احتياجات مختلفة - اختر ما يناسب طلبك'
                                : 'Each channel is designed to meet different needs - choose what suits your request'}
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

                                    {/* Badge */}
                                    <div className="absolute top-6 left-6">
                                        <span className={`${channel.badgeColor} text-xs font-bold px-3 py-1 rounded-full`}>
                                            {channel.badge}
                                        </span>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        {/* Icon */}
                                        <div className={`w-16 h-16 ${channel.iconBg} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            {channel.icon}
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
                            {isAr ? 'مواقعنا' : 'Our Locations'}
                        </h2>
                        <p className="text-gray-600 text-lg">
                            {isAr ? 'زورونا في أي من مواقعنا' : 'Visit us at any of our locations'}
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
                                            {isAr ? companyInfo.addresses.main.title : 'Main Office'}
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
                                    title={isAr ? 'المركز الرئيسي على الخريطة' : 'Main office on map'}
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
                                            {isAr ? companyInfo.addresses.factory.title : 'Factory'}
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
                                    title={isAr ? 'المصنع على الخريطة' : 'Factory on map'}
                                ></iframe>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
