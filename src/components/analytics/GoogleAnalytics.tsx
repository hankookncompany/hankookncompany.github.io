'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { initGA } from '@/lib/analytics';

/**
 * Google Analytics component for Next.js
 * This component should be added to the root layout
 */
export function GoogleAnalytics() {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  // Skip in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_GA_IN_DEV !== 'true') {
    return null;
  }
  
  // Skip if measurement ID is not set
  if (!gaMeasurementId) {
    console.warn('Google Analytics Measurement ID not found');
    return null;
  }
  
  // Initialize GA when the component mounts
  useEffect(() => {
    initGA();
  }, []);
  
  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}