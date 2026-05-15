# Template — Fiche de feature

Format à utiliser pour générer `specs/[NN]-[slug].md` en phase 1.

---

```markdown
# Feature [NN] — [Titre clair de la feature]

> Statut : planifiée | en cours | terminée | abandonnée
> Créée le : [YYYY-MM-DD]
> Terminée le : [YYYY-MM-DD ou vide]

---

## Partie 1 — Le quoi (côté produit)

### Objectif
[Une phrase. Quel besoin utilisateur cette feature résout.]

### Comportement attendu
- En tant que [type d'utilisateur], je peux [action] pour [bénéfice]
- [...]
- [3 à 5 bullets maximum]

### Cas d'erreur et limites
- [Que se passe-t-il si X ?]
- [Que se passe-t-il si Y ?]
- [2 à 4 bullets, ou "Aucun cas particulier identifié" si applicable]

### Critères de fini
- [ ] [Critère vérifiable 1 — formulé comme un test à faire à l'écran]
- [ ] [Critère vérifiable 2]
- [ ] [Critère vérifiable 3]
- [ ] [3 à 5 bullets maximum]

---

## Partie 2 — Le comment (côté technique)

### Approche d'implémentation
[2 à 4 paragraphes. Décrire l'approche technique :
- Quels composants sont créés ou modifiés
- Logique côté serveur vs client (server components, server actions, route handlers)
- Patterns choisis et pourquoi
- Flow de données global]

### Données impliquées
- **Tables existantes touchées** : [liste, ou "Aucune"]
- **Nouvelles tables/champs** : [détails, ou "Aucun"]
- **Migration Drizzle nécessaire** : oui / non

### Choix techniques notables
- **Lib utilisée** : [nom + version, justifier le choix]
- **Pattern UI** : [composant shadcn ou approche custom, avec brève justification]
- **Points d'attention** : [perf, sécurité, edge cases connus]

### Fichiers impactés (estimation)
- `app/[chemin]/page.tsx` — création
- `db/schema/[fichier].ts` — modification (ajout table X)
- `components/[nom].tsx` — création
- [Liste indicative, peut évoluer en cours d'implémentation]

---

## Partie 3 — Notes post-implémentation

> Cette partie est remplie par `/ship-feature` à la fin de la livraison.

- [Ce qui a changé par rapport au plan initial, si applicable]
- [Bugs rencontrés et résolution]
- [Décisions techniques prises en cours de route]
- [Gotchas pour le futur]
- [Si rien de notable : "Implémentation conforme au plan, aucune décision notable."]
```

---

## Règles de remplissage

**Partie 1** :
- L'objectif doit être compréhensible par quelqu'un qui ne connaît pas le produit
- Les bullets de comportement attendu utilisent le format "En tant que X, je peux Y pour Z"
- Les critères de fini doivent être testables à l'écran, pas abstraits

**Partie 2** :
- L'approche d'implémentation est un brief pour développeur, pas un cours de code
- Pas de pseudo-code, pas de snippets
- Justifier les choix techniques notables, surtout s'ils dévient des patterns du starter kit

**Partie 3** :
- Honnêteté > exhaustivité
- 3 à 6 bullets max
- Si rien de notable, le dire explicitement plutôt que de remplir avec du blabla
