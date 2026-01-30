# Guide d'Intégration des Paiements - CleanPro

## 📋 Résumé

L'application CleanPro propose deux modes de paiement pour offrir plus de flexibilité aux clients :

1. **Paiement en espèces** - Paiement après la prestation
2. **Paiement en ligne** - Paiement sécurisé via Stripe lors de la réservation

## 🎯 Fonctionnalités Implémentées

### Backend
- ✅ Modèle Booking amélioré avec champs de paiement
- ✅ Contrôleurs de paiement Stripe
- ✅ Routes API pour créer et confirmer les paiements
- ✅ Intégration Stripe

### Frontend
- ✅ Pages de réservation avec choix de paiement
- ✅ Page de paiement sécurisée
- ✅ Dashboard admin pour la gestion des paiements
- ✅ Indicateurs visuels du statut de paiement

## 🚀 Installation

### 1. Backend - Installer les dépendances

```bash
cd backend
npm install stripe
```

### 2. Frontend - Installer les dépendances (optionnel pour intégration complète)

```bash
cd frontend
npm install @stripe/react-stripe-js @stripe/js
```

## ⚙️ Configuration

### Variables d'environnement Backend

Créer un fichier `.env` dans le dossier `backend`:

```env
# Stripe Keys (obtenir depuis https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_votre_clé_secrète
STRIPE_PUBLIC_KEY=pk_test_votre_clé_publique

# Autres variables existantes
MONGODB_URI=mongodb://...
JWT_SECRET=votre_secret_jwt
PORT=5000
```

### Variables d'environnement Frontend

Créer un fichier `.env.local` dans le dossier `frontend`:

```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_votre_clé_publique
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📱 Pages Impactées

### 1. Page de Détails du Service (`/services/[id]`)
**Nouveau:**
- Sélecteur de méthode de paiement (radio buttons)
- Support du paiement en espèces et en ligne

**Flux:**
```
Réservation → Choix paiement → 
  - Si espèces: confirmation directe → /booking
  - Si en ligne: /payment/[bookingId]
```

### 2. Page de Commande (`/order`)
**Nouveau:**
- Choix de méthode de paiement pour le panier
- Support de multiples services
- Redirection vers paiement si paiement en ligne

**Flux:**
```
Ajouter au panier → Remplir détails → Choix paiement → Confirmer
  - Si espèces: créer réservations → /booking
  - Si en ligne: créer réservations → /payment/[bookingId]
```

### 3. Page de Paiement (`/payment/[bookingId]`)
**Nouveau:**
- Affichage des détails de la réservation
- Bouton de paiement sécurisé
- Gestion des statuts (succès/erreur)
- Redirect vers `/booking` après succès

### 4. Dashboard Admin - Paiements (`/admin/payments`)
**Nouveau:**
- Vue d'ensemble des statistiques de paiement
- Tableau des paiements avec filtres
- Statut des paiements (en attente, complété, échoué)
- Méthode de paiement (espèces, en ligne)

## 🔄 Flux de Données

### Création d'une Réservation

```typescript
// Requête POST /api/bookings
{
  serviceId: "123",
  date: "2024-02-15",
  time: "14:00",
  address: "123 Rue Example",
  notes: "Accès par la porte latérale",
  paymentMethod: "cash" | "online"  // NOUVEAU
}

// Réponse
{
  success: true,
  data: {
    _id: "booking123",
    paymentMethod: "cash",
    paymentStatus: "pending",  // NOUVEAU
    totalPrice: 150,
    status: "pending"
  }
}
```

### Création d'Intention de Paiement

```typescript
// Requête POST /api/payments/create-payment-intent
{
  bookingId: "booking123"
}

// Réponse
{
  success: true,
  data: {
    clientSecret: "pi_xxx_secret_xxx",
    bookingId: "booking123"
  }
}
```

### Confirmation de Paiement

```typescript
// Requête POST /api/payments/confirm-payment
{
  bookingId: "booking123",
  paymentIntentId: "pi_xxx"
}

// Réponse - Si succès
{
  success: true,
  message: "Paiement effectué avec succès",
  data: {
    _id: "booking123",
    paymentStatus: "completed",
    status: "confirmed",
    ...
  }
}
```

## 📊 Schéma de Données - Booking

### Nouveaux Champs

| Champ | Type | Défaut | Description |
|-------|------|--------|-------------|
| `paymentMethod` | String (enum) | 'cash' | Méthode de paiement: 'cash' ou 'online' |
| `paymentStatus` | String (enum) | 'pending' | Statut du paiement: 'pending', 'completed', 'failed' |
| `stripePaymentIntentId` | String | null | ID de l'intention de paiement Stripe |

### Champs Existants Conservés

- `user` (ObjectId)
- `service` (ObjectId)
- `date` (Date)
- `time` (String)
- `address` (String)
- `notes` (String)
- `status` (String)
- `totalPrice` (Number)
- `assignedTo` (ObjectId)
- `createdAt` (Date)

## 🔐 Sécurité

### Mesures de Sécurité Implémentées

1. **Authentification obligatoire** - Seuls les utilisateurs connectés peuvent effectuer des paiements
2. **Validation d'autorisation** - Un utilisateur ne peut voir que ses propres paiements
3. **Clés API sécurisées** - La clé secrète Stripe reste côté serveur
4. **Tokens Stripe** - Les tokens de paiement ne sont jamais stockés
5. **HTTPS requis** - Les transactions doivent utiliser HTTPS en production

## 🧪 Tests

### Cartes de Test Stripe

| Scénario | Numéro | CVC | Date |
|----------|--------|-----|------|
| Succès | `4242 4242 4242 4242` | N'importe quel | Futur |
| Require Action | `4000 0025 0000 3155` | N'importe quel | Futur |
| Décliné | `4000 0000 0000 0002` | N'importe quel | Futur |
| Incorrect | `4000 0000 0000 9995` | N'importe quel | Futur |

### Exemple de Test

1. Aller sur `/services/[id]`
2. Sélectionner "Paiement en ligne"
3. Cliquer sur "Confirmer la réservation"
4. Sur la page `/payment/[id]`, cliquer sur "Payer maintenant"
5. Entrer les informations de test
6. Vérifier la confirmation

## 📈 Statistiques Disponibles

### Pour les Administrateurs

- Revenu total des paiements en ligne
- Nombre de paiements complétés
- Nombre de paiements en attente
- Nombre de paiements échoués
- Filtrage par méthode de paiement
- Tableau complet des transactions

## 🔄 Intégration Complète Stripe (Optionnel)

Pour une intégration complète avec formulaire de saisie de carte:

```bash
npm install @stripe/react-stripe-js @stripe/js
```

Puis mettre à jour `/payment/[id]/page.tsx`:

```tsx
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);
```

## 📝 API Routes Complètes

### POST /api/payments/create-payment-intent
- **Auth:** Requis
- **Params:** `bookingId`
- **Retour:** `clientSecret`, `bookingId`

### POST /api/payments/confirm-payment
- **Auth:** Requis
- **Params:** `bookingId`, `paymentIntentId`
- **Retour:** `booking` (complet)

### GET /api/bookings
- **Auth:** Requis
- **Filters:** Status, paymentMethod
- **Retour:** Array de bookings

## 🐛 Dépannage

### Erreur: "STRIPE_SECRET_KEY not found"
**Solution:** Vérifier que la variable d'environnement est bien définie dans `.env`

### Erreur: "Payment method not supported"
**Solution:** Vérifier que `paymentMethod` est 'cash' ou 'online'

### Paiement échoue
**Solution:** 
1. Vérifier la clé Stripe
2. Vérifier que la réservation existe
3. Consulter les logs Stripe Dashboard

## 📚 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Guide de Mise en Ligne](https://stripe.com/docs/payments/getting-started)

## 🎉 Résumé des Fichiers Modifiés

### Backend
- `models/Booking.js` - Champs de paiement
- `controllers/bookingController.js` - Logique de paiement Stripe
- `routes/bookings.js` - Routes existantes (pas de changement)
- `routes/payments.js` - **NOUVEAU** Routes de paiement
- `server.js` - Intégration des routes de paiement
- `package.json` - Stripe ajouté

### Frontend
- `src/lib/api.ts` - Nouvelle API `paymentsAPI`
- `src/app/services/[id]/page.tsx` - Choix de paiement
- `src/app/order/page.tsx` - Choix de paiement
- `src/app/payment/[id]/page.tsx` - **NOUVEAU** Page de paiement
- `src/app/admin/payments/page.tsx` - **NOUVEAU** Dashboard admin

## ✅ Checklist de Mise en Production

- [ ] Configurer les clés Stripe pour la production
- [ ] Activer HTTPS sur le serveur
- [ ] Tester avec des cartes réelles
- [ ] Mettre en place la gestion des webhooks Stripe
- [ ] Configurer les emails de confirmation
- [ ] Activer la 3D Secure si nécessaire
- [ ] Faire un test de bout en bout complet

---

**Note:** Ce système est prêt pour la production mais peut être amélioré avec:
- Webhook Stripe pour gérer les événements asynchrones
- Interface complète Stripe avec formulaire de paiement
- Remboursements et gestion des litiges
- Rapports détaillés et exports
