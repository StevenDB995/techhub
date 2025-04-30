const User = require('../models/userModel');
const Blog = require('../models/blogModel');
const { successResponse, errorResponse } = require('../utils/responseUtil');
const { isValidPassword } = require('../utils/validateUtil');
const { hashPassword } = require('../utils/passwordUtil');
const { deleteImage } = require('../helpers/imgurHelper');
const { INVALID_TOKEN, USERNAME_EXISTS, EMAIL_EXISTS } = require('../config/errorTypes');

exports.getCurrentUser = async (req, res) => {
  return successResponse(res, 200, req.user);
};

exports.getBlogsByUsername = async (req, res) => {
  const { username } = req.params;
  const currentUser = req.user;
  let status = req.query.status || 'public';

  try {
    const user = await User.findOne({ username })
      .collation({ locale: 'en', strength: 2 });
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // if an unauthenticated user requests non-public blogs
    // return 401 for subsequent refresh token request
    if (status !== 'public' && !currentUser) {
      return errorResponse(res, 401, 'Invalid token', INVALID_TOKEN);
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

    return successResponse(res, 200, blogs);

  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Error fetching blogs');
  }
};

exports.updateCurrentUser = async (req, res) => {
  // Validate password
  if (req.body.password && !isValidPassword(req.body.password)) {
    return errorResponse(res, 400, 'Invalid password');
  }

  const user = req.user;
  // If a new avatar is included in the request body and the user currently has an avatar,
  // delete the previous avatar
  const prevAvatar = req.body.avatar?.deletehash ? user.avatar?.deletehash : null;

  for (const key in req.body) {
    user[key] = req.body[key];
  }

  try {
    // Hash password if password is provided
    if (req.body.password) {
      user.password = await hashPassword(req.body.password);
    }

    const updatedUser = await user.save();

    if (prevAvatar) {
      deleteImage(prevAvatar)
        .catch(err => console.error(err));
    }

    return successResponse(res, 200, updatedUser, 'User updated successfully!');

  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicated key error
      if (err.keyPattern.username) {
        return errorResponse(res, 409, 'Username already taken', USERNAME_EXISTS);
      } else if (err.keyPattern.email) {
        return errorResponse(res, 409, 'Email already registered', EMAIL_EXISTS);
      }
    }

    if (err.name === 'ValidationError') {
      return errorResponse(res, 400, 'Bad request');
    }

    console.error(err);
    return errorResponse(res, 500, 'Error updating user');
  }
};
