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

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to get post by slug
async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const koFilePath = path.join(POSTS_DIR, `${slug}.ko.mdx`);
    const enFilePath = path.join(POSTS_DIR, `${slug}.en.mdx`);
    
    let post: BlogPost | null = null;
    
    // Read Korean version (required)
    try {
      const koContent = await fs.readFile(koFilePath, 'utf-8');
      const { data: koFrontmatter, content: koBody } = matter(koContent);
      
      post = {
        id: slug,
        slug,
        title: { ko: koFrontmatter.title },
        content: { ko: koBody },
        excerpt: { ko: koFrontmatter.excerpt || koBody.substring(0, 200) + '...' },
        authorId: koFrontmatter.author || 'john-doe',
        publishedAt: new Date(koFrontmatter.publishedAt || koFrontmatter.date || Date.now()),
        updatedAt: new Date(koFrontmatter.updatedAt || Date.now()),
        tags: koFrontmatter.tags || [],
        status: koFrontmatter.status || 'draft',
        featuredImage: koFrontmatter.featuredImage,
        readingTime: calculateReadingTime(koBody),
        relatedProducts: koFrontmatter.relatedProducts || [],
      };
    } catch (error) {
      console.error(`Korean file not found for ${slug}:`, error);
      return null;
    }
    
    // Read English version (optional)
    try {
      const enContent = await fs.readFile(enFilePath, 'utf-8');
      const { data: enFrontmatter, content: enBody } = matter(enContent);
      
      if (post) {
        post.title.en = enFrontmatter.title;
        post.content.en = enBody;
        post.excerpt.en = enFrontmatter.excerpt || enBody.substring(0, 200) + '...';
      }
    } catch (error) {
      // English version is optional, so this is not an error
      console.log(`English version not found for ${slug}, which is okay`);
    }
    
    return post;
  } catch (error) {
    console.error(`Error getting post ${slug}:`, error);
    return null;
  }
}

// GET /api/admin/posts/[slug] - Get specific post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/posts/[slug] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, content, excerpt, authorId, tags, status, featuredImage } = body;
    
    if (!title.ko || !content.ko) {
      return NextResponse.json(
        { error: 'Korean title and content are required' },
        { status: 400 }
      );
    }
    
    const now = new Date();
    
    // Update Korean version
    const koFrontmatter = {
      title: title.ko,
      excerpt: excerpt.ko,
      author: authorId,
      updatedAt: now.toISOString(),
      tags: tags || [],
      status: status || 'draft',
      ...(featuredImage && { featuredImage }),
    };
    
    // Preserve original publishedAt if it exists
    const existingPost = await getPostBySlug(slug);
    if (existingPost) {
      koFrontmatter.publishedAt = existingPost.publishedAt.toISOString();
    } else {
      koFrontmatter.publishedAt = now.toISOString();
    }
    
    const koContent = matter.stringify(content.ko, koFrontmatter);
    const koFilePath = path.join(POSTS_DIR, `${slug}.ko.mdx`);
    await fs.writeFile(koFilePath, koContent, 'utf-8');
    
    // Update English version if provided
    if (title.en && content.en) {
      const enFrontmatter = {
        ...koFrontmatter,
        title: title.en,
        excerpt: excerpt.en || excerpt.ko,
      };
      const enContent = matter.stringify(content.en, enFrontmatter);
      const enFilePath = path.join(POSTS_DIR, `${slug}.en.mdx`);
      await fs.writeFile(enFilePath, enContent, 'utf-8');
    } else {
      // Remove English version if not provided
      const enFilePath = path.join(POSTS_DIR, `${slug}.en.mdx`);
      try {
        await fs.unlink(enFilePath);
      } catch (error) {
        // File might not exist, which is fine
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post updated successfully' 
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts/[slug] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const koFilePath = path.join(POSTS_DIR, `${slug}.ko.mdx`);
    const enFilePath = path.join(POSTS_DIR, `${slug}.en.mdx`);
    
    // Delete Korean version
    try {
      await fs.unlink(koFilePath);
    } catch (error) {
      console.error(`Failed to delete Korean version of ${slug}:`, error);
    }
    
    // Delete English version if it exists
    try {
      await fs.unlink(enFilePath);
    } catch (error) {
      // English version might not exist, which is fine
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}