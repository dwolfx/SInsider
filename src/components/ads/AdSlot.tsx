'use client';

import React from 'react';
import { AdPlacement, AdUnit } from '@/types';
import { cn } from '@/lib/utils';
import { Megaphone, ExternalLink } from 'lucide-react';

export interface AdSlotProps {
  placement: AdPlacement;
  adUnit?: AdUnit | null;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, adUnit, className }) => {
  const isLeaderboard = placement === 'header_billboard' || placement === 'bottom_banner';
  const isSidebar = placement === 'sidebar_rectangle';
  const isInArticle = placement === 'in_article_fluid';

  // Fallback ad house banner if no active sponsor
  if (!adUnit || !adUnit.active) {
    return (
      <aside
        aria-label="Espaço Publicitário"
        className={cn(
          'w-full mx-auto my-4 bg-gradient-to-r from-slate-900 via-navy-900 to-teal-950 text-white rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-teal-800/40 shadow-sm relative overflow-hidden',
          isLeaderboard && 'max-w-5xl min-h-[90px]',
          isSidebar && 'max-w-[320px] flex-col text-center min-h-[250px] justify-center p-6',
          isInArticle && 'max-w-3xl min-h-[100px] my-8',
          className
        )}
      >
        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-brand-500/20 text-brand-400">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 block">
              Mídia & Parcerias
            </span>
            <p className="text-sm font-semibold text-slate-100">
              Conecte sua marca aos líderes que decidem os rumos da saúde.
            </p>
          </div>
        </div>

        <a
          href="https://saudeinsider.com.br/anuncie"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-500 text-slate-950 text-xs font-bold rounded hover:bg-brand-400 transition-colors shrink-0"
        >
          Anuncie Aqui
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </aside>
    );
  }

  return (
    <aside
      aria-label={`Publicidade: ${adUnit.advertiser}`}
      className={cn(
        'mx-auto my-6 flex flex-col items-center justify-center text-center',
        isLeaderboard && 'max-w-5xl',
        isSidebar && 'max-w-[320px]',
        isInArticle && 'max-w-3xl my-8',
        className
      )}
    >
      <div className="flex items-center gap-1 mb-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400">
        <span>Publicidade</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500 font-medium">{adUnit.advertiser}</span>
      </div>

      <a
        href={adUnit.targetUrl || '#'}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group block overflow-hidden rounded border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-brand-500/50"
      >
        {adUnit.imageUrl ? (
          <img
            src={adUnit.imageUrl}
            alt={`Publicidade de ${adUnit.advertiser}`}
            className="w-full h-auto object-cover max-h-[250px] transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />
        ) : (
          <div className="p-8 bg-slate-100 text-slate-700 text-sm font-medium">
            {adUnit.name}
          </div>
        )}
      </a>
    </aside>
  );
};
