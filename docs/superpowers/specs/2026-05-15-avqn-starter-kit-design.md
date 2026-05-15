# AVQN Starter Kit — Design Spec

**Date:** 2026-05-15  
**Status:** Approved  
**Author:** Manu (via brainstorming session)

---

## 1. Vue d'ensemble

Un starter kit Next.js propre et minimal servant de base à plusieurs projets MVP clients. Ce template est dupliqué pour chaque nouveau client — il doit être épuré, moderne, et facilement re-stylable.

**Ce n'est pas un projet client.** C'est un template préparé une fois pour toutes.

---

## 2. Stack technique

| Technologie | Rôle | Notes |
|---|---|---|
| Next.js (App Router) | Framework | Server Components par défaut |
| React | UI | Dernière version stable |
| TypeScript (`strict: true`) | Typage | Strict mode obligatoire |
| Tailwind CSS | Styles | Variables shadcn pour re-stylage |
| shadcn/ui | Composants UI | Ne pas modifier les fichiers `ui/` |
| Better Auth | Authentification | emailAndPassword + email verification |
| Drizzle ORM + drizzle-kit | ORM + migrations | `db:push` en dev/MVP |
| Neon + Postgres.js | Base de données | Driver `postgres`, PAS `pg` |
| Resend | Emails transactionnels | Envoi des 3 templates |
| React Email | Templates d'emails | Composants `.tsx` rendus côté serveur |
| Zod | Validation | Systématique sur toutes les Server Actions |
| pnpm | Package manager | Pas npm, pas yarn |

**Dépendance additionnelle approuvée :** `@react-email/components`

---

## 3. Architecture des routes

### Route groups

```
app/
├── (public)/           # Routes publiques, aucune protection
├── (auth)/             # Routes auth, aucune protection
└── (app)/              # Routes protégées par middleware
```

### Routes complètes

| Route | Group | Description |
|---|---|---|
| `/` | `(public)` | Homepage avec bouton Start conditionnel |
| `/sign-in` | `(auth)` | Formulaire email + password |
| `/sign-up` | `(auth)` | Formulaire nom, prénom, email, password, confirmation |
| `/forgot-password` | `(auth)` | Formulaire email pour reset |
| `/reset-password` | `(auth)` | Nouveau password + confirmation (token en query param) |
| `/verify-email` | `(auth)` | Validation du token de vérification (query param) |
| `/dashboard` | `(app)` | Page d'accueil de l'espace connecté |
| `/projects` | `(app)` | Page quasi vide (exemple de nav) |
| `/analytics` | `(app)` | Page quasi vide (exemple de nav) |
| `/reports` | `(app)` | Page quasi vide (exemple de nav) |
| `/settings` | `(app)` | Formulaire modification du compte |
| `/api/auth/[...all]` | — | Route Handler Better Auth |

---

## 4. Structure de fichiers

```
.
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── layout.tsx
│   ├── (app)/
│   │   ├── dashboard/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── api/auth/[...all]/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn (ne pas modifier)
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   └── user-menu.tsx
├── db/
│   ├── index.ts
│   └── schema/
│       ├── auth.ts
│       └── index.ts
├── emails/
│   ├── verification.tsx
│   ├── reset-password.tsx
│   └── welcome.tsx
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── email.ts
│   ├── utils.ts
│   └── actions/
│       └── account.ts
├── middleware.ts
├── drizzle.config.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json
└── README.md
```

---

## 5. Base de données

### Schema `db/schema/auth.ts`

Tables requises par Better Auth :

- **`user`** — id, name, email, emailVerified, image, createdAt, updatedAt
- **`session`** — id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId (FK)
- **`account`** — id, accountId, providerId, userId (FK), accessToken, refreshToken, idToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, password, createdAt, updatedAt
- **`verification`** — id, identifier, value, expiresAt, createdAt, updatedAt

### Conventions

- Driver : `postgres` (Postgres.js) via `@neondatabase/serverless` ou connexion directe
- Migrations : `pnpm db:generate` + `pnpm db:push` (mode dev)
- Config dans `drizzle.config.ts` avec `DATABASE_URL`

---

## 6. Authentification (Better Auth)

### Configuration serveur (`lib/auth.ts`)

- Plugin `emailAndPassword` activé
- `emailVerification` : requis avant connexion, envoi via Resend
- Callbacks pour envoyer les emails (verify, reset, welcome)
- `BETTER_AUTH_SECRET` depuis l'environnement

### Configuration client (`lib/auth-client.ts`)

- `createAuthClient()` avec `baseURL` depuis `BETTER_AUTH_URL`
- Export des méthodes : `signIn`, `signUp`, `signOut`, `getSession`

### Route Handler (`app/api/auth/[...all]/route.ts`)

- `toNextJsHandler(auth)` pour GET et POST

### Flux sign-up

1. Formulaire : prénom, nom, email, password, confirmation password
2. Validation Zod côté serveur
3. Création du compte Better Auth
4. Envoi email de vérification via Resend
5. Redirection vers page "Vérifiez votre boîte mail"

### Flux sign-in

1. Formulaire : email, password
2. Si email non vérifié : message d'erreur + bouton "Renvoyer l'email de vérification"
3. Si OK : redirection vers `/dashboard`

### Flux forgot/reset password

1. `/forgot-password` : email → envoi email avec lien `/reset-password?token=...`
2. `/reset-password` : nouveau password + confirmation → validation token → update → redirection `/sign-in`

### Flux verify-email

1. `/verify-email?token=...` → validation token Better Auth → message succès → redirection `/dashboard`

---

## 7. Middleware de protection

```typescript
// middleware.ts
// Vérifie la session Better Auth sur toutes les routes protégées
// Redirige vers /sign-in si pas de session valide
```

Matcher : les routes protégées correspondent aux URLs réelles (les route groups Next.js comme `(app)` ne créent pas de segment d'URL). Le matcher cible : `/dashboard`, `/projects`, `/analytics`, `/reports`, `/settings`, et leurs sous-chemins.

```typescript
export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/analytics/:path*', '/reports/:path*', '/settings/:path*'],
}
```

---

## 8. Emails transactionnels

### `lib/email.ts`

Fonctions typées :
- `sendVerificationEmail(email, name, url)` → template `emails/verification.tsx`
- `sendResetPasswordEmail(email, name, url)` → template `emails/reset-password.tsx`
- `sendWelcomeEmail(email, name)` → template `emails/welcome.tsx`

### Templates (React Email)

Design : texte + un bouton CTA, branding neutre, palette noir/blanc. Rédigés en français.

| Template | Déclencheur | CTA |
|---|---|---|
| `verification.tsx` | Après sign-up | "Vérifier mon adresse email" |
| `reset-password.tsx` | Après forgot-password | "Réinitialiser mon mot de passe" |
| `welcome.tsx` | Après vérification du compte | "Accéder à mon espace" |

---

## 9. Server Actions

### `lib/actions/account.ts`

**`updateProfile(formData)`** :
- Input Zod : `{ firstName, lastName, email }`
- Update Drizzle sur table `user`
- Retourne `{ success: true }` ou `{ error: string }`

**`updatePassword(formData)`** :
- Input Zod : `{ currentPassword, newPassword, confirmPassword }`
- Vérification du mot de passe actuel via Better Auth
- Update via Better Auth
- Retourne `{ success: true }` ou `{ error: string }`

---

## 10. UI & Design

### Composants clés

- **`components/navbar.tsx`** — Logo gauche, boutons droite (Sign in / Sign out + nom user)
- **`components/sidebar.tsx`** — Wrapper du composant shadcn `Sidebar`, liens de navigation
- **`components/user-menu.tsx`** — Menu déroulant (Settings, Sign out) dans le layout `(app)`

### Palette

Strictement noir, blanc, nuances de gris. Variables Tailwind/shadcn par défaut. Police Geist.

### Responsive

- Desktop : sidebar fixe à gauche
- Mobile : sidebar collapsible (composant shadcn `Sidebar` avec `collapsible="offcanvas"`)

### Règle "use client"

Uniquement sur les composants qui utilisent : hooks React, event handlers DOM, ou APIs navigateur. Tout le reste est Server Component.

---

## 11. Variables d'environnement

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@tondomaine.com
```

---

## 12. Scripts pnpm

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "db:generate": "drizzle-kit generate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

---

## 13. Hors scope (ne pas implémenter)

- Billing / Stripe
- Multi-tenant / organisations
- Roles et permissions complexes
- Suppression de compte
- OAuth providers (Google, GitHub, etc.)
- Internationalisation (i18n)
- Tests automatisés (Vitest, Playwright)
- Storybook
- Dark mode toggle
- Toute feature non listée ci-dessus

---

## 14. Critères de validation

- [ ] `pnpm install` sans erreur
- [ ] `pnpm lint` sans erreur
- [ ] `pnpm typecheck` sans erreur
- [ ] `pnpm db:push` crée les tables sur Neon
- [ ] `pnpm dev` lance sans warnings critiques
- [ ] Création de compte sur `/sign-up`
- [ ] Réception de l'email de vérification via Resend
- [ ] Lien de vérification active le compte
- [ ] Connexion sur `/sign-in` → redirection `/dashboard`
- [ ] Sidebar fonctionnelle et navigation
- [ ] Modification du profil dans `/settings`
- [ ] Déconnexion via navbar
- [ ] Middleware bloque `/dashboard` sans session
- [ ] `/forgot-password` envoie l'email de reset
- [ ] Reset password fonctionnel
- [ ] Responsive (mobile, tablette, desktop)
