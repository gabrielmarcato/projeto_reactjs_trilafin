import { apiFetch } from '@/lib/api';
import type { Account, AccountInput } from '@/store/useAccountsStore';

/** Chamadas REST de contas (`/accounts`). */
export const accountsApi = {
  list: () => apiFetch<Account[]>('/accounts'),
  create: (input: AccountInput) =>
    apiFetch<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  update: (id: string, input: AccountInput) =>
    apiFetch<Account>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/accounts/${id}`, { method: 'DELETE' }),
};
