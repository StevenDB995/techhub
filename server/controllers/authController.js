const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { errorResponse, successResponse } = require('../utils/response');
const { isValidUsername, isValidPassword, isValidEmail } = require('../utils/validate');
require('dotenv').config();

const { JWT_SECRET } = process.env;

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  if (!isValidUsername(username) || !isValidPassword(password) || (email && !isValidEmail(email))) {
    return errorResponse(res, 'Bad request', 400);
  }

  try {
    // For now the system can have only one user
    // Will remove this constraint in future for system functionalities
    if (await User.countDocuments() > 0) {
      return errorResponse(res, 'Forbidden', 403);
    }

    let user = await User.findOne({ username });
    if (user) {
      return errorResponse(res, 'User already exists', 400);
    }

    user = new User({ username, password, email });
    await user.save();
    return successResponse(res, {}, 'Signed up successfully!', 201);

  } catch (err) {
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

    const token = jwt.sign({
      userId: user._id,
      username: user.username
    }, JWT_SECRET, { expiresIn: '1h' });

    return successResponse(res, {
      token,
      username: user.username
    }, 'Logged in successfully!');

  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Unexpected error');
  }
};
