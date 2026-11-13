import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';
import RootLayout, { metadata as rootMetadata } from '@/app/layout';
import ArticlePage, { generateMetadata as generateArticleMetadata } from '@/app/noticia/[slug]/page';
import CategoryPage, { generateMetadata as generateCategoryMetadata } from '@/app/categoria/[slug]/page';
import AdminDashboardPage from '@/app/admin/page';
import AdminArticlesListPage from '@/app/admin/noticias/page';
import NewArticlePage from '@/app/admin/noticias/nova/page';
import AdminAdvertisingPage from '@/app/admin/publicidade/page';
import AdminUsersPage from '@/app/admin/usuarios/page';
import AdminLayout from '@/app/admin/layout';

import { MOCK_ARTICLES, MOCK_CATEGORIES } from '@/lib/mock-data';

describe('Testes de Integração de Páginas do App Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Página Inicial (src/app/page.tsx)', () => {
    it('renderiza a página principal e o botão flutuante de governança CMS', () => {
      render(<HomePage />);

      const cmsButton = screen.getByRole('link', { name: /redação & governança cms/i });
      expect(cmsButton).toBeInTheDocument();
      expect(cmsButton).toHaveAttribute('href', '/admin');
    });
  });

  describe('Layout Raiz (src/app/layout.tsx)', () => {
    it('renderiza o layout HTML com os elementos filhos e dados estruturados da organização', () => {
      const layout = RootLayout({
        children: <div data-testid="app-content">Conteúdo da Aplicação</div>,
      });
      render(layout);
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    });

    it('exporta metadados válidos para o portal institucional', () => {
      expect(rootMetadata.description).toBeDefined();
      expect(rootMetadata.authors).toEqual(
        expect.arrayContaining([{ name: 'Victor Hugo' }])
      );
    });
  });

  describe('Página de Detalhe da Notícia (src/app/noticia/[slug]/page.tsx)', () => {
    const dynamicArticle = MOCK_ARTICLES[1];
    const kalacheArticle = MOCK_ARTICLES[0];

    it('renderiza matéria dinâmica com manchete, chapéu editorial e autor', async () => {
      const pageResult = await ArticlePage({
        params: Promise.resolve({ slug: dynamicArticle.slug }),
      });
      render(pageResult);

      expect(screen.getByRole('heading', { level: 1, name: dynamicArticle.title })).toBeInTheDocument();
      expect(screen.getByText(dynamicArticle.kicker)).toBeInTheDocument();
      expect(screen.getByText(dynamicArticle.author.name)).toBeInTheDocument();
    });

    it('renderiza a matéria de Alexandre Kalache com seus dados e conteúdo', async () => {
      const pageResult = await ArticlePage({
        params: Promise.resolve({ slug: kalacheArticle.slug }),
      });
      const { container } = render(pageResult);

      expect(container.textContent).toContain('Alexandre Kalache');
      expect(container.textContent).toContain('gerontologia');
    });

    it('dispara erro NEXT_NOT_FOUND quando o slug da notícia não existe', async () => {
      await expect(
        ArticlePage({
          params: Promise.resolve({ slug: 'artigo-que-nunca-existiu-slug' }),
        })
      ).rejects.toThrow('NEXT_NOT_FOUND');
    });

    it('gera metadados SEO do Next.js para matéria válida', async () => {
      const meta = await generateArticleMetadata({
        params: Promise.resolve({ slug: dynamicArticle.slug }),
      });

      expect(meta.title).toContain(dynamicArticle.title);
      expect(meta.description).toBe(dynamicArticle.subtitle || dynamicArticle.excerpt);
    });

    it('renderiza o trilho flutuante de compartilhamento social com todas as redes oficiais', async () => {
      const pageResult = await ArticlePage({
        params: Promise.resolve({ slug: dynamicArticle.slug }),
      });
      render(pageResult);

      expect(screen.getByLabelText('Compartilhar no LinkedIn')).toBeInTheDocument();
      expect(screen.getByLabelText('Perfil do Saúde Insider no Instagram')).toBeInTheDocument();
      expect(screen.getByLabelText('Compartilhar no WhatsApp')).toBeInTheDocument();
      expect(screen.getByLabelText('Compartilhar no Telegram')).toBeInTheDocument();
      expect(screen.getByLabelText('Compartilhar no X (Twitter)')).toBeInTheDocument();
      expect(screen.getByLabelText('Compartilhar no E-mail')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copiar link da notícia/i })).toBeInTheDocument();
    });

    it('gera metadados de fallback quando a notícia não for encontrada', async () => {
      const meta = await generateArticleMetadata({
        params: Promise.resolve({ slug: 'artigo-fantasma-slug' }),
      });

      expect(meta.title).toBe('Notícia não encontrada');
    });
  });

  describe('Página de Categoria / Editoria (src/app/categoria/[slug]/page.tsx)', () => {
    const validCategory = MOCK_CATEGORIES[0];

    it('renderiza o cabeçalho da categoria e a listagem de matérias publicadas', async () => {
      const pageResult = await CategoryPage({
        params: Promise.resolve({ slug: validCategory.slug }),
      });
      render(pageResult);

      expect(screen.getByRole('heading', { level: 1, name: validCategory.name })).toBeInTheDocument();
      expect(screen.getByText(validCategory.description)).toBeInTheDocument();
    });

    it('renderiza estado vazio quando não há notícias publicadas na editoria', async () => {
      const pageResult = await CategoryPage({
        params: Promise.resolve({ slug: 'tecnologia' }),
      });
      render(pageResult);

      expect(
        screen.getByText('Nenhuma notícia publicada nesta editoria no momento.')
      ).toBeInTheDocument();
    });

    it('dispara NEXT_NOT_FOUND quando o slug da categoria for inválido', async () => {
      await expect(
        CategoryPage({
          params: Promise.resolve({ slug: 'editoria-desconhecida-xyz' }),
        })
      ).rejects.toThrow('NEXT_NOT_FOUND');
    });

    it('gera metadados para categoria válida', async () => {
      const meta = await generateCategoryMetadata({
        params: Promise.resolve({ slug: validCategory.slug }),
      });

      expect(meta.title).toContain(validCategory.name);
      expect(meta.description).toBe(validCategory.description);
    });

    it('gera metadados de fallback para categoria desconhecida', async () => {
      const meta = await generateCategoryMetadata({
        params: Promise.resolve({ slug: 'editoria-nao-existente' }),
      });

      expect(meta.title).toBe('Editoria não encontrada');
    });
  });

  describe('Página de Painel Administrativo (src/app/admin/page.tsx)', () => {
    it('renderiza estatísticas de KPIs editoriais, banner de boas-vindas e ações rápidas', async () => {
      const pageResult = await AdminDashboardPage();
      render(pageResult);

      expect(screen.getByText(/painel executivo — saúde insider/i)).toBeInTheDocument();
      expect(screen.getByText(/audiência total/i)).toBeInTheDocument();
      expect(screen.getByText(/notícias publicadas/i)).toBeInTheDocument();
      expect(screen.getByText(/banners de publicidade/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /escrever nova notícia/i })).toBeInTheDocument();
    });
  });

  describe('Página de Listagem de Matérias Admin (src/app/admin/noticias/page.tsx)', () => {
    it('renderiza a tabela de matérias com badges de status e link de criação', async () => {
      const pageResult = await AdminArticlesListPage();
      render(pageResult);

      expect(screen.getByText(/controle editorial de notícias/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /nova notícia/i })).toBeInTheDocument();
      expect(screen.getByText('Título / Chapéu')).toBeInTheDocument();
      expect(screen.getByText('Editoria')).toBeInTheDocument();
    });
  });

  describe('Página de Criação de Matéria Admin (src/app/admin/noticias/nova/page.tsx)', () => {
    it('renderiza o editor de publicação de matérias com formulário', async () => {
      const pageResult = await NewArticlePage();
      render(pageResult);

      expect(screen.getByText(/publicador & editor de notícias/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/chapéu \/ kicker \*/i)).toBeInTheDocument();
    });
  });

  describe('Página de Gestão de Publicidade Admin (src/app/admin/publicidade/page.tsx)', () => {
    it('renderiza o inventário de unidades publicitárias com badges de status', async () => {
      const pageResult = await AdminAdvertisingPage();
      render(pageResult);

      expect(screen.getByText(/gestão de publicidade & banners/i)).toBeInTheDocument();
      expect(screen.getAllByText(/anunciante:/i).length).toBeGreaterThan(0);
    });
  });

  describe('Página de Gestão de Equipe e RBAC (src/app/admin/usuarios/page.tsx)', () => {
    it('renderiza lista de usuários, badges de papéis e matriz de permissões', async () => {
      const pageResult = await AdminUsersPage();
      render(pageResult);

      expect(screen.getByText(/equipe editorial & controle de acesso \(rbac\)/i)).toBeInTheDocument();
      expect(screen.getByText('Victor Hugo')).toBeInTheDocument();
      expect(screen.getByText(/super admin/i)).toBeInTheDocument();
      expect(screen.getAllByText(/matriz de permissões:/i).length).toBeGreaterThan(0);
    });
  });

  describe('Layout Administrativo (src/app/admin/layout.tsx)', () => {
    it('renderiza o layout envolvendo os elementos filhos com barra lateral e cabeçalho seguro', async () => {
      const layoutResult = await AdminLayout({
        children: <div data-testid="admin-child">Conteúdo da Administração</div>,
      });
      render(layoutResult);

      expect(screen.getByText(/painel de redação & governança/i)).toBeInTheDocument();
      expect(screen.getByText(/acesso seguro rbac ativo/i)).toBeInTheDocument();
      expect(screen.getByTestId('admin-child')).toBeInTheDocument();
    });
  });
});
