# AGENTS.md

Ce fichier décrit les conventions et règles invariantes du projet. Tout agent IA (Claude Code, Cursor, Copilot…) doit le respecter à la lettre.

Ce projet utilise le **starter kit AVQN** et suit la méthodologie AVQN MVP (skill `avqn-mvp`).

---

## Stack technique imposée

- **Framework** : Next.js (dernière version stable, App Router uniquement)
- **Langage** : TypeScript strict
- **Styling** : Tailwind CSS + shadcn/ui (composants déjà installés dans `components/ui/`)
- **Auth** : Better Auth
- **ORM** : Drizzle ORM
- **DB** : PostgreSQL hébergée sur Neon
- **Hébergement** : Vercel
- **Package manager** : pnpm

**Ne pas changer cette stack** sans demander explicitement à l'utilisateur. Toute nouvelle dépendance doit être validée avant installation.

Voir `docs/STACK.md` pour les conventions techniques détaillées.

---

## Règles de workflow (phase MVP)

Ces règles sont volontairement minimalistes pour la phase MVP. Elles évolueront en phase 2 (accompagnement AVQN).

### Branches et environnements

- **Une seule branche** : `main`. Pas de branches feature, pas de pull requests.
- **Un seul environnement Vercel** : production. Pas de preview deployments, pas de staging.
- **Une seule base Neon** : production. Pas de DB de dev séparée, pas de versioning multi-environnement.

### Commits

- **Un commit par feature**. Toute la feature [NN] dans un seul commit.
- Format : `feat: [NN] [titre court]` pour les features, `fix:` pour les correctifs.
- Voir le skill `avqn-mvp/references/commit-format.md` pour le détail.

### Tests

- **Pas de tests automatisés** en phase MVP, sauf demande explicite.
- Vérifications minimales : `pnpm lint` et `pnpm typecheck` doivent passer avant chaque commit.

### Workflow par feature

Trois phases, trois commandes :

1. `/plan-feature [description]` → génère une fiche dans `specs/[NN]-[slug].md`
2. `/build-feature [NN]` → implémente
3. `/ship-feature [NN]` → vérifie, commit, push

Pause humaine **obligatoire** entre chaque phase. L'utilisateur valide avant de passer à la suivante.

---

## Conventions de code

### Structure des dossiers

```
app/                  # routes Next.js (App Router)
components/
  ui/                 # composants shadcn (ne pas modifier sauf cas exceptionnel)
  [...]               # composants custom du projet
db/
  schema/             # schémas Drizzle
  migrations/         # généré automatiquement par drizzle-kit
lib/                  # utilitaires partagés
docs/                 # documentation projet
  PRODUCT.md          # vision et descriptif fonctionnel
  STACK.md            # détails techniques
specs/                # fiches de features (gérées par avqn-mvp)
DECISIONS.md          # journal des décisions techniques
```

### Composants

- **Server components par défaut**. Marquer `"use client"` uniquement quand nécessaire (interactivité, hooks).
- Préférer les composants `shadcn/ui` existants à la création de composants custom.
- Composants en PascalCase. Fichiers de composants : `MonComposant.tsx`.
- Un composant = un fichier (sauf composants triviaux internes).

### Server Actions vs Route Handlers

- **Server Actions** par défaut pour les mutations depuis l'UI.
- **Route Handlers** (`app/api/...`) pour les webhooks ou les endpoints publics.

### Données et schéma

- Toutes les tables vivent dans `db/schema/`.
- Une table = un fichier.
- Migrations générées avec `pnpm db:generate`, appliquées avec `pnpm db:push`.

### Variables d'environnement

- Définies dans `.env.local` en local.
- Documentées dans `.env.example` (commitée).
- Définies en production directement dans le dashboard Vercel.

---

## Ce qu'il ne faut pas faire

- Modifier `AGENTS.md`, `docs/PRODUCT.md` ou `docs/STACK.md` sans demander à l'utilisateur
- Créer des branches
- Configurer des environnements de preview
- Installer des dépendances sans validation
- Lancer `pnpm dev` à la place de l'utilisateur (c'est lui qui teste)
- Skipper le lint ou désactiver des règles pour gagner du temps
- Mélanger plusieurs features dans un même commit

---

## Pour aller plus loin

Quand le projet aura grandi (>20 features, vrais utilisateurs en production, besoin de tests, équipe qui s'agrandit), il sera temps de passer en **phase 2 AVQN** : ajout de tests, environnements multiples, framework de spec-driven development (Spec-Kit), CI/CD plus robuste.

Pour cela, contactez AVQN : https://avqn.ch
