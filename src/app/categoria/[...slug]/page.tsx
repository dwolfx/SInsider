import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleCard } from '@/components/editorial/ArticleCard';
import { getCategoryBySlug, getArticlesByCategory, getCategories } from '@/lib/api';
import { SITE_CONFIG } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string | string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const targetSlug = Array.isArray(resolved.slug)
    ? resolved.slug[resolved.slug.length - 1]
    : resolved.slug;

  const category = await getCategoryBySlug(targetSlug);
  if (!category) return { title: 'Editoria não encontrada' };

  return {
    title: `${category.name} | ${SITE_CONFIG.name}`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const resolved = await params;
  const targetSlug = Array.isArray(resolved.slug)
    ? resolved.slug[resolved.slug.length - 1]
    : resolved.slug;

  const [category, articles] = await Promise.all([
    getCategoryBySlug(targetSlug),
    getArticlesByCategory(targetSlug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Category Header */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-brand-700 block mb-1">
            Editoria Especializada
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-950 mb-3">
            {category.name}
          </h1>
          <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <p className="text-base text-slate-500">
              Nenhuma notícia publicada nesta editoria no momento.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
