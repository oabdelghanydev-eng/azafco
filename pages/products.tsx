import React, { useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import ProductCard from '../components/ProductCard'
import { motion } from 'framer-motion'
import { FaFish, FaWeight, FaThermometerHalf, FaTruck } from 'react-icons/fa'
import { products, Product } from '../data/products'
import { companyInfo } from '../data/company'
import { useI18n } from '../contexts/I18nContext'

const ProductsPage = () => {
  const { t, locale } = useI18n()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: locale === 'ar' ? 'جميع المنتجات' : 'All Products' },
    { id: 'river', name: locale === 'ar' ? 'أسماك المياه العذبة' : 'Freshwater Fish' },
    { id: 'sea', name: locale === 'ar' ? 'أسماك المياه المالحة' : 'Saltwater Fish' },
  ]

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  const qualityFeatures = [
    {
      icon: <FaFish className="text-3xl" />,
      color: 'bg-primary-600',
      title: locale === 'ar' ? 'أسماك طازجة' : 'Fresh Fish',
      desc: locale === 'ar' ? 'من المزارع مباشرة إلى عملائنا' : 'Direct from farms to our customers'
    },
    {
      icon: <FaThermometerHalf className="text-3xl" />,
      color: 'bg-blue-500',
      title: locale === 'ar' ? 'تبريد مثالي' : 'Perfect Cooling',
      desc: locale === 'ar' ? 'درجة حرارة محكومة طوال الرحلة' : 'Controlled temperature throughout'
    },
    {
      icon: <FaTruck className="text-3xl" />,
      color: 'bg-green-500',
      title: locale === 'ar' ? 'توصيل سريع' : 'Fast Delivery',
      desc: locale === 'ar' ? 'نضمن وصول المنتج في أسرع وقت' : 'We ensure fastest delivery time'
    },
    {
      icon: <FaWeight className="text-3xl" />,
      color: 'bg-secondary-500',
      title: locale === 'ar' ? 'أوزان دقيقة' : 'Accurate Weights',
      desc: locale === 'ar' ? 'دقة في الأوزان والأحجام' : 'Precision in weights and sizes'
    }
  ]

  return (
    <Layout>
      <SEO
        title={locale === 'ar' ? 'المنتجات' : 'Products'}
        description={locale === 'ar'
          ? 'تصفح مجموعتنا الواسعة من الأسماك الطازجة - بلطي، بوري، قاروص، مبروكة وغيرها.'
          : 'Browse our wide range of fresh fish - Tilapia, Mullet, Sea Bass, and more.'}
        url="https://azafco.com.eg/products"
        keywords={locale === 'ar'
          ? 'أسماك طازجة، بلطي، بوري، قاروص، مبروكة، أسماك مصرية، تصدير أسماك'
          : 'fresh fish, tilapia, mullet, sea bass, Egyptian fish, fish export'}
        products={products.map(p => ({
          name: p.name,
          nameEn: p.nameEn,
          description: p.description,
          descriptionEn: p.descriptionEn,
          image: p.image,
          category: p.category
        }))}
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('products.title')}</h1>
            <p className="text-xl max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-100 sticky top-20 z-40">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow'
                  }`}
                id={`filter-${category.id}`}
                aria-pressed={selectedCategory === category.id}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                showDetails={true}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="container-custom">
          <h2 className="section-title">
            {locale === 'ar' ? 'معايير الجودة لدينا' : 'Our Quality Standards'}
          </h2>
          <p className="section-subtitle">
            {locale === 'ar'
              ? 'نضمن لكم أعلى معايير الجودة في جميع منتجاتنا'
              : 'We guarantee the highest quality standards in all our products'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {qualityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`${feature.color} text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            {locale === 'ar' ? 'لديك طلب خاص؟' : 'Have a Special Request?'}
          </h2>
          <p className="text-xl mb-8">
            {locale === 'ar'
              ? 'نحن هنا لتلبية جميع احتياجاتك من الأسماك الطازجة'
              : 'We are here to meet all your fresh fish needs'}
          </p>
          <a
            href={companyInfo.contact.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-block"
            id="products-cta-btn"
            aria-label={locale === 'ar' ? 'تواصل معنا عبر واتساب لطلب خاص' : 'Contact us via WhatsApp'}
          >
            {locale === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}
          </a>
        </div>
      </section>
    </Layout>
  )
}

export default ProductsPage
