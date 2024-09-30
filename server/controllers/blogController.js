const Blog = require('../models/blogModel');
const { messageResponse, dataResponse } = require('../utils/response');

// get all public blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog
      .find({ status: 'public' })
      .sort({ createdAt: -1 });
    return dataResponse(res, 200, blogs);
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blogs');
  }
};

// for public view only
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // authorize
    if (blog.status !== 'public') {
      return messageResponse(res, 403, 'Permission denied');
    }

    return dataResponse(res, 200, blog);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blog');
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blog = {
      ...req.body,
      author: req.user
    };
    const blogModel = new Blog(blog);
    await blogModel.save();
    return messageResponse(res, 201, 'Blog created successfully!');
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error creating blog');
  }
};

exports.updateBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // authorize
    if (!blog.author.equals(req.user)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };

    // update the createdAt field if the status of the blog changes from 'draft' to 'public'
    if (blog.status === 'draft' && req.body.status === 'public') {
      updateData.createdAt = Date.now();
    }

    await Blog.findByIdAndUpdate(id, updateData, { new: true });
    return messageResponse(res, 200, 'Blog updated successfully!');

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error updating blog');
  }
};

exports.deleteBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // authorize
    if (!blog.author.equals(req.user)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    await Blog.findByIdAndUpdate(id, {
      status: 'deleted',
      deletedAt: Date.now()
    }, { new: true });

    return messageResponse(res, 200, 'Blog deleted successfully!');

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error deleting blog');
  }
};
