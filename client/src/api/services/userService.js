import api from '../api';

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  const { data: user } = response.data;
  return user;
};

export const updateCurrentUser = async (user) => {
  const response = await api.patch('/users/me', user);
  const { data: updatedUser } = response.data;
  return updatedUser;
};
