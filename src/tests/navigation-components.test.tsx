import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrimaryNav } from '@/components/layout/PrimaryNav';
import { SecondaryNav } from '@/components/layout/SecondaryNav';
import { SearchPanel } from '@/components/layout/SearchPanel';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { InstitutionalNav } from '@/components/layout/InstitutionalNav';
import { SocialLinks } from '@/components/layout/SocialLinks';

describe('Testes de Componentes Modulares de Navegação e Layout', () => {
  describe('Componente PrimaryNav (Editorias Principais)', () => {
    it('renderiza as editorias principais com seus submenus aninhados', () => {
      render(<PrimaryNav />);

      expect(screen.getByRole('link', { name: 'Economia' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Negócios' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Farmacêuticas' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Política' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Regulatório' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Judiciário' })).toBeInTheDocument();
    });

    it('dispara o callback onLinkClick quando um link de navegação é acionado', () => {
      const handleClick = vi.fn();
      render(<PrimaryNav onLinkClick={handleClick} />);

      fireEvent.click(screen.getByRole('link', { name: 'Economia' }));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Componente SecondaryNav (Formatos e Seções Secundárias)', () => {
    it('renderiza os formatos e seções editoriais secundárias', () => {
      render(<SecondaryNav />);

      expect(screen.getByRole('link', { name: 'Opinião' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Cúpula' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Newsletter' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Podcasts' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Tecnologia' })).toBeInTheDocument();
    });
  });

  describe('Componente SearchPanel (Painel Retrátil de Busca)', () => {
    it('retorna nulo quando a propriedade isOpen for falsa', () => {
      const { container } = render(
        <SearchPanel isOpen={false} searchQuery="" onSearchChange={vi.fn()} onClose={vi.fn()} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renderiza o campo de busca e aciona os eventos de digitação e fechamento quando aberto', () => {
      const handleChange = vi.fn();
      const handleClose = vi.fn();

      render(
        <SearchPanel
          isOpen={true}
          searchQuery="ANS"
          onSearchChange={handleChange}
          onClose={handleClose}
        />
      );

      const input = screen.getByPlaceholderText(/buscar notícias/i);
      expect(input).toHaveValue('ANS');

      fireEvent.change(input, { target: { value: 'Hospitais' } });
      expect(handleChange).toHaveBeenCalled();

      const closeBtn = screen.getByLabelText('Fechar busca');
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Componente MobileDrawer (Gaveta de Navegação Mobile)', () => {
    it('retorna nulo quando a propriedade isOpen for falsa', () => {
      const { container } = render(<MobileDrawer isOpen={false} onClose={vi.fn()} />);
      expect(container.firstChild).toBeNull();
    });

    it('renderiza a navegação mobile completa e trata as ações de fechamento', () => {
      const handleClose = vi.fn();
      render(<MobileDrawer isOpen={true} onClose={handleClose} />);

      expect(screen.getByText('Editorias')).toBeInTheDocument();
      expect(screen.getByText('Seções & Formatos')).toBeInTheDocument();
      expect(screen.getByText('Acessar Painel da Redação')).toBeInTheDocument();

      const closeBtn = screen.getByLabelText('Fechar menu');
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Componente InstitutionalNav (Links Institucionais)', () => {
    it('renderiza todos os links institucionais e regulatórios padrão', () => {
      render(<InstitutionalNav />);

      expect(screen.getByRole('link', { name: 'Quem Somos' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Nossa Missão' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Propósito Editorial' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Independência Editorial' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Termos de Uso' })).toBeInTheDocument();
    });
  });

  describe('Componente SocialLinks (Redes Sociais e Cópia de Link)', () => {
    it('renderiza os ícones das redes sociais e trata a cópia do link do site', () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<SocialLinks siteUrl="https://saudeinsider.com.br/" />);

      expect(screen.getByTitle('LinkedIn')).toBeInTheDocument();
      expect(screen.getByTitle('Instagram')).toBeInTheDocument();
      expect(screen.getByTitle('X (Twitter)')).toBeInTheDocument();
      expect(screen.getByTitle('YouTube')).toBeInTheDocument();

      const copyBtn = screen.getByTitle('Copiar link do site');
      fireEvent.click(copyBtn);
      expect(writeTextMock).toHaveBeenCalledWith('https://saudeinsider.com.br/');
    });
  });
});
