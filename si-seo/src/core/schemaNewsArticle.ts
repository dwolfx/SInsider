import { SeoAnalysisInput } from './types';

export interface NewsArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  url: string;
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  publisher: {
    '@type': string;
    name: string;
    url: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  inLanguage: string;
}

export function generateNewsArticleSchema(input: SeoAnalysisInput): NewsArticleSchema {
  const cleanSlug = input.slug ? input.slug.replace(/^\/+/, '') : '';
  const postUrl = `https://saudeinsider.com.br/${cleanSlug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: input.title || 'Saúde Insider Notícias',
    description: input.metaDescription || '',
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Saúde Insider',
      url: 'https://saudeinsider.com.br/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://saudeinsider.com.br/wp-content/uploads/2026/08/favicon-si-192x192.png',
      },
    },
    inLanguage: 'pt-BR',
  };
}
