const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, maxLength: 70 },
  abstract: { type: String, maxLength: 280 },
  previewText: { type: String, maxLength: 280 },
  content: { type: String, required: true, maxLength: 50_000 },  // max ~8000 words
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date  },
  status: {
    type: String,
    enum: ['public', 'draft', 'private', 'deleted'],
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
