const Blog = require('../models/blogModel');
const { dataResponse, messageResponse } = require('../utils/response');

// for self content management
exports.getMyBlogsByStatus = async (req, res) => {
  try {
    const status = req.query.status || 'public';
    const blogs = await Blog
      .find({ author: req.user, status })
      .sort({ createdAt: -1 });
    return dataResponse(res, 200, blogs);
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blogs');
  }
};

// for public view
exports.getPublicBlogs = async (req, res) => {
  const { userId } = req.params;
  try {
    const blogs = await Blog.find({
      author: userId,
      status: 'public'
    }).sort({ createdAt: -1 });
    return dataResponse(res, 200, blogs);
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blogs');
  }
}
