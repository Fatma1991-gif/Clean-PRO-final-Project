# 📚 Référence API Complète - Système de Paiement

## 🔐 Authentification

Toutes les routes nécessitent un token JWT dans le header:
```
Authorization: Bearer <token>
```

Obtenir un token:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 📦 Endpoints de Réservation Modifiés

### POST /api/bookings
Crée une nouvelle réservation

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "serviceId": "65c3b8e1f3a9d2e5b6c4f1a1",
  "date": "2024-02-15",
  "time": "14:00",
  "address": "123 Rue de Paris, 75001",
  "notes": "Accès par porte latérale (optionnel)",
  "paymentMethod": "cash"  // NOUVEAU: "cash" | "online"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "user": "5f50c7a7b3d1e20a8c4b2a3",
    "service": "65c3b8e1f3a9d2e5b6c4f1a1",
    "date": "2024-02-15T00:00:00.000Z",
    "time": "14:00",
    "address": "123 Rue de Paris, 75001",
    "notes": "Accès par porte latérale",
    "totalPrice": 150,
    "paymentMethod": "cash",        // NOUVEAU
    "paymentStatus": "pending",     // NOUVEAU
    "stripePaymentIntentId": null,  // NOUVEAU
    "status": "pending",
    "createdAt": "2024-02-10T10:30:00.000Z",
    "assignedTo": null
  }
}
```

**Erreurs:**
- 400: Service non trouvé
- 401: Non authentifié
- 500: Erreur serveur

---

### GET /api/bookings
Récupère les réservations de l'utilisateur

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
      "user": "5f50c7a7b3d1e20a8c4b2a3",
      "service": {
        "_id": "65c3b8e1f3a9d2e5b6c4f1a1",
        "name": "Nettoyage Maison Standard",
        "category": "maison",
        "price": 150
      },
      "date": "2024-02-15T00:00:00.000Z",
      "time": "14:00",
      "address": "123 Rue de Paris, 75001",
      "totalPrice": 150,
      "paymentMethod": "cash",
      "paymentStatus": "pending",
      "status": "pending",
      "createdAt": "2024-02-10T10:30:00.000Z"
    }
  ]
}
```

---

### GET /api/bookings/:id
Récupère les détails d'une réservation

**Parameters:**
- `id` (required): ID de la réservation

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "user": {
      "_id": "5f50c7a7b3d1e20a8c4b2a3",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "phone": "0612345678"
    },
    "service": {
      "_id": "65c3b8e1f3a9d2e5b6c4f1a1",
      "name": "Nettoyage Maison Standard",
      "category": "maison",
      "price": 150,
      "duration": 3
    },
    "date": "2024-02-15T00:00:00.000Z",
    "time": "14:00",
    "address": "123 Rue de Paris, 75001",
    "notes": "Accès par porte latérale",
    "totalPrice": 150,
    "paymentMethod": "cash",
    "paymentStatus": "pending",
    "stripePaymentIntentId": null,
    "status": "pending",
    "assignedTo": null,
    "createdAt": "2024-02-10T10:30:00.000Z"
  }
}
```

---

## 💳 Endpoints de Paiement

### POST /api/payments/create-payment-intent
Crée une intention de paiement Stripe

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "bookingId": "65c3b8e1f3a9d2e5b6c4f1a2"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234567890_secret_abcdefghijklmnopqrst",
    "bookingId": "65c3b8e1f3a9d2e5b6c4f1a2"
  }
}
```

**Erreurs:**
- 400: ID réservation manquant
- 401: Non authentifié
- 403: Accès refusé (pas propriétaire)
- 404: Réservation non trouvée
- 500: Erreur Stripe

**Note:** Le `clientSecret` doit être stocké et utilisé pour confirmer le paiement.

---

### POST /api/payments/confirm-payment
Confirme un paiement Stripe

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "bookingId": "65c3b8e1f3a9d2e5b6c4f1a2",
  "paymentIntentId": "pi_1234567890"
}
```

**Réponse (200) - Succès:**
```json
{
  "success": true,
  "message": "Paiement effectué avec succès",
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "user": "5f50c7a7b3d1e20a8c4b2a3",
    "service": "65c3b8e1f3a9d2e5b6c4f1a1",
    "date": "2024-02-15T00:00:00.000Z",
    "time": "14:00",
    "address": "123 Rue de Paris, 75001",
    "totalPrice": 150,
    "paymentMethod": "online",
    "paymentStatus": "completed",  // ✅ Mis à jour
    "stripePaymentIntentId": "pi_1234567890",
    "status": "confirmed",  // ✅ Mis à jour
    "createdAt": "2024-02-10T10:30:00.000Z"
  }
}
```

**Réponse (400) - Erreur:**
```json
{
  "success": false,
  "message": "Le paiement n'a pas pu être traité"
}
```

**Erreurs:**
- 400: Paiement échoué
- 401: Non authentifié
- 403: Accès refusé
- 404: Réservation/Paiement non trouvé
- 500: Erreur serveur

---

## 📊 Endpoints Admin

### GET /api/bookings/admin
Récupère toutes les réservations (Admin uniquement)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `status` (optional): 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'

**Exemple:**
```
GET /api/bookings/admin?status=completed
```

**Réponse (200):**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
      "user": {
        "_id": "5f50c7a7b3d1e20a8c4b2a3",
        "name": "Jean Dupont",
        "email": "jean@example.com",
        "phone": "0612345678"
      },
      "service": {
        "_id": "65c3b8e1f3a9d2e5b6c4f1a1",
        "name": "Nettoyage Maison Standard",
        "category": "maison",
        "price": 150
      },
      "date": "2024-02-15T00:00:00.000Z",
      "time": "14:00",
      "address": "123 Rue de Paris, 75001",
      "totalPrice": 150,
      "paymentMethod": "online",
      "paymentStatus": "completed",
      "status": "completed",
      "assignedTo": {
        "_id": "5f50c7a7b3d1e20a8c4b2a4",
        "name": "Marie Martin",
        "email": "marie@cleanpro.com",
        "phone": "0698765432"
      },
      "createdAt": "2024-02-10T10:30:00.000Z"
    }
  ]
}
```

---

### GET /api/bookings/admin/stats
Récupère les statistiques (Admin uniquement)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "stats": [
      {
        "_id": "completed",
        "count": 12,
        "totalRevenue": 1800
      },
      {
        "_id": "pending",
        "count": 5,
        "totalRevenue": 750
      },
      {
        "_id": "in-progress",
        "count": 3,
        "totalRevenue": 450
      },
      {
        "_id": "cancelled",
        "count": 1,
        "totalRevenue": 0
      }
    ],
    "totalBookings": 21,
    "totalRevenue": 2550
  }
}
```

---

### PUT /api/bookings/:id/status
Met à jour le statut d'une réservation (Admin uniquement)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Parameters:**
- `id` (required): ID de la réservation

**Body:**
```json
{
  "status": "confirmed"  // pending | confirmed | in-progress | completed | cancelled
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "status": "confirmed",  // ✅ Mis à jour
    ...
  }
}
```

---

### PUT /api/bookings/:id/assign
Assigne une réservation à un membre du personnel (Admin uniquement)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "personnelId": "5f50c7a7b3d1e20a8c4b2a4"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "assignedTo": "5f50c7a7b3d1e20a8c4b2a4",
    ...
  }
}
```

---

## ⚠️ Codes d'Erreur

| Code | Signification | Solution |
|------|---------------|----------|
| 400 | Requête invalide | Vérifier les paramètres |
| 401 | Non authentifié | Se connecter |
| 403 | Accès refusé | Vérifier les permissions |
| 404 | Ressource non trouvée | Vérifier l'ID |
| 500 | Erreur serveur | Contactez le support |

---

## 🔄 Flux Typique - Paiement en Ligne

```
1. POST /api/bookings (paymentMethod: "online")
   → Réservation créée avec paymentStatus: "pending"

2. POST /api/payments/create-payment-intent
   → Intention de paiement Stripe créée
   → clientSecret retourné

3. Client entre ses infos de carte

4. POST /api/payments/confirm-payment
   → Paiement vérifié
   → Réservation: paymentStatus = "completed", status = "confirmed"

5. GET /api/bookings/:id
   → Vérifier le statut de la réservation
```

---

## 💾 Limites de Requête

- **Bodysize:** 10MB max
- **Rate limit:** 1000 requêtes/heure (par utilisateur)
- **Timeout:** 30 secondes

---

## 📝 Exemple Complet avec cURL

### Créer une réservation
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "65c3b8e1f3a9d2e5b6c4f1a1",
    "date": "2024-02-15",
    "time": "14:00",
    "address": "123 Rue de Paris",
    "paymentMethod": "online"
  }'
```

### Créer une intention de paiement
```bash
curl -X POST http://localhost:5000/api/payments/create-payment-intent \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "65c3b8e1f3a9d2e5b6c4f1a2"
  }'
```

### Confirmer un paiement
```bash
curl -X POST http://localhost:5000/api/payments/confirm-payment \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "65c3b8e1f3a9d2e5b6c4f1a2",
    "paymentIntentId": "pi_1234567890"
  }'
```

---

## 📚 Ressources Supplémentaires

- [Stripe API Reference](https://stripe.com/docs/api)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Test Cards](https://stripe.com/docs/testing)

---

**Version:** 1.0  
**Date:** Janvier 2026
