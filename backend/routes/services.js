const express = require('express');
const router = express.Router();
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getAllServicesAdmin,
  restoreService,
  permanentlyDeleteService,
  getDeletedServices
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin'), createService);

router.route('/admin')
  .get(protect, authorize('admin'), getAllServicesAdmin);

router.route('/admin/deleted')
  .get(protect, authorize('admin'), getDeletedServices);

router.route('/:id')
  .get(getService)
  .put(protect, authorize('admin'), updateService)
  .delete(protect, authorize('admin'), deleteService);

router.route('/:id/restore')
  .put(protect, authorize('admin'), restoreService);

router.route('/:id/permanent-delete')
  .delete(protect, authorize('admin'), permanentlyDeleteService);

module.exports = router;
