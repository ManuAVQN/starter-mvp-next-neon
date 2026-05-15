# Phase 3 — Livrer une feature

Activée par la commande `/ship-feature [NN]`.

## Objectif de la phase

Finaliser proprement : qualité du code vérifiée, documentation à jour, code commité et déployé. Une seule feature = un seul commit sur main.

## Déroulé

### Étape 1 — Vérification préalable

Vérifier que la feature [NN] est bien en statut "en cours" dans `specs/[NN]-[slug].md`. Si statut "planifiée", refuser et orienter vers `/build-feature`. Si statut "terminée", signaler qu'elle est déjà livrée et demander si on veut faire un fix correctif.

### Étape 2 — Lint et typecheck

Lancer les commandes de qualité dans cet ordre :

```bash
pnpm lint
pnpm typecheck
```

(ou les équivalents définis dans `AGENTS.md` / `package.json`)

**Si une commande échoue** :
1. Identifier les erreurs
2. Les corriger
3. Relancer la commande
4. Boucler jusqu'à ce que tout passe

**Important** : ne pas désactiver une règle de lint pour faire passer le check. Si une règle pose problème de façon légitime, le signaler à l'utilisateur et lui demander avis.

### Étape 3 — Mise à jour de la fiche

Compléter `specs/[NN]-[slug].md` :

- Statut : `terminée`
- Date de fin : `[date du jour au format YYYY-MM-DD]`
- **Partie 3 — Notes post-implémentation** : rédiger 3-6 bullets honnêtes sur :
  - Ce qui a changé par rapport au plan initial (si applicable)
  - Les bugs ou difficultés rencontrés et comment ils ont été résolus
  - Les choix techniques pris en cours de route (qui doivent aussi aller dans DECISIONS.md)
  - Les points d'attention pour le futur (ex : "à reprendre quand on aura plus de 100 users", "le polling toutes les 5s pourra devenir un websocket")
  - Si rien de notable : écrire "Implémentation conforme au plan, aucune décision notable en cours de route."

Cocher les critères de fini quand ils sont validés.

### Étape 4 — Mise à jour de DECISIONS.md

Si la feature contient des décisions techniques notables (nouveau pattern, choix de lib, alternative écartée), ajouter une entrée dans `DECISIONS.md`. Voir `references/decisions-format.md` pour le format.

Si aucune décision notable, ne rien ajouter. DECISIONS.md doit rester un document à haute valeur ajoutée, pas un journal exhaustif.

### Étape 5 — Commit

Faire un commit unique, avec tous les fichiers modifiés. Format du message :

```
feat: [NN] [titre court de la feature]

[description en 1-2 phrases si utile, optionnel]
```

Voir `references/commit-format.md` pour les cas particuliers (fix, refactor, docs).

Pour les correctifs hors workflow MVP :
```
fix: [description courte]
```

### Étape 6 — Push

```bash
git push origin main
```

Si le push échoue (conflit, droits) :
1. Diagnostiquer
2. Si conflit : demander à l'utilisateur ce qu'il a fait sur le repo (a-t-il modifié des fichiers depuis ailleurs ?)
3. Résoudre avec son aide

### Étape 7 — Confirmation de livraison

Annoncer le succès :

> ✅ Feature [NN] livrée avec succès.
>
> - Commit : `feat: [NN] [titre]`
> - Push effectué sur `main`
> - Vercel va déployer automatiquement dans environ 1 à 2 minutes
> - Lien du projet déployé : [URL Vercel si connue, sinon "consultable dans votre dashboard Vercel"]
>
> La fiche `specs/[NN]-[slug].md` a été mise à jour avec les notes finales.
>
> Pour démarrer une nouvelle feature, lancez `/plan-feature` quand vous êtes prêt.

## Anti-patterns à éviter

- Skipper le lint/typecheck "parce que c'est juste un petit changement"
- Désactiver une règle de lint pour gagner du temps
- Faire plusieurs commits pour une seule feature (mélange les granularités)
- Pousser sur une branche autre que `main`
- Oublier de mettre à jour le statut dans la fiche
- Spammer DECISIONS.md avec des entrées sans valeur (ex : "j'ai utilisé une div")
- Confirmer la livraison avant que le push soit effectivement réussi

## Cas particuliers

**Si le client veut livrer alors qu'il n'a pas testé** :

> Avant de livrer, je préfère que vous validiez que la feature fonctionne en local. Avez-vous lancé `pnpm dev` et vérifié les critères de la fiche ? Si oui, lançons le ship. Sinon, prenez 2 minutes pour tester, c'est important.

**Si lint ou typecheck échoue de façon récurrente après plusieurs tentatives** :

> J'ai du mal à résoudre ces erreurs proprement. Plutôt que de bricoler, je préfère vous montrer ce qui bloque et qu'on en discute. Voici l'erreur : [détail]. Je vous propose [pistes]. Comment souhaitez-vous procéder ?

Ne jamais commit avec des erreurs de lint/typecheck.
