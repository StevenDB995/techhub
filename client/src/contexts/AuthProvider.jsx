import { jwtDecode } from 'jwt-decode';
import { createContext, useCallback, useState } from 'react';

function decodeJwt(accessToken) {
  try {
    return jwtDecode(accessToken);
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return null;
  }
}

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [decodedJwt, setDecodedJwt] = useState(decodeJwt(localStorage.getItem('accessToken')));

  const login = useCallback((accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setIsAuthenticated(true);
    setDecodedJwt(decodeJwt(accessToken));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setDecodedJwt(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, decodedJwt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
