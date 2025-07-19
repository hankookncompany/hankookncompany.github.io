'use client';

import { useState, useMemo, useEffect } from 'react';
import { BlogPost as BlogPostType, AuthorData } from '@/lib/content';
import { BlogList } from './BlogList';
import { TagFilter } from './TagFilter';
import { SearchBox } from './SearchBox';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface BlogListWithSearchProps {
  posts: BlogPostType[];
  authors: AuthorData[];
  tags: string[];
  locale: 'ko' | 'en';
}

export function BlogListWithSearch({
  posts,
  authors,
  tags,
  locale
}: BlogListWithSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('blog');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  // Initialize from URL params on mount
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlTag = searchParams.get('tag') || undefined;
    setSearchQuery(urlQuery);
    setSelectedTag(urlTag);
  }, [searchParams]);

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.frontmatter.tags.some(tag =>
          tag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
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

    return filtered;
  }, [posts, searchQuery, selectedTag]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateURL(query, selectedTag);
  };

  const handleTagSelect = (tag: string | undefined) => {
    setSelectedTag(tag);
    updateURL(searchQuery, tag);
  };

  const updateURL = (query: string, tag: string | undefined) => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set('q', query.trim());
    }

    if (tag) {
      params.set('tag', tag);
    }

    const newUrl = `/${locale}/blog${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  };

  // Determine page title and description based on filters
  const getPageTitle = () => {
    if (searchQuery && selectedTag) {
      return `${t('search.results', { query: searchQuery })} (#${selectedTag})`;
    }
    if (searchQuery) {
      return t('search.results', { query: searchQuery });
    }
    if (selectedTag) {
      return `#${selectedTag} ${t('tags.all').toLowerCase()}`;
    }
    return t('title');
  };

  const getPageDescription = () => {
    const resultCount = filteredPosts.length;

    if (searchQuery && selectedTag) {
      return t('search.resultsCount', { query: searchQuery, count: resultCount }) + ` (${t('tags.selectedTag')} ${selectedTag})`;
    }
    if (searchQuery) {
      return t('search.resultsCount', { query: searchQuery, count: resultCount });
    }
    if (selectedTag) {
      return t('tags.taggedCount', { tag: selectedTag, count: resultCount });
    }
    return t('subtitle');
  };

  const getEmptyStateMessage = () => {
    if (searchQuery && selectedTag) {
      return `${t('search.noResults', { query: searchQuery })} (${t('tags.selectedTag')} ${selectedTag})`;
    }
    if (searchQuery) {
      return t('search.noResults', { query: searchQuery });
    }
    if (selectedTag) {
      return t('tags.noTaggedPosts', { tag: selectedTag });
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      {/* Show current filter status */}
      {(searchQuery || selectedTag) && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">
            {getPageTitle()}
          </h2>
          <p className="text-muted-foreground text-sm">
            {getPageDescription()}
          </p>
        </div>
      )}

      {/* Search Box */}
      <SearchBox
        locale={locale}
        onSearch={handleSearch}
        className="mb-6"
      />

      {/* Tag Filter */}
      <TagFilter
        tags={tags}
        selectedTag={selectedTag}
        locale={locale}
        onTagSelect={handleTagSelect}
        className="mb-8"
      />

      {/* Blog List */}
      <BlogList
        posts={filteredPosts}
        authors={authors}
        locale={locale}
        currentPage={1}
        totalPages={1}
        totalPosts={filteredPosts.length}
        showPagination={false}
        emptyStateMessage={getEmptyStateMessage()}
      />
    </div>
  );
}