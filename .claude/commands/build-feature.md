---
description: Implémente une feature planifiée (phase 2 du workflow AVQN)
---

# Phase 2 — Implémenter une feature

Numéro de la feature à implémenter (optionnel — fourni par l'utilisateur) :
$ARGUMENTS

## Résolution du numéro de feature

Avant de démarrer le déroulé, déterminer la fiche cible selon trois niveaux de priorité, dans l'ordre :

1. **Argument explicite** — si `$ARGUMENTS` contient un numéro, l'utiliser directement et passer à l'étape 1 du déroulé. Permet de reprendre une feature plus ancienne sans ambiguïté.

2. **Contexte conversationnel** — si une feature vient d'être planifiée ou activement discutée dans la session courante (fiche créée ou ouverte juste avant), l'utiliser, mais **confirmer brièvement** avant de démarrer :

   > Je vais implémenter la feature [NN] — [titre], qu'on vient de planifier. On y va ?

   Attendre l'accord explicite avant de continuer.

3. **Aucun contexte** — ne **pas** auto-choisir la plus récente. Lister les fiches en statut "planifiée" ou "en cours" dans `specs/` avec leur numéro et titre, puis demander :

   > Quelle feature souhaitez-vous reprendre ?

   Attendre la réponse de l'utilisateur. S'il n'y a aucune fiche candidate, orienter vers `/plan-feature`.

## Objectif

Implémenter la feature en suivant strictement le brief technique (partie 2 de la fiche). Pas de questions produit, pas de réflexion sur le quoi. Le quoi a été décidé en phase 1.

## Déroulé

### Étape 1 — Chargement du contexte

1. Lire `specs/[NN]-[slug].md` (la fiche de la feature)
2. Lire `.avqn/STACK.md` pour les patterns techniques (`CLAUDE.md` est déjà en contexte)
3. Mettre à jour la fiche : statut "en cours", date de démarrage

Si la fiche n'existe pas, refuser et orienter vers `/plan-feature`.

### Étape 2 — Vérifications avant code

Avant d'annoncer le plan, faire deux check rapides :

- **Doute sur une API ?** Si le brief touche à Next 16, Better Auth 1.6, Drizzle 0.45, Tailwind 4, ou toute lib dont la dernière API peut différer de la mémoire pré-entraînée → invoquer `context7` pour récupérer la doc à jour. Préférer un check explicite à une hallucination silencieuse.
- **Travail UI ?** Si la feature touche à l'interface, **encadrer mentalement** `frontend-design` (ce skill peut s'activer en parallèle) avec les contraintes de `.avqn/STACK.md` : composants `components/ui/` (shadcn préset `nova`) imposés, palette neutre noir/blanc/gris, pas de dark mode, Tailwind 4 sans `tailwind.config.ts`. Ne pas laisser inventer un système de design parallèle.

### Étape 3 — Annonce du plan d'action

Avant d'écrire du code, annoncer brièvement le plan :

> Je vais implémenter la feature [NN] — [titre]. Voici les étapes que je vais suivre :
> 1. [étape 1, ex: créer la table `tags` dans le schéma Drizzle]
> 2. [étape 2, ex: créer le composant `TagBadge.tsx`]
> 3. [étape 3, ex: ajouter la route `/api/tags`]
> 4. [étape 4, ex: intégrer dans la page `/posts/[id]`]
>
> Je commence maintenant.

### Étape 4 — Implémentation

Suivre l'ordre du plan d'action. Pour chaque étape :

1. Créer/modifier les fichiers nécessaires
2. Suivre les conventions de `.avqn/STACK.md` à la lettre
3. Préférer les composants shadcn existants à la création de composants custom
4. Préférer les patterns du starter kit aux patterns "inventés"

### Étape 5 — Gestion des imprévus

Si une décision non prévue dans la fiche surgit, **s'arrêter et demander**. Exemples :

- Une nouvelle dépendance npm est nécessaire
- Un choix d'architecture pas couvert par la fiche (ex: client component vs server component dans un cas ambigu)
- Un conflit avec une feature existante
- Un edge case oublié

Formulation type :

> J'ai besoin d'une décision avant de continuer : [description du choix]. Je propose [option A] parce que [raison]. L'alternative serait [option B]. Que préférez-vous ?

Une fois la décision prise, elle ira dans la fiche (partie 3) en phase ship.

### Étape 6 — Migration Drizzle (si applicable)

Si la feature touche au schéma de DB :

1. Modifier le fichier de schéma dans `db/schema/`
2. **Avant `db:push`, garde-fou destructif** : si la modification supprime une colonne, supprime une table, ou change un type incompatible (ex: `text` → `integer`), **s'arrêter et avertir** :

   > Attention, cette modification du schéma est destructive : [détail]. Comme on est en MVP avec une seule DB partagée avec la prod, les données existantes vont être [perdues / coercées]. Voulez-vous que je continue malgré tout ? Sinon je peux proposer une migration progressive (ajout d'une nouvelle colonne, backfill, suppression dans une feature ultérieure).

3. Lancer `pnpm db:push` pour appliquer
4. Si erreur, la résoudre avant de continuer

**Ne pas oublier** : on est en MVP, une seule DB, **pas de rollback**. Un `db:push` cassant casse la prod immédiatement (l'app continue de tourner sur le déploiement Vercel courant, mais la DB est dans un nouvel état).

### Étape 7 — Vérification rapide

Une fois l'implémentation terminée, faire un dernier passage mental :
- Tous les critères de fini de la fiche sont-ils couverts ?
- Y a-t-il du code mort, des imports inutilisés ?
- Les conventions de nommage sont-elles respectées ?
- **Surfaces partagées impactées ?** Si la feature touche au layout, à la navigation, à l'auth, à un composant `components/ui/` partagé ou à un schéma déjà utilisé ailleurs, l'identifier explicitement maintenant pour le signaler à l'utilisateur lors du test (anti-régression).

Pas besoin de lancer lint/typecheck à ce stade, ce sera fait en phase ship.

### Étape 8 — Remise à l'utilisateur pour test

Annoncer la fin :

> L'implémentation de la feature [NN] est terminée. Pour tester en local :
>
> 1. Si le serveur ne tourne pas déjà, lancez `pnpm dev` dans votre terminal
> 2. Ouvrez votre navigateur sur `http://localhost:3000`
> 3. Vérifiez ces points (issus de la fiche) :
>    - [critère 1]
>    - [critère 2]
>    - [critère 3]
> 4. **Vérification anti-régression** (si surfaces partagées impactées) : retestez aussi [parcours impactés, ex: "le login/logout", "la page dashboard", "la navigation principale"].
>
> Quand vous avez vérifié que tout fonctionne, lancez `/ship-feature [NN]` pour livrer la feature. Si quelque chose ne va pas, dites-moi ce qui cloche et je corrige.

**STOP ici**. C'est le client qui teste, pas Claude.

## Anti-patterns à éviter

- Lancer `pnpm dev` automatiquement (le client doit le faire pour comprendre le flow)
- Commit ou push en phase build (c'est le job de ship)
- Installer des dépendances sans valider avec l'utilisateur
- Modifier `CLAUDE.md`, `.avqn/PRODUCT.md` ou `.avqn/STACK.md` sans demander
- Ignorer un critère de la fiche en pensant qu'il n'est "pas essentiel"
- Créer des fichiers ou dossiers qui ne suivent pas la structure du starter kit

## Si le test révèle un problème

Le client revient en disant "ça ne marche pas, [description]". Réagir comme suit :

1. Demander des précisions si nécessaire (message d'erreur, comportement observé vs attendu)
2. Corriger
3. Réinviter à tester
4. Boucler jusqu'à validation

Pendant cette boucle de correction, **rester en phase build**. Ne pas passer à ship tant que le client n'a pas explicitement validé que la feature marche.
