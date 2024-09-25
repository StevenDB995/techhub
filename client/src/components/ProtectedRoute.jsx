import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import routes from '../routes';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    isAuthenticated ?
      <Outlet /> :
      <Navigate to={routes.login} replace state={{ from: location }} />
  );
}

export default ProtectedRoute;
