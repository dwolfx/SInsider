import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminKpiGrid } from '@/components/admin/AdminKpiGrid';

describe('Testes Unitários do Componente AdminKpiGrid', () => {
  it('renderiza os 4 cards de KPIs do painel com as métricas formatadas', () => {
    render(
      <AdminKpiGrid
        totalViews={154200}
        publishedCount={28}
        inReviewCount={4}
        activeAdsCount={6}
        usersCount={12}
      />
    );

    expect(screen.getByText('Audiência Total')).toBeInTheDocument();
    expect(screen.getByText('154.200')).toBeInTheDocument();

    expect(screen.getByText('Notícias Publicadas')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();

    expect(screen.getByText('Banners de Publicidade')).toBeInTheDocument();
    expect(screen.getByText('6 Ativos')).toBeInTheDocument();

    expect(screen.getByText('Equipe Redação')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
