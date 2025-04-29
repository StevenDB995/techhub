const Blog = require('../models/blogModel');
const BlogImage = require('../models/blogImageModel');
const { messageResponse, dataResponse } = require('../utils/responseUtil');
const mongoose = require('mongoose');

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

  try {
    const blog = await Blog.findById(blogId)
      .populate('author', 'username avatar isActive');

    if (!blog) {
      return messageResponse(res, 404, 'Blog not found');
    }

    // for public blog, no authorization required
    if (blog.status === 'public') {
      return dataResponse(res, 200, blog);
    }

    // for non-public blog
    const currentUser = req.user;
    const author = blog.author;

    // if not authenticated (need to refresh token)
    if (!currentUser) {
      return messageResponse(res, 401, 'Invalid token');
    }

    // if not the author of the blog
    if (!author._id.equals(currentUser._id)) {
      return messageResponse(res, 403, 'Permission denied');
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
    // save the reference of the user
    blog.author = req.user._id;
    const savedBlog = await blog.save({ session });

    await BlogImage.updateMany(
      { link: { $in: blog.imageLinks } },
      { $set: { isAttached: true } },
      { session }
    );

    await session.commitTransaction();
    return dataResponse(res, 201, savedBlog);

  } catch (err) {
    await session.abortTransaction();

    if (err.name === 'ValidationError') {
      return messageResponse(res, 400, 'Bad request');
    }

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

    // Authorize
    if (!blog.author.equals(req.user._id)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    // Compare the difference of image links
    const newSet = new Set(req.body.imageLinks);
    const imageLinksToRemove = blog.imageLinks.filter(x => !newSet.has(x));
    const imageLinksToAdd = req.body.imageLinks;

    // Update the createdAt field if the status of the blog changes from 'draft' to 'public'
    if (blog.status === 'draft' && req.body.status === 'public') {
      blog.createdAt = Date.now();
    }

    for (const key in req.body) {
      blog[key] = req.body[key];
    }

    const updatedBlog = await blog.save({ session });

    // Update isAttached for blogImages
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
    return dataResponse(res, 200, updatedBlog);

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
    if (!blog.author.equals(req.user._id)) {
      return messageResponse(res, 403, 'Permission denied');
    }

    blog.status = 'deleted';
    blog.deletedAt = Date.now();

    const deletedBlog = await blog.save({ timestamps: false });

    return dataResponse(res, 200, deletedBlog);

  } catch (err) {
    console.error(err);
    return messageResponse(res, 500, 'Error deleting blog');
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
