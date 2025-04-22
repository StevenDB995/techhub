const BASE_API_PATH = '/api';

const ACCESS_TOKEN_NAME = 'accessToken';
const REFRESH_TOKEN_NAME = 'refreshToken';
const REFRESH_TOKEN_PATH = `${BASE_API_PATH}/auth/refresh-token`;

const reservedUsernames = new Set([
  // website page names
  'about',
  'login',
  'contact',
  'blogs',
  'admin',
  // api names
  'api',
  'me'
]);

module.exports = {
  BASE_API_PATH,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  REFRESH_TOKEN_PATH,
  reservedUsernames
};
