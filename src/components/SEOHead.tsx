'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SEOProps {
  title: string;
  description: string;
  locale: 'ko' | 'en';
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export function SEOHead({ 
  title, 
  description, 
  locale, 
  canonical, 
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags 
}: SEOProps) {
  const pathname = usePathname();
  const commonT = useTranslations('common');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-team.github.io';
  const fullTitle = `${title} | ${commonT('companyName')} ${commonT('siteName')}`;
  const ogImageUrl = ogImage || `${siteUrl}/og-default.png`;
  
  // Determine canonical URL
  const currentUrl = canonical || `${siteUrl}${pathname}`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="language" content={locale} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale === 'ko' ? 'ko_KR' : 'en_US'} />
      <meta property="og:site_name" content={`${commonT('companyName')} ${commonT('siteName')}`} />
      
      {/* Article-specific OG tags */}
      {ogType === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Alternate language versions */}
      <link rel="alternate" hrefLang="ko" href={`${siteUrl}/ko${pathname.replace(/^\/(ko|en)/, '')}`} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/en${pathname.replace(/^\/(ko|en)/, '')}`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${pathname.replace(/^\/(ko|en)/, '')}`} />
    </Head>
  );
}