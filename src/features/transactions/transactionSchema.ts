import { z } from 'zod';
import type { SelectOption } from '@/components/ui/SelectField';
import type { TransactionType } from '@/store/useTransactionsStore';

const TYPE_VALUES = [
  'entrada',
  'saida',
] as const satisfies readonly TransactionType[];

/** Opções do tipo de lançamento. */
export const TYPE_OPTIONS: readonly SelectOption[] = [
  { value: 'saida', label: 'Saída' },
  { value: 'entrada', label: 'Entrada' },
];

const emptyToUndefined = (v: unknown) =>
  v === '' || v === null ? undefined : v;

/**
 * Schema do lançamento. `categories` é um array (uma transação pode ter mais
 * de uma categoria) e exige ao menos uma seleção.
 */
export const transactionSchema = z.object({
  description: z.string().trim().min(2, 'Informe uma descrição'),
  date: z.string().min(1, 'Informe a data'),
  type: z.enum(TYPE_VALUES),
  amount: z.preprocess(
    emptyToUndefined,
    z.coerce.number({ message: 'Valor inválido' }).positive('Valor inválido'),
  ),
  account: z.string().min(1, 'Selecione a conta'),
  categories: z.array(z.string()).min(1, 'Selecione ao menos uma categoria'),
  tags: z.array(z.string()),
  paymentMethod: z.string().optional(),
  budgetType: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
