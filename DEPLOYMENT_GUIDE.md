# 🚀 Guide de Déploiement - Système de Paiement CleanPro

## 📋 Checklist Pré-Déploiement

### ✅ Backend
- [ ] Stripe SDK installé (`npm install stripe`)
- [ ] Variables d'environnement Stripe configurées
- [ ] Routes de paiement testées en local
- [ ] Modèle Booking avec champs de paiement
- [ ] Contrôleurs de paiement implémentés
- [ ] Authentification sécurisée sur routes paiement

### ✅ Frontend
- [ ] API client mise à jour avec `paymentsAPI`
- [ ] Pages de réservation avec choix de paiement
- [ ] Page de paiement sécurisée implémentée
- [ ] Dashboard admin des paiements
- [ ] Variables d'environnement Stripe configurées
- [ ] Tests en local avec cartes Stripe de test

---

## 🔧 Étapes de Configuration

### 1. Créer un Compte Stripe

1. Aller sur https://stripe.com
2. Créer un compte
3. Accéder au Dashboard
4. Aller dans **Developers → API Keys**
5. Copier:
   - `sk_test_xxxxx` (Clé secrète)
   - `pk_test_xxxxx` (Clé publique)

### 2. Configurer les Variables d'Environnement

**Backend - `.env`**
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxx

# Autres variables existantes
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_secret
PORT=5000
```

**Frontend - `.env.local`**
```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_API_URL=https://votre-api.com/api  # URL de production
```

### 3. Installer les Dépendances

**Backend**
```bash
cd backend
npm install stripe
npm run dev  # Tester en local
```

**Frontend**
```bash
cd frontend
npm install
npm run dev  # Tester en local
```

### 4. Tester en Local

#### Test 1: Paiement en Espèces
1. Accéder à http://localhost:3000/services/[serviceId]
2. Sélectionner "Paiement en espèces"
3. Remplir le formulaire
4. Cliquer "Confirmer la réservation"
5. ✅ Vérifier redirection vers `/booking`

#### Test 2: Paiement en Ligne
1. Accéder à http://localhost:3000/services/[serviceId]
2. Sélectionner "Paiement en ligne"
3. Remplir le formulaire
4. Cliquer "Confirmer la réservation"
5. ✅ Vérifier redirection vers `/payment/[bookingId]`
6. Cliquer "Payer maintenant"
7. ✅ Vérifier message de succès

#### Test 3: Admin Dashboard
1. Accéder à http://localhost:3000/admin/payments
2. ✅ Vérifier statistiques affichées
3. Filtrer par "Espèces"
4. ✅ Vérifier filtrage fonctionne
5. Filtrer par "En ligne"
6. ✅ Vérifier filtrage fonctionne

---

## 🌐 Déploiement en Production

### Phase 1: Préparation

#### Backend
```bash
# Vérifier les tests
cd backend
npm test

# Build production
npm run build  # Si applicable

# Vérifier .env production
cat .env  # Vérifier clés Stripe PRODUCTION
```

#### Frontend
```bash
# Build production
cd frontend
npm run build

# Vérifier .env.local production
cat .env.local  # Vérifier clés Stripe PRODUCTION
```

### Phase 2: Déploiement Backend

#### Option A: Heroku
```bash
# Si pas encore fait
heroku login
heroku create clean-pro-api

# Configurer variables d'environnement
heroku config:set STRIPE_SECRET_KEY=sk_live_xxxxx
heroku config:set STRIPE_PUBLIC_KEY=pk_live_xxxxx
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=votre_secret

# Déployer
git push heroku main
```

#### Option B: AWS/Azure/GCP
Suivre les instructions de votre plateforme de déploiement.

### Phase 3: Déploiement Frontend

#### Option A: Vercel (Recommandé pour Next.js)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer variables d'environnement dans Vercel Dashboard
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxxx
NEXT_PUBLIC_API_URL=https://clean-pro-api.herokuapp.com/api
```

#### Option B: Netlify
```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod

# Configurer build command: npm run build
# Configurer publish directory: .next
```

---

## 🔐 Configuration de Sécurité

### HTTPS Obligatoire
```
❌ http://example.com/payment/...
✅ https://example.com/payment/...
```

### Headers de Sécurité
Ajouter à votre serveur:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; script-src 'self' https://js.stripe.com
```

### Clés Stripe Sécurisées
```
✅ Clé secrète (sk_*): Côté serveur uniquement
✅ Clé publique (pk_*): Peut être publique
❌ Ne JAMAIS commiter les clés dans Git
```

### Webhooks Stripe (Optionnel mais recommandé)
```bash
# Installer Stripe CLI
# https://stripe.com/docs/stripe-cli

# Écouter les événements
stripe listen --forward-to localhost:5000/api/webhooks

# Obtenir le signing secret et l'ajouter à .env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 🧪 Tests de Production

### Test 1: Cartes de Test Réelles
Utilisez les cartes de test Stripe en production:

| Scénario | Carte |
|----------|-------|
| Succès | 4242 4242 4242 4242 |
| Décliné | 4000 0000 0000 0002 |
| Authentification | 4000 0025 0000 3155 |

### Test 2: Bout en Bout
1. Créer une réservation en ligne
2. Effectuer un paiement
3. Vérifier dans Stripe Dashboard
4. Vérifier dans Dashboard Admin
5. Vérifier email de confirmation

### Test 3: Vérification Admin
1. Accéder à `/admin/payments`
2. Vérifier les statistiques
3. Vérifier la table des transactions
4. Filtrer par méthode
5. Vérifier les statuts

---

## 📊 Monitoring en Production

### Stripe Dashboard
- Aller sur https://dashboard.stripe.com
- Vérifier les **Transactions** en temps réel
- Consulter les **Événements** pour les erreurs
- Configurer les **Webhooks** pour les notifications

### Logs Backend
```bash
# Vérifier les logs
tail -f logs/payment.log

# Vérifier les erreurs Stripe
grep "STRIPE_ERROR" logs/backend.log
```

### Metrics
- Nombre de paiements complétés
- Nombre de paiements échoués
- Montant total traité
- Taux de conversion

---

## 🆘 Dépannage Production

### Problème: "STRIPE_SECRET_KEY not set"
```bash
# Solution: Vérifier variables d'environnement
heroku config  # Heroku
vercel env list  # Vercel
```

### Problème: Paiements non confirmés
```bash
# Solution: Vérifier Stripe Dashboard
# 1. Vérifier si le paiement est créé
# 2. Vérifier le statut du PaymentIntent
# 3. Consulter les logs d'erreur
```

### Problème: Clés invalides en production
```bash
# Solution: Utiliser clés LIVE de Stripe
# 1. Aller dans Stripe Dashboard
# 2. Mode "Live" activé
# 3. Copier clés LIVE (sk_live_*, pk_live_*)
# 4. Mettre à jour variables d'environnement
```

---

## 📈 Bonnes Pratiques

### ✅ À Faire
- Tester en local avant production
- Utiliser HTTPS partout
- Garder les clés secrètes en secret
- Loguer les paiements importants
- Monitorer les erreurs Stripe
- Faire des sauvegardes régulières

### ❌ À Ne Pas Faire
- Commiter les clés API dans Git
- Utiliser clés de test en production
- Stocker les numéros de carte
- Ignorer les webhooks Stripe
- Oublier les backups
- Désactiver les logs de sécurité

---

## 🔄 Mise à Jour Production

### Déployer une mise à jour

**Backend**
```bash
cd backend
# Faire les changements
git add .
git commit -m "Ajouter feature paiement"
git push heroku main
```

**Frontend**
```bash
cd frontend
# Faire les changements
npm run build
vercel --prod
```

### Rollback si problème
```bash
# Heroku
heroku releases
heroku releases:rollback

# Vercel
# Aller dans Vercel Dashboard → Deployments → Rollback
```

---

## 📞 Support Stripe

- **Documentation:** https://stripe.com/docs
- **Forum:** https://support.stripe.com
- **Contact:** support@stripe.com

---

## ✨ Prochaines Étapes

1. ✅ Configurer Stripe
2. ✅ Tester en local
3. ✅ Déployer backend
4. ✅ Déployer frontend
5. ✅ Tester en production
6. ❓ Configurer webhooks (optionnel)
7. ❓ Ajouter SMS de confirmation (optionnel)
8. ❓ Intégrer analytics (optionnel)

---

**Version:** 1.0  
**Date:** Janvier 2026  
**Status:** Ready for Deployment
