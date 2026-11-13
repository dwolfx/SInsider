import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArticleStatus } from '@/types';
import { CheckCircle } from 'lucide-react';

export interface PublishingSettingsCardProps {
  status: ArticleStatus;
  setStatus: (status: ArticleStatus) => void;
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  isBreaking: boolean;
  setIsBreaking: (val: boolean) => void;
  isSponsored: boolean;
  setIsSponsored: (val: boolean) => void;
  isSubmitting: boolean;
  success: boolean;
}

export const PublishingSettingsCard: React.FC<PublishingSettingsCardProps> = ({
  status,
  setStatus,
  isFeatured,
  setIsFeatured,
  isBreaking,
  setIsBreaking,
  isSponsored,
  setIsSponsored,
  isSubmitting,
  success,
}) => {
  return (
    <Card className="border-[var(--si-color-border-subtle)]">
      <CardHeader className="bg-white border-b border-slate-100">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 font-serif">
          <CheckCircle className="w-4 h-4 text-[var(--si-color-brand-primary,#7a0f16)]" />
          <span>Publicação & Formato</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-white p-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
            Status Editorial
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ArticleStatus)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-[var(--si-color-brand-primary,#7a0f16)] focus:outline-none"
          >
            <option value="published">Publicado Imediatamente</option>
            <option value="review">Em Revisão Editorial</option>
            <option value="draft">Rascunho</option>
            <option value="scheduled">Agendado</option>
          </select>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-[var(--si-color-brand-primary,#7a0f16)] focus:ring-[var(--si-color-brand-primary,#7a0f16)] h-4 w-4"
            />
            <span className="text-xs font-semibold text-slate-800">Destaque na Capa</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
            />
            <span className="text-xs font-semibold text-red-700">Furo Urgente / Breaking</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSponsored}
              onChange={(e) => setIsSponsored(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
            />
            <span className="text-xs font-semibold text-amber-700">Publieditorial / Patrocinado</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Button
            type="submit"
            className="w-full bg-[var(--si-color-brand-primary,#7a0f16)] hover:bg-[var(--si-color-brand-primary-hover,#5c0b10)] text-white font-bold"
            isLoading={isSubmitting}
          >
            {status === 'published' ? 'Publicar Notícia' : 'Salvar Notícia'}
          </Button>
        </div>

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded font-medium text-center">
            Notícia salva com sucesso! Redirecionando...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
