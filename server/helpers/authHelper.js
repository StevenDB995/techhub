const constants = require('../config/constants');
const { messageResponse, errorTypes } = require('../utils/responseUtil');

const getAccessToken = (req) => {
  return req.header('Authorization')?.split(' ')[1];
}

const clearRefreshToken = (res) => {
  res.clearCookie(constants.REFRESH_TOKEN_NAME, { path: constants.REFRESH_TOKEN_PATH });
};

// Further validate the access token after being verified
const validateJwtClaims = (res, jwtClaims, user) => {
  // unauthorize if the user is inactive or removed
  if (!user?.isActive) {
    // instruct to clear refresh token in browser
    clearRefreshToken(res);
    messageResponse(res, 403, 'Forbidden', errorTypes.ILLEGAL_USER);
    return false;
  }
  // invalidate the token if username changes
  if (jwtClaims.username !== user.username) {
    messageResponse(res, 401, 'Invalid token');
    return false;
  }

  return true;
};

module.exports = {
  getAccessToken,
  clearRefreshToken,
  validateJwtClaims
};
