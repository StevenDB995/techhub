const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String },
  previewText: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date  },
  status: {
    type: String,
    enum: ['public', 'draft', 'deleted'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageLinks: [{ type: String }]
});

// Create a model based on the schema
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
