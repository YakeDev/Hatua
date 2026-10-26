# Hatua

Hatua aide à présenter son parcours dans un CV clair et à télécharger un PDF prêt à partager.

## Version actuelle

- Éditeur web React et Vite, avec aperçu en direct, deux présentations, trois palettes et une photo facultative.
- Saisie des coordonnées, du profil, des formations et des expériences.
- Sauvegarde automatique **dans le navigateur de l'appareil utilisé** (`localStorage`, clé `cv-app-state-v1`). Les CV ne sont pas synchronisés entre appareils. Les données déjà enregistrées sous cette clé restent lisibles.
- Export PDF à partir de l'aperçu. Le PDF est construit à partir d'une capture HTML et doit encore être vérifié sur des CV longs et différents navigateurs avant une publication à grande échelle.

Cette version ne propose pas encore de comptes, d'application Android native, de synchronisation, d'adaptation IA ni de publicité. Ces fonctions font partie des étapes suivantes du projet.

## Démarrer

```bash
npm ci
npm run dev
```

Vérifier les changements :

```bash
npm run lint
npm run build
```

## Direction du produit

Conserver le site web, construire l'application Android avec React Native et Expo, puis envisager iOS. Partager les modèles de données et la logique métier entre les applications. Les comptes et la synchronisation nécessiteront un service côté serveur. L'IA devra suggérer des formulations conformes au parcours réel, que le candidat pourra accepter ou refuser.

Le document de cadrage détaillé est proposé dans la [PR d'architecture](https://github.com/YakeDev/Hatua/pull/1).
