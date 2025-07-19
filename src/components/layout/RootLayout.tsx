'use client';

import { Header } from './Header';
import { Footer } from './Footer';
import { type Locale } from '@/i18n';

interface RootLayoutProps {
  children: React.ReactNode;
  locale: Locale;
}

export function RootLayout({ children, locale }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />
      <main className="flex-1">
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}