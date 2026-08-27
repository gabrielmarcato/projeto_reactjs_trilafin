<div align="center">

# TRILHA<span>.</span>FIN

**Seu dinheiro, sem ruído.**

Gestão financeira pessoal com uma interface direta, tipográfica e sem
distrações — contas, transações, importação de extratos, relatórios e um
design system próprio.

![React](https://img.shields.io/badge/React-18-20232a?logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6e9f18?logo=vitest&logoColor=white)
![License: MIT](https://img.shields.io/badge/license-MIT-ff563c)

</div>

---

## ✨ Visão geral

O **Trilha.Fin** é um aplicativo de finanças pessoais construído em torno de um
princípio: cada decisão financeira cabe em uma linha bem alinhada. A interface
usa um design system autoral — **Modernist (dark)**: fundo quase-preto, um único
acento coral, tipografia **Archivo**, cantos retos e réguas fortes de 2px.

> **Status:** front-end funcional com **backend Fastify + SQLite** e login real
> (JWT). As telas de dados ainda usam estado local — a API já expõe as rotas
> para migrá-las. Veja o [roadmap](#-roadmap).

## 🧩 Funcionalidades

- **🔐 Login** com rotas protegidas — sem autenticação, tudo redireciona para a
  tela de acesso.
- **📊 Painel (home)** — visão geral do mês: patrimônio, entradas, saídas, taxa
  de poupança, fluxo de caixa e "para onde foi o dinheiro".
- **🏦 Contas** — cadastro, edição e remoção (corrente, poupança, investimento,
  cartão) direto na barra lateral.
- **💸 Transações** — tabela com **busca**, **paginação** (10/30/60/100),
  **múltiplas categorias** por lançamento, etiquetas, forma de pagamento e
  ações de editar/remover.
- **📥 Importações** — envie extratos/faturas (**OFX, CSV, PDF, QIF, Excel,
  TXT**); uma **tela de revisão** lista as movimentações lidas para você
  completar os dados manuais antes de entrarem na lista.
- **📈 Relatórios** — filtros precisos (período, tipo, conta, categoria, forma
  de pagamento, etiqueta, faixa de valor, busca), resumo e **exportação em
  CSV**.
- **⚙️ Configurações** — cadastro em abas das taxonomias do sistema
  (categorias, tipos de orçamento, formas de pagamento, etiquetas, moedas).
- **👤 Conta** — perfil do usuário (dados pessoais, endereço e preferências).

## 🎨 Design system

Todo o app é composto a partir de um tema tipado e de componentes reutilizáveis
(botões, campos, modais, abas, tabelas, tags), garantindo consistência visual e
acessibilidade (foco de teclado temático, `aria-*`, diálogos com `role`).

## 🧱 Stack técnica

| Camada                  | Tecnologia                                         |
| ----------------------- | -------------------------------------------------- |
| UI                      | **React 18** + **TypeScript** (strict)             |
| Build / dev server      | **Vite**                                           |
| Estilização             | **styled-components** com tema tipado              |
| Estado                  | **Zustand**                                        |
| Roteamento              | **TanStack Router** (code-based, tipado)           |
| Data fetching / cache   | **TanStack Query**                                 |
| Formulários + validação | **React Hook Form** + **Zod**                      |
| Testes                  | **Vitest** + **Testing Library**                   |
| Qualidade               | **ESLint** + **Prettier** + **Husky**              |
| **Backend**             | **Fastify** + **SQLite** (`node:sqlite`) + **JWT** |

## 🚀 Começando

Pré-requisitos: **Node.js 18+** e **npm**.

```bash
# 1. Instale as dependências (configura os git hooks automaticamente)
npm install

# 2. Suba o ambiente de desenvolvimento
npm run dev
```

Suba também o **backend** (Fastify + SQLite, sem instalar banco) em outro
terminal:

```bash
npm run api:install   # uma vez
npm run api:seed      # cria e popula server/data.db
npm run api:dev       # API em http://localhost:3333
```

Abra `http://localhost:5173` e entre com o **usuário inicial** criado pelo seed
do backend (usuário `gabrielmarcato`). A senha é definida no seed, configurável
por variável de ambiente (`SEED_USERNAME` / `SEED_PASSWORD` em `server/.env`).

> Detalhes da API (rotas, autenticação, migração das telas para o backend) no
> **[Guia de Desenvolvimento](DEVELOPMENT.md#backend-fastify--sqlite)**.

Para gerar o build de produção:

```bash
npm run build && npm run preview
```

## 📦 Scripts principais

| Script          | Descrição                           |
| --------------- | ----------------------------------- |
| `npm run dev`   | Ambiente de desenvolvimento com HMR |
| `npm run build` | Build de produção (`dist/`)         |
| `npm run test`  | Suíte de testes                     |
| `npm run check` | Typecheck + lint + testes           |

## 🗺️ Rotas

| Rota                   | Tela                     |
| ---------------------- | ------------------------ |
| `/login`               | Acesso                   |
| `/`                    | Painel (home)            |
| `/transacoes`          | Transações               |
| `/importacoes`         | Histórico de importações |
| `/importacoes/revisar` | Revisão da importação    |
| `/relatorios`          | Relatórios + exportação  |
| `/configuracoes`       | Configurações (abas)     |

## 🧭 Roadmap

- [x] **Backend** Fastify + SQLite com API REST e **autenticação JWT**
- [x] **Login integrado** ao backend (validação real de credenciais)
- [ ] **Ligar as telas de dados** à API (hoje só a auth está integrada; contas,
      transações, etc. ainda usam estado local — a API já expõe as rotas)
- [ ] **Orçamentos** (tela já reservada no menu)
- [ ] **Parse real** de importação (OFX/CSV → lançamentos, detecção de
      duplicados, categorização automática)
- [ ] Gráficos no relatório e mais formatos de exportação

## 🤝 Contribuindo

Setup do ambiente, arquitetura, convenções e passo a passo para estender o
sistema estão no **[Guia de Desenvolvimento](DEVELOPMENT.md)**.

Fluxo resumido: os **git hooks** garantem qualidade — o `pre-commit` roda
lint + formatação + typecheck, e o `pre-push` roda a suíte de testes completa.

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE) para mais detalhes.
