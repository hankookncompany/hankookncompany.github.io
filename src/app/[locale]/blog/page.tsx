import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPublishedBlogPosts, getAuthors, getAllTags } from '@/lib/content';
import { BlogListWithSearch } from '@/components/blog/BlogListWithSearch';
import { Metadata } from 'next';
import { type Locale } from '@/i18n';
import { Suspense } from 'react';

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: { 
  params: Promise<{ locale: Locale }>; 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('blog');
  
  const title = t('title');
  const description = t('subtitle');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Get translations
  const t = await getTranslations('blog');
  
  // Get all posts, authors, and tags at build time
  const [posts, authors, allTags] = await Promise.all([
    getPublishedBlogPosts(locale),
    getAuthors(locale),
    getAllTags(locale),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t('subtitle')}
          </p>
        </div>

        {/* Client-side search and filtering component */}
        <Suspense fallback={
          <div className="space-y-6">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <BlogListWithSearch
            posts={posts}
            authors={authors}
            tags={allTags}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  );
}