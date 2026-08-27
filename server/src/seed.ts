import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { db, initSchema } from './db.ts';

// Carrega server/.env pelo caminho absoluto (funciona qualquer que seja o cwd —
// ex.: `npm run api:dev` rodado da raiz do projeto).
try {
  const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');
  process.loadEnvFile(envPath);
} catch {
  /* sem .env — usa variáveis do ambiente ou os padrões */
}

const uid = () => randomUUID();

// Credenciais do usuário inicial. A senha REAL fica em `server/.env` (fora do
// git); aqui só há um placeholder para não versionar segredo.
const SEED_USERNAME = process.env.SEED_USERNAME ?? 'gabrielmarcato';
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? 'changeme';

/** Popula o banco com os dados iniciais (idempotente: só se estiver vazio). */
export function seed(): void {
  initSchema();

  // Usuário inicial
  const userCount = (
    db.prepare('SELECT COUNT(*) c FROM users').get() as { c: number }
  ).c;
  if (userCount === 0) {
    db.prepare(
      'INSERT INTO users (id, username, passwordHash) VALUES (?, ?, ?)',
    ).run(uid(), SEED_USERNAME, bcrypt.hashSync(SEED_PASSWORD, 10));
  }

  // Contas
  if (
    (db.prepare('SELECT COUNT(*) c FROM accounts').get() as { c: number }).c ===
    0
  ) {
    const insert = db.prepare(
      `INSERT INTO accounts (id, name, type, bank, agency, number, balance, includeInNetWorth)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const accounts: [string, string, string, string | null, string, number][] =
      [
        ['Conta corrente', 'corrente', 'Itaú', '0001', '12345-6', 18420.55],
        ['Reserva', 'poupanca', 'CDB', null, '98765-4', 62100],
        ['Cartão Nubank', 'cartao', 'Fatura', null, '•••• 4821', 3190.4],
        ['Investimentos', 'investimento', 'XP', null, '00012-3', 147890.12],
      ];
    for (const [name, type, bank, agency, number, balance] of accounts) {
      insert.run(uid(), name, type, bank, agency, number, balance, 1);
    }
  }

  // Taxonomias (configurações)
  if (
    (db.prepare('SELECT COUNT(*) c FROM settings_items').get() as { c: number })
      .c === 0
  ) {
    const insert = db.prepare(
      'INSERT INTO settings_items (id, collection, name) VALUES (?, ?, ?)',
    );
    const collections: Record<string, string[]> = {
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
      ],
      budgetTypes: ['Fixo', 'Variável', 'Meta', 'Sazonal', 'Reserva'],
      paymentMethods: [
        'Crédito',
        'Débito',
        'Pix',
        'Dinheiro',
        'Boleto',
        'Parcelamento',
        'Transferência (TED/DOC)',
        'Débito automático',
      ],
      tags: ['Recorrente', 'Fixo', 'Dedutível', 'Reembolsável', 'Essencial'],
      currencies: ['BRL — Real', 'USD — Dólar', 'EUR — Euro'],
    };
    for (const [collection, names] of Object.entries(collections)) {
      for (const name of names) insert.run(uid(), collection, name);
    }
  }

  // Transações
  if (
    (db.prepare('SELECT COUNT(*) c FROM transactions').get() as { c: number })
      .c === 0
  ) {
    const insert = db.prepare(
      `INSERT INTO transactions (id, date, description, type, amount, account, categories, tags, paymentMethod, budgetType)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const rows = [
      [
        '2026-08-26',
        'Salário — Vector Studio',
        'entrada',
        14200,
        'Itaú',
        ['Receita'],
        ['Recorrente'],
        'Transferência (TED/DOC)',
        'Fixo',
      ],
      [
        '2026-08-25',
        'Aluguel Vila Madalena',
        'saida',
        3400,
        'Itaú',
        ['Moradia'],
        ['Fixo', 'Essencial'],
        'Boleto',
        'Fixo',
      ],
      [
        '2026-08-24',
        'Mercado Oba Hortifruti',
        'saida',
        486.9,
        'Nubank',
        ['Alimentação', 'Outros'],
        ['Essencial'],
        'Crédito',
        'Variável',
      ],
      [
        '2026-08-23',
        'Aporte Tesouro IPCA+',
        'saida',
        2500,
        'XP',
        ['Investimento'],
        ['Recorrente'],
        'Débito',
        'Meta',
      ],
      [
        '2026-08-22',
        'Freela — identidade Kaido',
        'entrada',
        3800,
        'Itaú',
        ['Receita'],
        [],
        'Pix',
        null,
      ],
      [
        '2026-08-21',
        'Plano de saúde Sulamérica',
        'saida',
        742.3,
        'Itaú',
        ['Saúde'],
        ['Essencial', 'Dedutível'],
        'Débito automático',
        'Fixo',
      ],
      [
        '2026-08-20',
        'Jantar + corrida de app',
        'saida',
        180,
        'Nubank',
        ['Lazer', 'Transporte'],
        [],
        'Crédito',
        'Variável',
      ],
    ] as const;
    for (const r of rows) {
      insert.run(
        uid(),
        r[0],
        r[1],
        r[2],
        r[3],
        r[4],
        JSON.stringify(r[5]),
        JSON.stringify(r[6]),
        r[7],
        r[8],
      );
    }
  }

  // Importações
  if (
    (db.prepare('SELECT COUNT(*) c FROM imports').get() as { c: number }).c ===
    0
  ) {
    const insert = db.prepare(
      `INSERT INTO imports (id, fileName, format, account, source, date, records, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const rows = [
      [
        'extrato-itau-agosto.ofx',
        'OFX',
        'Itaú',
        'Extrato bancário',
        '2026-08-24',
        42,
        'concluida',
      ],
      [
        'fatura-nubank-08-2026.csv',
        'CSV',
        'Cartão Nubank',
        'Fatura de cartão',
        '2026-08-20',
        28,
        'concluida',
      ],
      [
        'fatura-nubank-07-2026.pdf',
        'PDF',
        'Cartão Nubank',
        'Fatura de cartão',
        '2026-07-20',
        0,
        'erro',
      ],
    ] as const;
    for (const r of rows) {
      insert.run(uid(), r[0], r[1], r[2], r[3], r[4], r[5], r[6]);
    }
  }

  // Perfil (vinculado ao usuário teste)
  if (
    (db.prepare('SELECT COUNT(*) c FROM profile').get() as { c: number }).c ===
    0
  ) {
    const user = db
      .prepare('SELECT id FROM users WHERE username = ?')
      .get(SEED_USERNAME) as { id: string } | undefined;
    if (user) {
      db.prepare(
        `INSERT INTO profile (userId, name, email, phone, city, uf, defaultCurrency, closingDay)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        user.id,
        'Marina Ribeiro',
        'marina@trilhafin.dev',
        '(11) 99999-0000',
        'São Paulo',
        'SP',
        'BRL — Real',
        1,
      );
    }
  }
}

// Executado diretamente via `npm run seed`.
if (process.argv[1] && import.meta.url.endsWith('seed.ts')) {
  seed();
  console.log('✅ Banco populado (server/data.db).');
}
