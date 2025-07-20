import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type BlogPost } from '@/types';

// Only allow admin API in development
if (process.env.NODE_ENV === 'production') {
  throw new Error('Admin API is not available in production');
}

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}


// Helper function to parse MDX file
async function parseMDXFile(filePath: string): Promise<BlogPost | null> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    const fileName = path.basename(filePath, '.mdx');
    const lastDot = fileName.lastIndexOf('.');

    if (lastDot === -1) {
      throw new Error(`Invalid MDX filename: ${fileName}`);
    }

    const slug = fileName.slice(0, lastDot);          // "my.long.slug"
    const locale = fileName.slice(lastDot + 1) as 'ko' | 'en';  // "ko" | "en"

    // locale 안전 검사 (선택)
    if (locale !== 'ko' && locale !== 'en') {
      throw new Error(`Unsupported locale in filename: ${locale}`);
    }

    const makeLocaleObj = (value: string) =>
      locale === 'ko'
        ? { ko: value }                     // ko 글 → { ko: '...' }
        : { ko: '', en: value };            // en 글 → { ko: '', en: '...' }

    return {
      id: slug,
      slug,
      title: makeLocaleObj(frontmatter.title),
      content: makeLocaleObj(content),
      excerpt: makeLocaleObj(
        frontmatter.excerpt || content.substring(0, 200) + '...',
      ),
      authorId: frontmatter.author || 'john-doe',
      publishedAt: new Date(
        frontmatter.publishedAt || frontmatter.date || Date.now(),
      ),
      updatedAt: new Date(frontmatter.updatedAt || Date.now()),
      tags: frontmatter.tags || [],
      status: frontmatter.status || 'draft',
      featuredImage: frontmatter.featuredImage,
      readingTime: calculateReadingTime(content),
      relatedProducts: frontmatter.relatedProducts || [],
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

// Helper function to get all posts
async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    const postsMap = new Map<string, BlogPost>();

    for (const file of mdxFiles) {
      const filePath = path.join(POSTS_DIR, file);
      const post = await parseMDXFile(filePath);

      if (post) {
        const existingPost = postsMap.get(post.slug);
        if (existingPost) {
          // Merge language versions
          existingPost.title = { ...existingPost.title, ...post.title };
          existingPost.content = { ...existingPost.content, ...post.content };
          existingPost.excerpt = { ...existingPost.excerpt, ...post.excerpt };
        } else {
          postsMap.set(post.slug, post);
        }
      }
    }

    return Array.from(postsMap.values()).sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

// GET /api/admin/posts - Get all posts
export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, authorId, tags, status, featuredImage } = body;

    if (!title.ko || !content.ko) {
      return NextResponse.json(
        { error: 'Korean title and content are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title.ko);
    const now = new Date();

    // Create frontmatter
    const frontmatter = {
      title: title.ko,
      excerpt: excerpt.ko,
      author: authorId,
      publishedAt: now.toISOString(),
      updatedAt: now.toISOString(),
      tags: tags || [],
      status: status || 'draft',
      ...(featuredImage && { featuredImage }),
    };

    // Create MDX content for Korean
    const koContent = matter.stringify(content.ko, frontmatter);
    const koFilePath = path.join(POSTS_DIR, `${slug}.ko.mdx`);
    await fs.writeFile(koFilePath, koContent, 'utf-8');

    // Create MDX content for English if provided
    if (title.en && content.en) {
      const enFrontmatter = {
        ...frontmatter,
        title: title.en,
        excerpt: excerpt.en || excerpt.ko,
      };
      const enContent = matter.stringify(content.en, enFrontmatter);
      const enFilePath = path.join(POSTS_DIR, `${slug}.en.mdx`);
      await fs.writeFile(enFilePath, enContent, 'utf-8');
    }

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}