import api from '@/api/api';

export const getImgurAccessToken = async () => {
  const response = await api.get('/imgur/token');
  const { data } = response.data;
  return data['access_token'];
};
