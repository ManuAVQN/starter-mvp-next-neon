# AVQN MVP — Skill et fichiers d'accompagnement

Ce dossier contient tout le nécessaire pour le workflow AVQN MVP :

```
avqn-mvp-skill/
├── README.md                          # ce fichier
├── avqn-mvp/                          # le skill Claude Code
│   ├── SKILL.md
│   └── references/
│       ├── phase-plan.md
│       ├── phase-build.md
│       ├── phase-ship.md
│       ├── feature-template.md
│       ├── decisions-format.md
│       └── commit-format.md
├── commands/                          # slash commands pour Claude Code
│   ├── plan-feature.md
│   ├── build-feature.md
│   └── ship-feature.md
└── starter-kit-files/                 # fichiers à inclure dans le zip starter
    ├── AGENTS.md
    ├── DECISIONS.md
    └── docs/
        ├── PRODUCT.md
        └── STACK.md
```

---

## Architecture en deux niveaux

**Niveau skill** (installé une fois par client sur sa machine) :
- Le dossier `avqn-mvp/` est installé dans `~/.claude/skills/avqn-mvp/`
- Les fichiers de `commands/` sont copiés dans `~/.claude/commands/`
- Active : `/plan-feature`, `/build-feature`, `/ship-feature` dans Claude Code

**Niveau starter kit** (par projet, livré dans le zip) :
- Les fichiers de `starter-kit-files/` sont à la racine du repo du client
- `AGENTS.md` est lu automatiquement par Claude au démarrage de chaque session
- `docs/PRODUCT.md` est à remplir par le client au démarrage
- `docs/STACK.md` est figé (livré tel quel)
- `DECISIONS.md` démarre vide, s'enrichit au fil des features
- `specs/` est créé automatiquement à la première `/plan-feature`

---

## Installation pour un nouveau client

### Étape 1 — Installer le skill et les commandes (une seule fois sur la machine du client)

```bash
# Copier le skill
mkdir -p ~/.claude/skills
cp -r avqn-mvp ~/.claude/skills/

# Copier les slash commands
mkdir -p ~/.claude/commands
cp commands/*.md ~/.claude/commands/
```

À adapter selon la méthode d'installation utilisée (manuelle, script, ou packaging plus tard avec `package_skill.py`).

### Étape 2 — Démarrer un projet à partir du starter

Le starter kit Next.js complet est dans un repo séparé (à créer). Il contient déjà :
- L'app Next.js + Tailwind + shadcn + Better Auth + Drizzle pré-configurés
- Les fichiers de `starter-kit-files/` à la racine (`AGENTS.md`, `DECISIONS.md`, `docs/`)
- Un `.env.example` documenté

Le client :
1. Télécharge le zip du starter
2. Le dézippe dans un nouveau dossier
3. Crée un nouveau repo GitHub vide
4. Y push le contenu du starter
5. Remplit `.env.local` avec ses credentials
6. Remplit `docs/PRODUCT.md` avec sa vision produit
7. Lance Claude Code dans le dossier
8. Lance `/plan-feature` pour démarrer

---

## Tests et itération

Avant de livrer aux premiers clients, valider le skill sur un projet réel :

1. Créer un mini-projet test (ex: une app de gestion de notes simple)
2. Faire 3-4 features de bout en bout en utilisant uniquement les slash commands
3. Identifier les frictions et ajuster les références
4. Documenter les retours dans un changelog du skill

---

## Évolutions prévues (post-MVP du skill lui-même)

- Packaging avec `package_skill.py` pour distribution `.skill`
- Site de documentation publique
- Vidéo tutoriel pour les clients
- Skill v2 "phase 2 AVQN" avec tests, multi-env, etc. (upsell)
