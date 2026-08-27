import { create } from 'zustand';

/** Dados do usuário/perfil da conta. */
export interface Profile {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  birthDate?: string;
  // Endereço
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  uf?: string;
  // Preferências financeiras
  defaultCurrency?: string;
  /** Dia de fechamento do mês financeiro (1–31). */
  closingDay?: number;
  monthlyIncome?: number;
}

interface ProfileState {
  profile: Profile;
  updateProfile: (profile: Profile) => void;
}

/** Perfil inicial (placeholder — o avatar "MR" vem daqui). */
export const initialProfile: Profile = {
  name: 'Marina Ribeiro',
  email: 'marina@trilhafin.dev',
  phone: '(11) 99999-0000',
  city: 'São Paulo',
  uf: 'SP',
  defaultCurrency: 'BRL — Real',
  closingDay: 1,
};

/**
 * Store do perfil do usuário (exemplo de Zustand). Alimenta o avatar/menu do
 * topo e o modal de Conta. Em memória por enquanto.
 */
export const useProfileStore = create<ProfileState>((set) => ({
  profile: initialProfile,
  updateProfile: (profile) => set({ profile }),
}));

/** Iniciais para o avatar, a partir do nome ("Marina Ribeiro" → "MR"). */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase() || 'U';
}
