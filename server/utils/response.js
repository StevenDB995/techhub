exports.successResponse = (res, data, message = null, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

exports.errorResponse = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message
  });
};
