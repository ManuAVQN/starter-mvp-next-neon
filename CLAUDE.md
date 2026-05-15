# CLAUDE.md

Entry point unique pour les agents IA travaillant sur ce projet. Lisez-le en premier.

Ce projet utilise le **starter kit AVQN** et suit la méthodologie AVQN MVP. Le skill `avqn-mvp` se déclenche dès qu'une intention de développement est détectée, ou via les slash commands listées plus bas.

## Tone et langue

- **Vouvoiement systématique** avec l'utilisateur. Ton professionnel, direct, sans familiarité.
- **Tout en français** : interactions, messages utilisateur, documents générés. Seuls les messages de commit restent en anglais (Conventional Commits).

## Workflow

Toute feature passe par trois slash commands, dans l'ordre, **avec pause humaine entre chaque** :

1. `/plan-feature [description]` → fiche dans `specs/[NN]-[slug].md`
2. `/build-feature [NN]` → implémente
3. `/ship-feature [NN]` → lint + typecheck + commit + push

Deux commandes complémentaires hors workflow MVP :

- `/init-project` — guide le setup initial du projet (à lancer une seule fois après le dezip du starter).
- `/fix [description]` — correctif rapide pour un bug, sans passer par une fiche de feature.

Les règles complètes du workflow (invariants, gestion des cas d'ambiguïté, anti-patterns) vivent dans `.claude/skills/avqn-mvp/SKILL.md` — **c'est la source de vérité**, pas ce fichier.

## Structure du projet

```
.avqn/                  Convention pack AVQN
  PRODUCT.md            Vision et descriptif fonctionnel (à remplir par le client)
  STACK.md              Détails techniques (figé)
  DECISIONS.md          Journal des décisions techniques
.claude/                Infra Claude Code
  skills/avqn-mvp/      Skill du workflow MVP
  commands/             Slash commands (plan/build/ship)
app/                    Routes de l'application
  (public)/             Routes publiques
  (auth)/               Routes d'authentification
  (app)/                Routes protégées
  api/                  Route Handlers
components/
  ui/                   Composants UI gérés (ne pas modifier)
  [...]                 Composants custom
db/schema/              Schémas de base de données
emails/                 Templates d'emails transactionnels
lib/
  actions/              Server Actions
  auth.ts               Config serveur d'authentification
  auth-client.ts        Config client d'authentification
  email.ts              Helpers envoi d'emails
  config.ts             APP_NAME, APP_DESCRIPTION (branding)
specs/                  Fiches de features (gérées par les slash commands)
proxy.ts                Protection des routes (app)/
```

## Sources de vérité

Une information = un seul fichier. Lisez le bon document plutôt que de tout charger ici :

- **Stack technique** → `.avqn/STACK.md` (versions, patterns, conventions de code, variables d'environnement)
- **Vision produit** → `.avqn/PRODUCT.md` (à lire avant toute planification)
- **Décisions techniques** → `.avqn/DECISIONS.md` (journal chronologique inverse)
- **Workflow + invariants + anti-patterns** → `.claude/skills/avqn-mvp/SKILL.md` (+ ses references/)

Ne pas dupliquer ces contenus ici ni ailleurs.

## Rebranding

Pour adapter le starter à un nouveau projet : modifier `APP_NAME` et `APP_DESCRIPTION` dans `lib/config.ts`. Tous les écrans s'alignent automatiquement.

## Outils complémentaires disponibles

En plus du workflow AVQN, le repo embarque deux outils Claude Code livrés tels quels :

- **Skill `frontend-design`** (Anthropic, auto-activé sur travail UI) — guide les choix esthétiques pour éviter le rendu IA générique. Sur ce projet, il est encadré par les conventions UI de `.avqn/STACK.md` (shadcn imposé, palette neutre noir/blanc/gris, Tailwind 4 sans config externe).
- **MCP `context7`** (Upstash, `.mcp.json`) — sert les docs à jour des libs (Next 16, Better Auth, Drizzle, Tailwind 4). À invoquer en cas de doute sur l'API d'une lib récente plutôt que se fier à la mémoire pré-entraînée.

## Comportement hors workflow

Si la demande utilisateur ne correspond à aucune des cinq commandes :

- **Question / exploration** → répondre sans toucher au code.
- **Refactor / nouvelle feature** → orienter vers `/plan-feature`.
- **Bug à corriger** → orienter vers `/fix [description]`.
- **Installer un framework lourd (Spec-Kit, Superpowers, etc.)** → refuser, suggérer la phase 2 AVQN.
