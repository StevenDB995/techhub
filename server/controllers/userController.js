const User = require('../models/userModel');
const Blog = require('../models/blogModel');
const { dataResponse, messageResponse } = require('../utils/responseUtil');
const { isValidPassword } = require('../utils/validateUtil');
const { hashPassword } = require('../utils/passwordUtil');
const { deleteImage } = require('../helpers/imgurHelper');

exports.getCurrentUser = async (req, res) => {
  return dataResponse(res, 200, req.user);
};

exports.getBlogsByUsername = async (req, res) => {
  const { username } = req.params;
  const currentUser = req.user;
  let status = req.query.status || 'public';

  try {
    const user = await User.findOne({ username })
      .collation({ locale: 'en', strength: 2 });
    if (!user) {
      return messageResponse(res, 404, 'User not found');
    }

    // if an unauthenticated user requests non-public blogs
    // return 401 for subsequent refresh token request
    if (status !== 'public' && !currentUser) {
      return messageResponse(res, 401, 'Invalid token');
    }

    // if the current user remains unauthenticated, or it does not match the owner of the blogs,
    // set the filter to public anyway
    if (!user._id.equals(currentUser?._id)) {
      status = 'public';
    }

    const blogs = await Blog.find({
      author: user._id, status
    }).select('-content')
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    return dataResponse(res, 200, blogs);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blogs');
  }
};

exports.updateCurrentUser = async (req, res) => {
  // TODO: validate username and email

  const user = req.body;
  if (!isValidPassword(user.password)) {
    return messageResponse(res, 400, 'Invalid password');
  }

  // TODO: check whether the username and email exists

  try {
    if (user.password) {
      user.password = await hashPassword(user.password);
    }
    user.updatedAt = Date.now();
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      user,
      { new: true }
    ).select('-password');

    if (user.avatar && req.user.avatar) {
      deleteImage(req.user.avatar.deletehash)
        .catch(err => console.error(err));
    }

    return dataResponse(res, 200, updatedUser);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error updating user');
  }
};
