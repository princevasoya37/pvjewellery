import axiosClient from './axiosClient';

/**
 * Get current user profile.
 * @returns {Promise<Object>} The response data.
 */
export async function getMe() {
  const response = await axiosClient.get('/users/me');
  return response.data;
}

/**
 * Update current user profile.
 * @param {Object} payload - Fields to update.
 * @returns {Promise<Object>} The response data.
 */
export async function updateMe(payload) {
  const response = await axiosClient.patch('/users/me', payload);
  return response.data;
}

/**
 * Get current user's addresses.
 * @returns {Promise<Object>} The response data.
 */
export async function getAddresses() {
  const response = await axiosClient.get('/users/me/addresses');
  return response.data;
}

/**
 * Add a new address for current user.
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function addAddress(payload) {
  const response = await axiosClient.post('/users/me/addresses', payload);
  return response.data;
}

/**
 * Update a user address.
 * @param {string|number} id - Address ID.
 * @param {Object} payload - Fields to update.
 * @returns {Promise<Object>} The response data.
 */
export async function updateAddress(id, payload) {
  const response = await axiosClient.patch(`/users/me/addresses/${id}`, payload);
  return response.data;
}

/**
 * Delete a user address.
 * @param {string|number} id - Address ID.
 * @returns {Promise<Object>} The response data.
 */
export async function deleteAddress(id) {
  const response = await axiosClient.delete(`/users/me/addresses/${id}`);
  return response.data;
}

/**
 * Get user wishlist.
 * @returns {Promise<Object>} The response data.
 */
export async function getWishlist() {
  const response = await axiosClient.get('/users/me/wishlist');
  return response.data;
}

/**
 * Toggle product in wishlist.
 * @param {string|number} productId
 * @returns {Promise<Object>} The response data.
 */
export async function toggleWishlist(productId) {
  const response = await axiosClient.post(`/users/me/wishlist/${productId}`);
  return response.data;
}
