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

Le téléphone et l'ordinateur doivent pouvoir communiquer pour Expo Go. Le PDF final, la sauvegarde après fermeture et le partage doivent être vérifiés sur un appareil Android.

## Premier APK Android — tests internes uniquement

### Sans compte Expo, depuis GitHub Actions

Le workflow [Hatua Android APK pilot](../../.github/workflows/android-apk.yml) génère un APK autonome à partir du code React Native, sur une PR modifiant l'application ou via un déclenchement manuel depuis Actions. Une fois l'exécution **réussie**, télécharger l'artefact `hatua-android-pilot-TEST-ONLY` (ZIP), l'extraire et installer l'APK sur Android.

**Important : cet APK de démonstration est compilé avec la configuration de signature de test du projet natif généré par Expo. Il n'est pas destiné à la publication, à une diffusion publique ou à des mises à jour fiables. Il ne doit contenir aucune donnée sensible réelle.** Le ZIP est conservé temporairement (7 jours). Une installation existante signée différemment peut nécessiter la désinstallation (avec perte des CV locaux) : éviter de saisir des données importantes avant la recette.

### APK officiel de prévisualisation avec EAS Build (à privilégier)

La configuration `eas.json` fournit le profil `preview` pour un APK installable et le profil `production` pour un AAB Play Store. Elle ne configure **pas** encore de projet Expo : celui-ci doit appartenir au propriétaire de Hatua.

Depuis la racine du dépôt, avec Node.js et Git :

```bash
npm ci
cd apps/mobile
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build --platform android --profile preview
```

Au premier build, accepter la génération de la keystore Android par EAS et la conserver sur le compte Expo. `eas init` liera un véritable `extra.eas.projectId` à l'application : committer cet identifiant public au dépôt. Ne jamais committer les jetons Expo ni les clés privées.

Une fois le build terminé, Expo fournit une adresse de téléchargement et d'installation sur le téléphone. **Aucun fichier APK vérifié ni lien de téléchargement EAS n'est fourni tant qu'un build réel n'a pas réussi.**

## Recette minimale sur Android

- Créer un CV, modifier chaque rubrique, puis fermer complètement et rouvrir l'application en mode avion.
- Vérifier duplication, suppression avec confirmation, CV vide et messages de validation.
- Exporter un PDF court et un PDF multi-pages ; contrôler accents, A4, chevauchements, coupures et texte sélectionnable.
- Partager le PDF via une autre application, rouvrir Hatua, puis vérifier que les données sont intactes.
- Ne pas diffuser l'APK hors des testeurs avant ces vérifications.
