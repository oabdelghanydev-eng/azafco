import { MetadataRoute } from 'next';
import { companyConfig } from '@/config/company.config';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = companyConfig.contact.baseUrl;

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/v/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        host: companyConfig.contact.website,
    };
}
