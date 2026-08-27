import { z } from 'zod';

/** Valida um CPF (formato + dígitos verificadores). */
export function isValidCpf(raw: string): boolean {
  const cpf = raw.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split('').map(Number);
  const check = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) {
      sum += (digits[i] ?? 0) * (len + 1 - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  return check(9) === digits[9] && check(10) === digits[10];
}

/** Estados brasileiros (para o select de UF). */
export const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

// Campo numérico opcional: string vazia do input vira `undefined`.
const emptyToUndefined = (v: unknown) =>
  v === '' || v === null ? undefined : v;

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome'),
  email: z.string().trim().email('E-mail inválido'),
  cpf: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || isValidCpf(v), 'CPF inválido'),
  phone: z.string().trim().optional(),
  birthDate: z.string().optional(),

  cep: z.string().trim().optional(),
  street: z.string().trim().optional(),
  number: z.string().trim().optional(),
  complement: z.string().trim().optional(),
  district: z.string().trim().optional(),
  city: z.string().trim().optional(),
  uf: z.string().optional(),

  defaultCurrency: z.string().optional(),
  closingDay: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .int()
      .min(1, 'Entre 1 e 31')
      .max(31, 'Entre 1 e 31')
      .optional(),
  ),
  monthlyIncome: z.preprocess(
    emptyToUndefined,
    z.coerce.number().nonnegative('Valor inválido').optional(),
  ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
