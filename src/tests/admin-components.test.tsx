import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { MOCK_CATEGORIES, MOCK_USERS } from '@/lib/mock-data';
import { User } from '@/types';
import * as apiModule from '@/lib/api';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/admin',
}));

describe('Testes de Componentes Administrativos (Unitários e de Integração)', () => {
  const superAdmin = MOCK_USERS[0]; // Victor Hugo

  const journalistUser: User = {
    id: 'usr-j',
    name: 'Dra. Beatriz Repórter',
    email: 'beatriz@saudeinsider.com.br',
    role: 'JOURNALIST',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    active: true,
    permissions: {
      canCreateArticle: true,
      canPublishArticle: false,
      canDeleteArticle: false,
      canManageUsers: false,
      canManageAds: false,
      canViewAnalytics: false,
    },
  };

  const commercialUser: User = {
    id: 'usr-c',
    name: 'Marcos Comercial',
    email: 'marcos@saudeinsider.com.br',
    role: 'COMMERCIAL',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    active: true,
    permissions: {
      canCreateArticle: false,
      canPublishArticle: false,
      canDeleteArticle: false,
      canManageUsers: false,
      canManageAds: true,
      canViewAnalytics: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Componente AdminSidebar (Controle de Acesso RBAC)', () => {
    it('renderiza todos os itens de navegação administrativa para SUPER_ADMIN', () => {
      render(<AdminSidebar currentUser={superAdmin} />);

      expect(screen.getByText('Visão Geral & Métricas')).toBeInTheDocument();
      expect(screen.getByText('Notícias & Matérias')).toBeInTheDocument();
      expect(screen.getByText('Escrever Nova Notícia')).toBeInTheDocument();
      expect(screen.getByText('Publicidade & Banners')).toBeInTheDocument();
      expect(screen.getByText('Equipe & Permissões')).toBeInTheDocument();

      expect(screen.getByText(superAdmin.name)).toBeInTheDocument();
      expect(screen.getByText(/super admin/i)).toBeInTheDocument();
    });

    it('oculta abas de gestão de equipe e publicidade para JOURNALIST', () => {
      render(<AdminSidebar currentUser={journalistUser} />);

      expect(screen.getByText('Visão Geral & Métricas')).toBeInTheDocument();
      expect(screen.getByText('Notícias & Matérias')).toBeInTheDocument();
      expect(screen.getByText('Escrever Nova Notícia')).toBeInTheDocument();
      expect(screen.queryByText('Publicidade & Banners')).not.toBeInTheDocument();
      expect(screen.queryByText('Equipe & Permissões')).not.toBeInTheDocument();
    });

    it('oculta criação de matérias e gestão de usuários para COMMERCIAL', () => {
      render(<AdminSidebar currentUser={commercialUser} />);

      expect(screen.getByText('Visão Geral & Métricas')).toBeInTheDocument();
      expect(screen.getByText('Notícias & Matérias')).toBeInTheDocument();
      expect(screen.queryByText('Escrever Nova Notícia')).not.toBeInTheDocument();
      expect(screen.getByText('Publicidade & Banners')).toBeInTheDocument();
      expect(screen.queryByText('Equipe & Permissões')).not.toBeInTheDocument();
    });
  });

  describe('Componente ArticleForm (Fluxo de Publicação e Presets)', () => {
    beforeEach(() => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    it('renderiza os campos do formulário e preenche com os presets', () => {
      render(
        <ArticleForm
          categories={MOCK_CATEGORIES}
          users={MOCK_USERS}
          currentUser={superAdmin}
        />
      );

      expect(screen.getByLabelText(/chapéu \/ kicker \*/i)).toHaveValue('NOTÍCIA');

      // Click "Furo Urgente" preset
      const urgenteBtn = screen.getByRole('button', { name: /furo urgente/i });
      fireEvent.click(urgenteBtn);
      expect(screen.getByLabelText(/chapéu \/ kicker \*/i)).toHaveValue('URGENTE / FURO');

      // Click "Grande Entrevista" preset
      const entrevistaBtn = screen.getByRole('button', { name: /grande entrevista/i });
      fireEvent.click(entrevistaBtn);
      expect(screen.getByLabelText(/chapéu \/ kicker \*/i)).toHaveValue('GRANDE ENTREVISTA');

      // Click "Coluna de Opinião" preset
      const opiniaoBtn = screen.getByRole('button', { name: /coluna de opinião/i });
      fireEvent.click(opiniaoBtn);
      expect(screen.getByLabelText(/chapéu \/ kicker \*/i)).toHaveValue('OPINIÃO');

      // Click "Episódio de Podcast" preset
      const podcastBtn = screen.getByRole('button', { name: /episódio de podcast/i });
      fireEvent.click(podcastBtn);
      expect(screen.getByLabelText(/chapéu \/ kicker \*/i)).toHaveValue('PODCAST');
    });

    it('atualiza a simulação do snippet do Google em tempo real quando título e subtítulo mudam', () => {
      render(
        <ArticleForm
          categories={MOCK_CATEGORIES}
          users={MOCK_USERS}
          currentUser={superAdmin}
        />
      );

      const titleInput = screen.getByLabelText(/título principal \(manchete\) \*/i);
      const subtitleInput = screen.getByLabelText(/linha fina \/ subtítulo \*/i);

      fireEvent.change(titleInput, {
        target: { value: 'Nova Regulação da ANS em 2026' },
      });
      fireEvent.change(subtitleInput, {
        target: { value: 'Operadoras terão novas regras de solvência financeira.' },
      });

      expect(screen.getByText(/Nova Regulação da ANS em 2026 \| Saúde Insider/i)).toBeInTheDocument();
      const matchedSubtitles = screen.getAllByText('Operadoras terão novas regras de solvência financeira.');
      expect(matchedSubtitles.length).toBeGreaterThanOrEqual(1);
    });

    it('emite alerta ao submeter o formulário com campos obrigatórios vazios', () => {
      render(
        <ArticleForm
          categories={MOCK_CATEGORIES}
          users={MOCK_USERS}
          currentUser={superAdmin}
        />
      );

      const form = screen.getByRole('button', { name: /publicar notícia/i }).closest('form')!;
      fireEvent.submit(form);

      expect(window.alert).toHaveBeenCalledWith(
        'Por favor, preencha todos os campos obrigatórios.'
      );
    });

    it('submete artigo válido com sucesso, invoca createArticle e redireciona', async () => {
      const mockCreated = {
        id: 'art-999',
        slug: 'nova-noticia-validada-com-sucesso',
        title: 'Nova Notícia Validada com Sucesso',
      };
      const createArticleSpy = vi
        .spyOn(apiModule, 'createArticle')
        .mockResolvedValue(mockCreated as any);

      render(
        <ArticleForm
          categories={MOCK_CATEGORIES}
          users={MOCK_USERS}
          currentUser={superAdmin}
        />
      );

      fireEvent.change(screen.getByLabelText(/título principal \(manchete\) \*/i), {
        target: { value: 'Nova Notícia Validada com Sucesso' },
      });
      fireEvent.change(screen.getByLabelText(/linha fina \/ subtítulo \*/i), {
        target: { value: 'Subtítulo da matéria jornalística.' },
      });
      fireEvent.change(
        screen.getByPlaceholderText(/primeiro parágrafo de impacto/i),
        { target: { value: '<p>Corpo completo do artigo apurado.</p>' } }
      );

      const form = screen.getByRole('button', { name: /publicar notícia/i }).closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(createArticleSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Nova Notícia Validada com Sucesso',
            subtitle: 'Subtítulo da matéria jornalística.',
            content: '<p>Corpo completo do artigo apurado.</p>',
          })
        );
      });

      expect(screen.getByText(/notícia salva com sucesso! redirecionando.../i)).toBeInTheDocument();
    });

    it('trata falha de submissão do formulário com resiliência', async () => {
      vi.spyOn(apiModule, 'createArticle').mockRejectedValue(new Error('Falha no banco'));

      render(
        <ArticleForm
          categories={MOCK_CATEGORIES}
          users={MOCK_USERS}
          currentUser={superAdmin}
        />
      );

      fireEvent.change(screen.getByLabelText(/título principal \(manchete\) \*/i), {
        target: { value: 'Notícia com Falha' },
      });
      fireEvent.change(screen.getByLabelText(/linha fina \/ subtítulo \*/i), {
        target: { value: 'Subtítulo válido' },
      });
      fireEvent.change(
        screen.getByPlaceholderText(/primeiro parágrafo de impacto/i),
        { target: { value: '<p>Corpo válido</p>' } }
      );

      const form = screen.getByRole('button', { name: /publicar notícia/i }).closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          'Erro ao criar notícia. Tente novamente.'
        );
      });
    });
  });
});
