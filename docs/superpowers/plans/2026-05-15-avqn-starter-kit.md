# AVQN Starter Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean, minimal Next.js starter kit that serves as the base for multiple client MVPs. Includes auth, DB, transactional emails, and a dashboard scaffold — everything else stays out of scope.

**Architecture:** Next.js App Router with three route groups (`(public)`, `(auth)`, `(app)`). Better Auth + Drizzle/Neon (Postgres.js driver) for auth & data. Resend + React Email for transactional emails. Server Components by default with Server Actions for mutations, Zod for validation.

**Tech Stack:** Next.js (latest), React (latest), TypeScript strict, Tailwind CSS 4, shadcn/ui, Better Auth, Drizzle ORM, `postgres` (Postgres.js), Neon, Resend, `@react-email/components`, Zod, pnpm.

**Spec reference:** `docs/superpowers/specs/2026-05-15-avqn-starter-kit-design.md`

**Important notes for the implementer:**

- The spec explicitly excludes automated tests (Vitest/Playwright). **Do not write tests.** Verify via `pnpm lint`, `pnpm typecheck`, `pnpm build`, and request manual testing from the user at each major checkpoint.
- The working directory `/Users/ManuAVQN/Code/starter-mvp` currently contains a previous project (PostForge). **Task 1 wipes it** — do not skip.
- Commit frequently (after each task). Pause for user confirmation after each "CHECKPOINT" task before continuing.
- The UI uses **English** for nav/CTAs ("Sign in", "Sign out", "Start") and **French** for form labels and content body. README and emails are entirely in French.
- Do not run `pnpm dev` automatically — the user runs it manually for testing.
- Tailwind 4 does not need a `tailwind.config.ts` file (CSS-based config via `globals.css`). The spec lists it but it's not required; skip it.

---

## Task 1: Clean slate, init git, scaffold Next.js

**Files:**
- Delete: every file/folder in `/Users/ManuAVQN/Code/starter-mvp` **except** `docs/`, `.claude/`, `.git/` (if any)
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, `eslint.config.mjs`
- Modify: none

- [ ] **Step 1: Inspect what currently exists**

```bash
ls -la /Users/ManuAVQN/Code/starter-mvp
```

Confirm what's there and that `docs/` (containing our spec) is present.

- [ ] **Step 2: Remove all non-protected files**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
find . -mindepth 1 -maxdepth 1 \
  ! -name 'docs' \
  ! -name '.claude' \
  ! -name '.git' \
  -exec rm -rf {} +
ls -la
```

Expected: only `docs/`, `.claude/`, and possibly `.git/` remain.

- [ ] **Step 3: Initialize git if not already present**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
[ -d .git ] || git init -b main
git status
```

If git is freshly initialized, stage everything that remains and commit as a baseline:

```bash
git add -A
git commit -m "chore: clean slate before AVQN starter scaffolding"
```

- [ ] **Step 4: Scaffold Next.js into the current directory**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
pnpm create next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --turbopack
```

If the CLI asks to overwrite existing files (because `docs/` exists), confirm yes for non-docs files only — but since we wiped everything but `docs/` and `.claude/`, this should proceed cleanly. If it complains about non-empty directory, run with `--reset-preferences` or scaffold into a temp dir and move files.

Expected: Next.js app scaffolded with TypeScript, Tailwind 4, ESLint, App Router, no `src/` directory, alias `@/*`, pnpm, Turbopack.

- [ ] **Step 5: Verify TypeScript strict mode**

Open `tsconfig.json` and ensure `"strict": true` is present in `compilerOptions`. The default scaffold sets it, but confirm:

```bash
grep -n '"strict"' tsconfig.json
```

Expected: `"strict": true,`

- [ ] **Step 6: Update package.json scripts**

Edit `package.json` to ensure these scripts exist (add `typecheck`, `db:*` placeholders — fill DB scripts in Task 4):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

(Do NOT add `db:*` scripts yet; we add them in Task 4 when drizzle-kit is installed.)

- [ ] **Step 7: Add `.env.local` to `.gitignore`**

Confirm `.gitignore` contains a line for `.env*.local` (the Next.js default `.gitignore` already does). If not, append:

```
# Local env
.env.local
```

- [ ] **Step 8: Initial commit**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
pnpm install
pnpm lint
pnpm typecheck
git add -A
git commit -m "chore: scaffold Next.js with TypeScript strict, Tailwind 4, ESLint, pnpm"
```

Expected: `pnpm lint` and `pnpm typecheck` both pass.

- [ ] **CHECKPOINT 1 — Pause and ask the user to confirm before continuing.**

Report:
- Next.js version installed (`grep '"next":' package.json`)
- That `pnpm lint` and `pnpm typecheck` passed
- Next: shadcn init + base components

---

## Task 2: Initialize shadcn/ui and install base components

**Files:**
- Create: `components.json`, `components/ui/*.tsx` (multiple, generated by shadcn), `lib/utils.ts`
- Modify: `app/globals.css` (CSS variables for theme)

- [ ] **Step 1: Run shadcn init**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
pnpm dlx shadcn@latest init
```

Answer prompts:
- Style: **Default**
- Base color: **Zinc**
- Use CSS variables: **Yes**

If the CLI is non-interactive, pass flags:

```bash
pnpm dlx shadcn@latest init -d --base-color zinc
```

Verify `components.json` was created and `lib/utils.ts` (with `cn()` helper) was created.

- [ ] **Step 2: Install required shadcn components**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
pnpm dlx shadcn@latest add button input label card dropdown-menu sidebar separator alert avatar sheet skeleton
```

Expected: files created under `components/ui/`. The `sidebar` component pulls in `sheet` and `separator` as dependencies — running them explicitly is harmless.

- [ ] **Step 3: Confirm files compile**

```bash
pnpm lint
pnpm typecheck
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: init shadcn/ui (zinc theme) with base components"
```

---

## Task 3: Create the root layout, globals, and homepage placeholder

**Files:**
- Modify: `app/layout.tsx` (Geist font, metadata)
- Modify: `app/globals.css` (already has shadcn vars — confirm no regression)
- Delete: `app/page.tsx` (will be replaced by `(public)/page.tsx` in Task 9)
- Create: none yet

- [ ] **Step 1: Update root layout with Geist font and clean metadata**

Replace contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata: Metadata = {
  title: "AVQN Starter",
  description: "Next.js starter kit",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={GeistSans.className}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Install the `geist` package**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
pnpm add geist
```

- [ ] **Step 3: Remove the scaffolded `app/page.tsx`**

```bash
rm app/page.tsx
```

(It will be re-created inside the `(public)` route group in Task 9. Until then, `/` will 404 — that's expected.)

- [ ] **Step 4: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

Expected: both pass (even though `/` 404s temporarily, the code compiles).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: root layout with Geist font, remove placeholder home"
```

---

## Task 4: Install database deps, configure Drizzle, create auth schema

**Files:**
- Create: `db/index.ts`, `db/schema/auth.ts`, `db/schema/index.ts`, `drizzle.config.ts`, `.env.example`, `.env.local` (empty placeholder, gitignored)
- Modify: `package.json` (add db scripts)

- [ ] **Step 1: Install Drizzle + Postgres.js + drizzle-kit**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

- [ ] **Step 2: Create `.env.example` with all needed variables**

Create `.env.example`:

```env
# Base de données (Neon)
# Récupère l'URL pooled depuis https://console.neon.tech → ton projet → Connection Details
DATABASE_URL=postgresql://...

# Better Auth
# Génère un secret aléatoire avec : openssl rand -base64 32
BETTER_AUTH_SECRET=
# URL de ton app (localhost en dev, URL Vercel en prod)
BETTER_AUTH_URL=http://localhost:3000

# Resend (emails transactionnels)
# Récupère ta clé sur https://resend.com/api-keys
RESEND_API_KEY=

# Email d'envoi (doit être validé dans ton compte Resend)
RESEND_FROM_EMAIL=noreply@tondomaine.com
```

- [ ] **Step 3: Create `.env.local` as an empty placeholder (gitignored)**

```bash
cp .env.example .env.local
```

(The user will fill `.env.local` with real values before running `pnpm db:push`.)

- [ ] **Step 4: Create `drizzle.config.ts`**

Create `drizzle.config.ts`:

```ts
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

- [ ] **Step 5: Create Better Auth schema in `db/schema/auth.ts`**

Create `db/schema/auth.ts`:

```ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
```

- [ ] **Step 6: Create `db/schema/index.ts`**

Create `db/schema/index.ts`:

```ts
export * from "./auth"
```

- [ ] **Step 7: Create Drizzle client `db/index.ts`**

Create `db/index.ts`:

```ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const client = postgres(process.env.DATABASE_URL!, { prepare: false })

export const db = drizzle(client, { schema })
```

(`prepare: false` is required for Neon's pooled connections.)

- [ ] **Step 8: Add db scripts to `package.json`**

Edit `package.json` `scripts`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

- [ ] **Step 9: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

Expected: both pass.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: drizzle schema + client for Better Auth tables"
```

- [ ] **CHECKPOINT 2 — Ask the user to:**

1. Fill `.env.local` with their Neon `DATABASE_URL`
2. Run `pnpm db:push` manually to confirm tables get created
3. Confirm before moving on

---

## Task 5: Install and configure Better Auth (server + client + Route Handler)

**Files:**
- Create: `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`

- [ ] **Step 1: Install Better Auth**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
pnpm add better-auth
```

- [ ] **Step 2: Create `lib/auth.ts` (server config)**

Create `lib/auth.ts`:

```ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "@/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // sendResetPassword wired in Task 7 once email helpers exist
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    // sendVerificationEmail wired in Task 7
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: true, input: true },
      lastName: { type: "string", required: true, input: true },
    },
  },
  plugins: [nextCookies()],
})
```

(The `nextCookies()` plugin is required for Server Actions to read/write Better Auth cookies properly.)

- [ ] **Step 3: Create `lib/auth-client.ts` (client config)**

Create `lib/auth-client.ts`:

```ts
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession, sendVerificationEmail, requestPasswordReset, resetPassword } = authClient
```

- [ ] **Step 4: Create the Route Handler `app/api/auth/[...all]/route.ts`**

Create `app/api/auth/[...all]/route.ts`:

```ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

- [ ] **Step 5: Add `NEXT_PUBLIC_BETTER_AUTH_URL` to `.env.example` and `.env.local`**

Append to both files (after `BETTER_AUTH_URL=...`):

```env
# Same value as BETTER_AUTH_URL but exposed to the client bundle
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

- [ ] **Step 6: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: configure Better Auth (server, client, Route Handler) with firstName/lastName"
```

- [ ] **CHECKPOINT 3 — Ask user to confirm before moving to email setup.**

---

## Task 6: Install Resend + React Email, create email templates and helpers

**Files:**
- Create: `lib/email.ts`, `emails/verification.tsx`, `emails/reset-password.tsx`, `emails/welcome.tsx`

- [ ] **Step 1: Install Resend and React Email components**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
pnpm add resend @react-email/components
```

- [ ] **Step 2: Create the verification email template**

Create `emails/verification.tsx`:

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

type Props = {
  firstName: string
  verificationUrl: string
}

export function VerificationEmail({ firstName, verificationUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Vérifiez votre adresse email</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 24px" }}>
          <Heading style={{ fontSize: "24px", color: "#000000", marginBottom: "16px" }}>
            Bienvenue, {firstName}
          </Heading>
          <Text style={{ fontSize: "16px", color: "#404040", lineHeight: "24px" }}>
            Merci de vous être inscrit. Pour activer votre compte, confirmez votre adresse email en cliquant sur le bouton ci-dessous.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={verificationUrl}
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Vérifier mon adresse email
            </Button>
          </Section>
          <Text style={{ fontSize: "14px", color: "#737373", lineHeight: "20px" }}>
            Si vous n&apos;avez pas créé de compte, ignorez cet email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default VerificationEmail
```

- [ ] **Step 3: Create the reset-password email template**

Create `emails/reset-password.tsx`:

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

type Props = {
  firstName: string
  resetUrl: string
}

export function ResetPasswordEmail({ firstName, resetUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisez votre mot de passe</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 24px" }}>
          <Heading style={{ fontSize: "24px", color: "#000000", marginBottom: "16px" }}>
            Bonjour {firstName},
          </Heading>
          <Text style={{ fontSize: "16px", color: "#404040", lineHeight: "24px" }}>
            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Réinitialiser mon mot de passe
            </Button>
          </Section>
          <Text style={{ fontSize: "14px", color: "#737373", lineHeight: "20px" }}>
            Si vous n&apos;êtes pas à l&apos;origine de cette demande, ignorez cet email. Ce lien expire dans 1 heure.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ResetPasswordEmail
```

- [ ] **Step 4: Create the welcome email template**

Create `emails/welcome.tsx`:

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

type Props = {
  firstName: string
  dashboardUrl: string
}

export function WelcomeEmail({ firstName, dashboardUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Votre compte est actif</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 24px" }}>
          <Heading style={{ fontSize: "24px", color: "#000000", marginBottom: "16px" }}>
            Votre compte est actif, {firstName}
          </Heading>
          <Text style={{ fontSize: "16px", color: "#404040", lineHeight: "24px" }}>
            Votre adresse email a été vérifiée. Vous pouvez désormais accéder à votre espace.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={dashboardUrl}
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Accéder à mon espace
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
```

- [ ] **Step 5: Create `lib/email.ts` with sender helpers**

Create `lib/email.ts`:

```ts
import { Resend } from "resend"
import { VerificationEmail } from "@/emails/verification"
import { ResetPasswordEmail } from "@/emails/reset-password"
import { WelcomeEmail } from "@/emails/welcome"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL!

export async function sendVerificationEmail(params: {
  to: string
  firstName: string
  verificationUrl: string
}) {
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Vérifiez votre adresse email",
    react: VerificationEmail({
      firstName: params.firstName,
      verificationUrl: params.verificationUrl,
    }),
  })
}

export async function sendResetPasswordEmail(params: {
  to: string
  firstName: string
  resetUrl: string
}) {
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Réinitialisez votre mot de passe",
    react: ResetPasswordEmail({
      firstName: params.firstName,
      resetUrl: params.resetUrl,
    }),
  })
}

export async function sendWelcomeEmail(params: {
  to: string
  firstName: string
  dashboardUrl: string
}) {
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Votre compte est actif",
    react: WelcomeEmail({
      firstName: params.firstName,
      dashboardUrl: params.dashboardUrl,
    }),
  })
}
```

- [ ] **Step 6: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Resend + React Email templates (verification, reset, welcome)"
```

---

## Task 7: Wire email helpers into Better Auth config

**Files:**
- Modify: `lib/auth.ts`

- [ ] **Step 1: Update `lib/auth.ts` to call email helpers**

Replace `lib/auth.ts` with:

```ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "@/db"
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
} from "@/lib/email"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        to: user.email,
        firstName: (user as { firstName?: string }).firstName ?? user.name,
        resetUrl: url,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      // Construct custom URL pointing to our /verify-email page (per spec)
      // The page will call the Better Auth API to actually verify the token.
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${encodeURIComponent(token)}`
      await sendVerificationEmail({
        to: user.email,
        firstName: (user as { firstName?: string }).firstName ?? user.name,
        verificationUrl,
      })
    },
    afterEmailVerification: async (user) => {
      // NOTE: This callback name is `afterEmailVerification` in Better Auth ≥1.6.
      // If you see a TypeScript error here, your installed version may use a
      // different key — either remove this block (welcome email is optional)
      // or rename to match the version's API.
      await sendWelcomeEmail({
        to: user.email,
        firstName: (user as { firstName?: string }).firstName ?? user.name,
        dashboardUrl: `${process.env.BETTER_AUTH_URL}/dashboard`,
      })
    },
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: true, input: true },
      lastName: { type: "string", required: true, input: true },
    },
  },
  plugins: [nextCookies()],
})
```

(Note: `afterEmailVerification` is the hook name in Better Auth ≥1.6. If the running version uses a different name, fall back to omitting the welcome email — flag this to the user and skip it.)

- [ ] **Step 2: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: wire verification/reset/welcome emails into Better Auth"
```

- [ ] **CHECKPOINT 4 — Pause and ask user to confirm before building routes.**

---

## Task 8: Middleware for protected routes

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts` at the project root**

Create `middleware.ts`:

```ts
import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/analytics/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
}
```

Important: `getSessionCookie` only checks for cookie presence. Server-side `auth.api.getSession()` calls in pages remain the source of truth for actual session validity. This is the Better Auth-recommended pattern.

- [ ] **Step 2: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: middleware protecting (app) routes"
```

---

## Task 9: Public route group — homepage + navbar

**Files:**
- Create: `app/(public)/layout.tsx`, `app/(public)/page.tsx`, `components/navbar.tsx`, `components/sign-out-button.tsx`

- [ ] **Step 1: Create the navbar component**

Create `components/navbar.tsx`:

```tsx
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"

export async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          AVQN Starter
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">{session.user.name}</span>
              <SignOutButton />
            </>
          ) : (
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Create the sign-out button (client component)**

Create `components/sign-out-button.tsx`:

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
      },
    })
    setLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={loading}>
      Sign out
    </Button>
  )
}
```

- [ ] **Step 3: Create the public layout**

Create `app/(public)/layout.tsx`:

```tsx
import { Navbar } from "@/components/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16">{children}</main>
    </>
  )
}
```

- [ ] **Step 4: Create the homepage**

Create `app/(public)/page.tsx`:

```tsx
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const startHref = session ? "/dashboard" : "/sign-up"

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        AVQN Starter Kit
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">
        Une base Next.js minimale et moderne pour démarrer vos MVPs.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href={startHref}>Start</Link>
      </Button>
    </div>
  )
}
```

- [ ] **Step 5: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: public homepage with conditional Start button + navbar"
```

---

## Task 10: Auth routes — layout + sign-up + sign-in

**Files:**
- Create: `app/(auth)/layout.tsx`, `app/(auth)/sign-up/page.tsx`, `app/(auth)/sign-up/sign-up-form.tsx`, `app/(auth)/sign-up/check-email/page.tsx`, `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-in/sign-in-form.tsx`

- [ ] **Step 1: Create the auth layout**

Create `app/(auth)/layout.tsx`:

```tsx
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="text-lg font-semibold">
            AVQN Starter
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Create the sign-up form (client component)**

Create `app/(auth)/sign-up/sign-up-form.tsx`:

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const schema = z
  .object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export function SignUpForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const parsed = schema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Données invalides")
      setLoading(false)
      return
    }

    const { firstName, lastName, email, password } = parsed.data

    const { error } = await authClient.signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
    })

    if (error) {
      setError(error.message ?? "Une erreur est survenue")
      setLoading(false)
      return
    }

    router.push("/sign-up/check-email")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Création..." : "Créer mon compte"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Create the sign-up page**

Create `app/(auth)/sign-up/page.tsx`:

```tsx
import Link from "next/link"
import { SignUpForm } from "./sign-up-form"

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Créer un compte</h1>
        <p className="text-sm text-muted-foreground">
          Rejoignez AVQN Starter en quelques secondes.
        </p>
      </div>
      <SignUpForm />
      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/sign-in" className="font-medium text-foreground hover:underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Create the "check your email" page**

Create `app/(auth)/sign-up/check-email/page.tsx`:

```tsx
export default function CheckEmailPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Vérifiez votre boîte mail</h1>
      <p className="text-sm text-muted-foreground">
        Nous venons de vous envoyer un email avec un lien de confirmation. Cliquez dessus pour activer votre compte.
      </p>
    </div>
  )
}
```

- [ ] **Step 5: Create the sign-in form**

Create `app/(auth)/sign-in/sign-in-form.tsx`:

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
})

export function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showResend, setShowResend] = useState(false)
  const [resendEmail, setResendEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setShowResend(false)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const parsed = schema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Données invalides")
      setLoading(false)
      return
    }

    const { email, password } = parsed.data

    const { error } = await authClient.signIn.email({ email, password })

    if (error) {
      if (error.status === 403 || /verif/i.test(error.message ?? "")) {
        setError("Veuillez vérifier votre adresse email avant de vous connecter.")
        setResendEmail(email)
        setShowResend(true)
      } else {
        setError(error.message ?? "Identifiants invalides")
      }
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  async function resendVerification() {
    if (!resendEmail) return
    setLoading(true)
    await authClient.sendVerificationEmail({
      email: resendEmail,
      callbackURL: "/dashboard",
    })
    setLoading(false)
    setShowResend(false)
    setError("Email de vérification renvoyé.")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {showResend && (
        <Button type="button" variant="outline" className="w-full" onClick={resendVerification} disabled={loading}>
          Renvoyer l&apos;email de vérification
        </Button>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 6: Create the sign-in page**

Create `app/(auth)/sign-in/page.tsx`:

```tsx
import Link from "next/link"
import { SignInForm } from "./sign-in-form"

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Connexion</h1>
        <p className="text-sm text-muted-foreground">Accédez à votre espace.</p>
      </div>
      <SignInForm />
      <div className="space-y-1 text-center text-sm text-muted-foreground">
        <p>
          <Link href="/forgot-password" className="font-medium text-foreground hover:underline">
            Mot de passe oublié ?
          </Link>
        </p>
        <p>
          Pas encore de compte ?{" "}
          <Link href="/sign-up" className="font-medium text-foreground hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: sign-up + sign-in pages with Zod validation and resend verification"
```

---

## Task 11: Auth routes — forgot-password, reset-password, verify-email

**Files:**
- Create: `app/(auth)/forgot-password/page.tsx`, `app/(auth)/forgot-password/forgot-form.tsx`, `app/(auth)/reset-password/page.tsx`, `app/(auth)/reset-password/reset-form.tsx`, `app/(auth)/verify-email/page.tsx`, `app/(auth)/verify-email/verify-client.tsx`

- [ ] **Step 1: Create the forgot-password form**

Create `app/(auth)/forgot-password/forgot-form.tsx`:

```tsx
"use client"

import { useState } from "react"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const schema = z.object({ email: z.string().email("Email invalide") })

export function ForgotForm() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const parsed = schema.safeParse({ email: formData.get("email") })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Email invalide")
      setLoading(false)
      return
    }

    const { error } = await authClient.requestPasswordReset({
      email: parsed.data.email,
      redirectTo: "/reset-password",
    })

    if (error) {
      setError(error.message ?? "Une erreur est survenue")
      setLoading(false)
      return
    }

    setMessage("Si un compte existe pour cette adresse, un email de réinitialisation a été envoyé.")
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Envoi..." : "Envoyer le lien"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Create the forgot-password page**

Create `app/(auth)/forgot-password/page.tsx`:

```tsx
import Link from "next/link"
import { ForgotForm } from "./forgot-form"

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Mot de passe oublié</h1>
        <p className="text-sm text-muted-foreground">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>
      <ForgotForm />
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="font-medium text-foreground hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Create the reset-password form**

Create `app/(auth)/reset-password/reset-form.tsx`:

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const schema = z
  .object({
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export function ResetForm({ token }: { token: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const parsed = schema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Données invalides")
      setLoading(false)
      return
    }

    const { error } = await authClient.resetPassword({
      newPassword: parsed.data.password,
      token,
    })

    if (error) {
      setError(error.message ?? "Le lien est invalide ou expiré")
      setLoading(false)
      return
    }

    router.push("/sign-in")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Mise à jour..." : "Mettre à jour"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 4: Create the reset-password page**

Create `app/(auth)/reset-password/page.tsx`:

```tsx
import { ResetForm } from "./reset-form"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Lien invalide</h1>
        <p className="text-sm text-muted-foreground">
          Le lien de réinitialisation est incomplet. Demandez-en un nouveau.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Nouveau mot de passe</h1>
        <p className="text-sm text-muted-foreground">
          Choisissez un mot de passe sécurisé pour votre compte.
        </p>
      </div>
      <ResetForm token={token} />
    </div>
  )
}
```

- [ ] **Step 5: Create the verify-email client component**

Create `app/(auth)/verify-email/verify-client.tsx`:

```tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Status = "loading" | "success" | "error"

export function VerifyClient({ token }: { token: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("loading")
  const [message, setMessage] = useState("Vérification en cours...")

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
          method: "GET",
        })
        if (cancelled) return
        if (res.ok) {
          setStatus("success")
          setMessage("Email vérifié. Redirection en cours...")
          setTimeout(() => router.push("/dashboard"), 1500)
        } else {
          setStatus("error")
          setMessage("Le lien est invalide ou expiré.")
        }
      } catch {
        if (cancelled) return
        setStatus("error")
        setMessage("Une erreur réseau est survenue.")
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token, router])

  return (
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold">
        {status === "success" ? "Compte vérifié" : status === "error" ? "Vérification impossible" : "Vérification..."}
      </h1>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
```

- [ ] **Step 6: Create the verify-email page**

Create `app/(auth)/verify-email/page.tsx`:

```tsx
import { VerifyClient } from "./verify-client"

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Lien invalide</h1>
        <p className="text-sm text-muted-foreground">
          Le lien de vérification est incomplet.
        </p>
      </div>
    )
  }

  return <VerifyClient token={token} />
}
```

- [ ] **Step 7: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: forgot/reset password and verify-email flows"
```

- [ ] **CHECKPOINT 5 — Pause: ask the user to manually test sign-up → email → verify → sign-in flow before continuing.**

---

## Task 12: Protected layout — sidebar, user menu, dashboard wrapper

**Files:**
- Create: `components/sidebar-nav.tsx`, `components/user-menu.tsx`, `app/(app)/layout.tsx`

- [ ] **Step 1: Create the sidebar-nav component**

Create `components/sidebar-nav.tsx`:

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FolderKanban, FileText, LayoutDashboard, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/dashboard" className="text-sm font-semibold">
          AVQN Starter
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
```

- [ ] **Step 2: Create the user-menu component**

Create `components/user-menu.tsx`:

```tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu({ name }: { name: string }) {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">{name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 3: Create the protected layout**

Create `app/(app)/layout.tsx`:

```tsx
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserMenu } from "@/components/user-menu"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b border-border px-4">
          <SidebarTrigger />
          <UserMenu name={session.user.name} />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

(Even though middleware blocks unauthenticated access, the server-side session check here is the source of truth — middleware only checks cookie presence.)

- [ ] **Step 4: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: protected layout with sidebar and user menu"
```

---

## Task 13: Dashboard + placeholder pages

**Files:**
- Create: `app/(app)/dashboard/page.tsx`, `app/(app)/projects/page.tsx`, `app/(app)/analytics/page.tsx`, `app/(app)/reports/page.tsx`

- [ ] **Step 1: Create dashboard page**

Create `app/(app)/dashboard/page.tsx`:

```tsx
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>
      <p className="text-muted-foreground">
        Bienvenue, {session?.user.name}. Votre espace est prêt.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create projects placeholder**

Create `app/(app)/projects/page.tsx`:

```tsx
export default function ProjectsPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <p className="text-muted-foreground">À personnaliser pour votre projet.</p>
    </div>
  )
}
```

- [ ] **Step 3: Create analytics placeholder**

Create `app/(app)/analytics/page.tsx`:

```tsx
export default function AnalyticsPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="text-muted-foreground">À personnaliser pour votre projet.</p>
    </div>
  )
}
```

- [ ] **Step 4: Create reports placeholder**

Create `app/(app)/reports/page.tsx`:

```tsx
export default function ReportsPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <p className="text-muted-foreground">À personnaliser pour votre projet.</p>
    </div>
  )
}
```

- [ ] **Step 5: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: dashboard + placeholder pages (projects, analytics, reports)"
```

---

## Task 14: Settings page + Server Actions

**Files:**
- Create: `lib/actions/account.ts`, `app/(app)/settings/page.tsx`, `app/(app)/settings/profile-form.tsx`, `app/(app)/settings/password-form.tsx`

- [ ] **Step 1: Create the account Server Actions**

Create `lib/actions/account.ts`:

```ts
"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user } from "@/db/schema"

const profileSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    newPassword: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type ActionResult = { success: true } | { success: false; error: string }

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { success: false, error: "Non authentifié" }

  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" }
  }

  const { firstName, lastName, email } = parsed.data

  await db
    .update(user)
    .set({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id))

  revalidatePath("/settings")
  return { success: true }
}

export async function updatePassword(formData: FormData): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { success: false, error: "Non authentifié" }

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" }
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mot de passe actuel incorrect"
    return { success: false, error: message }
  }

  return { success: true }
}
```

- [ ] **Step 2: Create the profile form**

Create `app/(app)/settings/profile-form.tsx`:

```tsx
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/lib/actions/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Props = {
  defaultValues: { firstName: string; lastName: string; email: string }
}

export function ProfileForm({ defaultValues }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function action(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.success) {
        setMessage({ type: "success", text: "Profil mis à jour." })
        router.refresh()
      } else {
        setMessage({ type: "error", text: result.error })
      }
    })
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" defaultValue={defaultValues.firstName} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" defaultValue={defaultValues.lastName} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultValues.email} required />
      </div>
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Sauvegarde..." : "Sauvegarder"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Create the password form**

Create `app/(app)/settings/password-form.tsx`:

```tsx
"use client"

import { useRef, useState, useTransition } from "react"
import { updatePassword } from "@/lib/actions/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PasswordForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function action(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await updatePassword(formData)
      if (result.success) {
        setMessage({ type: "success", text: "Mot de passe mis à jour." })
        formRef.current?.reset()
      } else {
        setMessage({ type: "error", text: result.error })
      }
    })
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input id="newPassword" name="newPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Sauvegarde..." : "Changer le mot de passe"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 4: Create the settings page**

Create `app/(app)/settings/page.tsx`:

```tsx
import { headers } from "next/headers"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user } from "@/db/schema"
import { ProfileForm } from "./profile-form"
import { PasswordForm } from "./password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const [account] = await db.select().from(user).where(eq(user.id, session.user.id))

  if (!account) redirect("/sign-in")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Paramètres du compte</h1>
        <p className="text-sm text-muted-foreground">
          Mettez à jour vos informations personnelles et votre mot de passe.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Modifiez vos informations personnelles.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              firstName: account.firstName,
              lastName: account.lastName,
              email: account.email,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mot de passe</CardTitle>
          <CardDescription>Changez votre mot de passe.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 5: Verify lint + typecheck**

```bash
pnpm lint
pnpm typecheck
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: settings page with profile + password Server Actions"
```

- [ ] **CHECKPOINT 6 — Pause: ask user to manually test the settings page (profile update + password change).**

---

## Task 15: README and final verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create the README in French**

Create `README.md`:

````markdown
# AVQN Starter Kit

Un starter Next.js minimal et moderne pour démarrer rapidement des projets MVP. Authentification complète, base de données, emails transactionnels, dashboard prêt à l'emploi.

## Prérequis

- Node.js 20+
- pnpm (`npm i -g pnpm`)
- Un compte [Neon](https://neon.tech) (base de données Postgres serverless)
- Un compte [Resend](https://resend.com) (envoi d'emails transactionnels)
- Un compte [Vercel](https://vercel.com) (pour le déploiement)

## Installation

### 1. Installer les dépendances

```bash
pnpm install
```

### 2. Configurer les variables d'environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env.local
```

Remplissez `.env.local` avec vos valeurs :

- `DATABASE_URL` — URL pooled de votre projet Neon. Récupérez-la depuis [console.neon.tech](https://console.neon.tech) → votre projet → **Connection Details**.
- `BETTER_AUTH_SECRET` — Secret aléatoire pour signer les sessions. Générez-en un avec :
  ```bash
  openssl rand -base64 32
  ```
- `BETTER_AUTH_URL` — URL de votre app (en dev : `http://localhost:3000`).
- `NEXT_PUBLIC_BETTER_AUTH_URL` — Identique à `BETTER_AUTH_URL`, mais exposé au client.
- `RESEND_API_KEY` — Clé API depuis [resend.com/api-keys](https://resend.com/api-keys).
- `RESEND_FROM_EMAIL` — Email d'envoi (doit être validé dans votre compte Resend).

### 3. Initialiser la base de données

```bash
pnpm db:push
```

Cette commande crée les tables (`user`, `session`, `account`, `verification`) sur votre base Neon.

### 4. Lancer le serveur de développement

```bash
pnpm dev
```

L'app est disponible sur [http://localhost:3000](http://localhost:3000).

## Déploiement sur Vercel

1. Poussez votre code sur GitHub.
2. Sur [vercel.com](https://vercel.com), importez le repo.
3. Configurez les mêmes variables d'environnement que dans `.env.local`. Pensez à utiliser l'URL Vercel pour `BETTER_AUTH_URL` et `NEXT_PUBLIC_BETTER_AUTH_URL`.
4. Déployez.

## Structure du projet

```
app/                  Pages Next.js (App Router)
  (public)/           Routes publiques (home)
  (auth)/             Routes d'authentification
  (app)/              Routes protégées (dashboard, settings)
  api/auth/           Route Handler Better Auth
components/           Composants partagés (navbar, sidebar, user-menu)
  ui/                 Composants shadcn/ui (ne pas modifier)
db/                   Drizzle ORM
  schema/             Tables (auth)
emails/               Templates React Email
lib/                  Logique métier
  actions/            Server Actions
  auth.ts             Config Better Auth (serveur)
  auth-client.ts      Config Better Auth (client)
  email.ts            Helpers Resend
middleware.ts         Protection des routes (app)/
```

## Scripts disponibles

| Script | Description |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build de production |
| `pnpm start` | Serveur de production |
| `pnpm lint` | Lint ESLint |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm db:generate` | Génère une migration Drizzle |
| `pnpm db:push` | Pousse le schéma sur la base (mode dev) |
| `pnpm db:studio` | Lance Drizzle Studio |

## Stack technique

- [Next.js](https://nextjs.org) — Framework React (App Router)
- [React](https://react.dev) — UI
- [TypeScript](https://www.typescriptlang.org) — Typage strict
- [Tailwind CSS](https://tailwindcss.com) — Styles
- [shadcn/ui](https://ui.shadcn.com) — Composants UI
- [Better Auth](https://www.better-auth.com) — Authentification
- [Drizzle ORM](https://orm.drizzle.team) — ORM TypeScript
- [Neon](https://neon.tech) — Postgres serverless
- [Resend](https://resend.com) — Emails transactionnels
- [React Email](https://react.email) — Templates d'emails
- [Zod](https://zod.dev) — Validation
````

- [ ] **Step 2: Run full verification**

```bash
cd /Users/ManuAVQN/Code/starter-mvp
pnpm lint
pnpm typecheck
pnpm build
```

Expected: all three commands pass. If `pnpm build` fails due to missing env vars at build time, the user must have populated `.env.local` first.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: add README with installation and deployment guide"
```

- [ ] **CHECKPOINT 7 — Final report:**

Summarize for the user:
- All files created (high-level)
- All shadcn components installed
- All dependencies added (with versions)
- Confirmation that `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass
- Reminder: user must run `pnpm db:push` once `.env.local` is populated, then `pnpm dev` to test the full flow
- Full validation checklist from the spec (Section 14) — ask the user to confirm each item by manually testing

---

## Validation checklist (final)

Cross-check against the spec before declaring done:

- [ ] `pnpm install` passes without error
- [ ] `pnpm lint` passes without error
- [ ] `pnpm typecheck` passes without error
- [ ] `pnpm db:push` creates the tables on Neon (user-tested)
- [ ] `pnpm dev` starts without critical warnings (user-tested)
- [ ] Sign-up flow works at `/sign-up` (user-tested)
- [ ] Verification email received via Resend (user-tested)
- [ ] Verification link activates the account (user-tested)
- [ ] Sign-in at `/sign-in` redirects to `/dashboard` (user-tested)
- [ ] Sidebar renders and navigation works (user-tested)
- [ ] Profile editable in `/settings` (user-tested)
- [ ] Sign-out via navbar/user menu works (user-tested)
- [ ] Middleware blocks `/dashboard` when not authenticated (user-tested)
- [ ] `/forgot-password` sends reset email (user-tested)
- [ ] Reset password flow works (user-tested)
- [ ] Responsive on mobile/tablet/desktop (user-tested)
