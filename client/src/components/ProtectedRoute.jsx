import { App as AntdApp } from 'antd';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../api/services/authService';
import useFetch from '../hooks/useFetch';
import routes from '../routes';
import Loading from './Loading';

function ProtectedRoute() {
  const { loading, error, refetch } = useFetch(isAuthenticated);
  const location = useLocation();
  const { message: antdMessage } = AntdApp.useApp();

  useEffect(() => {
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Trigger the message outside the render phase
  useEffect(() => {
    if (error) {
      void antdMessage.info('Session expired. Please login');
    }
  }, [error, antdMessage]);

  if (loading) return <Loading />;

  return error ? <Navigate to={routes.login} replace /> : <Outlet />;
}

export default ProtectedRoute;
