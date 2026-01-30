# 🔐 Gestion des Utilisateurs et Authentification - CleanPro

## 📋 Vue d'Ensemble

CleanPro dispose d'un système d'authentification sécurisé et complet permettant :
- **Inscription** de nouveaux utilisateurs
- **Connexion** sécurisée avec email/mot de passe
- **Gestion des rôles** (Client, Personnel, Administrateur)
- **Chiffrement** des mots de passe avec bcrypt
- **Authentification JWT** pour les requêtes API
- **Gestion de profil** pour mettre à jour les informations

---

## 🏗️ Architecture du Système

### Couches du Système

```
┌─────────────────────────────────────┐
│  Frontend (Next.js/React)           │
│  - Pages Login/Register             │
│  - AuthContext (State Management)   │
└────────────────┬────────────────────┘
                 │ HTTP/HTTPS
┌────────────────▼────────────────────┐
│  Backend (Express.js)               │
│  - Routes /api/auth                 │
│  - Controllers                      │
│  - Middleware auth                  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  Base de Données (MongoDB)          │
│  - Collection Users                 │
│  - Mots de passe chiffrés          │
└─────────────────────────────────────┘
```

---

## 🔑 Concepts Clés

### 1. **Chiffrement des Mots de Passe**

**Technologie:** bcrypt
**Niveau de sécurité:** 10 (Salt rounds)

```
Mot de passe en clair: "password123"
           ↓
    [Chiffrement bcrypt]
           ↓
Mot de passe chiffré: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS..."
```

**Avantages:**
- Impossible de déchiffrer
- Résistant aux attaques par force brute
- Unique à chaque utilisateur

### 2. **Tokens JWT**

**JWT (JSON Web Token):**
- Utilisé pour l'authentification API
- Contient l'ID de l'utilisateur
- Expire après 24 heures (configurable)
- Stocké en localStorage côté client

```
Format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzNiOGUx...
        └─────────────────────────────────────────────────────────────┘
                          Token signé et sécurisé
```

### 3. **Rôles Utilisateur**

| Rôle | Description | Permissions |
|------|-------------|------------|
| **client** | Client régulier | Créer réservations, Voir ses réservations |
| **personnel** | Membre du personnel | Voir réservations assignées, Mettre à jour statuts |
| **admin** | Administrateur | Accès complet, Gestion des utilisateurs/réservations |

---

## 📱 Pages Frontend

### 1. **Page d'Inscription** (`/register`)

**Champs requis:**
- ✅ Nom (50 caractères max)
- ✅ Email (validation email)
- ✅ Téléphone
- ✅ Mot de passe (6 caractères min)
- ✅ Confirmation mot de passe
- ⭕ Adresse (optionnel)
- ⭕ Rôle (défaut: client)

**Validations:**
```typescript
- Les mots de passe correspondent
- Le mot de passe fait au moins 6 caractères
- L'email est au format valide
- Aucun utilisateur avec cet email n'existe
```

**Flux:**
```
1. Utilisateur remplit le formulaire
2. Validation côté client
3. POST /api/auth/register
4. Réception du token JWT
5. Sauvegarde du token et user en localStorage
6. Redirection vers /
```

### 2. **Page de Connexion** (`/login`)

**Champs requis:**
- ✅ Email
- ✅ Mot de passe

**Validations:**
```typescript
- Email fourni
- Mot de passe fourni
- L'utilisateur existe
- Le mot de passe correspond
```

**Flux:**
```
1. Utilisateur saisit email/mot de passe
2. Validation côté client
3. POST /api/auth/login
4. Vérification du mot de passe
5. Génération du token JWT
6. Sauvegarde du token et user en localStorage
7. Redirection vers /
```

### 3. **Contexte d'Authentification** (`AuthContext`)

**État global:**
```typescript
interface AuthContextType {
  user: User | null;           // Utilisateur connecté
  loading: boolean;            // État de chargement
  login: (email, password) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;           // Helper pour vérifier admin
}
```

**Utilisation:**
```tsx
const { user, loading, login, logout, isAdmin } = useAuth();

if (user) {
  // Utilisateur connecté
  console.log(`Bienvenue ${user.name}`);
}

if (isAdmin) {
  // Afficher les options admin
}
```

---

## 🔧 Backend - Architecture

### 1. **Modèle User** (`models/User.js`)

**Schéma:**
```javascript
{
  name: String (required, max 50),
  email: String (required, unique, validated),
  phone: String (required),
  password: String (required, 6 chars min, hashed),
  role: String (enum: client|admin|personnel, default: client),
  address: String (optional),
  createdAt: Date (default: now)
}
```

**Méthodes:**
```javascript
user.matchPassword(enteredPassword)    // Comparer mot de passe
user.getSignedJwtToken()               // Générer JWT
```

**Pre-hooks:**
```javascript
// Avant save: Chiffrer le mot de passe
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### 2. **Contrôleur Auth** (`controllers/authController.js`)

#### `register(req, res)`
- Vérifie que l'email n'existe pas
- Crée un nouvel utilisateur
- Chiffre le mot de passe automatiquement
- Retourne le token JWT et l'utilisateur

#### `login(req, res)`
- Vérifie email et mot de passe fournis
- Trouve l'utilisateur par email
- Compare le mot de passe avec bcrypt
- Retourne le token JWT et l'utilisateur

#### `getMe(req, res)`
- Retourne les infos de l'utilisateur connecté
- Nécessite l'authentification

#### `updateProfile(req, res)`
- Met à jour name, phone, address
- Ne peut pas modifier le mot de passe
- Nécessite l'authentification

### 3. **Routes Auth** (`routes/auth.js`)

```javascript
POST   /api/auth/register    // Inscription
POST   /api/auth/login       // Connexion
GET    /api/auth/me          // Infos utilisateur (protected)
PUT    /api/auth/profile     // Mettre à jour profil (protected)
```

### 4. **Middleware Auth** (`middleware/auth.js`)

**`protect` Middleware:**
- Extrait le token du header Authorization
- Vérifie la validité du token JWT
- Récupère l'ID de l'utilisateur
- Attache l'utilisateur à req.user
- Bloque si non authentifié

**`authorize` Middleware:**
- Vérifie que le rôle de l'utilisateur est autorisé
- Exemple: `authorize('admin')` bloque les non-admins

---

## 🔒 Sécurité

### ✅ Mesures de Sécurité Implémentées

1. **Chiffrement bcrypt**
   - Mots de passe jamais stockés en clair
   - Impossible à décrypter
   - Unique par utilisateur

2. **Validation d'email**
   - Email unique dans la base
   - Format validé avec regex
   - Pas de doublons

3. **Tokens JWT**
   - Expiration: 24 heures
   - Signé avec secret
   - Stocké de manière sécurisée

4. **Authentification obligatoire**
   - Routes sensibles protégées
   - Token requis dans Authorization header
   - Vérification de chaque requête

5. **Autorisation par rôle**
   - Admin peut accéder à /admin
   - Personnel peut voir ses réservations
   - Client limité à ses données

6. **Validation côté serveur**
   - Tous les champs validés
   - Messages d'erreur génériques (sécurité)
   - Pas de fuites d'informations

### ❌ À NE PAS FAIRE

```
❌ Stocker les mots de passe en clair
❌ Commiter les secrets JWT dans Git
❌ Envoyer les mots de passe en email
❌ Stocker tokens en cookies sans HttpOnly
❌ Oublier la validation côté serveur
❌ Donner des messages d'erreur détaillés
```

---

## 📊 Flux Complet d'Authentification

### Inscription

```
[User]
   │
   ├─ Rempli le formulaire
   ├─ Validation locale (longueur, format)
   │
   └──────────► POST /api/auth/register
                  │
                  ├─ Vérifier email unique
                  ├─ Valider les données
                  ├─ Chiffrer le mot de passe (bcrypt)
                  ├─ Créer l'utilisateur en DB
                  │
                  ├─ Générer JWT token
                  ├─ Retourner {token, user}
                  │
                  └──────────► [Frontend]
                                │
                                ├─ Sauvegarder token en localStorage
                                ├─ Sauvegarder user en localStorage
                                ├─ Mettre à jour AuthContext
                                │
                                └──────────► Redirection vers /
```

### Connexion

```
[User]
   │
   ├─ Entre email et mot de passe
   │
   └──────────► POST /api/auth/login
                  │
                  ├─ Vérifier email/password fournis
                  ├─ Chercher utilisateur par email
                  ├─ Comparer mot de passe (bcrypt)
                  │
                  ├─ Générer JWT token
                  ├─ Retourner {token, user}
                  │
                  └──────────► [Frontend]
                                │
                                ├─ Sauvegarder token en localStorage
                                ├─ Sauvegarder user en localStorage
                                ├─ Mettre à jour AuthContext
                                │
                                └──────────► Redirection vers /
```

### Requête Authentifiée

```
[Frontend - API Call]
   │
   ├─ Récupérer token de localStorage
   │
   └──────────► GET /api/bookings
                  │
                  Header: Authorization: Bearer <token>
                  │
                  [Backend - Middleware protect]
                  │
                  ├─ Extraire le token du header
                  ├─ Vérifier la signature JWT
                  ├─ Récupérer l'ID utilisateur
                  ├─ Attacher req.user
                  │
                  └──────────► [Controller]
                                │
                                ├─ Utiliser req.user.id
                                ├─ Chercher les réservations
                                │
                                └──────────► Retourner les données
```

---

## 🔄 Cycle de Vie de la Session

### 1. **Première Visite**
```
- AuthContext charge (vérif token/user en localStorage)
- loading = true
- Utilisateur voit page d'accueil
```

### 2. **Inscription/Connexion**
```
- Utilisateur envoie les infos
- Token et user reçus
- Sauvegardés en localStorage
- AuthContext mis à jour
- Utilisateur connecté
```

### 3. **Navigation Sécurisée**
```
- Token envoyé automatiquement à chaque requête
- Middleware backend vérifie le token
- Requêtes traitées si authentifié
- Erreur 401 si token invalide
```

### 4. **Déconnexion**
```
- onClick={() => logout()}
- localStorage vidé
- AuthContext réinitialisé
- Utilisateur redirigé vers /login
```

### 5. **Expiration du Token**
```
- Token expire après 24h
- Utilisateur doit se reconnecter
- Message d'erreur 401
- Redirection vers /login
```

---

## 🧪 Tests d'Authentification

### Test 1: Inscription

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "0612345678",
    "password": "password123",
    "address": "123 Rue de Paris"
  }'
```

**Réponse:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "0612345678",
    "role": "client",
    "address": "123 Rue de Paris",
    "createdAt": "2024-02-10T10:30:00.000Z"
  }
}
```

### Test 2: Connexion

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "password123"
  }'
```

### Test 3: Récupérer Profil

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Test 4: Mettre à Jour Profil

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "phone": "0698765432",
    "address": "456 Rue Example"
  }'
```

---

## ⚠️ Codes d'Erreur

| Code | Message | Solution |
|------|---------|----------|
| 400 | "Cet email est déjà utilisé" | Utiliser un autre email |
| 400 | "Veuillez fournir un email et un mot de passe" | Remplir les deux champs |
| 401 | "Identifiants invalides" | Vérifier email/mot de passe |
| 401 | "Non autorisé à accéder" | Se connecter d'abord |
| 403 | "Accès refusé" | Rôle insuffisant |
| 500 | "Erreur serveur" | Contactez le support |

---

## 🔑 Variables d'Environnement

**Backend `.env`**
```env
# JWT Configuration
JWT_SECRET=votre_secret_jwt_très_sécurisé
JWT_EXPIRE=24h

# Base de Données
MONGODB_URI=mongodb+srv://...

# Serveur
PORT=5000
NODE_ENV=development
```

**Frontend `.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📈 Cas d'Usage

### Cas 1: Client Nouveau
```
1. Accès à /register
2. Rempli le formulaire
3. Sélectionne role = "client"
4. Inscription automatique avec rôle client
5. Peut réserver des services
```

### Cas 2: Personnel
```
1. Admin crée un personnel via admin panel (futur)
2. Personnel reçoit ses identifiants
3. Se connecte avec email/password
4. Accès à /admin/personnel pour ses réservations
5. Peut mettre à jour ses statuts
```

### Cas 3: Admin
```
1. Admin créé en base avec role = "admin"
2. Se connecte avec ses identifiants
3. Accès complet à /admin
4. Peut gérer utilisateurs, réservations, paiements
5. Peut modifier les rôles
```

---

## 🚀 Améliorations Futures

- [ ] Récupération de mot de passe (email reset)
- [ ] Authentification à deux facteurs (2FA)
- [ ] Connexion Google/Facebook
- [ ] Historique de connexion
- [ ] Détection de connexions suspectes
- [ ] Blocage après N tentatives échouées
- [ ] Sessions multiples
- [ ] Refresh tokens

---

## 📚 Fichiers Impliqués

### Backend
- `backend/models/User.js` - Schéma utilisateur
- `backend/controllers/authController.js` - Logique authentification
- `backend/routes/auth.js` - Routes API
- `backend/middleware/auth.js` - Vérification JWT

### Frontend
- `frontend/src/context/AuthContext.tsx` - State global
- `frontend/src/app/login/page.tsx` - Page connexion
- `frontend/src/app/register/page.tsx` - Page inscription
- `frontend/src/lib/api.ts` - Appels API

---

**Version:** 1.0
**Date:** Janvier 2026
**Status:** ✅ Production-Ready
