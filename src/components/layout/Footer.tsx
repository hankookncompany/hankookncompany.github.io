'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Code2, Github, Mail, Heart } from 'lucide-react';
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
        href: 'https://github.com/hankookncompany', // Update with actual GitHub URL
        icon: Github,
      },
      {
        name: 'Email',
        href: 'mailto:team@yourcompany.com', // Update with actual email
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Code2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-foreground">
                  {locale === 'ko' ? '팀 기술 블로그' : 'Team Tech Blog'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                {locale === 'ko' 
                  ? '개발팀의 지식 공유, 학습 기록, 그리고 기술적 인사이트를 담은 현대적인 기술 블로그 플랫폼입니다.'
                  : 'A modern tech blog platform for sharing knowledge, documenting learnings, and showcasing technical insights from our development team.'
                }
              </p>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {locale === 'ko' ? '탐색' : 'Navigation'}
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
                {locale === 'ko' ? '연결' : 'Connect'}
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
                © {currentYear} {locale === 'ko' ? '팀 기술 블로그' : 'Team Tech Blog'}. {locale === 'ko' ? '모든 권리 보유.' : 'All rights reserved.'}
              </p>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>{locale === 'ko' ? 'Next.js와' : 'Built with Next.js and'}</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>{locale === 'ko' ? '로 제작' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}