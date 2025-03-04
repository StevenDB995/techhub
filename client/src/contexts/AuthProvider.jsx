import { createContext, useCallback, useEffect, useState } from 'react';
import api from '../config/api';

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);

  const login = useCallback((accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/me')
        .then(res => setUser(res.data))
        .catch(err => {
          if (err.response?.status === 401) {
            logout();
          } else {
            console.error(err);
          }
        });
    }
  }, [isAuthenticated, logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
