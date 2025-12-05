import React, { useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaPaperPlane, FaHandshake } from 'react-icons/fa'
import { companyInfo } from '../data/company'
import { useI18n } from '../contexts/I18nContext'

const ContactPage = () => {
    const { locale } = useI18n()
    const isAr = locale === 'ar'

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const message = isAr
            ? `*رسالة جديدة من الموقع*%0A%0A*الاسم:* ${formData.name}%0A*البريد:* ${formData.email}%0A*الهاتف:* ${formData.phone}%0A*الموضوع:* ${formData.subject}%0A*الرسالة:* ${formData.message}`
            : `*New message from website*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Subject:* ${formData.subject}%0A*Message:* ${formData.message}`

        window.open(`${companyInfo.contact.whatsapp.link}?text=${message}`, '_blank')

        setIsSubmitting(false)
        setSubmitted(true)

        setTimeout(() => {
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
            setSubmitted(false)
        }, 3000)
    }

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
    ]

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
        ]

    return (
        <Layout>
            <SEO
                title={isAr ? 'اتصل بنا' : 'Contact Us'}
                description={isAr
                    ? `تواصل مع ${companyInfo.fullName}. نحن هنا للإجابة على استفساراتك`
                    : 'Contact AZAFCO International. We are here to answer your inquiries'}
                url="https://azafco.com.eg/contact"
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
                                                {subjects.map(s => (
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
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                {isAr ? 'جاري الإرسال...' : 'Sending...'}
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                {isAr ? 'إرسال الرسالة' : 'Send Message'}
                                            </>
                                        )}
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

                            <div className="space-y-6">
                                {/* Main Center */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className={`p-6 ${isAr ? 'border-r-4' : 'border-l-4'} border-primary-600`}>
                                        <div className="flex items-start gap-4 mb-4">
                                            <FaMapMarkerAlt className="text-2xl text-primary-600 mt-1" />
                                            <div>
                                                <h3 className="font-bold text-lg mb-1">
                                                    {isAr ? companyInfo.addresses.main.title : 'Main Office'}
                                                </h3>
                                                <p className="text-gray-600">{isAr ? companyInfo.addresses.main.address : companyInfo.addresses.main.addressEn}</p>
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
                                </div>

                                {/* Factory */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className={`p-6 ${isAr ? 'border-r-4' : 'border-l-4'} border-secondary-500`}>
                                        <div className="flex items-start gap-4 mb-4">
                                            <FaMapMarkerAlt className="text-2xl text-secondary-500 mt-1" />
                                            <div>
                                                <h3 className="font-bold text-lg mb-1">
                                                    {isAr ? companyInfo.addresses.factory.title : 'Factory'}
                                                </h3>
                                                <p className="text-gray-600">{isAr ? companyInfo.addresses.factory.address : companyInfo.addresses.factory.addressEn}</p>
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
                            {isAr ? 'تفضل التواصل المباشر؟' : 'Prefer Direct Contact?'}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {isAr
                                ? 'تواصل معنا الآن عبر واتساب للحصول على رد فوري'
                                : 'Contact us now via WhatsApp for an immediate response'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={companyInfo.contact.whatsapp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-white text-secondary-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                id="contact-whatsapp-btn"
                            >
                                <FaWhatsapp className="text-2xl" />
                                {isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                            </a>
                            <a
                                href="https://forms.gle/rEYRPSP3vpW8Cggv5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-primary-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                id="contact-partnership-btn"
                            >
                                <FaHandshake className="text-2xl" />
                                {isAr ? 'طلب شراكة تجارية' : 'Request Partnership'}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    )
}

export default ContactPage
