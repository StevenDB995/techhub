const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { messageResponse } = require('../utils/response');
const { validateAccessToken } = require('../helpers/authHelper');

const { ACCESS_TOKEN_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  const accessToken = req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return messageResponse(res, 401, 'No access token provided');
  }

  try {
    const jwtClaims = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    try {
      const user = await User.findById(jwtClaims.userId);
      if (!validateAccessToken(res, jwtClaims, user)) {
        return;
      }
    } catch (dbError) {
      console.error(dbError.message);
      return messageResponse(res, 500, 'Unexpected error');
    }

    req.user = { id: jwtClaims.userId, username: jwtClaims.username };
    next();

  } catch (jwtError) {
    return messageResponse(res, 401, 'Invalid token');
  }
};

module.exports = authMiddleware;
