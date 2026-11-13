import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  ArticleHeroCard,
  ArticleGridCard,
  ArticleHorizontalCard,
  ArticleCompactCard,
  ArticleAuthorMeta,
  ArticleCardBadges,
  ArticleCard,
} from '@/components/editorial/ArticleCard';
import { Article } from '@/types';

const artigoMock: Article = {
  id: 'art-1',
  slug: 'avanco-revolucionario-ia-medicina',
  title: 'Avanço Revolucionário na Aplicação de IA para Diagnósticos Precoces',
  subtitle: 'Estudo comprova eficácia superior a métodos tradicionais no SUS.',
  excerpt: 'Resumo sobre o avanço revolucionário de inteligência artificial médica.',
  content: '<p>Conteúdo completo do artigo sobre tecnologia em saúde.</p>',
  kicker: 'Inovação e Tecnologia',
  category: {
    id: 'cat-tech',
    name: 'Tecnologia',
    slug: 'tecnologia',
  },
  author: {
    id: 'auth-1',
    name: 'Dra. Gabriela Vasconcelos',
    role: 'Especialista em Saúde Digital',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
  },
  publishedAt: '2026-11-05T10:00:00Z',
  coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
  isBreaking: true,
  readingTimeMinutes: 6,
  views: 3450,
};

describe('Componentes Modulares de Artigos (Article Cards)', () => {
  it('renderiza os badges e o kicker do artigo corretamente', () => {
    render(
      <ArticleCardBadges
        kicker="Plantão Urgente"
        categoryName="Regulatório"
        isBreaking={true}
      />
    );

    expect(screen.getByText('Plantão Urgente')).toBeInTheDocument();
    expect(screen.getByText('Regulatório')).toBeInTheDocument();
    expect(screen.getByText('URGENTE')).toBeInTheDocument();
  });

  it('renderiza os metadados do autor e data formatada', () => {
    render(
      <ArticleAuthorMeta
        authorName="Dra. Gabriela Vasconcelos"
        avatarUrl={artigoMock.author.avatarUrl}
        publishedAt={artigoMock.publishedAt}
      />
    );

    expect(screen.getByText('Dra. Gabriela Vasconcelos')).toBeInTheDocument();
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', artigoMock.author.avatarUrl);
    expect(avatar).toHaveAttribute('alt', 'Dra. Gabriela Vasconcelos');
  });

  it('renderiza a variação Hero com todas as informações e métricas', () => {
    render(<ArticleHeroCard article={artigoMock} />);

    expect(screen.getByRole('heading', { level: 2, name: artigoMock.title })).toBeInTheDocument();
    expect(screen.getByText('6 min de leitura')).toBeInTheDocument();
    expect(screen.getByText('3.450')).toBeInTheDocument();
  });

  it('renderiza a variação Grid com badge de categoria e imagem de capa', () => {
    render(<ArticleGridCard article={artigoMock} />);

    expect(screen.getByRole('heading', { level: 3, name: artigoMock.title })).toBeInTheDocument();
    expect(screen.getByText(artigoMock.category.name)).toBeInTheDocument();
  });

  it('renderiza a variação Horizontal para listas editoriais', () => {
    render(<ArticleHorizontalCard article={artigoMock} />);

    expect(screen.getByRole('heading', { level: 3, name: artigoMock.title })).toBeInTheDocument();
    expect(screen.getByText(artigoMock.author.name)).toBeInTheDocument();
  });

  it('renderiza a variação Compacta para barras laterais', () => {
    render(<ArticleCompactCard article={artigoMock} />);

    expect(screen.getByRole('heading', { level: 4, name: artigoMock.title })).toBeInTheDocument();
    expect(screen.getByText('6 min')).toBeInTheDocument();
  });

  it('despacha corretamente para cada variação através do orquestrador ArticleCard', () => {
    const { rerender } = render(<ArticleCard article={artigoMock} variant="hero" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

    rerender(<ArticleCard article={artigoMock} variant="horizontal" />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();

    rerender(<ArticleCard article={artigoMock} variant="compact" />);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();

    rerender(<ArticleCard article={artigoMock} variant="grid" />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });
});
