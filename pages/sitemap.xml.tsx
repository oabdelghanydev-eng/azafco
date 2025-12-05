import { GetServerSideProps } from 'next'

const Sitemap = () => {
    return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const baseUrl = 'https://azafco.com.eg'

    const staticPages = [
        { path: '', priority: '1.0', changefreq: 'daily' },
        { path: '/products', priority: '0.9', changefreq: 'weekly' },
        { path: '/markets', priority: '0.8', changefreq: 'weekly' },
        { path: '/media', priority: '0.7', changefreq: 'weekly' },
        { path: '/about', priority: '0.7', changefreq: 'monthly' },
        { path: '/contact', priority: '0.8', changefreq: 'monthly' },
        { path: '/certificates', priority: '0.6', changefreq: 'monthly' },
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticPages
            .map((page) => {
                return `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${baseUrl}${page.path}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.path}?lang=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.path}" />
  </url>`
            })
            .join('')}
</urlset>`

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
    res.write(sitemap)
    res.end()

    return {
        props: {},
    }
}

export default Sitemap
