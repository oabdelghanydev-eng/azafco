import React, { useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import CertificateCard from '../components/CertificateCard'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaCertificate, FaCheckCircle, FaAward, FaShieldAlt, FaTimes } from 'react-icons/fa'
import { certificates } from '../data/certificates'
import { useI18n } from '../contexts/I18nContext'

const CertificatesPage = () => {
  const { locale } = useI18n()
  const isAr = locale === 'ar'
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
  ]

  return (
    <Layout>
      <SEO
        title="الشهادات والاعتمادات"
        titleEn="Quality Certificates - ISO 22000, HACCP, ISO 9001 Certified"
        description="شهادات الجودة والاعتمادات الدولية لشركة ازافكو - ISO 22000، HACCP، ISO 14001، ISO 9001، ISO 45001"
        descriptionEn="AZAFCO International quality certifications: ISO 22000, HACCP, ISO 14001, ISO 9001, ISO 45001. Certified food safety standards for premium fish export."
        url="https://azafco.com.eg/certificates"
        keywords="ISO 22000, HACCP, ISO 9001, ISO 14001, ISO 45001, food safety certification, fish quality standards, AZAFCO certificates"
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
              <CertificateCard
                key={cert.id}
                certificate={cert}
                index={index}
                onImageClick={setSelectedImage}
              />
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
                <p className="text-lg">
                  {isAr ? 'التزام بمعايير السلامة' : 'Safety Standards Compliance'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-secondary-400 mb-2">24/7</div>
                <p className="text-lg">
                  {isAr ? 'مراقبة الجودة' : 'Quality Monitoring'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-secondary-400 mb-2">7+</div>
                <p className="text-lg">
                  {isAr ? 'شهادات دولية معتمدة' : 'Certified International Certificates'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-primary-800">
              {isAr ? 'ثقة عملائنا هي أساس نجاحنا' : 'Our Customers\' Trust is the Foundation of Our Success'}
            </h2>
            <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
              {isAr
                ? 'للمزيد من المعلومات حول شهاداتنا ومعايير الجودة لدينا، لا تتردد في التواصل معنا'
                : 'For more information about our certificates and quality standards, don\'t hesitate to contact us'}
            </p>
            <a
              href="https://wa.me/201007514567"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
              id="certificates-cta-btn"
              aria-label={isAr ? 'تواصل معنا للاستفسار عن الشهادات' : 'Contact us for certificate inquiries'}
            >
              {isAr ? 'تواصل معنا للاستفسار' : 'Contact Us for Inquiries'}
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}

export default CertificatesPage
