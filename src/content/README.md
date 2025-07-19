# Content Directory

This directory contains all the content for the tech blog.

## Structure

- `posts/` - Blog posts in MDX format
  - `*.ko.mdx` - Original Korean posts
  - `*.en.mdx` - Auto-generated English translations
- `products/` - Product showcase data in JSON format
  - `*.ko.json` - Original Korean product data
  - `*.en.json` - Auto-generated English translations
- `authors/` - Team member profiles in JSON format
  - `*.ko.json` - Original Korean author profiles
  - `*.en.json` - Auto-generated English translations

## File Naming Convention

All content files should follow the pattern:
- `{slug}.{locale}.{extension}`
- Example: `nextjs-optimization.ko.mdx`, `project-alpha.ko.json`

## Content Creation

1. Create content in Korean first (primary language)
2. English translations will be auto-generated during build process
3. Use descriptive slugs for SEO-friendly URLs