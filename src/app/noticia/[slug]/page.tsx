import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShareRail } from '@/components/editorial/ShareRail';
import { getArticleBySlug, getArticles } from '@/lib/api';
import { buildArticleMetadata, generateArticleJsonLd } from '@/lib/seo';
import { formatDateShort } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Notícia não encontrada' };
  return buildArticleMetadata(article);
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const jsonLd = generateArticleJsonLd(article);
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Schema.org NewsArticle JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header variant="materia" />

      {/* Renderização dinâmica com as classes e tokens nativos do Saúde Insider */}
      <main id="si-conteudo" className="si-main flex-1">
          <article className="si-article post has-post-thumbnail">
            <div className="si-article__container">
              <div className="si-article__flow">
                
                {/* Cabeçalho da Matéria */}
                <header className="si-article__header">
                  <p className="si-kicker">
                    <Link
                      href={`/categoria/${article.category.slug}`}
                      className="si-kicker__link"
                    >
                      {article.kicker}
                    </Link>
                  </p>

                  <h1 className="si-article__titulo">
                    {article.title}
                  </h1>

                  {article.subtitle && (
                    <p className="si-article__linha-fina">
                      {article.subtitle}
                    </p>
                  )}

                  <div className="si-article__meta">
                    <p className="si-entrevista__assinatura">
                      <span className="si-entrevista__assinatura-rotulo">Texto: </span>
                      <span className="font-semibold text-slate-800">{article.author.name}</span>
                    </p>

                    <div className="si-entrevista__meta-pe">
                      <span className="si-article__meta-cell si-article__meta-cell--data">
                        <time className="si-meta__date" dateTime={article.publishedAt}>
                          {formatDateShort(article.publishedAt)}
                        </time>
                      </span>
                      <span className="si-article__meta-cell text-slate-400">
                        {article.readingTimeMinutes} min de leitura
                      </span>
                    </div>
                  </div>
                </header>

                {/* Imagem Destacada */}
                {article.coverImage && (
                  <figure className="si-article__figure my-6">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="si-article__img w-full h-auto object-cover max-h-[540px]"
                    />
                    {article.coverImageCaption && (
                      <figcaption className="si-hero__legenda flex justify-between text-[11px] text-[var(--si-color-text-tertiary)] mt-1.5">
                        <span>{article.coverImageCaption}</span>
                        <span>Ilustração de Saúde Insider</span>
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* Corpo do Artigo com Rail Lateral e Conteúdo */}
                <div className="si-article__body">
                  <ShareRail
                    title={article.title}
                    url={`/noticia/${article.slug}`}
                  />

                  {/* Texto Editorial Formatado */}
                  <div
                    className="si-article__content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />

                  {/* Aside Lateral com Recomendadas */}
                  <aside className="si-article__aside">
                    <header className="si-section-header">
                      <h3 className="si-section-header__title">Recomendadas</h3>
                    </header>
                    <div className="si-article__aside-itens divide-y divide-slate-100">
                      {relatedArticles.map((rel) => (
                        <article key={rel.id} className="py-3">
                          <p className="si-kicker">
                            <Link href={`/categoria/${rel.category.slug}`} className="si-kicker__link">
                              {rel.kicker}
                            </Link>
                          </p>
                          <h4 className="si-card__titulo text-sm font-bold font-serif">
                            <Link href={`/noticia/${rel.slug}`} className="hover:text-[var(--si-color-brand-primary)]">
                              {rel.title}
                            </Link>
                          </h4>
                        </article>
                      ))}
                    </div>
                  </aside>
                </div>

                {/* Banner de Rodapé da Matéria */}
                <aside className="si-ad si-ad--billboard my-8">
                  <div className="si-ad__inner">
                    <div className="si-ad__quadro">
                      <div className="si-ad__criativo">
                        <a href="https://saudeinsider.com.br/editoria/podcasts/" target="_blank" rel="noopener noreferrer">
                          <img
                            src="https://saudeinsider.com.br/wp-content/uploads/2026/08/podcast-conecta-vinho.png"
                            alt="Podcast Conecta Vinho"
                            className="w-full h-auto mx-auto max-w-[970px]"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </aside>

              </div>
            </div>
          </article>
        </main>

      <Footer />
    </div>
  );
}
