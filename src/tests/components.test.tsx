import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { AdSlot } from '@/components/ads/AdSlot';
import { RoleBadge } from '@/components/admin/RoleBadge';

describe('Testes Unitários de Componentes de Interface e Editorial (UI)', () => {
  describe('Componente Button', () => {
    it('renderiza o botão corretamente e dispara o evento de clique', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Publicar Artigo</Button>);

      const button = screen.getByRole('button', { name: /publicar artigo/i });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renderiza o botão no estado desabilitado quando isLoading for verdadeiro', () => {
      render(<Button isLoading>Salvando...</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByText(/salvando/i)).toBeInTheDocument();
    });

    it('aplica corretamente as variações visuais e tamanhos', () => {
      const { rerender } = render(<Button variant="danger" size="sm">Deletar</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-red-600');

      rerender(<Button variant="outline" size="lg">Outline Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('border-slate-300');

      rerender(<Button variant="ghost">Ghost Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('hover:bg-slate-100');

      rerender(<Button variant="secondary">Secondary Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-slate-900');
    });
  });

  describe('Componente Badge', () => {
    it('renderiza o badge com os estilos da variação selecionada', () => {
      const { rerender } = render(<Badge variant="danger">Urgente</Badge>);
      expect(screen.getByText(/urgente/i)).toHaveClass('bg-red-50 text-red-700');

      rerender(<Badge variant="brand">Economia</Badge>);
      expect(screen.getByText(/economia/i)).toHaveClass('bg-teal-50 text-teal-800');

      rerender(<Badge variant="warning">Aviso</Badge>);
      expect(screen.getByText(/aviso/i)).toHaveClass('bg-amber-50');

      rerender(<Badge variant="success">Aprovado</Badge>);
      expect(screen.getByText(/aprovado/i)).toHaveClass('bg-emerald-50');

      rerender(<Badge variant="outline">Contorno</Badge>);
      expect(screen.getByText(/contorno/i)).toHaveClass('border-slate-300');

      rerender(<Badge variant="secondary">Secundário</Badge>);
      expect(screen.getByText(/secundário/i)).toHaveClass('bg-slate-100');
    });
  });

  describe('Família de Componentes Card', () => {
    it('renderiza o Card com cabeçalho, título e conteúdo estruturado', () => {
      render(
        <Card hoverEffect className="custom-card-class">
          <CardHeader className="custom-header">
            <CardTitle>Título do Card</CardTitle>
          </CardHeader>
          <CardContent>Conteúdo informativo do card</CardContent>
        </Card>
      );

      expect(screen.getByText('Título do Card')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo informativo do card')).toBeInTheDocument();
    });
  });

  describe('Componentes Input e Textarea', () => {
    it('renderiza o Input com rótulo, placeholder e texto de auxílio', () => {
      render(
        <Input
          id="email-input"
          label="Seu Email Corporativo"
          placeholder="exemplo@saudeinsider.com.br"
          helperText="Digite um email válido."
        />
      );

      expect(screen.getByLabelText(/seu email corporativo/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('exemplo@saudeinsider.com.br')).toBeInTheDocument();
      expect(screen.getByText('Digite um email válido.')).toBeInTheDocument();
    });

    it('renderiza o Input com mensagem de erro no lugar do texto de auxílio', () => {
      render(
        <Input
          name="username"
          error="Campo obrigatório"
          helperText="Texto auxiliar omitido no erro"
        />
      );

      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
      expect(screen.queryByText('Texto auxiliar omitido no erro')).not.toBeInTheDocument();
    });

    it('renderiza o Textarea com rótulo, linhas configuradas e trata eventos de digitação', () => {
      const handleChange = vi.fn();
      render(
        <Textarea
          id="lead-textarea"
          label="Lead da Notícia"
          rows={3}
          onChange={handleChange}
        />
      );

      const textarea = screen.getByLabelText(/lead da notícia/i);
      expect(textarea).toBeInTheDocument();
      fireEvent.change(textarea, { target: { value: 'Texto de teste' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('renderiza o Textarea no estado de erro', () => {
      render(<Textarea name="desc" error="Erro na descrição" />);
      expect(screen.getByText('Erro na descrição')).toBeInTheDocument();
    });
  });

  describe('Componente RoleBadge', () => {
    it('renderiza os rótulos e estilos corretos para cada papel de usuário', () => {
      const { rerender } = render(<RoleBadge role="SUPER_ADMIN" />);
      expect(screen.getByText(/super admin/i)).toBeInTheDocument();

      rerender(<RoleBadge role="EDITOR_CHIEF" />);
      expect(screen.getByText(/editor-chefe/i)).toBeInTheDocument();

      rerender(<RoleBadge role="JOURNALIST" />);
      expect(screen.getByText(/repórter/i)).toBeInTheDocument();

      rerender(<RoleBadge role="COMMERCIAL" />);
      expect(screen.getByText(/comercial/i)).toBeInTheDocument();

      rerender(<RoleBadge role={'OTHER' as any} />);
      expect(screen.getByText('OTHER')).toBeInTheDocument();
    });
  });

  describe('Componente AdSlot', () => {
    it('renderiza o banner institucional padrão quando AdUnit for nulo ou inativo', () => {
      render(<AdSlot placement="header_billboard" adUnit={null} />);
      expect(
        screen.getByText(/conecte sua marca aos líderes que decidem os rumos da saúde/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /anuncie aqui/i })).toBeInTheDocument();
    });

    it('renderiza a imagem do anúncio ativo e o rótulo de patrocinador quando AdUnit for ativo', () => {
      const mockAd = {
        id: 'ad-test',
        name: 'Banner Hospital Albert Einstein',
        placement: 'header_billboard' as const,
        advertiser: 'Hospital Israelita Albert Einstein',
        imageUrl: 'https://example.com/banner.jpg',
        targetUrl: 'https://einstein.br',
        type: 'image' as const,
        active: true,
        views: 100,
        clicks: 10,
      };

      render(<AdSlot placement="header_billboard" adUnit={mockAd} />);
      expect(screen.getByText(/Hospital Israelita Albert Einstein/i)).toBeInTheDocument();
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://einstein.br');
    });

    it('renderiza placeholder em texto quando o anúncio não possui imagem definida', () => {
      const mockHtmlAd = {
        id: 'ad-html',
        name: 'Script Tag Ad',
        placement: 'sidebar_mpu' as const,
        advertiser: 'Google AdSense',
        htmlContent: '<div data-testid="raw-ad-html">Anúncio HTML Injetado</div>',
        type: 'html' as const,
        active: true,
        views: 50,
        clicks: 2,
      };

      render(<AdSlot placement="sidebar_mpu" adUnit={mockHtmlAd} />);
      expect(screen.getByText('Script Tag Ad')).toBeInTheDocument();
    });
  });
});
