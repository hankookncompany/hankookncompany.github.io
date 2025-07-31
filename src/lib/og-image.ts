import React from 'react';
import { ImageResponse } from '@vercel/og';
import { BlogPost, ProductData, AuthorData } from '@/lib/content';

// OG Image dimensions (recommended by social platforms)
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Template configuration for different content types
export const OG_TEMPLATES = {
  blog: {
    background: '#ffffff',
    accent: '#3b82f6',
    textColor: '#1f2937',
    subtextColor: '#6b7280',
    badgeColor: '#3b82f6',
  },
  product: {
    background: '#ffffff',
    accent: '#ec4899',
    textColor: '#1f2937',
    subtextColor: '#6b7280',
    badgeColor: '#ec4899',
  },
  home: {
    background: '#ffffff',
    accent: '#0ea5e9',
    textColor: '#1f2937',
    subtextColor: '#6b7280',
    badgeColor: '#0ea5e9',
  },
  author: {
    background: '#ffffff',
    accent: '#06b6d4',
    textColor: '#1f2937',
    subtextColor: '#6b7280',
    badgeColor: '#06b6d4',
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

// Tech badge color mapping for text-based badges
const TECH_BADGES: Record<string, { color: string }> = {
  // Programming Languages
  JavaScript: { color: "F7DF1E" },
  TypeScript: { color: "3178C6" },
  Python: { color: "3776AB" },
  Java: { color: "ED8B00" },
  "C++": { color: "00599C" },
  "C#": { color: "239120" },
  Go: { color: "00ADD8" },
  Rust: { color: "000000" },

  // Frontend Frameworks
  React: { color: "61DAFB" },
  "Next.js": { color: "000000" },
  Vue: { color: "4FC08D" },
  Angular: { color: "DD0031" },
  Svelte: { color: "f1413d" },

  // Backend Frameworks
  "Node.js": { color: "6DA55F" },
  Express: { color: "404d59" },
  Django: { color: "092E20" },
  Flask: { color: "000000" },
  FastAPI: { color: "009485" },

  // CSS Frameworks & Libraries
  "Tailwind CSS": { color: "38B2AC" },
  Tailwind: { color: "38B2AC" },
  Bootstrap: { color: "7952B3" },

  // Databases
  MongoDB: { color: "4ea94b" },
  PostgreSQL: { color: "316192" },
  MySQL: { color: "4479A1" },
  Redis: { color: "DD0031" },

  // Cloud & DevOps
  AWS: { color: "FF9900" },
  Docker: { color: "2496ED" },
  Vercel: { color: "000000" },

  // Tools & Others
  Git: { color: "F05032" },
  GitHub: { color: "121011" },
};

/**
 * Create a modern OG image with logo and user avatar
 */
function createSimpleOGImage(options: OGImageOptions) {
  const template = OG_TEMPLATES[options.type];
  const { title, subtitle, author, tags = [], locale, publishedDate, avatar } = options;

  // Truncate title if too long
  const truncatedTitle = title.length > 50 ? title.substring(0, 47) + '...' : title;
  const truncatedSubtitle = subtitle && subtitle.length > 120 ? subtitle.substring(0, 117) + '...' : subtitle;

  // Show max 3 tags
  const displayTags = tags.slice(0, 3);

  const contentTypeBadgeText =
    options.type === 'blog' ? (locale === 'ko' ? '블로그' : 'Blog') :
      options.type === 'product' ? (locale === 'ko' ? '프로젝트' : 'Project') :
        options.type === 'author' ? (locale === 'ko' ? '팀원' : 'Team') :
          locale === 'ko' ? '홈' : 'Home';

  const siteName = locale === 'ko' ? 'Hankook& 디지털테크' : 'Hankook& Digital Tech';

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
        alignItems: 'flex-start',
        padding: '80px',
        position: 'relative',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        border: '1px solid #e5e7eb',
      },
    },
    [
      // Logo and site name (top right)
      React.createElement(
        'div',
        {
          key: 'brand',
          style: {
            position: 'absolute',
            top: '40px',
            right: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          },
        },
        [
          React.createElement('img', {
            key: 'logo',
            src: 'https://hankookncompany.github.io/logo.svg',
            alt: 'Logo',
            width: 32,
            height: 32,
            style: {
              width: '32px',
              height: '32px',
            },
          }),
          React.createElement(
            'div',
            {
              key: 'site-name',
              style: {
                fontSize: '16px',
                fontWeight: '600',
                color: template.textColor,
              },
            },
            siteName,
          ),
        ],
      ),

      // Content type badge (top left)
      React.createElement(
        'div',
        {
          key: 'type-badge',
          style: {
            background: template.accent,
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '32px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
        contentTypeBadgeText,
      ),

      // Main title
      React.createElement(
        'h1',
        {
          key: 'title',
          style: {
            fontSize: '64px',
            fontWeight: '800',
            color: template.textColor,
            margin: '0 0 24px 0',
            lineHeight: '1.1',
            maxWidth: '900px',
          },
        },
        truncatedTitle,
      ),

      // Subtitle
      truncatedSubtitle ? React.createElement(
        'p',
        {
          key: 'subtitle',
          style: {
            fontSize: '24px',
            color: template.subtextColor,
            margin: '0 0 40px 0',
            lineHeight: '1.4',
            maxWidth: '800px',
            fontWeight: '400',
          },
        },
        truncatedSubtitle,
      ) : null,

      // Tech stack badges using text instead of external images
      displayTags.length > 0 ? React.createElement(
        'div',
        {
          key: 'tags',
          style: {
            display: 'flex',
            gap: '12px',
            margin: '0 0 40px 0',
            flexWrap: 'wrap',
          },
        },
        displayTags.map((tag, index) => {
          const badge = TECH_BADGES[tag];
          const badgeColor = badge ? `#${badge.color}` : template.accent;
          return React.createElement(
            'div',
            {
              key: `tag-${index}`,
              style: {
                background: badgeColor,
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              },
            },
            tag
          );
        }),
      ) : null,

      // Author info with avatar (bottom left)
      author ? React.createElement(
        'div',
        {
          key: 'author',
          style: {
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '20px',
            color: template.subtextColor,
            fontWeight: '500',
          },
        },
        [
          React.createElement(
            'div',
            {
              key: 'avatar-container',
              style: {
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '12px',
                overflow: 'hidden',
                border: `2px solid ${template.accent}`,
                display: 'flex',
              },
            },
            avatar ? React.createElement('img', {
              key: 'avatar',
              src: avatar.startsWith('http') ? avatar : `https://hankookncompany.github.io${avatar}`,
              alt: author,
              width: 40,
              height: 40,
              style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            }) : React.createElement(
              'div',
              {
                key: 'avatar-fallback',
                style: {
                  width: '100%',
                  height: '100%',
                  background: template.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                },
              },
              author.charAt(0).toUpperCase(),
            ),
          ),
          `by ${author}`,
        ],
      ) : null,

      // Date (bottom right)
      publishedDate ? React.createElement(
        'div',
        {
          key: 'date',
          style: {
            position: 'absolute',
            bottom: '40px',
            right: '80px',
            fontSize: '16px',
            color: template.subtextColor,
            fontWeight: '400',
          },
        },
        new Date(publishedDate).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      ) : null,

      // Decorative accent line
      React.createElement('div', {
        key: 'accent-line',
        style: {
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          width: OG_IMAGE_WIDTH,
          height: '8px',
          background: `linear-gradient(90deg, ${template.accent} 0%, ${template.accent}80 100%)`,
        },
      }),
    ].filter(Boolean),
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