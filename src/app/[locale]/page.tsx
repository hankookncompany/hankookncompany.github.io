import { useTranslations } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Locale } from '@/i18n';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts, getPublishedBlogPosts } from '@/lib/content';

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations();

  // Get content for preview
  const products = await getProducts(locale);
  const blogPosts = await getPublishedBlogPosts(locale);

  // Structured data for homepage
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-team.github.io';
  const homeUrl = `${siteUrl}/${locale}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'ko' ? '팀 기술 블로그' : 'Team Tech Blog',
    description: locale === 'ko'
      ? '개발팀의 지식 공유, 학습 기록, 그리고 기술적 인사이트를 담은 현대적인 기술 블로그 플랫폼입니다.'
      : 'A modern tech blog platform for sharing knowledge, documenting learnings, and showcasing technical insights from our development team.',
    url: homeUrl,
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'Team Tech Blog',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/${locale}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <main className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              {t('home.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('home.subtitle')}
            </p>
            <div className="flex gap-4 justify-center">
              <div className="px-4 py-2 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium text-primary">
                  Next.js 15 + TypeScript
                </span>
              </div>
              <div className="px-4 py-2 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium text-primary">
                  Tailwind CSS + shadcn/ui
                </span>
              </div>
              <div className="px-4 py-2 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium text-primary">
                  GitHub Pages Ready
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-3">{t('home.blogSection.title')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('home.blogSection.description')}
              </p>
              {blogPosts.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {blogPosts.length} posts available
                  </p>
                  <Button asChild>
                    <Link href={`/${locale}/blog`}>
                      View Blog Posts
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t('home.blogSection.comingSoon')}
                </div>
              )}
            </div>

            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-3">{t('home.showcaseSection.title')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('home.showcaseSection.description')}
              </p>
              {products.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {products.length} projects available
                  </p>
                  <Button asChild>
                    <Link href={`/${locale}/showcase`}>
                      View Projects
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t('home.showcaseSection.comingSoon')}
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">{t('home.techStack')}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Next.js",
                "React",
                "TypeScript",
                "Tailwind CSS",
                "shadcn/ui",
                "MDX",
                "GitHub Pages",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
