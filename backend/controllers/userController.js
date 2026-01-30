const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const filter = { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };
    if (req.query.role) {
      filter.role = req.query.role;
    }
    const users = await User.find(filter).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Soft delete: marquer comme supprimé sans le supprimer de la base
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });
    const clientCount = await User.countDocuments({ role: 'client', $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });
    const adminCount = await User.countDocuments({ role: 'admin', $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });
    const personnelCount = await User.countDocuments({ role: 'personnel', $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });

    const recentUsers = await User.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] })
      .sort('-createdAt')
      .limit(5)
      .select('name email createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        clientCount,
        adminCount,
        personnelCount,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Restaurer un utilisateur supprimé logiquement
exports.restoreUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (!user.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Cet utilisateur n\'a pas été supprimé'
      });
    }

    user.isDeleted = false;
    user.deletedAt = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Utilisateur restauré avec succès',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Supprimer définitivement un utilisateur (Hard Delete) - Admin uniquement
exports.permanentlyDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé définitivement de la base de données',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Récupérer les utilisateurs supprimés - Admin uniquement
exports.getDeletedUsers = async (req, res) => {
  try {
    const deletedUsers = await User.find({ isDeleted: true })
      .select('-password')
      .sort('-deletedAt');

    res.status(200).json({
      success: true,
      count: deletedUsers.length,
      data: deletedUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
