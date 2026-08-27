import { randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { db } from '../db.ts';
import {
  accountSchema,
  collectionSchema,
  importSchema,
  profileSchema,
  settingsItemSchema,
  transactionSchema,
} from '../schemas.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */
const uid = () => randomUUID();

const mapAccount = (r: any) => ({
  id: r.id,
  name: r.name,
  type: r.type,
  bank: r.bank,
  agency: r.agency ?? undefined,
  number: r.number,
  balance: r.balance,
  holder: r.holder ?? undefined,
  includeInNetWorth: !!r.includeInNetWorth,
});

const mapTransaction = (r: any) => ({
  id: r.id,
  date: r.date,
  description: r.description,
  type: r.type,
  amount: r.amount,
  account: r.account,
  categories: JSON.parse(r.categories),
  tags: JSON.parse(r.tags),
  paymentMethod: r.paymentMethod ?? undefined,
  budgetType: r.budgetType ?? undefined,
});

/**
 * Todas as rotas de dados. O hook `preHandler` protege o grupo inteiro:
 * exige JWT válido (encapsulamento do Fastify limita o hook a este plugin).
 */
export async function dataRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', app.authenticate);

  // ─────────────────────────── Contas ───────────────────────────
  app.get('/accounts', async () =>
    (db.prepare('SELECT * FROM accounts').all() as any[]).map(mapAccount),
  );

  app.post('/accounts', async (req, reply) => {
    const p = accountSchema.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Dados inválidos' });
    const a = p.data;
    const id = uid();
    db.prepare(
      `INSERT INTO accounts (id, name, type, bank, agency, number, balance, holder, includeInNetWorth)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      a.name,
      a.type,
      a.bank,
      a.agency ?? null,
      a.number,
      a.balance,
      a.holder ?? null,
      a.includeInNetWorth ? 1 : 0,
    );
    return reply
      .code(201)
      .send(
        mapAccount({
          id,
          ...a,
          includeInNetWorth: a.includeInNetWorth ? 1 : 0,
        }),
      );
  });

  app.put('/accounts/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const p = accountSchema.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Dados inválidos' });
    const a = p.data;
    const r = db
      .prepare(
        `UPDATE accounts SET name=?, type=?, bank=?, agency=?, number=?, balance=?, holder=?, includeInNetWorth=? WHERE id=?`,
      )
      .run(
        a.name,
        a.type,
        a.bank,
        a.agency ?? null,
        a.number,
        a.balance,
        a.holder ?? null,
        a.includeInNetWorth ? 1 : 0,
        id,
      );
    if (r.changes === 0)
      return reply.code(404).send({ error: 'Não encontrado' });
    return mapAccount({
      id,
      ...a,
      includeInNetWorth: a.includeInNetWorth ? 1 : 0,
    });
  });

  app.delete('/accounts/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    db.prepare('DELETE FROM accounts WHERE id = ?').run(id);
    return reply.code(204).send();
  });

  // ───────────────────────── Transações ─────────────────────────
  app.get('/transactions', async () =>
    (
      db.prepare('SELECT * FROM transactions ORDER BY date DESC').all() as any[]
    ).map(mapTransaction),
  );

  app.post('/transactions', async (req, reply) => {
    const p = transactionSchema.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Dados inválidos' });
    const t = p.data;
    const id = uid();
    db.prepare(
      `INSERT INTO transactions (id, date, description, type, amount, account, categories, tags, paymentMethod, budgetType)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      t.date,
      t.description,
      t.type,
      t.amount,
      t.account,
      JSON.stringify(t.categories),
      JSON.stringify(t.tags),
      t.paymentMethod ?? null,
      t.budgetType ?? null,
    );
    return reply
      .code(201)
      .send(
        mapTransaction({
          id,
          ...t,
          categories: JSON.stringify(t.categories),
          tags: JSON.stringify(t.tags),
        }),
      );
  });

  app.put('/transactions/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const p = transactionSchema.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Dados inválidos' });
    const t = p.data;
    const r = db
      .prepare(
        `UPDATE transactions SET date=?, description=?, type=?, amount=?, account=?, categories=?, tags=?, paymentMethod=?, budgetType=? WHERE id=?`,
      )
      .run(
        t.date,
        t.description,
        t.type,
        t.amount,
        t.account,
        JSON.stringify(t.categories),
        JSON.stringify(t.tags),
        t.paymentMethod ?? null,
        t.budgetType ?? null,
        id,
      );
    if (r.changes === 0)
      return reply.code(404).send({ error: 'Não encontrado' });
    return mapTransaction({
      id,
      ...t,
      categories: JSON.stringify(t.categories),
      tags: JSON.stringify(t.tags),
    });
  });

  app.delete('/transactions/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    return reply.code(204).send();
  });

  // ─────────────────── Configurações (taxonomias) ───────────────────
  app.get('/settings/:collection', async (req, reply) => {
    const c = collectionSchema.safeParse((req.params as any).collection);
    if (!c.success) return reply.code(404).send({ error: 'Coleção inválida' });
    return db
      .prepare('SELECT id, name FROM settings_items WHERE collection = ?')
      .all(c.data);
  });

  app.post('/settings/:collection', async (req, reply) => {
    const c = collectionSchema.safeParse((req.params as any).collection);
    if (!c.success) return reply.code(404).send({ error: 'Coleção inválida' });
    const p = settingsItemSchema.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Dados inválidos' });
    const id = uid();
    db.prepare(
      'INSERT INTO settings_items (id, collection, name) VALUES (?, ?, ?)',
    ).run(id, c.data, p.data.name);
    return reply.code(201).send({ id, name: p.data.name });
  });

  app.put('/settings/:collection/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const p = settingsItemSchema.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Dados inválidos' });
    const r = db
      .prepare('UPDATE settings_items SET name = ? WHERE id = ?')
      .run(p.data.name, id);
    if (r.changes === 0)
      return reply.code(404).send({ error: 'Não encontrado' });
    return { id, name: p.data.name };
  });

  app.delete('/settings/:collection/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    db.prepare('DELETE FROM settings_items WHERE id = ?').run(id);
    return reply.code(204).send();
  });

  // ───────────────────────── Importações ─────────────────────────
  app.get('/imports', async () =>
    db.prepare('SELECT * FROM imports ORDER BY date DESC').all(),
  );

  app.post('/imports', async (req, reply) => {
    const p = importSchema.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Dados inválidos' });
    const i = p.data;
    const id = uid();
    db.prepare(
      `INSERT INTO imports (id, fileName, format, account, source, date, records, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      i.fileName,
      i.format,
      i.account,
      i.source,
      i.date,
      i.records,
      i.status,
    );
    return reply.code(201).send({ id, ...i });
  });

  app.delete('/imports/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    db.prepare('DELETE FROM imports WHERE id = ?').run(id);
    return reply.code(204).send();
  });

  // ─────────────────── Perfil (do usuário logado) ───────────────────
  app.get('/profile', async (req) => {
    const userId = req.user.sub;
    const r = db
      .prepare('SELECT * FROM profile WHERE userId = ?')
      .get(userId) as any;
    if (!r) return {};
    const { userId: _uid, ...profile } = r;
    return profile;
  });

  app.put('/profile', async (req, reply) => {
    const p = profileSchema.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Dados inválidos' });
    const v = p.data;
    const userId = req.user.sub;
    db.prepare('DELETE FROM profile WHERE userId = ?').run(userId);
    db.prepare(
      `INSERT INTO profile (userId, name, email, cpf, phone, birthDate, cep, street, number, complement, district, city, uf, defaultCurrency, closingDay, monthlyIncome)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      userId,
      v.name,
      v.email,
      v.cpf ?? null,
      v.phone ?? null,
      v.birthDate ?? null,
      v.cep ?? null,
      v.street ?? null,
      v.number ?? null,
      v.complement ?? null,
      v.district ?? null,
      v.city ?? null,
      v.uf ?? null,
      v.defaultCurrency ?? null,
      v.closingDay ?? null,
      v.monthlyIncome ?? null,
    );
    return v;
  });
}
