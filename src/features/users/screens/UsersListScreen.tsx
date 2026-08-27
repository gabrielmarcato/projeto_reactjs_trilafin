import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/Button';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useUsersUiStore } from '@/store/useUsersUiStore';
import { useUsers } from '../hooks/useUsers';
import * as S from './UsersListScreen.styles';

/**
 * Tela de LISTAGEM (padrão de referência).
 *
 * Responsabilidades:
 * - Buscar dados via TanStack Query (`useUsers`);
 * - Tratar loading e erro explicitamente;
 * - Filtrar client-side usando o termo de busca guardado no Zustand;
 * - Navegar para a tela de formulário via TanStack Router (`<Link>`).
 */
export function UsersListScreen() {
  const { data: users, isPending, isError, error, refetch } = useUsers();

  const searchTerm = useUsersUiStore((state) => state.searchTerm);
  const setSearchTerm = useUsersUiStore((state) => state.setSearchTerm);
  const lastCreatedUser = useUsersUiStore((state) => state.lastCreatedUser);
  const debouncedTerm = useDebouncedValue(searchTerm);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const term = debouncedTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    );
  }, [users, debouncedTerm]);

  return (
    <S.Page>
      <S.Header>
        <S.Title>Usuários</S.Title>
        <Link to="/users/new">
          <Button as="span">Novo usuário</Button>
        </Link>
      </S.Header>

      {lastCreatedUser ? (
        <S.StateMessage>
          Usuário <strong>{lastCreatedUser.name}</strong> criado com sucesso.
        </S.StateMessage>
      ) : null}

      <S.SearchInput
        type="search"
        placeholder="Buscar por nome ou e-mail..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Buscar usuários"
      />

      {isPending ? (
        <S.StateMessage>Carregando usuários...</S.StateMessage>
      ) : isError ? (
        <S.StateMessage $variant="error">
          Falha ao carregar: {error.message}
          <br />
          <Button
            $variant="secondary"
            onClick={() => refetch()}
            style={{ marginTop: 12 }}
          >
            Tentar novamente
          </Button>
        </S.StateMessage>
      ) : filteredUsers.length === 0 ? (
        <S.StateMessage>Nenhum usuário encontrado.</S.StateMessage>
      ) : (
        <S.List>
          {filteredUsers.map((user) => (
            <S.Row key={user.id}>
              <S.RowInfo>
                <S.RowName>{user.name}</S.RowName>
                <S.RowEmail>{user.email}</S.RowEmail>
              </S.RowInfo>
              <S.RoleBadge>{user.role}</S.RoleBadge>
            </S.Row>
          ))}
        </S.List>
      )}
    </S.Page>
  );
}
