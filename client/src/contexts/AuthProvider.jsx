import { getCurrentUser } from '@/api/services/userService';
import { createContext, useCallback, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);

  const setAuth = useCallback((accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setIsAuthenticated(true);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser()
        .then(res => setUser(res.data))
        .catch(err => {
          if (err.response?.status === 401) {
            clearAuth();
          } else {
            console.error(err);
          }
        });
    }
  }, [isAuthenticated, clearAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
