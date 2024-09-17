const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: false },
  previewText: { type: String, required: false },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a model based on the schema
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
