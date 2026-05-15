---
description: Corrige rapidement un bug, hors workflow MVP (pas de fiche specs/)
---

Active le **flow de correctif rapide** du workflow AVQN MVP.

Lis d'abord `references/phase-fix.md` du skill `avqn-mvp` pour avoir le déroulé détaillé.

Description du bug à corriger (fournie par l'utilisateur) :
$ARGUMENTS

Si l'argument est vide, demande à l'utilisateur de décrire ce qui ne fonctionne pas : symptôme observé, étape précise du parcours, message d'erreur éventuel.

Rappels critiques :
- Pas de fiche `specs/`, pas de numérotation
- Diagnostiquer avant de corriger (ne pas tenter une rustine sans comprendre)
- Lint + typecheck obligatoires avant commit
- Commit avec préfixe `fix:` (voir `references/commit-format.md`)
- Push direct sur `main`
- Entrée dans `.avqn/DECISIONS.md` uniquement si le correctif révèle une décision structurante (sinon non)
