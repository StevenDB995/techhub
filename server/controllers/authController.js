const User = require('../models/userModel');
const { messageResponse, dataResponse } = require('../utils/responseUtil');
const { isValidUsername, isValidPassword, isValidEmail } = require('../utils/validateUtil');
const { hashPassword, comparePassword } = require('../utils/passwordUtil');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokenUtil');
const { clearRefreshToken } = require('../helpers/authHelper');
const constants = require('../config/constants');

const { NODE_ENV } = process.env;

const cookieConfig = {
  httpOnly: true,
  secure: NODE_ENV === 'production',
  path: constants.REFRESH_TOKEN_PATH,
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

exports.refreshToken = async (req, res) => {
  let refreshToken = req.cookies[constants.REFRESH_TOKEN_NAME];
  if (!refreshToken) {
    return messageResponse(res, 401, 'No refresh token provided');
  }

  try {
    const { userId } = verifyRefreshToken(refreshToken);
    const user = await User.findById(userId);
    const accessToken = signAccessToken(userId);
    refreshToken = signRefreshToken(userId);

    res.cookie(constants.REFRESH_TOKEN_NAME, refreshToken, cookieConfig);
    return dataResponse(res, 200, { accessToken });

  } catch (err) {
    // if the refresh token expired
    if (err.name === 'TokenExpiredError') {
      clearRefreshToken(res);
      return messageResponse(res, 401, 'Session expired');
    }
    // most likely an invalid signature
    if (err.name === 'JsonWebTokenError') {
      clearRefreshToken(res);
      return messageResponse(res, 401, err.message);
    }

    console.error(err);
    return messageResponse(res, 500, 'Unexpected error');
  }
};

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  if (!isValidUsername(username) || !isValidPassword(password) || !isValidEmail(email)) {
    return messageResponse(res, 400, 'Bad request');
  }

  try {
    // For now the system can have only two users
    // Will remove this constraint in future for system functionalities
    if (await User.countDocuments() >= 2) {
      return messageResponse(res, 403, 'Forbidden');
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    return messageResponse(res, 201, 'Signed up successfully!');

  } catch (err) {
    // Check if the error is a duplicate key error
    if (err.code === 11000) {
      if (err.keyPattern.username) {
        return messageResponse(res, 400, 'User already exists');
      }
      if (err.keyPattern.email) {
        return messageResponse(res, 400, 'Email already registered');
      }
    }

    console.error(err);
    return messageResponse(res, 500, 'Error signing up');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !user.isActive) {
      return messageResponse(res, 401, 'Invalid credentials');
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return messageResponse(res, 401, 'Invalid credentials');
    }

    user.lastLogin = Date.now();
    await user.save();

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.cookie(constants.REFRESH_TOKEN_NAME, refreshToken, cookieConfig);

    return dataResponse(res, 200, {
      accessToken,
      username: user.username
    });

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Unexpected error');
  }
};

exports.logout = async (req, res) => {
  res.clearCookie(constants.REFRESH_TOKEN_NAME, { path: constants.REFRESH_TOKEN_PATH });
  return messageResponse(res, 200, 'Logged out');
};
