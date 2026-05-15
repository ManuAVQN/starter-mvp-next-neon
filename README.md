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
