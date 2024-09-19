const Blog = require('../models/blogModel');
const { successResponse, errorResponse } = require('../utils/response');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog
      .find({ status: 'public' })
      .sort({ createdAt: -1 });
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
    const blog = req.body;
    blog.createdAt = Date.now();
    blog.updatedAt = Date.now();
    const blogModel = new Blog(blog);
    await blogModel.save();
    return successResponse(res, {}, 'Blog created successfully!', 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Error creating blog');
  }
};

exports.updateBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(id, {
      ...req.body,
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
