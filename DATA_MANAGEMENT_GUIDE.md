# Guide de Gestion et Sécurisation des Données

## Vue d'ensemble

Cette application implémente une stratégie de **suppression logique (Soft Delete)** pour garantir la sécurité, l'intégrité et la traçabilité de toutes les données stockées. Cette approche signifie que les données ne sont jamais réellement supprimées de la base de données MongoDB sans une demande explicite de l'administrateur.

---

## Stratégie de Suppression Logique

### Principe de base

Plutôt que de supprimer définitivement les données :
- Chaque enregistrement (utilisateur, réservation, service) est marqué comme supprimé
- Un timestamp (`deletedAt`) enregistre la date et l'heure de la suppression
- Les données restent accessibles pour :
  - Les audits et la conformité
  - La récupération accidentelle
  - L'analyse historique

### Champs d'implémentation

Chaque document dans les collections suivantes contient :

```javascript
{
  // ... autres champs ...
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}
```

#### Collections affectées :
- **User** (Utilisateurs)
- **Booking** (Réservations)
- **Service** (Services)

---

## Comportement de l'application

### Lors des opérations de suppression

Quand un utilisateur/réservation/service est supprimé :

1. **Soft Delete (par défaut)** :
   - `isDeleted` est défini à `true`
   - `deletedAt` enregistre la date/heure actuelle
   - Les données restent dans la base de données
   - Les opérations standard n'affichent plus ces données

2. **Suppression définitive (Hard Delete)** :
   - Réservée aux administrateurs uniquement
   - Supprime complètement l'enregistrement de la base de données
   - Action irréversible et doit être confirmée

### Exclusion automatique des données supprimées

Les requêtes standard excluent automatiquement les données avec `isDeleted: true` :

```javascript
// Exemples de filtres appliqués
{ isDeleted: false }
{ user: req.user.id, isDeleted: false }
{ status: 'confirmed', isDeleted: false }
```

---

## Endpoints API - Gestion des données

### Utilisateurs

| Méthode | Route | Description | Rôle |
|---------|-------|-------------|------|
| GET | `/api/users` | Récupérer tous les utilisateurs (non supprimés) | Admin |
| GET | `/api/users/:id` | Récupérer un utilisateur spécifique | Admin |
| DELETE | `/api/users/:id` | Soft delete un utilisateur | Admin |
| PUT | `/api/users/:id/restore` | Restaurer un utilisateur supprimé | Admin |
| DELETE | `/api/users/:id/permanent-delete` | Hard delete un utilisateur | Admin |
| GET | `/api/users/deleted` | Récupérer les utilisateurs supprimés | Admin |

### Réservations

| Méthode | Route | Description | Rôle |
|---------|-------|-------------|------|
| GET | `/api/bookings` | Récupérer mes réservations (non supprimées) | Client |
| GET | `/api/bookings/admin` | Récupérer toutes les réservations | Admin |
| DELETE | `/api/bookings/:id` | Soft delete une réservation | Client/Admin |
| PUT | `/api/bookings/:id/restore` | Restaurer une réservation supprimée | Admin |
| DELETE | `/api/bookings/:id/permanent-delete` | Hard delete une réservation | Admin |
| GET | `/api/bookings/admin/deleted` | Récupérer les réservations supprimées | Admin |

### Services

| Méthode | Route | Description | Rôle |
|---------|-------|-------------|------|
| GET | `/api/services` | Récupérer tous les services (non supprimés) | Public |
| GET | `/api/services/:id` | Récupérer un service spécifique | Public |
| DELETE | `/api/services/:id` | Soft delete un service | Admin |
| PUT | `/api/services/:id/restore` | Restaurer un service supprimé | Admin |
| DELETE | `/api/services/:id/permanent-delete` | Hard delete un service | Admin |
| GET | `/api/services/admin/deleted` | Récupérer les services supprimés | Admin |

---

## Exemples d'utilisation

### Supprimer logiquement un utilisateur

```bash
DELETE /api/users/65c7f3a9b2c4d5e6f7a8b9c0
Authorization: Bearer {token}

Réponse :
{
  "success": true,
  "message": "Utilisateur supprimé avec succès",
  "data": {}
}
```

### Restaurer un utilisateur supprimé

```bash
PUT /api/users/65c7f3a9b2c4d5e6f7a8b9c0/restore
Authorization: Bearer {token}

Réponse :
{
  "success": true,
  "message": "Utilisateur restauré avec succès",
  "data": {
    "_id": "65c7f3a9b2c4d5e6f7a8b9c0",
    "name": "John Doe",
    "email": "john@example.com",
    "isDeleted": false,
    "deletedAt": null
  }
}
```

### Supprimer définitivement un utilisateur

```bash
DELETE /api/users/65c7f3a9b2c4d5e6f7a8b9c0/permanent-delete
Authorization: Bearer {token}

Réponse :
{
  "success": true,
  "message": "Utilisateur supprimé définitivement de la base de données",
  "data": {}
}
```

### Récupérer les utilisateurs supprimés

```bash
GET /api/users/deleted
Authorization: Bearer {token}

Réponse :
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65c7f3a9b2c4d5e6f7a8b9c0",
      "name": "John Doe",
      "email": "john@example.com",
      "isDeleted": true,
      "deletedAt": "2025-01-28T14:30:00.000Z"
    }
  ]
}
```

---

## Avantages de la stratégie Soft Delete

### 🛡️ Sécurité
- Les données supprimées restent accessibles pour vérification
- Prévention des suppressions accidentelles
- Trail d'audit complet avec timestamps

### 📊 Traçabilité
- Historique complet des modifications
- Identification de qui a supprimé quoi et quand
- Facilité de comptabilité et conformité légale

### 🔄 Récupérabilité
- Restauration facile en un seul appel API
- Pas besoin de restaurations depuis une sauvegarde
- Zéro temps d'arrêt pour la récupération

### 📈 Intégrité des données
- Les relations (références) restent valides
- Les statistiques historiques conservées
- Les calculs rétroactifs possibles

---

## Politiques d'accès

### Règles de sécurité

1. **Seuls les administrateurs** peuvent :
   - Voir les données supprimées
   - Restaurer les données supprimées
   - Supprimer définitivement les données

2. **Les utilisateurs** peuvent :
   - Supprimer logiquement leurs propres réservations
   - Ne pas voir les données supprimées des autres

3. **Les données supprimées** sont :
   - Exclues de tous les comptages automatiques
   - Exclues de tous les résultats de recherche
   - Inaccessibles via les endpoints publics

---

## Statistiques et comptage

### Comptage correct

Tous les comptages excluent automatiquement les données supprimées :

```javascript
// ✅ Correct - exclut les supprimés
const totalUsers = await User.countDocuments({ isDeleted: false });

// ✅ Correct - agrégation avec filtre
const stats = await Booking.aggregate([
  { $match: { isDeleted: false } },
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);
```

### Audit des suppressions

Pour auditer les suppressions :

```javascript
// Récupérer tous les utilisateurs supprimés avec date
const deletedUsers = await User.find({ isDeleted: true })
  .select('name email deletedAt')
  .sort('-deletedAt');
```

---

## Recommandations

### ✅ Bonnes pratiques

1. **Avant de supprimer définitivement** :
   - Sauvegarder les données importantes
   - Vérifier toutes les dépendances
   - Obtenir confirmation supplémentaire

2. **Maintenance régulière** :
   - Examiner les données supprimées mensuellement
   - Supprimer définitivement les anciennes suppressions (> 1 an)
   - Garder l'historique pour les besoins légaux

3. **Monitoring** :
   - Surveiller les suppressions anormales
   - Alerter sur les suppressions en masse
   - Maintenir les logs de suppression

### ❌ À éviter

1. Ne pas supprimer directement à la base de données
2. Ne pas contourner les endpoints API
3. Ne pas accélérer les suppressions sans vérification
4. Ne pas supprimer définitivement les données actives

---

## Schéma de la base de données

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String,
  role: String,
  address: String,
  createdAt: Date,
  isDeleted: Boolean,      // ← Nouveau
  deletedAt: Date          // ← Nouveau
}
```

### Booking
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  service: ObjectId,
  date: Date,
  time: String,
  address: String,
  notes: String,
  status: String,
  totalPrice: Number,
  assignedTo: ObjectId,
  paymentMethod: String,
  paymentStatus: String,
  stripePaymentIntentId: String,
  createdAt: Date,
  isDeleted: Boolean,      // ← Nouveau
  deletedAt: Date          // ← Nouveau
}
```

### Service
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  price: Number,
  duration: Number,
  image: String,
  isActive: Boolean,
  createdAt: Date,
  isDeleted: Boolean,      // ← Nouveau
  deletedAt: Date          // ← Nouveau
}
```

---

## Support et questions

Pour toute question concernant la gestion des données ou la stratégie de soft delete, consultez :
- Les logs du système
- Les endpoints de gestion des utilisateurs
- Les audits administrateur
