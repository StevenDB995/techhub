const Blog = require('../models/blogModel');
const { successResponse, errorResponse } = require('../utils/response');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return successResponse(res, blogs);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Error fetching blogs');
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    return blog ?
      successResponse(res, blog) :
      errorResponse(res, 'Blog not found', 404);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Error fetching blog');
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, previewText, content } = req.body;
    const blog = new Blog({ title, previewText, content });
    await blog.save();
    return successResponse(res, {}, 'Blog posted successfully!', 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Error creating blog');
  }
};

exports.updateBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, previewText, content } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(id, {
      title,
      previewText,
      content,
      updatedAt: Date.now()
    }, { new: true });

    if (updatedBlog) {
      return successResponse(res, {}, 'Blog updated successfully!');
    } else {
      return errorResponse(res, 'Blog not found', 404);
    }
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Error updating blog');
  }
};
