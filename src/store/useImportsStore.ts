import { create } from 'zustand';

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
  addImport: (input) =>
    set((state) => ({
      imports: [{ id: crypto.randomUUID(), ...input }, ...state.imports],
    })),
  removeImport: (id) =>
    set((state) => ({
      imports: state.imports.filter((i) => i.id !== id),
    })),
  setPendingImport: (pendingImport) => set({ pendingImport }),
}));
