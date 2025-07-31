'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SaveIcon, EyeIcon, ArrowLeftIcon, PlusIcon, XIcon, EditIcon, SendIcon } from 'lucide-react';
import { type BlogPost } from '@/types';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import mdxComponents from '@/components/MDXComponents';

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

  const [activeLanguage, setActiveLanguage] = useState<'ko' | 'en'>('ko');
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | undefined>();

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // MDX 미리보기 준비
  useEffect(() => {
    const prepareMDX = async () => {
      const content = activeLanguage === 'ko' ? formData.content.ko : formData.content.en;
      if (content.trim()) {
        try {
          const source = await serialize(content);
          setMdxSource(source);
        } catch (error) {
          console.error('MDX serialization error:', error);
          setMdxSource(undefined);
        }
      } else {
        setMdxSource(undefined);
      }
    };

    prepareMDX();
  }, [formData.content, activeLanguage]);

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
    <div className="container mx-auto px-4 py-8">
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

        {/* Content with Side-by-Side Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{t('content')}</CardTitle>
            <CardDescription>{t('contentDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={activeLanguage === 'ko' ? 'default' : 'outline'}
                onClick={() => setActiveLanguage('ko')}
                size="sm"
              >
                한국어
              </Button>
              <Button
                variant={activeLanguage === 'en' ? 'default' : 'outline'}
                onClick={() => setActiveLanguage('en')}
                size="sm"
              >
                English
              </Button>
            </div>

            {/* Side-by-Side Editor and Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Editor */}
              <div className="space-y-2 h-full">
                <label className="block text-sm font-medium">
                  <EditIcon className="w-4 h-4 inline mr-2" />
                  {activeLanguage === 'ko' ? '편집 (한국어)' : 'Edit (English)'}
                  {activeLanguage === 'ko' && ' *'}
                </label>
                <textarea
                  className="w-full h-[600px] px-3 py-2 border border-input bg-background rounded-md text-sm font-mono resize-none overflow-y-auto"
                  value={activeLanguage === 'ko' ? formData.content.ko : formData.content.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    content: { 
                      ...formData.content, 
                      [activeLanguage]: e.target.value 
                    }
                  })}
                  placeholder={activeLanguage === 'ko' ? t('contentPlaceholder') : 'English content (optional)'}
                />
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  <EyeIcon className="w-4 h-4 inline mr-2" />
                  {activeLanguage === 'ko' ? '미리보기 (한국어)' : 'Preview (English)'}
                </label>
                <div className="h-[600px] px-6 py-4 border border-input bg-background rounded-md overflow-y-auto">
                  {(activeLanguage === 'ko' ? formData.content.ko : formData.content.en) ? (
                    <article className="w-full">
                      {/* Post Header - 실제 블로그와 동일한 구조 */}
                      {/* Featured Image */}
                      {formData.featuredImage && (
                        <div className="relative w-full h-48 overflow-hidden rounded-lg mb-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={formData.featuredImage.startsWith('http') 
                              ? formData.featuredImage 
                              : `http://localhost:3000${formData.featuredImage}`
                            }
                            alt="Featured"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Tags */}
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h1 className="text-3xl font-bold mb-4">
                        {activeLanguage === 'ko' 
                          ? formData.title.ko || '제목 없음'
                          : formData.title.en || formData.title.ko || 'Untitled'
                        }
                      </h1>
                      
                      {/* Excerpt */}
                      {((activeLanguage === 'ko' ? formData.excerpt.ko : formData.excerpt.en)) && (
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {activeLanguage === 'ko' ? formData.excerpt.ko : formData.excerpt.en}
                        </p>
                      )}

                      {/* Content with MDX-style classes */}
                      <div className="mdx-content">
                        {mdxSource ? (
                          <MDXRemote {...mdxSource} components={mdxComponents} />
                        ) : (
                          <div className="text-muted-foreground text-sm">
                            {activeLanguage === 'ko' 
                              ? '마크다운 내용을 입력하면 여기에 미리보기가 표시됩니다'
                              : 'Enter markdown content to see preview here'
                            }
                          </div>
                        )}
                      </div>
                    </article>
                  ) : (
                    <div className="text-muted-foreground text-center py-20">
                      {activeLanguage === 'ko' 
                        ? '내용을 입력하면 미리보기가 표시됩니다'
                        : 'Enter content to see preview'
                      }
                    </div>
                  )}
                </div>
              </div>
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
              <SendIcon className="w-4 h-4 mr-2" />
              {t('publish')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}