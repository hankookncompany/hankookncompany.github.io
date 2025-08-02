import { type Locale } from '@/i18n';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBlogPost, getAuthor, getPublishedBlogPosts, checkPostExistsInLocale } from '@/lib/content';
import { BlogPostWithToc } from '@/components/blog/BlogPostWithToc';
import { AuthorCard } from '@/components/authors/AuthorCard';
import { BlogPostAnalytics } from '@/components/blog/BlogPostAnalytics';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  // Generate static params for both locales
  const koSlugs = (await getPublishedBlogPosts('ko')).map(post => ({
    locale: 'ko' as const,
    slug: post.slug,
  }));

  const enSlugs = (await getPublishedBlogPosts('en')).map(post => ({
    locale: 'en' as const,
    slug: post.slug,
  }));

  return [...koSlugs, ...enSlugs];
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const title = post.frontmatter.title;
  const description = post.frontmatter.excerpt;
  const author = await getAuthor(post.frontmatter.author, locale);
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io';
  const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

  // Check if the post exists in other locales
  const hasKoVersion = await checkPostExistsInLocale(slug, 'ko');
  const hasEnVersion = await checkPostExistsInLocale(slug, 'en');

  const alternateLanguages: Record<string, string> = {};
  if (hasKoVersion) alternateLanguages['ko'] = `${siteUrl}/ko/blog/${slug}`;
  if (hasEnVersion) alternateLanguages['en'] = `${siteUrl}/en/blog/${slug}`;

  return {
    title,
    description,
    keywords: post.frontmatter.tags.join(', '),
    authors: author ? [{ name: author.name }] : undefined,
    creator: author?.name,
    publisher: `${commonT('companyName')} ${commonT('siteName')}`,
    alternates: {
      canonical: postUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: postUrl,
      siteName: commonT('siteName'),
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      publishedTime: post.frontmatter.publishedAt,
      modifiedTime: post.frontmatter.updatedAt || post.frontmatter.publishedAt,
      authors: author ? [author.name] : undefined,
      tags: post.frontmatter.tags,
      images: post.frontmatter.featuredImage ? [
        {
          url: post.frontmatter.featuredImage.startsWith('http')
            ? post.frontmatter.featuredImage
            : `${siteUrl}${post.frontmatter.featuredImage}`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [
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
      creator: author?.social?.twitter ? `@${author.social.twitter.split('/').pop()}` : undefined,
      images: post.frontmatter.featuredImage ? [
        post.frontmatter.featuredImage.startsWith('http')
          ? post.frontmatter.featuredImage
          : `${siteUrl}${post.frontmatter.featuredImage}`
      ] : [`${siteUrl}/og-default.png`],
    },
    robots: {
      index: post.frontmatter.status === 'published',
      follow: true,
      googleBot: {
        index: post.frontmatter.status === 'published',
        follow: true,
      },
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'blog' });

  try {
    const post = await getBlogPost(slug, locale);

    if (!post || post.frontmatter.status !== 'published') {
      notFound();
    }

    const author = await getAuthor(post.frontmatter.author, locale);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io';
    const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

    // Structured data for SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      image: post.frontmatter.featuredImage
        ? (post.frontmatter.featuredImage.startsWith('http')
          ? post.frontmatter.featuredImage
          : `${siteUrl}${post.frontmatter.featuredImage}`)
        : `${siteUrl}/og-default.png`,
      datePublished: post.frontmatter.publishedAt,
      dateModified: post.frontmatter.updatedAt || post.frontmatter.publishedAt,
      author: author ? {
        '@type': 'Person',
        name: author.name,
        url: `${siteUrl}/${locale}/authors/${author.slug}`,
        image: author.avatar ? (author.avatar.startsWith('http') ? author.avatar : `${siteUrl}${author.avatar}`) : `${siteUrl}/placeholder-avatar.svg`,
        jobTitle: author.role,
        sameAs: Object.values(author.social).filter(Boolean),
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: 'Team Tech Blog',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl,
      },
      keywords: post.frontmatter.tags.join(', '),
      wordCount: post.content.trim().split(/\s+/).length,
      timeRequired: `PT${post.readingTime}M`,
      inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
      url: postUrl,
    };

    return (
      <BlogPostAnalytics slug={slug}>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <div className="container mx-auto py-4 sm:px-4 sm:py-8">
          {/* Back Button */}
          <div className="max-w-7xl 2xl:max-w-4xl mx-auto mb-4 sm:mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${locale}/blog`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToBlog')}
              </Link>
            </Button>
          </div>

          {/* Blog Post with TOC - No width constraints here */}
          <BlogPostWithToc
            post={post}
            author={author || undefined}
            locale={locale}
          />

          {/* Author Bio Section */}
          <div className="max-w-4xl mx-auto px-6">
            {author && (
              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4">
                  {t('aboutAuthor')}
                </h3>
                <AuthorCard
                  author={author}
                  locale={locale}
                  showBio={true}
                  compact={false}
                />
              </div>
            )}

            {/* Navigation to other posts */}
            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link href={`/${locale}/blog`}>
                  {t('viewMorePosts')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </BlogPostAnalytics>
    );
  } catch (error) {
    console.error(`Error loading blog post: ${slug}`, error);
    notFound();
  }
}