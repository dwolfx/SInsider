import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleCard } from '@/components/editorial/ArticleCard';
import { EditorialTicker } from '@/components/editorial/EditorialTicker';
import { ShareButtons } from '@/components/editorial/ShareButtons';
import { ShareRail } from '@/components/editorial/ShareRail';
import { MOCK_ARTICLES } from '@/lib/mock-data';

describe('Testes de Componentes Editoriais (Unitários e de Integração)', () => {
  const sampleArticle = MOCK_ARTICLES[0];
  const breakingArticle = {
    ...sampleArticle,
    isBreaking: true,
  };

  describe('Componente ArticleCard', () => {
    it('renderiza a variação Hero com kicker, badges, autor e métricas', () => {
      render(<ArticleCard article={breakingArticle} variant="hero" />);

      expect(screen.getByText(breakingArticle.kicker)).toBeInTheDocument();
      expect(screen.getByText(/urgente/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(breakingArticle.title) })).toBeInTheDocument();
      expect(screen.getByText(breakingArticle.author.name)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${breakingArticle.readingTimeMinutes} min de leitura`))).toBeInTheDocument();
      const links = screen.getAllByRole('link', { name: new RegExp(breakingArticle.title) });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute('href', `/noticia/${breakingArticle.slug}`);
    });

    it('renderiza a variação Grid corretamente como padrão', () => {
      render(<ArticleCard article={sampleArticle} variant="grid" />);

      expect(screen.getByText(sampleArticle.kicker)).toBeInTheDocument();
      expect(screen.getByText(sampleArticle.title)).toBeInTheDocument();
      expect(screen.getByText(sampleArticle.author.name)).toBeInTheDocument();
      expect(screen.getByText(sampleArticle.category.name)).toBeInTheDocument();
    });

    it('renderiza a variação Horizontal para listas', () => {
      render(<ArticleCard article={sampleArticle} variant="horizontal" />);

      expect(screen.getByText(sampleArticle.kicker)).toBeInTheDocument();
      expect(screen.getByText(sampleArticle.title)).toBeInTheDocument();
      expect(screen.getByText(sampleArticle.author.name)).toBeInTheDocument();
    });

    it('renderiza a variação Compacta para barras laterais', () => {
      render(<ArticleCard article={sampleArticle} variant="compact" />);

      expect(screen.getByText(sampleArticle.kicker)).toBeInTheDocument();
      expect(screen.getByText(sampleArticle.title)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${sampleArticle.readingTimeMinutes} min`))).toBeInTheDocument();
    });
  });

  describe('Componente EditorialTicker', () => {
    it('retorna nulo quando a notícia for nula', () => {
      const { container } = render(<EditorialTicker article={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('renderiza a barra de giro de notícias com título e link do kicker quando o artigo for fornecido', () => {
      render(<EditorialTicker article={sampleArticle} />);

      expect(screen.getByText('Giro Insider')).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`\\[${sampleArticle.kicker}\\]`))).toBeInTheDocument();
      expect(screen.getByText(sampleArticle.title)).toBeInTheDocument();
      expect(screen.getByText('ANS & Regulatório')).toBeInTheDocument();
    });
  });

  describe('Componente ShareButtons', () => {
    it('renderiza os links sociais de compartilhamento com URLs devidamente codificadas', () => {
      render(<ShareButtons title="Nova regulação na saúde" />);

      const whatsappLink = screen.getByLabelText('Compartilhar no WhatsApp');
      expect(whatsappLink).toHaveAttribute(
        'href',
        expect.stringContaining('api.whatsapp.com')
      );
      expect(whatsappLink.getAttribute('href')).toContain(
        encodeURIComponent('Nova regulação na saúde')
      );

      const linkedinLink = screen.getByLabelText('Compartilhar no LinkedIn');
      expect(linkedinLink).toHaveAttribute(
        'href',
        expect.stringContaining('linkedin.com')
      );

      const twitterLink = screen.getByLabelText('Compartilhar no X (Twitter)');
      expect(twitterLink).toHaveAttribute('href', expect.stringContaining('twitter.com'));
    });

    it('copia o link para a área de transferência e exibe confirmação visual ao clicar', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<ShareButtons title="Título Notícia" />);

      const copyButton = screen.getByRole('button', { name: /copiar link/i });
      expect(copyButton).toBeInTheDocument();

      fireEvent.click(copyButton);

      expect(writeTextMock).toHaveBeenCalled();
      expect(screen.getByText(/copiado!/i)).toBeInTheDocument();
    });
  });

  describe('Componente ShareRail (Trilho Flutuante de Compartilhamento Social)', () => {
    it('renderiza todas as ações oficiais: LinkedIn, Instagram, WhatsApp, Telegram, X, E-mail e Copiar Link', () => {
      render(
        <ShareRail
          title="Nova regulamentação na saúde suplementar"
          url="/noticia/nova-regulamentacao"
        />
      );

      // 1. LinkedIn
      const linkedin = screen.getByLabelText('Compartilhar no LinkedIn');
      expect(linkedin).toHaveAttribute('href', expect.stringContaining('linkedin.com/sharing/share-offsite'));

      // 2. Instagram
      const instagram = screen.getByLabelText('Perfil do Saúde Insider no Instagram');
      expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/saude_insider/');

      // 3. WhatsApp
      const whatsapp = screen.getByLabelText('Compartilhar no WhatsApp');
      expect(whatsapp).toHaveAttribute('href', expect.stringContaining('api.whatsapp.com/send'));

      // 4. Telegram
      const telegram = screen.getByLabelText('Compartilhar no Telegram');
      expect(telegram).toHaveAttribute('href', expect.stringContaining('t.me/share/url'));

      // 5. X / Twitter
      const twitter = screen.getByLabelText('Compartilhar no X (Twitter)');
      expect(twitter).toHaveAttribute('href', expect.stringContaining('twitter.com/intent/tweet'));

      // 6. E-mail
      const email = screen.getByLabelText('Compartilhar no E-mail');
      expect(email).toHaveAttribute('href', expect.stringContaining('mailto:'));

      // 7. Copiar Link
      const copyBtn = screen.getByRole('button', { name: /copiar link da notícia/i });
      expect(copyBtn).toBeInTheDocument();
    });

    it('copia a URL para a área de transferência e altera o estado do botão para Copiado', () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText: writeTextMock } });

      render(
        <ShareRail
          title="Título Notícia"
          url="/noticia/teste-copiar"
        />
      );

      const copyBtn = screen.getByRole('button', { name: /copiar link da notícia/i });
      fireEvent.click(copyBtn);

      expect(writeTextMock).toHaveBeenCalledWith('https://saudeinsider.com.br/noticia/teste-copiar');
      expect(screen.getByRole('button', { name: /link copiado!/i })).toBeInTheDocument();
    });
  });
});
