import { ILLEGAL_USER, INVALID_TOKEN } from '../config/errorTypes.js';
import { getAccessToken, verifyUser } from '../helpers/authHelper.js';
import User from '../models/userModel.js';
import { errorResponse } from '../utils/responseUtil.js';
import { verifyAccessToken } from '../utils/tokenUtil.js';

export const auth = async (req, res, next) => {
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

export const optionalAuth = async (req, res, next) => {
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
