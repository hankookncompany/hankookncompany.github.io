// Core types for the tech blog

export interface Author {
  id: string;
  slug: string;
  name: {
    ko: string;
    en?: string;
  };
  avatar: string;
  bio: {
    ko: string;
    en?: string;
  };
  role: {
    ko: string;
    en?: string;
  };
  skills: string[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  joinedAt: Date;
  isActive: boolean;
  projects: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: {
    ko: string;
    en?: string;
  };
  content: {
    ko: string;
    en?: string;
  };
  excerpt: {
    ko: string;
    en?: string;
  };
  authorId: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  status: 'draft' | 'published';
  featuredImage?: string;
  readingTime: number;
  relatedProducts?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: {
    ko: string;
    en?: string;
  };
  description: {
    ko: string;
    en?: string;
  };
  features: {
    ko: string[];
    en?: string[];
  };
  technologies: string[];
  screenshots: string[];
  demoUrl?: string;
  githubUrl?: string;
  status: 'active' | 'archived';
  createdAt: Date;
  relatedPosts?: string[];
}

export interface AnalyticsEvent {
  eventId: string;
  sessionId: string;
  pageId: string;
  eventType: 'page_view' | 'page_exit' | 'click' | 'scroll';
  timestamp: Date;
  referrer?: string;
  userAgent: string;
  timeSpent?: number;
  scrollDepth?: number;
  metadata?: Record<string, string | number | boolean>;
}

export type Locale = 'ko' | 'en';

export interface LocalizedContent {
  ko: string;
  en?: string;
}