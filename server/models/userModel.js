const mongoose = require('mongoose');
const { isValidUsername, isValidEmail } = require('../utils/validateUtil');

const userSchema = new mongoose.Schema({
  username: { // case-insensitive collation but still preserve the case
    type: String,
    required: true,
    index: { unique: true, collation: { locale: "en", strength: 2 } },
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
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
