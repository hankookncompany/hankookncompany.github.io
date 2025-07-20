import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { RootLayout } from '@/components/layout/RootLayout';
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import '../globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    // Validate locale
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    const isKorean = locale === 'ko';
    const baseUrl = "https://hankookncompany.github.io"; // Update with actual GitHub Pages URL

    return {
        title: {
            default: isKorean ? "팀 기술 블로그" : "Team Tech Blog",
            template: isKorean ? "%s | 팀 기술 블로그" : "%s | Team Tech Blog",
        },
        description: isKorean
            ? "개발팀의 지식 공유, 학습 기록, 그리고 기술적 인사이트를 담은 현대적인 기술 블로그 플랫폼입니다."
            : "A modern tech blog platform for sharing knowledge, documenting learnings, and showcasing technical insights from our development team.",
        keywords: isKorean
            ? ["기술 블로그", "개발", "프로그래밍", "튜토리얼", "팀", "한국어"]
            : ["tech blog", "development", "programming", "tutorials", "team", "english"],
        authors: [{ name: isKorean ? "개발팀" : "Development Team" }],
        creator: isKorean ? "개발팀" : "Development Team",
        metadataBase: new URL(baseUrl),
        openGraph: {
            type: "website",
            locale: locale === 'ko' ? "ko_KR" : "en_US",
            alternateLocale: locale === 'ko' ? "en_US" : "ko_KR",
            url: `${baseUrl}/${locale}`,
            siteName: isKorean ? "팀 기술 블로그" : "Team Tech Blog",
            title: isKorean ? "팀 기술 블로그" : "Team Tech Blog",
            description: isKorean
                ? "개발팀의 지식 공유와 기술적 인사이트를 담은 현대적인 기술 블로그 플랫폼"
                : "A modern tech blog platform for sharing knowledge and technical insights from our development team.",
            images: [
                {
                    url: `${baseUrl}/og-default.png`, // Default OG image
                    width: 1200,
                    height: 630,
                    alt: isKorean ? "팀 기술 블로그" : "Team Tech Blog",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isKorean ? "팀 기술 블로그" : "Team Tech Blog",
            description: isKorean
                ? "개발팀의 지식 공유와 기술적 인사이트를 담은 현대적인 기술 블로그 플랫폼"
                : "A modern tech blog platform for sharing knowledge and technical insights from our development team.",
            images: [`${baseUrl}/og-default.png`],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        alternates: {
            canonical: `${baseUrl}/${locale}`,
            languages: {
                'ko': `${baseUrl}/ko`,
                'en': `${baseUrl}/en`,
                'x-default': `${baseUrl}/ko`,
            },
        },
        verification: {
            google: "your-google-verification-code", // Add actual verification code
        },
        category: 'technology',
    };
}

export default async function LocaleLayout({
    children,
    params
}: Props) {
    const { locale } = await params;

    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

  setRequestLocale(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}>
                <GoogleAnalytics />
                <NextIntlClientProvider>
                    <RootLayout locale={locale as Locale}>
                        {children}
                    </RootLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}