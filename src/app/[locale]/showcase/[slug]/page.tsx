import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Github, Calendar } from 'lucide-react';
import { getProduct, getProducts, getRelatedPostsForProduct, getAuthors } from '@/lib/content';
import { BlogList } from '@/components/blog/BlogList';
import type { Locale } from '@/types';

interface ProductPageProps {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('showcase');
  const common = await getTranslations('common');
  const blogT = await getTranslations('blog');
  
  const product = await getProduct(slug, locale);
  
  if (!product) {
    notFound();
  }

  // Get related blog posts and authors
  const relatedPosts = await getRelatedPostsForProduct(slug, locale);
  const authors = await getAuthors(locale);

  // Structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-team.github.io';
  const productUrl = `${siteUrl}/${locale}/showcase/${slug}`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.description,
    url: productUrl,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    datePublished: product.createdAt,
    keywords: product.technologies.join(', '),
    image: product.screenshots.length > 0 
      ? product.screenshots.map(screenshot => 
          screenshot.startsWith('http') ? screenshot : `${siteUrl}${screenshot}`
        )
      : [`${siteUrl}/og-default.png`],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Team Tech Blog',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
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
      {/* Back Navigation */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${locale}/showcase`} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {common('backToHome')}
          </Link>
        </Button>
      </div>

      {/* Product Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <Badge 
                variant={product.status === 'active' ? 'default' : 'secondary'}
              >
                {t(`status.${product.status}`)}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(product.createdAt).toLocaleDateString(
                  locale === 'ko' ? 'ko-KR' : 'en-US'
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-6">
          {product.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {product.demoUrl && (
            <Button asChild>
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                {t('demo')}
              </a>
            </Button>
          )}
          {product.githubUrl && (
            <Button asChild variant="outline">
              <a
                href={product.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                {t('github')}
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Screenshots */}
          {product.screenshots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.screenshots.map((screenshot, index) => (
                    <div key={index} className="aspect-video overflow-hidden rounded-lg border">
                      <img
                        src={screenshot}
                        alt={`${product.name} screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Features */}
          {product.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('features')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Related Blog Posts */}
          {relatedPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('relatedPosts')}</CardTitle>
                <CardDescription>
                  {blogT('relatedPosts')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BlogList 
                  posts={relatedPosts} 
                  authors={authors}
                  locale={locale} 
                  currentPage={1}
                  totalPages={1}
                  showPagination={false} 
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>{t('technologies')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product.technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {t(`status.${product.status}`)}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="mt-1 text-sm">
                  {new Date(product.createdAt).toLocaleDateString(
                    locale === 'ko' ? 'ko-KR' : 'en-US',
                    { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }
                  )}
                </dd>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}

export async function generateStaticParams() {
  const koProducts = await getProducts('ko');
  const enProducts = await getProducts('en');
  
  const params = [];
  
  // Generate params for Korean products
  for (const product of koProducts) {
    params.push({ locale: 'ko', slug: product.slug });
  }
  
  // Generate params for English products
  for (const product of enProducts) {
    params.push({ locale: 'en', slug: product.slug });
  }
  
  return params;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const product = await getProduct(slug, locale);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-team.github.io';
  const productUrl = `${siteUrl}/${locale}/showcase/${slug}`;
  
  // Check if the product exists in other locales
  const koProduct = await getProduct(slug, 'ko').catch(() => null);
  const enProduct = await getProduct(slug, 'en').catch(() => null);
  
  const alternateLanguages: Record<string, string> = {};
  if (koProduct) alternateLanguages['ko'] = `${siteUrl}/ko/showcase/${slug}`;
  if (enProduct) alternateLanguages['en'] = `${siteUrl}/en/showcase/${slug}`;
  
  return {
    title: product.name,
    description: product.description,
    keywords: product.technologies.join(', '),
    alternates: {
      canonical: productUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      url: productUrl,
      siteName: 'Team Tech Blog',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      images: product.screenshots.length > 0 ? [
        {
          url: product.screenshots[0].startsWith('http')
            ? product.screenshots[0]
            : `${siteUrl}${product.screenshots[0]}`,
          width: 1200,
          height: 630,
          alt: product.name,
        }
      ] : [
        {
          url: `${siteUrl}/og-default.png`,
          width: 1200,
          height: 630,
          alt: product.name,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.screenshots.length > 0 ? [
        product.screenshots[0].startsWith('http')
          ? product.screenshots[0]
          : `${siteUrl}${product.screenshots[0]}`
      ] : [`${siteUrl}/og-default.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}