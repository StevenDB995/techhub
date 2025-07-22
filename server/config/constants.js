export const BASE_API_PATH = '/api';

export const ACCESS_TOKEN_NAME = 'accessToken';
export const REFRESH_TOKEN_NAME = 'refreshToken';
export const REFRESH_TOKEN_PATH = `${BASE_API_PATH}/auth/refresh-token`;

export const reservedUsernames = new Set([
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
