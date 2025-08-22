// Date formatting utilities
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// User utilities
export const isAdmin = (user) => {
  return user?.email === "admin@penorbit.com" || user?.role === "admin";
};

// API utilities
export const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Form validation utilities
export const validateEmail = (email) => {
  return email && email.includes('@');
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Text utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const generateInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// URL utilities
export const buildSearchUrl = (query, category) => {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category) params.set('category', category);
  return `/search?${params.toString()}`;
};

// Image utilities
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string' || url.length < 5) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
};

export const getValidImageUrl = (url, fallback = '/blogbannerimage.jpg') => {
  return isValidImageUrl(url) ? url : fallback;
};