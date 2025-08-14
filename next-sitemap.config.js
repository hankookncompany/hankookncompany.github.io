/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: './out', // Next.js export 폴더 지정
  trailingSlash: true, // 실제 배포 URL과 일치시킴(슬래시 일관성)
  exclude: [
    '/blog/tag/*', '/en/blog/tag/*', '/ko/blog/tag/*',
    '/admin', '/admin/*',
    '/en/admin', '/en/admin/*',
    '/ko/admin', '/ko/admin/*',
    '/**/posts/new', '/**/posts/post/edit',
    '/_next/*', '/api/*'
  ],
  alternateRefs: [
    {
  href: 'https://hankookncompany.github.io/ko/',
      hreflang: 'ko',
    },
    {
  href: 'https://hankookncompany.github.io/en/',
      hreflang: 'en',
    },
  ],
  transform: async (config, path) => {
    // Custom transform function to handle i18n paths
    // Exclude paths that shouldn't be in sitemap
    if (path.includes('/api/') || path.includes('/_next/')) {
      return null;
    }

    let clean = path;
    try { clean = decodeURIComponent(path); } catch {}

    // Ensure trailing slash consistency in sitemap output
    const ensureTrailingSlash = (p) => {
      if (!p) return p;
      if (p === '/') return p;
      return p.endsWith('/') ? p : `${p}/`;
    };

    const stripTrailingSlash = (p) => (p && p !== '/' ? p.replace(/\/$/, '') : p);
    const plain = stripTrailingSlash(clean);

    // Default priority and changefreq
    const defaults = {
      priority: 0.7,
      changefreq: 'weekly',
    };

    if (['/','/ko','/en'].includes(plain)) defaults.priority = 1.0;
    else if (plain.includes('/blog')) defaults.priority = 0.8;
    else if (plain.includes('/showcase')) defaults.priority = 0.8;
    else if (plain.includes('/authors')) defaults.priority = 0.6;

    return {
      // Normalize URL to avoid redirects in indexing
      loc: config.trailingSlash ? ensureTrailingSlash(plain) : stripTrailingSlash(plain),
      lastmod: new Date().toISOString(),
      ...defaults,
    };
  },
};