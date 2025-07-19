// i18n.ts (예시)
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['ko', 'en'] as const;
export const defaultLocale = 'ko' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const currentLocale: Locale = (locale ?? defaultLocale) as Locale;

  if (!locales.includes(currentLocale)) {
    notFound();
  }

  const messages = (
    await import(`./messages/${currentLocale}.json`)
  ).default;

  return {
    locale: currentLocale,
    messages
  };
});