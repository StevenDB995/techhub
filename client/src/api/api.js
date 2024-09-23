import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 401) {
        error.message = 'Unauthorized';
      } else if (statusCode === 403) {
        error.message = 'Permission denied';
      } else if (statusCode === 404) {
        error.message = 'Resource not found';
      } else if (statusCode >= 500) {
        error.message = 'Server error. Please try again later.';
      } else {
        error.message = error.response.data.message;
      }
    }
    // still throw the error for specific cases to handle
    return Promise.reject(error);
  }
);

export default api;
