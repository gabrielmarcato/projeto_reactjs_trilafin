import { apiFetch } from '@/lib/api';
import type { Profile } from '@/store/useProfileStore';

/** Chamadas REST do perfil (`/profile`). */
export const profileApi = {
  get: () => apiFetch<Profile>('/profile'),
  update: (profile: Profile) =>
    apiFetch<Profile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),
};
