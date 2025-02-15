const Blog = require('../models/blogModel');
const BlogImage = require('../models/blogImageModel');
const { messageResponse, dataResponse } = require('../utils/response');
const axios = require('axios');

const { IMGUR_CLIENT_ID, IMGUR_CLIENT_SECRET, IMGUR_REFRESH_TOKEN, IMGUR_OAUTH_URL } = process.env;

// get all public blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog
      .find({ status: 'public' })
      .select('-content')
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    return dataResponse(res, 200, blogs);
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blogs');
  }
};

// for public view only
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate('author', 'username');

    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // authorize
    if (blog.status !== 'public') {
      return messageResponse(res, 403, 'Permission denied');
    }

    return dataResponse(res, 200, blog);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blog');
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blogModel = new Blog(req.body);
    blogModel.author = req.user;
    await blogModel.save();
    return messageResponse(res, 201, 'Blog created successfully!');
  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error creating blog');
  }
};

exports.updateBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // authorize
    if (!blog.author.equals(req.user)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };

    // update the createdAt field if the status of the blog changes from 'draft' to 'public'
    if (blog.status === 'draft' && req.body.status === 'public') {
      updateData.createdAt = Date.now();
    }

    await Blog.findByIdAndUpdate(id, updateData, { new: true });
    return messageResponse(res, 200, 'Blog updated successfully!');

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error updating blog');
  }
};

exports.deleteBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // authorize
    if (!blog.author.equals(req.user)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    await Blog.findByIdAndUpdate(id, {
      status: 'deleted',
      deletedAt: Date.now()
    }, { new: true });

    return messageResponse(res, 200, 'Blog deleted successfully!');

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error deleting blog');
  }
};

exports.getImgurAccessToken = async (req, res) => {
  try {
    const response = await axios.post(IMGUR_OAUTH_URL, new URLSearchParams({
      'refresh_token': IMGUR_REFRESH_TOKEN,
      'client_id': IMGUR_CLIENT_ID,
      'client_secret': IMGUR_CLIENT_SECRET,
      'grant_type': 'refresh_token'
    }));
    return dataResponse(res, 200, response.data);

  } catch (err) {
    // catch axios error
    console.error(err);
    return messageResponse(res, err.data.status, 'Error requesting Imgur access token');
  }
};

exports.createImageMetadata = async (req, res) => {
  try {
    await BlogImage.create(req.body);
    const message = 'Blog image metadata added successfully.';
    console.log(message);
    return messageResponse(res, 201, message);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error creating image metadata');
  }
};
