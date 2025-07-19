'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface TranslationIndicatorProps {
  isTranslated: boolean;
  originalLocale: 'ko' | 'en';
  currentLocale: 'ko' | 'en';
  translationError?: string;
}

export function TranslationIndicator({
  isTranslated,
  originalLocale,
  currentLocale,
  translationError,
}: TranslationIndicatorProps) {
  const t = useTranslations('translation');

  // Don't show indicator for original content
  if (originalLocale === currentLocale) {
    return null;
  }

  // Show error indicator if translation failed
  if (!isTranslated) {
    return (
      <div className="flex items-center gap-2 p-3 mb-6 text-sm bg-amber-50 border border-amber-200 rounded-md">
        <Info size={16} className="text-amber-500" />
        <div>
          <p className="font-medium text-amber-800">
            {t('fallback')}
          </p>
          <p className="text-amber-700">
            {t('viewing_original', { locale: originalLocale })}
          </p>
          {translationError && (
            <p className="text-xs text-amber-600 mt-1">
              {translationError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show success indicator for translated content
  return (
    <div className="flex items-center gap-2 mb-6">
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        {t('translated')}
      </Badge>
      <span className="text-sm text-gray-500">
        {t('from_original', { locale: originalLocale })}
      </span>
    </div>
  );
}