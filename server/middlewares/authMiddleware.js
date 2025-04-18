const User = require('../models/userModel');
const { messageResponse, errorTypes } = require('../utils/responseUtil');
const { verifyAccessToken } = require('../utils/tokenUtil');
const { getAccessToken, verifyUser } = require('../helpers/authHelper');

const auth = async (req, res, next) => {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return messageResponse(res, 401, 'No access token provided');
  }

  let jwtClaims;
  try {
    jwtClaims = verifyAccessToken(accessToken);
  } catch (err) {
    if (err.name !== 'TokenExpiredError') {
      console.error(err);
    }
    return messageResponse(res, 401, 'Invalid token');
  }

  try {
    const user = await User.findById(jwtClaims.userId).select('-password');
    if (verifyUser(req, res, user)) {
      return next();
    } else {
      return messageResponse(res, 403, 'Forbidden', errorTypes.ILLEGAL_USER);
    }
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching user');
  }
};

const optionalAuth = async (req, res, next) => {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return next();
  }

  let jwtClaims;
  try {
    jwtClaims = verifyAccessToken(accessToken);
  } catch (err) {
    if (err.name !== 'TokenExpiredError') {
      console.error(err);
    }
    return next();
  }

  try {
    const user = await User.findById(jwtClaims.userId).select('-password');
    verifyUser(req, res, user);
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching user');
  }

  return next();
};

module.exports = { auth, optionalAuth };
