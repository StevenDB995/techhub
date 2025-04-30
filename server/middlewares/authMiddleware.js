const User = require('../models/userModel');
const { errorResponse } = require('../utils/responseUtil');
const { verifyAccessToken } = require('../utils/tokenUtil');
const { getAccessToken, verifyUser } = require('../helpers/authHelper');
const { INVALID_TOKEN, ILLEGAL_USER } = require('../config/errorTypes');

const auth = async (req, res, next) => {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return errorResponse(res, 401, 'No access token provided', INVALID_TOKEN);
  }

  let jwtClaims;
  try {
    jwtClaims = verifyAccessToken(accessToken);
  } catch (err) {
    if (err.name !== 'TokenExpiredError') {
      console.error(err);
    }
    return errorResponse(res, 401, 'Invalid token', INVALID_TOKEN);
  }

  try {
    const user = await User.findById(jwtClaims.userId);
    if (verifyUser(req, res, user)) {
      return next();
    } else {
      return errorResponse(res, 403, 'Forbidden', ILLEGAL_USER);
    }
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Error fetching user');
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
    const user = await User.findById(jwtClaims.userId);
    verifyUser(req, res, user);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Error fetching user');
  }

  return next();
};

module.exports = { auth, optionalAuth };
