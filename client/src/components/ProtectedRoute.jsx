import { App as AntdApp } from 'antd';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import * as Auth from '../api/services/authService';
import routes from '../routes';
import Loading from './Loading';

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const { message: antdMessage } = AntdApp.useApp();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await Auth.isAuthenticated();
        setIsAuthenticated(true);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setIsAuthenticated(false);
        antdMessage.info('Session expired. Please login');
      }
      setLoading(false);
    };
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (loading) return <Loading />;

  return isAuthenticated ? <Outlet /> : <Navigate to={routes.login} replace />;
}

export default ProtectedRoute;
