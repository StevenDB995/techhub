const Blog = require('../models/blogModel');
const { dataResponse, messageResponse } = require('../utils/response');

// for self content management
exports.getMyBlogsByStatus = async (req, res) => {
  try {
    const status = req.query.status || 'public';
    const blogs = await Blog
      .find({ author: req.user, status })
      .select('-content')
      .sort({ createdAt: -1 });
    return dataResponse(res, 200, blogs);
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blogs');
  }
};

exports.getMyBlogById = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // authorize
    if (!blog.author.equals(req.user)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    return dataResponse(res, 200, blog);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blog');
  }
};

// for public view
exports.getPublicBlogs = async (req, res) => {
  const { userId } = req.params;
  try {
    const blogs = await Blog.find({
      author: userId,
      status: 'public'
    }).select('-content').sort({ createdAt: -1 });
    return dataResponse(res, 200, blogs);
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blogs');
  }
};
