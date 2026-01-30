# Clean PRO 🧹

Plateforme web moderne de gestion et réservation de services de nettoyage professionnels avec interface intuitive et fonctionnalités complètes.

## 📋 Table des matières
- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies-utilisées)
- [Structure](#structure-du-projet)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Licence](#licence)

## Description

Clean PRO est une plateforme SaaS complète permettant aux clients de réserver des services de nettoyage professionnels et aux administrateurs de gérer efficacement leur activité.

**Domaines de service:**
- 🏠 **Nettoyage des maisons** - Standard et Premium
- 🏢 **Nettoyage des bâtiments** - Immeubles et industriel
- 💼 **Nettoyage des bureaux** - Standard et Complet
- 🚗 **Nettoyage des véhicules** - Intérieur et Complet

## ✨ Fonctionnalités

### Pour les Clients
✅ Accueil avec présentation moderne des services  
✅ Parcourir les services par catégorie  
✅ **Panier d'achat** - Commander plusieurs se

rvices en une seule commande  
✅ Système d'authentification sécurisé (inscription/connexion)  
✅ Réservation facile avec date, heure et adresse  
✅ Historique des réservations  
✅ Suivi du statut des réservations (en attente, confirmée, en cours, terminée)  
✅ Annulation de réservations  
✅ Profil utilisateur modifiable  

### Pour les Administrateurs
✅ Tableau de bord avec statistiques  
✅ Gestion complète des réservations (créer, modifier, supprimer, changer statut)  
✅ Gestion des services (CRUD complet)  
✅ Gestion des utilisateurs  
✅ Filtrage et recherche avancée  
✅ Pagination des résultats  

## Technologies utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling responsive
- **React Hot Toast** - Notifications
- **React Icons** - Icônes vectorielles
- **Axios** - Client HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web RESTful
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM MongoDB avec validations
- **Express Validator** - Validation des données

### Sécurité
- **JWT (JSON Web Token)** - Authentification sans état
- **bcryptjs** - Hachage sécurisé des mots de passe
- **CORS** - Protection des requêtes cross-origin

## Structure du Projet

```
Clean PRO/
├── backend/
│   ├── config/
│   │   └── db.js                    # Configuration MongoDB
│   ├── controllers/
│   │   ├── authController.js        # Authentification & JWT
│   │   ├── bookingController.js     # Gestion réservations
│   │   ├── serviceController.js     # Gestion services
│   │   └── userController.js        # Gestion utilisateurs
│   ├── middleware/
│   │   └── auth.js                  # Middleware JWT & permissions
│   ├── models/
│   │   ├── Booking.js               # Schéma réservation
│   │   ├── Service.js               # Schéma service
│   │   └── User.js                  # Schéma utilisateur
│   ├── routes/
│   │   ├── auth.js                  # Routes authentification
│   │   ├── bookings.js              # Routes réservations
│   │   ├── services.js              # Routes services
│   │   └── users.js                 # Routes utilisateurs
│   ├── .env                         # Variables d'environnement
│   ├── .env.example                 # Exemple .env
│   ├── package.json
│   ├── seed.js                      # Script d'initialisation DB
│   └── server.js                    # Point d'entrée serveur
│
├── frontend/
│   ├── public/
│   │   └── images/                  # Assets images
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/               # Pages administration
│   │   │   ├── booking/             # Page mes réservations
│   │   │   ├── login/               # Page connexion
│   │   │   ├── order/               # Page commande (panier)
│   │   │   ├── register/            # Page inscription
│   │   │   ├── services/            # Pages services & détail
│   │   │   ├── globals.css          # Styles globaux Tailwind
│   │   │   ├── layout.tsx           # Layout principal
│   │   │   └── page.tsx             # Page d'accueil
│   │   ├── components/
│   │   │   ├── Footer.tsx           # Pied de page
│   │   │   ├── LoadingSpinner.tsx   # Spinner chargement
│   │   │   ├── Navbar.tsx           # Barre de navigation
│   │   │   └── ServiceCard.tsx      # Carte service réutilisable
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Contexte authentification
│   │   └── lib/
│   │       └── api.ts               # Client API Axios centralisé
│   ├── .env.local                   # Variables d'environnement local
│   ├── .env.local.example           # Exemple .env.local
│   ├── package.json
│   ├── tailwind.config.js           # Configuration Tailwind
│   └── tsconfig.json
│
├── .gitignore
├── package-lock.json
└── Readme.md                        # Ce fichier
```

## Installation

### Prérequis
- **Node.js 18+** - [Télécharger](https://nodejs.org/)
- **MongoDB** - [Installation locale](https://docs.mongodb.com/manual/installation/) ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** ou **pnpm** (npm inclus avec Node.js)

### 1. Clone le repository

```bash
git clone https://github.com/yourusername/Clean-PRO.git
cd Clean-PRO
```

## Configuration

### Backend Configuration

1. **Entre dans le dossier backend:**
```bash
cd backend
```

2. **Installe les dépendances:**
```bash
npm install
```

3. **Crée un fichier `.env`** (base sur `.env.example`):
```env
# Serveur
PORT=5000
NODE_ENV=development

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/cleanpro
# OU MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleanpro

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

4. **Initialise la base de données** (crée l'admin et les services):
```bash
npm run seed
```

> ✅ Cela créera un admin par défaut: `admin@cleanpro.com` / `admin123`

### Frontend Configuration

1. **Entre dans le dossier frontend:**
```bash
cd frontend
```

2. **Installe les dépendances:**
```bash
npm install
```

3. **Crée un fichier `.env.local`** (basé sur `.env.local.example`):
```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Démarrage

### Mode développement

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Serveur disponible sur http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Application disponible sur http://localhost:3000
```

### Mode production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## Utilisation

### 🔗 Accès
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api

### 👨‍💼 Compte Admin par défaut
```
Email: admin@cleanpro.com
Mot de passe: admin123
```
⚠️ **Important**: Changez ce mot de passe en production!

### 📱 Workflow Client
1. **Accueil** → Découverte des services
2. **Inscription/Connexion** → Créer un compte
3. **Commander** → Sélectionner services et ajouter au panier
4. **Paiement** → Remplir détails (date, heure, adresse)
5. **Réservations** → Suivre l'état de la commande
6. **Notifications** → Reçevoir les mises à jour

### 🛠️ Workflow Admin
1. **Connexion** → admin@cleanpro.com / admin123
2. **Dashboard** → Voir statistiques
3. **Gestion Réservations** → Voir, modifier, changer statut
4. **Gestion Services** → Créer, modifier, supprimer services
5. **Gestion Utilisateurs** → Voir tous les clients

## API Endpoints

### 🔐 Authentification
```
POST   /api/auth/register        - Inscription client
POST   /api/auth/login            - Connexion
GET    /api/auth/me               - Profil utilisateur (authentifié)
PUT    /api/auth/profile          - Modifier profil (authentifié)
```

### 🧹 Services
```
GET    /api/services              - Lister tous les services actifs
GET    /api/services?category=X   - Filtrer par catégorie
GET    /api/services/:id          - Détails d'un service
POST   /api/services              - Créer service (admin)
PUT    /api/services/:id          - Modifier service (admin)
DELETE /api/services/:id          - Supprimer service (admin)
```

### 📅 Réservations
```
GET    /api/bookings              - Mes réservations (authentifié)
GET    /api/bookings/:id          - Détail réservation
POST   /api/bookings              - Créer réservation (authentifié)
PUT    /api/bookings/:id          - Modifier réservation (authentifié)
DELETE /api/bookings/:id          - Annuler réservation (authentifié)
GET    /api/bookings/admin/all    - Toutes réservations (admin)
PUT    /api/bookings/:id/status   - Changer statut (admin)
```

### 👥 Utilisateurs (Admin)
```
GET    /api/users                 - Lister utilisateurs (admin)
GET    /api/users/:id             - Détail utilisateur (admin)
PUT    /api/users/:id             - Modifier utilisateur (admin)
DELETE /api/users/:id             - Supprimer utilisateur (admin)
```

## Statuts de Réservation
- **pending** - En attente de confirmation
- **confirmed** - Confirmée par l'admin
- **in-progress** - Nettoyage en cours
- **completed** - Terminée
- **cancelled** - Annulée

## Catégories de Services
- **maison** - Nettoyage résidentiel
- **bureau** - Nettoyage professionnel
- **batiment** - Nettoyage immobilier
- **vehicule** - Nettoyage automobile

## Troubleshooting

### Connexion MongoDB échouée
```
✗ Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Vérifiez que MongoDB est lancé:
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Services vides dans le frontend
**Solution**: Exécutez le seed script:
```bash
cd backend
npm run seed
```

### CORS errors
**Solution**: Assurez-vous que `NEXT_PUBLIC_API_URL` est correct dans `.env.local`

## Performance & Optimisations
- ✅ Compression des images
- ✅ Code splitting automatique (Next.js)
- ✅ Pagination des résultats
- ✅ Caching des requêtes API
- ✅ JWT sans state (scalable)
- ✅ Lazy loading des composants

## Sécurité
- ✅ Mots de passe hachés (bcrypt)
- ✅ JWT avec expiration
- ✅ CORS configuré
- ✅ Validation des données (backend & frontend)
- ✅ Protection des routes admin
- ✅ Sanitisation des inputs

## Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/AmazingFeature`)
3. Commit tes changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvre une Pull Request

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Created by**: Clean PRO Team  
**Version**: 1.0.0  
**Last Updated**: Janvier 2024

## Support

Pour toute question ou problème, ouvre une [issue](https://github.com/yourusername/Clean-PRO/issues) sur le repository.
