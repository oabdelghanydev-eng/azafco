// English locale barrel export
// Merges all split locale files into a single messages object

import common from './common.json';
import navigation from './navigation.json';

import home from './pages/home.json';
import products from './pages/products.json';
import markets from './pages/markets.json';
import media from './pages/media.json';
import about from './pages/about.json';
import contact from './pages/contact.json';
import certificates from './pages/certificates.json';
import privacy from './pages/privacy.json';
import notFound from './pages/not-found.json';

import productData from './data/products.json';
import marketData from './data/markets.json';
import newsData from './data/news.json';
import companyData from './data/company.json';

import metadata from './seo/metadata.json';
import faq from './seo/faq.json';
import keywords from './seo/keywords.json';
import schema from './seo/schema.json';

const messages = {
    // Common strings
    common,

    // Navigation & Footer
    nav: navigation.nav,
    footer: navigation.footer,

    // Page-specific translations (dual export for both naming conventions)
    home,
    // Short names (legacy usage: t('about.title'))
    about,
    contact,
    products,
    // Full names with _page suffix (new convention: t('about_page.xxx'))
    products_page: products,
    markets_page: markets,
    media_page: media,
    about_page: about,
    contact_page: contact,
    certificates_page: certificates,
    privacy,
    not_found: notFound,

    // Content data (products, markets, news, company)
    data: {
        products: productData,
        markets: marketData,
        news: newsData,
        company: companyData
    },

    // SEO metadata
    metadata,
    faq,
    keywords,
    schema
};

export default messages;
