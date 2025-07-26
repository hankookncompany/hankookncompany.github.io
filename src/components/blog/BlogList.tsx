'use client';

import { BlogPost as BlogPostType, AuthorData } from '@/lib/content';
import { BlogPost } from './BlogPost';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface BlogListProps {
  posts: BlogPostType[];
  authors?: AuthorData[];
  locale: 'ko' | 'en';
  currentPage?: number;
  totalPages?: number;
  totalPosts?: number;
  basePath?: string; // For tag filtering or other contexts
  showPagination?: boolean;
  emptyStateMessage?: string;
}

export function BlogList({ 
  posts, 
  authors = [], 
  locale, 
  currentPage = 1, 
  totalPages = 1,
  totalPosts,
  basePath = `/${locale}/blog`,
  showPagination = true,
  emptyStateMessage
}: BlogListProps) {
  const t = useTranslations('blog');
  
  const getAuthorForPost = (post: BlogPostType): AuthorData | undefined => {
    if (!authors) return undefined;
    return authors.find(author => author.slug === post.frontmatter.author);
  };

  const getPaginationUrl = (page: number): string => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}?page=${page}`;
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          {t('noPostsFound')}
        </h3>
        <p className="text-muted-foreground">
          {emptyStateMessage || t('emptyState')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts Grid */}
      <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
        {posts.map((post) => (
          <BlogPost
            key={`${post.slug}-${post.locale}`}
            post={post}
            author={getAuthorForPost(post)}
            locale={locale}
            showFullContent={false}
          />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={currentPage <= 1}
          >
            <Link href={getPaginationUrl(currentPage - 1)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t('pagination.previous')}
            </Link>
          </Button>

          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isCurrentPage = page === currentPage;
              const shouldShow = 
                page === 1 || 
                page === totalPages || 
                Math.abs(page - currentPage) <= 1;

              if (!shouldShow) {
                // Show ellipsis for gaps
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={getPaginationUrl(page)}>
                    {page}
                  </Link>
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={currentPage >= totalPages}
          >
            <Link href={getPaginationUrl(currentPage + 1)}>
              {t('pagination.next')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}

      {/* Page Info */}
      {showPagination && totalPages > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {totalPosts ? (
            t('pagination.pageInfo', { 
              current: currentPage, 
              totalPages: totalPages, 
              total: totalPosts 
            })
          ) : (
            t('pagination.pageInfoSimple', { 
              current: currentPage, 
              totalPages: totalPages 
            })
          )}
        </div>
      )}
    </div>
  );
}