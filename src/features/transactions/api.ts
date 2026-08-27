import { apiFetch } from '@/lib/api';
import type {
  Transaction,
  TransactionInput,
} from '@/store/useTransactionsStore';

/** Chamadas REST de transações (`/transactions`). */
export const transactionsApi = {
  list: () => apiFetch<Transaction[]>('/transactions'),
  create: (input: TransactionInput) =>
    apiFetch<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  update: (id: string, input: TransactionInput) =>
    apiFetch<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/transactions/${id}`, { method: 'DELETE' }),
};
