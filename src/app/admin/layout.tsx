import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getUsers } from '@/lib/api';
import { Shield } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  const currentUser = users[0]; // Victor Hugo

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row font-sans">
      <AdminSidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#f7f7f5] min-h-screen">
        {/* Admin Top Navigation */}
        <header className="h-16 bg-white border-b border-[var(--si-color-border-subtle,#e8e8e5)] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#111111] font-mono">
              Painel de Redação & Governança
            </span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 text-xs text-[var(--si-color-brand-primary,#7a0f16)] bg-[var(--si-red-50,#f3e8e9)] px-2.5 py-1 rounded-full font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Acesso Seguro RBAC Ativo</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-slate-500">
                {currentUser.email}
              </span>
            </div>
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-[var(--si-color-brand-primary,#7a0f16)]"
            />
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
