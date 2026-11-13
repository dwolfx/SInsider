import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ShareRail } from '@/components/editorial/ShareRail';
import { ShareRailCopyButton } from '@/components/editorial/ShareRailCopyButton';
import { ShareRailSocialLinks } from '@/components/editorial/ShareRailSocialLinks';

describe('Trilho de Compartilhamento Social (ShareRail)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza os links sociais com URLs devidamente codificadas', () => {
    render(
      <ShareRailSocialLinks
        encodedUrl="https%3A%2F%2Fsaudeinsider.com.br%2Fnoticia"
        encodedTitle="Titulo%20de%20Teste"
      />
    );

    expect(screen.getByLabelText('Compartilhar no LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Perfil do Saúde Insider no Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Compartilhar no WhatsApp')).toBeInTheDocument();
    expect(screen.getByLabelText('Compartilhar no Telegram')).toBeInTheDocument();
    expect(screen.getByLabelText('Compartilhar no X (Twitter)')).toBeInTheDocument();
    expect(screen.getByLabelText('Compartilhar no E-mail')).toBeInTheDocument();
  });

  it('copia a URL para a área de transferência e altera o estado do botão', async () => {
    vi.useFakeTimers();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ShareRailCopyButton fullUrl="https://saudeinsider.com.br/artigo-exemplo" />);

    const copyBtn = screen.getByLabelText('Copiar link da notícia');
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('https://saudeinsider.com.br/artigo-exemplo');
    expect(screen.getByLabelText('Link copiado!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2600);
    });

    expect(screen.getByLabelText('Copiar link da notícia')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('renderiza o componente completo ShareRail compondo todos os elementos', () => {
    render(<ShareRail title="Título Exemplo" url="/noticia/exemplo" />);

    expect(screen.getByLabelText('Compartilhar no LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Copiar link da notícia')).toBeInTheDocument();
  });
});
