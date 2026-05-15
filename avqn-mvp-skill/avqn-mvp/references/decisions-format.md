# Format — DECISIONS.md

Journal chronologique des décisions techniques structurantes. Append-only.

## Quand ajouter une entrée

**Ajouter une entrée** si la décision :
- Introduit une nouvelle dépendance significative
- Choisit un pattern non trivial avec une alternative crédible
- Établit une convention qui s'applique au-delà de la feature en cours
- Identifie un point d'attention pour le futur (perf, sécurité, dette technique)

**Ne pas ajouter d'entrée** pour :
- Les choix triviaux (utiliser un `<Button>` shadcn plutôt qu'un `<button>` natif)
- Les choix imposés par le starter kit ou AGENTS.md (ils sont déjà documentés)
- Les "détails d'implémentation" non structurants

## Format d'une entrée

```markdown
## [YYYY-MM-DD] — Feature [NN] : [titre court de la décision]

- **Choix** : [ce qui a été décidé, en 1-2 phrases]
- **Pourquoi** : [raison principale, 1 phrase]
- **Alternative écartée** : [optionnel — quelle option a été refusée et pourquoi]
- **À surveiller** : [optionnel — gotcha, dette technique, point d'attention futur]
```

## Exemples

```markdown
## 2026-03-15 — Feature 04 : authentification Google OAuth

- **Choix** : utiliser le provider Google natif de Better Auth, sans surcouche
- **Pourquoi** : compatibilité directe avec le starter kit, configuration minimale
- **Alternative écartée** : NextAuth — abandonné car non aligné avec le starter
- **À surveiller** : vérifier la rotation des refresh tokens quand on aura des sessions longues
```

```markdown
## 2026-03-22 — Feature 07 : système de tags sur les posts

- **Choix** : table de jointure `post_tags` plutôt qu'un champ array dans `posts`
- **Pourquoi** : permet de filtrer et compter efficacement, et facilite les requêtes futures
- **Alternative écartée** : champ `tags: text[]` Postgres — refusé car limite les patterns de requêtes
```

```markdown
## 2026-04-02 — Feature 11 : upload d'images

- **Choix** : upload direct vers Cloudflare R2 depuis le client (presigned URLs)
- **Pourquoi** : évite de faire transiter les fichiers par Vercel (limite 4.5 MB sur Hobby)
- **À surveiller** : le presigned URL expire en 5 min, gérer le refresh si l'upload est lent
```

## Ordre dans le fichier

Entrées en ordre **chronologique inverse** (plus récente en haut). À chaque ship, ajouter l'entrée au début du fichier, juste après le titre.

## Structure complète du fichier

```markdown
# Journal des décisions techniques

Ce document trace les décisions techniques structurantes prises au fil du développement.
Format : voir `references/decisions-format.md` du skill avqn-mvp.

---

## [date] — Feature [NN] : [titre]
[entrée la plus récente]

## [date] — Feature [NN] : [titre]
[entrée plus ancienne]

...
```
