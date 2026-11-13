import React from 'react';
import Link from 'next/link';
import { getAllArticlesForAdmin } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { PlusCircle, ExternalLink, Eye, Clock, CheckCircle } from 'lucide-react';

export default async function AdminArticlesListPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-slate-900">
            Controle Editorial de Notícias
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie todas as matérias, status de publicação e métricas de desempenho.
          </p>
        </div>

        <Link
          href="/admin/noticias/nova"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-md shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nova Notícia</span>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-4">Título / Chapéu</th>
                  <th className="p-4">Editoria</th>
                  <th className="p-4">Autor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Métricas</th>
                  <th className="p-4">Publicação</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-brand-700 uppercase">
                          {art.kicker}
                        </span>
                        {art.isBreaking && (
                          <Badge variant="danger" className="text-[9px] px-1.5 py-0">
                            Breaking
                          </Badge>
                        )}
                        {art.isFeatured && (
                          <Badge variant="warning" className="text-[9px] px-1.5 py-0">
                            Capa
                          </Badge>
                        )}
                      </div>
                      <Link
                        href={`/noticia/${art.slug}`}
                        target="_blank"
                        className="font-bold text-slate-900 hover:text-brand-700 block transition-colors"
                      >
                        {art.title}
                      </Link>
                    </td>

                    <td className="p-4">
                      <Badge variant="brand">{art.category.name}</Badge>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={art.author.avatarUrl}
                          alt={art.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800">
                          {art.author.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      {art.status === 'published' ? (
                        <Badge variant="success">Publicado</Badge>
                      ) : (
                        <Badge variant="warning">Rascunho</Badge>
                      )}
                    </td>

                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {art.views.toLocaleString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {art.readingTimeMinutes}m
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-500">
                      {formatDate(art.publishedAt)}
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        href={`/noticia/${art.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-900 font-semibold"
                      >
                        <span>Ver</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
