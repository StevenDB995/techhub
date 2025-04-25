import api from '../api';

export const createBlog = async (blog) => {
  return await api.post('/blogs', blog);
};

export const updateBlog = async (blogId, blog) => {
  return await api.put(`/blogs/${blogId}`, blog);
};

export const deleteBlog = async (blogId) => {
  return await api.delete(`/blogs/${blogId}`);
};

export const createImageMetadata = async (imageMetadata) => {
  return await api.post('blogs/images', imageMetadata);
};
