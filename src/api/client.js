import api from './axiosClient';

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

export default api;
