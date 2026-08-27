import { apiFetch } from '@/lib/api';
import type { ImportInput, ImportRecord } from '@/store/useImportsStore';

/** Chamadas REST do histórico de importações (`/imports`). */
export const importsApi = {
  list: () => apiFetch<ImportRecord[]>('/imports'),
  create: (input: ImportInput) =>
    apiFetch<ImportRecord>('/imports', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/imports/${id}`, { method: 'DELETE' }),
};
