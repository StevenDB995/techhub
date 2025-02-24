const mongoose = require('mongoose');

const blogImageSchema = new mongoose.Schema({
  link: { type: String, required: true, unique: true },
  deletehash: { type: String, required: true, unique: true },
  isAttached: { type: Boolean }
}, { strict: false });

const BlogImage = mongoose.model('BlogImage', blogImageSchema);

module.exports = BlogImage;
