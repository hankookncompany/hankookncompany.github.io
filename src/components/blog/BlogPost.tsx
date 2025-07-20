'use client';

import { BlogPost as BlogPostType, AuthorData } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, Clock, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mdxComponents from '@/components/MDXComponents';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface BlogPostProps {
  post: BlogPostType;
  author?: AuthorData;
  locale: 'ko' | 'en';
  showFullContent?: boolean;
}

export function BlogPost({ post, author, locale, showFullContent = false }: BlogPostProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | undefined>();
  const t = useTranslations('blog');

  useEffect(() => {
    const prepareMDX = async () => {
      const source = await serialize(post.content);
      setMdxSource(source);
    };

    if (showFullContent) {
      prepareMDX();
    }
  }, [post.content, showFullContent]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${locale}/blog/${post.slug}`;
    const title = post.frontmatter.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: post.frontmatter.excerpt,
          url,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        // You could add a toast notification here
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    }
  };

  const getReadingTimeText = (minutes: number) => {
    if (locale === 'ko') {
      return `${minutes}분 읽기`;
    }
    return minutes === 1 ? '1 min read' : `${minutes} min read`;
  };

  return (
    <Card className="w-full pt-0">
      {post.frontmatter.featuredImage && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={post.frontmatter.featuredImage}
            alt={post.frontmatter.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-3">
          {post.frontmatter.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className={showFullContent ? "text-3xl font-bold mb-4" : "text-xl font-semibold mb-2"}>
          {showFullContent ? (
            post.frontmatter.title
          ) : (
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="hover:text-primary transition-colors"
            >
              {post.frontmatter.title}
            </Link>
          )}
        </h1>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          {author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <Link
                href={`/${locale}/authors/${author.slug}`}
                className="hover:text-primary transition-colors"
              >
                {author.name}
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.frontmatter.publishedAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{getReadingTimeText(post.readingTime)}</span>
          </div>

          {showFullContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="sm:ml-auto mt-2 sm:mt-0"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {t('share')}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {showFullContent ? (
          <div className="mdx-content prose prose-slate dark:prose-invert max-w-none">
            {mdxSource && <MDXRemote {...mdxSource} components={mdxComponents} />}
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {post.frontmatter.excerpt}
            </p>
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="text-primary hover:underline font-medium"
            >
              {t('readMore')} →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}