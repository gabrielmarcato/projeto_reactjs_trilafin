import { create } from 'zustand';
import { settingsApi } from '@/features/settings/api';

const ONLINE = import.meta.env.MODE !== 'test';

/** Item genérico de uma taxonomia configurável. */
export interface SettingsItem {
  id: string;
  name: string;
}

/** Coleções configuráveis do sistema. */
export type CollectionKey =
  'categories' | 'budgetTypes' | 'paymentMethods' | 'tags' | 'currencies';

const COLLECTION_KEYS: CollectionKey[] = [
  'categories',
  'budgetTypes',
  'paymentMethods',
  'tags',
  'currencies',
];

interface SettingsState {
  collections: Record<CollectionKey, SettingsItem[]>;
  hydrate: () => Promise<void>;
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
  hydrate: async () => {
    try {
      const lists = await Promise.all(
        COLLECTION_KEYS.map((key) => settingsApi.list(key)),
      );
      const collections = {} as Record<CollectionKey, SettingsItem[]>;
      COLLECTION_KEYS.forEach((key, i) => {
        collections[key] = lists[i] ?? [];
      });
      set({ collections });
    } catch {
      /* offline: mantém o estado atual */
    }
  },
  addItem: (key, name) => {
    const optimistic: SettingsItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };
    set((state) => ({
      collections: {
        ...state.collections,
        [key]: [...state.collections[key], optimistic],
      },
    }));
    if (ONLINE) {
      settingsApi
        .create(key, optimistic.name)
        .then((created) =>
          set((state) => ({
            collections: {
              ...state.collections,
              [key]: state.collections[key].map((it) =>
                it.id === optimistic.id ? created : it,
              ),
            },
          })),
        )
        .catch(() => {});
    }
  },
  renameItem: (key, id, name) => {
    set((state) => ({
      collections: {
        ...state.collections,
        [key]: state.collections[key].map((it) =>
          it.id === id ? { ...it, name: name.trim() } : it,
        ),
      },
    }));
    if (ONLINE) settingsApi.update(key, id, name.trim()).catch(() => {});
  },
  removeItem: (key, id) => {
    set((state) => ({
      collections: {
        ...state.collections,
        [key]: state.collections[key].filter((it) => it.id !== id),
      },
    }));
    if (ONLINE) settingsApi.remove(key, id).catch(() => {});
  },
}));
