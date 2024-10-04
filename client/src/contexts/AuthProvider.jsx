import { createContext, useEffect, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/me')
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  }, [isAuthenticated]);

  const login = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
