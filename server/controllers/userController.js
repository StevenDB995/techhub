const User = require('../models/userModel');
const Blog = require('../models/blogModel');
const { dataResponse, messageResponse } = require('../utils/response');
const { isValidPassword } = require('../utils/validate');
const { hashPassword } = require('../utils/password');

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return dataResponse(res, 200, user);
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching user');
  }
};

// for self content management
exports.getMyBlogsByStatus = async (req, res) => {
  try {
    const status = req.query.status || 'public';
    const blogs = await Blog
      .find({ author: req.user.id, status })
      .select('-content')
      .populate('author', 'username')
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
    if (!blog.author.equals(req.user.id)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    return dataResponse(res, 200, blog);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blog');
  }
};

// for public view
exports.getPublicBlogsByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await Blog.findOne({ username });
    const blogs = await Blog.find({
      author: user._id,
      status: 'public'
    }).select('-content')
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    return dataResponse(res, 200, blogs);
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blogs');
  }
};

// admin only
exports.updateUser = async (req, res) => {
  const { userId } = req.params;

  // TODO: authorize

  // TODO: validate username and email

  const updateData = req.body;
  if (!isValidPassword(updateData.password)) {
    return messageResponse(res, 400, 'Invalid password');
  }

  // TODO: check whether the username and email exists

  try {
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    updateData.updatedAt = Date.now();
    await User.findByIdAndUpdate(userId, updateData, { new: true });
    return messageResponse(res, 200, 'User updated successfully!');
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error updating user');
  }
};
