import axios from 'axios';
import { getAuthToken, getRefreshToken, storeTokens } from './authUtils';

// Create an axios instance with default config
const axiosInstance = axios.create();

// Add a request interceptor to automatically add auth headers to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = getAuthToken();
    const refreshToken = getRefreshToken();

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (refreshToken) {
      config.headers['x-refresh-token'] = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refreshing
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if the server sent a new auth token
    const newAuthToken = response.headers['x-new-auth-token'];
    if (newAuthToken) {
      // Update the auth token in localStorage
      storeTokens(newAuthToken, getRefreshToken());
      console.log('Token refreshed automatically');
    }
    return response;
  },
  (error) => {
    // Check if error is due to an expired refresh token
    if (error.response && error.response.status === 401 &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.includes('Refresh token expired')) {
      // Clear tokens and redirect to login
      console.log('Refresh token expired, redirecting to login');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');

      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
