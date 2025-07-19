import { type Locale } from '@/i18n';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NotFoundProps {
  params?: { locale: Locale };
}

export default async function LocaleNotFound({ params }: NotFoundProps) {
  // Default to 'en' if locale is not available
  const locale = params?.locale || 'en';
  const t = await getTranslations({ locale, namespace: 'common' });
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">{t('notFound')}</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          {t('pageNotFoundMessage')}
        </p>
        <Button asChild>
          <Link href={`/${locale}`}>
            {t('backToHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
}