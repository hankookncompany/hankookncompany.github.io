import React from 'react';
import { ImageResponse } from '@vercel/og';
import { BlogPost, ProductData, AuthorData } from '@/lib/content';

// OG Image dimensions (recommended by social platforms)
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Template configuration for different content types
export const OG_TEMPLATES = {
  blog: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#4f46e5',
    textColor: '#ffffff',
    subtextColor: '#e2e8f0',
  },
  product: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: '#ec4899',
    textColor: '#ffffff',
    subtextColor: '#fce7f3',
  },
  home: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    accent: '#0ea5e9',
    textColor: '#ffffff',
    subtextColor: '#e0f2fe',
  },
  author: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    accent: '#06b6d4',
    textColor: '#1f2937',
    subtextColor: '#6b7280',
  },
} as const;

export type OGTemplateType = keyof typeof OG_TEMPLATES;

export interface OGImageOptions {
  title: string;
  subtitle?: string;
  author?: string;
  tags?: string[];
  type: OGTemplateType;
  locale: 'ko' | 'en';
  publishedDate?: string;
  avatar?: string;
}

/**
 * Create a simple OG image with minimal structure
 */
function createSimpleOGImage(options: OGImageOptions) {
  const template = OG_TEMPLATES[options.type];
  const { title, subtitle, author, tags = [], locale, publishedDate } = options;

  // Truncate title if too long
  const truncatedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;

  // Show max 2 tags
  const displayTags = tags.slice(0, 2);

  const contentTypeBadgeText =
    options.type === 'blog' ? (locale === 'ko' ? '블로그' : 'Blog') :
      options.type === 'product' ? (locale === 'ko' ? '프로젝트' : 'Project') :
        options.type === 'author' ? (locale === 'ko' ? '팀원' : 'Team') :
          locale === 'ko' ? '홈' : 'Home';



  return React.createElement(
    'div',
    {
      style: {
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        background: template.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px',
        position: 'relative',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      },
    },
    [
      // Brand badge (top right)
      React.createElement(
        'div',
        {
          key: 'brand',
          style: {
            position: 'absolute',
            top: '40px',
            right: '40px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: '600',
            color: template.textColor,
          },
        },
        'Team Tech Blog'
      ),

      // Main title
      React.createElement(
        'h1',
        {
          key: 'title',
          style: {
            fontSize: '56px',
            fontWeight: 'bold',
            color: template.textColor,
            margin: '0 0 40px 0',
            lineHeight: '1.1',
            textAlign: 'center',
            maxWidth: '1000px',
          },
        },
        truncatedTitle
      ),

      // Subtitle
      subtitle ? React.createElement(
        'p',
        {
          key: 'subtitle',
          style: {
            fontSize: '28px',
            color: template.subtextColor,
            margin: '0 0 40px 0',
            textAlign: 'center',
            lineHeight: '1.3',
            maxWidth: '800px',
          },
        },
        subtitle.length > 100 ? subtitle.substring(0, 97) + '...' : subtitle
      ) : null,

      // Author info
      author ? React.createElement(
        'div',
        {
          key: 'author',
          style: {
            fontSize: '24px',
            color: template.subtextColor,
            margin: '0 0 30px 0',
            fontWeight: '500',
          },
        },
        `by ${author}`
      ) : null,

      // Tags
      displayTags.length > 0 ? React.createElement(
        'div',
        {
          key: 'tags',
          style: {
            display: 'flex',
            gap: '16px',
            margin: '0 0 40px 0',
          },
        },
        displayTags.map((tag, index) =>
          React.createElement(
            'span',
            {
              key: `tag-${index}`,
              style: {
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '25px',
                padding: '10px 20px',
                fontSize: '18px',
                color: template.textColor,
                fontWeight: '500',
              },
            },
            `#${tag}`
          )
        )
      ) : null,

      // Content type badge (bottom right)
      React.createElement(
        'div',
        {
          key: 'type-badge',
          style: {
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            background: template.accent,
            color: 'white',
            padding: '8px 16px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '600',
            textTransform: 'uppercase',
          },
        },
        contentTypeBadgeText
      ),

      // Date (bottom left)
      publishedDate ? React.createElement(
        'div',
        {
          key: 'date',
          style: {
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            fontSize: '18px',
            color: template.subtextColor,
            fontWeight: '400',
          },
        },
        new Date(publishedDate).toLocaleDateString(
          locale === 'ko' ? 'ko-KR' : 'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )
      ) : null,
    ].filter(Boolean) // Remove null elements
  );
}

/**
 * Generate OG image for blog post
 */
export async function generateBlogPostOGImage(
  post: BlogPost,
  author: AuthorData,
  locale: 'ko' | 'en'
): Promise<ImageResponse> {
  const options: OGImageOptions = {
    title: post.frontmatter.title,
    subtitle: post.frontmatter.excerpt,
    author: author.name,
    tags: post.frontmatter.tags,
    type: 'blog',
    locale,
    publishedDate: post.frontmatter.publishedAt,
    avatar: author.avatar,
  };

  return new ImageResponse(createSimpleOGImage(options), {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  });
}

/**
 * Generate OG image for product
 */
export async function generateProductOGImage(
  product: ProductData,
  locale: 'ko' | 'en'
): Promise<ImageResponse> {
  const options: OGImageOptions = {
    title: product.name,
    subtitle: product.description,
    tags: product.technologies,
    type: 'product',
    locale,
    publishedDate: product.createdAt,
  };

  return new ImageResponse(createSimpleOGImage(options), {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  });
}

/**
 * Generate OG image for author profile
 */
export async function generateAuthorOGImage(
  author: AuthorData,
  locale: 'ko' | 'en'
): Promise<ImageResponse> {
  const options: OGImageOptions = {
    title: author.name,
    subtitle: `${author.role} • ${author.skills.slice(0, 3).join(', ')}`,
    author: undefined, // Don't show author for author pages
    tags: author.skills.slice(0, 3),
    type: 'author',
    locale,
    avatar: author.avatar,
  };

  return new ImageResponse(createSimpleOGImage(options), {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  });
}

/**
 * Generate OG image for homepage
 */
export async function generateHomepageOGImage(locale: 'ko' | 'en'): Promise<ImageResponse> {
  const options: OGImageOptions = {
    title: locale === 'ko' ? '팀 기술 블로그' : 'Team Tech Blog',
    subtitle: locale === 'ko'
      ? '개발팀의 기술적 인사이트와 경험을 공유합니다'
      : 'Sharing technical insights and experiences from our development team',
    type: 'home',
    locale,
  };

  return new ImageResponse(createSimpleOGImage(options), {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  });
}

/**
 * Generate filename for OG image
 */
export function generateOGImageFilename(
  type: OGTemplateType,
  slug: string,
  locale: 'ko' | 'en'
): string {
  return `og-${type}-${slug}-${locale}.png`;
}

/**
 * Slugify string for filename
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get OG image URL for blog post
 */
export function getBlogPostOGImageUrl(slug: string, locale: 'ko' | 'en'): string {
  const filename = generateOGImageFilename('blog', slug, locale);
  return `/og/${filename}`;
}

/**
 * Get OG image URL for product
 */
export function getProductOGImageUrl(slug: string, locale: 'ko' | 'en'): string {
  const filename = generateOGImageFilename('product', slug, locale);
  return `/og/${filename}`;
}

/**
 * Get OG image URL for author
 */
export function getAuthorOGImageUrl(slug: string, locale: 'ko' | 'en'): string {
  const filename = generateOGImageFilename('author', slug, locale);
  return `/og/${filename}`;
}

/**
 * Get OG image URL for homepage
 */
export function getHomepageOGImageUrl(locale: 'ko' | 'en'): string {
  const filename = generateOGImageFilename('home', 'index', locale);
  return `/og/${filename}`;
}

/**
 * Check if OG image exists for given parameters
 */
export function ogImageExists(type: OGTemplateType, slug: string, locale: 'ko' | 'en'): boolean {
  const filename = generateOGImageFilename(type, slug, locale);

  // For client-side, we can't check file existence, so assume it exists
  if (typeof window !== 'undefined') {
    return true;
  }

  // For server-side (build time), use dynamic imports
  try {
    const fs = eval('require')('fs');
    const path = eval('require')('path');
    const filePath = path.join(process.cwd(), 'public', 'og', filename);
    return fs.existsSync(filePath);
  } catch {
    return true; // Assume exists if we can't check
  }
}