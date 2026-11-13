import React from 'react';
import { Sparkles } from 'lucide-react';

export type PresetType = 'urgente' | 'entrevista' | 'opiniao' | 'podcast';

export interface QuickPresetsProps {
  onSelectPreset: (type: PresetType) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({ onSelectPreset }) => {
  return (
    <div className="bg-[#f7f7f5] border border-[var(--si-color-border-subtle)] p-4 rounded-lg flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider font-mono">
        <Sparkles className="w-4 h-4 text-[var(--si-color-brand-primary,#7a0f16)]" />
        <span>Modelos Rápidos de Redação:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectPreset('urgente')}
          className="px-3 py-1.5 text-xs bg-red-100 text-red-900 rounded font-semibold hover:bg-red-200 cursor-pointer"
        >
          Furo Urgente
        </button>
        <button
          type="button"
          onClick={() => onSelectPreset('entrevista')}
          className="px-3 py-1.5 text-xs bg-[#5c0b10] text-white rounded font-semibold hover:bg-[#7a0f16] cursor-pointer"
        >
          Grande Entrevista
        </button>
        <button
          type="button"
          onClick={() => onSelectPreset('opiniao')}
          className="px-3 py-1.5 text-xs bg-amber-100 text-amber-900 rounded font-semibold hover:bg-amber-200 cursor-pointer"
        >
          Coluna de Opinião
        </button>
        <button
          type="button"
          onClick={() => onSelectPreset('podcast')}
          className="px-3 py-1.5 text-xs bg-purple-100 text-purple-900 rounded font-semibold hover:bg-purple-200 cursor-pointer"
        >
          Episódio de Podcast
        </button>
      </div>
    </div>
  );
};
