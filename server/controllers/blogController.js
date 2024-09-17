const Blog = require('../models/blogModel');

exports.createBlog = async (req, res) => {
  try {
    const { content } = req.body;
    const blog = new Blog({ content });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};
