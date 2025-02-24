import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // Enables cookies if authentication is required
});

export const fetchArticles = async (params) => {
  try {
    const response = await api.get('/articles', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Failed to fetch articles');
  }
};

export const trackArticleView = async (articleId) => {
  try {
    const response = await api.post(`/articles/${articleId}/view`);
    return response.data;
  } catch (error) {
    console.error('Error tracking article view:', error?.response?.data || error.message);
    return { success: false, message: 'Failed to track article view' };
  }
};

export const shareArticle = async (articleId, platform) => {
  try {
    const response = await api.post(`/articles/${articleId}/share`, { platform });
    return response.data;
  } catch (error) {
    console.error('Error tracking share:', error?.response?.data || error.message);
    return { success: false, message: 'Failed to share article' };
  }
};

export default api;
