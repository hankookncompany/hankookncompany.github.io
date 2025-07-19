'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { type Locale } from '@/i18n';
import { ReactNode, useEffect, useState } from 'react';

interface LocalizedLinkProps {
  locale: Locale;
  children: ReactNode;
  className?: string;
}

export function LocalizedLink({ locale, children, className }: LocalizedLinkProps) {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const [targetPath, setTargetPath] = useState<string>('');
  
  useEffect(() => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    
    // Create the new path with the target locale
    const newPath = `/${locale}${pathWithoutLocale}`;
    setTargetPath(newPath);
  }, [pathname, currentLocale, locale]);

  return (
    <Link href={targetPath} className={className}>
      {children}
    </Link>
  );
}