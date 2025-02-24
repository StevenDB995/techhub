const Blog = require('../models/blogModel');
const BlogImage = require('../models/blogImageModel');
const { messageResponse, dataResponse } = require('../utils/response');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const mongoose = require('mongoose');
const { validateAccessToken } = require('../helpers/authHelper');

const {
  ACCESS_TOKEN_SECRET,
  IMGUR_CLIENT_ID,
  IMGUR_CLIENT_SECRET,
  IMGUR_REFRESH_TOKEN,
  IMGUR_OAUTH_URL
} = process.env;

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

exports.getBlogById = async (req, res) => {
  const { id: blogId } = req.params;
  const accessToken = req.header('Authorization')?.split(' ')[1];

  try {
    const blog = await Blog.findById(blogId).populate('author', 'username isActive');

    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // for public blog, no authorization required
    if (blog.status === 'public') {
      return dataResponse(res, 200, blog);
    }

    // for non-public blog
    const user = blog.author;
    let decoded = jwt.decode(accessToken);

    // if not the author of the blog
    if (!user._id.equals(decoded?.userId)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    // if the user is the author of the blog
    try {
      const jwtClaims = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      if (!validateAccessToken(res, jwtClaims, user)) {
        return;
      }
    } catch (jwtError) {
      return messageResponse(res, 401, 'Invalid token');
    }
    // on successful authorization
    return dataResponse(res, 200, blog);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error fetching blog');
  }
};

exports.createBlog = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const blog = new Blog(req.body);
    blog.author = req.user.id;
    await blog.save({ session });

    await BlogImage.updateMany(
      { link: { $in: blog.imageLinks } },
      { $set: { isAttached: true } },
      { session }
    );

    await session.commitTransaction();
    return dataResponse(res, 201, blog);

  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return messageResponse(res, 500, 'Error creating blog');

  } finally {
    await session.endSession();
  }
};

exports.updateBlogById = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const blog = await Blog.findById(id).session(session);
    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // authorize
    if (!blog.author.equals(req.user.id)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    const updatedBlog = {
      ...req.body,
      updatedAt: Date.now()
    };

    // update the createdAt field if the status of the blog changes from 'draft' to 'public'
    if (blog.status === 'draft' && req.body.status === 'public') {
      updatedBlog.createdAt = Date.now();
    }

    await Blog.findByIdAndUpdate(id, updatedBlog, { new: true }).session(session);

    // update isAttached for blogImages
    const newSet = new Set(updatedBlog.imageLinks);
    const imageLinksToRemove = blog.imageLinks.filter(x => !newSet.has(x));
    const imageLinksToAdd = updatedBlog.imageLinks;

    if (imageLinksToRemove.length > 0) {
      await BlogImage.updateMany(
        { link: { $in: imageLinksToRemove } },
        { $set: { isAttached: false } },
        { session }
      );
    }
    if (imageLinksToAdd.length > 0) {
      await BlogImage.updateMany(
        { link: { $in: imageLinksToAdd } },
        { $set: { isAttached: true } },
        { session }
      );
    }

    await session.commitTransaction();
    return messageResponse(res, 200, 'Blog updated successfully!');

  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return messageResponse(res, 500, 'Error updating blog');

  } finally {
    await session.endSession();
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
    if (!blog.author.equals(req.user.id)) {
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
    const blogImage = new BlogImage(req.body);
    blogImage.isAttached = false;
    await blogImage.save();
    const message = 'Blog image metadata added successfully.';
    console.log(message);
    return messageResponse(res, 201, message);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error creating image metadata');
  }
};
