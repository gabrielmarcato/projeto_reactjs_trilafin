import { money } from '@/lib/format';
import { theme } from '@/styles/theme';
import type {
  Budget,
  Category,
  FlowPoint,
  Stat,
  Transaction,
  TypeSpecimen,
} from './types';

const c = theme.colors;

/**
 * Dados mockados da home, extraídos 1:1 do design de referência
 * (`Fintrilha.dc.html`). Num projeto real, estes viriam do backend via
 * TanStack Query — a forma (tipos) já está pronta para essa troca.
 */

export const budgets: Budget[] = [
  { label: 'Moradia', used: '78%', pct: '78%', tone: c.textBright },
  { label: 'Alimentação', used: '94%', pct: '94%', tone: c.accent },
  { label: 'Transporte', used: '41%', pct: '41%', tone: c.textBright },
  { label: 'Lazer', used: '63%', pct: '63%', tone: c.textBright },
];

export const stats: Stat[] = [
  {
    label: 'Patrimônio líquido',
    value: money(225220.27),
    tone: c.text,
    delta: '+ 4,2% no mês',
  },
  {
    label: 'Entradas',
    value: money(21340.0),
    tone: c.text,
    delta: '3 fontes ativas',
  },
  {
    label: 'Saídas',
    value: money(12480.0),
    tone: c.accent,
    delta: '− 8,1% vs. julho',
  },
  {
    label: 'Taxa de poupança',
    value: '41,5%',
    tone: c.text,
    delta: 'Meta: 40%',
  },
];

export const flow: FlowPoint[] = [
  { month: 'JAN', inH: '62%', outH: '48%' },
  { month: 'FEV', inH: '58%', outH: '55%' },
  { month: 'MAR', inH: '71%', outH: '44%' },
  { month: 'ABR', inH: '66%', outH: '61%' },
  { month: 'MAI', inH: '80%', outH: '52%' },
  { month: 'JUN', inH: '74%', outH: '69%' },
  { month: 'JUL', inH: '88%', outH: '58%' },
  { month: 'AGO', inH: '100%', outH: '50%' },
];

export const categories: Category[] = [
  { label: 'Moradia', amount: money(4200), pct: '100%', tone: c.textBright },
  { label: 'Alimentação', amount: money(2980), pct: '71%', tone: c.accent },
  { label: 'Transporte', amount: money(1640), pct: '39%', tone: c.textMuted },
  { label: 'Saúde', amount: money(1210), pct: '29%', tone: c.textMuted },
  { label: 'Lazer', amount: money(980), pct: '23%', tone: c.textFaintest },
  { label: 'Outros', amount: money(1470), pct: '35%', tone: c.textFaintest },
];

export const transactions: Transaction[] = [
  {
    date: '26 AGO',
    desc: 'Salário — Vector Studio',
    cat: 'Receita',
    account: 'Itaú',
    amount: '+ ' + money(14200),
    tone: c.text,
  },
  {
    date: '25 AGO',
    desc: 'Aluguel Vila Madalena',
    cat: 'Moradia',
    account: 'Itaú',
    amount: '− ' + money(3400),
    tone: c.accent,
  },
  {
    date: '24 AGO',
    desc: 'Mercado Oba Hortifruti',
    cat: 'Alimentação',
    account: 'Nubank',
    amount: '− ' + money(486.9),
    tone: c.accent,
  },
  {
    date: '23 AGO',
    desc: 'Aporte Tesouro IPCA+',
    cat: 'Investimento',
    account: 'XP',
    amount: '− ' + money(2500),
    tone: c.textTertiary,
  },
  {
    date: '22 AGO',
    desc: 'Freela — identidade Kaido',
    cat: 'Receita',
    account: 'Itaú',
    amount: '+ ' + money(3800),
    tone: c.text,
  },
  {
    date: '21 AGO',
    desc: 'Plano de saúde Sulamérica',
    cat: 'Saúde',
    account: 'Itaú',
    amount: '− ' + money(742.3),
    tone: c.accent,
  },
];

export const typeScale: TypeSpecimen[] = [
  { meta: 'Display / 52', weight: 800, size: '34px', sample: 'Seu dinheiro' },
  { meta: 'Título / 32', weight: 800, size: '26px', sample: 'Fluxo de caixa' },
  {
    meta: 'Seção / 17',
    weight: 800,
    size: '17px',
    sample: 'Transações recentes',
  },
  { meta: 'Número / 34', weight: 800, size: '24px', sample: 'R$ 225.220,27' },
  {
    meta: 'Corpo / 15',
    weight: 400,
    size: '15px',
    sample: 'Archivo Regular — leitura',
  },
  {
    meta: 'Rótulo / 10',
    weight: 500,
    size: '12px',
    sample: 'PATRIMÔNIO LÍQUIDO',
  },
];
