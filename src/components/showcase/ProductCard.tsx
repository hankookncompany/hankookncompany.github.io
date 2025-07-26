'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Github } from 'lucide-react';
import type { ProductData } from '@/lib/content';
import type { Locale } from '@/types';

interface ProductCardProps {
  product: ProductData;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('showcase');
  const common = useTranslations('common');

  return (
    <Card className="h-full flex flex-col lg:flex-row overflow-hidden">
      {/* Product Screenshot */}
      {product.screenshots.length > 0 && (
        <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden">
          <img
            src={product.screenshots[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 flex flex-col lg:w-1/2">
        <CardHeader className="flex-none">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {product.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={product.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {t(`status.${product.status}`)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(product.createdAt).toLocaleDateString(
                    locale === 'ko' ? 'ko-KR' : 'en-US'
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {product.description}
          </CardDescription>

          {/* Technologies */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t('technologies')}</h4>
            <div className="flex flex-wrap gap-1">
              {product.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {product.technologies.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{product.technologies.length - 4}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col pt-4 space-y-3">
          {/* Action Buttons */}
          <div className="flex gap-2 w-full">
            {product.demoUrl && (
              <Button asChild size="sm" className="flex-1">
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t('demo')}
                </a>
              </Button>
            )}
            {product.githubUrl && (
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a
                  href={product.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  {t('github')}
                </a>
              </Button>
            )}
          </div>

          {/* View Details Link */}
          <div className="pt-2">
            <Link 
              href={`/${locale}/showcase/${product.slug}`}
              className="text-muted-foreground hover:text-highlight hover:underline hover:font-medium transition-all duration-200 inline-flex items-center"
            >
              {common('readMore')} →
            </Link>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}