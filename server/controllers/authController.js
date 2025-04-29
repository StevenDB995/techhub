const User = require('../models/userModel');
const { messageResponse, dataResponse } = require('../utils/responseUtil');
const { isValidUsername, isValidPassword, isValidEmail } = require('../utils/validateUtil');
const { hashPassword, comparePassword } = require('../utils/passwordUtil');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokenUtil');
const { getRefreshToken, setRefreshToken, clearRefreshToken } = require('../helpers/authHelper');

exports.refreshToken = async (req, res) => {
  let refreshToken = getRefreshToken(req);
  if (!refreshToken) {
    return messageResponse(res, 401, 'No refresh token provided');
  }

  try {
    const { userId } = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken(userId);
    refreshToken = signRefreshToken(userId);
    setRefreshToken(res, refreshToken);
    return dataResponse(res, 200, { accessToken });

  } catch (err) {
    // clear the refresh token in cookies anyway on error
    clearRefreshToken(res);
    // if the refresh token expired
    if (err.name === 'TokenExpiredError') {
      return messageResponse(res, 401, 'Session expired');
    }
    // most likely an invalid signature
    if (err.name === 'JsonWebTokenError') {
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
        return messageResponse(res, 409, 'User already exists');
      }
      if (err.keyPattern.email) {
        return messageResponse(res, 409, 'Email already registered');
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
    const savedUser = await user.save();
    savedUser.password = undefined;

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    setRefreshToken(res, refreshToken);

    return dataResponse(res, 200, { accessToken, user: savedUser });

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Unexpected error');
  }
};

exports.logout = async (req, res) => {
  clearRefreshToken(res);
  return messageResponse(res, 200, 'Logged out');
};
