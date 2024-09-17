import api from '../api';

export const createBlog = async (blog) => {
  return await api.post('/blogs', blog);
};
