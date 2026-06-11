---
description: >
  hire-flow-next — Full-stack hiring-flow application.
  Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 ·
  Prisma 7 + PostgreSQL · Better Auth 1.6 · React Hook Form · Zod 4
---

# hire-flow-next — Agent Instructions

## 1. Mandatory Context Retrieval

Before making any code changes:

1. Read package.json
2. Read tsconfig.json
3. Read next.config.ts
4. Read prisma/schema.prisma
5. Read relevant feature files
6. Read existing implementations before creating new ones

Never create a new pattern when an existing pattern already exists.
Prefer consistency over novelty.

> **IMPORTANT — Retrieval-led reasoning:**
> Prefer retrieval-led reasoning over pre-training-led reasoning for **any**
> Next.js, Prisma, or Better Auth task. Models' training data may describe
> older APIs. Always verify package versions from `package.json` and read
> actual source files before suggesting code.

---

## 2. Operating Principles

Prefer consistency over novelty.

When solving a problem:

1. Reuse existing code first
2. Extend existing code second
3. Create new modules third
4. Introduce abstractions last

Do not introduce patterns that do not already exist in the repository unless explicitly requested.

Prefer minimal changes that satisfy the requirement.

---

## 3. Absolute Rules

These rules are non-negotiable. Never deviate from them.

1. **App Router only.** Always use `app/` directory. Never use `pages/`.
2. **`params` and `searchParams` are async in Next.js 16.** Always `await`
   them. This is a breaking change from Next.js 15.
3. **Server Components by default.** Add `'use client'` only when you need
   hooks, event handlers, browser APIs, or stateful interactivity.
4. **`'use server'` for Server Actions.** Never expose raw database calls
   in Client Components.
5. **TypeScript strict mode.** No `any`, no `@ts-ignore` without a comment.
6. **Zod for all validation.** All form data and API input must be validated
   with Zod before touching the database.
7. **Prisma client is a singleton.** Always import from `lib/prisma.ts`,
   never instantiate `PrismaClient` inline.
8. **Never commit secrets.** Use `.env.local` for all credentials.
   Environment variable names go in `.env.example`.
9. **`npm` only.** Use `npm run <script>` — never `yarn`, `pnpm`, or `bun`.

---

## 4. Scope Rules

Only modify files necessary to complete the task.

Do not:

- Rename files
- Move files
- Refactor unrelated code
- Change architecture
- Upgrade dependencies

unless explicitly requested.

--

## 5. API Verification

Do not invent APIs.

Before suggesting code involving:

- Next.js
- React
- Prisma
- Better Auth
- Tailwind CSS
- Any dependency

Verify the API against:

1. package.json version
2. Existing project code
3. Official documentation

If verification is not possible, state assumptions explicitly.

---

## 6. Project Overview

**hire-flow-next** is a full-stack hiring-flow web application built with the
Next.js 16 App Router. The stack is:

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Framework  | Next.js 16.2.7 (App Router, Turbopack default)                    |
| UI runtime | React 19.2.4                                                      |
| Language   | TypeScript 5 (strict)                                             |
| Styling    | Tailwind CSS v4 (PostCSS plugin, no config file needed)           |
| ORM        | Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`)                 |
| Database   | PostgreSQL (via `pg` driver with Prisma adapter)                  |
| Auth       | Better Auth 1.6.15 (`better-auth`, `@better-auth/prisma-adapter`) |
| Forms      | React Hook Form 7 + `@hookform/resolvers`                         |
| Validation | Zod 4                                                             |
| Compiler   | Babel React Compiler (`babel-plugin-react-compiler`)              |
| Linter     | ESLint 9 (`eslint-config-next`)                                   |

> **Always read `package.json` first.** It is the single source of truth for
> installed versions. Never assume an API exists — verify it against the
> version in `package.json` before suggesting it. The user may add new
> packages at any time; treat `package.json` as always potentially newer than
> these instructions.

---

## 7. Repository Structure

### 7a. Current layout (what exists today)

```
hire-flow-next/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx          ← Root layout with metadata + providers
│   ├── page.tsx            ← Root route (/)
│   ├── api/
│   │   └── dashboard/
│   │       └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   └── generated/
│       └── prisma/         ← Auto-generated; never edit manually
├── lib/
│   ├── auth.ts             ← Better Auth server instance
│   └── prisma.ts           ← Prisma client singleton
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── middleware.ts           ← (create if not present; see §7)
├── .env.local              ← secrets, never committed
├── .env.example            ← variable names only
├── next.config.ts
├── tsconfig.json
└── package.json
```

### 7b. Target layout — feature-based architecture

Migrate toward this structure as features are built. New code **must** follow
this pattern; do not add to the flat `app/dashboard` structure.

```
hire-flow-next/
├── app/
│   ├── (auth)/                  ← Auth route group (no URL segment)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx           ← Unauthenticated shell layout
│   ├── (dashboard)/             ← Protected route group
│   │   ├── layout.tsx           ← Authenticated shell (sidebar, nav)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx         ← Job list
│   │   │   └── [jobId]/
│   │   │       ├── page.tsx     ← Job detail
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── candidates/
│   │   │   ├── page.tsx
│   │   │   └── [candidateId]/
│   │   │       └── page.tsx
│   │   └── applications/
│   │       ├── page.tsx
│   │       └── [applicationId]/
│   │           └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts     ← Better Auth catch-all handler
│   │   └── [other-api-routes]/
│   ├── globals.css
│   ├── layout.tsx               ← Root layout (html, body, fonts)
│   └── page.tsx                 ← Landing / redirect
│
├── features/                    ← Feature modules (co-located logic)
│   ├── auth/
│   │   ├── actions/
│   │   │   └── auth-actions.ts  ← 'use server' actions
│   │   ├── components/
│   │   │   ├── login-form.tsx   ← 'use client'
│   │   │   └── register-form.tsx
│   │   └── hooks/
│   │       └── use-session.ts
│   ├── jobs/
│   │   ├── actions/
│   │   │   └── job-actions.ts
│   │   ├── components/
│   │   │   ├── job-card.tsx
│   │   │   ├── job-list.tsx
│   │   │   └── job-form.tsx
│   │   ├── hooks/
│   │   ├── queries/
│   │   │   └── job-queries.ts   ← Prisma queries (server-only)
│   │   └── types.ts
│   ├── candidates/
│   │   ├── actions/
│   │   ├── components/
│   │   ├── queries/
│   │   └── types.ts
│   └── applications/
│       ├── actions/
│       ├── components/
│       ├── queries/
│       └── types.ts
│
├── components/                  ← Shared, reusable UI components
│   ├── ui/                      ← Primitives (button, input, modal…)
│   └── layout/                  ← Shared layout pieces (navbar, sidebar)
│
├── lib/
│   ├── auth.ts                  ← Better Auth server instance
│   ├── auth-client.ts           ← Better Auth client instance
│   ├── prisma.ts                ← Prisma singleton
│   └── utils.ts                 ← Shared utilities (cn, formatDate…)
│
├── types/
│   └── index.ts                 ← Global TypeScript types
│
├── middleware.ts                ← Auth + redirect middleware
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── public/
```

**Rule:** When creating a new page in `app/(dashboard)/jobs/`, the UI
components and Server Actions live in `features/jobs/`, not inside `app/`.
Pages are thin orchestrators; logic lives in features.

---

## 8. Naming Conventions

| Thing               | Convention                             | Example                              |
| ------------------- | -------------------------------------- | ------------------------------------ |
| Files & folders     | `kebab-case`                           | `job-card.tsx`, `job-actions.ts`     |
| React components    | `PascalCase` (named export)            | `export function JobCard()`          |
| Server Actions      | `camelCase` verb-noun                  | `createJob`, `updateCandidate`       |
| Prisma query fns    | `camelCase` verb-noun                  | `findJobById`, `listCandidates`      |
| Zod schemas         | `PascalCase` + `Schema`                | `CreateJobSchema`                    |
| Inferred TS types   | `PascalCase` (no suffix)               | `type CreateJobInput = z.infer<...>` |
| Route handlers      | `route.ts` (HTTP method exported)      | `export async function GET()`        |
| Page files          | `page.tsx`                             | `app/(dashboard)/jobs/page.tsx`      |
| Layout files        | `layout.tsx`                           | `app/(dashboard)/layout.tsx`         |
| Server-only modules | Suffix with `-server` or in `queries/` | `job-queries.ts`                     |

---

## 9. Server Client Boundaries

Never import server-only code into Client Components.

Forbidden imports inside Client Components:

- prisma
- auth server instance
- database query modules
- server actions unless supported by the framework

Database access must remain server-side.

Client Components should focus on:

- UI
- user interaction
- browser APIs

Server Components should handle:

- data fetching
- authentication
- authorization
- database access

---

## 10. Component Patterns

### 10a. Server Component (default — no directive needed)

```tsx
// features/jobs/components/job-list.tsx
// No 'use client' — runs on the server
import { listJobs } from "@/features/jobs/queries/job-queries";

export async function JobList() {
  const jobs = await listJobs();
  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>{job.title}</li>
      ))}
    </ul>
  );
}
```

### 10b. Client Component (add directive only when required)

Add `'use client'` when the component needs:

- `useState`, `useEffect`, or any React hook
- Browser APIs (`window`, `document`)
- Event handlers attached to DOM elements
- `useRouter`, `usePathname`, `useSearchParams`

```tsx
// features/jobs/components/job-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJobSchema, type CreateJobInput } from "@/features/jobs/types";
import { createJob } from "@/features/jobs/actions/job-actions";

export function JobForm() {
  const form = useForm<CreateJobInput>({
    resolver: zodResolver(CreateJobSchema),
  });

  return (
    <form action={createJob}>
      <input {...form.register("title")} placeholder="Job title" />
      {form.formState.errors.title && <p>{form.formState.errors.title.message}</p>}
      <button type="submit">Create Job</button>
    </form>
  );
}
```

### 10c. Server Action

```ts
// features/jobs/actions/job-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CreateJobSchema } from "@/features/jobs/types";

export async function createJob(formData: FormData) {
  const parsed = CreateJobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.job.create({ data: parsed.data });

  revalidatePath("/jobs");
  redirect("/jobs");
}
```

### 10d. Dynamic Route Page (Next.js 16 — async params)

**Breaking change:** `params` and `searchParams` are Promises in Next.js 16.
Always `await` them.

```tsx
// app/(dashboard)/jobs/[jobId]/page.tsx
interface JobDetailPageProps {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { jobId } = await params; // ← must await
  const job = await findJobById(jobId);
  return { title: job?.title ?? "Job Not Found" };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { jobId } = await params; // ← must await
  const job = await findJobById(jobId);
  if (!job) notFound();
  return <JobDetail job={job} />;
}
```

---

## 11. Authorization Rules

Authentication and authorization are separate concerns.

A valid session does not automatically grant access.

Always verify ownership and permissions before:

- reading records
- updating records
- deleting records
- viewing protected resources

---

## 12. Data Layer — Prisma

### 12a. Prisma client singleton

```ts
// lib/prisma.ts  (already exists — never change this pattern)
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 12b. Query pattern — keep queries in `features/<feature>/queries/`

```ts
// features/jobs/queries/job-queries.ts
// This file runs server-side only. Never import it in Client Components.
import { prisma } from "@/lib/prisma";

export async function listJobs() {
  return prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function findJobById(id: string) {
  return prisma.job.findUnique({ where: { id } });
}
```

### 12c. Prisma schema location

- Schema file: `prisma/schema.prisma`
- Generated client: `app/generated/prisma/` (auto-generated via `postinstall`)
- **Never edit files inside `app/generated/`.**

### 12d. Database scripts

```bash
npx prisma migrate dev --name <migration-name>   # create + apply new migration
npx prisma migrate deploy                        # apply migrations in CI/prod
npx prisma studio                                # GUI to inspect database
npx prisma generate                              # regenerate client after schema change
```

---

## 13. Authentication — Better Auth

### 13a. Server-side auth instance

```ts
// lib/auth.ts  (already exists)
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  // add plugins here (e.g. oauth providers)
});
```

### 13b. Client-side auth instance

```ts
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
```

### 13c. Catch-all API route

```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### 13d. Middleware — protect dashboard routes

```ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isProtected =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/jobs") ||
    request.nextUrl.pathname.startsWith("/candidates");

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 14. Validation — React Hook Form + Zod

### 14a. Schema definition (in `features/<feature>/types.ts`)

```ts
// features/jobs/types.ts
import { z } from "zod";

export const CreateJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10),
  location: z.string().optional(),
});

export const UpdateJobSchema = CreateJobSchema.partial();

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;
```

### 14b. Form component pattern

Always use `zodResolver` from `@hookform/resolvers/zod`.

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJobSchema, type CreateJobInput } from "@/features/jobs/types";

export function CreateJobForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobInput>({
    resolver: zodResolver(CreateJobSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    // call server action or API
  });

  return (
    <form onSubmit={onSubmit}>
      <input {...register("title")} />
      {errors.title && <span>{errors.title.message}</span>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Create"}
      </button>
    </form>
  );
}
```

---

## 15. Routing & Navigation

### Route groups (no URL impact)

- `(auth)` — public, unauthenticated pages
- `(dashboard)` — protected pages behind auth middleware

### Navigation

```tsx
// Server Component: use next/link
import Link from "next/link";
<Link href="/jobs">All Jobs</Link>;

// Client Component: use next/navigation
("use client");
import { useRouter, usePathname } from "next/navigation";
const router = useRouter();
router.push("/jobs/new");
```

### Route handlers (API endpoints)

Use route handlers only for:

- External webhook endpoints
- Better Auth catch-all
- REST endpoints consumed by third-party services

Prefer Server Actions for form submissions and mutations from within the app.

```ts
// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // ...
  return NextResponse.json({ data });
}
```

---

## 16. Styling — Tailwind CSS v4

This project uses **Tailwind CSS v4** via the PostCSS plugin. There is no
`tailwind.config.js` file — configuration lives in `globals.css`.

```css
/* app/globals.css */
@import "tailwindcss";

/* Custom design tokens */
@theme {
  --color-brand: oklch(60% 0.2 250);
  --font-sans: "Inter", sans-serif;
}
```

- Use utility classes directly; no need to add `content:` paths in a config.
- Arbitrary values are allowed: `w-[calc(100%-2rem)]`.
- Do not create a `tailwind.config.js` unless absolutely necessary.

---

## 17. TypeScript Rules

```ts
// ✅ Correct: typed async params (Next.js 16)
interface PageProps {
  params: Promise<{ id: string }>;
}

// ✅ Correct: infer types from Zod schemas — no duplication
type CreateJobInput = z.infer<typeof CreateJobSchema>;

// ✅ Correct: typed Prisma results
import type { Job } from "@/app/generated/prisma/client";

// ❌ Wrong: never use any
const data: any = await response.json();

// ❌ Wrong: never cast with as unless narrowing from unknown
const user = session as User;
```

- Enable `strict: true` in `tsconfig.json` (should already be set).
- Use `type` imports for types only: `import type { Job } from "..."`.
- Prefer `unknown` over `any` for truly unknown data; validate with Zod before use.

---

## 18. Data Fetching

Prefer:

- Server Components
- Server Actions
- cache()
- revalidatePath()
- revalidateTag()

Avoid unnecessary client-side fetching.

---

## 19. Error Handling

Server Actions must:

- Validate input with Zod
- Handle expected failures
- Return typed error objects

Never throw raw errors to users.

Log unexpected errors on the server.

---

## 20. Database Safety

Never use:

- deleteMany()
- updateMany()
- $executeRawUnsafe()
- $queryRawUnsafe()

unless explicitly requested.

Prefer Prisma query builders over raw SQL.

When modifying Prisma schema:

1. Show schema changes
2. Explain migration impact
3. Generate migration
4. Explain any data migration requirements

---

## 21. React Compiler

Do not add useMemo, useCallback, or memo
unless profiling proves they are needed.

React Compiler handles most optimizations.

---

## 22. Project Commands

```bash
npm run dev          # Start dev server (Turbopack, port 3000)
npm run build        # Migrate DB + production build
npm run start        # Start production server
npm run lint         # ESLint check

# Prisma
npx prisma migrate dev --name <name>   # Create and apply a migration
npx prisma generate                    # Regenerate client after schema change
npx prisma studio                      # Open Prisma Studio GUI
npx prisma db push                     # Push schema without migration (prototype only)
```

> `postinstall` runs `prisma generate` automatically after `npm install`.
> `build` runs `npx prisma migrate deploy && next build`.

---

## 23. Environment Variables

All secrets live in `.env.local` (never committed). Add variable _names only_
to `.env.example`.

| Variable              | Description                                 |
| --------------------- | ------------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string                |
| `BETTER_AUTH_SECRET`  | Random secret for Better Auth               |
| `BETTER_AUTH_URL`     | App base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Public-facing base URL                      |

When adding new environment variables:

1. Add value to `.env.local`
2. Add name + description (no value) to `.env.example`
3. Document it in this table

---

## 24. Adding New Features — Checklist

When the user asks you to add a new feature (e.g. "add interview scheduling"):

1. **Create `features/<feature-name>/`** with:
   - `types.ts` — Zod schemas + inferred types
   - `queries/` — Prisma queries (server-only)
   - `actions/` — Server Actions (`'use server'`)
   - `components/` — React components
2. **Add pages** under `app/(dashboard)/<feature-name>/`
3. **Update `prisma/schema.prisma`** if new models are needed, then run
   `npx prisma migrate dev --name add-<feature-name>`
4. **Update middleware** in `middleware.ts` or `proxy.ts` if the new routes need protection
5. **Export shared types** from `types/index.ts` if they're used across features

---

## 25. Dependency Management

The user may add new packages at any time. When a new dependency appears in
`package.json`:

1. **Read `package.json`** to identify the new package and exact version.
2. **Check its documentation** before generating code — do not guess its API.
3. **Update this file** (or the relevant section below) to document how the
   new package is used in this project.
4. Common additions you might encounter:
   - **UI libraries** (e.g. `shadcn/ui`, `radix-ui`): add components to
     `components/ui/`
   - **Email** (e.g. `resend`): create `lib/email.ts`
   - **File uploads** (e.g. `uploadthing`): create `lib/upload.ts`
   - **Date utilities** (e.g. `date-fns`): use in `lib/utils.ts`
   - **Auth providers**: add to `lib/auth.ts` Better Auth config

---

## 26. What Not To Do

- **No `pages/` directory** — App Router only.
- **No inline `new PrismaClient()`** — always use the singleton from
  `lib/prisma.ts`.
- **No raw SQL** unless using `prisma.$queryRaw` with tagged template literals
  (parameterized, never string-concatenated).
- **No bare `fetch` in Client Components** — use Server Actions or Route
  Handlers.
- **No secrets in source code** — always use environment variables.
- **No CSS files per component** — use Tailwind classes in JSX.
- **No `useEffect` for data fetching** — fetch data in Server Components
  or use a caching strategy.
- **No synchronous access to `params`** — always `await params` in Next.js 16.
- **No `getServerSideProps` / `getStaticProps`** — those are `pages/` router
  APIs. Use Server Components and `fetch` with cache options instead.

---

## 27. Task Completion Checklist

Before considering a task complete:

- TypeScript passes
- ESLint passes
- Imports are used
- No dead code exists
- No duplicated logic introduced
- No any types introduced
- No secrets added to source control
- Architecture rules followed

---

## 28. References

| Resource                    | URL                                                   |
| --------------------------- | ----------------------------------------------------- |
| Next.js 16 docs             | https://nextjs.org/docs                               |
| Better Auth docs            | https://www.better-auth.com/docs                      |
| Prisma docs                 | https://www.prisma.io/docs                            |
| Zod 4 docs                  | https://zod.dev                                       |
| React Hook Form docs        | https://react-hook-form.com                           |
| Tailwind CSS v4 docs        | https://tailwindcss.com/docs                          |
| Next.js App Router patterns | https://nextjs.org/docs/app/building-your-application |
| Next.js 16 breaking changes | https://nextjs.org/blog/next-16                       |

---

_This file is the single source of truth for Copilot and AI agent behavior
in this repository. Update it whenever the architecture, conventions, or
dependencies change._
