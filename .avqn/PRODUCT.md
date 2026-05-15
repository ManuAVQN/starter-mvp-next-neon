# PRODUCT.md

> Ce fichier décrit votre produit : sa vision, sa cible, ses fonctionnalités principales.
> Remplissez-le au démarrage du projet. Il sera lu par Claude au début de chaque session
> pour comprendre ce que vous construisez.
>
> Soyez clair et concret. Pas besoin d'être exhaustif, mais évitez les généralités.

---

## Vision en une phrase

RaclettePlanner est une web app qui aide les hôtes suisses romands à organiser leurs soirées raclette et fondue sans rien oublier — quantités, courses, allergies, accords vin — pour qu'ils profitent de leurs invités au lieu de stresser dans la cuisine.

---

## Le problème que vous résolvez

Organiser une raclette ou une fondue pour 8-12 personnes a l'air simple, mais c'est un nid à oublis : combien de fromage par tête, qui est intolérant au lactose, qui ne mange pas de porc, quel vin associer, est-ce qu'on a assez de cornichons, est-ce qu'on prend du Bagnes ou du Gruyère. Aujourd'hui, l'hôte gère ça dans sa tête, sur un bout de papier, ou via trois conversations WhatsApp parallèles — et finit toujours par acheter trop ou pas assez, oublier le pain, ou découvrir l'allergie d'un invité au moment du dressage.

Le problème est universel en Suisse romande (saison raclette = septembre à avril), mais aucun outil ne le traite vraiment : les apps de courses sont génériques, les sites de recettes ne calculent pas les quantités par convive, et personne ne croise allergies + budget + accord vin en un seul endroit.

---

## Utilisateurs cibles

### Profil 1 : L'hôte occasionnel
- **Qui** : trentenaire/quadra romand·e qui reçoit 4 à 8 fois par hiver (anniversaires, soirées copains, raclette de quartier)
- **Niveau technique** : grand public, utilise des apps mobiles, pas de compétence particulière
- **Ce qu'il veut accomplir** : organiser une soirée réussie sans y passer 3 heures de planification
- **Sa frustration actuelle** : oublier un détail, acheter trop de fromage (qui finit congelé), ne pas savoir quoi servir aux intolérants au lactose

### Profil 2 : Le secrétaire de société (carnotzet, fanfare, club de sport)
- **Qui** : bénévole qui organise les soupers d'association, souvent 20-40 personnes
- **Niveau technique** : utilise Excel, email, parfois Doodle
- **Ce qu'il veut accomplir** : industrialiser l'organisation des soupers récurrents, gérer les inscriptions, sortir une liste de courses fiable
- **Sa frustration actuelle** : recommencer le tableur de zéro chaque année, courir après les confirmations, gérer les régimes spéciaux à la main

---

## Proposition de valeur

- **Plus jamais "il manque du fromage"** : calcul automatique des quantités selon nombre de convives, type de soirée, appétits déclarés
- **Allergies et régimes intégrés** : chaque invité déclare ses contraintes, l'app adapte les achats et alerte sur les conflits
- **Liste de courses Migros/Coop prête** : catégorisée par rayon, avec quantités précises et budget estimé
- **Accords vin et apéro suggérés** : selon le fromage, la saison et le budget — pour briller sans se prendre la tête
- **Mémoire des soirées passées** : "la même qu'en février mais sans Sophie" en un clic

---

## Descriptif fonctionnel

### Parcours principal

1. L'hôte crée une nouvelle soirée : type (raclette / fondue moitié-moitié / fondue vacherin), date, nombre estimé d'invités
2. Il envoie un lien d'invitation par WhatsApp/email — chaque invité confirme et déclare ses contraintes (lactose, porc, alcool, appétit)
3. L'app calcule les quantités : fromage par tête, accompagnements, pain, vin, eau
4. L'hôte ajuste le budget (économique / standard / soigné) et choisit ses fromages préférés
5. L'app génère la liste de courses catégorisée par rayon et l'accord vin recommandé
6. L'hôte coche au fur et à mesure de ses achats ; l'app garde la trace pour la prochaine soirée

### Fonctionnalités clés

- **Calculateur de quantités** : algorithme par type de soirée (200g de fromage/personne en raclette, 200-250g en fondue), modulable selon appétits déclarés et présence d'accompagnements lourds
- **Gestion des invités** : lien partageable sans création de compte côté invité, déclaration des allergies et préférences en 30 secondes
- **Liste de courses intelligente** : catégorisée par rayon (crémerie, boucherie, cave, épicerie), avec quantités arrondies aux conditionnements réels (paquets de 400g, bouteilles de 75cl)
- **Suggestions d'accords** : base de connaissances fromage/vin/saison adaptée à la Suisse romande (Fendant, Chasselas, Petite Arvine, Humagne, etc.)
- **Mode société** : gestion des soupers récurrents, import d'une liste de membres, statistiques sur l'année
- **Historique** : dupliquer une soirée passée en deux clics, retirer ou ajouter un invité

### Hors scope (volontairement)

- Commande directe en ligne chez Migros/Coop (juste la liste, pas l'achat)
- Recettes au-delà de raclette/fondue (pas de croûtes au fromage, pas de röstis)
- App mobile native (web responsive uniquement pour le MVP)
- Paiement entre invités / cagnotte partagée
- Notifications push, rappels J-1, etc.

---

## Critères de succès du MVP

- 20 soirées effectivement organisées avec l'outil sur la saison (oct-mars)
- 5 utilisateurs qui reviennent organiser une 2e soirée
- 1 société (carnotzet, fanfare, club) qui adopte l'outil pour ses soupers récurrents
- Temps moyen de planification d'une soirée < 10 minutes (vs ~30 min sans outil)

---

## Backlog initial

### Indispensable pour le MVP
- [ ] Création d'une soirée (type, date, nombre estimé d'invités)
- [ ] Calculateur de quantités de fromage selon type de soirée et nombre
- [ ] Lien d'invitation partageable + page de déclaration invité (allergies, appétit)
- [ ] Génération de la liste de courses catégorisée par rayon
- [ ] Suggestion d'accord vin selon fromage et budget
- [ ] Vue récap soirée pour l'hôte (invités confirmés, contraintes, courses)

### Important mais pas bloquant
- [ ] Compte hôte avec historique des soirées
- [ ] Dupliquer une soirée passée
- [ ] Mode "société" avec liste de membres récurrents
- [ ] Estimation budgétaire avec prix indicatifs Migros/Coop
- [ ] Export PDF de la liste de courses

### Idées pour plus tard
- Mode "fromage du producteur" avec annuaire des laiteries romandes
- Suggestions de playlist musicale selon ambiance
- Intégration calendrier (Google/Apple)
- Statistiques de société : fromage consommé sur l'année, coût moyen par tête
- Version Suisse alémanique (chäs/wii au lieu de fromage/vin)

---

## Notes libres

- **Saisonnalité forte** : usage concentré octobre-mars, donc le MVP doit être prêt pour octobre. Hors saison = itérations tranquilles.
- **Ton de voix** : décontracté, romand, légèrement taquin. "Vous avez oublié les cornichons" plutôt que "Veuillez compléter votre panier".
- **Référentiel fromages** : Raclette du Valais AOP, Bagnes, Gomser, Gruyère, Vacherin Fribourgeois, Tête de Moine. Ne pas tomber dans le générique "fromage à raclette".
- **Inspiration produit** : la simplicité de Doodle (pas de compte côté invité) + la précision d'une recette de Betty Bossi + le ton d'une carte de Lausanne Tourisme.
- **Stack envisagée** (à valider en /plan-feature) : Next.js ou SvelteKit côté front, Directus côté back, déploiement Coolify. Cohérent avec le stack AVQN.
- **Pas de monétisation au MVP** : gratuit, juste pour valider l'usage. Modèle freemium éventuel plus tard (mode société payant ?).