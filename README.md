# Hatua

Hatua aide à présenter son parcours dans un CV clair et à télécharger un PDF prêt à partager. Le dépôt contient le site React/Vite et une application React Native/Expo en cours de développement.

## Site web

- Éditeur web React et Vite, avec aperçu en direct, deux présentations, trois palettes et une photo facultative.
- Saisie des coordonnées, du profil, des formations et des expériences.
- Sauvegarde automatique **dans le navigateur de l'appareil utilisé** (`localStorage`, clé `cv-app-state-v1`). Les CV ne sont pas synchronisés entre appareils. Les données déjà enregistrées sous cette clé restent lisibles.
- Export PDF à partir de l'aperçu. Le PDF est construit à partir d'une capture HTML et doit encore être vérifié sur des CV longs et différents navigateurs avant une publication à grande échelle.

Le site ne propose pas encore de comptes, de synchronisation, d'adaptation IA ni de publicité.

## Application mobile pilote

`apps/mobile` contient une application Expo native avec plusieurs CV, édition par étapes, stockage SQLite local, aperçu et création/partage d'un PDF. Le modèle versionné dans `packages/domain` est commun aux futures interfaces. La première cible est Android ; le parcours iOS est à vérifier sur appareil.

L'application mobile est pour l'instant **indépendante du site** : aucun compte ni transfert automatique de CV entre appareils. Le PDF, la persistance et l'interface doivent être vérifiés sur un téléphone avant diffusion.

## Démarrer

```bash
npm ci
npm run dev
```

Vérifier les changements :

```bash
npm run lint
npm run build
npm run mobile:typecheck
npm run test:domain
```

Lancer Expo :

```bash
npm run mobile
```

Expo SDK 57 a été retenu pour pouvoir tester l'application sur un téléphone avec Expo Go pendant la transition actuelle du SDK. Une build Android installable et l'intégration d'AdMob viendront après la vérification du parcours natif.

## Direction du produit

Le site reste temporairement à la racine pour préserver son déploiement. Les nouveaux packages utilisent npm workspaces. Les comptes et la synchronisation nécessiteront un service côté serveur. L'IA devra suggérer des formulations conformes au parcours réel, que le candidat pourra accepter ou refuser.

Le document de cadrage détaillé est proposé dans la [PR d'architecture](https://github.com/YakeDev/Hatua/pull/1).
