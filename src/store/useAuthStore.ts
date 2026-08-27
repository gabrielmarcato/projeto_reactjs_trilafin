import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  /** Valida as credenciais (demo: teste/teste) e autentica se corretas. */
  login: (user: string, password: string) => boolean;
  logout: () => void;
}

/**
 * Autenticação (demo, em memória). Credenciais de teste: `teste` / `teste`.
 * As rotas da casca exigem `isAuthenticated`; senão, redirecionam para /login.
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: (user, password) => {
    const ok = user.trim() === 'teste' && password === 'teste';
    if (ok) set({ isAuthenticated: true });
    return ok;
  },
  logout: () => set({ isAuthenticated: false }),
}));
