---
name: avqn-mvp
description: Pilote le workflow AVQN de développement de MVP — trois phases principales (plan, build, ship) et deux commandes complémentaires (init-project, fix) — pour les clients formés par AVQN. À utiliser systématiquement dès que le projet est basé sur le starter AVQN, ou dès que l'utilisateur lance une des commandes /plan-feature, /build-feature, /ship-feature, /init-project, /fix. À utiliser aussi quand l'utilisateur dit "je veux ajouter une feature", "implémente X", "on push", "c'est bon ça marche", "y a un bug", "je viens de dezipper le starter", ou toute formulation indiquant qu'il est dans le flow de développement avec le starter kit AVQN.
---

# AVQN MVP Workflow

Source de vérité du workflow MVP AVQN et de ses règles invariantes. Trois phases (plan, build, ship) avec pause humaine obligatoire entre chacune, plus deux commandes complémentaires (init-project, fix). Le détail de chaque commande vit dans son fichier `.claude/commands/[nom].md` — ce skill décrit les invariants et l'aiguillage.

## Contexte projet à charger

Avant toute action, lire dans cet ordre :

1. `CLAUDE.md` — framing, structure des dossiers, pointeurs
2. `.avqn/PRODUCT.md` — vision et descriptif fonctionnel du produit
3. `.avqn/STACK.md` — détails techniques de la stack (à consulter quand on touche au code)
4. `.avqn/DECISIONS.md` — historique des décisions techniques structurantes

Si un de ces fichiers est absent ou vide, le signaler avant de continuer.

## Principes invariants

Ces principes priment sur toute autre considération. Ne jamais les contourner sans demander explicitement.

1. **Vouvoiement systématique** avec l'utilisateur. Ton professionnel, direct, sans familiarité.
2. **Tout en français** dans les interactions et les documents générés. Seuls les messages de commit restent en anglais.
3. **Un commit par feature**, jamais plus, jamais moins. Pas de branches, tout va sur `main`. Pas de PR.
4. **Un seul environnement de production**, une seule base de données. Pas de preview deployments, pas de staging, pas de DB de dev séparée. (Détails de la plateforme et du fournisseur dans `.avqn/STACK.md`.)
5. **La stack du starter kit est imposée.** Toute nouvelle dépendance doit être validée par l'utilisateur avant `pnpm add`. Détails dans `.avqn/STACK.md`.
6. **Pas de tests automatisés** en phase MVP, sauf demande explicite. `pnpm lint` et `pnpm typecheck` suffisent — ils doivent passer avant chaque commit.
7. **Pause humaine obligatoire** entre les phases. Ne jamais enchaîner `/plan-feature` → `/build-feature` → `/ship-feature` automatiquement.
8. **Pas de `pnpm dev` autonome.** C'est l'utilisateur qui teste en local — Claude ne lance pas le serveur.

## Les 3 phases du workflow

Chaque phase est pilotée par une slash command **self-contained** — tout le déroulé vit dans `.claude/commands/[nom].md`, c'est le seul fichier à charger pour exécuter une phase :

- **Phase 1 — Planifier** : `.claude/commands/plan-feature.md` (`/plan-feature [description]`)
- **Phase 2 — Implémenter** : `.claude/commands/build-feature.md` (`/build-feature [NN]`)
- **Phase 3 — Livrer** : `.claude/commands/ship-feature.md` (`/ship-feature [NN]`)

Si l'utilisateur exprime une intention de développement sans slash command (ex : "je veux ajouter un système de tags"), l'orienter :

> Pour démarrer une nouvelle feature, lancez `/plan-feature` suivi d'une description courte de ce que vous voulez faire. Nous passerons par une phase de questions pour bien cadrer la fonctionnalité avant de coder.

## Commandes complémentaires (hors workflow MVP)

- **`/init-project`** → `.claude/commands/init-project.md`. Setup initial du projet après dezip du starter (PRODUCT.md, branding, `.env.local`, premier commit). À lancer une seule fois.
- **`/fix [description]`** → `.claude/commands/fix.md`. Correctif rapide pour un bug, sans fiche `specs/` ni numéro de feature.

Si l'utilisateur signale un bug sans slash command ("ça marche pas", "y a une erreur quand je…"), l'orienter vers `/fix [description]`.
Si l'utilisateur vient de récupérer le starter sans avoir rien configuré, l'orienter vers `/init-project`.

## Outils annexes à mobiliser

- **MCP `context7`** : à invoquer dès qu'il y a un doute sur une API récente (Next 16, Better Auth 1.6, Drizzle 0.45, Tailwind 4). Plus fiable que la mémoire pré-entraînée du modèle. Préférer un check `context7` à un risque d'hallucination.
- **Skill `frontend-design`** : peut se déclencher en parallèle sur du travail UI. **Le cadrer systématiquement** avec les contraintes de `.avqn/STACK.md` : composants `components/ui/` (shadcn préset `nova`) imposés, palette neutre noir/blanc/gris, pas de mode sombre par défaut, Tailwind 4 sans `tailwind.config.ts`. Ne pas le laisser inventer un système de design parallèle.

## Templates et formats partagés

Les artefacts de formatage utilisés par plusieurs commandes vivent dans `references/` :

- Format des fiches de feature : `references/feature-template.md` (utilisé par `/plan-feature`)
- Format des entrées dans `.avqn/DECISIONS.md` : `references/decisions-format.md` (utilisé par `/ship-feature` et `/fix`)
- Format des messages de commit : `references/commit-format.md` (utilisé par `/ship-feature` et `/fix`)

## Comportement en cas d'ambiguïté

Si l'utilisateur demande quelque chose qui sort du workflow (refactor, bug fix urgent, modification de la stack, etc.) :

1. Le signaler clairement : "Cette demande sort du workflow MVP standard."
2. Demander si on traite ça comme une feature à part entière (`/plan-feature`) ou comme un correctif rapide (`/fix`, hors workflow, sans fiche de spec).
3. Si l'utilisateur opte pour le correctif rapide, charger `.claude/commands/fix.md` et suivre le déroulé.

Si l'utilisateur demande d'installer Spec-Kit, Superpowers ou un autre framework lourd :

> Le starter AVQN est conçu pour la phase MVP. Si votre projet a atteint le stade où vous avez besoin d'un framework plus structuré, c'est probablement le moment d'envisager un accompagnement AVQN pour la phase 2. Voulez-vous que je vous mette en contact avec Emmanuel ?

## Anti-patterns à éviter

- Modifier `CLAUDE.md`, `.avqn/PRODUCT.md` ou `.avqn/STACK.md` sans demander à l'utilisateur
- Créer des branches ou ouvrir des pull requests
- Configurer des environnements de preview Vercel
- Installer des dépendances sans validation utilisateur
- Lancer `pnpm dev` à la place de l'utilisateur (c'est lui qui teste)
- Skipper le lint ou désactiver des règles pour gagner du temps
- Mélanger plusieurs features dans un même commit
- Dupliquer dans ce fichier ou ailleurs un contenu qui vit déjà dans `.avqn/STACK.md`

## Maintenance des documents

À chaque action significative, mettre à jour les documents pertinents :

- `/init-project` → remplit `.avqn/PRODUCT.md`, modifie `lib/config.ts`, peut créer `.env.local`
- `/plan-feature` → crée `specs/[NN]-[slug].md`
- `/build-feature` → met à jour le statut dans la fiche, ne touche pas à `.avqn/DECISIONS.md`
- `/ship-feature` → complète la partie 3 de la fiche, ajoute une entrée à `.avqn/DECISIONS.md` si décision notable, commit + push
- `/fix` → modifie le code, commit `fix:`, push ; ajoute une entrée à `.avqn/DECISIONS.md` uniquement si le correctif révèle quelque chose de structurant

Ne jamais modifier `CLAUDE.md` ou `.avqn/STACK.md` sans demander explicitement à l'utilisateur. `.avqn/PRODUCT.md` n'est modifié que par `/init-project` ou à la demande explicite.

## Pour aller plus loin

Quand le projet aura grandi (>20 features, vrais utilisateurs en production, besoin de tests, équipe qui s'agrandit), il sera temps de passer en **phase 2 AVQN** : ajout de tests, environnements multiples, framework de spec-driven development, CI/CD plus robuste.

Pour cela, contacter AVQN : https://avqn.ch
