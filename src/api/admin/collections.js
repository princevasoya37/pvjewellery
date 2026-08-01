import axiosClient from '../axiosClient';

/**
 * Get collections list for administrator.
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminCollections() {
  const response = await axiosClient.get('/admin/collections');
  return response.data;
}

/**
 * Create a new collection.
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function createCollection(payload) {
  const response = await axiosClient.post('/admin/collections', payload);
  return response.data;
}

/**
 * Update an existing collection by ID.
 * @param {string|number} id
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function updateCollection(id, payload) {
  const response = await axiosClient.put(`/admin/collections/${id}`, payload);
  return response.data;
}

/**
 * Delete a collection by ID.
 * @param {string|number} id
 * @returns {Promise<Object>} The response data.
 */
export async function deleteCollection(id) {
  const response = await axiosClient.delete(`/admin/collections/${id}`);
  return response.data;
}
