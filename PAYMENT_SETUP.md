# Configuration des Paiements Stripe

## Installation des dépendances

### Backend
```bash
cd backend
npm install stripe
```

### Frontend
```bash
cd frontend
npm install @stripe/react-stripe-js @stripe/js
```

## Configuration des variables d'environnement

### Backend (.env)
```
STRIPE_SECRET_KEY=sk_test_xxxx (obtenu depuis votre compte Stripe)
STRIPE_PUBLIC_KEY=pk_test_xxxx
```

### Frontend (.env.local)
```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxx
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Fonctionnement du système de paiement

### Deux modes de paiement disponibles :

1. **Paiement en espèces** (cash)
   - Le client réserve un service
   - Aucun paiement n'est effectué lors de la réservation
   - Le client paie après la prestation

2. **Paiement en ligne** (online)
   - Le client réserve et paie en ligne
   - Utilise Stripe pour traiter les paiements
   - La réservation est confirmée après le paiement réussi

### Flux de paiement en ligne :

1. Client sélectionne "Paiement en ligne" lors de la réservation
2. La réservation est créée avec le statut `pending`
3. Client est redirigé vers la page de paiement (`/payment/[bookingId]`)
4. Le système crée une intention de paiement Stripe
5. Après le paiement réussi :
   - La réservation passe au statut `confirmed`
   - Le statut de paiement passe à `completed`
   - Un email de confirmation est envoyé au client

## Modèle de données - Booking

Nouveaux champs ajoutés :
- `paymentMethod`: 'cash' | 'online' (défaut: 'cash')
- `paymentStatus`: 'pending' | 'completed' | 'failed' (défaut: 'pending')
- `stripePaymentIntentId`: ID du PaymentIntent Stripe

## Routes API

### POST /api/payments/create-payment-intent
Crée une intention de paiement Stripe

**Paramètres:**
- `bookingId`: ID de la réservation

**Retour:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "bookingId": "xxx"
  }
}
```

### POST /api/payments/confirm-payment
Confirme le paiement Stripe

**Paramètres:**
- `bookingId`: ID de la réservation
- `paymentIntentId`: ID du PaymentIntent

**Retour:**
```json
{
  "success": true,
  "message": "Paiement effectué avec succès",
  "data": { ...booking }
}
```

## Pages Frontend

### `/services/[id]`
- Formulaire de réservation avec choix de paiement
- Modes: Espèces (par défaut) ou En ligne

### `/order`
- Panier d'achat
- Choix du mode de paiement
- Création de plusieurs réservations

### `/payment/[bookingId]`
- Page de paiement sécurisée
- Affiche les détails de la réservation
- Traitement du paiement Stripe
- Confirmation ou erreur de paiement

## Intégration Stripe complète (Optionnel)

Pour une intégration Stripe complète avec formulaire de paiement, installer :

```bash
npm install @stripe/react-stripe-js @stripe/js
```

Puis modifier la page `/payment/[id]/page.tsx` pour utiliser `@stripe/react-stripe-js`:

```tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
```

## Tests

### Cartes de test Stripe

- Succès: `4242 4242 4242 4242`
- Échec: `4000 0000 0000 0002`
- CVC: N'importe quel nombre à 3 chiffres
- Date: N'importe quelle date future

## Support

Pour plus d'informations sur Stripe, consultez:
- https://stripe.com/docs
- https://stripe.com/docs/payments
