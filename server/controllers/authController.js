const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { errorResponse, successResponse } = require('../utils/response');
const { isValidUsername, isValidPassword, isValidEmail } = require('../utils/validate');

const { JWT_SECRET } = process.env;

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  if (!isValidUsername(username) || !isValidPassword(password) || !isValidEmail(email)) {
    return errorResponse(res, 'Bad request', 400);
  }

  try {
    // For now the system can have only one user
    // Will remove this constraint in future for system functionalities
    if (await User.countDocuments() > 0) {
      return errorResponse(res, 'Forbidden', 403);
    }

    const user = new User({ username, password, email });
    await user.save();
    return successResponse(res, {}, 'Signed up successfully!', 201);

  } catch (err) {
    // Check if the error is a duplicate key error
    if (err.code === 11000) {
      if (err.keyPattern.username) {
        return errorResponse(res, 'User already exists', 400);
      }
      if (err.keyPattern.email) {
        return errorResponse(res, 'Email already registered', 400);
      }
    }

    console.error(err);
    return errorResponse(res, 'Error signing up');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    const match = await user.comparePassword(password);
    if (!user || !user.isActive || !match) {
      return errorResponse(res, 'Invalid credentials', 404);
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return successResponse(res, {
      token,
      username: user.username
    }, 'Logged in successfully!');

  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Unexpected error');
  }
};
