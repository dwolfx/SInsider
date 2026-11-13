import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoogleSnippetPreview } from '@/components/admin/GoogleSnippetPreview';

describe('Testes Unitários do Simulador do Google SERP (GoogleSnippetPreview)', () => {
  it('renderiza o fallback padrão quando título e subtítulo estão vazios', () => {
    render(<GoogleSnippetPreview title="" subtitle="" />);

    expect(screen.getByText(/Título da notícia aparecerá aqui no Google/)).toBeInTheDocument();
    expect(
      screen.getByText(/A linha fina e meta-description da sua publicação aparecerá/i)
    ).toBeInTheDocument();
  });

  it('renderiza slug customizado, título formatado e descrição baseada nos campos fornecidos', () => {
    render(
      <GoogleSnippetPreview
        title="ANS anuncia novas diretrizes para operadoras"
        subtitle="Agência define critérios mais rigorosos para reajustes de planos coletivos."
      />
    );

    expect(screen.getByText(/ANS anuncia novas diretrizes para operadoras/)).toBeInTheDocument();
    expect(screen.getByText(/Agência define critérios mais rigorosos/)).toBeInTheDocument();
    expect(screen.getByText('ans-anuncia-novas-diretrizes-p')).toBeInTheDocument();
  });
});
