const jwt = require('jsonwebtoken');
const { messageResponse } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return messageResponse(res, 401, 'No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    return messageResponse(res, 401, 'Invalid token');
  }
}

module.exports = authMiddleware;
