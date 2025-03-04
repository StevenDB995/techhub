exports.errorTypes = {
  ILLEGAL_USER: 'ILLEGAL_USER'
};

exports.dataResponse = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

exports.messageResponse = (res, statusCode, message, type) => {
  return res.status(statusCode).json({ message, type });
};
