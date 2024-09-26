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
}

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
  // TODO: authorize
  try {
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(id, {
      ...req.body,
      updatedAt: Date.now()
    }, { new: true });

    if (updatedBlog) {
      return messageResponse(res, 200, 'Blog updated successfully!');
    } else {
      return messageResponse(res, 404, 'Blog not found');
    }
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error updating blog');
  }
};

exports.deleteBlogById = async (req, res) => {
  // TODO: authorize
  try {
    const { id } = req.params;
    const softDeletedBlog = await Blog.findByIdAndUpdate(id, {
      status: 'deleted',
      deletedAt: Date.now()
    }, { new: true });

    if (softDeletedBlog) {
      return messageResponse(res, 200, 'Blog deleted successfully!');
    } else {
      return messageResponse(res, 404, 'Blog not found');
    }
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error deleting blog');
  }
};
