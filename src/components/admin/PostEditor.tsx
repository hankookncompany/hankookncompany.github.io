'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SaveIcon, EyeIcon, ArrowLeftIcon, PlusIcon, XIcon } from 'lucide-react';
import { type BlogPost } from '@/types';

interface PostEditorProps {
  locale: 'ko' | 'en';
  slug?: string; // undefined for new posts
}

export function PostEditor({ locale, slug }: PostEditorProps) {
  const t = useTranslations('admin.posts');
  const router = useRouter();
  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    title: { ko: '', en: '' },
    content: { ko: '', en: '' },
    excerpt: { ko: '', en: '' },
    authorId: 'john-doe', // Default author
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published',
    featuredImage: '',
  });

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    if (!slug) return;

    try {
      const response = await fetch(`/api/admin/posts/${slug}`);
      if (response.ok) {
        const post: BlogPost = await response.json();
        setFormData({
          title:   { ko: post.title.ko   ?? '', en: post.title.en   ?? '' },
          content: { ko: post.content.ko ?? '', en: post.content.en ?? '' },
          excerpt: { ko: post.excerpt.ko ?? '', en: post.excerpt.en ?? '' },
          authorId: post.authorId,
          tags: post.tags,
          status: post.status,
          featuredImage: post.featuredImage || '',
        });
      } else {
        alert(t('loadError'));
        router.back();
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      alert(t('loadError'));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!formData.title.ko.trim()) {
      alert(t('validation.titleRequired'));
      return;
    }

    if (!formData.content.ko.trim()) {
      alert(t('validation.contentRequired'));
      return;
    }

    setSaving(true);

    try {
      const method = slug ? 'PUT' : 'POST';
      const url = slug ? `/api/admin/posts/${slug}` : '/api/admin/posts';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(t(slug ? 'updateSuccess' : 'createSuccess'));
        router.push(`/${locale}/admin`);
      } else {
        const error = await response.json();
        alert(error.message || t('saveError'));
      }
    } catch (error) {
      console.error('Failed to save post:', error);
      alert(t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {slug ? t('edit') : t('create')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {slug ? t('editDescription') : t('createDescription')}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('basicInfo')}</CardTitle>
            <CardDescription>{t('basicInfoDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('title')} (한국어) *
                </label>
                <Input
                  value={formData.title.ko}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, ko: e.target.value }
                  })}
                  placeholder={t('titlePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('title')} (English)
                </label>
                <Input
                  value={formData.title.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, en: e.target.value }
                  })}
                  placeholder="English title (optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('excerpt')} (한국어) *
                </label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={formData.excerpt.ko}
                  onChange={(e) => setFormData({
                    ...formData,
                    excerpt: { ...formData.excerpt, ko: e.target.value }
                  })}
                  placeholder={t('excerptPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('excerpt')} (English)
                </label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={formData.excerpt.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    excerpt: { ...formData.excerpt, en: e.target.value }
                  })}
                  placeholder="English excerpt (optional)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('author')}
              </label>
              <Input
                value={formData.authorId}
                onChange={(e) => setFormData({
                  ...formData,
                  authorId: e.target.value
                })}
                placeholder="Author ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('featuredImage')}
              </label>
              <Input
                value={formData.featuredImage}
                onChange={(e) => setFormData({
                  ...formData,
                  featuredImage: e.target.value
                })}
                placeholder="/images/featured-image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>{t('tags')}</CardTitle>
            <CardDescription>{t('tagsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('addTagPlaceholder')}
                className="flex-1"
              />
              <Button onClick={addTag} variant="outline">
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>{t('content')}</CardTitle>
            <CardDescription>{t('contentDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('content')} (한국어) *
              </label>
              <textarea
                className="w-full min-h-[400px] px-3 py-2 border border-input bg-background rounded-md text-sm font-mono"
                value={formData.content.ko}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, ko: e.target.value }
                })}
                placeholder={t('contentPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('content')} (English)
              </label>
              <textarea
                className="w-full min-h-[400px] px-3 py-2 border border-input bg-background rounded-md text-sm font-mono"
                value={formData.content.en}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, en: e.target.value }
                })}
                placeholder="English content (optional)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
              {t(`status.${formData.status}`)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              {t('saveDraft')}
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={saving}
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              {t('publish')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}