import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { FaGlobe, FaMapMarkedAlt, FaShip, FaHandshake, FaChartLine, FaUsers, FaCheckCircle } from 'react-icons/fa'
import { markets, Market } from '../data/markets'
import { companyInfo } from '../data/company'
import { useI18n } from '../contexts/I18nContext'

const MarketsPage = () => {
  const { locale } = useI18n()
  const isAr = locale === 'ar'

  const stats = [
    { number: companyInfo.stats.clients, label: isAr ? 'عميل راضي' : 'Satisfied Clients', icon: <FaUsers /> },
    { number: companyInfo.stats.tonnage, label: isAr ? 'طن شهرياً' : 'Tons Monthly', icon: <FaShip /> },
    { number: companyInfo.stats.countries, label: isAr ? 'دول نصدر إليها' : 'Export Countries', icon: <FaGlobe /> },
    { number: companyInfo.stats.experience, label: isAr ? 'سنة خبرة' : 'Years Experience', icon: <FaChartLine /> },
  ]

  const advantages = [
    {
      icon: <FaShip className="text-4xl text-primary-600" />,
      title: isAr ? 'شحن دولي محترف' : 'Professional International Shipping',
      description: isAr
        ? 'نتعامل مع أفضل شركات الشحن المبرد لضمان وصول المنتج طازجاً'
        : 'We work with the best refrigerated shipping companies to ensure fresh delivery',
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
  ]

  return (
    <Layout>
      <SEO
        title={isAr ? 'أسواقنا' : 'Our Markets'}
        description={isAr
          ? 'نصدر أجود الأسماك الطازجة إلى الإمارات، الكويت، قطر، البحرين، لبنان والعراق'
          : 'We export the finest fresh fish to UAE, Kuwait, Qatar, Bahrain, Lebanon and Iraq'}
        url="https://azafco.com.eg/markets"
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
            {markets.map((market, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card p-6 hover:shadow-2xl group transform hover:-translate-y-2 transition-all duration-300 border-t-4 ${market.status === 'paused' ? 'border-yellow-500 opacity-80' :
                  market.status === 'coming-soon' ? 'border-blue-500' :
                    'border-transparent hover:border-primary-500'
                  }`}
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
                    {market.status === 'paused' && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        {isAr ? 'متوقف حالياً' : 'Currently Paused'}
                      </span>
                    )}
                    {market.status === 'coming-soon' && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {isAr ? 'قريباً' : 'Coming Soon'}
                      </span>
                    )}
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
                  <span className={`text-lg font-bold px-3 py-1 rounded-full ${market.status === 'coming-soon' ? 'bg-blue-50 text-blue-600' :
                    market.status === 'paused' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-primary-50 text-primary-600'
                    }`}>{isAr && market.sinceAr ? market.sinceAr : market.since}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20">
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
                className="text-center"
              >
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
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
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              {isAr ? 'هل تريد أن تصبح شريكاً لنا؟' : 'Want to Become Our Partner?'}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {isAr
                ? 'انضم إلى قائمة عملائنا المميزين واحصل على أفضل منتجات الأسماك الطازجة'
                : 'Join our distinguished clients list and get the best fresh fish products'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={companyInfo.contact.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-block"
                id="markets-whatsapp-btn"
              >
                {isAr ? 'ابدأ التعاون معنا' : 'Start Cooperation'}
              </a>
              <a
                href={companyInfo.contact.email.link}
                className="bg-white text-primary-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
                id="markets-email-btn"
              >
                {isAr ? 'راسلنا عبر البريد' : 'Email Us'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}

export default MarketsPage
