'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    FaHandshake, FaFish, FaShip, FaUsers, FaChartLine, FaIndustry, FaThermometerHalf,
    FaBox, FaPlane, FaCalendarCheck, FaAward, FaEnvelopeOpenText, FaClipboardCheck,
    FaCheckCircle, FaArrowRight,
} from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import { products, categoryLabelKey, categoryBadgeClass } from '@/data/products';
import { companyInfo } from '@/data/company';

// Left out of the EU page (see docs/reports/species-identification.md):
// - eels: European eel (Anguilla anguilla); EU import/export suspended since 2010 (CITES App. II)
// - buni: wild-caught Nile barb, while the EU opening covers Egyptian *farmed* fish (owner to confirm species)
const EXCLUDED_FOR_EU = ['eels', 'buni'];
const euProducts = products.filter(p => p.available && !EXCLUDED_FOR_EU.includes(p.translationKey));

type Step = { title: string; desc: string };

export default function EUBuyersPageClient() {
    const t = useTranslations();

    const stats = [
        { number: companyInfo.stats.experience, label: t('eu_buyers_page.stats.years'), icon: <FaChartLine /> },
        { number: companyInfo.stats.tonnage, label: t('eu_buyers_page.stats.tonnage'), icon: <FaShip /> },
        { number: companyInfo.stats.clients, label: t('eu_buyers_page.stats.clients'), icon: <FaHandshake /> },
        { number: companyInfo.stats.employees, label: t('eu_buyers_page.stats.employees'), icon: <FaUsers /> },
    ];

    const steps = (t.raw('eu_buyers_page.process.steps') ?? []) as Step[];
    const stepIcons = [FaEnvelopeOpenText, FaClipboardCheck, FaBox, FaPlane];

    const shippingItems = (t.raw('eu_buyers_page.shipping.items') ?? []) as Step[];
    const shippingIcons = [FaThermometerHalf, FaBox, FaPlane, FaCalendarCheck];

    const altTemplate = (t.raw('products_page.alt_template') ?? '{product}') as string;

    return (
        <Layout>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-16">
                <div className="container-custom">
                    <div className="text-center hero-rise">
                        <span className="inline-block bg-white/15 border border-white/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
                            {t('eu_buyers_page.hero.badge')}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t('eu_buyers_page.hero.title')}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto mb-8">
                            {t('eu_buyers_page.hero.subtitle')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/contact"
                                className="bg-secondary-500 text-white px-8 py-3 rounded-full font-bold hover:bg-secondary-600 transition-all duration-300 shadow-xl inline-flex items-center gap-2"
                                id="eu-hero-contact-btn"
                            >
                                <FaHandshake />
                                {t('eu_buyers_page.hero.cta_contact')}
                            </Link>
                            <a
                                href="#species"
                                className="bg-white/10 border border-white/40 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2"
                            >
                                <FaFish />
                                {t('eu_buyers_page.hero.cta_species')}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* EU Opening Section */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-6 text-primary-800 text-center">
                            {t('eu_buyers_page.opening.title')}
                        </h2>
                        <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                            {t('eu_buyers_page.opening.p1')}
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {t('eu_buyers_page.opening.p2')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Who We Are + Statistics */}
            <section className="py-20 bg-gray-100">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-primary-800">
                                {t('eu_buyers_page.about.title')}
                            </h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('eu_buyers_page.about.p1')}
                            </p>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('eu_buyers_page.about.p2')}
                            </p>
                            <Link
                                href="/about"
                                className="text-primary-600 font-semibold hover:underline inline-flex items-center gap-2"
                            >
                                {t('eu_buyers_page.about.link')}
                                <FaArrowRight className="text-sm rtl:rotate-180" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-xl"
                        >
                            <div className="grid grid-cols-2 gap-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-primary-600 text-4xl mb-2 flex justify-center">{stat.icon}</div>
                                        <div className="text-3xl font-bold text-primary-800 mb-1" dir="ltr">{stat.number}</div>
                                        <div className="text-gray-600">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Species Section */}
            <section id="species" className="py-20 scroll-mt-24">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">{t('eu_buyers_page.species.title')}</h2>
                        <p className="section-subtitle">{t('eu_buyers_page.species.subtitle')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {euProducts.map((product, index) => {
                            const name = t(`data.products.${product.translationKey}.name`);
                            const sizes = (t.raw(`data.products.${product.translationKey}.sizes`) ?? []) as string[];
                            return (
                                <motion.article
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="card group"
                                >
                                    <div className="aspect-[4/3] overflow-hidden bg-gray-200 relative">
                                        <Image
                                            src={product.image}
                                            alt={altTemplate.replace('{product}', name)}
                                            width={400}
                                            height={300}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                                            quality={75}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className={`absolute top-2 start-2 px-2 py-1 rounded text-xs font-semibold text-white ${categoryBadgeClass[product.category]}`}>
                                            {t(categoryLabelKey(product.category))}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-primary-800 mb-2">
                                            <Link href={`/products/${product.slug}`} className="hover:text-primary-600 hover:underline underline-offset-2">{name}</Link>
                                        </h3>
                                        {sizes.length > 0 && (
                                            <>
                                                <p className="text-sm font-semibold text-gray-700 mb-1">{t('eu_buyers_page.species.sizes_label')}</p>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {sizes.map((size, i) => (
                                                        <li key={i} className="flex items-center gap-2">
                                                            <FaCheckCircle className="text-green-500 flex-shrink-0 text-xs" />
                                                            <span>{size}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </motion.article>
                            );
                        })}

                        {/* Closing tile: full catalogue link */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: euProducts.length * 0.05 }}
                            viewport={{ once: true }}
                            className="card p-6 flex flex-col justify-center items-center text-center bg-primary-50"
                        >
                            <FaFish className="text-5xl text-primary-600 mb-4" />
                            <p className="text-gray-700 mb-5">{t('eu_buyers_page.species.note')}</p>
                            <Link href="/products" className="btn-primary inline-block" id="eu-view-products-btn">
                                {t('eu_buyers_page.species.view_all')}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How Ordering Works */}
            <section className="py-20 bg-gray-100">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">{t('eu_buyers_page.process.title')}</h2>
                        <p className="section-subtitle">{t('eu_buyers_page.process.subtitle')}</p>
                    </motion.div>

                    <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => {
                            const Icon = stepIcons[index] ?? FaCheckCircle;
                            return (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="card p-6 relative"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <Icon className="text-3xl text-secondary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-primary-800">{step.title}</h3>
                                    <p className="text-gray-600">{step.desc}</p>
                                </motion.li>
                            );
                        })}
                    </ol>
                </div>
            </section>

            {/* Cold Chain & Shipping */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">{t('eu_buyers_page.shipping.title')}</h2>
                        <p className="section-subtitle">{t('eu_buyers_page.shipping.subtitle')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {shippingItems.map((item, index) => {
                            const Icon = shippingIcons[index] ?? FaCheckCircle;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <Icon className="text-4xl text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Quality & Certifications */}
            <section className="py-20 bg-gray-100">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="card p-8 md:p-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8"
                    >
                        <div className="bg-primary-100 rounded-full w-24 h-24 flex items-center justify-center flex-shrink-0">
                            <FaAward className="text-5xl text-secondary-600" />
                        </div>
                        <div className="text-center md:text-start">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary-800">
                                {t('eu_buyers_page.quality.title')}
                            </h2>
                            <p className="text-gray-600 mb-5 leading-relaxed">
                                {t('eu_buyers_page.quality.text')}
                            </p>
                            <Link
                                href="/certificates"
                                className="text-primary-600 font-semibold hover:underline inline-flex items-center gap-2"
                                id="eu-certificates-link"
                            >
                                <FaIndustry />
                                {t('eu_buyers_page.quality.link')}
                            </Link>
                        </div>
                    </motion.div>
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
                            {t('eu_buyers_page.cta.title')}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {t('eu_buyers_page.cta.subtitle')}
                        </p>
                        <Link
                            href="/contact"
                            className="bg-secondary-500 text-white px-10 py-4 rounded-full font-bold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3 text-lg"
                            id="eu-contact-btn"
                        >
                            <FaHandshake className="text-2xl" />
                            {t('eu_buyers_page.cta.button')}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
