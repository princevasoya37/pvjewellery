import axios from 'axios';

// In dev with proxy (package.json "proxy"), use /api so requests go to same origin and get proxied to backend
const API_BASE = process.env.REACT_APP_API_URL ?? (process.env.NODE_ENV === 'development' ? '/api' : 'http://127.0.0.1:5000/api');
const API_ORIGIN = process.env.REACT_APP_IMAGE_BASE_URL || (API_BASE ? API_BASE.replace(/\/api\/?$/, '') : '');

/** Use for product/upload images. Handles relative paths and full URLs; works with dev proxy. */
export function getImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  if (API_ORIGIN) return `${API_ORIGIN.replace(/\/$/, '')}${path}`;
  return path;
}

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Let browser set Content-Type (with boundary) for FormData so file upload works
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken: refresh });
          localStorage.setItem('accessToken', data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch (_) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.dispatchEvent(new Event('auth:logout'));
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
