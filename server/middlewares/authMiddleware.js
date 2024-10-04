const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { messageResponse, errorTypes } = require('../utils/response');

const { ACCESS_TOKEN_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  const accessToken = req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return messageResponse(res, 401, 'No access token provided');
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;

    try {
      // unauthorize if the user is inactive or removed
      const user = await User.findById(userId);
      if (!user?.isActive) {
        // instruct to clear refresh token in browser
        res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
        return messageResponse(res, 403, 'Forbidden', errorTypes.ILLEGAL_USER);
      }
    } catch (dbError) {
      console.error(dbError.message);
      return messageResponse(res, 500, 'Unexpected error');
    }

    req.user = userId;
    next();

  } catch (jwtError) {
    return messageResponse(res, 401, 'Invalid token');
  }
};

module.exports = authMiddleware;
