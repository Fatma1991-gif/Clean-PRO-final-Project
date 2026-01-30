const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
  assignBooking,
  getAssignedToMe,
  deleteBooking,
  restoreBooking,
  permanentlyDeleteBooking,
  getDeletedBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getMyBookings)
  .post(createBooking);

router.route('/admin')
  .get(authorize('admin'), getAllBookings);

router.route('/admin/deleted')
  .get(authorize('admin'), getDeletedBookings);

router.route('/assigned/me')
  .get(authorize('personnel'), getAssignedToMe);

router.route('/admin/stats')
  .get(authorize('admin'), getBookingStats);

router.route('/:id')
  .get(getBooking)
  .delete(deleteBooking);

router.route('/:id/status')
  .put(authorize('admin'), updateBookingStatus);

router.route('/:id/assign')
  .put(authorize('admin'), assignBooking);

router.route('/:id/restore')
  .put(authorize('admin'), restoreBooking);

router.route('/:id/permanent-delete')
  .delete(authorize('admin'), permanentlyDeleteBooking);

module.exports = router;
