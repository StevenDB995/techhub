const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { messageResponse, dataResponse } = require('../utils/response');
const { isValidUsername, isValidPassword, isValidEmail } = require('../utils/validate');

const { JWT_SECRET } = process.env;

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  if (!isValidUsername(username) || !isValidPassword(password) || !isValidEmail(email)) {
    return messageResponse(res, 400, 'Bad request');
  }

  try {
    // For now the system can have only one user
    // Will remove this constraint in future for system functionalities
    if (await User.countDocuments() > 0) {
      return messageResponse(res, 403, 'Forbidden');
    }

    const user = new User({ username, password, email });
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
    const match = await user.comparePassword(password);
    if (!user || !user.isActive || !match) {
      return messageResponse(res, 401, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return dataResponse(res, 200, {
      token,
      username: user.username
    });

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Unexpected error');
  }
};
