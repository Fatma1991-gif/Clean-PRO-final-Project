const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  restoreUser,
  permanentlyDeleteUser,
  getDeletedUsers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/stats')
  .get(getUserStats);

router.route('/deleted')
  .get(getDeletedUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:id/restore')
  .put(restoreUser);

router.route('/:id/permanent-delete')
  .delete(permanentlyDeleteUser);

module.exports = router;
