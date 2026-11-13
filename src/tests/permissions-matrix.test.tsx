import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PermissionsMatrix } from '@/components/admin/PermissionsMatrix';

describe('Testes Unitários da Matriz de Permissões (PermissionsMatrix)', () => {
  it('renderiza os badges de permissões autorizadas e bloqueadas de acordo com as permissões fornecidas', () => {
    render(
      <PermissionsMatrix
        permissions={{
          canCreateArticle: true,
          canEditAnyArticle: false,
          canPublishArticle: true,
          canDeleteArticle: false,
          canManageUsers: false,
          canManageAds: true,
          canViewAnalytics: false,
        }}
      />
    );

    expect(screen.getByText('Criar Artigo')).toBeInTheDocument();
    expect(screen.getByText('Publicar no Ar')).toBeInTheDocument();
    expect(screen.getByText('Excluir Artigo')).toBeInTheDocument();
    expect(screen.getByText('Gerir Publicidade')).toBeInTheDocument();
    expect(screen.getByText('Gerir Usuários')).toBeInTheDocument();
    expect(screen.getByText('Ver Analytics')).toBeInTheDocument();

    const permitidos = screen.getAllByText(/Permitido/);
    expect(permitidos).toHaveLength(3);

    const bloqueados = screen.getAllByText(/Bloqueado/);
    expect(bloqueados).toHaveLength(3);
  });
});
