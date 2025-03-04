const User = require('../models/userModel');
const { messageResponse } = require('../utils/responseUtil');
const { verifyAccessToken } = require('../utils/tokenUtil');
const { getAccessToken, validateUser } = require('../helpers/authHelper');

const authMiddleware = async (req, res, next) => {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return messageResponse(res, 401, 'No access token provided');
  }

  try {
    const { userId } = verifyAccessToken(accessToken);

    try {
      const user = await User.findById(userId);
      if (!validateUser(res, user)) {
        return;
      }
    } catch (dbError) {
      console.error(dbError);
      return messageResponse(res, 500, 'Unexpected error');
    }

    req.userId = userId;
    next();

  } catch (jwtError) {
    return messageResponse(res, 401, 'Invalid token');
  }
};

module.exports = authMiddleware;
