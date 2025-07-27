/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  outDir: './out', // Next.js export 폴더 지정
  alternateRefs: [
    {
      href: 'https://hankookncompany.github.io/ko',
      hreflang: 'ko',
    },
    {
      href: 'https://hankookncompany.github.io/en',
      hreflang: 'en',
    },
  ],
  transform: async (config, path) => {
    // Custom transform function to handle i18n paths
    // Exclude paths that shouldn't be in sitemap
    if (path.includes('/api/') || path.includes('/_next/')) {
      return null;
    }

    // Default priority and changefreq
    const defaults = {
      priority: 0.7,
      changefreq: 'weekly',
    };

    // Customize priority based on path
    if (path === '/' || path === '/ko' || path === '/en') {
      defaults.priority = 1.0;
    } else if (path.includes('/blog/')) {
      defaults.priority = 0.8;
    } else if (path.includes('/showcase/')) {
      defaults.priority = 0.8;
    } else if (path.includes('/authors/')) {
      defaults.priority = 0.6;
    }

    return {
      loc: path,
      lastmod: new Date().toISOString(),
      ...defaults,
    };
  },
};