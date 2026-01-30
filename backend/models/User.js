const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'Veuillez fournir un email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  phone: {
    type: String,
    required: [true, 'Veuillez fournir un numéro de téléphone']
  },
  password: {
    type: String,
    required: [true, 'Veuillez fournir un mot de passe'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'admin', 'personnel'],
    default: 'client'
  },
  address: {
    type: String
  },
  // Champs spécifiques aux agents
  skills: [{
    category: {
      type: String,
      enum: ['maison', 'bureau', 'batiment', 'vehicule']
    },
    proficiency: {
      type: String,
      enum: ['débutant', 'intermédiaire', 'expert'],
      default: 'intermédiaire'
    }
  }],
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableDays: {
      type: [String],
      default: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
    },
    startTime: {
      type: String,
      default: '08:00'
    },
    endTime: {
      type: String,
      default: '18:00'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
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

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', UserSchema);
