'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { Flame, ChevronRight } from 'lucide-react';

interface EditorialTickerProps {
  article: Article | null;
}

export const EditorialTicker: React.FC<EditorialTickerProps> = ({ article }) => {
  if (!article) return null;

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold uppercase tracking-wider text-[10px] shrink-0">
            <Flame className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
            <span>Giro Insider</span>
          </div>

          <Link
            href={`/noticia/${article.slug}`}
            className="truncate text-slate-200 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <span className="font-semibold text-brand-400 shrink-0">
              [{article.kicker}]
            </span>
            <span className="truncate">{article.title}</span>
            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px] shrink-0 font-medium">
          <span>ANS & Regulatório</span>
          <span className="text-slate-700">•</span>
          <span>Healthtechs & IA</span>
          <span className="text-slate-700">•</span>
          <span>Sustentabilidade Hospitalar</span>
        </div>
      </div>
    </div>
  );
};
