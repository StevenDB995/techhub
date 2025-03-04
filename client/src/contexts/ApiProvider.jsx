import * as err from 'antd';
import { App as AntdApp } from 'antd';
import { createContext, useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from './AuthProvider';

export const ApiContext = createContext(null);

function ApiProvider({ children }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { message: antdMessage } = AntdApp.useApp();

  const apiErrorHandler = useCallback((error, customHandler = null) => {
    const statusCode = error.response?.status;

    if (statusCode === 401) {
      if (error.config.url === '/auth/login') {
        void antdMessage.error('Wrong username or password');
      } else {
        logout();
        navigate('/login', { state: { from: location } });
        void antdMessage.info('Session expired. Please log in');
      }

    } else if (statusCode === 403 && error.response.data.type === 'ILLEGAL_USER') {
      // sign out the user if it's marked as inactive or removed
      // when its session has not expired
      logout();
      void antdMessage.error('Illegal user. Signing out');
      navigate('/');

    } else {
      if (customHandler) {
        customHandler();
      } else {
        void antdMessage.error(err.message);
        console.error(err);
      }
    }
  }, [antdMessage, location, navigate, logout]);

  return (
    <ApiContext.Provider value={{ api, apiErrorHandler }}>
      {children}
    </ApiContext.Provider>
  );
}

export default ApiProvider;
