# Admin Interface Guide

## Overview

The admin interface is a development-only feature that allows you to create, edit, and manage blog posts through a web interface. It's only available when running the application in development mode (`npm run dev`).

## Features

- **Dashboard**: Overview of all posts with statistics
- **Post Management**: Create, edit, and delete blog posts
- **Rich Text Editor**: Markdown/MDX editor with syntax highlighting
- **Draft/Published Status**: Save posts as drafts or publish them
- **Local Development**: No authentication required for local use

## Setup

### Development Server

Start the development server:

```bash
npm run dev
```

## Usage

### Accessing the Admin Interface

1. Start the development server (`npm run dev`)
2. Navigate to `http://localhost:3000/[locale]/admin` (e.g., `http://localhost:3000/ko/admin`)
3. You'll see the admin dashboard with post statistics and quick actions

### Creating a New Post

1. Click "New Post" from the dashboard or posts list
2. Fill in the required fields:
   - **Title**: Post title
   - **Excerpt**: Brief description for the post list
   - **Content**: Full post content in Markdown/MDX format
   - **Author**: Author ID (should match an author in `src/content/authors/`)
   - **Tags**: Comma-separated tags
3. Optional fields:
   - **Featured Image**: URL to a featured image
   - **Related Products**: Comma-separated product IDs
4. Choose to save as draft or publish immediately
5. Click "Save as Draft" or "Publish"

### Editing Posts

1. From the posts list, click the edit icon next to any post
2. Make your changes
3. Save as draft or publish

### Deleting Posts

1. From the posts list, click the delete icon
2. Confirm the deletion in the modal dialog
3. The post file will be permanently deleted

## File Structure

Posts are stored as MDX files in `src/content/posts/` with the naming convention:
- `{slug}.{locale}.mdx` (e.g., `my-post.ko.mdx`, `my-post.en.mdx`)

Each post file contains:
- **Frontmatter**: Metadata (title, author, tags, etc.)
- **Content**: Markdown/MDX content

## Workflow

The recommended workflow is:

1. **Development**: Use the admin interface to create and edit posts locally
2. **Preview**: Test your posts in the development environment
3. **Commit**: Commit the generated MDX files to your repository
4. **Deploy**: Push to GitHub to trigger the static site deployment

## Limitations

- **Development Only**: Admin interface only works in development mode
- **Local Files**: Posts are saved as local MDX files, not in a database
- **No Real-time Collaboration**: Multiple users editing simultaneously may cause conflicts
- **Manual Deployment**: Changes must be committed and pushed to deploy

## Security

- Admin interface is completely disabled in production builds
- No admin routes or functionality are included in the static export
- Only works in local development environment

## Troubleshooting

### Admin Interface Not Available

If you see "Admin Not Available" message:
- Ensure you're running in development mode (`npm run dev`)
- Check that `NODE_ENV` is set to `development`

### Access Issues

- Ensure you're running in development mode (`npm run dev`)
- Check that `NODE_ENV` is set to `development`

### File System Errors

- Ensure you have write permissions to the `src/content/posts/` directory
- Check that the posts directory exists and is accessible

## Support

For issues or questions about the admin interface, please check:
1. This guide for common solutions
2. The project's issue tracker
3. Supabase documentation for authentication issues