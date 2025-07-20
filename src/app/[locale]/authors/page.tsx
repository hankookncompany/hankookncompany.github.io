import { type Locale } from '@/i18n';
import { setRequestLocale } from 'next-intl/server';
import { getAuthors } from '@/lib/content';
import { AuthorCard } from '@/components/authors/AuthorCard';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

interface AuthorsPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: AuthorsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'authors' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io';
  
  return {
    title: t('title'),
    description: t('allAuthors'),
    alternates: {
      canonical: `${siteUrl}/${locale}/authors`,
      languages: {
        'ko': `${siteUrl}/ko/authors`,
        'en': `${siteUrl}/en/authors`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('allAuthors'),
      url: `${siteUrl}/${locale}/authors`,
      siteName: 'Team Tech Blog',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
  };
}

export default async function AuthorsPage({ params }: AuthorsPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'authors' });
  const authors = await getAuthors(locale);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground mb-8">{t('allAuthors')}</p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {authors.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              locale={locale}
              showBio={true}
            />
          ))}
        </div>
        
        {authors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No team members found.</p>
          </div>
        )}
      </div>
    </div>
  );
}