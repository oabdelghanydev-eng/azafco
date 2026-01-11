/**
 * Company Data - Derives from config + provides backward-compatible exports
 * 
 * Non-translatable data comes from: config/company.config.ts
 * Translatable content accessed via: t('data.company.*')
 */

import {
    companyConfig,
    getFormattedStats
} from '@/config/company.config';

export const companyInfo = {
    // Year of establishment
    established: companyConfig.identity.foundingYear,

    // Registration info
    registrationNumber: companyConfig.registration.commercialRegister,
    taxNumber: companyConfig.registration.taxCard,

    // Contact details (links and display values)
    contact: {
        phone: {
            display: companyConfig.contact.phoneDisplay,
            value: companyConfig.contact.phone,
            link: `tel:${companyConfig.contact.phone}`,
        },
        whatsapp: {
            display: companyConfig.contact.phoneDisplay,
            value: companyConfig.contact.whatsappNumber,
            link: companyConfig.contact.social.whatsapp,
        },
        email: {
            display: companyConfig.contact.email,
            value: companyConfig.contact.email,
            link: `mailto:${companyConfig.contact.email}`,
        },
        partnershipForm: companyConfig.contact.partnershipForm,
        // workingHours is TRANSLATABLE - see locales/[locale]/data/company.json
    },

    // Addresses - ONLY non-translatable URLs
    addresses: {
        main: {
            // title, address are TRANSLATABLE - see locales/[locale]/data/company.json
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1081.8024861200884!2d30.70233540415435!3d31.475424268708064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f6ef000c544a3b%3A0x436225762d9fc08c!2z2YLYtdixINix2LbZiNin2YYg2KfZhNmD2YjYp9iq2YrYrdmK!5e1!3m2!1sen!2seg!4v1756516585687!5m2!1sen!2seg',
        },
        factory: {
            // title, address are TRANSLATABLE - see locales/[locale]/data/company.json
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3415.0!2d30.475957!3d31.433264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDI1JzU5LjgiTiAzMMKwMjgnMzMuNCJF!5e1!3m2!1sar!2seg!4v1',
        },
    },

    // Statistics - now auto-computed from config!
    stats: getFormattedStats(),

    // Social media links
    social: companyConfig.contact.social,
};
