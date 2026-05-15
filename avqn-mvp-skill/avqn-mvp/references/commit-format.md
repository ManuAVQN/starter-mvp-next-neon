# Format — Messages de commit

Convention dérivée de Conventional Commits, adaptée au workflow AVQN MVP.

## Règle principale

**Un commit par feature.** Pas plus, pas moins. Toute la feature [NN] doit tenir dans un seul commit, peu importe le nombre de fichiers modifiés.

## Format des messages

### Feature standard (workflow normal)

```
feat: [NN] [titre court]
```

Exemples :
```
feat: 03 ajout authentification Google OAuth
feat: 07 système de tags sur les posts
feat: 12 page profil utilisateur
```

Le numéro [NN] correspond au numéro de la fiche de feature dans `specs/`.

### Correctif hors workflow

Pour les bugs ou ajustements qui ne méritent pas une fiche de feature :

```
fix: [description courte]
```

Exemples :
```
fix: typo dans le footer
fix: bouton de submit grisé après erreur de validation
fix: import manquant dans schema.ts
```

### Documentation seule

Quand on touche uniquement à la doc (PRODUCT.md, README, etc.) sans toucher au code :

```
docs: [description courte]
```

### Refactor (rare en MVP)

```
refactor: [description courte]
```

À utiliser avec parcimonie. En MVP, on évite les gros refactors. Si un refactor est nécessaire, il vaut mieux le traiter comme une feature à part entière avec `/plan-feature`.

## Description longue (optionnelle)

Si le contexte du commit mérite plus de détail, ajouter un corps après une ligne vide :

```
feat: 09 export PDF des factures

- Utilise @react-pdf/renderer côté serveur
- Génération à la volée, pas de stockage
- Limité aux factures de l'utilisateur connecté
```

À utiliser seulement si l'info n'est pas déjà dans `specs/[NN]-[slug].md`. En général, la fiche suffit et le corps du commit est inutile.

## Anti-patterns

- ❌ `feat: ajout feature` (pas de numéro, pas de description)
- ❌ `update` (vide de sens)
- ❌ `feat: NN-09 stuff` (le numéro doit être lisible)
- ❌ Plusieurs commits pour une feature (`feat: début de la feature 09` puis `feat: suite de la feature 09`)
- ❌ Préfixe `chore:` sauf cas exceptionnel (en MVP, c'est généralement un signe qu'on fait quelque chose qui pourrait attendre)

## Cas particulier — premier commit

Le premier commit du projet (après dezip du starter kit + remplissage des templates) :

```
chore: initialisation du projet à partir du starter AVQN
```

C'est le seul `chore:` autorisé en MVP.
