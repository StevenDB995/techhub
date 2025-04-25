import api from '@/api/api';

export const getImgurAccessToken = async () => {
  return await api.get('/imgur/token');
};
