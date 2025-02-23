const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

exports.signAccessToken = (userId, username) => {
  return jwt.sign({ userId, username }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

exports.signRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
