# STACK.md

Conventions techniques du starter kit AVQN. Lu par Claude pour produire du code aligné avec la stack effectivement livrée.

---

## Versions et dépendances clés

À mettre à jour à chaque évolution majeure du starter.

- **Next.js** : 16.x (App Router, React 19, Turbopack par défaut)
- **TypeScript** : 5.x (strict mode activé)
- **Tailwind CSS** : 4.x (config CSS-based dans `app/globals.css`, **pas** de `tailwind.config.ts`)
- **shadcn/ui** : composants pré-installés dans `components/ui/` (preset `nova`, palette neutre noir/blanc/gris)
- **Better Auth** : 1.6.x (email/password + email verification + password reset)
- **Drizzle ORM** : 0.45.x + `drizzle-kit` 0.31.x
- **Postgres driver** : `postgres` (Postgres.js), **pas** `pg`
- **Resend** : 6.x + `@react-email/components` 1.x
- **Zod** : 4.x
- **Geist** : 1.x (police par défaut, déjà importée dans `app/layout.tsx`)
- **lucide-react** : icônes (déjà installées)
- **pnpm** : package manager imposé

---

## Conventions Next.js 16

### App Router uniquement

- `app/` est la seule racine de routes. Pas de `pages/`.
- Server components par défaut. `"use client"` uniquement quand strictement nécessaire :
  - Hooks (`useState`, `useEffect`, `useTransition`, etc.)
  - Event handlers DOM
  - APIs navigateur

### Route groups en place

- `app/(public)/` — routes publiques (homepage)
- `app/(auth)/` — sign-up, sign-in, forgot-password, reset-password, verify-email (non protégées)
- `app/(app)/` — dashboard, settings, et toutes les routes protégées
- `app/api/auth/[...all]/route.ts` — Route Handler Better Auth

### Protection des routes

- **`proxy.ts` à la racine** (renommé de `middleware.ts` — convention Next 16) : vérifie la présence du cookie de session via `getSessionCookie` et redirige vers `/sign-in` si absent.
- Matcher : `/(dashboard|projects|analytics|reports|settings)(/.*)?`
- Pour les nouvelles routes protégées : ajouter le segment au matcher.
- **Double-check serveur obligatoire** : chaque layout/page protégée appelle aussi `auth.api.getSession({ headers: await headers() })`. Le proxy n'est qu'un filtre rapide ; la source de vérité reste server-side.

### Server Actions

- Fichiers `lib/actions/[domain].ts`, marqués `"use server"` en tête.
- Retournent `{ success: true } | { success: false; error: string }` (type `ActionResult`).
- Validation d'entrée systématique avec Zod (`safeParse`).
- Appellent `revalidatePath(...)` quand des données affichées ont été modifiées.

### Route Handlers

- Réservés aux webhooks et endpoints publics non liés à l'UI (ex : `/api/auth/[...all]`).
- Pour les mutations UI → **Server Actions**, pas Route Handlers.

### `headers()` et `searchParams`

- En Next 16 ce sont des Promises. Toujours `await headers()` et `await searchParams`.

---

## Conventions Drizzle

### Schémas

- Un fichier par domaine dans `db/schema/`. Le schéma auth est déjà fourni dans `db/schema/auth.ts`.
- Tout exporter depuis `db/schema/index.ts`.
- Timestamps systématiques : `createdAt`, `updatedAt` avec `defaultNow()` + `.notNull()`.
- Pour les IDs Better Auth : `text("id").primaryKey()` (Better Auth gère la génération).
- Pour les nouvelles tables custom : `uuid("id").defaultRandom().primaryKey()` est une option simple.

### Client Drizzle

- Défini dans `db/index.ts` avec `drizzle-orm/postgres-js` + `postgres` driver.
- `{ prepare: false }` est requis pour les connexions pooled Neon — ne pas l'enlever.

### Migrations (phase MVP)

- Modifier le schéma → `pnpm db:push` directement (pas de migrations versionnées en MVP).
- `pnpm db:generate` génère une migration si besoin de l'archiver, mais elle n'est pas appliquée automatiquement.
- En cas d'erreur de push : adapter le schéma, retenter. Pas de rollback en MVP.

### Chargement de `.env.local`

- Les scripts `db:*` utilisent `node --env-file=.env.local ./node_modules/drizzle-kit/bin.cjs ...` parce que drizzle-kit ne charge pas `.env.local` automatiquement.
- Ne pas modifier ces scripts sauf si nécessaire.

---

## Conventions Better Auth

### Configuration serveur

- `lib/auth.ts` : `betterAuth()` avec `drizzleAdapter`, `emailAndPassword` (avec `requireEmailVerification: true`), `emailVerification` (avec `sendOnSignUp: true` + `autoSignInAfterVerification: true`), `nextCookies()` plugin.
- Les callbacks `sendVerificationEmail`, `sendResetPassword`, `afterEmailVerification` envoient via Resend depuis `lib/email.ts`.
- Champs additionnels `firstName` + `lastName` sont déclarés dans `user.additionalFields` (et présents dans la table `user`).

### Client

- `lib/auth-client.ts` : `createAuthClient` avec `inferAdditionalFields<typeof auth>()` plugin (pour que TS connaisse firstName/lastName).
- Méthodes principales : `signIn`, `signUp`, `signOut`, `useSession`, `sendVerificationEmail`, `requestPasswordReset` (note : c'est `requestPasswordReset`, **pas** `forgetPassword`), `resetPassword`.

### Patterns de session

- Server Component / Server Action : `const session = await auth.api.getSession({ headers: await headers() })`
- Client Component : `const { data: session } = authClient.useSession()`
- Layout protégé : redirige vers `/sign-in` si `!session`.

### Changement d'email

- **Hors scope V1.** Le formulaire de settings affiche l'email en read-only.
- Pour permettre les changements d'email, utiliser le flow `changeEmail` natif de Better Auth (avec re-verification) — ne **pas** écrire l'email directement dans la table `user`, ça crée une faille de sécurité (emailVerified resterait à true).

---

## Conventions Tailwind 4 + shadcn

### Tailwind 4

- Pas de `tailwind.config.ts`. Toute la config (theme, variants, layers) vit dans `app/globals.css`.
- Plugins via `@import` ou `@plugin` dans `globals.css`.
- Pour customiser le theme : ajouter des variables CSS dans `:root` et les exposer via `@theme inline` dans `globals.css`.

### shadcn/ui

- Toujours préférer les composants `components/ui/` existants à un composant custom.
- Composant manquant : `pnpm dlx shadcn@latest add [nom]`.
- **Ne pas modifier** les fichiers de `components/ui/` ni `hooks/use-mobile.ts` (déjà ignorés par ESLint).
- Composer (wrap) dans `components/` quand on a besoin d'une variante projet-spécifique.

### Classes Tailwind

- `cn()` (de `lib/utils.ts`) pour composition conditionnelle de classes.
- Pas de classes magiques inventées, rester dans les utilitaires Tailwind.
- Palette : `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.

### Mode sombre

- Le mode sombre n'est **pas activé** dans le starter (pas de `next-themes`). Les variables `.dark` existent dans `globals.css` mais ne sont pas exposées via un toggle. Pour activer le dark mode : ajouter `next-themes` après accord utilisateur.

---

## Conventions Resend + React Email

### Templates d'emails

- Dans `emails/`, un fichier `.tsx` par template (composant React Email).
- Style inline (palette noir/blanc/gris), pas de Tailwind dans les emails.
- Texte en français.

### Envoi

- Helpers dans `lib/email.ts` : `sendVerificationEmail`, `sendResetPasswordEmail`, `sendWelcomeEmail`.
- Pour un nouveau type d'email : créer le template dans `emails/`, ajouter un helper dans `lib/email.ts`, l'appeler depuis le code métier.
- `from` lu depuis `RESEND_FROM_EMAIL` (doit être un domaine validé dans Resend).

---

## Variables d'environnement

Liste complète dans `.env.example`. Variables critiques :

```
DATABASE_URL=postgresql://...           # Neon pooled
BETTER_AUTH_SECRET=...                  # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000   # URL Vercel en prod
NEXT_PUBLIC_BETTER_AUTH_URL=...         # identique, exposé au client
RESEND_API_KEY=...
RESEND_FROM_EMAIL=noreply@...           # domaine validé Resend
```

Le client remplit `.env.local` en local et configure les mêmes variables dans Vercel Dashboard pour la production.

---

## Conventions Vercel

### Déploiement

- Repo GitHub → Vercel → deploy auto sur push de `main`.
- Une seule env (Production) en MVP.
- Pas de preview deployments.

### Limites à connaître

- Plan Hobby : 100 GB-h serverless / mois.
- Upload de fichier via Server Action : max 4.5 MB. Pour plus gros : presigned URLs vers Cloudflare R2 ou Vercel Blob.
- Default function timeout 300s (Fluid Compute en Next 16).

---

## Conventions Neon

- URL de connexion pooled dans `DATABASE_URL`.
- Driver `postgres` avec `prepare: false` (requis pour le pooling Neon).
- Plan Free : 0.5 GB storage, 1 projet.
- **Pas de branches Neon** en phase MVP (une seule DB, comme une seule env Vercel).

---

## Branding centralisé

- `lib/config.ts` exporte `APP_NAME` et `APP_DESCRIPTION`.
- Tous les composants qui affichent le nom de l'app importent depuis là.
- **Pour rebrander une copie cliente : changer ces deux constantes, c'est tout.**

---

## Scripts pnpm

```bash
pnpm dev          # serveur dev local (Turbopack)
pnpm build        # build production
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check
pnpm db:generate  # générer migration Drizzle (rare en MVP)
pnpm db:push      # appliquer schéma sur Neon
pnpm db:studio    # interface visuelle Drizzle Studio
```

---

## Anti-patterns à éviter

- Créer un `tailwind.config.ts` (Tailwind 4 n'en a pas besoin).
- Utiliser `pg` au lieu de `postgres` (driver incompatible avec le starter).
- Modifier `components/ui/` ou `hooks/use-mobile.ts` (managés par shadcn).
- Renommer `proxy.ts` en `middleware.ts` (déprécié en Next 16).
- Utiliser `authClient.forgetPassword` (n'existe plus — c'est `requestPasswordReset`).
- Mettre à jour `user.email` directement (faille sécurité, voir section Better Auth).
- Lancer `pnpm dev` à la place de l'utilisateur (c'est lui qui teste).
