import { create } from 'zustand';
import { accountsApi } from '@/features/accounts/api';

// Em testes, não fazemos chamadas de rede (o backend não sobe); as ações
// atualizam só o estado local. Em dev/produção, sincronizam com a API.
const ONLINE = import.meta.env.MODE !== 'test';

/** Tipos de conta suportados. */
export type AccountType = 'corrente' | 'poupanca' | 'investimento' | 'cartao';

/** Modelo de domínio de uma conta financeira. */
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  bank: string;
  agency?: string;
  number: string;
  /** Saldo atual (para cartão, representa a fatura em aberto). */
  balance: number;
  /** Titular da conta, quando diferente do usuário. */
  holder?: string;
  /** Se entra no cálculo de patrimônio líquido. */
  includeInNetWorth: boolean;
}

/** Dados de uma conta sem o `id` (usado ao criar/editar). */
export type AccountInput = Omit<Account, 'id'>;

interface AccountsState {
  accounts: Account[];
  /** Carrega as contas do backend (no boot da app). */
  hydrate: () => Promise<void>;
  addAccount: (input: AccountInput) => Account;
  updateAccount: (id: string, input: AccountInput) => void;
  removeAccount: (id: string) => void;
}

// Contas iniciais — refletem a sidebar do design de referência.
// Exportado para os testes poderem restaurar o estado inicial.
export const initialAccounts: Account[] = [
  {
    id: '1',
    name: 'Conta corrente',
    type: 'corrente',
    bank: 'Itaú',
    agency: '0001',
    number: '12345-6',
    balance: 18420.55,
    includeInNetWorth: true,
  },
  {
    id: '2',
    name: 'Reserva',
    type: 'poupanca',
    bank: 'CDB',
    number: '98765-4',
    balance: 62100.0,
    includeInNetWorth: true,
  },
  {
    id: '3',
    name: 'Cartão Nubank',
    type: 'cartao',
    bank: 'Fatura',
    number: '•••• 4821',
    balance: 3190.4,
    includeInNetWorth: true,
  },
  {
    id: '4',
    name: 'Investimentos',
    type: 'investimento',
    bank: 'XP',
    number: '00012-3',
    balance: 147890.12,
    includeInNetWorth: true,
  },
];

/**
 * Store global de contas (exemplo de Zustand com escrita).
 *
 * Guarda a lista de contas e permite adicionar novas. A sidebar lê daqui, então
 * cadastrar uma conta no modal reflete imediatamente na interface. Num projeto
 * real, `addAccount` dispararia uma mutation do TanStack Query.
 */
export const useAccountsStore = create<AccountsState>((set) => ({
  accounts: initialAccounts,
  hydrate: async () => {
    try {
      set({ accounts: await accountsApi.list() });
    } catch {
      /* offline: mantém o estado atual (seed) */
    }
  },
  addAccount: (input) => {
    // Atualização otimista + persistência (reconcilia com o id do servidor).
    const optimistic: Account = { id: crypto.randomUUID(), ...input };
    set((state) => ({ accounts: [...state.accounts, optimistic] }));
    if (ONLINE) {
      accountsApi
        .create(input)
        .then((created) =>
          set((state) => ({
            accounts: state.accounts.map((a) =>
              a.id === optimistic.id ? created : a,
            ),
          })),
        )
        .catch(() => {});
    }
    return optimistic;
  },
  updateAccount: (id, input) => {
    set((state) => ({
      accounts: state.accounts.map((acc) =>
        acc.id === id ? { ...acc, ...input, id } : acc,
      ),
    }));
    if (ONLINE) {
      accountsApi
        .update(id, input)
        .then((updated) =>
          set((state) => ({
            accounts: state.accounts.map((a) => (a.id === id ? updated : a)),
          })),
        )
        .catch(() => {});
    }
  },
  removeAccount: (id) => {
    set((state) => ({
      accounts: state.accounts.filter((acc) => acc.id !== id),
    }));
    if (ONLINE) accountsApi.remove(id).catch(() => {});
  },
}));
