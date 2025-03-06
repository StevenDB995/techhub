import api from '../api';

export const login = async (loginForm) => {
  return await api.post('/auth/login', loginForm);
};

export const logout = async () => {
  return await api.post('/auth/logout');
};
