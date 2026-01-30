const Booking = require('../models/Booking');
const Service = require('../models/Service');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, time, address, notes, paymentMethod } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      service: serviceId,
      date,
      time,
      address,
      notes,
      totalPrice: service.price,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentMethod === 'online' ? 'pending' : 'pending'
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('service');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Convertir en centimes
      currency: 'eur',
      metadata: {
        bookingId: bookingId,
        userId: req.user.id
      }
    });

    booking.stripePaymentIntentId = paymentIntent.id;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        bookingId: bookingId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier le statut du PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      booking.paymentStatus = 'completed';
      booking.status = 'confirmed';
      await booking.save();

      return res.status(200).json({
        success: true,
        message: 'Paiement effectué avec succès',
        data: booking
      });
    } else {
      booking.paymentStatus = 'failed';
      await booking.save();

      return res.status(400).json({
        success: false,
        message: 'Le paiement n\'a pas pu être traité'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] })
      .populate('service', 'name category price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name category price duration')
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email phone');

    if (!booking || booking.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à cette réservation'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à annuler cette réservation'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    let query = { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('service', 'name category price')
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('service', 'name category price')
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAssignedToMe = async (req, res) => {
  try {
    const bookings = await Booking.find({ assignedTo: req.user.id, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] })
      .populate('service', 'name category price')
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $match: { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'completed', $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Affecter une réservation à un personnel
exports.assignBooking = async (req, res) => {
  try {
    const { personnelId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedTo: personnelId },
      { new: true, runValidators: true }
    )
      .populate('service', 'name category price')
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft delete une réservation
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette réservation'
      });
    }

    booking.isDeleted = true;
    booking.deletedAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Réservation supprimée avec succès',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Restaurer une réservation supprimée logiquement
exports.restoreBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    if (!booking.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Cette réservation n\'a pas été supprimée'
      });
    }

    booking.isDeleted = false;
    booking.deletedAt = null;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Réservation restaurée avec succès',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Supprimer définitivement une réservation - Admin uniquement
exports.permanentlyDeleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation supprimée définitivement de la base de données',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Récupérer les réservations supprimées logiquement - Admin uniquement
exports.getDeletedBookings = async (req, res) => {
  try {
    const deletedBookings = await Booking.find({ isDeleted: true })
      .populate('service', 'name category price')
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .sort('-deletedAt');

    res.status(200).json({
      success: true,
      count: deletedBookings.length,
      data: deletedBookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
