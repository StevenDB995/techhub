const mongoose = require('mongoose');
const { isValidUsername, isValidEmail } = require('../utils/validateUtil');

const userSchema = new mongoose.Schema({
  username: { // case-insensitive collation but still preserve the case
    type: String,
    required: true,
    index: { unique: true, collation: { locale: 'en', strength: 2 } },
    validate: { validator: isValidUsername }
  },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: isValidEmail }
  },
  isActive: { type: Boolean, default: true },
  avatar: {
    link: { type: String, required: true },
    deletehash: { type: String, required: true }
  },
  bio: { type: String, maxLength: 280 },
  lastLogin: { type: Date, default: null }

}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
