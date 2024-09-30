exports.dataResponse = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

exports.messageResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};
