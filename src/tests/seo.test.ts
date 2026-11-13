import { describe, it, expect } from 'vitest';
import { generateArticleJsonLd, generateOrganizationJsonLd } from '@/lib/seo';
import { MOCK_ARTICLES } from '@/lib/mock-data';

describe('Geração de Metadados e Esquemas Estruturados SEO', () => {
  const article = MOCK_ARTICLES[0];

  it('gera esquema válido NewsArticle do Schema.org em formato JSON-LD', () => {
    const jsonLd = generateArticleJsonLd(article);

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('NewsArticle');
    expect(jsonLd.headline).toBe(article.title);
    expect(jsonLd.description).toBe(article.subtitle || article.excerpt);
    expect(jsonLd.image).toContain(article.coverImage);
    expect(jsonLd.datePublished).toBe(article.publishedAt);
    expect(jsonLd.author['@type']).toBe('Person');
    expect(jsonLd.author.name).toBe(article.author.name);
    expect(jsonLd.publisher.name).toBe('Saúde Insider');
  });

  it('gera esquema válido de Organização (Organization) em formato JSON-LD', () => {
    const jsonLd = generateOrganizationJsonLd();

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('NewsMediaOrganization');
    expect(jsonLd.name).toBe('Saúde Insider');
    expect(jsonLd.url).toBe('https://saudeinsider.com.br');
    expect(jsonLd.logo).toContain('logo-saude-insider.png');
  });
});
