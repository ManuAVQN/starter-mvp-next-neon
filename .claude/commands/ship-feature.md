---
description: Finalise et livre une feature (phase 3 du workflow AVQN)
---

Active la **Phase 3 — Livrer** du workflow AVQN MVP.

Lis d'abord `references/phase-ship.md` du skill `avqn-mvp` pour avoir le déroulé détaillé.

Numéro de la feature à livrer (fourni par l'utilisateur) :
$ARGUMENTS

Si l'argument est vide, demande à l'utilisateur quelle feature livrer et liste les fiches en statut "en cours" dans `specs/`.

Rappels critiques :
- Lancer `pnpm lint` et `pnpm typecheck` (ou équivalents), corriger jusqu'à ce que tout passe
- Mettre à jour la fiche `specs/[NN]-[slug].md` : statut "terminée", date de fin, partie 3 remplie
- Ajouter une entrée à `.avqn/DECISIONS.md` si la feature contient des décisions techniques notables
- Commit unique avec message `feat: [NN] [titre court]`
- Push sur main
- Confirmer la livraison à l'utilisateur avec le lien Vercel
