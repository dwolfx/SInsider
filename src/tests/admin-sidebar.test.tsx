import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminNavItem } from '@/components/admin/AdminNavItem';
import { AdminUserProfile } from '@/components/admin/AdminUserProfile';
import { User } from '@/types';
import { LayoutDashboard } from 'lucide-react';

const mockAdminUser: User = {
  id: 'usr-1',
  name: 'Victor Hugo',
  email: 'victor@saudeinsider.com.br',
  role: 'SUPER_ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  permissions: {
    canCreateArticle: true,
    canEditAnyArticle: true,
    canPublishArticle: true,
    canDeleteArticle: true,
    canManageUsers: true,
    canManageAds: true,
  },
};

describe('Barra Lateral Administrativa (AdminSidebar)', () => {
  it('renderiza o perfil do usuário administrativo corretamente', () => {
    render(<AdminUserProfile user={mockAdminUser} />);

    expect(screen.getByText('Victor Hugo')).toBeInTheDocument();
    expect(screen.getByText('Super Admin')).toBeInTheDocument();
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', mockAdminUser.avatarUrl);
  });

  it('renderiza um item de navegação individual com estilo ativo ou inativo', () => {
    const { rerender } = render(
      <AdminNavItem
        label="Visão Geral"
        href="/admin"
        icon={LayoutDashboard}
        isActive={true}
      />
    );

    const linkAtivo = screen.getByRole('link', { name: /visão geral/i });
    expect(linkAtivo).toHaveClass('text-white');

    rerender(
      <AdminNavItem
        label="Visão Geral"
        href="/admin"
        icon={LayoutDashboard}
        isActive={false}
      />
    );
    const linkInativo = screen.getByRole('link', { name: /visão geral/i });
    expect(linkInativo).toHaveClass('text-slate-400');
  });

  it('renderiza a barra lateral completa com permissões concedidas', () => {
    render(<AdminSidebar currentUser={mockAdminUser} />);

    expect(screen.getByText('Redação & Governança CMS')).toBeInTheDocument();
    expect(screen.getByText('Visão Geral & Métricas')).toBeInTheDocument();
    expect(screen.getByText('Notícias & Matérias')).toBeInTheDocument();
    expect(screen.getByText('Escrever Nova Notícia')).toBeInTheDocument();
    expect(screen.getByText('Publicidade & Banners')).toBeInTheDocument();
    expect(screen.getByText('Equipe & Permissões')).toBeInTheDocument();
    expect(screen.getByText('Voltar ao Portal Público')).toBeInTheDocument();
  });
});
