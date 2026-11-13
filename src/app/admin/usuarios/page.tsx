import React from 'react';
import { getUsers } from '@/lib/api';
import { UserCard } from '@/components/admin/UserCard';

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-serif font-black text-slate-900">
          Equipe Editorial & Controle de Acesso (RBAC)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Níveis de permissões granulares para jornalistas, editores-chefes, comercial e administração.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
