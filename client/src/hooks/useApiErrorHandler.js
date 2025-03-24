import { AuthContext } from '@/contexts/AuthProvider';
import { App as AntdApp } from 'antd';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const useApiErrorHandler = () => {
  const { clearAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { message: antdMessage } = AntdApp.useApp();

  return useCallback((error, customHandler = undefined) => {
    const statusCode = error.response?.status;

    if (statusCode === 401) {
      if (error.config.url === '/auth/login') {
        void antdMessage.error('Wrong username or password');
      } else {
        clearAuth();
        navigate('/login');
        void antdMessage.info('Session expired. Please log in');
      }

    } else if (statusCode === 403 && error.response.data.type === 'ILLEGAL_USER') {
      // sign out the user if it's marked as inactive or removed
      // when its session has not expired
      clearAuth();
      void antdMessage.error('Illegal user. Signing out');
      navigate('/');

    } else {
      if (customHandler) {
        customHandler();
      } else {
        void antdMessage.error(error.message);
        console.error(error);
      }
    }
  }, [antdMessage, navigate, clearAuth]);
};

export default useApiErrorHandler;
