# Phase 2 — Implémenter une feature

Activée par la commande `/build-feature [NN]`.

## Objectif de la phase

Implémenter la feature en suivant strictement le brief technique (partie 2 de la fiche). Pas de questions produit, pas de réflexion sur le quoi. Le quoi a été décidé en phase 1.

## Déroulé

### Étape 1 — Chargement du contexte

1. Lire `specs/[NN]-[slug].md` (la fiche de la feature)
2. Lire `AGENTS.md` pour les conventions
3. Lire `docs/STACK.md` pour les patterns techniques
4. Mettre à jour la fiche : statut "en cours", date de démarrage

Si la fiche n'existe pas, refuser et orienter vers `/plan-feature`.

### Étape 2 — Annonce du plan d'action

Avant d'écrire du code, annoncer brièvement le plan :

> Je vais implémenter la feature [NN] — [titre]. Voici les étapes que je vais suivre :
> 1. [étape 1, ex: créer la table `tags` dans le schéma Drizzle]
> 2. [étape 2, ex: créer le composant `TagBadge.tsx`]
> 3. [étape 3, ex: ajouter la route `/api/tags`]
> 4. [étape 4, ex: intégrer dans la page `/posts/[id]`]
>
> Je commence maintenant.

### Étape 3 — Implémentation

Suivre l'ordre du plan d'action. Pour chaque étape :

1. Créer/modifier les fichiers nécessaires
2. Suivre les conventions de `AGENTS.md` à la lettre
3. Préférer les composants shadcn existants à la création de composants custom
4. Préférer les patterns du starter kit aux patterns "inventés"

### Étape 4 — Gestion des imprévus

Si une décision non prévue dans la fiche surgit, **s'arrêter et demander**. Exemples :

- Une nouvelle dépendance npm est nécessaire
- Un choix d'architecture pas couvert par la fiche (ex: client component vs server component dans un cas ambigu)
- Un conflit avec une feature existante
- Un edge case oublié

Formulation type :

> J'ai besoin d'une décision avant de continuer : [description du choix]. Je propose [option A] parce que [raison]. L'alternative serait [option B]. Que préférez-vous ?

Une fois la décision prise, elle ira dans la fiche (partie 3) en phase ship.

### Étape 5 — Migration Drizzle (si applicable)

Si la feature touche au schéma de DB :
1. Modifier le fichier de schéma
2. Lancer `pnpm db:generate` pour créer la migration
3. Lancer `pnpm db:push` pour appliquer
4. Si erreur, la résoudre avant de continuer

**Ne pas oublier** : on est en MVP, une seule DB. La migration est appliquée directement, pas de versioning multi-environnement.

### Étape 6 — Vérification rapide

Une fois l'implémentation terminée, faire un dernier passage mental :
- Tous les critères de fini de la fiche sont-ils couverts ?
- Y a-t-il du code mort, des imports inutilisés ?
- Les conventions de nommage sont-elles respectées ?

Pas besoin de lancer lint/typecheck à ce stade, ce sera fait en phase ship.

### Étape 7 — Remise à l'utilisateur pour test

Annoncer la fin :

> L'implémentation de la feature [NN] est terminée. Pour tester en local :
>
> 1. Si le serveur ne tourne pas déjà, lancez `pnpm dev` dans votre terminal
> 2. Ouvrez votre navigateur sur `http://localhost:3000`
> 3. Vérifiez ces points (issus de la fiche) :
>    - [critère 1]
>    - [critère 2]
>    - [critère 3]
>
> Quand vous avez vérifié que tout fonctionne, lancez `/ship-feature [NN]` pour livrer la feature. Si quelque chose ne va pas, dites-moi ce qui cloche et je corrige.

**STOP ici**. C'est le client qui teste, pas Claude.

## Anti-patterns à éviter

- Lancer `pnpm dev` automatiquement (le client doit le faire pour comprendre le flow)
- Commit ou push en phase build (c'est le job de ship)
- Installer des dépendances sans valider avec l'utilisateur
- Modifier `AGENTS.md`, `PRODUCT.md` ou `STACK.md` sans demander
- Ignorer un critère de la fiche en pensant qu'il n'est "pas essentiel"
- Créer des fichiers ou dossiers qui ne suivent pas la structure du starter kit

## Si le test révèle un problème

Le client revient en disant "ça ne marche pas, [description]". Réagir comme suit :

1. Demander des précisions si nécessaire (message d'erreur, comportement observé vs attendu)
2. Corriger
3. Réinviter à tester
4. Boucler jusqu'à validation

Pendant cette boucle de correction, **rester en phase build**. Ne pas passer à ship tant que le client n'a pas explicitement validé que la feature marche.
