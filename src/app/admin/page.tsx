import React from 'react';
import Link from 'next/link';
import { getAllArticlesForAdmin, getAllAds, getUsers } from '@/lib/api';
import { AdminKpiGrid } from '@/components/admin/AdminKpiGrid';
import { AdminRecentArticlesTable } from '@/components/admin/AdminRecentArticlesTable';
import { PlusCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const [articles, ads, users] = await Promise.all([
    getAllArticlesForAdmin(),
    getAllAds(),
    getUsers(),
  ]);

  const totalViews = articles.reduce((acc, curr) => acc + curr.views, 0);
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const inReviewCount = articles.filter((a) => a.status === 'review' || a.status === 'draft').length;
  const activeAdsCount = ads.filter((a) => a.active).length;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#5c0b10] via-[#7a0f16] to-[#050505] text-white p-8 rounded-xl border border-[#7a0f16]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-rose-200 block mb-1 font-mono">
            Redação & Gestão Editorial
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black">
            Painel Executivo — Saúde Insider
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-rose-100/80 max-w-xl leading-relaxed">
            Monitore o fluxo de publicação das pautas, controle os espaços publicitários e gerencie permissões editoriais com rapidez.
          </p>
        </div>

        <Link
          href="/admin/noticias/nova"
          className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-[#5c0b10] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#7a0f16]" />
          <span>Escrever Nova Notícia</span>
        </Link>
      </div>

      <AdminKpiGrid
        totalViews={totalViews}
        publishedCount={publishedCount}
        inReviewCount={inReviewCount}
        activeAdsCount={activeAdsCount}
        usersCount={users.length}
      />

      <AdminRecentArticlesTable articles={articles} />
    </div>
  );
}
