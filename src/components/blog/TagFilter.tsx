'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface TagFilterProps {
  tags: string[];
  selectedTag?: string;
  locale: 'ko' | 'en';
  showAllTagsLink?: boolean;
  className?: string;
  onTagSelect?: (tag: string | undefined) => void;
}

export function TagFilter({ 
  tags, 
  selectedTag, 
  locale, 
  showAllTagsLink = true,
  className = '',
  onTagSelect
}: TagFilterProps) {
  const pathname = usePathname();
  const t = useTranslations('blog.tags');
  const baseBlogPath = `/${locale}/blog`;
  
  const getTagUrl = (tag: string): string => {
    return `${baseBlogPath}/tag/${encodeURIComponent(tag.toLowerCase())}`;
  };

  const getAllPostsUrl = (): string => {
    return baseBlogPath;
  };

  const handleTagClick = (tag: string | undefined) => {
    if (onTagSelect) {
      onTagSelect(tag);
    }
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Tag Display */}
      {selectedTag && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">
            {t('selectedTag')}
          </span>
          <Badge variant="default" className="flex items-center gap-1">
            #{selectedTag}
            {onTagSelect ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 hover:bg-transparent"
                onClick={() => handleTagClick(undefined)}
              >
                <X className="w-3 h-3" />
                <span className="sr-only">
                  {t('removeFilter')}
                </span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 hover:bg-transparent"
                asChild
              >
                <Link href={getAllPostsUrl()}>
                  <X className="w-3 h-3" />
                  <span className="sr-only">
                    {t('removeFilter')}
                  </span>
                </Link>
              </Button>
            )}
          </Badge>
        </div>
      )}

      {/* Tags List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('filterBy')}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {/* All Posts Link/Button */}
          {showAllTagsLink && (
            <Button
              variant={!selectedTag ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={onTagSelect ? () => handleTagClick(undefined) : undefined}
              asChild={!onTagSelect}
            >
              {onTagSelect ? (
                <span>{t('all')}</span>
              ) : (
                <Link href={getAllPostsUrl()}>
                  {t('all')}
                </Link>
              )}
            </Button>
          )}
          
          {/* Individual Tag Links/Buttons */}
          {tags.map((tag) => {
            const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
            
            return (
              <Button
                key={tag}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={onTagSelect ? () => handleTagClick(tag) : undefined}
                asChild={!onTagSelect}
              >
                {onTagSelect ? (
                  <span>#{tag}</span>
                ) : (
                  <Link href={getTagUrl(tag)}>
                    #{tag}
                  </Link>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}