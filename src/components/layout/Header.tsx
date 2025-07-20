'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Menu, X, Code2, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { type Locale } from '@/i18n';
import { isAdminEnabled } from '@/lib/dev-utils';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const navigation = [
    { name: t('home'), href: `/${locale}` },
    { name: t('blog'), href: `/${locale}/blog` },
    { name: t('showcase'), href: `/${locale}/showcase` },
    { name: t('authors'), href: `/${locale}/authors` },
    { name: t('about'), href: `/${locale}/about` },
  ];

  // Add admin link in development
  if (isAdminEnabled) {
    navigation.push({ name: 'Admin', href: `/${locale}/admin` });
  }

  const isActiveLink = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              href={`/${locale}`} 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-foreground">
                  {locale === 'ko' ? '팀 기술 블로그' : 'Team Tech Blog'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActiveLink(item.href) ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActiveLink(item.href) 
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right side - Theme Toggle, Language Switcher and Mobile Menu */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t bg-background/95 backdrop-blur">
              {navigation.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActiveLink(item.href) ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'w-full justify-start text-sm font-medium',
                      isActiveLink(item.href) 
                        ? 'text-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              
              {/* Mobile Theme and Language Controls */}
              <div className="flex items-center justify-between pt-2 mt-2 border-t">
                <span className="text-sm text-muted-foreground">
                  {locale === 'ko' ? '설정' : 'Settings'}
                </span>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}