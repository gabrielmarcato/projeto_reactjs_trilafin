import { DatabaseSync } from 'node:sqlite';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dbPath = join(here, '..', 'data.db');

/** Instância única do SQLite (arquivo local, sem servidor). */
export const db = new DatabaseSync(dbPath);

/** Cria as tabelas se ainda não existirem. Espelha os modelos do front. */
export function initSchema(): void {
  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      passwordHash  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id                TEXT PRIMARY KEY,
      name              TEXT NOT NULL,
      type              TEXT NOT NULL,
      bank              TEXT NOT NULL,
      agency            TEXT,
      number            TEXT NOT NULL,
      balance           REAL NOT NULL DEFAULT 0,
      holder            TEXT,
      includeInNetWorth INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS settings_items (
      id          TEXT PRIMARY KEY,
      collection  TEXT NOT NULL,
      name        TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id            TEXT PRIMARY KEY,
      date          TEXT NOT NULL,
      description   TEXT NOT NULL,
      type          TEXT NOT NULL,
      amount        REAL NOT NULL,
      account       TEXT NOT NULL,
      categories    TEXT NOT NULL DEFAULT '[]',
      tags          TEXT NOT NULL DEFAULT '[]',
      paymentMethod TEXT,
      budgetType    TEXT
    );

    CREATE TABLE IF NOT EXISTS imports (
      id        TEXT PRIMARY KEY,
      fileName  TEXT NOT NULL,
      format    TEXT NOT NULL,
      account   TEXT NOT NULL,
      source    TEXT NOT NULL,
      date      TEXT NOT NULL,
      records   INTEGER NOT NULL DEFAULT 0,
      status    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profile (
      userId           TEXT PRIMARY KEY
                       REFERENCES users(id) ON DELETE CASCADE,
      name             TEXT NOT NULL,
      email            TEXT NOT NULL,
      cpf              TEXT,
      phone            TEXT,
      birthDate        TEXT,
      cep              TEXT,
      street           TEXT,
      number           TEXT,
      complement       TEXT,
      district         TEXT,
      city             TEXT,
      uf               TEXT,
      defaultCurrency  TEXT,
      closingDay       INTEGER,
      monthlyIncome    REAL
    );
  `);
}
