/**
 * Cliente HTTP do front para a API do Trilha.Fin.
 *
 * A URL base vem de `VITE_API_URL` (padrão: http://localhost:3333). O token
 * JWT é guardado em memória e enviado no header `Authorization` das chamadas.
 */
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3333';

let authToken: string | null = null;

/** Define (ou limpa) o token usado nas próximas requisições. */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** `fetch` tipado com JSON + token. Lança `ApiError` em respostas não-ok. */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      // Só declara JSON quando há corpo. Enviar `Content-Type: application/json`
      // numa requisição sem corpo (ex.: DELETE) faz o Fastify recusar o "JSON
      // vazio" com 400 — o que impedia as exclusões de persistir.
      ...(options.body != null ? { 'Content-Type': 'application/json' } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* corpo não-JSON */
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface LoginResponse {
  token: string;
  user: { username: string };
}

/** POST /auth/login — valida credenciais e devolve o token. */
export function loginRequest(
  username: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}
