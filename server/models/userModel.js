import mongoose from 'mongoose';
import { isValidEmail, isValidUsername } from '../utils/validateUtil.js';

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
  avatar: new mongoose.Schema({
    link: { type: String, required: true },
    deletehash: { type: String, required: true }
  }, { _id: false }),
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

export default User;
