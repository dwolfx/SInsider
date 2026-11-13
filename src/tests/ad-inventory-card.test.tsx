import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdInventoryCard } from '@/components/admin/AdInventoryCard';
import { MOCK_ADS } from '@/lib/mock-data';

describe('Testes Unitários do Componente AdInventoryCard', () => {
  it('renderiza os detalhes do anúncio, posição, anunciante, impressões, cliques e taxa de cliques (CTR)', () => {
    const ad = MOCK_ADS[0];
    render(<AdInventoryCard ad={ad} />);

    expect(screen.getByText(ad.placement)).toBeInTheDocument();
    expect(screen.getByText(ad.name)).toBeInTheDocument();
    expect(screen.getByText(ad.advertiser)).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    expect(screen.getByText(ad.views.toLocaleString('pt-BR'))).toBeInTheDocument();
    expect(screen.getByText(ad.clicks.toLocaleString('pt-BR'))).toBeInTheDocument();

    const expectedCtr = ((ad.clicks / ad.views) * 100).toFixed(2);
    expect(screen.getByText(`${expectedCtr}%`)).toBeInTheDocument();
  });
});
