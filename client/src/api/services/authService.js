import api from '../api';

export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};
