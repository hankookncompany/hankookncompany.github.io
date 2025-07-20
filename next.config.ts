import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeHighlight,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
});

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json'
  }
});


const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages only in production
  ...(process.env.NODE_ENV === 'production' 
    ? {
       output: 'export',
      } : {}),

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Add trailing slash for GitHub Pages compatibility
  trailingSlash: true,

  // Base path for GitHub Pages (will be repository name)
  // basePath: '/repository-name', // Uncomment and set when deploying to GitHub Pages

  // Disable server-side features for static export
  experimental: {
    // Ensure static export works properly
    esmExternals: true,
  },

  // Configure page extensions to include MDX
  // In production, exclude server-specific files
  pageExtensions: process.env.NEXT_OUTPUT === 'export' 
    ? ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']
    : ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx', 'server.ts', 'server.tsx'],
  // Webpack configuration to exclude admin modules in production
  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      // In production server build, replace admin modules with empty modules
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/admin': false,
        '@/components/admin/AdminDashboard': false,
        '@/components/admin/AdminPostList': false,
        '@/components/admin/PostEditor': false,
        '@/components/admin/AdminLogin': false,
        '@/contexts/AdminAuthContext': false,
      };
    }

    // Exclude fs module for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },
};

export default withNextIntl(withMDX(nextConfig));
