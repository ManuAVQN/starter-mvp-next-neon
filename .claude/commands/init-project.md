---
description: Guide le setup initial du projet après dezip du starter AVQN (à lancer une fois)
---

# Flow — Initialisation projet

Argument optionnel (nom de l'app, si l'utilisateur l'a fourni) :
$ARGUMENTS

## Objectif

Transformer le starter générique en un projet client identifiable, en **une seule passe** juste après le dezip du starter AVQN :

- Dépendances installées
- Nom et description (`lib/config.ts`)
- Vision et descriptif fonctionnel (`.avqn/PRODUCT.md`)
- Variables d'environnement (`.env.local`)
- Schéma de base de données poussé
- Premier commit
- Repo GitHub créé et code poussé

À la fin, le client peut lancer `/plan-feature` pour démarrer sa première fonctionnalité.

## Pré-flight

### Étape 1 — Prérequis et état du projet

**Vérifier d'abord les prérequis CLI** :

```bash
pnpm --version    # doit retourner une version
gh --version      # doit retourner une version
gh auth status    # doit confirmer un compte authentifié
```

Si l'un échoue, **arrêter ici** et présenter à l'utilisateur les instructions d'installation manquantes :

| Manquant | Solution |
|---|---|
| `pnpm` non installé | `npm i -g pnpm` |
| `gh` non installé | `brew install gh` sur macOS, ou voir https://cli.github.com/ pour les autres OS |
| `gh` non authentifié | `gh auth login` (suivre l'assistant interactif, choisir HTTPS ou SSH selon préférence) |

Puis :

> Une fois ces outils prêts, relancez `/init-project`.

**Si tout est OK**, faire l'état du projet :

1. `lib/config.ts` — `APP_NAME` vaut-il toujours `"AVQN Starter"` ?
2. `.avqn/PRODUCT.md` — contient-il les placeholders `[Remplissez ici]` ?
3. `.env.local` — existe-t-il ? Contient-il toutes les variables de `.env.example` ?
4. `git log --oneline` — y a-t-il déjà des commits du client (au-delà du commit du starter) ?
5. `git remote -v` — un remote `origin` est-il déjà configuré ?
6. `ls node_modules/` — les dépendances sont-elles déjà installées ?

Construire un mini-rapport à montrer à l'utilisateur :

> Avant de démarrer, voici l'état du projet :
> - Dépendances : [installées / à installer]
> - Branding (`lib/config.ts`) : [par défaut / déjà modifié]
> - PRODUCT.md : [vide / partiellement rempli / déjà rempli]
> - `.env.local` : [absent / présent mais incomplet / complet]
> - Remote git : [absent / déjà configuré sur (URL)]
> - Historique git : [starter intact / commits déjà en place]
>
> Voulez-vous que je vous accompagne pour finaliser cette initialisation ?

**Si tout est déjà configuré** : signaler que `/init-project` n'a plus rien à faire, ne pas insister, ne pas écraser.

**Si l'utilisateur valide** : passer à l'étape 2.

## Déroulé

### Étape 2 — Installation des dépendances

Si `node_modules/` est absent ou incomplet, lancer `pnpm install` **en background** pour ne pas bloquer la suite des questions :

```bash
pnpm install
```

Continuer immédiatement vers les étapes suivantes. Avant l'étape 6 (`db:push`), vérifier que `pnpm install` s'est terminé sans erreur. Si erreur, la diagnostiquer avec le client avant de continuer.

Si `node_modules/` est déjà présent, passer directement à l'étape 3.

### Étape 3 — Branding (`lib/config.ts`)

Demander en une salve :

> Pour personnaliser le branding :
> 1. Quel est le **nom de l'application** ? (Ex: "Acme Pay", "Suivi Comptable")
> 2. Quelle est sa **description courte** ? (Une phrase, affichée en sous-titre et dans le `<title>` HTML)

Puis modifier `lib/config.ts` avec les valeurs reçues.

### Étape 4 — Vision produit (`.avqn/PRODUCT.md`)

Annoncer :

> Maintenant je vais vous poser quelques questions pour remplir le document `.avqn/PRODUCT.md`. Ce document décrit votre produit côté business — il sera relu à chaque session pour que je comprenne ce que vous construisez. Pas besoin d'être exhaustif, mais évitez les généralités.

Poser les questions par blocs cohérents. **Une question (ou un groupe de 2-3 liées) à la fois**, attendre la réponse avant de continuer.

**Bloc A — Vision et problème**
1. Vision en une phrase : qu'est-ce que ce produit, pour qui, et pourquoi ?
2. Quel problème concret résout-il ? Comment vos utilisateurs font-ils aujourd'hui sans lui ?

**Bloc B — Utilisateurs**
3. Qui est votre utilisateur principal ? (Profession, contexte, niveau technique, ce qu'il cherche à accomplir, sa frustration actuelle)
4. Y a-t-il d'autres profils utilisateurs à prendre en compte au MVP ?

**Bloc C — Proposition de valeur et fonctionnalités**
5. Quels sont les 3-5 bénéfices concrets pour vos utilisateurs ?
6. Quel est le parcours type ? (Étape par étape, ce que fait l'utilisateur)
7. Quelles sont les fonctionnalités clés du MVP ? (Liste courte, vue de l'écran, pas de technique)

**Bloc D — Cadrage du MVP**
8. Qu'est-ce qui est **volontairement hors scope** pour ce MVP ? (Important pour ne pas céder à la tentation plus tard)
9. À quels critères mesurables saurez-vous que le MVP est réussi ? (Ex: "5 utilisateurs payants", "10 utilisateurs reviennent une 2e fois")
10. Avez-vous déjà une idée du backlog initial ? (Liste de fonctionnalités envisagées par ordre de priorité — peut rester vide)

Si l'utilisateur répond vaguement, demander une précision avant de noter. Si une réponse manque, écrire "À compléter ultérieurement" plutôt que d'inventer.

À la fin, **ne pas régénérer PRODUCT.md en écrasant le template**. Lire le fichier, repérer les sections, remplacer uniquement les placeholders `[Remplissez ici]` (et équivalents) par les réponses recueillies. Conserver les en-têtes et les notes en blockquote du template.

### Étape 5 — Variables d'environnement (`.env.local`)

Lister les variables de `.env.example` qui sont manquantes ou vides dans `.env.local`. Pour chacune, fournir au client un guide d'obtention :

| Variable | Comment l'obtenir |
|---|---|
| `DATABASE_URL` | Neon → projet → Connection Details → "Pooled connection" |
| `BETTER_AUTH_SECRET` | Lancez `openssl rand -base64 32` dans un terminal |
| `BETTER_AUTH_URL` + `NEXT_PUBLIC_BETTER_AUTH_URL` | `http://localhost:3000` en local, URL Vercel en prod |
| `RESEND_API_KEY` | https://resend.com/api-keys |
| `RESEND_FROM_EMAIL` | Une adresse sur un domaine validé dans Resend |

**Ne pas écrire les secrets pour le client** — c'est à lui de les coller dans `.env.local`. Lui demander de confirmer quand c'est fait.

Si l'utilisateur n'a pas encore créé ses comptes Neon / Resend, lui suggérer de le faire avant de continuer (ou de revenir lancer `/init-project` plus tard).

### Étape 6 — Vérification de la base de données

**Pré-requis** : vérifier que `pnpm install` (lancé à l'étape 2) s'est terminé sans erreur. Si encore en cours, attendre. Si erreur, diagnostiquer avant de continuer.

Une fois `.env.local` complété et les dépendances installées :

> Je vais maintenant pousser le schéma initial sur votre base Neon. Ça va créer les tables d'authentification (user, session, account, verification).

Lancer `pnpm db:push`. Si erreur (connexion refusée, mauvais URL), diagnostiquer avec le client.

### Étape 7 — Premier commit

Vérifier l'état git :

```bash
git status
```

Si le starter est intact (juste les fichiers de base modifiés à l'init), faire un commit unique pour matérialiser le démarrage du projet client :

```
chore: initialisation du projet à partir du starter AVQN
```

Si l'utilisateur a déjà commité des choses, ne pas en faire un commit séparé : intégrer les modifs (`lib/config.ts`, `.avqn/PRODUCT.md`) dans son flux normal et lui laisser commiter à sa main, puis passer à l'étape 8.

### Étape 8 — Création du repo GitHub

Demander à l'utilisateur :

> Pour publier le projet sur GitHub :
> 1. Quel nom voulez-vous pour le repo ? (kebab-case recommandé, par exemple `acme-pay`)
> 2. Le repo sera créé en **privé** par défaut. C'est OK, ou vous préférez public ?

**Valider le nom** :
- Lettres, chiffres, tirets ou underscores uniquement
- Pas d'espaces, pas de caractères spéciaux
- Si invalide, redemander en expliquant la règle

Une fois validé, créer le repo et pousser :

```bash
gh repo create [name] --private --source=. --push
```

(remplacer `--private` par `--public` si l'utilisateur l'a explicitement demandé)

**Si la commande échoue** :
- **Repo déjà existant** (`name already exists on this account`) → demander un autre nom, ou proposer de cibler le repo existant manuellement
- **Erreur réseau** → relancer
- **Erreur de permission** → vérifier `gh auth status` et l'organisation cible

Une fois le repo créé avec succès, récupérer son URL :

```bash
gh repo view --json url -q .url
```

Garder cette URL pour la confirmation finale.

### Étape 9 — Confirmation

> Initialisation terminée.
>
> - Dépendances installées (`pnpm install`)
> - `lib/config.ts` : branding mis à jour ([APP_NAME])
> - `.avqn/PRODUCT.md` : rempli avec votre vision
> - `.env.local` : [statut]
> - Base de données : schéma poussé sur Neon
> - Commit `chore: initialisation du projet à partir du starter AVQN` créé
> - Repo GitHub : [URL] (privé)
>
> Prochaines étapes manuelles à votre charge :
> 1. **Lier le repo à Vercel** pour activer le déploiement automatique : https://vercel.com/new (importer le repo, puis configurer les mêmes variables d'environnement que dans `.env.local`)
> 2. Pour démarrer votre première fonctionnalité, lancez `/plan-feature` suivi d'une description courte. Inspirez-vous du backlog que vous venez de remplir.

## Anti-patterns à éviter

- Lancer la commande sans avoir vérifié les prérequis CLI (`pnpm`, `gh`, `gh auth`)
- Écraser un `PRODUCT.md` déjà rempli sans demander
- Écrire des secrets dans `.env.local` (c'est au client de les coller)
- Créer le repo GitHub avant le premier commit (le `--push` aurait rien à pousser)
- Accepter un nom de repo avec espaces ou caractères spéciaux
- Inventer des réponses à la place du client pour PRODUCT.md (si manquant → "À compléter ultérieurement")
- Enchaîner directement sur `/plan-feature` (l'utilisateur doit avoir le temps de relire son PRODUCT.md et de lier Vercel)

## Cas particulier — projet déjà partiellement initialisé

Si le client lance `/init-project` alors que des modifs sont déjà en place :

1. Présenter le rapport d'état (étape 1) en détaillant ce qui est fait
2. Proposer un mode "compléter uniquement" : remplir les trous, ne pas écraser le reste
3. Demander confirmation avant chaque écriture sur un fichier déjà modifié
4. Si un remote `origin` est déjà configuré, ne pas tenter `gh repo create` — le signaler et passer
