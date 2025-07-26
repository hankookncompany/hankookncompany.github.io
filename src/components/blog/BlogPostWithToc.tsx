'use client';

import { BlogPost as BlogPostType, AuthorData } from '@/lib/content';
import { BlogPost } from './BlogPost';
import { TableOfContents } from '@/components/ui/toc';
import { useToc } from '@/hooks/useToc';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { List, X } from 'lucide-react';

interface BlogPostWithTocProps {
  post: BlogPostType;
  author?: AuthorData;
  locale: 'ko' | 'en';
}

export function BlogPostWithToc({ post, author, locale }: BlogPostWithTocProps) {
  const { ref, toc } = useToc();
  const [showMobileToc, setShowMobileToc] = useState(false);

  const hasToc = toc.length > 0;

  return (
    <div className="relative">
      {/* Mobile TOC Toggle Button */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {/* 왼쪽 여백 (TOC가 있고 충분히 큰 화면일 때만) */}
          {hasToc && <div className="hidden xl:block w-64 flex-shrink-0"></div>}
          
          {/* Mobile TOC - 메인 컨텐츠와 같은 너비 */}
          <div className="flex-shrink-0 w-full max-w-4xl">
            {hasToc && (
              <div className="xl:hidden mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileToc(!showMobileToc)}
                  className="w-full justify-start"
                >
                  {showMobileToc ? (
                    <X className="w-4 h-4 mr-2" />
                  ) : (
                    <List className="w-4 h-4 mr-2" />
                  )}
                  Table of Contents
                </Button>
                
                {/* Mobile TOC */}
                {showMobileToc && (
                  <div className="mt-4 p-4 rounded-lg bg-background">
                    <TableOfContents toc={toc} />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 오른쪽 여백 (TOC가 있고 충분히 큰 화면일 때만) */}
          {hasToc && <div className="hidden xl:block w-64 flex-shrink-0"></div>}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-8">
          {/* 왼쪽 여백 (TOC가 있고 충분히 큰 화면일 때만) */}
          {hasToc && <div className="hidden 2xl:block w-64 flex-shrink-0"></div>}
          
          {/* Main Content - 항상 중앙에 위치하며 max-w-3xl 크기 유지 */}
          <div className="flex-shrink-0 w-full max-w-4xl">
            <div ref={ref as React.RefObject<HTMLDivElement>}>
              <BlogPost
                post={post}
                author={author}
                locale={locale}
                showFullContent={true}
              />
            </div>
          </div>

          {/* Desktop TOC Sidebar */}
          {hasToc && (
            <div className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="p-4">
                  <h4 className="font-semibold mb-4 text-sm text-foreground">
                    Table of Contents
                  </h4>
                  <TableOfContents toc={toc} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
