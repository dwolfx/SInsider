import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PublishingSettingsCard } from '@/components/admin/PublishingSettingsCard';

describe('Testes Unitários de Configurações de Publicação (PublishingSettingsCard)', () => {
  it('renderiza o seletor de status e trata alterações de status corretamente', () => {
    const setStatus = vi.fn();
    render(
      <PublishingSettingsCard
        status="draft"
        setStatus={setStatus}
        isFeatured={false}
        setIsFeatured={vi.fn()}
        isBreaking={false}
        setIsBreaking={vi.fn()}
        isSponsored={false}
        setIsSponsored={vi.fn()}
        isSubmitting={false}
        success={false}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('draft');

    fireEvent.change(select, { target: { value: 'published' } });
    expect(setStatus).toHaveBeenCalledWith('published');
  });

  it('permite alternar os checkboxes de destaque, urgente e patrocinado', () => {
    const setIsFeatured = vi.fn();
    const setIsBreaking = vi.fn();
    const setIsSponsored = vi.fn();

    render(
      <PublishingSettingsCard
        status="published"
        setStatus={vi.fn()}
        isFeatured={false}
        setIsFeatured={setIsFeatured}
        isBreaking={false}
        setIsBreaking={setIsBreaking}
        isSponsored={false}
        setIsSponsored={setIsSponsored}
        isSubmitting={false}
        success={false}
      />
    );

    const featuredCheckbox = screen.getByRole('checkbox', { name: /destaque na capa/i });
    fireEvent.click(featuredCheckbox);
    expect(setIsFeatured).toHaveBeenCalledWith(true);

    const breakingCheckbox = screen.getByRole('checkbox', { name: /furo urgente/i });
    fireEvent.click(breakingCheckbox);
    expect(setIsBreaking).toHaveBeenCalledWith(true);

    const sponsoredCheckbox = screen.getByRole('checkbox', { name: /publieditorial/i });
    fireEvent.click(sponsoredCheckbox);
    expect(setIsSponsored).toHaveBeenCalledWith(true);
  });

  it('exibe o texto correto no botão de ação quando o status for published', () => {
    render(
      <PublishingSettingsCard
        status="published"
        setStatus={vi.fn()}
        isFeatured={false}
        setIsFeatured={vi.fn()}
        isBreaking={false}
        setIsBreaking={vi.fn()}
        isSponsored={false}
        setIsSponsored={vi.fn()}
        isSubmitting={false}
        success={false}
      />
    );

    expect(screen.getByRole('button', { name: /publicar notícia/i })).toBeInTheDocument();
  });

  it('exibe o botão desabilitado quando isSubmitting for verdadeiro', () => {
    render(
      <PublishingSettingsCard
        status="draft"
        setStatus={vi.fn()}
        isFeatured={false}
        setIsFeatured={vi.fn()}
        isBreaking={false}
        setIsBreaking={vi.fn()}
        isSponsored={false}
        setIsSponsored={vi.fn()}
        isSubmitting={true}
        success={false}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
