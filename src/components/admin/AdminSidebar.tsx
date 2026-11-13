'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, PlusCircle, Megaphone, Users, ArrowLeft } from 'lucide-react';
import { User } from '@/types';
import { AdminUserProfile } from './AdminUserProfile';
import { AdminNavItem } from './AdminNavItem';

interface AdminSidebarProps {
  currentUser: User;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentUser }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Visão Geral & Métricas',
      href: '/admin',
      icon: LayoutDashboard,
      allowed: true,
    },
    {
      label: 'Notícias & Matérias',
      href: '/admin/noticias',
      icon: FileText,
      allowed: true,
    },
    {
      label: 'Escrever Nova Notícia',
      href: '/admin/noticias/nova',
      icon: PlusCircle,
      allowed: currentUser.permissions.canCreateArticle,
    },
    {
      label: 'Publicidade & Banners',
      href: '/admin/publicidade',
      icon: Megaphone,
      allowed: currentUser.permissions.canManageAds,
    },
    {
      label: 'Equipe & Permissões',
      href: '/admin/usuarios',
      icon: Users,
      allowed: currentUser.permissions.canManageUsers,
    },
  ];

  return (
    <aside className="w-64 bg-[#050505] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-[#1a1a1a]">
      <div>
        <div className="p-6 border-b border-[#1a1a1a] flex flex-col items-center text-center">
          <Link href="/" className="block">
            <img
              src="https://saudeinsider.com.br/wp-content/uploads/2026/08/logo-si.png"
              alt="Saúde Insider"
              className="h-10 w-auto object-contain mx-auto brightness-110"
            />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--si-red-600,#a3262a)] mt-2 block font-mono">
              Redação & Governança CMS
            </span>
          </Link>
        </div>

        <AdminUserProfile user={currentUser} />

        <nav className="px-3 space-y-1">
          {navItems
            .filter((item) => item.allowed)
            .map((item) => (
              <AdminNavItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            ))}
        </nav>
      </div>

      <div className="p-4 border-t border-[#1a1a1a]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Portal Público</span>
        </Link>
      </div>
    </aside>
  );
};
