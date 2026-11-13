import React from 'react';
import { getAllAds } from '@/lib/api';
import { AdInventoryCard } from '@/components/admin/AdInventoryCard';

export default async function AdminAdvertisingPage() {
  const ads = await getAllAds();

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-serif font-black text-slate-900">
          Gestão de Publicidade & Banners
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Controle de inventário publicitário, formatos IAB (Leaderboard, MPU, Native) e monitoramento de cliques.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ads.map((ad) => (
          <AdInventoryCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}
