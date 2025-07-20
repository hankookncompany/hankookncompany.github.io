import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/admin/PostEditor';
import { isAdminEnabled } from '@/lib/dev-utils';
import { type Locale } from '@/i18n';

interface EditPostPageProps {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return [{ slug: 'post' }];
}
export async function generateMetadata({ params }: EditPostPageProps) {
  const { slug } = await params;
  return {
    title: `Edit Post: ${slug} - Admin`,
    robots: 'noindex, nofollow', // Prevent indexing of admin pages
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  // Only allow admin in development
  if (!isAdminEnabled) {
    notFound();
  }

  const { locale, slug } = await params;
  return <PostEditor locale={locale} slug={slug} />;
}