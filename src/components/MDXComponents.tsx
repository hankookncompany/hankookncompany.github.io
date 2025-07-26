import { MDXComponents } from 'mdx/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Utility function to generate heading IDs
const generateHeadingId = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  return '';
};

// Custom components that can be used in MDX files
const mdxComponents: MDXComponents = {
  // Override default HTML elements
  h1: ({ children, ...props }) => {
    const id = props.id || generateHeadingId(children);
    return (
      <h1 className="text-3xl font-bold mb-6 mt-8 scroll-m-20" id={id} {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    const id = props.id || generateHeadingId(children);
    return (
      <h2 className="text-2xl font-semibold mb-4 mt-6 scroll-m-20" id={id} {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    const id = props.id || generateHeadingId(children);
    return (
      <h3 className="text-xl font-medium mb-3 mt-5 scroll-m-20" id={id} {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    const id = props.id || generateHeadingId(children);
    return (
      <h4 className="text-lg font-medium mb-2 mt-4 scroll-m-20" id={id} {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ children, ...props }) => {
    const id = props.id || generateHeadingId(children);
    return (
      <h5 className="text-base font-medium mb-2 mt-3 scroll-m-20" id={id} {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ children, ...props }) => {
    const id = props.id || generateHeadingId(children);
    return (
      <h6 className="text-sm font-medium mb-2 mt-3 scroll-m-20" id={id} {...props}>
        {children}
      </h6>
    );
  },
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-4 pl-6 list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 pl-6 list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="mb-2" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-4" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    
    if (isInline) {
      return (
        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  a: ({ children, href, ...props }) => (
    <a 
      href={href} 
      className="text-primary hover:underline font-medium" 
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }) => (
    <img 
      src={src} 
      alt={alt} 
      className="rounded-lg my-4 max-w-full h-auto" 
      {...props} 
    />
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),
  hr: ({ ...props }) => (
    <hr className="my-8 border-border" {...props} />
  ),
  
  // Custom components that can be used in MDX
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  
  // Custom callout component
  Callout: ({ type = 'info', children, ...props }: { 
    type?: 'info' | 'warning' | 'error' | 'success';
    children: React.ReactNode;
  }) => {
    const styles = {
      info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
      error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
      success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
    };
    
    return (
      <div className={`border-l-4 p-4 my-4 rounded-r-lg ${styles[type]}`} {...props}>
        {children}
      </div>
    );
  },
  
  // Code block with title
  CodeBlock: ({ title, children }: { 
    title?: string;
    children: React.ReactNode;
  }) => (
    <div className="my-4">
      {title && (
        <div className="bg-muted px-4 py-2 text-sm font-medium border-b border-border rounded-t-lg">
          {title}
        </div>
      )}
      <div className={title ? 'rounded-t-none' : 'rounded-lg'}>
        {children}
      </div>
    </div>
  ),
};

export default mdxComponents;