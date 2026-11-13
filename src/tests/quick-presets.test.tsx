import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickPresets } from '@/components/admin/QuickPresets';

describe('Testes Unitários de Presets Editoriais Rápidos (QuickPresets)', () => {
  it('renderiza os 4 botões de presets editoriais rápidos', () => {
    const onSelect = vi.fn();
    render(<QuickPresets onSelectPreset={onSelect} />);

    expect(screen.getByText('Furo Urgente')).toBeInTheDocument();
    expect(screen.getByText('Coluna de Opinião')).toBeInTheDocument();
    expect(screen.getByText('Grande Entrevista')).toBeInTheDocument();
    expect(screen.getByText('Episódio de Podcast')).toBeInTheDocument();
  });

  it('dispara o callback com a chave do preset ao ser clicado', () => {
    const onSelect = vi.fn();
    render(<QuickPresets onSelectPreset={onSelect} />);

    fireEvent.click(screen.getByText('Furo Urgente'));
    expect(onSelect).toHaveBeenCalledWith('urgente');

    fireEvent.click(screen.getByText('Grande Entrevista'));
    expect(onSelect).toHaveBeenCalledWith('entrevista');
  });
});
