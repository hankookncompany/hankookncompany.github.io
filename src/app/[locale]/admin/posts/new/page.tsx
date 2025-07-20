import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/admin/PostEditor';
import { isAdminEnabled } from '@/lib/dev-utils';
import { type Locale } from '@/i18n';

interface NewPostPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function NewPostPage({ params }: NewPostPageProps) {
  // Only allow admin in development
  if (!isAdminEnabled) {
    notFound();
  }

  const { locale } = await params;
  return <PostEditor locale={locale} />;
}

export function generateMetadata() {
  return {
    title: 'Create New Post - Admin',
    robots: 'noindex, nofollow', // Prevent indexing of admin pages
  };
}