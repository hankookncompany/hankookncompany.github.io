'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { type Locale } from '@/i18n';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Persist locale preference in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', locale);
    }
  }, [locale]);

  const switchLocale = async (newLocale: Locale) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to the new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
    
    router.push(newPath);
    setIsOpen(false);
  };

  const getLanguageLabel = (loc: Locale) => {
    return loc === 'ko' ? t('korean') : t('english');
  };

  const getLanguageNative = (loc: Locale) => {
    return loc === 'ko' ? '한국어' : 'English';
  };

  const locales: Locale[] = ['ko', 'en'];

  return (
    <div className="relative">
      {/* Simple toggle button for mobile/compact view */}
      <div className="sm:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => switchLocale(locale === 'ko' ? 'en' : 'ko')}
          className="text-sm font-medium"
        >
          <Globe className="h-4 w-4 mr-1" />
          {locale === 'ko' ? t('switchToEnglish') : t('switchToKorean')}
        </Button>
      </div>

      {/* Dropdown for desktop */}
      <div className="hidden sm:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Globe className="h-4 w-4 mr-2" />
          {getLanguageNative(locale)}
        </Button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-md shadow-lg z-50">
              <div className="py-1">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors",
                      locale === loc && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{getLanguageNative(loc)}</span>
                      <span className="text-xs text-muted-foreground">
                        {getLanguageLabel(loc)}
                      </span>
                    </div>
                    {locale === loc && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}