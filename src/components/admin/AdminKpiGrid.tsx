import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Eye, FileText, Megaphone, Users, TrendingUp } from 'lucide-react';

export interface AdminKpiGridProps {
  totalViews: number;
  publishedCount: number;
  inReviewCount: number;
  activeAdsCount: number;
  usersCount: number;
}

export const AdminKpiGrid: React.FC<AdminKpiGridProps> = ({
  totalViews,
  publishedCount,
  inReviewCount,
  activeAdsCount,
  usersCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <Card className="border-[var(--si-color-border-subtle)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Audiência Total
            </span>
            <div className="p-2 rounded-lg bg-[var(--si-red-50,#f3e8e9)] text-[var(--si-color-brand-primary,#7a0f16)]">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-black text-[#111111]">
              {totalViews.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +28% este mês
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--si-color-border-subtle)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Notícias Publicadas
            </span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-black text-[#111111]">{publishedCount}</span>
            <span className="text-xs text-slate-400 block mt-1">
              {inReviewCount} em rascunho/revisão
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--si-color-border-subtle)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Banners de Publicidade
            </span>
            <div className="p-2 rounded-lg bg-[var(--si-red-50,#f3e8e9)] text-[var(--si-color-brand-primary,#7a0f16)]">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-black text-[#111111]">{activeAdsCount} Ativos</span>
            <span className="text-xs text-[var(--si-color-brand-primary,#7a0f16)] font-semibold block mt-1">
              Inventário IAB monitorado
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--si-color-border-subtle)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Equipe Redação
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-black text-[#111111]">{usersCount}</span>
            <span className="text-xs text-slate-400 block mt-1">
              Com controle de acesso RBAC
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
