import api from '../api';

export const isAuthenticated = async () => {
  return await api.get('/auth/isAuthenticated');
};

export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};
