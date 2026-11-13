import React from 'react';
import Link from 'next/link';
import { X, UserCheck } from 'lucide-react';
import { NavItem, DEFAULT_PRIMARY_NAV } from './PrimaryNav';
import { DEFAULT_SECONDARY_NAV } from './SecondaryNav';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  primaryNav?: NavItem[];
  secondaryNav?: NavItem[];
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  primaryNav = DEFAULT_PRIMARY_NAV,
  secondaryNav = DEFAULT_SECONDARY_NAV,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 z-10">
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <img
              src="https://saudeinsider.com.br/wp-content/uploads/2026/08/logo-si.png"
              alt="Saúde Insider"
              className="h-10 w-auto"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--si-color-brand-primary,#7a0f16)] mb-3 font-mono">
                Editorias
              </h4>
              <ul className="space-y-2 text-sm font-semibold text-slate-800">
                {primaryNav.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="hover:text-[var(--si-color-brand-primary,#7a0f16)] block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 font-mono">
                Seções & Formatos
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {secondaryNav.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="hover:text-[var(--si-color-brand-primary,#7a0f16)] block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 mt-8">
          <Link
            href="/admin"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-[var(--si-color-brand-primary,#7a0f16)] text-white text-xs font-bold"
          >
            <UserCheck className="w-4 h-4" />
            <span>Acessar Painel da Redação</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
