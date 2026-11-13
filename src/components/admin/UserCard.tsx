import React from 'react';
import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { RoleBadge } from './RoleBadge';
import { Badge } from '@/components/ui/Badge';
import { PermissionsMatrix } from './PermissionsMatrix';

export interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-brand-500"
          />
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            {user.bio && (
              <p className="text-xs text-slate-600 mt-1 max-w-xl">{user.bio}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={user.active ? 'success' : 'outline'}>
            {user.active ? 'Conta Ativa' : 'Inativa'}
          </Badge>
        </div>
      </div>

      <CardContent className="bg-slate-50/50 p-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
          Matriz de Permissões:
        </span>
        <PermissionsMatrix permissions={user.permissions} />
      </CardContent>
    </Card>
  );
};
