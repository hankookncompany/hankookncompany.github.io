'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SearchBoxProps {
  locale: 'ko' | 'en';
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchBox({ 
  locale, 
  placeholder, 
  className = '',
  onSearch 
}: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('blog.search');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Initialize search query from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    setQuery(urlQuery);
  }, [searchParams]);

  const defaultPlaceholder = t('placeholder');

  const handleSearch = (searchQuery: string) => {
    setIsSearching(true);
    
    // Call optional callback
    if (onSearch) {
      onSearch(searchQuery.trim());
    } else {
      // Fallback: Update URL with search query (for standalone usage)
      const params = new URLSearchParams(searchParams);
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      } else {
        params.delete('q');
      }
      
      // Remove page parameter when searching
      params.delete('page');
      
      const newUrl = `/${locale}/blog${params.toString() ? `?${params.toString()}` : ''}`;
      router.push(newUrl);
    }
    
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    handleSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          className="pl-10 pr-10"
          disabled={isSearching}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            disabled={isSearching}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">
              {t('clear')}
            </span>
          </Button>
        )}
      </div>
    </form>
  );
}