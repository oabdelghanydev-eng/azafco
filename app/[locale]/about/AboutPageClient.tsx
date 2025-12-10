'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaBullseye, FaHandshake, FaAward, FaIndustry, FaUsers, FaGlobe } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import { companyInfo } from '@/data/company';

export default function AboutPageClient() {
    const locale = useLocale();
    const isAr = locale === 'ar';

    const timeline = isAr ? [
        { year: '2008', event: 'تأسيس شركة ازافكو العالمية' },
        { year: '2008', event: 'بداية التصدير إلى دول الخليج' },
        { year: '2018', event: 'افتتاح المصنع الجديد في بلطيم' },
        { year: '2018', event: 'الحصول على شهادات الأيزو الدولية' },
        { year: '2018', event: 'التوسع في الأسواق' },
        { year: '2025', event: 'تحديث خطوط الإنتاج بأحدث التقنيات' },
    ] : [
        { year: '2008', event: 'AZAFCO International founded' },
        { year: '2008', event: 'Started exporting to Gulf countries' },
        { year: '2018', event: 'New factory opened in Motobas' },
        { year: '2018', event: 'ISO international certifications obtained' },
        { year: '2018', event: 'Market expansion' },
        { year: '2025', event: 'Production lines upgraded with latest technology' },
    ];

    const values = [
        {
            icon: <FaHandshake className="text-4xl text-primary-600" />,
            title: isAr ? 'الثقة والمصداقية' : 'Trust & Credibility',
            description: isAr
                ? 'نبني علاقات طويلة الأمد مع عملائنا على أساس الثقة المتبادلة'
                : 'Building long-term relationships with clients based on mutual trust',
        },
        {
            icon: <FaAward className="text-4xl text-secondary-600" />,
            title: isAr ? 'الجودة والتميز' : 'Quality & Excellence',
            description: isAr
                ? 'نلتزم بأعلى معايير الجودة في جميع منتجاتنا وخدماتنا'
                : 'Committed to highest quality standards in all products and services',
        },
        {
            icon: <FaUsers className="text-4xl text-green-600" />,
            title: isAr ? 'فريق محترف' : 'Professional Team',
            description: isAr
                ? 'فريق عمل متخصص وذو خبرة طويلة في مجال تصدير الأسماك'
                : 'Specialized team with extensive experience in fish export',
        },
        {
            icon: <FaGlobe className="text-4xl text-blue-600" />,
            title: isAr ? 'الريادة الإقليمية' : 'Regional Leadership',
            description: isAr
                ? 'نسعى لنكون الخيار الأول في منطقة الشرق الأوسط'
                : 'Striving to be the first choice in the Middle East region',
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
                            {isAr ? 'من نحن' : 'About Us'}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            {isAr
                                ? 'رحلة تميز وإنجاز في عالم تصدير الأسماك الطازجة منذ عام 2008'
                                : 'A journey of excellence in fresh fish export since 2008'}
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
                                {isAr ? 'قصة نجاحنا' : 'Our Success Story'}
                            </h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {isAr
                                    ? 'شركة ازافكو العالمية للاستثمار والتنمية هي واحدة من الشركات الرائدة في مجال تعبئة وتصدير الأسماك الطازجة في مصر. تأسست الشركة عام 2008 برؤية واضحة لتقديم أفضل منتجات الأسماك الطازجة للأسواق الإقليمية والدولية.'
                                    : 'AZAFCO International Investment & Development is one of the leading companies in fresh fish packaging and export in Egypt. Founded in 2008 with a clear vision to provide the best fresh fish products to regional and international markets.'}
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {isAr
                                    ? 'على مدار أكثر من 15 عاماً، نجحنا في بناء سمعة متميزة في الأسواق العربية من خلال التزامنا بالجودة والمصداقية وتقديم خدمات متميزة تلبي احتياجات عملائنا من الموزعين والمطاعم والفنادق.'
                                    : 'Over more than 15 years, we have built an excellent reputation in Arab markets through our commitment to quality and credibility, providing outstanding services to distributors, restaurants, and hotels.'}
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                {isAr
                                    ? 'نمتلك مصنعاً حديثاً مجهزاً بأحدث التقنيات في المنطقة الصناعية بمطوبس، كفر الشيخ، ونطبق أعلى معايير الجودة والسلامة الغذائية المعتمدة دولياً.'
                                    : 'We own a modern factory equipped with the latest technologies in the industrial zone of Motobas, Kafr El Sheikh, applying the highest internationally certified quality and food safety standards.'}
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
                                        <h4 className="font-bold text-lg">{isAr ? 'مصنع حديث' : 'Modern Factory'}</h4>
                                        <p className="text-sm text-gray-600">{isAr ? 'مجهز بأحدث التقنيات' : 'Latest technology equipped'}</p>
                                    </div>
                                    <div className="text-center">
                                        <FaAward className="text-5xl text-secondary-600 mx-auto mb-3" />
                                        <h4 className="font-bold text-lg">{isAr ? 'شهادات دولية' : 'International Certs'}</h4>
                                        <p className="text-sm text-gray-600">{isAr ? 'معتمدون من أهم الجهات' : 'Certified by top authorities'}</p>
                                    </div>
                                    <div className="text-center">
                                        <FaUsers className="text-5xl text-green-600 mx-auto mb-3" />
                                        <h4 className="font-bold text-lg">{isAr ? 'فريق محترف' : 'Professional Team'}</h4>
                                        <p className="text-sm text-gray-600">{isAr ? 'خبراء في التصدير' : 'Export experts'}</p>
                                    </div>
                                    <div className="text-center">
                                        <FaGlobe className="text-5xl text-blue-600 mx-auto mb-3" />
                                        <h4 className="font-bold text-lg">{isAr ? 'تواجد إقليمي' : 'Regional Presence'}</h4>
                                        <p className="text-sm text-gray-600">{isAr ? 'في 8 دول' : 'In 8 countries'}</p>
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
                                <h3 className="text-2xl font-bold text-primary-800">{isAr ? 'رؤيتنا' : 'Our Vision'}</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {isAr
                                    ? 'أن نكون الشركة الرائدة في تصدير الأسماك الطازجة في منطقة الشرق الأوسط وشمال أفريقيا، مع المحافظة على أعلى معايير الجودة والاستدامة البيئية.'
                                    : 'To be the leading company in fresh fish export in the Middle East and North Africa region, while maintaining the highest standards of quality and environmental sustainability.'}
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
                                <h3 className="text-2xl font-bold text-primary-800">{isAr ? 'رسالتنا' : 'Our Mission'}</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {isAr
                                    ? 'توفير أجود أنواع الأسماك الطازجة لعملائنا في الأسواق الإقليمية والدولية، مع الالتزام بأعلى معايير الجودة والسلامة الغذائية وتقديم خدمة عملاء متميزة.'
                                    : 'Providing the finest fresh fish to our customers in regional and international markets, with commitment to the highest quality and food safety standards and excellent customer service.'}
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
                        <h2 className="section-title">{isAr ? 'قيمنا' : 'Our Values'}</h2>
                        <p className="section-subtitle">
                            {isAr ? 'المبادئ التي نؤمن بها وتوجه عملنا' : 'The principles we believe in and guide our work'}
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
                            {isAr ? 'رحلتنا عبر السنين' : 'Our Journey Through the Years'}
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
                        <h2 className="section-title">{isAr ? 'معلومات الشركة' : 'Company Information'}</h2>
                        <p className="section-subtitle">
                            {isAr ? 'بيانات رسمية ومعلومات التواصل' : 'Official data and contact information'}
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
                                {isAr ? 'البيانات الرسمية' : 'Official Data'}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">{isAr ? 'الاسم التجاري' : 'Trade Name'}</p>
                                    <p className="font-semibold">
                                        {isAr ? 'ازافكو العالمية للاستثمار والتنمية ش.م.م' : 'AZAFCO International Investment & Development LLC'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{isAr ? 'السجل التجاري' : 'Commercial Register'}</p>
                                    <p className="font-semibold">100776</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{isAr ? 'البطاقة الضريبية' : 'Tax Card'}</p>
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
                                {isAr ? 'معلومات التواصل' : 'Contact Information'}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">{isAr ? 'البريد الإلكتروني' : 'Email'}</p>
                                    <a href={companyInfo.contact.email.link} className="font-semibold hover:text-primary-600 transition-colors">
                                        {companyInfo.contact.email.display}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{isAr ? 'الهاتف' : 'Phone'}</p>
                                    <a href={companyInfo.contact.phone.link} className="font-semibold hover:text-primary-600 transition-colors" dir="ltr">
                                        {companyInfo.contact.phone.display}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{isAr ? 'واتساب' : 'WhatsApp'}</p>
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
                            {isAr ? 'تواصل معنا اليوم' : 'Contact Us Today'}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {isAr
                                ? 'نحن هنا للإجابة على جميع استفساراتك وتلبية احتياجاتك من الأسماك الطازجة'
                                : 'We are here to answer all your inquiries and meet your fresh fish needs'}
                        </p>
                        <Link
                            href="/contact"
                            className="bg-white text-secondary-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3 text-lg"
                            id="about-contact-btn"
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
