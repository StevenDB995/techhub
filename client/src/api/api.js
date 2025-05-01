import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// send access token along with every request
api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// centralized error handler
api.interceptors.response.use(
  response => response,
  async error => {
    const statusCode = error.response?.status;
    const errorType = error.response?.data.type;
    const errorMessage = error.response?.data.message;

    if (statusCode === 401) {
      if (errorType === 'INVALID_CREDENTIALS' || errorType === 'SESSION_EXPIRED') {
        // propagate failed login and refresh token error
        error.message = errorMessage;
        return Promise.reject(error);
      }

      try {
        // request to refresh token
        const refreshResponse = await api.post('/auth/refresh-token');
        const { data: { accessToken } } = refreshResponse.data;
        // store the new access token
        localStorage.setItem('accessToken', accessToken);
        // retry the previous request
        // expect no further 401 error
        return api.request(error.config);

      } catch (refreshError) {
        refreshError.message = 'Session expired, please log in again.';
        return Promise.reject(refreshError);
      }

    } else if (statusCode === 403) {
      error.message = 'Permission denied';
    } else if (statusCode === 404) {
      error.message = 'Resource not found';
    } else if (statusCode >= 500) {
      error.message = 'Server error. Please try again later.';
    } else {
      error.message = errorMessage;
    }

    // still throw the error for specific cases to handle
    return Promise.reject(error);
  }
);

export default api;
