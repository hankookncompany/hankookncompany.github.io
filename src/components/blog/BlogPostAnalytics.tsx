'use client';

import { usePageTracking } from '@/hooks/useAnalytics';
import { ReactNode } from 'react';

interface BlogPostAnalyticsProps {
  children: ReactNode;
  slug: string;
}

/**
 * Client component wrapper for blog post analytics tracking
 */
export function BlogPostAnalytics({ children, slug }: BlogPostAnalyticsProps) {
  // Track page view and time spent
  usePageTracking(`blog-post-${slug}`);
  
  return <>{children}</>;
}