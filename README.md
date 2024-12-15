# Bijoux Boutique

Application e-commerce de vente de bijoux développée avec la stack MEAN (MongoDB, Express.js, Angular, Node.js).

## Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (v6 ou supérieur)
- Angular CLI (dernière version)

## Installation

1. Cloner le repository
2. Installer les dépendances du backend :
   ```bash
   npm install
   ```
3. Installer les dépendances du frontend :
   ```bash
   cd frontend
   npm install
   ```

## Démarrage

1. Démarrer le serveur backend :
   ```bash
   npm run dev
   ```
2. Démarrer le frontend Angular :
   ```bash
   cd frontend
   ng serve
   ```

## Fonctionnalités

- Catalogue de produits
- Panier d'achat
- Authentification utilisateur
- Gestion des commandes
- Interface d'administration
- Paiement sécurisé
- Gestion des stocks

## Structure du Projet

```
bijoux-boutique/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── environments/
└── README.md
```
