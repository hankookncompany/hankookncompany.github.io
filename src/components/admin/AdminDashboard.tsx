'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { type BlogPost } from '@/types';

interface AdminDashboardProps {
  locale: 'ko' | 'en';
}

export function AdminDashboard({ locale }: AdminDashboardProps) {
  const t = useTranslations('admin');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm(t('posts.deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.slug !== slug));
      } else {
        alert(t('posts.deleteError'));
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert(t('posts.deleteError'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
          <p className="text-muted-foreground mt-2">{t('dashboardDescription')}</p>
        </div>
        <Link href={`/${locale}/admin/posts/new`}>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            {t('posts.create')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('posts.title')}</CardTitle>
          <CardDescription>
            {t('posts.description')} ({posts.length} {t('posts.total')})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{t('posts.empty')}</p>
              <Link href={`/${locale}/admin/posts/new`}>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  {t('posts.createFirst')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {post.title[locale] || post.title.ko}
                      </h3>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {t(`posts.status.${post.status}`)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {post.excerpt[locale] || post.excerpt.ko}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{t('posts.author')}: {post.authorId}</span>
                      <span>{t('posts.publishedAt')}: {new Date(post.publishedAt).toLocaleDateString(locale)}</span>
                      <span>{t('posts.readingTime')}: {post.readingTime}min</span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/${locale}/admin/posts/${post.slug}/edit`}>
                      <Button variant="ghost" size="sm">
                        <EditIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.slug)}
                      className="text-destructive hover:text-destructive"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}