import api from '../api';

export const getBlogsByFilter = async (params) => {
  return await api.get('/blogs', { params });
}

export const getBlogById = async (id) => {
  return await api.get(`/blogs/${id}`);
}

export const createBlog = async (blog) => {
  return await api.post('/blogs', blog);
};

export const updateBlogById = async (id, blog) => {
  return await api.patch(`/blogs/${id}`, blog);
}
