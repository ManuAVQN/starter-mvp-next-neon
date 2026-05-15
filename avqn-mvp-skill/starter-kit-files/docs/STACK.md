# STACK.md

Ce fichier décrit en détail les conventions techniques du starter kit AVQN.
Il est lu par Claude pour produire du code aligné avec la stack.

---

## Versions et dépendances clés

> À mettre à jour à chaque évolution majeure du starter kit.

- **Next.js** : 15.x (App Router, React 19)
- **TypeScript** : 5.x (strict mode activé)
- **Tailwind CSS** : 4.x
- **shadcn/ui** : composants pré-installés dans `components/ui/`
- **Better Auth** : 1.x
- **Drizzle ORM** : 0.x avec `drizzle-kit`
- **Postgres driver** : `postgres` (pas `pg`)
- **pnpm** : 9.x

---

## Conventions Next.js

### App Router uniquement

- `app/` est la seule racine de routes. Pas de `pages/`.
- Server components par défaut. `"use client"` uniquement quand nécessaire :
  - Utilisation de hooks (`useState`, `useEffect`, etc.)
  - Event handlers DOM directs
  - APIs navigateur

### Routes et structure

- Routes publiques : `app/(public)/...`
- Routes authentifiées : `app/(app)/...`
- Routes auth (sign-in, sign-up) : `app/(auth)/...`
- Pages dynamiques : `app/(app)/posts/[id]/page.tsx`

### Server Actions

- Définies dans `app/[scope]/actions.ts` ou `lib/actions/[domain].ts`
- Toujours marquées `"use server"` en tête de fichier
- Retournent un objet `{ success: boolean, data?: T, error?: string }` pour homogénéité
- Validation des entrées avec Zod (déjà installé)

### Route Handlers

- Définis dans `app/api/[route]/route.ts`
- Réservés aux webhooks et endpoints publics non liés à l'UI
- Pour les mutations UI → préférer Server Actions

---

## Conventions Drizzle

### Schémas

- Un fichier par table dans `db/schema/[nom-table].ts`
- Toujours exporter le type inféré : `export type Post = typeof posts.$inferSelect`
- Utiliser `uuid` pour les IDs principaux, généré côté DB avec `defaultRandom()`
- Timestamps systématiques : `createdAt`, `updatedAt`

### Requêtes

- Toujours via le client Drizzle, jamais en SQL brut
- Préférer les relations Drizzle aux jointures manuelles
- Pour les requêtes complexes répétées : créer une fonction dans `db/queries/`

### Migrations

- Générer avec `pnpm db:generate` après modification du schéma
- Appliquer avec `pnpm db:push` (mode dev, MVP)
- Ne pas commit les fichiers de migration générés (ajoutés au `.gitignore` du starter)

> ⚠️ Phase MVP uniquement. En phase 2, on bascule sur des migrations versionnées commitées.

---

## Conventions Better Auth

### Configuration

- Fichier de config : `lib/auth.ts`
- Providers configurés : email/password + Google OAuth (selon `.env.local`)
- Client : `lib/auth-client.ts` pour usage côté client

### Vérification de session

- Server components : `const session = await auth.api.getSession({ headers: await headers() })`
- Server actions : idem
- Client components : `const { data: session } = authClient.useSession()`

### Protection de routes

- Layout `app/(app)/layout.tsx` redirige vers `/sign-in` si pas de session
- Ne pas dupliquer les checks d'auth dans chaque page

---

## Conventions Tailwind + shadcn

### Composants UI

- Toujours préférer les composants `shadcn/ui` existants
- Si un composant shadcn manque : `pnpm dlx shadcn@latest add [nom]`
- **Ne pas modifier les fichiers de `components/ui/`** sauf cas exceptionnel documenté

### Classes Tailwind

- Préférer `cn()` (de `lib/utils.ts`) pour la composition conditionnelle de classes
- Pas de classes magiques inventées, rester dans les utilitaires Tailwind
- Pour les valeurs custom (couleurs, espacements) : passer par `tailwind.config.ts`

### Thème

- Variables CSS définies dans `app/globals.css`
- Mode sombre via `next-themes` (déjà installé)
- Couleurs accessibles via `bg-background`, `text-foreground`, etc.

---

## Conventions Vercel

### Déploiement

- Connecté au repo GitHub, deploy automatique sur push de `main`
- Variables d'environnement à définir dans Vercel Dashboard → Settings → Environment Variables
- **Une seule env** (Production) en phase MVP

### Limites à connaître

- Plan Hobby : 100 GB-h serverless / mois
- Upload de fichier via Server Action : max 4.5 MB
- Pour uploads plus gros : utiliser presigned URLs (vers Cloudflare R2 ou similaire)

---

## Conventions Neon

### Connexion

- URL de connexion dans `DATABASE_URL` (`.env.local` et Vercel)
- Utiliser le driver `postgres` (Postgres.js), pas `pg`
- Pooling : utiliser l'URL pooled de Neon en production

### Limites

- Plan Free : 0.5 GB stockage, 1 projet
- Branches Neon disponibles mais **non utilisées en phase MVP**

---

## Variables d'environnement

Liste complète documentée dans `.env.example`. Variables critiques :

```
DATABASE_URL=postgresql://...        # Neon
BETTER_AUTH_SECRET=...               # généré avec `openssl rand -base64 32`
BETTER_AUTH_URL=http://localhost:3000  # à changer en prod (URL Vercel)
GOOGLE_CLIENT_ID=...                 # Google OAuth (optionnel)
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=...                   # pour emails transactionnels
```

---

## Scripts pnpm utiles

```bash
pnpm dev              # serveur dev local
pnpm build            # build production
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
pnpm db:generate      # générer migrations Drizzle
pnpm db:push          # appliquer schéma à la DB
pnpm db:studio        # interface visuelle Drizzle Studio
```
