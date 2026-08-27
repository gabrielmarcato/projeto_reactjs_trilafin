import { z } from 'zod';
import type { SelectOption } from '@/components/ui/SelectField';
import type { AccountType } from '@/store/useAccountsStore';

const ACCOUNT_TYPE_VALUES = [
  'corrente',
  'poupanca',
  'investimento',
  'cartao',
] as const satisfies readonly AccountType[];

/** Opções do dropdown de tipo (rótulos legíveis). */
export const ACCOUNT_TYPE_OPTIONS: readonly SelectOption[] = [
  { value: 'corrente', label: 'Conta corrente' },
  { value: 'poupanca', label: 'Poupança' },
  { value: 'investimento', label: 'Investimento' },
  { value: 'cartao', label: 'Cartão de crédito' },
];

/**
 * Schema de validação do cadastro de conta (fonte única de verdade — o tipo
 * `AccountFormValues` é inferido dele).
 */
export const accountFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe o nome da conta')
    .max(60, 'Nome muito longo'),
  type: z.enum(ACCOUNT_TYPE_VALUES),
  bank: z.string().trim().min(2, 'Informe o banco').max(40),
  agency: z.string().trim().max(10, 'Agência inválida').optional(),
  number: z
    .string()
    .trim()
    .min(1, 'Informe o número da conta')
    .max(20, 'Número muito longo'),
  // Saldo inicial: aceita string do input e coage para número >= 0.
  initialBalance: z.coerce
    .number({ message: 'Valor inválido' })
    .nonnegative('O saldo não pode ser negativo'),
  holder: z.string().trim().max(60, 'Nome muito longo').optional(),
  includeInNetWorth: z.boolean(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

/** Valores iniciais do formulário de criação. */
export const emptyAccountForm: AccountFormValues = {
  name: '',
  type: 'corrente',
  bank: '',
  agency: '',
  number: '',
  initialBalance: 0,
  holder: '',
  includeInNetWorth: true,
};
