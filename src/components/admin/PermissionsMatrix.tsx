import React from 'react';
import { UserPermissions } from '@/types';
import { Check, X } from 'lucide-react';

export interface PermissionsMatrixProps {
  permissions: UserPermissions;
}

export const PermissionsMatrix: React.FC<PermissionsMatrixProps> = ({ permissions }) => {
  const items = [
    { label: 'Criar Artigo', allowed: permissions.canCreateArticle },
    { label: 'Publicar no Ar', allowed: permissions.canPublishArticle },
    { label: 'Excluir Artigo', allowed: permissions.canDeleteArticle },
    { label: 'Gerir Publicidade', allowed: permissions.canManageAds },
    { label: 'Gerir Usuários', allowed: permissions.canManageUsers },
    { label: 'Ver Analytics', allowed: permissions.canViewAnalytics },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
      {items.map((item) => (
        <div key={item.label} className="p-2.5 rounded bg-white border border-slate-200">
          <span className="text-slate-500 block text-[10px] mb-1">{item.label}</span>
          {item.allowed ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Permitido
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Bloqueado
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
