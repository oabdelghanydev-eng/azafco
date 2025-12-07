'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import Layout from '@/components/Layout';
import { companyInfo } from '@/data/company';

export default function ContactPageClient() {
    const locale = useLocale();
    const isAr = locale === 'ar';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, integrate with email service or form backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    const contactInfo = [
        {
            icon: <FaPhone className="text-2xl" />,
            title: isAr ? 'الهاتف' : 'Phone',
            value: companyInfo.contact.phone.display,
            link: companyInfo.contact.phone.link,
            color: 'bg-blue-500',
        },
        {
            icon: <FaWhatsapp className="text-2xl" />,
            title: isAr ? 'واتساب' : 'WhatsApp',
            value: companyInfo.contact.whatsapp.display,
            link: companyInfo.contact.whatsapp.link,
            color: 'bg-green-500',
        },
        {
            icon: <FaEnvelope className="text-2xl" />,
            title: isAr ? 'البريد الإلكتروني' : 'Email',
            value: companyInfo.contact.email.display,
            link: companyInfo.contact.email.link,
            color: 'bg-red-500',
        },
        {
            icon: <FaClock className="text-2xl" />,
            title: isAr ? 'ساعات العمل' : 'Working Hours',
            value: isAr ? companyInfo.contact.workingHours : 'Sat - Thu: 8 AM - 5 PM',
            link: null,
            color: 'bg-purple-500',
        },
    ];

    const subjects = isAr
        ? [
            { value: '', label: 'اختر الموضوع' },
            { value: 'طلب أسعار', label: 'طلب أسعار' },
            { value: 'استفسار عام', label: 'استفسار عام' },
            { value: 'طلب توزيع', label: 'طلب توزيع' },
            { value: 'شكوى أو اقتراح', label: 'شكوى أو اقتراح' },
            { value: 'أخرى', label: 'أخرى' },
        ]
        : [
            { value: '', label: 'Select Subject' },
            { value: 'Price Request', label: 'Price Request' },
            { value: 'General Inquiry', label: 'General Inquiry' },
            { value: 'Distribution Request', label: 'Distribution Request' },
            { value: 'Complaint or Suggestion', label: 'Complaint or Suggestion' },
            { value: 'Other', label: 'Other' },
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
                            {isAr ? 'اتصل بنا' : 'Contact Us'}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            {isAr
                                ? 'نحن هنا للإجابة على جميع استفساراتك وتلبية احتياجاتك'
                                : 'We are here to answer all your inquiries and meet your needs'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 bg-gray-100">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card p-6 text-center hover:shadow-2xl group"
                            >
                                <div className={`${info.color} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                    {info.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                                {info.link ? (
                                    <a
                                        href={info.link}
                                        target={info.link.startsWith('http') ? '_blank' : undefined}
                                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="text-gray-600 hover:text-primary-600 transition-colors"
                                        dir="ltr"
                                    >
                                        {info.value}
                                    </a>
                                ) : (
                                    <span className="text-gray-600">{info.value}</span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-primary-800">
                                {isAr ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                            </h2>
                            <p className="text-gray-600 mb-8">
                                {isAr
                                    ? 'املأ النموذج التالي وسنقوم بالرد عليك في أقرب وقت ممكن'
                                    : 'Fill out the form below and we will get back to you as soon as possible'}
                            </p>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-100 border border-green-400 text-green-700 px-6 py-8 rounded-xl text-center"
                                >
                                    <FaPaperPlane className="text-4xl mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">
                                        {isAr ? 'تم إرسال رسالتك بنجاح!' : 'Message sent successfully!'}
                                    </h3>
                                    <p>{isAr ? 'سنقوم بالرد عليك في أقرب وقت' : 'We will respond to you shortly'}</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                placeholder={isAr ? 'أدخل اسمك' : 'Enter your name'}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                {isAr ? 'البريد الإلكتروني *' : 'Email *'}
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                placeholder="example@email.com"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                {isAr ? 'رقم الهاتف' : 'Phone Number'}
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                placeholder="+20 xxx xxx xxxx"
                                                dir="ltr"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                {isAr ? 'الموضوع *' : 'Subject *'}
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            >
                                                {subjects.map((s) => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            {isAr ? 'الرسالة *' : 'Message *'}
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                            placeholder={isAr ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-primary w-full flex items-center justify-center gap-2"
                                        id="contact-submit-btn"
                                    >
                                        <FaPaperPlane />
                                        {isAr ? 'إرسال الرسالة' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Map & Address */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-primary-800">
                                {isAr ? 'موقعنا' : 'Our Location'}
                            </h2>
                            <div className="card overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3413.1234567890123!2d30.912345678901234!3d31.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDA3JzI0LjQiTiAzMMKwNTQnNDQuNCJF!5e0!3m2!1sen!2seg!4v1234567890123!5m2!1sen!2seg"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={isAr ? 'موقع المصنع على الخريطة' : 'Factory location on map'}
                                />
                                <div className="p-6">
                                    <div className={`flex items-start gap-4 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                                        <FaMapMarkerAlt className="text-2xl text-primary-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">
                                                {isAr ? 'المصنع الرئيسي' : 'Main Factory'}
                                            </h3>
                                            <p className="text-gray-600">
                                                {isAr ? companyInfo.addresses.factory.address : companyInfo.addresses.factory.addressEn}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick WhatsApp Contact */}
                            <div className="mt-8 card p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <h3 className="font-bold text-xl mb-4">
                                    {isAr ? 'تواصل سريع عبر واتساب' : 'Quick WhatsApp Contact'}
                                </h3>
                                <p className="mb-4 opacity-90">
                                    {isAr
                                        ? 'للردود السريعة، تواصل معنا مباشرة عبر واتساب'
                                        : 'For quick responses, contact us directly via WhatsApp'}
                                </p>
                                <a
                                    href={companyInfo.contact.whatsapp.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-gray-100 transition-colors"
                                    id="contact-whatsapp-btn"
                                >
                                    <FaWhatsapp className="text-xl" />
                                    {isAr ? 'ابدأ المحادثة' : 'Start Chat'}
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
