import api from '../api';

export const createBlog = async (blog) => {
  const response = await api.post('/blogs', blog);
  const { data: savedBlog } = response.data;
  return savedBlog;
};

export const updateBlog = async (blogId, blog) => {
  const response = await api.put(`/blogs/${blogId}`, blog);
  const { data: updatedBlog } = response.data;
  return updatedBlog;
};

export const deleteBlog = async (blogId) => {
  const response = await api.delete(`/blogs/${blogId}`);
  const { data: deletedBlog } = response.data;
  return deletedBlog;
};

export const createImageMetadata = async (imageMetadata) => {
  const response = await api.post('blogs/images', imageMetadata);
  const { data: savedImageMetadata } = response.data;
  return savedImageMetadata;
};
