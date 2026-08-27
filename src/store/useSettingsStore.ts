import { create } from 'zustand';

/** Item genérico de uma taxonomia configurável. */
export interface SettingsItem {
  id: string;
  name: string;
}

/** Coleções configuráveis do sistema. */
export type CollectionKey =
  'categories' | 'budgetTypes' | 'paymentMethods' | 'tags' | 'currencies';

interface SettingsState {
  collections: Record<CollectionKey, SettingsItem[]>;
  addItem: (key: CollectionKey, name: string) => void;
  renameItem: (key: CollectionKey, id: string, name: string) => void;
  removeItem: (key: CollectionKey, id: string) => void;
}

let counter = 0;
const item = (name: string): SettingsItem => ({
  id: `seed-${(counter += 1)}`,
  name,
});

/** Sementes com valores comuns em finanças pessoais (BR). */
export const initialCollections: Record<CollectionKey, SettingsItem[]> = {
  categories: [
    'Moradia',
    'Alimentação',
    'Transporte',
    'Saúde',
    'Lazer',
    'Educação',
    'Receita',
    'Investimento',
    'Outros',
  ].map(item),
  budgetTypes: ['Fixo', 'Variável', 'Meta', 'Sazonal', 'Reserva'].map(item),
  paymentMethods: [
    'Crédito',
    'Débito',
    'Pix',
    'Dinheiro',
    'Boleto',
    'Parcelamento',
    'Transferência (TED/DOC)',
    'Débito automático',
  ].map(item),
  tags: ['Recorrente', 'Fixo', 'Dedutível', 'Reembolsável', 'Essencial'].map(
    item,
  ),
  currencies: ['BRL — Real', 'USD — Dólar', 'EUR — Euro'].map(item),
};

/**
 * Store das configurações (taxonomias do sistema). Cada coleção é uma lista
 * de itens nomeados que o usuário pode cadastrar, renomear e remover — usada
 * para alimentar selects de categoria, forma de pagamento, etc. pelo app.
 *
 * Em memória por enquanto; trocar por persistência/back-end depois.
 */
export const useSettingsStore = create<SettingsState>((set) => ({
  collections: initialCollections,
  addItem: (key, name) =>
    set((state) => ({
      collections: {
        ...state.collections,
        [key]: [
          ...state.collections[key],
          { id: crypto.randomUUID(), name: name.trim() },
        ],
      },
    })),
  renameItem: (key, id, name) =>
    set((state) => ({
      collections: {
        ...state.collections,
        [key]: state.collections[key].map((it) =>
          it.id === id ? { ...it, name: name.trim() } : it,
        ),
      },
    })),
  removeItem: (key, id) =>
    set((state) => ({
      collections: {
        ...state.collections,
        [key]: state.collections[key].filter((it) => it.id !== id),
      },
    })),
}));
