# Bijoux Boutique

Application e-commerce de vente de bijoux développée avec la stack MEAN (MongoDB, Express.js, Angular, Node.js).

## Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (v6 ou supérieur)
- Angular CLI (dernière version)
- Un fichier .env configuré (voir section Configuration)

## Installation

1. Cloner le repository :
   ```bash
   git clone <votre-repo>
   cd bijoux-boutique
   ```

2. Installer les dépendances du backend :
   ```bash
   npm install
   ```

3. Installer les dépendances du frontend :
   ```bash
   cd frontend
   npm install
   ```

## Configuration

1. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   MONGODB_URI=votre_uri_mongodb
   JWT_SECRET=votre_secret_jwt
   PORT=3000
   ```

## Démarrage

1. Démarrer le serveur backend :
   ```bash
   npm run dev
   ```

2. Dans un nouveau terminal, démarrer le frontend Angular :
   ```bash
   cd frontend
   ng serve
   ```

L'application sera accessible à l'adresse : `http://localhost:4200`

## Fonctionnalités

### Côté Client
- Catalogue de produits avec filtres et recherche
- Panier d'achat persistant
- Authentification utilisateur (inscription/connexion)
- Gestion du profil utilisateur
- Suivi des commandes
- Paiement sécurisé
- Liste de souhaits

### Côté Administration
- Gestion complète des produits (CRUD)
- Gestion des stocks
- Suivi des commandes
- Gestion des utilisateurs
- Tableau de bord avec statistiques

## Structure du Projet

```
bijoux-boutique/
├── backend/
│   ├── config/         # Configuration de l'application
│   ├── controllers/    # Contrôleurs de l'API
│   ├── middleware/     # Middleware personnalisés
│   ├── models/        # Modèles MongoDB
│   └── routes/        # Routes de l'API
├── frontend/
│   ├── src/
│   │   ├── app/       # Components Angular
│   │   ├── assets/    # Images et ressources statiques
│   │   └── styles/    # Fichiers CSS/SCSS
├── .env               # Variables d'environnement
├── package.json       # Dépendances du projet
└── server.js         # Point d'entrée du serveur
```

## Technologies Utilisées

- **Frontend** : Angular 17, SCSS, Angular Material
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB
- **Authentification** : JWT
- **Upload de fichiers** : Multer
- **Validation** : Express Validator

## Scripts Disponibles

- `npm start` : Démarre le serveur en mode production
- `npm run dev` : Démarre le serveur en mode développement avec nodemon
- `npm test` : Lance les tests

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

ISC
