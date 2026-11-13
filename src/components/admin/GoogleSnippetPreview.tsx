import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Globe } from 'lucide-react';

export interface GoogleSnippetPreviewProps {
  title: string;
  subtitle: string;
}

export const GoogleSnippetPreview: React.FC<GoogleSnippetPreviewProps> = ({ title, subtitle }) => {
  const slugPreview = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) : 'sua-noticia';

  return (
    <Card className="border-[var(--si-color-border-subtle)] bg-white">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-800 font-mono uppercase tracking-wider">
          <Globe className="w-4 h-4 text-[var(--si-color-brand-primary,#7a0f16)]" />
          <span>Simulador de Snippet Google (SEO em Tempo Real)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-[#f7f7f5] p-4 rounded border border-slate-200 font-sans max-w-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 mb-1">
            <span className="font-semibold text-slate-900">saudeinsider.com.br</span>
            <span className="text-slate-400">› noticia ›</span>
            <span className="text-slate-500 truncate">{slugPreview}</span>
          </div>
          <h4 className="text-base font-medium text-blue-800 hover:underline line-clamp-1 cursor-pointer">
            {title || 'Título da notícia aparecerá aqui no Google'} | Saúde Insider
          </h4>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {subtitle || 'A linha fina e meta-description da sua publicação aparecerá nos resultados de busca do Google e no Google Notícias.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
