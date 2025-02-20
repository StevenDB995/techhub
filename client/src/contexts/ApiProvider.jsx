import { App as AntdApp } from 'antd';
import axios from 'axios';
import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export const ApiContext = createContext(null);

function ApiProvider({ children }) {
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { message: antdMessage } = AntdApp.useApp();

  const createAxios = () => {
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
            return Promise.reject(error);
          }

          try {
            // request to refresh token
            const refreshResponse = await api.post('/auth/refresh-token');
            // store the new access token
            login(refreshResponse.data.accessToken);
            // retry the previous request
            // expect no further 401 error
            return api.request(error.config);

          } catch (refreshError) {
            refreshError.message = 'Session expired';
            logout();
            // navigate('/login', { state: { from: location } });
            antdMessage.info('Session expired. Please login');
            return Promise.reject(refreshError);
          }

        } else if (statusCode === 403) {
          if (error.response.data.type === 'ILLEGAL_USER') {
            // sign out the user if it's marked as inactive or removed
            // when its session has not expired
            logout();
            antdMessage.error('Illegal user. Signing out');
            navigate('/');
          } else {
            error.message = 'Permission denied';
          }

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

    return api;
  };

  const axiosInstance = useMemo(createAxios, [antdMessage, login, logout, navigate]);

  return (
    <ApiContext.Provider value={axiosInstance}>
      {children}
    </ApiContext.Provider>
  );
}

export default ApiProvider;
