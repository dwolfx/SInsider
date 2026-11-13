import { Article } from '@/types';
import type { Metadata } from 'next';

export const SITE_CONFIG = {
  name: 'Saúde Insider',
  legalName: 'Saúde Insider Comunicação & Inteligência em Saúde',
  url: 'https://saudeinsider.com.br',
  description: 'O portal de jornalismo analítico e inteligência para quem decide os rumos da saúde no Brasil.',
  logo: 'https://saudeinsider.com.br/wp-content/uploads/2023/11/logo-saude-insider.png',
  twitterHandle: '@saudeinsider',
  publisher: 'Saúde Insider',
};

export function generateArticleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/noticia/${article.slug}`,
    },
    headline: article.title,
    description: article.subtitle || article.excerpt,
    image: [article.coverImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.logo,
      },
    },
    articleSection: article.category.name,
    keywords: article.tags.map((t) => t.name).join(', '),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    description: SITE_CONFIG.description,
    sameAs: [
      'https://www.linkedin.com/company/saude-insider/',
      'https://www.youtube.com/@saudeinsider',
    ],
  };
}

export function buildArticleMetadata(article: Article): Metadata {
  const title = article.title;
  const description = article.subtitle || article.excerpt;
  const url = `${SITE_CONFIG.url}/noticia/${article.slug}`;

  return {
    title,
    description,
    keywords: article.seo.keywords,
    alternates: {
      canonical: article.seo.canonicalUrl || url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: 'pt_BR',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      section: article.category.name,
      tags: article.tags.map((t) => t.name),
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.coverImage],
      creator: SITE_CONFIG.twitterHandle,
    },
  };
}
