import { App as AntdApp } from 'antd';
import axios from 'axios';
import { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import routes from '../routes';

const useAxios = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const { message: antdMessage } = AntdApp.useApp();

  const handle401 = (error) => {
    error.message = 'Unauthorized';
    if (!location.pathname.startsWith(routes.login)) {
      logout();
      // navigate(routes.login, { state: { from: location } });
      void antdMessage.info('Session expired. Please login');
    }
  };

  return useMemo(() => {
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const statusCode = error.response.status;

          if (statusCode === 401) {
            handle401(error);
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
      });

    return axiosInstance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAxios;
