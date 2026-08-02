import { createSlice } from '@reduxjs/toolkit';
import * as authApi from '../api/auth';

const loadUser = () => {
  try {
    const t = localStorage.getItem('accessToken');
    const u = localStorage.getItem('user');
    if (t && u) return { user: JSON.parse(u), accessToken: t, isAuthenticated: true };
  } catch (_) {}
  return { user: null, accessToken: null, isAuthenticated: false };
};

const initialState = {
  ...loadUser(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, { payload }) {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.isAuthenticated = true;
      if (payload.refreshToken) localStorage.setItem('refreshToken', payload.refreshToken);
      if (payload.accessToken) localStorage.setItem('accessToken', payload.accessToken);
      if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        localStorage.removeItem('wishlist');
        sessionStorage.clear();
        document.cookie.split(';').forEach((c) => {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/');
        });
      } catch (_) {}
    },
    setLoading(state, { payload }) {
      state.loading = payload ?? true;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, setLoading, setError, clearError } = authSlice.actions;

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  try {
    const data = await authApi.login({ email, password });
    dispatch(setCredentials({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }));
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || 'Login failed';
    dispatch(setError(msg));
    throw new Error(msg);
  } finally {
    dispatch(setLoading(false));
  }
};

export const registerUser = (payload) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  try {
    const data = await authApi.register(payload);
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
    dispatch(setError(msg));
    throw new Error(msg);
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await authApi.logout();
  } catch (_) {}
  dispatch(logout());
};

export default authSlice.reducer;
