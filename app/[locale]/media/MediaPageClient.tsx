'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaIndustry, FaAward, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import Layout from '@/components/Layout';
import { newsItems } from '@/data/news';

export default function MediaPageClient() {
    const locale = useLocale();
    const isAr = locale === 'ar';
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: isAr ? 'الكل' : 'All', icon: <FaNewspaper /> },
        { id: 'company', name: isAr ? 'أخبار الشركة' : 'Company News', icon: <FaIndustry /> },
        { id: 'industry', name: isAr ? 'أخبار القطاع' : 'Industry News', icon: <FaAward /> },
    ];

    const filteredNews = selectedCategory === 'all'
        ? newsItems
        : newsItems.filter(n => n.category === selectedCategory);

    const getCategoryLabel = (category: string) => {
        const cat = categories.find(c => c.id === category);
        return cat ? cat.name : category;
    };

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
                            {isAr ? 'المركز الإعلامي' : 'Media Center'}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            {isAr
                                ? 'تابع آخر أخبارنا وإنجازاتنا ومستجدات قطاع الأسماك في مصر'
                                : 'Follow our latest news, achievements, and fish industry updates in Egypt'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Statistics Banner */}
            <section className="py-8 bg-secondary-500 text-white">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold">50%</div>
                            <div className="text-sm">
                                {isAr ? 'من إنتاج مصر السمكي من كفر الشيخ' : "of Egypt's fish from Kafr El Sheikh"}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">750,000</div>
                            <div className="text-sm">
                                {isAr ? 'طن صادرات سنوية من كفر الشيخ' : 'tons annual exports'}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">#1</div>
                            <div className="text-sm">
                                {isAr ? 'مصر الأولى أفريقياً في الاستزراع' : 'Egypt #1 in Africa aquaculture'}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">#6</div>
                            <div className="text-sm">
                                {isAr ? 'مصر السادسة عالمياً' : 'Egypt 6th globally'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Categories Filter */}
            <section className="py-8 bg-gray-100 sticky top-20 z-40">
                <div className="container-custom">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id
                                    ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow'
                                    }`}
                                id={`filter-${category.id}`}
                                aria-pressed={selectedCategory === category.id}
                            >
                                {category.icon}
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((news, index) => (
                            <motion.article
                                key={news.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card hover:shadow-2xl group"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${news.category === 'company' ? 'bg-blue-100 text-blue-700' :
                                            news.category === 'industry' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {getCategoryLabel(news.category)}
                                        </span>
                                        <span className="text-gray-400 text-sm flex items-center gap-1">
                                            <FaCalendarAlt className="text-xs" />
                                            {news.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 text-primary-800 group-hover:text-primary-600 transition-colors">
                                        {isAr ? news.title : news.titleEn}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {isAr ? news.summary : news.summaryEn}
                                    </p>

                                    <div className="text-sm text-gray-500">
                                        <p className="mb-3">{isAr ? news.content : news.contentEn}</p>

                                        {news.source && (
                                            <div className={`flex items-center gap-2 pt-3 border-t border-gray-100 ${isAr ? '' : 'flex-row-reverse justify-end'}`}>
                                                <span>{isAr ? 'المصدر:' : 'Source:'}</span>
                                                {news.sourceUrl ? (
                                                    <a
                                                        href={news.sourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {news.source}
                                                        <FaExternalLinkAlt className="text-xs" />
                                                    </a>
                                                ) : (
                                                    <span>{news.source}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {filteredNews.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {isAr ? 'لا توجد أخبار في هذا القسم حالياً' : 'No news in this category currently'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
