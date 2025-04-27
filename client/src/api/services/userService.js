import api from '../api';

export const getCurrentUser = async () => {
  return await api.get('/users/me');
};

export const updateCurrentUser = async (user) => {
  return await api.patch('/users/me', user);
};
