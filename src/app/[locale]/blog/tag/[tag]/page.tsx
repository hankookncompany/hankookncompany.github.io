import { type Locale } from '@/i18n';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBlogPostsByTag, getAuthors, getAllTags } from '@/lib/content';
import { BlogList } from '@/components/blog/BlogList';
import { TagFilter } from '@/components/blog/TagFilter';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface TagPageProps {
  params: Promise<{ locale: Locale; tag: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; tag: string }> }): Promise<Metadata> {
  const { locale, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const t = await getTranslations('blog');
  
  const title = `#${decodedTag} ${t('tags.all').toLowerCase()} - ${t('title')}`;
  const description = t('tags.taggedWith', { tag: decodedTag });

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

export default async function TagPage({ params }: TagPageProps) {
  const { locale, tag } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  const decodedTag = decodeURIComponent(tag);
  const t = await getTranslations('blog');
  
  // Get posts for this tag and all available tags
  const [tagPosts, authors, allTags] = await Promise.all([
    getBlogPostsByTag(decodedTag, locale),
    getAuthors(locale),
    getAllTags(locale),
  ]);

  // If no posts found for this tag, show 404
  if (tagPosts.length === 0) {
    // Check if the tag exists at all
    const tagExists = allTags.some(t => t.toLowerCase() === decodedTag.toLowerCase());
    if (!tagExists) {
      notFound();
    }
  }

  const currentPage = 1;
  const totalPages = 1;
  const totalPosts = tagPosts.length;

  const emptyStateMessage = t('tags.noTaggedPosts', { tag: decodedTag });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {t('title')} - #{decodedTag}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t('tags.taggedWith', { tag: decodedTag })}
          </p>

          {/* Tag Filter Component */}
          <TagFilter
            tags={allTags}
            selectedTag={decodedTag}
            locale={locale}
            className="mb-8"
          />
        </div>

        <BlogList
          posts={tagPosts}
          authors={authors}
          locale={locale}
          currentPage={currentPage}
          totalPages={totalPages}
          totalPosts={totalPosts}
          basePath={`/${locale}/blog/tag/${encodeURIComponent(decodedTag.toLowerCase())}`}
          showPagination={false} // For static generation, show all posts
          emptyStateMessage={emptyStateMessage}
        />
      </div>
    </div>
  );
}

// Generate static params for all tags
export async function generateStaticParams({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  
  try {
    const tags = await getAllTags(locale);
    
    return tags.map((tag) => ({
      tag: encodeURIComponent(tag.toLowerCase()),
    }));
  } catch (error) {
    console.warn(`Failed to generate static params for tag pages (${locale}):`, error);
    return [];
  }
}