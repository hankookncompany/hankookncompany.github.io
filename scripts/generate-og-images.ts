#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { 
  getBlogPosts, 
  getProducts, 
  getAuthors, 
  getAuthor 
} from '../src/lib/content';
import { 
  generateBlogPostOGImage,
  generateProductOGImage,
  generateAuthorOGImage,
  generateHomepageOGImage,
  generateOGImageFilename
} from '@/lib/og-image';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og');

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Save ImageResponse to file
 */
async function saveImageToFile(imageResponse: Response, filename: string) {
  const buffer = await imageResponse.arrayBuffer();
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, Buffer.from(buffer));
  console.log(`✓ Generated: ${filename}`);
}

/**
 * Generate OG images for all blog posts
 */
async function generateBlogPostImages() {
  console.log('\n📝 Generating blog post OG images...');
  
  const locales: ('ko' | 'en')[] = ['ko', 'en'];
  
  for (const locale of locales) {
    const posts = await getBlogPosts(locale);
    
    for (const post of posts) {
      try {
        // Get author data
        const author = await getAuthor(post.frontmatter.author, locale);
        if (!author) {
          console.warn(`⚠️  Author not found for post: ${post.slug} (${locale})`);
          continue;
        }

        // Generate OG image
        const imageResponse = await generateBlogPostOGImage(post, author, locale);
        const filename = generateOGImageFilename('blog', post.slug, locale);
        
        await saveImageToFile(imageResponse, filename);
      } catch (error) {
        console.error(`❌ Failed to generate OG image for blog post: ${post.slug} (${locale})`, error);
      }
    }
  }
}

/**
 * Generate OG images for all products
 */
async function generateProductImages() {
  console.log('\n🚀 Generating product OG images...');
  
  const locales: ('ko' | 'en')[] = ['ko', 'en'];
  
  for (const locale of locales) {
    const products = await getProducts(locale);
    
    for (const product of products) {
      try {
        // Generate OG image
        const imageResponse = await generateProductOGImage(product, locale);
        const filename = generateOGImageFilename('product', product.slug, locale);
        
        await saveImageToFile(imageResponse, filename);
      } catch (error) {
        console.error(`❌ Failed to generate OG image for product: ${product.slug} (${locale})`, error);
      }
    }
  }
}

/**
 * Generate OG images for all authors
 */
async function generateAuthorImages() {
  console.log('\n👥 Generating author OG images...');
  
  const locales: ('ko' | 'en')[] = ['ko', 'en'];
  
  for (const locale of locales) {
    const authors = await getAuthors(locale);
    
    for (const author of authors) {
      try {
        // Generate OG image
        const imageResponse = await generateAuthorOGImage(author, locale);
        const filename = generateOGImageFilename('author', author.slug, locale);
        
        await saveImageToFile(imageResponse, filename);
      } catch (error) {
        console.error(`❌ Failed to generate OG image for author: ${author.slug} (${locale})`, error);
      }
    }
  }
}

/**
 * Generate homepage OG images
 */
async function generateHomepageImages() {
  console.log('\n🏠 Generating homepage OG images...');
  
  const locales: ('ko' | 'en')[] = ['ko', 'en'];
  
  for (const locale of locales) {
    try {
      // Generate OG image
      const imageResponse = await generateHomepageOGImage(locale);
      const filename = generateOGImageFilename('home', 'index', locale);
      
      await saveImageToFile(imageResponse, filename);
    } catch (error) {
      console.error(`❌ Failed to generate homepage OG image (${locale})`, error);
    }
  }
}

/**
 * Clean old OG images
 */
function cleanOldImages() {
  console.log('\n🧹 Cleaning old OG images...');
  
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const file of files) {
      if (file.startsWith('og-') && file.endsWith('.png')) {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
      }
    }
  }
}

/**
 * Main function to generate all OG images
 */
async function main() {
  console.log('🎨 Starting OG image generation...');
  
  try {
    // Ensure output directory exists
    ensureOutputDir();
    
    // Clean old images
    cleanOldImages();
    
    // Generate all OG images
    await generateHomepageImages();
    await generateBlogPostImages();
    await generateProductImages();
    await generateAuthorImages();
    
    console.log('\n✅ OG image generation completed successfully!');
    
    // Show summary
    const files = fs.readdirSync(OUTPUT_DIR);
    const ogFiles = files.filter(file => file.startsWith('og-') && file.endsWith('.png'));
    console.log(`📊 Generated ${ogFiles.length} OG images total`);
    
  } catch (error) {
    console.error('❌ OG image generation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}