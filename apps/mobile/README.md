# Hatua mobile

Application React Native et Expo Router, cible Android pilote. Le même code est destiné à iOS après sa recette sur iPhone.

## Parcours disponible

1. Créer, dupliquer, modifier et supprimer plusieurs CV.
2. Renseigner coordonnées, présentation, expériences, formations, compétences et langues.
3. Retrouver les CV hors ligne après fermeture de l'application grâce au stockage local SQLite (`hatua-cvs-v1`). Une version inconnue ou illisible n'est pas écrasée automatiquement.
4. Prévisualiser et créer un PDF A4, puis l'envoyer par le partage natif du téléphone.

Les comptes, la synchronisation, les annonces et l'IA ne sont pas présents. Les données saisies sur le site web ne sont pas encore importées dans l'application mobile.

## Développement

À la racine du dépôt :

```bash
npm ci
npm run mobile
npm run mobile:typecheck
npm run test:domain
```

Le téléphone et l'ordinateur doivent pouvoir communiquer pour Expo Go. Le PDF final, la sauvegarde après fermeture et le partage doivent être vérifiés sur un appareil Android. Ce dépôt ne contient pas encore d'APK ni de configuration EAS liée à un compte Expo.
