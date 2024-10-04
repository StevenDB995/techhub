import { App as AntdApp } from 'antd';
import { useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { createAxios } from '../api/axios';
import { AuthContext } from '../contexts/AuthProvider';
import routes from '../routes';

// create a custom axios hook to allow access to global context states

const useAxios = () => {
  const { login, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { message: antdMessage } = AntdApp.useApp();

  return useMemo(() => {
    const axiosInstance = createAxios();

    // interceptor designated for 401 response
    axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        if (error.response) {
          const statusCode = error.response.status;
          const responseBody = error.response.data;

          if (statusCode === 401) {
            if (location.pathname.startsWith(routes.login)) {
              // propagate failed login
              return Promise.reject(error);
            }

            try {
              // request to refresh token
              // use the common axios instance instead to prevent infinite loop of refresh requests
              const refreshResponse = await api.post('/auth/refresh-token');
              // store the new access token
              login(refreshResponse.data.accessToken);
              // retry the previous request
              // expect no further 401 error
              // use the common axios instance to handle other potential error status
              return api.request(error.config);

            } catch (refreshError) {
              refreshError.message = 'Session expired';
              logout();
              // navigate(routes.login, { state: { from: location } });
              antdMessage.info('Session expired. Please login');

              return Promise.reject(refreshError);
            }

          } else if (statusCode === 403 && responseBody.type === 'ILLEGAL_USER') {
            // sign out the user if it's marked as inactive or removed
            // when its session has not expired
            logout();
            antdMessage.error('Illegal user. signing out');
            navigate(routes.home);
          }
        }

        return Promise.reject(error);
      });

    return axiosInstance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAxios;
