import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Article } from '@/types';
import { FileText, ArrowUpRight, ExternalLink } from 'lucide-react';

export interface AdminRecentArticlesTableProps {
  articles: Article[];
}

export const AdminRecentArticlesTable: React.FC<AdminRecentArticlesTableProps> = ({ articles }) => {
  return (
    <Card className="border-[var(--si-color-border-subtle)]">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--si-color-border-subtle)] bg-white">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 font-serif">
          <FileText className="w-4 h-4 text-[var(--si-color-brand-primary,#7a0f16)]" />
          <span>Últimas Publicações & Pautas</span>
        </CardTitle>
        <Link
          href="/admin/noticias"
          className="text-xs font-bold text-[var(--si-color-brand-primary,#7a0f16)] hover:underline flex items-center gap-1"
        >
          <span>Ver todas</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f7f5] text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Matéria</th>
                <th className="p-4">Editoria</th>
                <th className="p-4">Autor</th>
                <th className="p-4">Status</th>
                <th className="p-4">Leituras</th>
                <th className="p-4">Data</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.slice(0, 6).map((art) => (
                <tr key={art.id} className="hover:bg-[#f7f7f5]/80 transition-colors">
                  <td className="p-4 max-w-sm">
                    <span className="text-[10px] font-bold text-[var(--si-color-brand-primary,#7a0f16)] uppercase block mb-0.5">
                      {art.kicker}
                    </span>
                    <span className="font-bold text-[#111111] block truncate font-serif text-sm">
                      {art.title}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-700">
                      {art.category.name}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">
                    {art.author.name}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        art.status === 'published'
                          ? 'brand'
                          : art.status === 'review'
                          ? 'warning'
                          : 'outline'
                      }
                    >
                      {art.status === 'published'
                        ? 'No Ar'
                        : art.status === 'review'
                        ? 'Revisão'
                        : 'Rascunho'}
                    </Badge>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    {art.views.toLocaleString('pt-BR')}
                  </td>
                  <td className="p-4 text-slate-500 whitespace-nowrap">
                    {formatDate(art.publishedAt)}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/noticia/${art.slug}`}
                      className="inline-flex items-center gap-1 text-[var(--si-color-brand-primary,#7a0f16)] hover:underline font-bold"
                    >
                      <span>Ver</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
