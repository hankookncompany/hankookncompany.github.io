import { notFound } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { isAdminEnabled } from '@/lib/dev-utils';
import { type Locale } from '@/i18n';

interface AdminPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  // Only allow admin in development
  if (!isAdminEnabled) {
    notFound();
  }

  const { locale } = await params;
  return <AdminDashboard locale={locale} />;
}

export function generateMetadata() {
  return {
    title: 'Admin Dashboard',
    robots: 'noindex, nofollow', // Prevent indexing of admin pages
  };
}