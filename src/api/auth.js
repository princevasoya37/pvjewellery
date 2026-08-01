import axiosClient from './axiosClient';

/**
 * Register a new user.
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.firstName
 * @param {string} payload.lastName
 * @returns {Promise<Object>} The response data.
 */
export async function register(payload) {
  const response = await axiosClient.post('/auth/register', payload);
  return response.data;
}

/**
 * Log in a user.
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 * @returns {Promise<Object>} The response data.
 */
export async function login(payload) {
  const response = await axiosClient.post('/auth/login', payload);
  return response.data;
}

/**
 * Refresh user session tokens.
 * @param {Object} payload
 * @param {string} payload.refreshToken
 * @returns {Promise<Object>} The response data.
 */
export async function refreshToken(payload) {
  const response = await axiosClient.post('/auth/refresh', payload);
  return response.data;
}

/**
 * Log out the user.
 * @returns {Promise<Object>} The response data.
 */
export async function logout() {
  const response = await axiosClient.post('/auth/logout');
  return response.data;
}

/**
 * Verify user email.
 * @param {Object} payload
 * @param {string} payload.token
 * @returns {Promise<Object>} The response data.
 */
export async function verifyEmail(payload) {
  const response = await axiosClient.post('/auth/verify-email', payload);
  return response.data;
}

/**
 * Request password reset link.
 * @param {Object} payload
 * @param {string} payload.email
 * @returns {Promise<Object>} The response data.
 */
export async function forgotPassword(payload) {
  const response = await axiosClient.post('/auth/forgot-password', payload);
  return response.data;
}

/**
 * Reset user password.
 * @param {Object} payload
 * @param {string} payload.token
 * @param {string} payload.newPassword
 * @returns {Promise<Object>} The response data.
 */
export async function resetPassword(payload) {
  const response = await axiosClient.post('/auth/reset-password', payload);
  return response.data;
}
