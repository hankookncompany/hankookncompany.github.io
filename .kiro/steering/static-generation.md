# Static Generation Guidelines

## Overview
This project uses Next.js static site generation (SSG) for GitHub Pages hosting. All pages must be statically generated at build time.

## Key Constraints

### No Dynamic Server Features
- **No searchParams**: Cannot use `searchParams` in page components as it makes pages dynamic
- **No API routes**: All data must be available at build time
- **No server-side rendering**: Everything must be pre-rendered as static HTML

### Internationalization (i18n) Requirements
For multilingual static sites:

1. **No hardcoded strings**: All user-facing text must use translation keys
2. **Use next-intl**: Leverage `useTranslations()` hook for client components
3. **Server components**: Use `getTranslations()` for server-side translations
4. **Translation files**: Store all text in `messages/[locale].json` files
5. **Consistent keys**: Use structured translation keys (e.g., `blog.search.placeholder`)

#### ✅ Correct: Using translations
```typescript
// Client component
'use client';
import { useTranslations } from 'next-intl';

export function SearchBox() {
  const t = useTranslations('blog.search');
  return (
    <input placeholder={t('placeholder')} />
  );
}

// Server component
import { getTranslations } from 'next-intl/server';

export default async function BlogPage() {
  const t = await getTranslations('blog');
  return <h1>{t('title')}</h1>;
}
```

#### ❌ Incorrect: Hardcoded strings
```typescript
// Don't do this
const title = locale === 'ko' ? '블로그' : 'Blog';
const placeholder = locale === 'ko' ? '검색...' : 'Search...';
```

### Search and Filtering Strategy
For search and filtering functionality in static sites:

1. **Client-side search**: Implement search using client-side JavaScript after page load
2. **Static tag pages**: Generate individual static pages for each tag filter
3. **Pre-built indexes**: Generate search indexes at build time
4. **URL-based navigation**: Use client-side routing for search states

### Implementation Patterns

#### ✅ Correct: Static Tag Pages
```typescript
// app/[locale]/blog/tag/[tag]/page.tsx
export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = params; // ✅ params is fine for static generation
  const posts = await getBlogPostsByTag(tag);
  return <BlogList posts={posts} />;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(tag => ({ tag }));
}
```

#### ✅ Correct: Client-side Search
```typescript
// app/[locale]/blog/page.tsx
export default async function BlogPage() {
  const allPosts = await getAllPosts(); // ✅ Static data
  return (
    <div>
      <SearchBox /> {/* Client-side search component */}
      <BlogList posts={allPosts} />
    </div>
  );
}

// components/SearchBox.tsx
'use client';
export function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  
  const handleSearch = () => {
    // Use client-side routing, not server searchParams
    router.push(`/blog/search?q=${query}`);
  };
}
```

#### ❌ Incorrect: Using searchParams
```typescript
// This makes the page dynamic and breaks static generation
export default async function BlogPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q; // ❌ This breaks static generation
}
```

### Search Implementation Strategy

1. **Main blog page**: Show all posts, include client-side search box
2. **Search results**: Use a separate `/search` page or client-side filtering
3. **Tag filtering**: Use static `/tag/[tag]` pages
4. **Client-side state**: Manage search state in React components

### Build-time Data Generation
- Generate all possible static pages at build time
- Pre-compute search indexes and tag lists
- Store all data in static JSON files if needed for client-side search

## Next.js Configuration
```javascript
// next.config.js
const nextConfig = {
  output: 'export', // Required for static generation
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
};
```