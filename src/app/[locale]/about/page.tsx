import { type Locale } from '@/i18n';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Code, Mail, ExternalLink } from 'lucide-react';

interface AboutPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-team.github.io';

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: {
        'ko': `${siteUrl}/ko/about`,
        'en': `${siteUrl}/en/about`,
      },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  const techStack = [
    'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Team Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('teamOverview.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {t('teamOverview.description')}
            </p>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">
                {t('teamOverview.meetTeam')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('teamOverview.teamDescription')}
              </p>

              <div className="flex justify-start mt-4">
                <Button asChild>
                  <Link href={`/${locale}/authors`} className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t('teamOverview.viewMembers')}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {t('techStack.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t('techStack.description')}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm py-1 px-3">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">
                {t('techStack.principles')}
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {t('techStack.principle1')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {t('techStack.principle2')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {t('techStack.principle3')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {t('techStack.principle4')}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t('contact.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {t('contact.description')}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('contact.email')}
                </h4>
                <p className="text-muted-foreground">team@example.com</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {t('contact.socialMedia')}
                </h4>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}