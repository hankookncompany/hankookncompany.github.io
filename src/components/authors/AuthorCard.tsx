'use client';

import { AuthorData } from '@/lib/content';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface AuthorCardProps {
  author: AuthorData;
  locale: 'ko' | 'en';
  showBio?: boolean;
  compact?: boolean;
}

export function AuthorCard({ author, locale, showBio = true, compact = false }: AuthorCardProps) {
  const t = useTranslations('authors');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className={`w-full ${compact ? 'border-0 shadow-none' : ''}`}>
      <CardHeader className={compact ? 'px-0 pt-0' : ''}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            {author.avatar && typeof author.avatar === 'string' ? (
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 아바타로 대체
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-lg font-semibold text-primary">${author.name.charAt(0)}</span>`;
                }}
              />
            ) : (
              <span className="text-lg font-semibold text-primary">
                {author.name.charAt(0)}
              </span>
            )}
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold">
              <Link 
                href={`/${locale}/authors/${author.slug}`}
                className="hover:text-primary transition-colors"
              >
                {author.name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">{author.role}</p>
            
            {!compact && (
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{t('joinedAt')}: {formatDate(author.joinedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      {(showBio || !compact) && (
        <CardContent className={compact ? 'px-0 pt-2' : ''}>
          {showBio && (
            <p className="text-sm text-muted-foreground mb-4">
              {author.bio}
            </p>
          )}
          
          {!compact && (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">{t('skills')}</h4>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {author.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center sm:justify-start">
                {author.social.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={author.social.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                
                {author.social.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                
                {author.social.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${author.social.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}