import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LivePageRenderer } from '@/components/LivePageRenderer';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe('Testes de Componentes de Layout (Unitários e de Integração)', () => {
  describe('Componente Header (Cabeçalho)', () => {
    it('renderiza a logo e os links de navegação primária e secundária', () => {
      render(<Header />);

      const logos = screen.getAllByAltText('Saúde Insider');
      expect(logos.length).toBeGreaterThan(0);

      expect(screen.getAllByRole('link', { name: 'Economia' })[0]).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: 'Negócios' })[0]).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: 'Política' })[0]).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: 'Regulatório' })[0]).toBeInTheDocument();
    });

    it('alterna a barra de busca ao clicar no botão de busca e aceita digitação', () => {
      render(<Header />);

      const searchBtn = screen.getByLabelText('Abrir busca');
      expect(screen.queryByPlaceholderText(/buscar notícias/i)).not.toBeInTheDocument();

      // Abre busca
      fireEvent.click(searchBtn);
      const searchInput = screen.getByPlaceholderText(/buscar notícias/i);
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'ANS resolução' } });
      expect(searchInput).toHaveValue('ANS resolução');

      // Fecha busca
      fireEvent.click(searchBtn);
      expect(screen.queryByPlaceholderText(/buscar notícias/i)).not.toBeInTheDocument();
    });

    it('abre a gaveta de navegação mobile e fecha ao clicar no botão de fechar', () => {
      render(<Header />);

      const menuBtn = screen.getByLabelText('Abrir menu');
      expect(screen.queryByText('Editorias')).not.toBeInTheDocument();

      // Abre gaveta
      fireEvent.click(menuBtn);
      expect(screen.getByText('Editorias')).toBeInTheDocument();
      expect(screen.getByText('Acessar Painel da Redação')).toBeInTheDocument();

      // Fecha pelo botão de fechar
      const closeButtons = screen.getAllByRole('button');
      const closeDrawerBtn = closeButtons.find((btn) => btn.querySelector('svg.lucide-x'));
      expect(closeDrawerBtn).toBeDefined();
      fireEvent.click(closeDrawerBtn!);

      expect(screen.queryByText('Acessar Painel da Redação')).not.toBeInTheDocument();
    });
  });

  describe('Componente Footer (Rodapé)', () => {
    it('renderiza os links institucionais e o aviso de direitos autorais', () => {
      render(<Footer />);

      expect(screen.getByText(new RegExp(`${new Date().getFullYear()} Saúde Insider`))).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Quem Somos' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Nossa Missão' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Política de Privacidade' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Termos de Uso' })).toBeInTheDocument();
    });

    it('dispara a cópia para a área de transferência ao clicar no botão de compartilhamento no rodapé', () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<Footer />);

      const shareBtn = screen.getByRole('button', { name: 'Copiar link do site' });
      fireEvent.click(shareBtn);

      expect(writeTextMock).toHaveBeenCalledWith('https://saudeinsider.com.br/');
    });
  });

  describe('Componente LivePageRenderer', () => {
    it('renderiza o corpo HTML sem erros e trata o estado de hidratação no cliente', () => {
      const { container } = render(<LivePageRenderer />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
