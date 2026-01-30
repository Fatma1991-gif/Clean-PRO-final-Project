const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    let query = { isActive: true, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    const services = await Service.find(query);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || service.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || service.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || service.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    service.isDeleted = true;
    service.deletedAt = new Date();
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service supprimé avec succès',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Restaurer un service supprimé logiquement
exports.restoreService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    if (!service.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Ce service n\'a pas été supprimé'
      });
    }

    service.isDeleted = false;
    service.deletedAt = null;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service restauré avec succès',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Supprimer définitivement un service - Admin uniquement
exports.permanentlyDeleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service supprimé définitivement de la base de données',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Récupérer les services supprimés logiquement - Admin uniquement
exports.getDeletedServices = async (req, res) => {
  try {
    const deletedServices = await Service.find({ isDeleted: true })
      .sort('-deletedAt');

    res.status(200).json({
      success: true,
      count: deletedServices.length,
      data: deletedServices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
