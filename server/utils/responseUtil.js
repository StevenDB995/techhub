import { BAD_REQUEST, FORBIDDEN, SERVER_ERROR } from '../config/errorTypes.js';

export const successResponse = (res, statusCode, data, message = undefined) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

export const errorResponse = (res, statusCode = 500, message = 'Unexpected server error', type = undefined) => {
  if (!type) {
    if (statusCode === 400) {
      type = BAD_REQUEST;
    } else if (statusCode === 403) {
      type = FORBIDDEN;
    } else if (statusCode === 500) {
      type = SERVER_ERROR;
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
    type
  });
};
