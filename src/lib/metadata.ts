import { Metadata } from 'next';
import { 
  getBlogPostOGImageUrl,
  getProductOGImageUrl,
  getAuthorOGImageUrl,
  getHomepageOGImageUrl
} from './og-image';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-team.github.io';
const SITE_NAME = 'Team Tech Blog';

interface BaseMetadataProps {
  title: string;
  description: string;
  locale: 'ko' | 'en';
  path?: string;
  ogImage?: string;
}

interface BlogPostMetadataProps extends BaseMetadataProps {
  type: 'blog';
  slug: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

interface ProductMetadataProps extends BaseMetadataProps {
  type: 'product';
  slug: string;
}

interface AuthorMetadataProps extends BaseMetadataProps {
  type: 'author';
  slug: string;
}

interface HomepageMetadataProps extends BaseMetadataProps {
  type: 'home';
}

type MetadataProps = BlogPostMetadataProps | ProductMetadataProps | AuthorMetadataProps | HomepageMetadataProps;

/**
 * Generate metadata for different page types
 */
export function generateMetadata(props: MetadataProps): Metadata {
  const { title, description, locale, path = '', ogImage } = props;
  const fullTitle = `${title} | ${SITE_NAME}`;
  const currentUrl = `${SITE_URL}${path}`;
  
  // Determine OG image URL
  let ogImageUrl = ogImage;
  if (!ogImageUrl) {
    switch (props.type) {
      case 'blog':
        ogImageUrl = getBlogPostOGImageUrl(props.slug, locale);
        break;
      case 'product':
        ogImageUrl = getProductOGImageUrl(props.slug, locale);
        break;
      case 'author':
        ogImageUrl = getAuthorOGImageUrl(props.slug, locale);
        break;
      case 'home':
        ogImageUrl = getHomepageOGImageUrl(locale);
        break;
    }
  }
  
  const fullOgImageUrl = ogImageUrl?.startsWith('http') ? ogImageUrl : `${SITE_URL}${ogImageUrl}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: currentUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: props.type === 'blog' ? 'article' : 'website',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullOgImageUrl],
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
    },

    // Canonical URL
    alternates: {
      canonical: currentUrl,
      languages: {
        'ko': `${SITE_URL}/ko${path.replace(/^\/(ko|en)/, '')}`,
        'en': `${SITE_URL}/en${path.replace(/^\/(ko|en)/, '')}`,
        'x-default': `${SITE_URL}${path.replace(/^\/(ko|en)/, '')}`,
      },
    },
  };

  // Add article-specific metadata for blog posts
  if (props.type === 'blog') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: props.publishedTime,
      modifiedTime: props.modifiedTime,
      authors: props.author ? [props.author] : undefined,
      tags: props.tags,
    };
  }

  return metadata;
}

/**
 * Generate metadata for blog post
 */
export function generateBlogPostMetadata(
  title: string,
  description: string,
  slug: string,
  locale: 'ko' | 'en',
  path: string,
  options?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
    ogImage?: string;
  }
): Metadata {
  return generateMetadata({
    type: 'blog',
    title,
    description,
    slug,
    locale,
    path,
    ...options,
  });
}

/**
 * Generate metadata for product page
 */
export function generateProductMetadata(
  title: string,
  description: string,
  slug: string,
  locale: 'ko' | 'en',
  path: string,
  ogImage?: string
): Metadata {
  return generateMetadata({
    type: 'product',
    title,
    description,
    slug,
    locale,
    path,
    ogImage,
  });
}

/**
 * Generate metadata for author page
 */
export function generateAuthorMetadata(
  title: string,
  description: string,
  slug: string,
  locale: 'ko' | 'en',
  path: string,
  ogImage?: string
): Metadata {
  return generateMetadata({
    type: 'author',
    title,
    description,
    slug,
    locale,
    path,
    ogImage,
  });
}

/**
 * Generate metadata for homepage
 */
export function generateHomepageMetadata(
  title: string,
  description: string,
  locale: 'ko' | 'en',
  path: string,
  ogImage?: string
): Metadata {
  return generateMetadata({
    type: 'home',
    title,
    description,
    locale,
    path,
    ogImage,
  });
}