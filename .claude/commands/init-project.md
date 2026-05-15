---
description: Guide le setup initial du projet après dezip du starter AVQN (à lancer une fois)
---

Active le **flow d'initialisation projet** du workflow AVQN MVP.

Lis d'abord `references/phase-init.md` du skill `avqn-mvp` pour avoir le déroulé détaillé.

Argument optionnel (nom de l'app, si l'utilisateur l'a fourni) :
$ARGUMENTS

Rappels critiques :
- Vouvoiement obligatoire
- Toutes les questions en français, une à la fois (ou groupées par 2-3 si liées)
- Ne pas écrire de code applicatif à ce stade, seulement modifier `lib/config.ts` et `.avqn/PRODUCT.md`
- Vérifier l'état actuel avant d'écraser quoi que ce soit
- Terminer par un commit `chore: initialisation du projet à partir du starter AVQN` et une invitation à lancer `/plan-feature`
