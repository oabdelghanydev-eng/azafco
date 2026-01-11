'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFish, FaWeight, FaThermometerHalf, FaTruck, FaHandshake } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function ProductsPageClient() {
    const t = useTranslations();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: t('products_page.filter.all') },
        { id: 'river', name: t('products_page.filter.freshwater') },
        { id: 'sea', name: t('products_page.filter.saltwater') },
    ];

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const qualityFeatures = [
        {
            icon: <FaFish className="text-3xl" />,
            color: 'bg-primary-600',
            titleKey: 'products_page.quality.fresh_fish',
            descKey: 'products_page.quality.fresh_fish_desc'
        },
        {
            icon: <FaThermometerHalf className="text-3xl" />,
            color: 'bg-blue-500',
            titleKey: 'products_page.quality.perfect_cooling',
            descKey: 'products_page.quality.perfect_cooling_desc'
        },
        {
            icon: <FaTruck className="text-3xl" />,
            color: 'bg-green-500',
            titleKey: 'products_page.quality.fast_delivery',
            descKey: 'products_page.quality.fast_delivery_desc'
        },
        {
            icon: <FaWeight className="text-3xl" />,
            color: 'bg-secondary-500',
            titleKey: 'products_page.quality.accurate_weights',
            descKey: 'products_page.quality.accurate_weights_desc'
        }
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-16">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" id="products-page-title">
                            {t('products_page.title')}
                        </h1>
                        <p className="text-xl text-white/80">
                            {t('products_page.subtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom">
                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category.id
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                showDetails={true}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-100">
                <div className="container-custom">
                    <h2 className="section-title">
                        {t('products_page.quality.title')}
                    </h2>
                    <p className="section-subtitle">
                        {t('products_page.quality.subtitle')}
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
                                <h3 className="font-bold text-lg mb-2">{t(feature.titleKey)}</h3>
                                <p className="text-gray-600 text-sm">{t(feature.descKey)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary-900 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        {t('products_page.cta.title')}
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        {t('products_page.cta.subtitle')}
                    </p>
                    <Link
                        href="/contact"
                        className="bg-secondary-500 text-white px-10 py-4 rounded-full font-bold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3 text-lg"
                        id="products-cta-btn"
                    >
                        <FaHandshake className="text-2xl" />
                        {t('products_page.cta.button')}
                    </Link>
                </div>
            </section>
        </Layout>
    );
}
