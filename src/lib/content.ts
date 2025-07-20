

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPostFrontmatter {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  status: 'draft' | 'published';
  featuredImage?: string;
  relatedProducts?: string[];
}

export interface BlogPost {
  slug: string;
  locale: 'ko' | 'en';
  frontmatter: BlogPostFrontmatter;
  content: string;
  readingTime: number;
}

export interface ProductData {
  id: string;
  slug: string;
  name: string;
  description: string;
  features: string[];
  technologies: string[];
  screenshots: string[];
  demoUrl?: string;
  githubUrl?: string;
  status: 'active' | 'archived';
  createdAt: string;
  relatedPosts?: string[];
}

export interface AuthorData {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  skills: string[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  joinedAt: string;
  isActive: boolean;
  projects: string[];
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const PRODUCTS_DIR = path.join(CONTENT_DIR, 'products');
const AUTHORS_DIR = path.join(CONTENT_DIR, 'authors');

/**
 * Calculate reading time for content (words per minute: 200)
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get all blog posts for a specific locale
 */
export async function getBlogPosts(locale: 'ko' | 'en' = 'ko'): Promise<BlogPost[]> {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR);
  const posts: BlogPost[] = [];

  for (const file of files) {
    if (!file.endsWith(`.${locale}.mdx`)) continue;

    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    // Extract slug from filename (remove .locale.mdx)
    const slug = file.replace(`.${locale}.mdx`, '');

    posts.push({
      slug,
      locale,
      frontmatter: frontmatter as BlogPostFrontmatter,
      content,
      readingTime: calculateReadingTime(content),
    });
  }

  // Sort by publication date (newest first)
  return posts.sort((a, b) =>
    new Date(b.frontmatter.publishedAt).getTime() -
    new Date(a.frontmatter.publishedAt).getTime()
  );
}

/**
 * Get a single blog post by slug and locale
 */
export async function getBlogPost(slug: string, locale: 'ko' | 'en' = 'ko'): Promise<BlogPost | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.${locale}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);

  return {
    slug,
    locale,
    frontmatter: frontmatter as BlogPostFrontmatter,
    content,
    readingTime: calculateReadingTime(content),
  };
}

/**
 * Check if a blog post exists in another locale
 */
export async function checkPostExistsInLocale(slug: string, locale: 'ko' | 'en'): Promise<boolean> {
  const filePath = path.join(POSTS_DIR, `${slug}.${locale}.mdx`);
  return fs.existsSync(filePath);
}

/**
 * Get published blog posts only
 */
export async function getPublishedBlogPosts(locale: 'ko' | 'en' = 'ko'): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts(locale);
  return allPosts.filter(post => post.frontmatter.status === 'published');
}

/**
 * Get blog posts by tag
 */
export async function getBlogPostsByTag(tag: string, locale: 'ko' | 'en' = 'ko'): Promise<BlogPost[]> {
  const allPosts = await getPublishedBlogPosts(locale);
  return allPosts.filter(post =>
    post.frontmatter.tags.some(postTag =>
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

/**
 * Get all unique tags from published posts
 */
export async function getAllTags(locale: 'ko' | 'en' = 'ko'): Promise<string[]> {
  const posts = await getPublishedBlogPosts(locale);
  const tagSet = new Set<string>();

  posts.forEach(post => {
    post.frontmatter.tags.forEach(tag => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/**
 * Get products data for a specific locale
 */
export async function getProducts(locale: 'ko' | 'en' = 'ko'): Promise<ProductData[]> {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(PRODUCTS_DIR);
  const products: ProductData[] = [];

  for (const file of files) {
    if (!file.endsWith(`.${locale}.json`)) continue;

    const filePath = path.join(PRODUCTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const productData = JSON.parse(fileContent) as ProductData;

    products.push(productData);
  }

  // Sort by creation date (newest first)
  return products.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get a single product by slug and locale
 */
export async function getProduct(slug: string, locale: 'ko' | 'en' = 'ko'): Promise<ProductData | null> {
  const filePath = path.join(PRODUCTS_DIR, `${slug}.${locale}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as ProductData;
}

/**
 * Get authors data for a specific locale
 */
export async function getAuthors(locale: 'ko' | 'en' = 'ko'): Promise<AuthorData[]> {
  if (!fs.existsSync(AUTHORS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(AUTHORS_DIR);
  const authors: AuthorData[] = [];

  for (const file of files) {
    if (!file.endsWith(`.${locale}.json`)) continue;

    const filePath = path.join(AUTHORS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const authorData = JSON.parse(fileContent) as AuthorData;

    authors.push(authorData);
  }

  // Sort by join date (newest first)
  return authors.sort((a, b) =>
    new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
  );
}

/**
 * Get a single author by slug and locale
 */
export async function getAuthor(slug: string, locale: 'ko' | 'en' = 'ko'): Promise<AuthorData | null> {
  const filePath = path.join(AUTHORS_DIR, `${slug}.${locale}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as AuthorData;
}

/**
 * Check if an author exists in another locale
 */
export async function checkAuthorExistsInLocale(slug: string, locale: 'ko' | 'en'): Promise<boolean> {
  const filePath = path.join(AUTHORS_DIR, `${slug}.${locale}.json`);
  return fs.existsSync(filePath);
}

/**
 * Get blog posts by author
 */
export async function getBlogPostsByAuthor(authorSlug: string, locale: 'ko' | 'en' = 'ko'): Promise<BlogPost[]> {
  const allPosts = await getPublishedBlogPosts(locale);
  return allPosts.filter(post => post.frontmatter.author === authorSlug);
}

/**
 * Get related blog posts for a product
 */
export async function getRelatedPostsForProduct(productSlug: string, locale: 'ko' | 'en' = 'ko'): Promise<BlogPost[]> {
  const allPosts = await getPublishedBlogPosts(locale);
  return allPosts.filter(post =>
    post.frontmatter.relatedProducts?.includes(productSlug)
  );
}

/**
 * Get related products for a blog post
 */
export async function getRelatedProductsForPost(post: BlogPost, locale: 'ko' | 'en' = 'ko'): Promise<ProductData[]> {
  if (!post.frontmatter.relatedProducts?.length) {
    return [];
  }

  const allProducts = await getProducts(locale);
  return allProducts.filter(product =>
    post.frontmatter.relatedProducts!.includes(product.slug)
  );
}

/**
 * Search blog posts by query (title, content, tags)
 */
export async function searchBlogPosts(query: string, locale: 'ko' | 'en' = 'ko'): Promise<BlogPost[]> {
  if (!query.trim()) {
    return getPublishedBlogPosts(locale);
  }

  const allPosts = await getPublishedBlogPosts(locale);
  const searchTerm = query.toLowerCase().trim();

  return allPosts.filter(post => {
    // Search in title
    const titleMatch = post.frontmatter.title.toLowerCase().includes(searchTerm);
    
    // Search in excerpt
    const excerptMatch = post.frontmatter.excerpt.toLowerCase().includes(searchTerm);
    
    // Search in content (remove markdown syntax for better search)
    const contentMatch = post.content
      .replace(/[#*`_~\[\]()]/g, '') // Remove common markdown characters
      .toLowerCase()
      .includes(searchTerm);
    
    // Search in tags
    const tagMatch = post.frontmatter.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    );

    return titleMatch || excerptMatch || contentMatch || tagMatch;
  });
}

/**
 * Get tag statistics (tag name and post count)
 */
export async function getTagStats(locale: 'ko' | 'en' = 'ko'): Promise<Array<{ tag: string; count: number }>> {
  const posts = await getPublishedBlogPosts(locale);
  const tagCounts = new Map<string, number>();

  posts.forEach(post => {
    post.frontmatter.tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase();
      tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
}