---
description: hire-flow-next · Next.js 16 · React 19 · TS5 · Tailwind v4 · Prisma 7/PG · Better Auth 1.6 · RHF 7 · Zod 4
---

# hire-flow-next — Agent Rules

> **Retrieval-first:** Read `package.json` (version source-of-truth), `tsconfig.json`, `prisma/schema.prisma`, and existing feature files before writing any code. Never invent APIs — verify against the installed version.

## Stack

| Layer              | Package                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Framework          | next@16.2.7 (App Router, Turbopack default)                                               |
| Styling            | tailwindcss@4 — PostCSS only, config via `globals.css @theme {}`, no `tailwind.config.js` |
| ORM                | prisma@7 + `@prisma/adapter-pg` + `pg`                                                    |
| Auth               | better-auth@1.6.15 + `@better-auth/prisma-adapter`                                        |
| Forms / Validation | react-hook-form@7 + `@hookform/resolvers` + zod@4                                         |
| Compiler           | babel-plugin-react-compiler (no manual `useMemo`/`useCallback`/`memo`)                    |

## Absolute Rules

- **App Router only** — `app/` dir; never `pages/`
- **`params`/`searchParams` are Promises** in Next.js 16 — always `await` them
- **Server Components by default** — add `'use client'` only for hooks, events, or browser APIs
- **Server Actions = `'use server'`** — never call DB directly from Client Components
- **TypeScript strict** — no `any`; use `unknown` + Zod for external data; `import type` for type-only imports
- **Zod validates all input** before every DB write
- **Prisma = singleton** — import from `lib/prisma.ts` only; never `new PrismaClient()` inline
- **npm only** — never yarn/pnpm/bun
- **No secrets in source** — values in `.env.local`, names only in `.env.example`
- **Minimal scope** — touch only files required by the task; no renames, refactors, or dep upgrades unless asked

## Feature-Based Structure (target — all new code must follow this)

```
app/
  (auth)/login/ register/ layout.tsx       ← public route group
  (dashboard)/layout.tsx                   ← auth shell (sidebar/nav)
    dashboard/ jobs/[jobId]/ candidates/[id]/ applications/[id]/
  api/auth/[...all]/route.ts               ← Better Auth catch-all only
features/<name>/
  types.ts        ← Zod schemas + z.infer<> types
  queries/        ← Prisma queries, server-side only
  actions/        ← 'use server' Server Actions
  components/     ← co-located UI ('use client' where needed)
  hooks/          ← client-only hooks
components/ui/    ← shared primitives
components/layout/
lib/auth.ts  auth-client.ts  prisma.ts  utils.ts
types/index.ts    ← cross-feature types
middleware.ts     ← session check + redirect
```

Pages are thin orchestrators. All logic lives in `features/`.

## Naming

| Thing             | Convention                 | Example                     |
| ----------------- | -------------------------- | --------------------------- |
| Files/folders     | kebab-case                 | `job-card.tsx`              |
| Components        | PascalCase named export    | `export function JobCard()` |
| Actions / queries | camelCase verb-noun        | `createJob`, `findJobById`  |
| Zod schemas       | PascalCase + `Schema`      | `CreateJobSchema`           |
| Inferred types    | PascalCase via `z.infer<>` | `type CreateJobInput`       |

## Key Patterns (rules — no code examples needed)

- **Server Action flow:** `'use server'` → `Schema.safeParse()` → DB write → `revalidatePath()` → `redirect()`
- **Dynamic page:** `params: Promise<{ id: string }>` — always destructure after `await params`
- **Form:** `useForm<T>({ resolver: zodResolver(Schema) })` using `@hookform/resolvers/zod`
- **Queries:** in `features/<name>/queries/` only — never inside components or actions files
- **Route handlers:** only for Better Auth catch-all, webhooks, or third-party REST consumers
- **Auth middleware:** `auth.api.getSession({ headers: request.headers })` — redirect to `/login` if no session
- **Auth catch-all:** `export const { GET, POST } = toNextJsHandler(auth)` in `app/api/auth/[...all]/route.ts`

## Forbidden

- `pages/` directory · inline `new PrismaClient()` · `useEffect` for data fetching
- `getServerSideProps` / `getStaticProps` · synchronous `params` access
- `$queryRawUnsafe` / `$executeRawUnsafe` · `deleteMany()` / `updateMany()` without explicit request
- `fetch` in Client Components (use Server Actions or Route Handlers)
- Per-component CSS files · `any` type · `as` casts except `unknown` narrowing

## New Feature Checklist

1. `features/<name>/types.ts` — schemas + types
2. `features/<name>/queries/` — Prisma reads/writes
3. `features/<name>/actions/` — mutations
4. `features/<name>/components/` — UI
5. `app/(dashboard)/<name>/page.tsx` — thin page
6. Schema changes → `npx prisma migrate dev --name add-<name>`
7. Add new protected paths to `middleware.ts`

## New Dependency Protocol

1. Read `package.json` for exact version; check official docs before generating any code
2. Placement: UI lib → `components/ui/` · email → `lib/email.ts` · uploads → `lib/upload.ts` · auth provider → `lib/auth.ts`

## Commands

```bash
npm run dev|build|start|lint
npx prisma migrate dev --name <n> | generate | studio | db push
```

`postinstall` = `prisma generate` · `build` = `prisma migrate deploy && next build`

## Env Vars

`DATABASE_URL` · `BETTER_AUTH_SECRET` · `BETTER_AUTH_URL` · `NEXT_PUBLIC_APP_URL`

## Task Completion Gate

TypeScript passes · ESLint passes · no unused imports · no `any` · no dead code · no secrets in source · architecture rules followed

## Output Constraint

For simple, well-scoped tasks (component, action, query, type, bug fix): **output code only** — no preamble, no explanation, no closing summary unless explicitly asked.
