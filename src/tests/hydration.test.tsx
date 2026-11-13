import React, { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import ReactDOMServer from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { Header } from '@/components/layout/Header';
import { LivePageRenderer } from '@/components/LivePageRenderer';
import { ArticleCard } from '@/components/editorial/ArticleCard';
import { MOCK_ARTICLES } from '@/lib/mock-data';

describe('Testes de Paridade e Prevenção de Erros de Hidratação SSR', () => {
  /**
   * Helper que simula o ciclo completo do Next.js: SSR -> DOM do Navegador -> Hidratação do Cliente
   */
  async function testHydration(component: React.ReactElement, mutateDomBeforeHydrate?: (container: HTMLElement) => void) {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const container = document.createElement('div');
    document.body.appendChild(container);

    try {
      // 1. Renderização no servidor para string estática HTML
      const ssrHtml = ReactDOMServer.renderToString(component);
      container.innerHTML = ssrHtml;

      // 2. Simula scripts externos ou extensões manipulando o DOM antes da hidratação do React
      if (mutateDomBeforeHydrate) {
        mutateDomBeforeHydrate(container);
      }

      // 3. Hidratação no cliente via React
      await act(async () => {
        hydrateRoot(container, component);
      });

      // Filtra por assinaturas de erro de hidratação do React
      const hydrationErrors = consoleErrorSpy.mock.calls
        .flat()
        .filter((msg) =>
          typeof msg === 'string' &&
          (msg.includes('Hydration failed') ||
           msg.includes('did not match') ||
           msg.includes('server-rendered HTML'))
        );

      return {
        hasHydrationError: hydrationErrors.length > 0,
        errors: hydrationErrors,
      };
    } finally {
      document.body.removeChild(container);
      consoleErrorSpy.mockRestore();
    }
  }

  it('hidrata o componente Header sem erros de incompatibilidade de SSR', async () => {
    const result = await testHydration(<Header />);
    expect(result.hasHydrationError).toBe(false);
  });

  it('trata com segurança scripts externos alterando --si-header-altura-fluxo sem disparar erro de hidratação (suppressHydrationWarning)', async () => {
    const result = await testHydration(<Header />, (container) => {
      const espaco = container.querySelector('.si-header__espaco') as HTMLElement | null;
      if (espaco) {
        // Simula o script de navegação calculando a altura e inserindo estilo antes da hidratação
        espaco.style.setProperty('--si-header-altura-fluxo', '98px');
      }
    });

    expect(result.hasHydrationError).toBe(false);
  });

  it('hidrata o componente LivePageRenderer de forma transparente', async () => {
    const result = await testHydration(<LivePageRenderer />);
    expect(result.hasHydrationError).toBe(false);
  });

  it('hidrata o componente ArticleCard sem divergência de estrutura', async () => {
    const result = await testHydration(<ArticleCard article={MOCK_ARTICLES[0]} variant="hero" />);
    expect(result.hasHydrationError).toBe(false);
  });
});
