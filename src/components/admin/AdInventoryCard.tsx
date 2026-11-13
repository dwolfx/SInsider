import React from 'react';
import { AdUnit } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExternalLink } from 'lucide-react';

export interface AdInventoryCardProps {
  ad: AdUnit;
}

export const AdInventoryCard: React.FC<AdInventoryCardProps> = ({ ad }) => {
  const ctr = ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(2) : '0.00';

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
              {ad.placement}
            </span>
            <CardTitle className="text-sm">{ad.name}</CardTitle>
          </div>
          {ad.active ? (
            <Badge variant="success">Ativo</Badge>
          ) : (
            <Badge variant="outline">Pausado</Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-xs">
            <span className="font-semibold text-slate-700">Anunciante: </span>
            <span className="text-slate-900 font-bold">{ad.advertiser}</span>
          </div>

          {ad.imageUrl && (
            <div className="rounded border border-slate-200 overflow-hidden bg-slate-100 max-h-36">
              <img
                src={ad.imageUrl}
                alt={ad.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Impressões
              </span>
              <span className="font-black text-slate-900">
                {ad.views.toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Cliques
              </span>
              <span className="font-black text-slate-900">
                {ad.clicks.toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                CTR
              </span>
              <span className="font-black text-brand-700">{ctr}%</span>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
        >
          <span>Link de Destino</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <span className="text-slate-400 text-[11px]">
          ID: <code className="font-mono">{ad.id}</code>
        </span>
      </div>
    </Card>
  );
};
