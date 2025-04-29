import { AuthContext } from '@/contexts/AuthProvider';
import { App as AntdApp } from 'antd';
import { useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useApiErrorHandler = () => {
  const { clearAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { message: antdMessage } = AntdApp.useApp();

  return useCallback((error) => {
    const statusCode = error.response?.status;

    if (statusCode === 401) {
      if (error.config.url === '/auth/login') {
        void antdMessage.error('Wrong username or password');
      } else {
        clearAuth();
        navigate('/login', { state: { from: location } });
        void antdMessage.info('Session expired. Please log in');
      }

    } else if (statusCode === 403 && error.response.data.type === 'ILLEGAL_USER') {
      // sign out the user if it's marked as inactive or removed
      // when its session has not expired
      clearAuth();
      void antdMessage.error('Illegal user. Signing out');
      navigate('/');

    } else {
      void antdMessage.error('Unexpected error. Please try again later.');
      console.error(error);
    }
    // location is the only dependency that may change
  }, [location, navigate, antdMessage, clearAuth]);
};

export default useApiErrorHandler;
