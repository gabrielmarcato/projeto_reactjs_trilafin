import { create } from 'zustand';
import type { User } from '@/features/users/types';

/**
 * Store global de UI da feature de usuários (exemplo de Zustand).
 *
 * Guarda estado de interface/efêmero que NÃO pertence ao cache do servidor:
 * o termo de busca da listagem e o último usuário criado (para exibir um
 * banner de confirmação). Dados vindos do backend continuam no TanStack
 * Query — não duplique-os aqui.
 */
interface UsersUiState {
  searchTerm: string;
  lastCreatedUser: User | null;
  setSearchTerm: (term: string) => void;
  setLastCreatedUser: (user: User | null) => void;
  reset: () => void;
}

export const useUsersUiStore = create<UsersUiState>((set) => ({
  searchTerm: '',
  lastCreatedUser: null,
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setLastCreatedUser: (lastCreatedUser) => set({ lastCreatedUser }),
  reset: () => set({ searchTerm: '', lastCreatedUser: null }),
}));
