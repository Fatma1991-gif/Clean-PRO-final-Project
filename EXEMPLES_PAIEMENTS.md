# Exemples d'Utilisation - Système de Paiement CleanPro

## 🎯 Scénarios d'Utilisation

### Scénario 1: Réservation en Espèces

```typescript
// 1. Client accède à la page du service
// URL: /services/5f50c7a7b3d1e20a8c4b2a1

// 2. Remplit le formulaire de réservation
const bookingData = {
  date: "2024-02-15",
  time: "14:00",
  address: "123 Rue de Paris, 75001",
  notes: "Accès par la porte latérale",
  paymentMethod: "cash"  // Sélectionne paiement en espèces
};

// 3. Envoie la réservation via l'API
POST /api/bookings
{
  serviceId: "5f50c7a7b3d1e20a8c4b2a1",
  date: "2024-02-15",
  time: "14:00",
  address: "123 Rue de Paris, 75001",
  notes: "Accès par la porte latéral",
  paymentMethod: "cash"
}

// 4. Réponse du serveur
{
  "success": true,
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "user": "5f50c7a7b3d1e20a8c4b2a3",
    "service": "5f50c7a7b3d1e20a8c4b2a1",
    "date": "2024-02-15T00:00:00.000Z",
    "time": "14:00",
    "address": "123 Rue de Paris, 75001",
    "totalPrice": 150,
    "paymentMethod": "cash",
    "paymentStatus": "pending",
    "status": "pending",
    "createdAt": "2024-02-10T10:30:00.000Z"
  }
}

// 5. Client est redirigé vers /booking
// Sa réservation est visible avec le statut "En attente"
// Il paiera en espèces au prestataire
```

### Scénario 2: Réservation avec Paiement en Ligne

```typescript
// 1. Client accède à la page du service
// URL: /services/5f50c7a7b3d1e20a8c4b2a1

// 2. Remplit le formulaire de réservation et sélectionne "Paiement en ligne"
const bookingData = {
  date: "2024-02-15",
  time: "14:00",
  address: "123 Rue de Paris, 75001",
  notes: "Accès par la porte latérale",
  paymentMethod: "online"  // Sélectionne paiement en ligne
};

// 3. Envoie la réservation
POST /api/bookings
{
  serviceId: "5f50c7a7b3d1e20a8c4b2a1",
  date: "2024-02-15",
  time: "14:00",
  address: "123 Rue de Paris, 75001",
  notes: "Accès par la porte latérale",
  paymentMethod: "online"
}

// 4. Réponse du serveur
{
  "success": true,
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "user": "5f50c7a7b3d1e20a8c4b2a3",
    "service": "5f50c7a7b3d1e20a8c4b2a1",
    "date": "2024-02-15T00:00:00.000Z",
    "time": "14:00",
    "address": "123 Rue de Paris, 75001",
    "totalPrice": 150,
    "paymentMethod": "online",
    "paymentStatus": "pending",
    "status": "pending",
    "createdAt": "2024-02-10T10:30:00.000Z"
  }
}

// 5. Client est redirigé vers /payment/65c3b8e1f3a9d2e5b6c4f1a2

// 6. Sur la page de paiement, crée une intention de paiement
POST /api/payments/create-payment-intent
{
  "bookingId": "65c3b8e1f3a9d2e5b6c4f1a2"
}

// 7. Réponse du serveur
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234567890_secret_abcdefghij",
    "bookingId": "65c3b8e1f3a9d2e5b6c4f1a2"
  }
}

// 8. Client clique sur "Payer maintenant"
// Interface de paiement s'affiche (Stripe)
// Client entre sa carte bancaire

// 9. Une fois le paiement approuvé, confirme le paiement
POST /api/payments/confirm-payment
{
  "bookingId": "65c3b8e1f3a9d2e5b6c4f1a2",
  "paymentIntentId": "pi_1234567890"
}

// 10. Réponse du serveur (succès)
{
  "success": true,
  "message": "Paiement effectué avec succès",
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "user": "5f50c7a7b3d1e20a8c4b2a3",
    "service": "5f50c7a7b3d1e20a8c4b2a1",
    "date": "2024-02-15T00:00:00.000Z",
    "time": "14:00",
    "address": "123 Rue de Paris, 75001",
    "totalPrice": 150,
    "paymentMethod": "online",
    "paymentStatus": "completed",  // ✅ Statut mis à jour
    "status": "confirmed",  // ✅ Statut mis à jour
    "stripePaymentIntentId": "pi_1234567890",
    "createdAt": "2024-02-10T10:30:00.000Z"
  }
}

// 11. Client voit un message de succès
// Il est redirigé vers /booking après 3 secondes
// La réservation est maintenant avec le statut "Confirmée"
```

### Scénario 3: Panier Multi-Services avec Paiement

```typescript
// 1. Client ajoute plusieurs services au panier
// URL: /order

const cartItems = [
  { serviceId: "5f50c7a7b3d1e20a8c4b2a1", quantity: 1 },  // Nettoyage maison (150 DT)
  { serviceId: "5f50c7a7b3d1e20a8c4b2a2", quantity: 2 }   // Bureau (100 DT chacun)
];
// Total: 150 + 100 + 100 = 350 DT

// 2. Remplit les détails de la commande
// 3. Sélectionne "Paiement en ligne"

// 4. Crée les réservations pour chaque service
POST /api/bookings (premier appel)
{
  "serviceId": "5f50c7a7b3d1e20a8c4b2a1",
  "date": "2024-02-15",
  "time": "14:00",
  "address": "123 Rue de Paris, 75001",
  "paymentMethod": "online"
}

// Réponse
{
  "success": true,
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
    "totalPrice": 150,
    ...
  }
}

POST /api/bookings (deuxième appel)
{
  "serviceId": "5f50c7a7b3d1e20a8c4b2a2",
  "date": "2024-02-15",
  "time": "14:00",
  "address": "123 Rue de Paris, 75001",
  "paymentMethod": "online"
}

// Réponse
{
  "success": true,
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a3",
    "totalPrice": 100,
    ...
  }
}

POST /api/bookings (troisième appel)
{
  "serviceId": "5f50c7a7b3d1e20a8c4b2a2",
  "date": "2024-02-15",
  "time": "14:00",
  "address": "123 Rue de Paris, 75001",
  "paymentMethod": "online"
}

// Réponse
{
  "success": true,
  "data": {
    "_id": "65c3b8e1f3a9d2e5b6c4f1a4",
    "totalPrice": 100,
    ...
  }
}

// 5. Client est redirigé vers /payment/65c3b8e1f3a9d2e5b6c4f1a2
// (La première réservation)

// 6. Effectue le paiement pour l'intention créée
// Les trois réservations sont payées dans une seule transaction
```

### Scénario 4: Erreur de Paiement

```typescript
// 1. Client procède au paiement
// 2. Utilise une carte invalide (test: 4000 0000 0000 0002)

POST /api/payments/confirm-payment
{
  "bookingId": "65c3b8e1f3a9d2e5b6c4f1a2",
  "paymentIntentId": "pi_1234567890"
}

// 3. Réponse du serveur (erreur)
{
  "success": false,
  "message": "Le paiement n'a pas pu être traité"
}

// 4. La réservation passe au statut "paymentStatus: failed"
{
  "_id": "65c3b8e1f3a9d2e5b6c4f1a2",
  "paymentStatus": "failed",  // ❌ Erreur
  "status": "pending",  // Reste en attente
  ...
}

// 5. Client voit un message d'erreur
// Il peut réessayer le paiement
// Ou se connecter ultérieurement pour repayer
```

### Scénario 5: Admin Consulte les Paiements

```typescript
// 1. Admin accède à /admin/payments

// 2. Le dashboard affiche les statistiques
{
  "totalAmount": 2450,  // DT
  "completedPayments": 12,  // réservations payées
  "pendingPayments": 3,  // en attente de paiement
  "failedPayments": 1  // paiements échoués
}

// 3. Admin voit la table avec tous les paiements
// Colonnes affichées:
// - Client (nom + email)
// - Service
// - Montant
// - Méthode (Espèces | En ligne)
// - Statut (Payé | En attente | Échoué)
// - Date

// 4. Admin peut filtrer par méthode de paiement
// - Cliquer sur "Espèces": affiche seulement les réservations payables en espèces
// - Cliquer sur "En ligne": affiche seulement les réservations payées en ligne
```

## 🔍 État du Système Après Chaque Action

### Réservation en Espèces

```
Avant:
  paymentMethod: "cash"
  paymentStatus: "pending"
  status: "pending"

Après confirmation:
  paymentMethod: "cash"
  paymentStatus: "pending"  // Reste en attente
  status: "pending"  // Reste en attente (paiement après prestation)
```

### Réservation avec Paiement en Ligne

```
Étape 1 - Création réservation:
  paymentMethod: "online"
  paymentStatus: "pending"
  status: "pending"

Étape 2 - Après paiement réussi:
  paymentMethod: "online"
  paymentStatus: "completed"  // ✅ Payé
  status: "confirmed"  // ✅ Confirmée (prestation garantie)

Étape 3 - Si paiement échoue:
  paymentMethod: "online"
  paymentStatus: "failed"  // ❌ Erreur
  status: "pending"  // Reste en attente
```

## 📱 Interface Utilisateur

### Formulaire de Paiement (Services et Order)

```
┌─────────────────────────────────┐
│ Méthode de paiement             │
├─────────────────────────────────┤
│ ◉ 💵 Paiement en espèces        │
│   Payez après la prestation     │
├─────────────────────────────────┤
│ ○ 💳 Paiement en ligne          │
│   Carte bancaire sécurisée      │
└─────────────────────────────────┘
```

### Page de Paiement

```
┌────────────────────────────────┐
│ 🔒 Paiement Sécurisé           │
├────────────────────────────────┤
│ Service: Nettoyage Maison      │
│ Date: 15/02/2024               │
│ Heure: 14:00                   │
│ Total: 150 DT                  │
├────────────────────────────────┤
│ [     Payer maintenant     ]    │
└────────────────────────────────┘
```

### Confirmation de Paiement

```
✅ Paiement Réussi!
Votre réservation a été confirmée.

Numéro de réservation: 65c3b8e1f3a9d2e5b6c4f1a2
Un email de confirmation a été envoyé.

[Voir mes réservations]
```

## 💾 Données Stockées

### Base de Données

```javascript
// Collection: bookings
{
  _id: ObjectId("65c3b8e1f3a9d2e5b6c4f1a2"),
  user: ObjectId("5f50c7a7b3d1e20a8c4b2a3"),
  service: ObjectId("5f50c7a7b3d1e20a8c4b2a1"),
  date: ISODate("2024-02-15T00:00:00.000Z"),
  time: "14:00",
  address: "123 Rue de Paris, 75001",
  notes: "Accès par la porte latérale",
  totalPrice: 150,
  paymentMethod: "online",      // 🆕 Nouveau champ
  paymentStatus: "completed",   // 🆕 Nouveau champ
  stripePaymentIntentId: "pi_1234567890",  // 🆕 Nouveau champ
  status: "confirmed",
  createdAt: ISODate("2024-02-10T10:30:00.000Z"),
  assignedTo: null
}
```

---

**Note:** Ces exemples illustrent le fonctionnement complet du système de paiement intégré à CleanPro.
