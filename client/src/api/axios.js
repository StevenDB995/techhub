import axios from 'axios';

export function createAxios() {
  const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // send access token along with every request
  axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  // centralized error handler
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        const statusCode = error.response.status;

        if (statusCode === 403) {
          error.message = 'Permission denied';
        } else if (statusCode === 404) {
          error.message = 'Resource not found';
        } else if (statusCode >= 500) {
          error.message = 'Server error. Please try again later.';
        } else {
          error.message = error.response.data.message || error.message;
        }
      }

      // still throw the error for specific cases to handle
      return Promise.reject(error);
    });

  return axiosInstance;
}

const api = createAxios();

export default api;
