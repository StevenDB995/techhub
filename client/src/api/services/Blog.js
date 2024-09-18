import api from '../api';

export const getAllBlogs = async () => {
  return await api.get('/blogs');
}

export const createBlog = async (blog) => {
  return await api.post('/blogs', blog);
};
