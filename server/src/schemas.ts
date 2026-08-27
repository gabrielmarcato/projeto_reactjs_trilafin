import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const accountSchema = z.object({
  name: z.string().trim().min(2),
  type: z.enum(['corrente', 'poupanca', 'investimento', 'cartao']),
  bank: z.string().trim().min(2),
  agency: z.string().trim().optional(),
  number: z.string().trim().min(1),
  balance: z.coerce.number().default(0),
  holder: z.string().trim().optional(),
  includeInNetWorth: z.boolean().default(true),
});

export const transactionSchema = z.object({
  date: z.string().min(1),
  description: z.string().trim().min(2),
  type: z.enum(['entrada', 'saida']),
  amount: z.coerce.number().positive(),
  account: z.string().min(1),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  paymentMethod: z.string().optional(),
  budgetType: z.string().optional(),
});

export const settingsItemSchema = z.object({
  name: z.string().trim().min(1),
});

export const COLLECTIONS = [
  'categories',
  'budgetTypes',
  'paymentMethods',
  'tags',
  'currencies',
] as const;
export const collectionSchema = z.enum(COLLECTIONS);

export const importSchema = z.object({
  fileName: z.string().min(1),
  format: z.string().min(1),
  account: z.string().min(1),
  source: z.string().min(1),
  date: z.string().min(1),
  records: z.coerce.number().int().default(0),
  status: z.enum(['concluida', 'processando', 'erro']),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  cpf: z.string().trim().optional(),
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
  closingDay: z.coerce.number().int().min(1).max(31).optional(),
  monthlyIncome: z.coerce.number().nonnegative().optional(),
});
