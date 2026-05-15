---
description: Corrige rapidement un bug, hors workflow MVP (pas de fiche specs/)
---

# Flow — Correctif rapide

Description du bug à corriger (fournie par l'utilisateur) :
$ARGUMENTS

Si l'argument est vide, demande à l'utilisateur de décrire ce qui ne fonctionne pas : symptôme observé, étape précise du parcours, message d'erreur éventuel.

## Objectif

Corriger un bug ou un comportement cassé **sans passer par le workflow 3 phases**. Pas de fiche `specs/`, pas de numéro de feature. Le diff doit rester ciblé et le commit unique.

À utiliser quand :
- Une feature déjà livrée a un bug à corriger
- Un comportement régressé (UI cassée, erreur silencieuse, copy incorrect)
- Un ajustement très ciblé qui ne mérite pas une fiche (typo, lien mort, fix de validation)

À **ne pas** utiliser pour :
- Une nouvelle fonctionnalité, même petite → `/plan-feature`
- Un refactor étendu → `/plan-feature` (le traiter comme une feature à part entière)
- Un changement de la stack ou des conventions → discussion préalable avec l'utilisateur

## Déroulé

### Étape 1 — Cadrage du problème

Si la description est claire et reproductible, passer à l'étape 2.

Sinon, demander en une seule salve les infos manquantes :

> Pour cadrer le correctif, j'ai besoin de :
> 1. Symptôme observé exact (ce que vous voyez vs ce que vous attendez)
> 2. Étape du parcours où ça se produit
> 3. Message d'erreur éventuel (console navigateur, terminal, logs Vercel)

Ne pas démarrer le fix tant que le problème n'est pas reproductible mentalement.

### Étape 2 — Diagnostic

Lire les fichiers concernés (ne pas patcher en aveugle). Identifier la cause racine, pas seulement le symptôme.

Si la cause révèle un problème plus profond que prévu (ex : faille de sécurité, pattern à revoir globalement), **s'arrêter et avertir** :

> Le diagnostic révèle [problème]. Ce n'est plus un simple correctif. Je vous propose deux options :
> - **Fix ciblé maintenant** : corriger localement et noter le point d'attention dans `.avqn/DECISIONS.md` pour traitement ultérieur.
> - **Traiter comme une feature** : lancer `/plan-feature` pour cadrer une refonte propre.

### Étape 3 — Correction

Modifier les fichiers strictement nécessaires. Ne pas en profiter pour refactoriser du code voisin. Le diff doit rester lisible et minimal.

Suivre les conventions de `.avqn/STACK.md` (mêmes règles que `/build-feature`).

### Étape 4 — Vérification

Lancer :

```bash
pnpm lint
pnpm typecheck
```

Boucler jusqu'à ce que les deux passent. Ne pas désactiver de règles pour gagner du temps.

### Étape 5 — Test utilisateur

Annoncer :

> Le correctif est en place. Pour vérifier en local :
> 1. Si le serveur ne tourne pas, lancez `pnpm dev`
> 2. Reproduisez le scénario qui posait problème : [étapes précises]
> 3. Confirmez que le comportement attendu est bien là

**STOP ici**. Attendre la confirmation de l'utilisateur avant de commit.

### Étape 6 — Commit + push

Format du message :

```
fix: [description courte du symptôme corrigé]
```

Exemples :
- `fix: bouton de signup grisé après erreur de validation`
- `fix: redirection cassée après vérification d'email`
- `fix: typo dans le footer`

Voir `.claude/skills/avqn-mvp/references/commit-format.md` pour le détail.

Pousser sur `main` :

```bash
git push origin main
```

### Étape 7 — DECISIONS.md (conditionnel)

**Ajouter une entrée uniquement si** le correctif :
- Met en lumière un pattern à éviter pour le futur (ex : "ne plus utiliser X dans ce contexte")
- Révèle une dette technique identifiée à surveiller
- Change un choix d'implémentation pris précédemment

Sinon, ne rien ajouter. Voir `.claude/skills/avqn-mvp/references/decisions-format.md`.

### Étape 8 — Confirmation

> Correctif livré.
> - Commit : `fix: [description]`
> - Push effectué sur `main`
> - Vercel déploie automatiquement
>
> Si le bug ressort ou si un comportement adjacent est cassé, dites-le-moi.

## Anti-patterns à éviter

- Patcher sans diagnostiquer (rustines fragiles)
- Refactoriser au-delà du strict nécessaire dans un `/fix`
- Créer une fiche `specs/` pour un correctif (ce n'est pas une feature)
- Sauter le lint/typecheck "parce que c'est juste un petit changement"
- Spammer `.avqn/DECISIONS.md` avec des entrées triviales
- Pousser sans avoir fait valider le test par l'utilisateur

## Cas particulier — bug bloquant en prod

Si la prod est cassée et que l'utilisateur est en urgence :

1. Faire le fix le plus court possible pour rétablir le service
2. Pousser immédiatement après lint + typecheck
3. Une fois la prod stable, demander à l'utilisateur s'il veut faire un second passage propre (refactor, test, doc)
