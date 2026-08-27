import { create } from 'zustand';
import { loginRequest, setAuthToken } from '@/lib/api';

const TOKEN_KEY = 'trilhafin.token';

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// Restaura o token salvo (se houver) já na carga do módulo, para que o
// `apiFetch` o use e a sessão sobreviva ao F5.
const savedToken = readToken();
if (savedToken) setAuthToken(savedToken);

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  /** Autentica contra a API (`POST /auth/login`). Credenciais demo: teste/teste. */
  login: (user: string, password: string) => Promise<boolean>;
  logout: () => void;
}

/**
 * Autenticação integrada ao backend. O token JWT é guardado no `localStorage`,
 * então recarregar a página mantém a sessão. As rotas da casca exigem
 * `isAuthenticated`; senão, redirecionam para /login.
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: Boolean(savedToken),
  token: savedToken,
  login: async (user, password) => {
    try {
      const { token } = await loginRequest(user.trim(), password);
      setAuthToken(token);
      try {
        localStorage.setItem(TOKEN_KEY, token);
      } catch {
        /* storage indisponível */
      }
      set({ token, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },
  logout: () => {
    setAuthToken(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage indisponível */
    }
    set({ token: null, isAuthenticated: false });
  },
}));
