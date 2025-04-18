const constants = require('../config/constants');

const getAccessToken = (req) => {
  return req.header('Authorization')?.split(' ')[1];
};

const getRefreshToken = (req) => {
  return req.cookies[constants.REFRESH_TOKEN_NAME];
};

const setRefreshToken = (res, refreshToken) => {
  res.cookie(constants.REFRESH_TOKEN_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: constants.REFRESH_TOKEN_PATH,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const clearRefreshToken = (res) => {
  res.clearCookie(constants.REFRESH_TOKEN_NAME, { path: constants.REFRESH_TOKEN_PATH });
};

// Reject authentication of inactive users
const verifyUser = (req, res, user) => {
  // unauthorize if the user is inactive or removed
  if (!user?.isActive) {
    // instruct to clear refresh token in browser
    clearRefreshToken(res);
    return false;
  }
  req.user = user;
  return true;
};

module.exports = {
  getAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearRefreshToken,
  verifyUser
};
