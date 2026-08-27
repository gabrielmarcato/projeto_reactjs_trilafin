import type { CreateUserInput, User } from '../types';

/**
 * API fake em memória.
 *
 * Simula um backend com latência para que os estados de loading/erro das
 * telas de exemplo sejam observáveis. Em um projeto real, troque estas
 * funções por chamadas `fetch`/`axios` mantendo a MESMA assinatura — os
 * hooks de query/mutation não precisam mudar.
 */
let users: User[] = [
  { id: '1', name: 'Ana Souza', email: 'ana@trilafin.dev', role: 'admin' },
  { id: '2', name: 'Bruno Lima', email: 'bruno@trilafin.dev', role: 'editor' },
  { id: '3', name: 'Carla Dias', email: 'carla@trilafin.dev', role: 'viewer' },
];

const LATENCY_MS = 600;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export async function fetchUsers(): Promise<User[]> {
  return delay([...users]);
}

export async function fetchUser(id: string): Promise<User> {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new Error(`Usuário ${id} não encontrado`);
  }
  return delay({ ...user });
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const created: User = { id: crypto.randomUUID(), ...input };
  users = [...users, created];
  return delay(created);
}
