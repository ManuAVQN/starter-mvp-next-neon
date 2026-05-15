# Flow — Initialisation projet

Activé par la commande `/init-project`. À lancer **une seule fois**, juste après le dezip du starter AVQN.

## Objectif

Transformer le starter générique en un projet client identifiable :

- Nom et description (`lib/config.ts`)
- Vision et descriptif fonctionnel (`.avqn/PRODUCT.md`)
- Variables d'environnement (`.env.local`)
- Premier commit du projet

À la fin, le client peut lancer `/plan-feature` pour démarrer sa première fonctionnalité.

## Pré-flight

### Étape 1 — État du projet

Vérifier silencieusement :

1. `lib/config.ts` — `APP_NAME` vaut-il toujours `"AVQN Starter"` ?
2. `.avqn/PRODUCT.md` — contient-il les placeholders `[Remplissez ici]` ?
3. `.env.local` — existe-t-il ? Contient-il toutes les variables de `.env.example` ?
4. `git log --oneline` — y a-t-il déjà des commits du client (au-delà du commit du starter) ?

Construire un mini-rapport à montrer à l'utilisateur :

> Avant de démarrer, voici l'état du projet :
> - Branding (`lib/config.ts`) : [par défaut / déjà modifié]
> - PRODUCT.md : [vide / partiellement rempli / déjà rempli]
> - `.env.local` : [absent / présent mais incomplet / complet]
> - Historique git : [starter intact / commits déjà en place]
>
> Voulez-vous que je vous accompagne pour finaliser cette initialisation ?

**Si tout est déjà configuré** : signaler que `/init-project` n'a plus rien à faire, ne pas insister, ne pas écraser.

**Si l'utilisateur valide** : passer à l'étape 2.

## Déroulé

### Étape 2 — Branding (`lib/config.ts`)

Demander en une salve :

> Pour personnaliser le branding :
> 1. Quel est le **nom de l'application** ? (Ex: "Acme Pay", "Suivi Comptable")
> 2. Quelle est sa **description courte** ? (Une phrase, affichée en sous-titre et dans le `<title>` HTML)

Puis modifier `lib/config.ts` avec les valeurs reçues.

### Étape 3 — Vision produit (`.avqn/PRODUCT.md`)

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

### Étape 4 — Variables d'environnement (`.env.local`)

Lister les variables de `.env.example` qui sont manquantes ou vides dans `.env.local`. Pour chacune, fournir au client un guide d'obtention :

| Variable | Comment l'obtenir |
|---|---|
| `DATABASE_URL` | Neon → projet → Connection Details → "Pooled connection" |
| `BETTER_AUTH_SECRET` | Lancez `openssl rand -base64 32` dans un terminal |
| `BETTER_AUTH_URL` + `NEXT_PUBLIC_BETTER_AUTH_URL` | `http://localhost:3000` en local, URL Vercel en prod |
| `RESEND_API_KEY` | https://resend.com/api-keys |
| `RESEND_FROM_EMAIL` | Une adresse sur un domaine validé dans Resend |

**Ne pas écrire les secrets pour le client** — c'est à lui de les coller dans `.env.local`. Lui demander de confirmer quand c'est fait.

Si l'utilisateur n'a pas encore créé ses comptes Neon / Resend / Vercel, lui suggérer de le faire avant de continuer (ou de revenir lancer `/init-project` plus tard).

### Étape 5 — Vérification de la base de données

Une fois `.env.local` complété :

> Je vais maintenant pousser le schéma initial sur votre base Neon. Ça va créer les tables d'authentification (user, session, account, verification).

Lancer `pnpm db:push`. Si erreur (connexion refusée, mauvais URL), diagnostiquer avec le client.

### Étape 6 — Premier commit

Vérifier l'état git :

```bash
git status
```

Si le starter est intact (juste les fichiers de base), faire un commit unique pour matérialiser le démarrage du projet client :

```
chore: initialisation du projet à partir du starter AVQN
```

Si l'utilisateur a déjà commité des choses, ne pas en faire un commit séparé : intégrer les modifs (`lib/config.ts`, `.avqn/PRODUCT.md`) dans son flux normal et lui laisser commiter à sa main.

**Push :** ne pas pousser automatiquement. L'utilisateur doit avoir configuré le remote GitHub et lié Vercel avant. Lui demander :

> Avez-vous déjà créé le repo GitHub et lié le projet à Vercel ? Si non, je peux vous guider. Si oui, dites-moi quand vous êtes prêt à pousser.

### Étape 7 — Confirmation

> ✅ Initialisation terminée.
>
> - `lib/config.ts` : branding mis à jour ([APP_NAME])
> - `.avqn/PRODUCT.md` : rempli avec votre vision
> - `.env.local` : [statut]
> - Base de données : [statut]
> - Commit `chore: initialisation du projet à partir du starter AVQN` créé
>
> Pour démarrer votre première fonctionnalité, lancez `/plan-feature` suivi d'une description courte. Pensez à vous appuyer sur le backlog que vous venez de remplir.

## Anti-patterns à éviter

- Écraser un `PRODUCT.md` déjà rempli sans demander
- Écrire des secrets dans `.env.local` (c'est au client de les coller)
- Pousser sur GitHub automatiquement (le remote peut ne pas être configuré)
- Inventer des réponses à la place du client pour PRODUCT.md (si manquant → "À compléter ultérieurement")
- Enchaîner directement sur `/plan-feature` (l'utilisateur doit avoir le temps de relire son PRODUCT.md)

## Cas particulier — projet déjà partiellement initialisé

Si le client lance `/init-project` alors que des modifs sont déjà en place :

1. Présenter le rapport d'état (étape 1) en détaillant ce qui est fait
2. Proposer un mode "compléter uniquement" : remplir les trous, ne pas écraser le reste
3. Demander confirmation avant chaque écriture sur un fichier déjà modifié
