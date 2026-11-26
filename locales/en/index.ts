// EN locale barrel: every namespace the site renders (one JSON file each).
// Only catalogue_v2.browser is sent to the browser (app/[locale]/layout.tsx); everything else is server-only.
import privacyNs from './pages/privacy.json';
import notFoundNs from './pages/not-found.json';
import guidesPageNs from './pages/guides.json';
import v2Ns from './pages/v2-common.json';
import homeV2Ns from './pages/v2-home.json';
import gHeaderV2Ns from './pages/g-header.json';
import gFooterV2Ns from './pages/g-footer.json';
import gHeroV2Ns from './pages/g-hero.json';
import gAboutV2Ns from './pages/g-about.json';
import gFishV2Ns from './pages/g-fish.json';
import gChainV2Ns from './pages/g-chain.json';
import gQualityV2Ns from './pages/g-quality.json';
import gMarketsV2Ns from './pages/g-markets.json';
import aboutV2Ns from './pages/v2-about.json';
import catalogueV2Ns from './pages/v2-catalogue.json';
import qualityV2Ns from './pages/v2-quality.json';
import marketsV2Ns from './pages/v2-markets.json';
import insightsV2Ns from './pages/v2-insights.json';
import contactV2Ns from './pages/v2-contact.json';
import rfqV2Ns from './pages/v2-rfq.json';
import newsV2Ns from './pages/v2-news.json';
import productData from './data/products.json';
import marketData from './data/markets.json';
import companyData from './data/company.json';
import metadata from './seo/metadata.json';
import schema from './seo/schema.json';

const messages = {
    privacy: privacyNs,
    not_found: notFoundNs,
    guides_page: guidesPageNs,
    v2: v2Ns,
    home_v2: homeV2Ns,
    g_header_v2: gHeaderV2Ns,
    g_footer_v2: gFooterV2Ns,
    g_hero_v2: gHeroV2Ns,
    g_about_v2: gAboutV2Ns,
    g_fish_v2: gFishV2Ns,
    g_chain_v2: gChainV2Ns,
    g_quality_v2: gQualityV2Ns,
    g_markets_v2: gMarketsV2Ns,
    about_v2: aboutV2Ns,
    catalogue_v2: catalogueV2Ns,
    quality_v2: qualityV2Ns,
    markets_v2: marketsV2Ns,
    insights_v2: insightsV2Ns,
    contact_v2: contactV2Ns,
    rfq_v2: rfqV2Ns,
    news_v2: newsV2Ns,
    data: {
        products: productData,
        markets: marketData,
        company: companyData,
    },
    metadata,
    schema,
};

export default messages;
