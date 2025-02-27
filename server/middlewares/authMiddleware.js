const User = require('../models/userModel');
const { messageResponse } = require('../utils/responseUtil');
const { verifyAccessToken } = require('../utils/tokenUtil');
const { getAccessToken, validateJwtClaims } = require('../helpers/authHelper');

const authMiddleware = async (req, res, next) => {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return messageResponse(res, 401, 'No access token provided');
  }

  try {
    const jwtClaims = verifyAccessToken(accessToken);

    try {
      const user = await User.findById(jwtClaims.userId);
      if (!validateJwtClaims(res, jwtClaims, user)) {
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
