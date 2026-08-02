import axios from 'axios';

// Get backend API base URL from process.env for Create React App or import.meta.env for Vite
const rawBaseURL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || '/api';
const baseURL = rawBaseURL.replace(/\/+$/, '');

/**
 * Configured Axios instance with request/response interceptors for auth.
 */
const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach bearer token and format multipart headers for FormData
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Delete Content-Type for FormData to let browser set it with boundaries
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token refresh on 401 responses
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest.url && (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh') ||
      originalRequest.url.includes('/auth/register') ||
      originalRequest.url.includes('/auth/verify-email') ||
      originalRequest.url.includes('/auth/forgot-password') ||
      originalRequest.url.includes('/auth/reset-password')
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) {
        try {
          // Use basic axios to avoid infinite intercepts
          const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: refresh });
          const newAccessToken = data.accessToken;
          
          localStorage.setItem('accessToken', newAccessToken);
          
          // Retry original request with new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // If refresh endpoint fails, log the user out
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth:logout'));
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // If there's no refresh token, log out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
