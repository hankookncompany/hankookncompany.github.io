import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getProducts } from '@/lib/content';
import { ProductCard } from '@/components/showcase/ProductCard';
import type { Locale } from '@/i18n';

interface ShowcasePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function ShowcasePage({ params }: ShowcasePageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('showcase');
  
  const products = await getProducts(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('allProjects')}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="space-y-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No projects available yet. Stay tuned for updates!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'ko' },
    { locale: 'en' }
  ];
}

export async function generateMetadata({ params }: ShowcasePageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('showcase');
  
  return {
    title: t('title'),
    description: t('allProjects'),
  };
}