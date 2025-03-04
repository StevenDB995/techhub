const constants = require('../config/constants');
const { messageResponse, errorTypes } = require('../utils/responseUtil');

const getAccessToken = (req) => {
  return req.header('Authorization')?.split(' ')[1];
}

const clearRefreshToken = (res) => {
  res.clearCookie(constants.REFRESH_TOKEN_NAME, { path: constants.REFRESH_TOKEN_PATH });
};

// Reject authentication of inactive users
const validateUser = (res, user) => {
  // unauthorize if the user is inactive or removed
  if (!user?.isActive) {
    // instruct to clear refresh token in browser
    clearRefreshToken(res);
    messageResponse(res, 403, 'Forbidden', errorTypes.ILLEGAL_USER);
    return false;
  }
  return true;
};

module.exports = {
  getAccessToken,
  clearRefreshToken,
  validateUser
};
