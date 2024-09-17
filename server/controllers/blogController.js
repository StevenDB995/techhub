const Blog = require('../models/blogModel');
const { successResponse, errorResponse } = require('../utils/response');

exports.createBlog = async (req, res) => {
  try {
    const { content } = req.body;
    const blog = new Blog({ content });
    await blog.save();
    successResponse(res, {}, 'Blog posted successfully!', 201);
  } catch (err) {
    errorResponse(res, 'Error creating blog')
    console.error(err);
  }
};
