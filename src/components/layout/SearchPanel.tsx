import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchPanelProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onClose: () => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  isOpen,
  searchQuery,
  onSearchChange,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="border-t border-slate-200 bg-slate-50 py-3 px-4 shadow-inner">
      <div className="max-w-2xl mx-auto flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar notícias, regulatório, executivos ou decisões da ANS..."
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          autoFocus
        />
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          aria-label="Fechar busca"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
