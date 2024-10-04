const BASE_API_PATH = '/api';

const constants = {
  BASE_API_PATH,
  ACCESS_TOKEN_NAME: 'accessToken',
  REFRESH_TOKEN_NAME: 'refreshToken',
  REFRESH_TOKEN_PATH: `${BASE_API_PATH}/auth/refresh-token`
};

module.exports = constants;
