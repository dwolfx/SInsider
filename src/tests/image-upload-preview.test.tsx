import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUploadPreview } from '@/components/admin/ImageUploadPreview';

describe('Testes Unitários de Upload e Pré-visualização de Imagem (ImageUploadPreview)', () => {
  it('renderiza o campo de imagem e trata as alterações de URL', () => {
    const setCoverImage = vi.fn();
    render(
      <ImageUploadPreview
        coverImage="https://example.com/capa.jpg"
        setCoverImage={setCoverImage}
      />
    );

    const input = screen.getByLabelText(/URL da Imagem \*/i);
    expect(input).toHaveValue('https://example.com/capa.jpg');

    fireEvent.change(input, { target: { value: 'https://example.com/nova-capa.jpg' } });
    expect(setCoverImage).toHaveBeenCalledWith('https://example.com/nova-capa.jpg');
  });

  it('exibe a pré-visualização da imagem e esconde o elemento caso ocorra erro de carregamento', () => {
    render(
      <ImageUploadPreview
        coverImage="https://example.com/capa-invalida.jpg"
        setCoverImage={vi.fn()}
      />
    );

    const img = screen.getByAltText('Preview');
    expect(img).toBeInTheDocument();

    fireEvent.error(img);
    expect(img).toHaveStyle({ display: 'none' });
  });
});
