# Hatua — Architecture web, Android et iOS

Statut : cadrage mis à jour le 26 octobre 2026. Le nouveau parcours web de la PR #2 est fusionné ; un premier pilote Expo Android est proposé dans la PR #3. Les comptes, la synchronisation et l'IA restent à développer.

## 1. Produit et première livraison

Hatua aide une personne à construire un CV fidèle à son parcours, à le conserver, à le partager en PDF et, ensuite, à l'adapter à une offre d'emploi. L'IA propose des reformulations vérifiables ; la personne accepte ou refuse chaque suggestion. Une exigence absente du parcours est signalée, jamais présentée comme une compétence acquise.

La première livraison mobile doit permettre de créer un CV complet sur Android, de fermer et rouvrir l'application, de retrouver le CV sans connexion et de partager un PDF utilisable. Le site web existant reste disponible pendant cette migration. iOS reprend la même application Expo après les vérifications propres à cette plateforme.

L'éditeur et l'export local fonctionnent sans compte et sans connexion. L'adaptation IA nécessite un accès au serveur. Les lettres de motivation, entretiens vocaux, import automatique de CV et synchronisation entre appareils sont des évolutions ultérieures.

## 2. Décision : deux interfaces dans un dépôt

Le dépôt contient actuellement un site React/Vite qui utilise HTML, Tailwind, localStorage et html2pdf.js. Expo peut aussi produire un site web avec React Native for Web, mais les écrans actuels et l'export ne se réutilisent pas directement sur Android. Pour conserver le site et éviter une réécriture simultanée, Hatua aura deux applications dans un monorepo :

| Chemin cible | Responsabilité | État |
| --- | --- | --- |
| Racine du dépôt (web) | Site React/Vite existant ; déploiement actuel conservé | Présent, parcours amélioré par la PR #2 ; déplacement vers apps/web différé |
| apps/mobile | Application React Native/Expo Router, Android d'abord, iOS ensuite | Pilote hors ligne proposé dans la PR #3, recette appareil à faire |
| packages/domain | Types, schémas, validation, migrations et règles de candidature indépendants des interfaces | Premier modèle versionné proposé dans la PR #3 ; migration web à poursuivre |
| packages/cv-document | Modèle des sections et contenu du document ; moteur PDF propre à chaque plateforme si nécessaire | À créer après validation du modèle |
| apps/api | Accès IA, quotas, puis identité/synchronisation et droits payants | À créer lorsque l'IA arrive |
| docs | Décisions, parcours, contrats de données et recette | Présent document |

La PR #3 introduit npm workspaces pour apps/mobile et packages/*, sans déplacer le site web. Un déplacement futur vers apps/web devra préserver la configuration de déploiement et les brouillons locaux. TypeScript sera utilisé pour le nouveau code ; le site JavaScript migrera progressivement. Expo Router organise la navigation mobile. Les composants React DOM du site et les composants React Native du mobile restent dans leurs applications respectives. Seuls les types, données et règles sans dépendance au DOM ni aux API natives entrent dans packages/domain.

Ce choix laisse ouverte une éventuelle interface web Expo plus tard, si son coût devient justifié. Il n'est pas nécessaire pour livrer Android.

## 3. Modèle de données commun

Le modèle sépare le parcours de la version de CV envoyée à une entreprise.

- CandidateProfile : identité, coordonnées, résumé, expériences avec missions et réalisations, formations, compétences et langues.
- CvDocument : identifiant, titre, données figées ou ajustements propres à cette version, ordre et visibilité des sections, modèle visuel, dates de création et modification. Dupliquer un CV ne doit pas modifier une autre version par surprise.
- JobOffer : texte fourni par la personne, intitulé, entreprise facultative et date d'ajout.
- AiSuggestion : champ visé, texte d'origine, proposition, justification, références aux faits du profil, état en attente/accepté/refusé.
- Toutes les données persistées portent un schemaVersion. Les identifiants sont stables. Les dates de parcours utilisent un format texte explicite tel que AAAA-MM ou AAAA-MM-JJ, sans conversion implicite de fuseau horaire.

Les validations empêchent les périodes incohérentes, les champs obligatoires vides et la perte silencieuse de données lors d'une migration. Un CV peut masquer une rubrique sans effacer son contenu du profil.

## 4. Stockage et sauvegarde

| Plateforme | Stockage initial | Migration et protection |
| --- | --- | --- |
| Web | Conserver temporairement la lecture de cv-app-state-v1 ; évoluer vers IndexedDB pour plusieurs CV et photos | Importer les données existantes, conserver une copie de secours jusqu'à confirmation, proposer export/import JSON |
| Android et iOS | SQLite local pour les CV ; fichiers locaux pour les photos | Sauvegarde automatique, migrations versionnées et export/import JSON |
| Serveur | Aucun CV requis pour l'éditeur local | N'envoyer à l'IA que les données nécessaires à la demande, après action explicite |

La synchronisation ne doit pas être simulée par un simple compte. Quand elle sera ajoutée, il faudra définir l'identité, les conflits entre appareils, la suppression et la reprise des données.

## 5. Parcours et export

Web : liste des CV, édition adaptée au bureau, aperçu, export et duplication. Mobile : liste des CV, édition par sections courtes, aperçu, export et partage. Les champs et les règles sont identiques, mais les présentations sont adaptées à chaque écran.

L'export actuel par capture doit être remplacé ou contourné par un rendu PDF dont le texte peut être sélectionné. Le contenu et les règles de mise en page seront définis ensemble ; les mécanismes techniques peuvent différer. Sur mobile, évaluer expo-print puis expo-sharing. Sur le web, utiliser une génération/ impression PDF adaptée au navigateur. Vérifier sur un CV court et un CV de plusieurs pages : A4, accents, photo, sauts de page, texte sélectionnable et taille du fichier. Ne pas supposer que le seul choix d'une bibliothèque garantit ces résultats.

## 6. IA, sécurité et monétisation

L'application envoie au serveur le profil et l'offre nécessaires pour une adaptation. Le serveur garde la clé du fournisseur d'IA, contrôle les quotas et renvoie des suggestions structurées. L'interface montre le texte initial, la proposition et la justification avant chaque validation. L'IA ne modifie pas directement la version originale du CV et n'annonce pas une probabilité d'embauche.

Le modèle commercial à tester est : éditeur local gratuit ; annonces discrètes dans l'application mobile après validation de son usage ; crédits pour les fonctions IA si les coûts et l'intérêt des utilisateurs le justifient. Un abonnement peut ensuite viser des professionnels utilisant Hatua de manière régulière. AdMob appartient à l'application mobile et ne doit jamais figurer dans le PDF. L'intégration publicitaire exige une build de développement native pour le SDK, des annonces de test, une politique de confidentialité et les choix de consentement applicables. Les achats numériques dans une application distribuée sur Google Play devront suivre ses règles de facturation.

Les données d'un CV sont personnelles. Ne pas mettre de clé secrète dans le navigateur ou l'application mobile ; ne pas journaliser intégralement les CV côté serveur ; prévoir export et suppression. La PR #2 a retiré les coordonnées de démonstration pour les nouveaux CV ; les brouillons historiques sont conservés.

## 7. Ordre de réalisation et critères de sortie

| Phase | Livraison | Vérification décisive |
| --- | --- | --- |
| 0. Stabiliser | Dépendances déclarées, installation propre, lint/build, export actuel mesuré | Installation neuve réussie ; défauts connus documentés |
| 1. Organiser | npm workspaces ; site maintenu à la racine jusqu'à validation du déploiement | Même site et données locales conservées ; build web réussie |
| 2. Partager le modèle | packages/domain, migrations, compétences, langues, réalisations, plusieurs CV | Anciennes données importées ; duplication et sauvegarde fiables |
| 3. Android hors ligne | Application Expo avec navigation et édition par sections, SQLite | Création, fermeture, réouverture et modification sans réseau |
| 4. Document | Aperçu, PDF et partage Android ; export web amélioré | PDF lisible, texte sélectionnable, plusieurs pages vérifiées sur appareil |
| 5. Adaptation IA | API, quotas, propositions acceptées/refusées et nouvelle version de CV | Aucune expérience inventée ; clé absente du client ; coûts suivis |
| 6. Pilote et revenus | Tests avec candidats, mesures d'usage, annonces de test puis éventuelles annonces réelles | Parcours terminé par des utilisateurs ; revenus et gêne publicitaire mesurés |
| 7. iOS | Build et recette iOS de l'application Expo | Stockage, PDF, partage et parcours IA vérifiés sur iPhone |

Les contrôles automatisés portent d'abord sur les migrations, les règles du CV et le contrat des suggestions IA. Chaque application a ses scripts de lint, vérification TypeScript et build. Les PDF et l'interface mobile exigent aussi une recette visuelle et un essai sur appareil réel.

## 8. Décisions à valider pendant la réalisation

- Identité de marque Hatua : logo, ton, langues de l'interface et domaine.
- Contenu précis des deux premiers modèles de CV et qualité attendue du PDF.
- Moment où la synchronisation devient nécessaire pour les utilisateurs.
- Prix, crédits IA et annonces, à décider après mesure de l'usage et des coûts.

Ces décisions ne bloquent pas la phase 0 ni la mise en place du modèle de données.

## Références techniques

- Expo, monorepos : https://docs.expo.dev/guides/monorepos/
- Expo pour le web : https://docs.expo.dev/workflow/web/
- Expo Router : https://docs.expo.dev/router/introduction/
- Expo SQLite : https://docs.expo.dev/versions/latest/sdk/sqlite/
- Expo Print : https://docs.expo.dev/versions/latest/sdk/print/
- Expo Sharing : https://docs.expo.dev/versions/latest/sdk/sharing/
- EAS Build : https://docs.expo.dev/build/introduction/
