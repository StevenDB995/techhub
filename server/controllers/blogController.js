import mongoose from 'mongoose';
import { INVALID_TOKEN } from '../config/errorTypes.js';
import BlogImage from '../models/blogImageModel.js';
import Blog from '../models/blogModel.js';
import { errorResponse, successResponse } from '../utils/responseUtil.js';

// get all public blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog
      .find({ status: 'public' })
      .select('-content')
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    return successResponse(res, 200, blogs);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Error fetching blogs');
  }
};

export const getBlogById = async (req, res) => {
  const { id: blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId)
      .populate('author', 'username avatar isActive');

    if (!blog) {
      return errorResponse(res, 404, 'Blog not found');
    }

    // for public blog, no authorization required
    if (blog.status === 'public') {
      return successResponse(res, 200, blog);
    }

    // for non-public blog
    const currentUser = req.user;
    const author = blog.author;

    // if not authenticated (need to refresh token)
    if (!currentUser) {
      return errorResponse(res, 401, 'Invalid token', INVALID_TOKEN);
    }

    // if not the author of the blog
    if (!author._id.equals(currentUser._id)) {
      return errorResponse(res, 403, 'Permission denied');
    }

    // on successful authorization
    return successResponse(res, 200, blog);

  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Error fetching blog');
  }
};

export const createBlog = async (req, res) => {
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
    return successResponse(res, 201, savedBlog, 'Blog created successfully!');

  } catch (err) {
    await session.abortTransaction();

    if (err.name === 'ValidationError') {
      return errorResponse(res, 400, 'Bad request');
    }

    console.error(err);
    return errorResponse(res, 500, 'Error creating blog');

  } finally {
    await session.endSession();
  }
};

export const updateBlogById = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const blog = await Blog.findById(id).session(session);
    if (!blog) {
      return errorResponse(res, 404, 'Blog not found');
    }

    // Authorize
    if (!blog.author.equals(req.user._id)) {
      return errorResponse(res, 403, 'Permission denied');
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
    return successResponse(res, 200, updatedBlog, 'Blog updated successfully!');

  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return errorResponse(res, 500, 'Error updating blog');

  } finally {
    await session.endSession();
  }
};

export const deleteBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return errorResponse(res, 404, 'Blog not found');
    }

    // authorize
    if (!blog.author.equals(req.user._id)) {
      return errorResponse(res, 403, 'Permission denied');
    }

    blog.status = 'deleted';
    blog.deletedAt = Date.now();

    const deletedBlog = await blog.save({ timestamps: false });
    return successResponse(res, 200, deletedBlog);

  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Error deleting blog');
  }
};

export const createImageMetadata = async (req, res) => {
  try {
    const blogImage = new BlogImage(req.body);
    blogImage.isAttached = false;
    const savedBlogImage = await blogImage.save();
    return successResponse(res, 201, savedBlogImage, 'Blog image metadata saved successfully!');

  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Error saving image metadata');
  }
};
