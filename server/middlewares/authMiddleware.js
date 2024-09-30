const jwt = require('jsonwebtoken');
const { messageResponse } = require('../utils/response');

const { ACCESS_TOKEN_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  const accessToken = req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return messageResponse(res, 401, 'No access token provided');
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    return messageResponse(res, 401, 'Invalid token');
  }
};

module.exports = authMiddleware;
