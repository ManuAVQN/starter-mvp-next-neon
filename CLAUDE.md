# CLAUDE.md

Entry point unique pour les agents IA travaillant sur ce projet. Lisez-le en premier.

Ce projet utilise le **starter kit AVQN** et suit la méthodologie AVQN MVP. Le skill `avqn-mvp` s'active automatiquement sur ce projet.

## Tone et langue

- **Vouvoiement systématique** avec l'utilisateur. Ton professionnel, direct, sans familiarité.
- **Tout en français** : interactions, messages utilisateur, documents générés. Seuls les messages de commit restent en anglais (Conventional Commits).

## Workflow

Toute feature passe par trois slash commands, dans l'ordre, **avec pause humaine entre chaque** :

1. `/plan-feature [description]` → fiche dans `specs/[NN]-[slug].md`
2. `/build-feature [NN]` → implémente
3. `/ship-feature [NN]` → lint + typecheck + commit + push

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

En plus du workflow AVQN, le repo embarque trois outils Claude Code livrés tels quels :

- **Skill `frontend-design`** (Anthropic, auto-activé sur travail UI) — guide les choix esthétiques pour éviter le rendu IA générique.
- **Slash command `/code-review`** (Anthropic) — review de PR via plusieurs agents en parallèle (CLAUDE.md compliance, bugs, historique).
- **MCP `context7`** (Upstash, `.mcp.json`) — sert les docs à jour des libs (Next, Better Auth, Drizzle, etc.). Ajoutez "use context7" à un prompt pour l'invoquer.

## Comportement hors workflow

Si la demande utilisateur ne correspond à aucune des trois commandes :

- **Bug urgent** → correctif direct, commit `fix:`, push, entrée `.avqn/DECISIONS.md` si notable.
- **Question / exploration** → répondre sans toucher au code.
- **Refactor / nouvelle feature** → orienter vers `/plan-feature`.
- **Installer un framework lourd (Spec-Kit, Superpowers, etc.)** → refuser, suggérer la phase 2 AVQN.
