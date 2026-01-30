const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// Routes de paiement
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);

module.exports = router;
