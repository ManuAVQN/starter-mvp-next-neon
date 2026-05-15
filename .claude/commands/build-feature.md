---
description: Implémente une feature planifiée (phase 2 du workflow AVQN)
---

Active la **Phase 2 — Implémenter** du workflow AVQN MVP.

Lis d'abord `references/phase-build.md` du skill `avqn-mvp` pour avoir le déroulé détaillé.

Numéro de la feature à implémenter (fourni par l'utilisateur) :
$ARGUMENTS

Si l'argument est vide, demande à l'utilisateur quelle feature implémenter (ex : "01", "03") et liste les fiches disponibles dans `specs/` avec leur statut.

Rappels critiques :
- Lire `specs/[NN]-[slug].md` avant de coder
- Mettre à jour le statut à "en cours" dans la fiche
- Annoncer le plan d'action avant de coder
- Suivre les conventions de `.avqn/STACK.md`
- Pas de lint/typecheck à ce stade (c'est le job de ship)
- Pas de commit/push à ce stade
- Terminer en invitant l'utilisateur à tester en local, puis à lancer `/ship-feature [NN]`
