// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Fallback for dev
  withCredentials: true,
});

api.setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Fetch all blogs
const getAllBlogs = async () => {
  try {
    const response = await api.get('/blogs');
    return response;
  } catch (error) {
    throw new Error('Failed to fetch blogs');
  }
};

// Fetch a single blog by ID
const getBlogById = async (id) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch blog post');
  }
};

// Fetch comments by blog ID
const getCommentsByBlogId = async (blogId) => {
  try {
    const response = await api.get(`/blogs/${blogId}/comments`);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch comments');
  }
};

// Create a new comment
const createComment = async (blogId, commentData) => {
  try {
    const response = await api.post(`/blogs/${blogId}/comments`, commentData);
    return response;
  } catch (error) {
    throw new Error('Failed to submit comment');
  }
};

export { api, getAllBlogs, getBlogById, getCommentsByBlogId, createComment };