'use client';

import { useEffect } from 'react';
import { trackPageView, trackEvent, trackScrollDepth, trackTimeSpent } from '@/lib/analytics';

/**
 * Hook for tracking page views and time spent
 * @param pageId Unique identifier for the current page
 */
export function usePageTracking(pageId: string): void {
  useEffect(() => {
    // Skip tracking if we're in a non-browser environment
    if (typeof window === 'undefined') return;
    
    // Skip tracking during development if disabled
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === 'true') {
      return;
    }
    
    // Track page view in Google Analytics
    const url = window.location.href;
    const title = document.title;
    trackPageView(url, title);
    
    // Track time spent
    const startTime = Date.now();
    
    // Set up scroll tracking
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Calculate scroll depth as percentage
      const scrollDepth = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
      
      // Track scroll depth at 25%, 50%, 75%, and 100%
      if (scrollDepth === 25 || scrollDepth === 50 || scrollDepth === 75 || scrollDepth === 100) {
        trackScrollDepth(scrollDepth);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up and track time spent
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Calculate time spent on page in seconds
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      trackTimeSpent(pageId, timeSpent);
    };
  }, [pageId]);
}

/**
 * Hook for tracking click events
 * @returns Function to track click events
 */
export function useClickTracking() {
  const trackClick = (elementId: string, metadata?: Record<string, any>) => {
    trackEvent('click', {
      element_id: elementId,
      ...metadata
    });
  };
  
  return { trackClick };
}