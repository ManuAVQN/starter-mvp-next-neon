# CLAUDE.md

Ce fichier oriente Claude au démarrage de chaque session. Lisez-le en premier.

## Ce projet

Application Next.js 16 construite à partir du **starter AVQN**. Stack imposée : Next.js (App Router) + TypeScript strict + Tailwind 4 + shadcn/ui + Better Auth + Drizzle + Neon + Resend + Zod, déployée sur Vercel.

La vision produit et le scope MVP sont décrits dans `.avqn/PRODUCT.md` — **lisez-la avant toute planification**.

## Workflow obligatoire

Toute feature passe par les trois slash commands AVQN, dans l'ordre, **avec pause humaine entre chaque** :

1. `/plan-feature [description]` → fiche dans `specs/[NN]-[slug].md` (zéro code)
2. `/build-feature [NN]` → implémente, s'arrête pour test utilisateur
3. `/ship-feature [NN]` → lint + typecheck + commit unique `feat: [NN] ...` + push

Le détail vit dans `.claude/skills/avqn-mvp/SKILL.md` et ses références — le skill s'active automatiquement via ce projet (`AGENTS.md` présent).

Pour les correctifs urgents hors workflow : commit direct `fix: ...`, pas de fiche `specs/`, ajouter une entrée à `.avqn/DECISIONS.md` si la décision est notable.

## Invariants non-négociables

- **Vouvoiement systématique** dans toutes les interactions et documents générés.
- **Un commit par feature**, jamais plus, jamais moins. Tout va sur `main`. Pas de branches, pas de PR.
- **Un seul environnement Vercel** + **une seule DB Neon**. Pas de preview, pas de staging.
- **Stack figée.** Toute nouvelle dépendance doit être validée avec l'utilisateur avant `pnpm add`.
- **Pas de tests automatisés** en phase MVP, sauf demande explicite. Lint + typecheck suffisent.
- **Pas de `pnpm dev` autonome** — c'est l'utilisateur qui teste en local.
- **Tout en français** : interactions, documents, messages utilisateur. Les commit messages restent en anglais (Conventional Commits).

## Documents à connaître

Préférez lire le bon document plutôt que tout charger dans CLAUDE.md :

- `AGENTS.md` — conventions complètes du projet, structure des dossiers, ce qu'il ne faut pas faire
- `.avqn/PRODUCT.md` — vision produit, utilisateurs cibles, backlog (à lire en début de planification)
- `.avqn/STACK.md` — détails techniques de la stack, patterns Next 16 / Better Auth / Drizzle / Resend
- `.avqn/DECISIONS.md` — journal chronologique inverse des décisions techniques structurantes
- `.claude/skills/avqn-mvp/references/` — déroulé détaillé de chaque phase, templates, formats

## Rebranding rapide

Pour adapter le starter à votre projet : `lib/config.ts` exporte `APP_NAME` et `APP_DESCRIPTION`. Tous les écrans s'alignent automatiquement.

## Si l'utilisateur sort du workflow

Si la demande ne correspond à aucune des trois commandes (ex : "explique-moi ce code", "j'ai un bug urgent", "tu peux refactor ce composant ?") :

- **Bug urgent** → correctif direct, commit `fix:`, push, entrée `.avqn/DECISIONS.md` si notable.
- **Question / exploration** → répondre sans toucher au code.
- **Refactor / nouvelle feature** → orienter vers `/plan-feature`.
- **Installer un framework lourd (Spec-Kit, Superpowers, etc.)** → refuser poliment, suggérer la phase 2 AVQN.
