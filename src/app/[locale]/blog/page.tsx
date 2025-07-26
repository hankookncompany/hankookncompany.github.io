import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPublishedBlogPosts, getAuthors, getAllTags } from '@/lib/content';
import { BlogListWithSearch } from '@/components/blog/BlogListWithSearch';
import { Metadata } from 'next';
import { type Locale } from '@/i18n';
import { Suspense } from 'react';

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: { 
  params: Promise<{ locale: Locale }>; 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const commonT = await getTranslations('common');
  
  const title = t('title');
  const description = t('subtitle');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-team.github.io';
  const blogUrl = `${siteUrl}/${locale}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical: blogUrl,
      languages: {
        'ko': `${siteUrl}/ko/blog`,
        'en': `${siteUrl}/en/blog`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: blogUrl,
      siteName: `${commonT('companyName')} ${commonT('siteName')}`,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      images: [
        {
          url: `${siteUrl}/og-default.png`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-default.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Get translations
  const t = await getTranslations('blog');
  
  // Get all posts, authors, and tags at build time
  const [posts, authors, allTags] = await Promise.all([
    getPublishedBlogPosts(locale),
    getAuthors(locale),
    getAllTags(locale),
  ]);

  // Structured data for blog listing
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-team.github.io';
  const blogUrl = `${siteUrl}/${locale}/blog`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t('title'),
    description: t('subtitle'),
    url: blogUrl,
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
    blogPost: posts.slice(0, 10).map(post => ({
      '@type': 'BlogPosting',
      headline: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      url: `${siteUrl}/${locale}/blog/${post.slug}`,
      datePublished: post.frontmatter.publishedAt,
      dateModified: post.frontmatter.updatedAt || post.frontmatter.publishedAt,
      author: {
        '@type': 'Person',
        name: authors.find(a => a.slug === post.frontmatter.author)?.name || 'Unknown',
      },
      keywords: post.frontmatter.tags.join(', '),
    })),
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
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            {t('subtitle')}
          </p>
        </div>

        {/* Client-side search and filtering component */}
        <Suspense fallback={
          <div className="space-y-6">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <BlogListWithSearch
            posts={posts}
            authors={authors}
            tags={allTags}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
    </>
  );
}