# Guia de Desenvolvimento — Trilha.Fin

Documentação técnica para quem vai **desenvolver** no projeto: setup do
ambiente, arquitetura, convenções e passo a passo para estender o sistema.
Para uma visão geral do produto, veja o [README](README.md).

---

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Setup](#setup)
- [Scripts](#scripts)
- [Arquitetura e estrutura de pastas](#arquitetura-e-estrutura-de-pastas)
- [Convenções](#convenções)
- [Design system (tema tipado)](#design-system-tema-tipado)
- [Estado global (Zustand)](#estado-global-zustand)
- [Data fetching (TanStack Query)](#data-fetching-tanstack-query)
- [Formulários (React Hook Form + Zod)](#formulários-react-hook-form--zod)
- [Roteamento e casca](#roteamento-e-casca)
- [Autenticação](#autenticação)
- [Receitas: como adicionar…](#receitas-como-adicionar)
- [Testes](#testes)
- [Git hooks (Husky)](#git-hooks-husky)
- [Path aliases](#path-aliases)
- [Solução de problemas](#solução-de-problemas)

---

## Pré-requisitos

- **Node.js 18+** (recomendado 20 LTS ou superior)
- **npm 9+**
- Git

## Setup

```bash
git clone <url-do-repositório>
cd projeto_reactjs_trilafin
npm install        # instala deps e configura os git hooks (script "prepare")
npm run dev        # http://localhost:5173
```

Ao abrir, a aplicação exige login. O usuário inicial é criado pelo seed do
backend (usuário `gabrielmarcato`); a senha vem de `SEED_PASSWORD` (veja
[Backend](#backend-fastify--sqlite)).

## Scripts

| Script                 | O que faz                                          |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Dev server com HMR                                 |
| `npm run build`        | `tsc -b` + build de produção em `dist/`            |
| `npm run preview`      | Serve o build de produção localmente               |
| `npm run typecheck`    | Checagem de tipos (`tsc -b --noEmit`)              |
| `npm run lint`         | ESLint no projeto todo                             |
| `npm run lint:fix`     | ESLint com correção automática                     |
| `npm run format`       | Prettier em `src/`                                 |
| `npm run format:check` | Verifica formatação sem escrever                   |
| `npm run test`         | Suíte de testes (Vitest, uma vez)                  |
| `npm run test:watch`   | Testes em watch                                    |
| `npm run test:ui`      | Interface visual do Vitest                         |
| `npm run check`        | `typecheck` + `lint` + `test` (o que o CI rodaria) |

---

## Arquitetura e estrutura de pastas

Organização **por feature** (feature-first): cada domínio reúne dados, estado,
telas e componentes próprios. Camadas globais só guardam o que é realmente
compartilhado.

```
src/
├── app/                 # Composição de providers globais (AppProviders)
├── components/
│   ├── ui/              # Componentes de UI reutilizáveis (Button, Field, Modal, Tabs…)
│   ├── layout/          # Chrome da app (AppShell, Topbar, UserMenu)
│   └── icons/           # Ícones SVG inline (estilo Lucide)
├── features/            # Um "mini-app" por domínio
│   ├── auth/            # Login
│   ├── dashboard/       # Home + Sidebar de contas
│   ├── transactions/    # Lançamentos (tabela, modais)
│   ├── imports/         # Importação (modal de arquivo, histórico, revisão)
│   ├── reports/         # Relatórios + exportação
│   ├── settings/        # Configurações em abas (taxonomias)
│   └── profile/         # Modal de conta/perfil
├── hooks/               # Hooks genéricos (useDebouncedValue, useClickOutside)
├── lib/                 # Infra compartilhada (format, export, queryClient)
├── routes/              # Definições de rota do TanStack Router (*.route.tsx)
├── store/               # Stores Zustand (useAuthStore, useAccountsStore…)
├── styles/              # theme.ts, GlobalStyle, tipagem do styled-components
├── test/                # Setup e utilitário de teste (renderApp)
├── router.tsx           # Monta a árvore de rotas
└── main.tsx             # Entry point
```

Cada feature costuma ter:

```
features/<feature>/
├── screens/             # Telas (componente + *.test.tsx)
├── components/          # Componentes específicos da feature (modais, tabelas…)
├── <feature>Schema.ts   # Schema Zod + tipos inferidos (quando há formulário)
└── data.ts / types.ts   # Dados mock e modelos (quando aplicável)
```

**Princípios**

- **O que muda junto fica junto.** Evita pastas globais gigantes.
- **`components/ui` só para o reutilizável** — um estilo vira componente `ui`
  quando é usado por mais de uma tela.
- **`store/` (Zustand) guarda estado de aplicação/UI**, não dados de servidor.
- **Telas não trazem chrome** (Topbar/Sidebar); isso é responsabilidade da
  casca (`AppShell`), montada pela rota-layout.

---

## Convenções

| Item                   | Convenção              | Exemplo                     |
| ---------------------- | ---------------------- | --------------------------- |
| Componente / tela      | `PascalCase.tsx`       | `TransactionsScreen.tsx`    |
| Estilos co-localizados | `PascalCase.styles.ts` | `DashboardScreen.styles.ts` |
| Teste                  | `PascalCase.test.tsx`  | `ReportsScreen.test.tsx`    |
| Hook                   | `useCamelCase.ts`      | `useDebouncedValue.ts`      |
| Store Zustand          | `useCamelCaseStore.ts` | `useAccountsStore.ts`       |
| Arquivo de rota        | `nome.route.tsx`       | `transactions.route.tsx`    |
| Schema Zod             | `<feature>Schema.ts`   | `accountSchema.ts`          |

- **Props transientes** do styled-components usam prefixo `$` (`$variant`,
  `$active`) para não vazarem como atributos no DOM.
- **Imports internos** usam o alias `@/`, nunca caminhos relativos longos.
- Componentes/telas são **named exports**.

---

## Design system (tema tipado)

O visual segue o design system **Modernist (dark)**: fundo quase-preto, acento
coral (`#ff563c`), tipografia **Archivo**, **raio zero** e réguas de 2px.

- Tokens em [`src/styles/theme.ts`](src/styles/theme.ts) (`as const`). O tipo
  `AppTheme` é injetado no `DefaultTheme` em
  [`src/styles/styled.d.ts`](src/styles/styled.d.ts), então `theme` tem
  autocomplete dentro de qualquer `styled.x`.

```ts
const Box = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing(4)}; /* 4 * 4px */
`;
```

- Para adicionar um token, inclua-o em `theme.ts` — o tipo se propaga sozinho.
- Nunca hard-code hex/px que os tokens já carregam.

---

## Estado global (Zustand)

Cada domínio tem sua store em `src/store`. Guardam **estado da aplicação**
(contas, transações, configurações, perfil, auth) — hoje **em memória**.

```ts
export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (id) => set((s) => ({ items: [...s.items, id] })),
}));
```

No componente, selecione fatias específicas (evita re-renders):

```ts
const items = useCartStore((s) => s.items);
```

> Dados de servidor ficam no cache do **TanStack Query**, não no Zustand.

---

## Data fetching (TanStack Query)

O `QueryClientProvider` já está montado em
[`AppProviders`](src/app/AppProviders.tsx). Padrão (ver feature `users`):

```ts
export function useUsers() {
  return useQuery({ queryKey: userKeys.list(), queryFn: fetchUsers });
}
```

Derive sempre a `queryKey` de uma factory (`userKeys`) para invalidações
consistentes nas mutations.

---

## Formulários (React Hook Form + Zod)

Padrão do projeto: schema Zod como fonte única de verdade + `zodResolver`.

```tsx
const schema = z.object({ name: z.string().min(2, 'Informe o nome') });
type Values = z.infer<typeof schema>;

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<Values>({
  resolver: zodResolver(schema),
});
```

Campos com os componentes [`Field`](src/components/ui/Field.tsx) /
[`SelectField`](src/components/ui/SelectField.tsx) /
[`Checkbox`](src/components/ui/Checkbox.tsx) (encaminham `ref`, compatíveis com
`register()`). Referência completa:
[`TransactionModal`](src/features/transactions/components/TransactionModal.tsx).

---

## Roteamento e casca

TanStack Router **code-based** e tipado.

- A **casca** ([`shell.route.tsx`](src/routes/shell.route.tsx)) é uma rota-layout
  sem path que renderiza `AppShell` (Topbar + Sidebar fixos) + `<Outlet />`. As
  telas autenticadas são filhas dela e trocam só o miolo.
- `/login` fica **fora** da casca.
- A casca tem um `beforeLoad` que **exige autenticação** (senão redireciona para
  `/login`).

Árvore em [`router.tsx`](src/router.tsx):

```ts
rootRoute.addChildren([
  shellRoute.addChildren([indexRoute, transactionsRoute, reportsRoute, …]),
  loginRoute,
]);
```

---

## Autenticação

Integrada ao backend ([`useAuthStore`](src/store/useAuthStore.ts)). O usuário
inicial é criado pelo seed (`gabrielmarcato`); a senha vem de `SEED_PASSWORD`.

- `login(user, pass)` chama a API, guarda o **JWT no `localStorage`** (a sessão
  sobrevive ao F5) e seta `isAuthenticated`.
- A casca protege as rotas via `beforeLoad`.
- "Sair" (menu do usuário) chama `logout()`, limpa o token e navega para
  `/login`.

---

## Receitas: como adicionar…

### …uma tela + rota (dentro da casca)

1. Crie `src/features/<feature>/screens/<Nome>Screen.tsx` (retorna só o miolo).
2. Crie `src/routes/<nome>.route.tsx`:
   ```tsx
   export const nomeRoute = createRoute({
     getParentRoute: () => shellRoute,
     path: '/nome',
     component: NomeScreen,
   });
   ```
3. Importe e inclua em `shellRoute.addChildren([...])` no `router.tsx`.
4. (Opcional) adicione o item no `NAV_ITEMS` da
   [`Topbar`](src/components/layout/Topbar.tsx).

### …uma store Zustand

Arquivo `src/store/use<Nome>Store.ts` com estado + ações imutáveis. Exporte o
estado inicial (`initial…`) para os testes conseguirem resetar.

### …um formulário

Schema Zod (`<feature>Schema.ts`) + `useForm` + `zodResolver`, usando os campos
de `components/ui`. Veja `TransactionModal` / `ProfileModal`.

### …um item de taxonomia (Configurações)

As abas de Configurações são alimentadas por
[`useSettingsStore`](src/store/useSettingsStore.ts). Para uma nova taxonomia,
adicione a coleção lá e uma aba em
[`SettingsScreen`](src/features/settings/screens/SettingsScreen.tsx).

---

## Testes

- **Vitest + Testing Library**, ambiente `jsdom` (config em
  [`vite.config.ts`](vite.config.ts)); setup global em
  [`src/test/setup.ts`](src/test/setup.ts).
- Helper [`renderApp(path, { authenticated })`](src/test/test-utils.tsx) monta a
  **app real** (router + tema + query) a partir de um caminho, resetando todas
  as stores. Por padrão já autenticado; passe `{ authenticated: false }` para
  testar o login.

```ts
const { user } = renderApp('/transacoes');
expect(
  await screen.findByRole('heading', { name: 'Transações' }),
).toBeVisible();
```

- Telas com dados de servidor mockam a camada `api/` com `vi.mock`.

---

## Git hooks (Husky)

Como os testes de tela são pesados (montam a app inteira), a estratégia separa
rapidez de commit de segurança de push:

- **`pre-commit`** ([.husky/pre-commit](.husky/pre-commit)) — rápido:
  `lint-staged` (`eslint --fix` + `prettier --write` nos arquivos staged) +
  `typecheck`.
- **`pre-push`** ([.husky/pre-push](.husky/pre-push)) — completo:
  `typecheck` + **suíte inteira** (`vitest run`).

Instalados automaticamente no `npm install` (script `prepare`). Emergência:
`git commit --no-verify` / `git push --no-verify` (evite).

> `vitest related` não é usado no commit porque o `test-utils` monta o router
> inteiro — o grafo de módulos de qualquer teste inclui todas as telas, então
> "related" marcaria quase tudo.

---

## Backend (Fastify + SQLite)

A API vive em [`server/`](server/) — **Fastify + `node:sqlite`** (o SQLite
embutido no Node 24, um arquivo local, **sem instalar banco**).

### Rodar

```bash
npm run api:install   # instala as deps do backend (uma vez)
npm run api:seed      # cria e popula server/data.db
npm run api:dev       # sobe a API em http://localhost:3333 (watch)
```

Rode o **front** (`npm run dev`) e a **API** (`npm run api:dev`) em dois
terminais. O front aponta para `VITE_API_URL` (padrão `http://localhost:3333`).

### Estrutura

```
server/
├── src/
│   ├── server.ts        # Fastify: CORS, JWT, guarda, registra rotas, seed no boot
│   ├── db.ts            # abre o SQLite (node:sqlite) e cria o schema
│   ├── seed.ts          # popula com os mesmos dados iniciais do front
│   ├── schemas.ts       # validação Zod das rotas
│   ├── fastify.d.ts     # augmentation (decorator authenticate, payload JWT)
│   └── routes/
│       ├── auth.ts      # POST /auth/login, GET /auth/me
│       └── data.ts      # accounts, transactions, settings, imports, profile (protegidas)
└── data.db              # o "banco" (arquivo, ignorado no git)
```

### Autenticação

- `POST /auth/login` `{ username, password }` → `{ token, user }` (JWT). O
  usuário inicial vem do seed: `SEED_USERNAME` (padrão `gabrielmarcato`) /
  `SEED_PASSWORD` (hash bcrypt no banco). Defina-os em `server/.env` para não
  versionar a senha.
- Rotas de dados exigem `Authorization: Bearer <token>` (guarda `authenticate`).

### Endpoints (todas exigem token, exceto login e /health)

| Método  | Rota                                                        | Descrição   |
| ------- | ----------------------------------------------------------- | ----------- |
| POST    | `/auth/login`                                               | Autentica   |
| GET     | `/accounts` · POST · PUT `/:id` · DELETE `/:id`             | Contas      |
| GET     | `/transactions` · POST · PUT `/:id` · DELETE `/:id`         | Transações  |
| GET     | `/settings/:collection` · POST · PUT `/:id` · DELETE `/:id` | Taxonomias  |
| GET     | `/imports` · POST · DELETE `/:id`                           | Importações |
| GET/PUT | `/profile`                                                  | Perfil      |

### Migrando uma tela do Zustand para a API

Hoje só a **autenticação** está ligada ao backend; as telas de dados ainda leem
das stores Zustand (com os mesmos dados semeados). Para migrar um recurso, use o
TanStack Query com o cliente [`@/lib/api`](src/lib/api.ts):

```ts
// src/features/accounts/api.ts
import { apiFetch } from '@/lib/api';
export const fetchAccounts = () => apiFetch<Account[]>('/accounts');
export const createAccount = (input: AccountInput) =>
  apiFetch<Account>('/accounts', {
    method: 'POST',
    body: JSON.stringify(input),
  });

// hook
export function useAccounts() {
  return useQuery({ queryKey: ['accounts'], queryFn: fetchAccounts });
}
```

Depois troque, na tela, `useAccountsStore` pelos hooks de query/mutation e ajuste
o teste correspondente para **mockar `@/lib/api`** (como em
`LoginScreen.test.tsx`) — o servidor não sobe nos testes.

---

## Path aliases

`@/` aponta para `src/`. Configurado em **dois** lugares que devem ficar em
sincronia:

- [`tsconfig.app.json`](tsconfig.app.json) → `compilerOptions.paths`
- [`vite.config.ts`](vite.config.ts) → `resolve.alias`

---

## Solução de problemas

**PowerShell bloqueia `npm` (`execução de scripts foi desabilitada`)** — o
wrapper `npm.ps1` esbarra na política de execução. Opções:

- Rápido, sem mexer em nada: use o executável `.cmd` → `npm.cmd run dev`.
- Permanente (recomendado, sem admin):
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

**`esbuild` postinstall bloqueado** — alguns ambientes sandbox não rodam o
postinstall do esbuild. Se o Vite/Vitest reclamar do binário, rode
`npm rebuild esbuild` ou aprove os scripts de instalação.

**Dados somem ao recarregar** — as stores são **em memória**. A persistência
(localStorage) é um item do roadmap.
