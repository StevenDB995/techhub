import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// send access token along with every request
api.interceptors.request.use((config) => {
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

    if (statusCode === 401) {
      if (error.config.url === '/auth/login' || error.config.url === '/auth/refresh-token') {
        // propagate failed login and refresh token error
        error.message = error.response.data.message;
        return Promise.reject(error);
      }

      try {
        // request to refresh token
        const refreshResponse = await api.post('/auth/refresh-token');
        // store the new access token
        localStorage.setItem('accessToken', refreshResponse.data.accessToken);
        // retry the previous request
        // expect no further 401 error
        return api.request(error.config);

      } catch (refreshError) {
        refreshError.message = 'Session expired';
        return Promise.reject(refreshError);
      }

    } else if (statusCode === 403) {
        error.message = 'Permission denied';
    } else if (statusCode === 404) {
      error.message = 'Resource not found';
    } else if (statusCode >= 500) {
      error.message = 'Server error. Please try again later.';
    } else {
      error.message = error.response.data.message || error.message;
    }

    // still throw the error for specific cases to handle
    return Promise.reject(error);
  }
);

export default api;
