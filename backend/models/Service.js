const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom de service'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    
    required: [true, 'Veuillez fournir une description'],
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  category: {
    type: String,
    required: true,
    enum: ['maison', 'batiment', 'bureau', 'vehicule']
  },
  price: {
    type: Number,
    required: [true, 'Veuillez fournir un prix']
  },
  duration: {
    type: Number,
    required: [true, 'Veuillez fournir une durée en heures']
  },
  image: {
    type: String,
    default: '/images/services/default-service.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Service', ServiceSchema);
