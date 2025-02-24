const validator = require('validator');

/**
 * The provided username must:
 * * Be of length between 4-30 characters;
 * * Contains at least one English character;
 * * Contains only English letters, digits, underscores and periods.
 * @param username
 * @returns {boolean}
 */
exports.isValidUsername = (username) => {
  const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_.]{4,30}$/;
  return username.toLowerCase() !== 'me' && regex.test(username);
};

/**
 * Allowed characters in the provided password:
 * * English letters and digits;
 * * Special characters including: `._!@#$%^&*()[]-+=`
 * <br>
 * The required password length is 8-30.
 * @param password
 */
exports.isValidPassword = (password) => {
  const regex = /^[a-zA-Z0-9._!@#$%^&*()\[\]\-+=]{8,30}$/;
  return regex.test(password);
}

exports.isValidEmail = (email) => {
  return validator.isEmail(email);
}
