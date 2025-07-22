import { REFRESH_TOKEN_NAME, REFRESH_TOKEN_PATH } from '../config/constants.js';

export const getAccessToken = (req) => {
  return req.header('Authorization')?.split(' ')[1];
};

export const getRefreshToken = (req) => {
  return req.cookies[REFRESH_TOKEN_NAME];
};

export const setRefreshToken = (res, refreshToken) => {
  res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: REFRESH_TOKEN_PATH,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const clearRefreshToken = (res) => {
  res.clearCookie(REFRESH_TOKEN_NAME, { path: REFRESH_TOKEN_PATH });
};

// Reject authentication of inactive users
export const verifyUser = (req, res, user) => {
  // unauthorize if the user is inactive or removed
  if (!user?.isActive) {
    // instruct to clear refresh token in browser
    clearRefreshToken(res);
    return false;
  }
  req.user = user;
  return true;
};
