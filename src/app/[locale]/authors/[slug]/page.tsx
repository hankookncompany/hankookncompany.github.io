import { type Locale } from '@/i18n';
import { setRequestLocale } from 'next-intl/server';
import { getAuthor, getAuthors, getBlogPostsByAuthor, getProducts, checkAuthorExistsInLocale } from '@/lib/content';
import { AuthorCard } from '@/components/authors/AuthorCard';
import { BlogList } from '@/components/blog/BlogList';
import { ProductCard } from '@/components/showcase/ProductCard';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface AuthorPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  // Generate static params for both locales
  const koAuthors = (await getAuthors('ko')).map(author => ({
    locale: 'ko' as const,
    slug: author.slug,
  }));

  const enAuthors = (await getAuthors('en')).map(author => ({
    locale: 'en' as const,
    slug: author.slug,
  }));

  return [...koAuthors, ...enAuthors];
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const author = await getAuthor(slug, locale);

  if (!author) {
    return {
      title: 'Author Not Found',
      description: 'The requested author profile could not be found.',
    };
  }

  const t = await getTranslations({ locale, namespace: 'authors' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io';
  const authorUrl = `${siteUrl}/${locale}/authors/${slug}`;

  return {
    title: author.name,
    description: author.bio,
    alternates: {
      canonical: authorUrl,
      languages: {
        'ko': `${siteUrl}/ko/authors/${slug}`,
        'en': `${siteUrl}/en/authors/${slug}`,
      },
    },
    openGraph: {
      title: author.name,
      description: author.bio,
      url: authorUrl,
      siteName: commonT('siteName'),
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'profile',
      images: author.avatar ? [
        {
          url: author.avatar.startsWith('http')
            ? author.avatar
            : `${siteUrl}${author.avatar}`,
          width: 400,
          height: 400,
          alt: author.name,
        }
      ] : [
        {
          url: `${siteUrl}/placeholder-avatar.svg`,
          width: 400,
          height: 400,
          alt: author.name,
        }
      ],
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'authors' });
  const author = await getAuthor(slug, locale);

  if (!author) {
    notFound();
  }

  // Get author's blog posts
  const authorPosts = await getBlogPostsByAuthor(slug, locale);

  // Get author's projects
  const allProducts = await getProducts(locale);
  const authorProducts = allProducts.filter(product =>
    author.projects.includes(product.slug)
  );

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    jobTitle: author.role,
    image: author.avatar ? (author.avatar.startsWith('http') ? author.avatar : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io'}${author.avatar}`) : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io'}/placeholder-avatar.svg`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io'}/${locale}/authors/${slug}`,
    sameAs: Object.values(author.social).filter(Boolean),
    knowsAbout: author.skills,
    worksFor: {
      '@type': 'Organization',
      name: 'Team Tech Blog',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hankookncompany.github.io',
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Author Profile */}
          <div className="mb-12">
            <AuthorCard
              author={author}
              locale={locale}
              showBio={true}
            />
          </div>

          {/* Author's Blog Posts */}
          {authorPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{t('posts')}</h2>
              <BlogList
                posts={authorPosts}
                authors={[author]}
                locale={locale}
                showPagination={false}
              />
            </div>
          )}

          {/* Author's Projects */}
          {authorProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{t('projects')}</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {authorProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty states */}
          {authorPosts.length === 0 && authorProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t('noContent')}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}