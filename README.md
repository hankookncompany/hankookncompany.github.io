This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## Automated Translation System

This project includes an automated translation system that converts Korean content to English during the build process. The translation is handled by GitHub Actions to keep API keys secure.

### How it works

1. Content is authored in Korean (`.ko.mdx` or `.ko.json` files)
2. When content is pushed to the main branch, a GitHub Action is triggered
3. The action uses the OpenAI API to translate the content to English
4. Translated files (`.en.mdx` or `.en.json`) are committed back to the repository
5. The website builds with both Korean and English content

### Setting up translation

1. Add your OpenAI API key as a GitHub repository secret:
   - `OPENAI_API_KEY` - OpenAI API key

2. The translation workflow will run automatically when Korean content files are modified

### Manual translations

If you want to manually translate a file instead of using automatic translation:

1. Create the English version file (e.g., `your-post.en.mdx` or `author.en.json`)
2. Add `manualTranslation: true` to the frontmatter (for MDX) or as a top-level property (for JSON)

Example for MDX:
```mdx
---
title: "Manually Translated Post"
excerpt: "This is a manually translated post"
author: "john-doe"
publishedAt: "2024-01-15T09:00:00Z"
tags: ["Next.js", "React"]
status: "published"
manualTranslation: true
---

Content here...
```

Example for JSON:
```json
{
  "id": "john-doe",
  "name": "John Doe",
  "bio": "Full-stack developer...",
  "manualTranslation": true
}
```

Files marked with `manualTranslation: true` will be skipped by the automatic translation process.

### Manual translation

You can also run the translation process manually:

```bash
# Translate all content types
npm run translate:all

# Or translate specific content types
npm run translate:posts
npm run translate:products
npm run translate:authors
```

Note: This requires setting up the OpenAI API key in your local `.env` file.