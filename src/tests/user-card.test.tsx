import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserCard } from '@/components/admin/UserCard';
import { MOCK_USERS } from '@/lib/mock-data';

describe('Testes Unitários do Card de Usuário (UserCard)', () => {
  it('renderiza os dados do usuário, avatar, badge de papel editorial e status ativo', () => {
    const user = MOCK_USERS[0];
    render(<UserCard user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(screen.getByText('Conta Ativa')).toBeInTheDocument();

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', user.avatarUrl);
    expect(avatar).toHaveAttribute('alt', user.name);

    expect(screen.getByText('Matriz de Permissões:')).toBeInTheDocument();
    expect(screen.getByText('Criar Artigo')).toBeInTheDocument();
  });
});
