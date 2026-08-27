import { create } from 'zustand';
import { importsApi } from '@/features/imports/api';

const ONLINE = import.meta.env.MODE !== 'test';

export type ImportStatus = 'concluida' | 'processando' | 'erro';

/** Registro do histórico de importações. */
export interface ImportRecord {
  id: string;
  fileName: string;
  format: string;
  account: string;
  source: string;
  /** Data da importação (ISO `yyyy-mm-dd`). */
  date: string;
  /** Quantidade de lançamentos importados. */
  records: number;
  status: ImportStatus;
}

export type ImportInput = Omit<ImportRecord, 'id'>;

/** Arquivo escolhido no modal, aguardando revisão. */
export interface PendingImport {
  fileName: string;
  format: string;
  account: string;
  source: string;
}

interface ImportsState {
  imports: ImportRecord[];
  pendingImport: PendingImport | null;
  hydrate: () => Promise<void>;
  addImport: (input: ImportInput) => void;
  removeImport: (id: string) => void;
  setPendingImport: (pending: PendingImport | null) => void;
}

/** Histórico inicial (exemplo). */
export const initialImports: ImportRecord[] = [
  {
    id: 'i1',
    fileName: 'extrato-itau-agosto.ofx',
    format: 'OFX',
    account: 'Itaú',
    source: 'Extrato bancário',
    date: '2026-08-24',
    records: 42,
    status: 'concluida',
  },
  {
    id: 'i2',
    fileName: 'fatura-nubank-08-2026.csv',
    format: 'CSV',
    account: 'Cartão Nubank',
    source: 'Fatura de cartão',
    date: '2026-08-20',
    records: 28,
    status: 'concluida',
  },
  {
    id: 'i3',
    fileName: 'fatura-nubank-07-2026.pdf',
    format: 'PDF',
    account: 'Cartão Nubank',
    source: 'Fatura de cartão',
    date: '2026-07-20',
    records: 0,
    status: 'erro',
  },
];

/**
 * Store do histórico de importações (Zustand). O modal de importação registra
 * cada arquivo enviado aqui; a tela de Importações lista tudo. Em memória.
 */
export const useImportsStore = create<ImportsState>((set) => ({
  imports: initialImports,
  pendingImport: null,
  hydrate: async () => {
    try {
      set({ imports: await importsApi.list() });
    } catch {
      /* offline: mantém o estado atual */
    }
  },
  addImport: (input) => {
    const optimistic: ImportRecord = { id: crypto.randomUUID(), ...input };
    set((state) => ({ imports: [optimistic, ...state.imports] }));
    if (ONLINE) {
      importsApi
        .create(input)
        .then((created) =>
          set((state) => ({
            imports: state.imports.map((i) =>
              i.id === optimistic.id ? created : i,
            ),
          })),
        )
        .catch(() => {});
    }
  },
  removeImport: (id) => {
    set((state) => ({
      imports: state.imports.filter((i) => i.id !== id),
    }));
    if (ONLINE) importsApi.remove(id).catch(() => {});
  },
  setPendingImport: (pendingImport) => set({ pendingImport }),
}));
