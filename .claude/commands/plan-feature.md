---
description: Démarre la planification d'une nouvelle feature (phase 1 du workflow AVQN)
---

# Phase 1 — Planifier une feature

Description de la feature à planifier (fournie par l'utilisateur) :
$ARGUMENTS

Si l'argument est vide ou trop vague, demande à l'utilisateur de décrire ce qu'il veut faire en quelques phrases avant de commencer les questions structurées.

## Objectif

Produire un brief d'implémentation complet (la fiche de feature) **sans écrire une seule ligne de code**. Le brief doit suffire à un développeur (ou à Claude en phase build) pour implémenter la feature sans ambiguïté.

## Déroulé

### Étape 1 — Préparation (silencieuse)

1. Lire `.avqn/PRODUCT.md` et `.avqn/STACK.md` (`CLAUDE.md` est déjà en contexte)
2. Lister les fichiers de `specs/` pour déterminer le prochain numéro (NN). **Pas de limite** au nombre de features — on numérote séquentiellement aussi loin que nécessaire. Format : zero-padding sur 2 chiffres pour les nombres inférieurs à 10 (`01`, `02`, …, `09`, `10`, `11`, …, `42`, …) afin de garantir un tri alphabétique correct dans `specs/`. **Les features en statut `abandonnée` consomment leur numéro** — ne jamais réutiliser un numéro déjà attribué, même si la fiche est abandonnée.
3. Si `specs/` n'existe pas, le créer.

### Étape 2 — Questions produit

Poser **3 à 5 questions ciblées** sur le **quoi** (jamais sur le comment à ce stade). Exemples :

- "Qui est l'utilisateur final de cette feature ? Un visiteur non connecté, un utilisateur connecté, un administrateur ?"
- "Quel est le parcours type ? Décrivez-moi étape par étape ce que l'utilisateur fait."
- "Quels sont les cas d'erreur ou les cas limites à gérer ?"
- "Y a-t-il un état avant/après visible pour l'utilisateur ?"
- "Quels sont les critères qui vous permettront de dire 'c'est fini, ça marche' ?"

**Règles** :
- Une question à la fois, ou groupées par 2-3 max si elles sont liées
- Reformuler en vouvoiement professionnel
- Si l'utilisateur répond de façon vague, demander une précision
- Ne pas passer à l'étape suivante tant que le quoi n'est pas clair

### Étape 3 — Validation intermédiaire

Une fois les questions produit traitées, faire une synthèse du **quoi** en 3-4 bullets et demander :

> Voici ce que je comprends de la fonctionnalité : [synthèse]. Est-ce que cela correspond à ce que vous voulez ? Si oui, je passe aux questions techniques.

Attendre la confirmation explicite avant de continuer.

### Étape 4 — Questions techniques

Poser **3 à 5 questions ciblées** sur le **comment**. Adapter selon la nature de la feature. Exemples :

- "Cette feature nécessite-t-elle de stocker des données ? Si oui, dans une table existante ou nouvelle ?"
- "Y a-t-il un composant shadcn que vous voulez utiliser pour l'UI, ou je propose ?"
- "Cette feature impacte-t-elle l'authentification ou les permissions ?"
- "Avez-vous des préférences sur la structure d'URL (route Next.js) ?"
- "Y a-t-il des dépendances externes (API, service tiers) ?"

Si l'utilisateur ne sait pas, **proposer un choix par défaut** en justifiant brièvement, et demander validation. Exemple : "Je propose d'utiliser le composant `Card` de shadcn avec un `Dialog` pour l'édition, ça vous va ?"

### Étape 5 — Rédaction de la fiche

Générer le fichier `specs/[NN]-[slug].md` en suivant le template (`.claude/skills/avqn-mvp/references/feature-template.md`). Remplir :
- En-tête (statut "planifiée", date de création)
- Partie 1 — Le quoi
- Partie 2 — Le comment
- Partie 3 — Vide (sera complétée à `/ship-feature`)

Le slug doit être court, en kebab-case, descriptif. Exemple : `03-auth-google-oauth.md`, `04-page-profil-utilisateur.md`.

### Étape 6 — Validation finale

Confirmer à l'utilisateur :

> La fiche de la fonctionnalité est créée dans `specs/[NN]-[slug].md`. Je vous invite à la relire et à la modifier directement si quelque chose ne vous convient pas, ou à me demander des ajustements ici. Quand la fiche vous satisfait, lancez `/build-feature [NN]` pour passer à l'implémentation.

**STOP ici**. Ne pas commencer à implémenter, même si l'utilisateur semble pressé. La pause est volontaire.

## Anti-patterns à éviter

- Écrire du code, même un snippet, pendant la phase plan
- Poser plus de 10 questions au total (5 produit + 5 tech maximum)
- Sauter l'étape de validation intermédiaire
- Générer une fiche sans avoir le contexte projet (`.avqn/PRODUCT.md`, `CLAUDE.md`)
- Numéroter la feature sans vérifier les fiches existantes
- Mélanger les questions produit et techniques dans la même salve

## Cas particuliers

**Si l'utilisateur veut planifier une feature très grosse** (ex : "un système de chat complet en temps réel") :

> Cette fonctionnalité est conséquente. Je suggère de la découper en plusieurs petites features qui se complètent. Par exemple : [proposition de découpage en 3-4 features]. Voulez-vous qu'on parte sur ce découpage, ou préférez-vous tout traiter dans une seule fiche ?

**Si l'utilisateur veut planifier une feature ambigüe** ("rendre l'app plus moderne") :

Refuser poliment et demander une description concrète d'un comportement utilisateur.
