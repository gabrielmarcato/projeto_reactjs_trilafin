import { create } from 'zustand';

export type TransactionType = 'entrada' | 'saida';

/** Modelo de domínio de uma transação (lançamento). */
export interface Transaction {
  id: string;
  /** Data no formato ISO `yyyy-mm-dd`. */
  date: string;
  description: string;
  type: TransactionType;
  /** Valor absoluto (o sinal vem do `type`). */
  amount: number;
  /** Conta (nome). */
  account: string;
  /** Uma transação pode ter mais de uma categoria. */
  categories: string[];
  /** Etiquetas livres (também múltiplas). */
  tags: string[];
  paymentMethod?: string;
  /** Tipo de orçamento (Fixo, Variável, Meta…). */
  budgetType?: string;
}

/** Dados de uma transação sem o `id` (criar/editar). */
export type TransactionInput = Omit<Transaction, 'id'>;

interface TransactionsState {
  transactions: Transaction[];
  addTransaction: (input: TransactionInput) => void;
  updateTransaction: (id: string, input: TransactionInput) => void;
  removeTransaction: (id: string) => void;
}

/** Lançamentos iniciais — alguns com mais de uma categoria (demonstração). */
export const initialTransactions: Transaction[] = [
  {
    id: 't1',
    date: '2026-08-26',
    description: 'Salário — Vector Studio',
    type: 'entrada',
    amount: 14200,
    account: 'Itaú',
    categories: ['Receita'],
    tags: ['Recorrente'],
    paymentMethod: 'Transferência (TED/DOC)',
    budgetType: 'Fixo',
  },
  {
    id: 't2',
    date: '2026-08-25',
    description: 'Aluguel Vila Madalena',
    type: 'saida',
    amount: 3400,
    account: 'Itaú',
    categories: ['Moradia'],
    tags: ['Fixo', 'Essencial'],
    paymentMethod: 'Boleto',
    budgetType: 'Fixo',
  },
  {
    id: 't3',
    date: '2026-08-24',
    description: 'Mercado Oba Hortifruti',
    type: 'saida',
    amount: 486.9,
    account: 'Nubank',
    categories: ['Alimentação', 'Outros'],
    tags: ['Essencial'],
    paymentMethod: 'Crédito',
    budgetType: 'Variável',
  },
  {
    id: 't4',
    date: '2026-08-23',
    description: 'Aporte Tesouro IPCA+',
    type: 'saida',
    amount: 2500,
    account: 'XP',
    categories: ['Investimento'],
    tags: ['Recorrente'],
    paymentMethod: 'Débito',
    budgetType: 'Meta',
  },
  {
    id: 't5',
    date: '2026-08-22',
    description: 'Freela — identidade Kaido',
    type: 'entrada',
    amount: 3800,
    account: 'Itaú',
    categories: ['Receita'],
    tags: [],
    paymentMethod: 'Pix',
  },
  {
    id: 't6',
    date: '2026-08-21',
    description: 'Plano de saúde Sulamérica',
    type: 'saida',
    amount: 742.3,
    account: 'Itaú',
    categories: ['Saúde'],
    tags: ['Essencial', 'Dedutível'],
    paymentMethod: 'Débito automático',
    budgetType: 'Fixo',
  },
  {
    id: 't7',
    date: '2026-08-20',
    description: 'Jantar + corrida de app',
    type: 'saida',
    amount: 180,
    account: 'Nubank',
    categories: ['Lazer', 'Transporte'],
    tags: [],
    paymentMethod: 'Crédito',
    budgetType: 'Variável',
  },
];

/**
 * Store de transações (Zustand). Alimenta a tela de Transações; adicionar,
 * editar e remover refletem na hora. Em memória por enquanto.
 */
export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: initialTransactions,
  addTransaction: (input) =>
    set((state) => ({
      transactions: [
        { id: crypto.randomUUID(), ...input },
        ...state.transactions,
      ],
    })),
  updateTransaction: (id, input) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...input, id } : t,
      ),
    })),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));
