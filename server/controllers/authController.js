const User = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/responseUtil');
const { isValidPassword } = require('../utils/validateUtil');
const { hashPassword, comparePassword } = require('../utils/passwordUtil');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokenUtil');
const { getRefreshToken, setRefreshToken, clearRefreshToken } = require('../helpers/authHelper');
const { SESSION_EXPIRED, USERNAME_EXISTS, EMAIL_EXISTS, INVALID_CREDENTIALS } = require('../config/errorTypes');

exports.refreshToken = async (req, res) => {
  let refreshToken = getRefreshToken(req);
  if (!refreshToken) {
    return errorResponse(res, 401, 'No refresh token provided', SESSION_EXPIRED);
  }

  try {
    const { userId } = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken(userId);
    refreshToken = signRefreshToken(userId);
    setRefreshToken(res, refreshToken);
    return successResponse(res, 200, { accessToken });

  } catch (err) {
    // clear the refresh token in cookies anyway on error
    clearRefreshToken(res);
    // if the refresh token expired
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Session expired', SESSION_EXPIRED);
    }
    // most likely an invalid signature
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid refresh token', SESSION_EXPIRED);
    }

    console.error(err);
    return errorResponse(res, 500, 'Unexpected error');
  }
};

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  if (!isValidPassword(password)) {
    return errorResponse(res, 400, 'Bad request');
  }

  try {
    // For now the system can have only two users
    // Will remove this constraint in future for system functionalities
    if (await User.countDocuments() >= 2) {
      return errorResponse(res, 403, 'Forbidden');
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ username, password: hashedPassword, email });
    const savedUser = await user.save();
    return successResponse(res, 201, savedUser, 'Signed up successfully!');

  } catch (err) {
    // Check if the error is a duplicate key error
    if (err.code === 11000) {
      if (err.keyPattern.username) {
        return errorResponse(res, 409, 'User already exists', USERNAME_EXISTS);
      }
      if (err.keyPattern.email) {
        return errorResponse(res, 409, 'Email already registered', EMAIL_EXISTS);
      }
    }

    // Invalid username or email format
    if (err.name === 'ValidationError') {
      return errorResponse(res, 400, 'Bad request');
    }

    console.error(err);
    return errorResponse(res, 500, 'Error signing up');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !user.isActive) {
      return errorResponse(res, 401, 'Invalid credentials', INVALID_CREDENTIALS);
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return errorResponse(res, 401, 'Invalid credentials', INVALID_CREDENTIALS);
    }

    user.lastLogin = Date.now();
    const savedUser = await user.save({ timestamps: false });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    setRefreshToken(res, refreshToken);

    return successResponse(res, 200, { accessToken, user: savedUser });

  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Unexpected error');
  }
};

exports.logout = async (req, res) => {
  clearRefreshToken(res);
  return successResponse(res, 200, null, 'Logged out');
};
