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
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('allProjects')}
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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