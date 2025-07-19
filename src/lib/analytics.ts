'use client';

/**
 * Google Analytics 4 integration for the team tech blog
 * This file provides utilities for tracking page views and events
 */

// GA4 Event Types
export type GAEventType = 
  | 'page_view'
  | 'scroll'
  | 'click'
  | 'file_download'
  | 'outbound_link'
  | 'search'
  | 'time_spent';

// GA4 Event Parameters
export interface GAEventParams {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Initialize Google Analytics
 * This should be called once in the root layout
 */
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Skip in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_GA_IN_DEV !== 'true') {
    console.log('Google Analytics disabled in development');
    return;
  }
  
  // Check if GA is already initialized
  if (typeof window.gtag === 'function') return;
  
  // Get GA measurement ID
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  if (!gaMeasurementId) {
    console.warn('Google Analytics Measurement ID not found');
    return;
  }
  
  // Add the GA script to the page
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  script.async = true;
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  
  // Initialize GA with the measurement ID
  window.gtag('js', new Date());
  window.gtag('config', gaMeasurementId, {
    send_page_view: false, // We'll handle page views manually
    anonymize_ip: true, // Anonymize IP for GDPR compliance
  });
  
  console.log('Google Analytics initialized');
};

/**
 * Track a page view in Google Analytics
 * @param url The URL of the page
 * @param title The title of the page
 * @param referrer The referrer URL
 */
export const trackPageView = (url: string, title?: string, referrer?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  // Check if analytics is disabled by user preference
  if (isAnalyticsDisabled()) return;
  
  // Track the page view
  window.gtag('event', 'page_view', {
    page_location: url,
    page_title: title || document.title,
    page_referrer: referrer || document.referrer,
  });
};

/**
 * Track an event in Google Analytics
 * @param eventName The name of the event
 * @param params Additional parameters for the event
 */
export const trackEvent = (eventName: GAEventType, params?: GAEventParams) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  // Check if analytics is disabled by user preference
  if (isAnalyticsDisabled()) return;
  
  // Track the event
  window.gtag('event', eventName, params);
};

/**
 * Track time spent on a page
 * @param pageId Identifier for the page
 * @param timeInSeconds Time spent in seconds
 */
export const trackTimeSpent = (pageId: string, timeInSeconds: number) => {
  trackEvent('time_spent', {
    page_id: pageId,
    time_spent: timeInSeconds,
  });
};

/**
 * Track scroll depth
 * @param depth Scroll depth as a percentage (0-100)
 */
export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll', {
    scroll_depth: depth,
  });
};

/**
 * Check if analytics is disabled by user preference
 */
export const isAnalyticsDisabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for Do Not Track browser setting
  const dnt = 
    navigator.doNotTrack === '1' || 
    navigator.doNotTrack === 'yes'
  
  // Check for user opt-out in localStorage
  const optOut = localStorage.getItem('ga-opt-out') === 'true';
  
  return dnt || optOut;
};

/**
 * Opt out of Google Analytics
 * @param optOut Whether to opt out (true) or opt in (false)
 */
export const setAnalyticsOptOut = (optOut: boolean): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('ga-opt-out', optOut ? 'true' : 'false');
  
  // If opting out, disable GA for current page
  if (optOut && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
    });
  } else if (!optOut && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  }
};

// Add TypeScript types for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}