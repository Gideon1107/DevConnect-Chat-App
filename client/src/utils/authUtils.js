// Authentication utility functions for localStorage

// Store tokens in localStorage
export const storeTokens = (authToken, refreshToken) => {
  localStorage.setItem('authToken', authToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get refresh token from localStorage
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Remove tokens from localStorage
export const removeTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  // Consider user authenticated if either authToken or refreshToken exists
  return !!localStorage.getItem('authToken') || !!localStorage.getItem('refreshToken');
};

// Add auth headers to axios config
export const addAuthHeader = (config = {}) => {
  const authToken = getAuthToken();
  const refreshToken = getRefreshToken();

  if (!config.headers) {
    config.headers = {};
  }

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (refreshToken) {
    config.headers['x-refresh-token'] = refreshToken;
  }

  return config;
};
