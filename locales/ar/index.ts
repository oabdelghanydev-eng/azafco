// AR locale barrel export
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
import euBuyers from './pages/eu-buyers.json';
import species from './pages/species.json';
import marketDetail from './pages/market-detail.json';
import faqPage from './pages/faq.json';
import guides from './pages/guides.json';
import homeV2Ns from './pages/v2-home.json';
import aboutV2Ns from './pages/v2-about.json';
import businessesV2Ns from './pages/v2-businesses.json';
import seafoodV2Ns from './pages/v2-seafood.json';
import catalogueV2Ns from './pages/v2-catalogue.json';
import processingV2Ns from './pages/v2-processing.json';
import qualityV2Ns from './pages/v2-quality.json';
import marketsV2Ns from './pages/v2-markets.json';
import importersV2Ns from './pages/v2-importers.json';
import insightsV2Ns from './pages/v2-insights.json';
import contactV2Ns from './pages/v2-contact.json';
import rfqV2Ns from './pages/v2-rfq.json';
import v2Common from './pages/v2-common.json';
import productData from './data/products.json';
import marketData from './data/markets.json';
import newsData from './data/news.json';
import companyData from './data/company.json';
import metadata from './seo/metadata.json';
import faq from './seo/faq.json';
import keywords from './seo/keywords.json';
import schema from './seo/schema.json';

const messages = {
    common,
    nav: navigation.nav,
    footer: navigation.footer,
    home,
    // Short names (legacy usage)
    about,
    contact,
    products,
    // Full names with _page suffix
    products_page: products,
    markets_page: markets,
    media_page: media,
    about_page: about,
    contact_page: contact,
    certificates_page: certificates,
    privacy,
    not_found: notFound,
    eu_buyers_page: euBuyers,
    species_page: species,
    market_detail_page: marketDetail,
    faq_page: faqPage,
    guides_page: guides,
    // Site v2 shell (header, footer, CTAs, component kit)
    v2: v2Common,
    home_v2: homeV2Ns,
    about_v2: aboutV2Ns,
    businesses_v2: businessesV2Ns,
    seafood_v2: seafoodV2Ns,
    catalogue_v2: catalogueV2Ns,
    processing_v2: processingV2Ns,
    quality_v2: qualityV2Ns,
    markets_v2: marketsV2Ns,
    importers_v2: importersV2Ns,
    insights_v2: insightsV2Ns,
    contact_v2: contactV2Ns,
    rfq_v2: rfqV2Ns,
    data: {
        products: productData,
        markets: marketData,
        news: newsData,
        company: companyData
    },
    metadata,
    faq,
    keywords,
    schema
};

export default messages;
