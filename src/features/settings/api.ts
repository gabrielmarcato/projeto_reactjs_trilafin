import { apiFetch } from '@/lib/api';
import type { CollectionKey, SettingsItem } from '@/store/useSettingsStore';

/** Chamadas REST das taxonomias (`/settings/:collection`). */
export const settingsApi = {
  list: (collection: CollectionKey) =>
    apiFetch<SettingsItem[]>(`/settings/${collection}`),
  create: (collection: CollectionKey, name: string) =>
    apiFetch<SettingsItem>(`/settings/${collection}`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  update: (collection: CollectionKey, id: string, name: string) =>
    apiFetch<SettingsItem>(`/settings/${collection}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
  remove: (collection: CollectionKey, id: string) =>
    apiFetch<void>(`/settings/${collection}/${id}`, { method: 'DELETE' }),
};
