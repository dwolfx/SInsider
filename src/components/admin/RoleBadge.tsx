import React from 'react';
import { UserRole } from '@/types';

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#5c0b10] text-rose-100 border border-[#7a0f16]">
          Super Admin
        </span>
      );
    case 'EDITOR_CHIEF':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-700">
          Editor-Chefe
        </span>
      );
    case 'JOURNALIST':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-200 border border-amber-800">
          Repórter
        </span>
      );
    case 'COMMERCIAL':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-200 border border-emerald-800">
          Comercial
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
          {role}
        </span>
      );
  }
};
