import { getCurrentUser } from '@/api/services/userService';
import { createContext, useCallback, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);

  const setAuth = useCallback((accessToken, userData = undefined) => {
    localStorage.setItem('accessToken', accessToken);
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const reloadUser = useCallback((userData = undefined) => {
    if (userData) {
      setUser(userData);
    } else {
      getCurrentUser()
        .then(usr => setUser(usr))
        .catch(err => {
          if (err.response?.status === 401) {
            clearAuth();
          } else {
            console.error(err);
          }
        });
    }
  }, [clearAuth]);

  useEffect(() => {
    if (isAuthenticated && !user) {
      reloadUser();
    }
  }, [isAuthenticated, user, reloadUser]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuth, clearAuth, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
