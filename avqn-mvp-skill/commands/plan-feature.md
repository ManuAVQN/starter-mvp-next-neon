---
description: Démarre la planification d'une nouvelle feature (phase 1 du workflow AVQN)
---

Active la **Phase 1 — Planifier** du workflow AVQN MVP.

Lis d'abord `references/phase-plan.md` du skill `avqn-mvp` pour avoir le déroulé détaillé.

Description de la feature à planifier (fournie par l'utilisateur) :
$ARGUMENTS

Si l'argument est vide ou trop vague, demande à l'utilisateur de décrire ce qu'il veut faire en quelques phrases avant de commencer les questions structurées.

Rappels critiques :
- Vouvoiement obligatoire
- 3-5 questions produit, puis validation, puis 3-5 questions techniques
- Ne pas écrire de code à ce stade
- Générer la fiche dans `specs/[NN]-[slug].md`
- Terminer par une invitation à lancer `/build-feature [NN]`
