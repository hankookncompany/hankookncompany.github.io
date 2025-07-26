'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Github, Mail, Heart } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { type Locale } from '@/i18n';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: tCommon('home'), href: `/${locale}` },
      { name: tCommon('blog'), href: `/${locale}/blog` },
      { name: tCommon('showcase'), href: `/${locale}/showcase` },
      { name: tCommon('authors'), href: `/${locale}/authors` },
      { name: tCommon('about'), href: `/${locale}/about` },
    ],
    social: [
      {
        name: 'GitHub',
        href: 'https://github.com/hankookncompany',
        icon: Github,
      },
      {
        name: 'Email',
        href: 'mailto:eyehyun@hankookn.com',
        icon: Mail,
      },
    ],
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Logo size={48} />
                <div className="flex flex-col">
                  <span className="hankook-brand text-sm text-muted-foreground leading-tight">
                    {tCommon('companyName')}
                  </span>
                  <span className="text-lg font-bold text-foreground leading-tight">
                    {tCommon('siteName')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                {t('description')}
              </p>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {t('navigation')}
              </h3>
              <ul className="space-y-2">
                {footerLinks.navigation.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {t('connect')}
              </h3>
              <ul className="space-y-2">
                {footerLinks.social.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                © {currentYear} Hankook&Company Digital Tech Team. {t('copyright')}
              </p>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>{t('builtWith')}</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>{t('builtWithSuffix')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}