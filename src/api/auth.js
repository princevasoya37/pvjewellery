import api from './client';

export function register(payload) {
  return api.post('/auth/register', payload).then((res) => res.data);
}

export function login(email, password) {
  return api.post('/auth/login', { email, password }).then((res) => res.data);
}

export function refresh(refreshToken) {
  return api.post('/auth/refresh', { refreshToken }).then((res) => res.data);
}

export function logout() {
  return api.post('/auth/logout').then((res) => res.data);
}

export function getMe() {
  return api.get('/auth/me').then((res) => res.data);
}
